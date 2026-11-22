# ExploringExpressjsForWebBackend

This is the next step of my backend learning. In my previous project ([ExploringNodejsForWebBackend](https://github.com/SMFaysalHaque/ExploringNodejsForWebBackend)) I built a server using only the raw `http` module to understand how things work underneath. Now in this one I moved to **Express.js** so I don't have to write all that low level stuff by hand, and I also connected a **real database** this time instead of a json file.

It started as a small users API (CRUD) stored in a PostgreSQL database. Since then I kept adding to it while I learn, so now it also has **password hashing**, a **login route with JWT**, and a **profile** resource that is linked to a user. I am using **Neon** for the database, which is a serverless Postgres you can use from the cloud, so I did not have to install Postgres on my own machine. The whole app connects to it using a connection string.

The biggest change from where I started is that the code is no longer all in one file. I split it into a **modular pattern** (route -> controller -> service) like I said I wanted to do in the Node project, so each module (users, profile, auth) has its own folder.

## What I learned from this

- How Express makes things easier than the plain `http` module (routing, `req.body`, `res.json` etc.)
- How to use middleware like `express.json()` to read the request body without doing it chunk by chunk myself
- How to connect to a real database (Postgres on Neon) using a connection string
- What a connection `Pool` is and why we use it instead of a single connection
- Writing actual SQL to create tables and do insert / select / update / delete
- Using parameterized queries (`$1, $2 ...`) instead of putting values directly in the query (so it is safe from SQL injection)
- How to split an app into **modules** with separate `route`, `controller` and `service` files so one file is not doing everything
- Hashing passwords with **bcrypt** before saving, and comparing them on login (so the real password is never stored)
- Doing **login** and giving back a **JWT** token with `jsonwebtoken`, and checking the user is active before letting them in
- Making a **relation** between two tables (a profile belongs to a user with a `user_id` foreign key and `ON DELETE CASCADE`)
- Keeping secrets like the database url and the jwt secret inside a `.env` file with `dotenv`
- Still using TypeScript with `tsx` like the last project

## Tech used

- Express.js (v5)
- TypeScript
- tsx (to run the ts file directly in dev)
- pg (node-postgres, to talk to the database)
- Neon (serverless PostgreSQL database)
- bcryptjs (to hash and compare passwords)
- jsonwebtoken (to make the login token)
- dotenv (to load the env variables)

## Folder structure

```
first-express-project/
  src/
    config/            -> load the .env file and export port, connection string, jwt secret
    db/                -> the pg Pool and initDB (creates the tables if they don't exist)
    app.ts             -> the express app, middleware and mounting all the routes
    server.ts          -> starts the db and makes the app listen on the port
    modules/
      users/           -> users CRUD
        user.route.ts
        user.controller.ts
        user.service.ts
        user.interface.ts
      profile/         -> profile linked to a user
        profile.route.ts
        profile.controller.ts
        profile.servce.ts
      auth/            -> login + jwt
        auth.route.ts
        auth.controller.ts
        auth.service.ts
```

Each module follows the same flow: the **route** says which url hits which function, the **controller** handles the request/response and the try-catch, and the **service** is the part that actually talks to the database.

## The database tables

When the server starts it runs a small `initDB` function that creates the tables if they do not exist already.

**users**

| Column | Type | Notes |
|--------------|---------------|------------------------------|
| id | SERIAL | primary key, auto increment |
| name | VARCHAR(255) | |
| email | VARCHAR(255) | unique, required |
| password | VARCHAR(255) | required, stored hashed |
| age | INT | |
| is_active | BOOLEAN | default `true` |
| created_at | TIMESTAMP | default `NOW()` |
| updated_at | TIMESTAMP | default `NOW()` |

**profile** (one profile per user)

| Column | Type | Notes |
|--------------|---------------|-----------------------------------------------|
| id | SERIAL | primary key, auto increment |
| user_id | INT | unique, references `users(id)`, cascade delete |
| bio | TEXT | |
| address | TEXT | |
| phone | VARCHAR(15) | |
| gender | VARCHAR(15) | |
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

Now make a `.env` file in the `first-express-project` folder and put your values in it:

```
PORT=8000
DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require"
JWT_SECRET="any_long_random_secret_string"
```

You get the `DATABASE_URL` from your Neon dashboard after you create a project and a database there. `JWT_SECRET` can be any random string you make up, it is used to sign the login token. Do not share the `.env` file with anyone because it has your password and secret inside (that is why it is in `.gitignore`).

Then run in dev mode:

```
npm run dev
```

If everything is fine you will see `Example app listening on port 8000` and `Database connected successfully!` in the terminal.

## API Endpoints

Base url is `http://localhost:8000`

**Users**

| Method | Endpoint | What it does |
|--------|---------------------|------------------------------|
| POST | `/api/v1/users` | create a new user (password gets hashed) |
| GET | `/api/v1/users` | get all users |
| GET | `/api/v1/users/:id` | get a single user by id |
| PUT | `/api/v1/users/:id` | update a user by id |
| DELETE | `/api/v1/users/:id` | delete a user by id |

**Profile**

| Method | Endpoint | What it does |
|--------|---------------------|------------------------------|
| POST | `/api/v1/profiles` | create a profile for an existing user |

**Auth**

| Method | Endpoint | What it does |
|--------|---------------------|------------------------------|
| POST | `/api/v1/auth/login` | login with email + password, get back a jwt token |

### Example body for POST user

```json
{
  "name": "Faysal",
  "email": "faysal@example.com",
  "password": "123456",
  "age": 22
}
```

The `id`, `created_at` and `updated_at` are handled by the database, so you don't need to send them. The password is hashed before it is saved, and it is removed from the response.

### Example body for PUT user

For update you can send only the fields you want to change. I used `COALESCE` in the SQL so if a field is not sent it keeps the old value.

```json
{
  "name": "Faysal Haque",
  "age": 23
}
```

### Example body for POST profile

The `user_id` has to be an id of a user that already exists, otherwise it throws an error.

```json
{
  "user_id": 1,
  "bio": "Learning backend",
  "address": "Dhaka",
  "phone": "01700000000",
  "gender": "male"
}
```

### Example body for login

```json
{
  "email": "faysal@example.com",
  "password": "123456"
}
```

If the email and password are correct and the user is active, it returns an `accessToken` (jwt) and the user.

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

**5. Delete a user**

- Method `DELETE`
- Url `http://localhost:8000/api/v1/users/1`
- Click `Send` and that user gets removed

**6. Create a profile**

- Method `POST`
- Url `http://localhost:8000/api/v1/profiles`
- Body -> `raw` -> `JSON`, send the profile example above with a real `user_id`

**7. Login**

- Method `POST`
- Url `http://localhost:8000/api/v1/auth/login`
- Body -> `raw` -> `JSON`, send the email and password
- Click `Send` and you get back the token

Tip: after doing POST or PUT, run the `GET /api/v1/users` again to see the changes.

## Note

This is still a learning project so there are things I already know I want to improve next:

- Right now the login token is created but nothing is **protected** by it yet. Next I want to add an auth middleware that checks the token before letting someone hit the routes.
- There is no real **validation** on the request body yet (like checking the email looks valid), so I want to add that (maybe with zod).
- The profile module only has a create route for now, I want to add get / update / delete for it too.
- I want to clean up the error handling into one place instead of a try-catch in every controller.

I am adding these as I keep learning, so the project grows a bit every time.
