
create table profiles(
  id uuid primary key default gen_random_uuid(),
  email text,
  country text,
  english_level text,
  profession text,
  income integer,
  created_at timestamp default now()
);

create table job_alerts(
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  query text,
  country text,
  created_at timestamp default now()
);

create table consulates(
  id serial primary key,
  country text,
  city text,
  address text,
  lat double precision,
  lon double precision
);
