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
  description: string;
  periodicity: KpiPeriodicity;
  value_min: Number;
  value_max: Number;
  unit: string;
  created_at: string;
  updated_at: string;
}

//kpi_definition_with_latest_values
export interface KpiExtended extends Kpi {
  circle_kpidef_id: number;
  circle_id: number;
  kpi_created_at: string;
  kpi_updated_at: string;
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
  created_at: string;
  periodicity: KpiPeriodicity;
  standardized_date: string;
}
