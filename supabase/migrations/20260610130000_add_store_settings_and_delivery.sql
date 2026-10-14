-- Store settings (single row) for order notifications, editable from the admin dashboard.
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  notification_email text,
  whatsapp_number text,
  callmebot_api_key text,
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.store_settings enable row level security;

create policy "admins manage store settings"
  on public.store_settings
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger set_store_settings_updated
  before update on public.store_settings
  for each row execute function public.set_updated_at();

-- New payment method for prepaid bank transfers/deposits.
do $$
begin
  alter type public.payment_method add value if not exists 'bank_transfer';
exception
  when duplicate_object then null;
end $$;

-- Delivery method enum.
do $$
begin
  create type public.delivery_method as enum ('store_pickup', 'islandwide_delivery');
exception
  when duplicate_object then null;
end $$;

alter table public.orders
  add column if not exists delivery_method public.delivery_method not null default 'store_pickup';
alter table public.orders
  add column if not exists shipping_fee numeric(10, 2) not null default 0;
