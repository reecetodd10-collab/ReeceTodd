-- Push notification subscriptions for Web Push API
create table if not exists push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  keys_p256dh text not null,
  keys_auth text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookups by user
create index idx_push_subscriptions_user_id on push_subscriptions(user_id);

-- RLS policies
alter table push_subscriptions enable row level security;

create policy "Users can manage their own push subscriptions"
  on push_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role can access all (for cron/admin push sends)
create policy "Service role can access all push subscriptions"
  on push_subscriptions
  for all
  using (true)
  with check (true);
