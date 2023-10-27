CREATE OR REPLACE VIEW 
  public.kpi_definition_with_latest_values as
select
  ckd.circle_kpidef_id,
  ckd.circle_id,
  kd.kpi_id,
  kd.kpi_name,
  kd.description,
  kd.periodicity,
  kd.value_min,
  kd.value_max,
  kd.unit,
  kd.created_at as kpi_created_at,
  kd.updated_at as kpi_updated_at,
  kd.active,
  kd.is_approved,
  t1.latest_value,
  t1.latest_user_id,
  t1.latest_standardized_date,
  t1.cumulative_value,
  c.circle_name,
  t.target_id,
  t.target_value,
  t1.target_fulfilled,
  previous_value,
  case when t1.latest_value > 0 and previous_value > 0 then ((t1.latest_value-previous_value)/previous_value)*100
  else null end as percentage_change
from
  circle_kpi_definition ckd
  join kpi_definition kd
  on ckd.kpi_id = kd.kpi_id
  left join (
    select *
    from
    (
    select
      kpi_id,
      circle_id,
      standardized_date as latest_standardized_date,
      value as latest_value,
      user_id as latest_user_id,
      cumulative_value,
      target_fulfilled,
      rank() over(partition by kpi_id, circle_id order by standardized_date desc, created_at desc) as rank
    from
      kpi_values_period_standardized) sq
      where rank = 1) t1
  on ckd.kpi_id = t1.kpi_id
  join circle c
  on t1.circle_id = c.circle_id
  and ckd.circle_id = t1.circle_id
  left join target t
  on kd.kpi_id = t.kpi_id
  and ckd.circle_id = t.circle_id
  LEFT JOIN (
    SELECT kpi_id, circle_id, value as previous_value from(
      SELECT kpi_id, circle_id, rank () over (
      partition by kpi_id, circle_id
      order by standardized_date desc) as rank, standardized_date, value
      FROM kpi_values_period_standardized
    ) as ranked
      WHERE rank = 2
  ) as previous_period
  ON t1.kpi_id = previous_period.kpi_id and t1.circle_id = previous_period.circle_id
order by
kpi_id,
  ckd.circle_kpidef_id;

CREATE or REPLACE VIEW 
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

