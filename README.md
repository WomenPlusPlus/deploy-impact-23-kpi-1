# KPI Monitor

## Objectives:

The main goal of this application is to provide [Pro Juventute](https://www.projuventute.ch) members an easy and
standardized way to collect and visualize KPIs.

## Setup:

### 1. Prerequisites:

- [Docker](https://www.docker.com/get-started/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### 2. Run locally:

1. run [local Supabase instance](https://supabase.com/docs/guides/self-hosting/docker)

```shell
cd ~/dev # or another location where you want to store the Supabase repository
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
docker compose pull
docker compose up -d
grep 'ANON_KEY=' .env | awk -F'=' '{print $2}' # this is the key required to connect the webapp to the backend
```

- add a user who will be used for accessing the app:
    - go to http://localhost:8000/project/default/auth/users
    - click "Add user" > "Create user"
    - enter email and password (save them for later use)

2. run database migrations:

```shell
docker run --rm --network supabase_default --volume $(pwd)/migrations:/flyway/sql:ro flyway/flyway:latest -url="jdbc:postgresql://supabase-db:5432/postgres" -user="postgres" -password="your-super-secret-a
nd-long-postgres-password" migrate

```

3. run webapp

```shell
cd KPI-team1-frontend
touch .env.local
echo "VITE_PUBLIC_SUPABASE_URL=http://localhost:8000" | tee -a .env.local
echo "VITE_PUBLIC_SUPABASE_ANON_KEY=<<ANON_KEY_FROM_POINT_1>>" | tee -a .env.local
npm run dev
```

- open localhost:3000 in you browser
- you should now be able to log in using the user created previously in the Supabase UI

### 3. Considerations for production deployment

The application is deployed in a [test environment](https://deploy-impact-23-kpi-1.vercel.app/). Should you want to use 
it, please contact one of the KPI 1 team members for credentials.

The project heavily relies on Supabase. The deployment could be done using a self-hosted Supabase instance, which should
be [secured](https://supabase.com/docs/guides/self-hosting/docker#securing-your-services). An alternative approach is to
create a Supabase account. Current GitHub setup allows applying the database migrations automatically:
- go to https://github.com/WomenPlusPlus/deploy-impact-23-kpi-1/settings/secrets/actions
- setup two secrets: SUPABASE_DB_HOST and SUPABASE_PASS - those are the credentials to the Postgres database

The frontend application uses [Vite](https://vitejs.dev/guide/build.html) which allows
different [deployment](https://vitejs.dev/guide/static-deploy.html) options out of the box.

### 4. Tools used:
- [Supabase](https://supabase.com/)
- [React](https://react.dev/)
- [Flyway](https://flywaydb.org/)
- [Flowbite](https://flowbite.com/)
- [Material UI](https://mui.com/)
- [Vite](https://vitejs.dev/)

### 5. Documentation
- the general architecture of the project is described [here](/docs/arch.md)
- the database schema and instructions for management of the application by the Gatekeeper is [here](/docs/db.md)

