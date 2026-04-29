alter table profiles 
add column subject_stats jsonb default '{}'::jsonb,
add column unlocked_avatars jsonb default '["owl"]'::jsonb,
add column inventory jsonb default '{"hearts": 0, "freeze": 0}'::jsonb;
