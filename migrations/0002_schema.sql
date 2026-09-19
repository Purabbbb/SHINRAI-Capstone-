-- Shinrai civic reporting schema

create table if not exists profiles (
  user_id text primary key,
  role text not null default 'citizen',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists departments (
  id text primary key,
  name text not null,
  description text not null default ''
);

create table if not exists officers (
  id text primary key,
  name text not null,
  department_id text not null references departments(id),
  user_id text,
  status text not null default 'available'
);

create index if not exists officers_user_id_idx on officers (user_id);

create table if not exists sla_rules (
  urgency_level text primary key,
  hours integer not null
);

create table if not exists complaints (
  id text primary key,
  citizen_id text not null,
  title text not null,
  description text not null default '',
  category text not null default 'Other',
  urgency_score double precision not null default 0.4,
  urgency_level text not null default 'MEDIUM',
  department_id text references departments(id),
  officer_id text references officers(id),
  status text not null default 'submitted',
  lat double precision not null,
  lng double precision not null,
  address text not null default '',
  media jsonb not null default '[]'::jsonb,
  ai_analysis jsonb,
  parent_complaint_id text,
  duplicate_count integer not null default 1,
  sla_deadline timestamptz,
  sla_breached boolean not null default false,
  before_image text,
  after_image text,
  resolution_notes text,
  resolution_submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists complaints_citizen_idx on complaints (citizen_id);
create index if not exists complaints_status_idx on complaints (status);
create index if not exists complaints_dept_idx on complaints (department_id);
create index if not exists complaints_officer_idx on complaints (officer_id);
create index if not exists complaints_parent_idx on complaints (parent_complaint_id);

create table if not exists complaint_events (
  id serial primary key,
  complaint_id text not null references complaints(id) on delete cascade,
  event_type text not null,
  message text not null,
  actor_id text,
  created_at timestamptz not null default now()
);

create index if not exists complaint_events_complaint_idx on complaint_events (complaint_id);

create table if not exists notifications (
  id serial primary key,
  user_id text,
  audience text not null default 'user',
  title text not null,
  body text not null,
  is_read boolean not null default false,
  complaint_id text,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications (user_id);
create index if not exists notifications_audience_idx on notifications (audience);

create table if not exists accident_incidents (
  id serial primary key,
  camera_id text not null,
  location_label text not null,
  lat double precision not null,
  lng double precision not null,
  detection text not null,
  confidence double precision not null,
  alert_status text not null default 'open',
  prototype boolean not null default true,
  frame_data text,
  notes text,
  created_at timestamptz not null default now()
);
