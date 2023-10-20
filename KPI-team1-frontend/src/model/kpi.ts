enum KpiPeriodicity {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Quarterly = "quarterly",
  Yearly = "yearly",
}

export interface Kpi {
  kpi_id: number;
  kpi_name: string;
  description: string | null;
  periodicity: KpiPeriodicity;
  value_min: Number | null;
  value_max: Number | null;
  unit: string | null;
  created_at: string | null;
  updated_at: string | null;
}

//kpi_definition_with_latest_values
export interface KpiExtended extends Kpi {
  circle_kpidef_id: number;
  circle_id: number;
  circle_name: string;
  kpi_created_at: string | null;
  kpi_updated_at: string | null;
  latest_value: Number;
  latest_standardized_date: string;
  latest_user_id: string;
}

//kpi_values_period_standardized
export interface KpiValue {
  kpi_id: number;
  circle_id: number;
  kpi_value_history_id: number;
  user_id: number;
  value: number;
  period_date: string;
  action: string;
  created_at: string | null; //todo: should not be null. need to update db
  periodicity: KpiPeriodicity;
  standardized_date: string;
}

export interface KpiLogs extends KpiValue {
  user_name: string;
  user_circle_id: number;
  user_circle_name: string;
}
