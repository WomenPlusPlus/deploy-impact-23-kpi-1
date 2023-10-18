create
or replace view username_with_default_circle as
SELECT
  ku.user_name,
  ku.user_id,
  cu.circle_id
FROM
  public.kpi_user ku
  LEFT JOIN public.circle_user cu ON ku.user_id = cu.user_id
  AND cu.default_circle = TRUE;