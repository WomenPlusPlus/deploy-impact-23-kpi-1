DROP VIEW IF EXISTS public.kpi_values_period_standardized;
CREATE VIEW 
public.kpi_values_period_standardized as
select *,
Case when target_value > 0 then ROUND(cumulative_value/target_value*100, 0) else null end as target_fulfilled
FROM
(
select distinct
  on (
    kd.kpi_id,
    standardized_date,
    t1.circle_id
  ) t1.kpi_value_history_id,
  t1.kpi_id,
  t1.circle_id,
  t1.user_id,
  t1.value,
  t1.period_date,
  t1.action,
  t1.created_at,
  kd.periodicity as kpi_periodicity,
  case
    when kd.periodicity = 'yearly'::periodicity then date_trunc(
      'year'::text,
      t1.period_date::timestamp with time zone
    ) + '1 year'::interval - '1 day'::interval
    when kd.periodicity = 'monthly'::periodicity then date_trunc(
      'month'::text,
      t1.period_date::timestamp with time zone
    ) + '1 mon'::interval - '1 day'::interval
    when kd.periodicity = 'quarterly'::periodicity then date_trunc(
      'quarter'::text,
      t1.period_date::timestamp with time zone
    ) + '3 mons'::interval - '1 day'::interval
    when kd.periodicity = 'weekly'::periodicity then date_trunc(
      'week'::text,
      t1.period_date::timestamp with time zone
    ) - '1 day'::interval + '7 days'::interval
    else t1.period_date::timestamp with time zone
  end as standardized_date,
  ku.user_name,
  t1.comment,
    case when kd.cumulative = false and kd.formula = 'aggregate' then sum(t1.value) over (partition by t1.kpi_id, t1.circle_id, EXTRACT(YEAR FROM t1.period_date) order by t1.period_date)
    when kd.cumulative = true and kd.formula = 'aggregate' then t1.value
    when kd.cumulative = false and kd.formula = 'average' then avg(t1.value) over (partition by t1.kpi_id, t1.circle_id, EXTRACT(YEAR FROM t1.period_date) order by t1.period_date)
    when kd.cumulative = true and kd.formula = 'average' then t1.value
    end as cumulative_value,
  case when kd.formula = 'aggregate' then 'area_graph'
  when kd.formula = 'average' and kd.unit in ('numeric', '%') then 'line_graph'
  when kd.formula = 'average' and kd.unit = 'boolean' then 'donut_graph'
  end as graph_type,
  tar.target_value,
  ck.is_active
from
  kpi_values_history t1
  join kpi_definition kd on t1.kpi_id = kd.kpi_id
  left join kpi_user ku on t1.user_id = ku.user_id
  left join target tar on tar.kpi_id = t1.kpi_id AND tar.circle_id = t1.circle_id
  left join circle_kpi_definition ck on t1.kpi_id = ck.kpi_id and t1.circle_id = ck.circle_id
order by
  kd.kpi_id,
  standardized_date desc,
  t1.circle_id,
  t1.created_at desc
) as sq;