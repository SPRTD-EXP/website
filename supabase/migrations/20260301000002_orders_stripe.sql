-- Add stripe_session_id to orders for idempotency / lookup
alter table orders add column if not exists stripe_session_id text unique;
