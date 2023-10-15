CREATE TRIGGER trigger_check_kpi_values
BEFORE INSERT OR UPDATE ON kpi_values_history FOR EACH ROW EXECUTE FUNCTION check_kpi_value_unit();

CREATE TRIGGER trigger_default_circle_count
BEFORE INSERT OR UPDATE ON circle_user FOR EACH ROW EXECUTE FUNCTION check_default_circle_count();