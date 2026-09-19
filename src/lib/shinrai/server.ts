import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { analyzeWithGrok, detectAccidentFromFrame, findDuplicates, prototypeAnalysis, slaDeadlineFrom } from "./ai";
import { DEPARTMENTS, OPEN_STATUSES } from "./constants";
import { COMPLAINT_SELECT, mapComplaint, mapEvent, type ComplaintRow } from "./db-map";
import { ensureSeeded, nextComplaintId } from "./seed";
import type { Category, ComplaintStatus, MediaItem, Role, UrgencyLevel } from "./types";

type Sql = Awaited<ReturnType<typeof getSql>>;

async function db() {
  const sql = await getSql();
  await ensureSeeded(sql);
  return sql;
}

async function getRole(sql: Sql, userId: string): Promise<Role> {
  const rows = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
  return (rows[0]?.role as Role) ?? "citizen";
}

async function ensureProfile(sql: Sql, userId: string, displayName?: string | null) {
  await sql`
    insert into profiles (user_id, role, display_name)
    values (${userId}, ${"citizen"}, ${displayName ?? null})
    on conflict (user_id) do nothing
  `;
  const role = await getRole(sql, userId);
  if (role === "officer") {
    const mine = await sql<{ id: string }>`select id from officers where user_id = ${userId} limit 1`;
    if (!mine[0]) {
      const free = await sql<{ id: string }>`select id from officers where user_id is null limit 1`;
      if (free[0]) {
        await sql`update officers set user_id = ${userId} where id = ${free[0].id}`;
      } else {
        const id = `off-${userId.slice(0, 8)}`;
        await sql`insert into officers (id, name, department_id, user_id) values (${id}, ${displayName || "Field Officer"}, ${"roads"}, ${userId}) on conflict (id) do update set user_id = ${userId}`;
      }
    }
  }
  return role;
}

async function notify(sql: Sql, opts: { userId?: string | null; audience: string; title: string; body: string; complaintId?: string | null }) {
  await sql`
    insert into notifications (user_id, audience, title, body, complaint_id)
    values (${opts.userId ?? null}, ${opts.audience}, ${opts.title}, ${opts.body}, ${opts.complaintId ?? null})
  `;
}

async function addEvent(sql: Sql, complaintId: string, eventType: string, message: string, actorId: string | null) {
  await sql`
    insert into complaint_events (complaint_id, event_type, message, actor_id)
    values (${complaintId}, ${eventType}, ${message}, ${actorId})
  `;
}

async function fetchComplaint(sql: Sql, id: string) {
  const rows = await sql.query<ComplaintRow>(
    `select ${COMPLAINT_SELECT} from complaints c
     left join departments d on d.id = c.department_id
     left join officers o on o.id = c.officer_id
     where c.id = $1`,
    [id],
  );
  return rows[0] ? mapComplaint(rows[0]) : null;
}

async function assertCanView(sql: Sql, userId: string, complaintId: string) {
  const role = await getRole(sql, userId);
  const c = await fetchComplaint(sql, complaintId);
  if (!c) return { role, complaint: null as null };
  if (role === "admin") return { role, complaint: c };
  if (role === "officer") {
    const off = await sql<{ id: string }>`select id from officers where user_id = ${userId}`;
    const ids = off.map((o) => o.id);
    if (c.officerId && ids.includes(c.officerId)) return { role, complaint: c };
    if (c.departmentId) {
      const dept = await sql<{ department_id: string }>`select department_id from officers where user_id = ${userId}`;
      if (dept.some((d) => d.department_id === c.departmentId)) return { role, complaint: c };
    }
  }
  if (c.citizenId === userId) return { role, complaint: c };
  // Citizens may view public city issues (no PII beyond what's on the card)
  if (role === "citizen") return { role, complaint: c };
  return { role, complaint: c };
}

export const bootstrapMe = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName?: string | null; role?: Role }) => input)
  .handler(async ({ context, data }) => {
    const sql = await db();
    await ensureProfile(sql, context.userId, data.displayName);
    if (data.role) {
      await sql`update profiles set role = ${data.role}, updated_at = now() where user_id = ${context.userId}`;
      if (data.role === "officer") await ensureProfile(sql, context.userId, data.displayName);
    }
    const role = await getRole(sql, context.userId);
    const unread = await sql<{ n: number }>`
      select count(*)::int as n from notifications
      where is_read = false and (
        user_id = ${context.userId}
        or (audience = 'admins' and ${role} = 'admin')
        or (audience = 'officers' and ${role} = 'officer')
        or (audience = 'citizens' and ${role} = 'citizen')
      )
    `;
    return { userId: context.userId, role, unread: unread[0]?.n ?? 0 };
  });

export const listDepartments = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  return sql<{ id: string; name: string; description: string }>`select id, name, description from departments order by name`;
});

export const listOfficers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    const role = await getRole(sql, context.userId);
    if (role !== "admin") throw new Error("Admin only");
    return sql<{ id: string; name: string; department_id: string; department_name: string; user_id: string | null; status: string }>`
      select o.id, o.name, o.department_id, d.name as department_name, o.user_id, o.status
      from officers o join departments d on d.id = o.department_id order by o.name
    `;
  });

export const getPublicPins = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  return sql<{
    id: string; title: string; category: Category; urgency_level: UrgencyLevel;
    status: ComplaintStatus; lat: number; lng: number; department_id: string | null; duplicate_count: number;
  }>`
    select id, title, category, urgency_level, status, lat, lng, department_id, duplicate_count
    from complaints where parent_complaint_id is null
  `;
});

export const listMyComplaints = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    const rows = await sql.query<ComplaintRow>(
      `select ${COMPLAINT_SELECT} from complaints c
       left join departments d on d.id = c.department_id
       left join officers o on o.id = c.officer_id
       where c.citizen_id = $1
       order by c.created_at desc`,
      [context.userId],
    );
    return rows.map(mapComplaint);
  });

export const listOfficerQueue = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    await ensureProfile(sql, context.userId);
    const role = await getRole(sql, context.userId);
    if (role !== "officer" && role !== "admin") throw new Error("Officer only");
    const mine = await sql<{ id: string; department_id: string }>`select id, department_id from officers where user_id = ${context.userId}`;
    const officerIds = new Set(mine.map((m) => m.id));
    const deptIds = new Set(mine.map((m) => m.department_id));
    const rows = await sql.query<ComplaintRow>(
      `select ${COMPLAINT_SELECT} from complaints c
       left join departments d on d.id = c.department_id
       left join officers o on o.id = c.officer_id
       where c.status <> 'resolved'
       order by c.urgency_score desc, c.created_at asc`,
    );
    const mapped = rows.map(mapComplaint);
    if (role === "admin") return mapped;
    return mapped.filter(
      (c) =>
        (c.officerId && officerIds.has(c.officerId)) ||
        (c.departmentId && deptIds.has(c.departmentId)) ||
        officerIds.size === 0,
    );
  });

export const listAdminComplaints = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    category?: string;
    urgency?: string;
    status?: string;
    departmentId?: string;
    sort?: "newest" | "oldest" | "urgency" | "sla";
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await db();
    if ((await getRole(sql, context.userId)) !== "admin") throw new Error("Admin only");
    const rows = await sql.query<ComplaintRow>(
      `select ${COMPLAINT_SELECT} from complaints c
       left join departments d on d.id = c.department_id
       left join officers o on o.id = c.officer_id
       where ($1 = '' or c.category = $1)
         and ($2 = '' or c.urgency_level = $2)
         and ($3 = '' or c.status = $3)
         and ($4 = '' or c.department_id = $4)
       order by
         case when $5 = 'oldest' then c.created_at end asc,
         case when $5 = 'urgency' then c.urgency_score end desc,
         case when $5 = 'sla' then c.sla_deadline end asc nulls last,
         c.created_at desc`,
      [data.category ?? "", data.urgency ?? "", data.status ?? "", data.departmentId ?? "", data.sort ?? "newest"],
    );
    return rows.map(mapComplaint);
  });

export const getComplaint = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await db();
    const { complaint } = await assertCanView(sql, context.userId, id);
    if (!complaint) return null;
    const events = await sql.query<{
      id: number; complaint_id: string; event_type: string; message: string; actor_id: string | null; created_at: string | Date;
    }>(`select * from complaint_events where complaint_id = $1 order by created_at asc`, [id]);
    const dups = await sql.query<ComplaintRow>(
      `select ${COMPLAINT_SELECT} from complaints c
       left join departments d on d.id = c.department_id
       left join officers o on o.id = c.officer_id
       where c.parent_complaint_id = $1 or (c.id = $2 and c.parent_complaint_id is not null)`,
      [complaint.parentComplaintId ?? id, complaint.parentComplaintId ?? ""],
    );
    return { complaint, events: events.map(mapEvent), linked: dups.map(mapComplaint) };
  });

export const createComplaint = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    title: string;
    description: string;
    category?: Category | "";
    lat: number;
    lng: number;
    address: string;
    media: MediaItem[];
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await db();
    await ensureProfile(sql, context.userId);
    const id = await nextComplaintId(sql);
    const title = data.title.trim();
    const description = data.description.trim();
    if (!title) throw new Error("Title is required");
    await sql.query(
      `insert into complaints (
        id, citizen_id, title, description, category, status, lat, lng, address, media
      ) values ($1,$2,$3,$4,$5,'submitted',$6,$7,$8,$9::jsonb)`,
      [
        id,
        context.userId,
        title,
        description,
        data.category || "Other",
        data.lat,
        data.lng,
        data.address || "Faridabad",
        JSON.stringify(data.media ?? []),
      ],
    );
    await addEvent(sql, id, "submitted", "Complaint submitted by citizen.", context.userId);
    await notify(sql, {
      userId: context.userId,
      audience: "user",
      title: `Complaint ${id} received`,
      body: "Your report is in the queue. AI analysis is next.",
      complaintId: id,
    });
    return { id };
  });

export const analyzeComplaint = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; attachTo?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const current = await fetchComplaint(sql, data.id);
    if (!current) throw new Error("Complaint not found");
    if (current.citizenId !== context.userId && (await getRole(sql, context.userId)) !== "admin") {
      throw new Error("Not allowed");
    }

    const open = await sql<{
      id: string; title: string; description: string; lat: number; lng: number; status: ComplaintStatus; category: Category;
    }>`
      select id, title, description, lat, lng, status, category from complaints
      where id <> ${data.id} and parent_complaint_id is null and status <> 'resolved'
    `;
    const duplicates = findDuplicates({
      title: current.title,
      description: current.description,
      lat: current.lat,
      lng: current.lng,
      candidates: open,
    });

    if (data.attachTo) {
      const parent = await fetchComplaint(sql, data.attachTo);
      if (!parent) throw new Error("Parent complaint not found");
      await sql`
        update complaints set parent_complaint_id = ${parent.id}, status = 'ai_analyzed', updated_at = now()
        where id = ${data.id}
      `;
      await sql`update complaints set duplicate_count = duplicate_count + 1, updated_at = now() where id = ${parent.id}`;
      await addEvent(sql, data.id, "merged", `Linked as duplicate of ${parent.id}.`, context.userId);
      await addEvent(sql, parent.id, "upvote", "Another citizen confirmed this issue.", context.userId);
      await notify(sql, {
        userId: context.userId,
        audience: "user",
        title: `Added to ${parent.id}`,
        body: "Your report was merged with an existing nearby complaint. The upvote count increased.",
        complaintId: parent.id,
      });
      return { complaint: await fetchComplaint(sql, parent.id), duplicates, mergedInto: parent.id };
    }

    const grok = await analyzeWithGrok({
      title: current.title,
      description: current.description,
      similarCount: duplicates.length,
    });
    const analysis = grok ?? prototypeAnalysis(current.title, current.description, duplicates.length);
    const deadline = slaDeadlineFrom(analysis.priority).toISOString();
    const category = current.category !== "Other" ? current.category : analysis.issueType;
    await sql.query(
      `update complaints set
        category = $2, urgency_score = $3, urgency_level = $4, department_id = $5,
        status = 'assigned', ai_analysis = $6::jsonb, sla_deadline = $7, updated_at = now()
       where id = $1`,
      [data.id, category, analysis.urgencyScore, analysis.priority, analysis.departmentId, JSON.stringify({ ...analysis, similarReports: duplicates.length }), deadline],
    );
    await addEvent(sql, data.id, "ai_analyzed", `${analysis.source === "grok" ? "Grok" : "Prototype classifier"}: ${analysis.issueType} · ${analysis.priority}.`, "system");
    await addEvent(sql, data.id, "assigned", `Routed to ${analysis.departmentName}.`, "system");
    await notify(sql, {
      userId: context.userId,
      audience: "user",
      title: `Complaint ${data.id} assigned`,
      body: `Assigned to ${analysis.departmentName}. Priority ${analysis.priority}.`,
      complaintId: data.id,
    });
    await notify(sql, {
      audience: "admins",
      title: "New complaint routed",
      body: `${data.id} · ${analysis.issueType} · ${analysis.priority} → ${analysis.departmentName}`,
      complaintId: data.id,
    });
    await notify(sql, {
      audience: "officers",
      title: "Queue updated",
      body: `${data.id} needs ${analysis.departmentName}.`,
      complaintId: data.id,
    });
    return { complaint: await fetchComplaint(sql, data.id), duplicates, mergedInto: null as string | null };
  });

export const upvoteComplaint = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await db();
    await sql`update complaints set duplicate_count = duplicate_count + 1, updated_at = now() where id = ${id}`;
    await addEvent(sql, id, "upvote", "Citizen confirmed this issue.", context.userId);
    return fetchComplaint(sql, id);
  });

export const patchComplaint = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id: string;
    action:
      | "assign_department"
      | "assign_officer"
      | "change_priority"
      | "change_status"
      | "escalate"
      | "accept"
      | "start"
      | "save_before"
      | "submit_resolution"
      | "verify"
      | "reject_resolution";
    departmentId?: string;
    officerId?: string;
    priority?: UrgencyLevel;
    status?: ComplaintStatus;
    image?: string;
    notes?: string;
    afterImage?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const role = await getRole(sql, context.userId);
    const c = await fetchComplaint(sql, data.id);
    if (!c) throw new Error("Not found");

    const isAdmin = role === "admin";
    const off = await sql<{ id: string }>`select id from officers where user_id = ${context.userId}`;
    const isOfficer = role === "officer" && (off.some((o) => o.id === c.officerId) || isAdmin || role === "officer");

    const touch = async () => sql`update complaints set updated_at = now() where id = ${data.id}`;

    switch (data.action) {
      case "assign_department": {
        if (!isAdmin) throw new Error("Admin only");
        await sql`update complaints set department_id = ${data.departmentId ?? null}, status = ${"assigned"}, updated_at = now() where id = ${data.id}`;
        const name = DEPARTMENTS.find((d) => d.id === data.departmentId)?.name ?? "department";
        await addEvent(sql, data.id, "assigned", `Admin assigned ${name}.`, context.userId);
        break;
      }
      case "assign_officer": {
        if (!isAdmin) throw new Error("Admin only");
        await sql`update complaints set officer_id = ${data.officerId ?? null}, status = ${"assigned"}, updated_at = now() where id = ${data.id}`;
        await addEvent(sql, data.id, "assigned", `Officer assigned.`, context.userId);
        await notify(sql, { audience: "officers", title: `${data.id} assigned`, body: "A complaint was assigned to the field team.", complaintId: data.id });
        break;
      }
      case "change_priority": {
        if (!isAdmin || !data.priority) throw new Error("Admin only");
        const deadline = slaDeadlineFrom(data.priority).toISOString();
        const score = data.priority === "HIGH" ? 0.82 : data.priority === "MEDIUM" ? 0.55 : 0.3;
        await sql`update complaints set urgency_level = ${data.priority}, urgency_score = ${score}, sla_deadline = ${deadline}, sla_breached = false, updated_at = now() where id = ${data.id}`;
        await addEvent(sql, data.id, "priority", `Priority changed to ${data.priority}.`, context.userId);
        break;
      }
      case "change_status": {
        if (!isAdmin || !data.status) throw new Error("Admin only");
        if (data.status === "resolved") throw new Error("Use verification to resolve.");
        await sql`update complaints set status = ${data.status}, updated_at = now() where id = ${data.id}`;
        await addEvent(sql, data.id, data.status, `Status set to ${data.status}.`, context.userId);
        break;
      }
      case "escalate": {
        if (!isAdmin && !isOfficer) throw new Error("Not allowed");
        const deadline = slaDeadlineFrom("HIGH").toISOString();
        await sql`update complaints set urgency_level = ${"HIGH"}, urgency_score = ${0.9}, sla_deadline = ${deadline}, sla_breached = false, updated_at = now() where id = ${data.id}`;
        await addEvent(sql, data.id, "escalated", "Complaint escalated. SLA reset to HIGH (4 hours).", context.userId);
        await notify(sql, { audience: "admins", title: `${data.id} escalated`, body: "SLA reset to HIGH.", complaintId: data.id });
        break;
      }
      case "accept": {
        if (!isOfficer && !isAdmin) throw new Error("Officer only");
        let officerId = c.officerId;
        if (!officerId) {
          const mine = off[0] ?? (await sql<{ id: string }>`select id from officers where user_id = ${context.userId}`)[0];
          officerId = mine?.id ?? c.officerId;
          await sql`update complaints set officer_id = ${officerId}, status = ${"officer_accepted"}, updated_at = now() where id = ${data.id}`;
        } else {
          await sql`update complaints set status = ${"officer_accepted"}, updated_at = now() where id = ${data.id}`;
        }
        await addEvent(sql, data.id, "officer_accepted", "Officer accepted the task.", context.userId);
        await notify(sql, { userId: c.citizenId, audience: "user", title: `${data.id} accepted`, body: "An officer has accepted your complaint.", complaintId: data.id });
        break;
      }
      case "start": {
        if (!isOfficer && !isAdmin) throw new Error("Officer only");
        await sql`update complaints set status = ${"in_progress"}, updated_at = now() where id = ${data.id}`;
        await addEvent(sql, data.id, "in_progress", "Work started on site.", context.userId);
        await notify(sql, { userId: c.citizenId, audience: "user", title: `Work started on ${data.id}`, body: "The field team has started work on your complaint.", complaintId: data.id });
        break;
      }
      case "save_before": {
        if (!isOfficer && !isAdmin) throw new Error("Officer only");
        await sql`update complaints set before_image = ${data.image ?? null}, updated_at = now() where id = ${data.id}`;
        await addEvent(sql, data.id, "evidence", "Before photo uploaded.", context.userId);
        break;
      }
      case "submit_resolution": {
        if (!isOfficer && !isAdmin) throw new Error("Officer only");
        if (!data.image && !c.beforeImage) throw new Error("Before image required");
        if (!data.afterImage) throw new Error("After image required");
        await sql`
          update complaints set
            before_image = coalesce(${data.image ?? null}, before_image),
            after_image = ${data.afterImage},
            resolution_notes = ${data.notes ?? ""},
            resolution_submitted_at = now(),
            status = ${"verification_pending"},
            updated_at = now()
          where id = ${data.id}
        `;
        await addEvent(sql, data.id, "resolution_submitted", "Resolution submitted with before/after evidence.", context.userId);
        await notify(sql, { userId: c.citizenId, audience: "user", title: `${data.id} awaiting verification`, body: "Your complaint resolution is awaiting admin verification.", complaintId: data.id });
        await notify(sql, { audience: "admins", title: "Verification needed", body: `${data.id} has before/after evidence ready.`, complaintId: data.id });
        break;
      }
      case "verify": {
        if (!isAdmin) throw new Error("Admin only");
        await sql`update complaints set status = ${"resolved"}, resolved_at = now(), updated_at = now() where id = ${data.id}`;
        await addEvent(sql, data.id, "resolved", "Admin verified the before/after evidence. Complaint closed.", context.userId);
        await notify(sql, { userId: c.citizenId, audience: "user", title: `${data.id} resolved`, body: "Your complaint was verified and closed.", complaintId: data.id });
        break;
      }
      case "reject_resolution": {
        if (!isAdmin) throw new Error("Admin only");
        await sql`update complaints set status = ${"in_progress"}, updated_at = now() where id = ${data.id}`;
        await addEvent(sql, data.id, "rejected", data.notes || "Resolution rejected. More work required.", context.userId);
        await notify(sql, { audience: "officers", title: `${data.id} resolution rejected`, body: data.notes || "Please resubmit with clearer evidence.", complaintId: data.id });
        break;
      }
    }
    await touch();
    return fetchComplaint(sql, data.id);
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    const role = await getRole(sql, context.userId);
    const rows = await sql<{
      id: number; title: string; body: string; is_read: boolean; complaint_id: string | null; created_at: string | Date;
    }>`
      select id, title, body, is_read, complaint_id, created_at
      from notifications
      where user_id = ${context.userId}
         or (audience = 'admins' and ${role} = 'admin')
         or (audience = 'officers' and ${role} = 'officer')
         or (audience = 'citizens' and ${role} = 'citizen')
      order by created_at desc
      limit 40
    `;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      body: r.body,
      isRead: r.is_read,
      complaintId: r.complaint_id,
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    }));
  });

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    const sql = await db();
    await sql`update notifications set is_read = true where id = ${id}`;
    return { ok: true };
  });

export const analyticsOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    if ((await getRole(sql, context.userId)) !== "admin") throw new Error("Admin only");
    const total = await sql<{ n: number }>`select count(*)::int as n from complaints where parent_complaint_id is null`;
    const open = await sql<{ n: number }>`select count(*)::int as n from complaints where parent_complaint_id is null and status <> 'resolved'`;
    const resolved = await sql<{ n: number }>`select count(*)::int as n from complaints where status = 'resolved'`;
    const high = await sql<{ n: number }>`select count(*)::int as n from complaints where urgency_level = 'HIGH' and status <> 'resolved'`;
    const breached = await sql<{ n: number }>`
      select count(*)::int as n from complaints
      where parent_complaint_id is null and status <> 'resolved'
        and sla_deadline is not null and sla_deadline < now()
    `;
    const avg = await sql<{ hours: number | null }>`
      select avg(extract(epoch from (resolved_at - created_at)) / 3600.0) as hours
      from complaints where resolved_at is not null
    `;
    const openN = open[0]?.n ?? 0;
    const breachedN = breached[0]?.n ?? 0;
    const slaCompliance = openN + (resolved[0]?.n ?? 0) === 0 ? 100 : Math.round((1 - breachedN / Math.max(1, (total[0]?.n ?? 1))) * 100);
    return {
      total: total[0]?.n ?? 0,
      open: openN,
      resolved: resolved[0]?.n ?? 0,
      highPriority: high[0]?.n ?? 0,
      slaCompliance,
      avgResolutionHours: avg[0]?.hours != null ? Math.round(Number(avg[0].hours) * 10) / 10 : null,
      slaBreached: breachedN,
    };
  });

export const analyticsBreakdown = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { days?: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await db();
    if ((await getRole(sql, context.userId)) !== "admin") throw new Error("Admin only");
    const days = data.days ?? 90;
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const byCategory = await sql<{ name: string; value: number }>`
      select category as name, count(*)::int as value from complaints
      where parent_complaint_id is null and created_at >= ${since}
      group by category order by value desc
    `;
    const byDepartment = await sql<{ name: string; value: number }>`
      select coalesce(d.name, 'Unassigned') as name, count(*)::int as value
      from complaints c left join departments d on d.id = c.department_id
      where c.parent_complaint_id is null and c.created_at >= ${since}
      group by d.name order by value desc
    `;
    const byUrgency = await sql<{ name: string; value: number }>`
      select urgency_level as name, count(*)::int as value from complaints
      where parent_complaint_id is null and created_at >= ${since}
      group by urgency_level
    `;
    const byStatus = await sql<{ name: string; value: number }>`
      select status as name, count(*)::int as value from complaints
      where parent_complaint_id is null and created_at >= ${since}
      group by status
    `;
    const trends = await sql<{ day: string; count: number }>`
      select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*)::int as count
      from complaints
      where parent_complaint_id is null and created_at >= ${since}
      group by 1 order by 1
    `;
    const heatmap = await sql<{ lat: number; lng: number; weight: number; category: string }>`
      select lat, lng, duplicate_count::int as weight, category from complaints
      where parent_complaint_id is null
    `;
    return { byCategory, byDepartment, byUrgency, byStatus, trends, heatmap };
  });

export const analyzeCctv = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { cameraId: string; locationLabel: string; lat: number; lng: number; frameData?: string | null; hint?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await db();
    if ((await getRole(sql, context.userId)) !== "admin") throw new Error("Admin only");
    const result = await detectAccidentFromFrame(data.frameData ?? null, `${data.hint ?? ""} ${data.locationLabel} ${data.cameraId}`);
    const inserted = await sql<{ id: number }>`
      insert into accident_incidents (camera_id, location_label, lat, lng, detection, confidence, alert_status, prototype, frame_data, notes)
      values (${data.cameraId}, ${data.locationLabel}, ${data.lat}, ${data.lng}, ${result.label}, ${result.confidence}, ${result.detected ? "open" : "cleared"}, ${true}, ${data.frameData ?? null}, ${result.notes})
      returning id
    `;
    if (result.detected) {
      await notify(sql, {
        audience: "admins",
        title: "New accident detected near " + data.locationLabel,
        body: `${result.label} · confidence ${result.confidence} · ${data.cameraId} (prototype detection)`,
      });
      await notify(sql, {
        audience: "officers",
        title: "Incident alert",
        body: `${result.label} at ${data.locationLabel}. Prototype CCTV module.`,
      });
    }
    return { id: inserted[0]?.id, ...result };
  });

export const listIncidents = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    if ((await getRole(sql, context.userId)) !== "admin") throw new Error("Admin only");
    const rows = await sql<{
      id: number; camera_id: string; location_label: string; lat: number; lng: number;
      detection: string; confidence: number; alert_status: string; prototype: boolean;
      frame_data: string | null; notes: string | null; created_at: string | Date;
    }>`select * from accident_incidents order by created_at desc limit 20`;
    return rows.map((r) => ({
      id: r.id,
      cameraId: r.camera_id,
      locationLabel: r.location_label,
      lat: Number(r.lat),
      lng: Number(r.lng),
      detection: r.detection,
      confidence: Number(r.confidence),
      alertStatus: r.alert_status,
      prototype: r.prototype,
      frameData: r.frame_data,
      notes: r.notes,
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    }));
  });

export const citizenStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    const mine = await sql<{ status: string }>`select status from complaints where citizen_id = ${context.userId}`;
    const total = mine.length;
    const open = mine.filter((m) => OPEN_STATUSES.includes(m.status as ComplaintStatus)).length;
    const resolved = mine.filter((m) => m.status === "resolved").length;
    return { total, open, resolved, pending: open };
  });

export { OPEN_STATUSES };
