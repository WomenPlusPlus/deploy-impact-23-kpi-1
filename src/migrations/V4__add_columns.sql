CREATE type formula as enum ('average', 'aggregate');

ALTER TABLE public.kpi_definition
ADD active boolean not null default true,
ADD cumulative boolean not null default false,
ADD formula formula not null default 'aggregate';

ALTER TABLE public.kpi_definition
ALTER COLUMN active DROP DEFAULT,
ALTER COLUMN cumulative DROP DEFAULT,
ALTER COLUMN formula DROP DEFAULT;

ALTER TABLE public.kpi_values_history
ADD comment varchar(255);

ALTER TABLE public.circle_user
ADD default_circle boolean not null default false;