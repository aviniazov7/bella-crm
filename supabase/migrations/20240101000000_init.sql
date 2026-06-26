-- Enable UUID extension
create extension if not exists "uuid-ossp";

create table if not exists public.clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text,
  email text,
  birthdate date,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  client_name text,
  service_type text,
  date date not null,
  time text,
  duration integer default 60,
  price numeric(10,2),
  status text default 'scheduled',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  amount numeric(10,2) not null,
  date date not null,
  method text,
  status text default 'paid',
  appointment_id uuid references public.appointments(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.photos (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  before_url text,
  after_url text,
  date date not null default now(),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.reminders (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  message text not null,
  send_at timestamptz not null,
  sent boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.payments enable row level security;
alter table public.photos enable row level security;
alter table public.reminders enable row level security;

create policy "allow_auth_clients" on public.clients for all to authenticated using (true) with check (true);
create policy "allow_auth_appointments" on public.appointments for all to authenticated using (true) with check (true);
create policy "allow_auth_payments" on public.payments for all to authenticated using (true) with check (true);
create policy "allow_auth_photos" on public.photos for all to authenticated using (true) with check (true);
create policy "allow_auth_reminders" on public.reminders for all to authenticated using (true) with check (true);
