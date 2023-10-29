## Database schema

The table containing the KPI values is `public.kpi_values_history`. It is actually a historical log of changes made to a
particular KPI and the latest (currently valid) values can be retrieved using
the `public.kpi_definitions_with_latest_values` view.

## Manual KPI and user management

Adding new KPI definition requires adding a new entry in `public.kpi_definition` table. KPI definitions can be used by
multiple circles, thus allowing a particular circle to start recording values for this KPI requires inserting a record
to `public.circle_kpi_definition`. End users can also propose new KPIs from the UI - doing so will create the required entries but in
order to be usable from the UI they need the flag `public.kpi_definition.is_approved` to be set to true.

Onboarding a new user requires creating his account in the Supabase dashboard and creating an entry in `public.kpi_user` that references the newly created row in `auth.users`. Assigning a user to a circle is done by adding a row in `public.circle_user`.

![Database schema](schema.png)
