-- INSERT some dummy data
-- Enum options:
-- periodicity ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');
-- unit ('%', 'boolean', 'numeric');
-- role ('admin', 'user');
-- action ('CREATE', 'UPDATE', 'DELETE');

insert into
  public.circle (circle_name)
values
  ('Child Protection'),
  ('Education and Counseling'),
  ('Fundraising and Donations'),
  ('Youth Empowerment'),
  ('HR'),
  ('Community Engagement'),
  ('Operational Efficiency');

insert into
  public.kpi_definition (
    kpi_name,
    periodicity,
    description,
    value_min,
    value_max,
    unit
  )
values
  (
    'Number of counseling sessions',
    'weekly',
    'Total counseling sessions held in a period.',
    0,
    null,
    'numeric'
  ),
  (
    'Active volunteers',
    'monthly',
    'Number of active volunteers for Pro Juventute.',
    0,
    null,
    'numeric'
  ),
  (
    'Workshops conducted',
    'monthly',
    'Total number of workshops conducted.',
    0,
    null,
    'numeric'
  ),
  (
    'Funds raised',
    'monthly',
    'Total funds raised in a period.',
    0,
    null,
    'numeric'
  ),
  (
    'Children reached',
    'monthly',
    'Number of children reached through programs.',
    0,
    null,
    'numeric'
  ),
  (
    'Digital literacy programs',
    'monthly',
    'Number of digital literacy programs conducted.',
    0,
    null,
    'numeric'
  ),
  (
    'Community events',
    'monthly',
    'Number of community events organized.',
    0,
    null,
    'numeric'
  ),
  (
    'Feedback received',
    'monthly',
    'Number of feedback entries received from beneficiaries.',
    0,
    null,
    'numeric'
  ),
  (
    'Outreach programs',
    'monthly',
    'Total outreach programs conducted.',
    0,
    null,
    'numeric'
  ),
  (
    'Online safety workshops',
    'monthly',
    'Number of online safety workshops held.',
    0,
    null,
    'numeric'
  ),
  (
    'Partnerships formed',
    'monthly',
    'Number of new partnerships or collaborations.',
    0,
    null,
    'numeric'
  ),
  (
    'Awareness campaigns',
    'monthly',
    'Total awareness campaigns conducted.',
    0,
    null,
    'numeric'
  ),
  (
    'Share short term leave',
    'monthly',
    null,
    0,
    100,
    '%'
  ),
  (
    'Additional monetization/savings from CRM',
    'quarterly',
    null,
    0,
    null,
    'numeric'
  );
insert into
  public.circle_kpi_definition (circle_id, kpi_id)
values
  (1, 5),
  (1, 10),
  (2, 1),
  (3, 4),
  (3, 12),
  (3, 14),
  (4, 3),
  (4, 6),
  (4, 8),
  (5, 9),
  (5, 11),
  (5, 13),
  (6, 2),
  (6, 7),
  (7, 8);
insert into
  public.target (kpi_id, target_value, unit, timeframe)
values
  (1, 1000, 'numeric', '2023-12-31'),
  (13, 75, '%', '2023-06-30'),
  (2, 5000, 'numeric', '2023-12-31'),
  (3, 1500, 'numeric', '2023-12-31'),
  (5, 85, '%', '2023-06-30'),
  (4, 60000, 'numeric', '2023-12-30'),
  (7, 1200, 'numeric', '2023-09-30'),
  (6, 2000, 'numeric', '2023-12-30'),
  (8, 500, 'numeric', '2023-12-30'),
  (13, 90, '%', '2023-09-30'),
  (9, 250, 'numeric', '2023-12-30'),
  (10, 40, 'numeric', '2023-12-30'),
  (11, 250, 'numeric', '2023-12-30'),
  (12, 500, 'numeric', '2023-12-30'),
  (13, 95, '%', '2023-12-31'),
  (14, 750000, 'numeric', '2023-12-30');