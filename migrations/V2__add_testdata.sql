-- INSERT some dummy data
-- Enum options:
-- periodicity ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');
-- unit ('%', 'boolean', 'numeric');
-- role ('admin', 'user');
-- action ('CREATE', 'UPDATE', 'DELETE');

insert into
  public.kpi_user (user_id, user_name, role)
values
  (
    '6ab40640-8ff6-4363-a2f5-5691df9b8821',
    'Barb Dwyer',
    'user'
  ),
  (
    '09a05096-4efd-4937-93e9-1174b7395e92',
    'Claire Voyant',
    'user'
  ),
  (
    '050b514d-9c76-42b0-b995-7e1bbef08c7b',
    'Anne Chovie',
    'user'
  ),
  (
    '2eca1eb1-2876-4625-ab7b-ce5342343f08',
    'Will Power',
    'user'
  ),
  (
    'b92cb471-1eb2-4715-97dd-85fe48e9a286',
    'Ella Vator',
    'user'
  ),
  (
    'fcdf7c92-51c7-411e-a7fd-b3facd95a26c',
    'Justin Time',
    'user'
  ),
  (
    '88cc6842-565c-4b60-96f6-56c30ca640e4',
    'Terry Aki',
    'user'
  );
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
  public.circle_user (circle_id, user_id)
values
  (1, '6ab40640-8ff6-4363-a2f5-5691df9b8821'),
  (2, '09a05096-4efd-4937-93e9-1174b7395e92'),
  (3, '050b514d-9c76-42b0-b995-7e1bbef08c7b'),
  (4, '2eca1eb1-2876-4625-ab7b-ce5342343f08'),
  (5, 'b92cb471-1eb2-4715-97dd-85fe48e9a286'),
  (6, 'fcdf7c92-51c7-411e-a7fd-b3facd95a26c'),
  (7, '88cc6842-565c-4b60-96f6-56c30ca640e4');
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
  public.kpi_values_history (
    kpi_id,
    circle_id,
    user_id,
    value,
    period_date,
    action,
    created_at
  )
values
  (
    5,
    1,
    '6ab40640-8ff6-4363-a2f5-5691df9b8821',
    900,
    '2023-10-01',
    'CREATE',
    current_timestamp
  ),
  (
    10,
    1,
    '6ab40640-8ff6-4363-a2f5-5691df9b8821',
    67,
    '2023-10-11',
    'CREATE',
    current_timestamp
  ),
  (
    1,
    2,
    '09a05096-4efd-4937-93e9-1174b7395e92',
    80,
    '2023-10-02',
    'CREATE',
    current_timestamp
  ),
  (
    4,
    3,
    '050b514d-9c76-42b0-b995-7e1bbef08c7b',
    4500,
    '2023-10-03',
    'CREATE',
    current_timestamp
  ),
  (
    12,
    3,
    '050b514d-9c76-42b0-b995-7e1bbef08c7b',
    48,
    '2023-10-28',
    'CREATE',
    current_timestamp
  ),
  (
    14,
    3,
    '050b514d-9c76-42b0-b995-7e1bbef08c7b',
    56000,
    '2023-10-28',
    'CREATE',
    current_timestamp
  ),
  (
    3,
    4,
    '2eca1eb1-2876-4625-ab7b-ce5342343f08',
    1200,
    '2023-10-04',
    'CREATE',
    current_timestamp
  ),
  (
    6,
    4,
    '2eca1eb1-2876-4625-ab7b-ce5342343f08',
    125,
    '2023-10-04',
    'CREATE',
    current_timestamp
  ),
  (
    8,
    4,
    '2eca1eb1-2876-4625-ab7b-ce5342343f08',
    1675,
    '2023-10-04',
    'CREATE',
    current_timestamp
  ),
  (
    11,
    5,
    'b92cb471-1eb2-4715-97dd-85fe48e9a286',
    56,
    '2023-10-17',
    'CREATE',
    current_timestamp
  ),
  (
    11,
    5,
    'b92cb471-1eb2-4715-97dd-85fe48e9a286',
    57,
    '2023-10-17',
    'UPDATE',
    current_timestamp
  ),
  (
    13,
    5,
    'b92cb471-1eb2-4715-97dd-85fe48e9a286',
    65,
    '2023-10-17',
    'CREATE',
    current_timestamp
  ),
  (
    9,
    5,
    'b92cb471-1eb2-4715-97dd-85fe48e9a286',
    69,
    '2023-10-05',
    'CREATE',
    current_timestamp
  ),
  (
    2,
    6,
    'fcdf7c92-51c7-411e-a7fd-b3facd95a26c',
    3000,
    '2023-10-06',
    'CREATE',
    current_timestamp
  ),
 (
    7,
    6,
    'fcdf7c92-51c7-411e-a7fd-b3facd95a26c',
    16,
    '2023-10-08',
    'CREATE',
    current_timestamp
  ),
  (
    8,
    7,
    'fcdf7c92-51c7-411e-a7fd-b3facd95a26c',
    306,
    '2023-10-06',
    'CREATE',
    current_timestamp
  );
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