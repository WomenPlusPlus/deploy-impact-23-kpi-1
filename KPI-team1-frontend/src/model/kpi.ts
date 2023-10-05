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
  value_min: string;
  value_max: string;
  unit: string;
  created_at: string;
  updated_at: string;
}

//extended kpi interface
export interface KpiExtended extends Kpi {
  last_value: string;
  last_period_year: string;
  last_period_month: string;
  last_action: string;
  last_created_at: string;
}
