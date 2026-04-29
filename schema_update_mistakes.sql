alter table profiles 
add column mistakes jsonb default '[]'::jsonb;
