ALTER TABLE "public"."circle" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "circle_authenticated" ON "public"."circle";
CREATE POLICY "circle_authenticated" ON "public"."circle" AS PERMISSIVE FOR ALL TO authenticated USING (true);

ALTER TABLE "public"."circle_kpi_definition" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "circle_kpi_definition_authenticated" ON "public"."circle_kpi_definition";
CREATE POLICY "circle_kpi_definition_authenticated" ON "public"."circle_kpi_definition" AS PERMISSIVE FOR ALL TO authenticated USING (true);

ALTER TABLE "public"."circle_user" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "circle_user_authenticated" ON "public"."circle_user";
CREATE POLICY "circle_user_authenticated" ON "public"."circle_user" AS PERMISSIVE FOR ALL TO authenticated USING (true);

ALTER TABLE "public"."kpi_definition" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kpi_definition_authenticated" ON "public"."kpi_definition";
CREATE POLICY "kpi_definition_authenticated" ON "public"."kpi_definition" AS PERMISSIVE FOR ALL TO authenticated USING (true);

ALTER TABLE "public"."kpi_user" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kpi_user_authenticated" ON "public"."kpi_user";
CREATE POLICY "kpi_user_authenticated" ON "public"."kpi_user" AS PERMISSIVE FOR ALL TO authenticated USING (true);

ALTER TABLE "public"."kpi_values_history" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kpi_values_history_authenticated" ON "public"."kpi_values_history";
CREATE POLICY "kpi_values_history_authenticated" ON "public"."kpi_values_history" AS PERMISSIVE FOR ALL TO authenticated USING (true);

ALTER TABLE "public"."target" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "target_authenticated" ON "public"."target";
CREATE POLICY "target_authenticated" ON "public"."target" AS PERMISSIVE FOR ALL TO authenticated USING (true);

REVOKE ALL PRIVILEGES ON TABLE "public"."flyway_schema_history" from anon;
REVOKE ALL PRIVILEGES ON TABLE "public"."flyway_schema_history" from authenticated;
REVOKE ALL PRIVILEGES ON TABLE "public"."flyway_schema_history" from service_role;