-- Custom email verification tokens sent via Resend (instead of Supabase's mailer).
-- The token is generated and hashed server-side; only the SHA-256 hash is stored.
create table if not exists public.email_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_verification_tokens_email_idx
  on public.email_verification_tokens (email);

create index if not exists email_verification_tokens_user_idx
  on public.email_verification_tokens (user_id);

-- Only the service role (used by server functions) may touch this table.
alter table public.email_verification_tokens enable row level security;
