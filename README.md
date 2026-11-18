# ExploringExpressjsForWebBackend

This is the next step of my backend learning. In my previous project ([ExploringNodejsForWebBackend](https://github.com/SMFaysalHaque/ExploringNodejsForWebBackend)) I built a server using only the raw `http` module to understand how things work underneath. Now in this one I moved to **Express.js** so I don't have to write all that low level stuff by hand, and I also connected a **real database** this time instead of a json file.

Basically it is a small users API (CRUD) where the data is stored in a PostgreSQL database. I am using **Neon** for the database, which is a serverless Postgres you can use from the cloud, so I did not have to install Postgres on my own machine. The whole app connects to it using a connection string.

## What I learned from this

- How Express makes things easier than the plain `http` module (routing, `req.body`, `res.json` etc.)
- How to use middleware like `express.json()` to read the request body without doing it chunk by chunk myself
- How to connect to a real database (Postgres on Neon) using a connection string
- What a connection `Pool` is and why we use it instead of a single connection
- Writing actual SQL to create a table and do insert / select / update
- Using parameterized queries (`$1, $2 ...`) instead of putting values directly in the query (so it is safe from SQL injection)
- Keeping secrets like the database url inside a `.env` file with `dotenv`
- Still using TypeScript with `tsx` like the last project

## Tech used

- Express.js (v5)
- TypeScript
- tsx (to run the ts file directly in dev)
- pg (node-postgres, to talk to the database)
- Neon (serverless PostgreSQL database)
- dotenv (to load the database connection string)

## Folder structure

```
first-express-project/
  src/
    config/        -> load the env file and export port + connection string
    server.ts      -> express app, db pool, table creation and all the routes
```

It is a small project so right now most of the logic lives in `server.ts`. Later I want to split it into routes, controllers and services like I did in the Node project.

## The database table

When the server starts it runs a small `initDB` function that creates the `users` table if it does not exist already:

| Column | Type | Notes |
|--------------|---------------|------------------------------|
| id | SERIAL | primary key, auto increment |
| name | VARCHAR(255) | |
| email | VARCHAR(255) | unique, required |
| password | VARCHAR(255) | required |
| age | INT | |
| is_active | BOOLEAN | default `true` |
| created_at | TIMESTAMP | default `NOW()` |
| updated_at | TIMESTAMP | default `NOW()` |

## How to run

First clone the project from github:

```
git clone https://github.com/SMFaysalHaque/ExploringExpressjsForWebBackend.git
```

Go inside the project folder:

```
cd ExploringExpressjsForWebBackend/first-express-project
```

Install the packages:

```
npm install
```

Now make a `.env` file in the `first-express-project` folder and put your Neon connection string in it:

```
CREDENTIAL="postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require"
```

You get this connection string from your Neon dashboard after you create a project and a database there. Do not share it with anyone because it has your password inside.

Then run in dev mode:

```
npm run dev
```

If everything is fine you will see `Example app listening on port 8000` and `Database connected successfully!` in the terminal.

## API Endpoints

Base url is `http://localhost:8000`

| Method | Endpoint | What it does |
|--------|---------------------|------------------------------|
| POST | `/api/v1/users` | create a new user |
| GET | `/api/v1/users` | get all users |
| GET | `/api/v1/users/:id` | get a single user by id |
| PUT | `/api/v1/users/:id` | update a user by id |

> DELETE is not done yet, I will add it later.

### Example body for POST

```json
{
  "name": "Faysal",
  "email": "faysal@example.com",
  "password": "123456",
  "age": 22
}
```

The `id`, `created_at` and `updated_at` are handled by the database, so you don't need to send them.

### Example body for PUT

For update you can send only the fields you want to change. I used `COALESCE` in the SQL so if a field is not sent it keeps the old value.

```json
{
  "name": "Faysal Haque",
  "age": 23
}
```

## How to test with Postman

This project has no frontend, so I use Postman to hit the api. Make sure the server is running first (`npm run dev`), then open Postman and try the endpoints.

**1. Create a new user**

- Method `POST`
- Url `http://localhost:8000/api/v1/users`
- Go to the `Body` tab, select `raw`, and from the dropdown choose `JSON`
- Put a user object like the POST example above
- Click `Send` and the new user comes back with its own id

**2. Get all users**

- Method `GET`
- Url `http://localhost:8000/api/v1/users`
- Click `Send` and you get back all the users

**3. Get a single user**

- Method `GET`
- Url `http://localhost:8000/api/v1/users/1` (here 1 is the id)
- Click `Send` and it returns that one user

**4. Update a user**

- Method `PUT`
- Url `http://localhost:8000/api/v1/users/1` (1 is the id you want to update)
- Same as POST, go to `Body` -> `raw` -> `JSON` and send only the fields you want to change
- Click `Send` and that user gets updated

Tip: after doing POST or PUT, run the `GET /api/v1/users` again to see the changes.

## Note

This is only a learning project so there are things I already know can be improved. The password is stored as plain text (should be hashed later), there is no real validation yet, and all the routes are inside one file. I kept it simple on purpose so I can first understand how Express talks to a database. I will clean these things up as I keep learning.
