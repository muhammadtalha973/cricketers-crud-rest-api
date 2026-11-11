# Cricketers CRUD REST API

A database-connected REST API for managing cricketer records. The API supports Create, Read, Update, and Delete operations, exchanges data in JSON, and is designed to be tested with Postman.

## Entity

**Cricketer**

| Attribute     | Type    | Required | Description                                      |
|---------------|---------|----------|--------------------------------------------------|
| id            | string  | auto     | MongoDB ObjectId, returned as `id`               |
| name          | string  | yes      | Player name                                      |
| country       | string  | yes      | National team                                    |
| role          | string  | yes      | `Batsman`, `Bowler`, `All-rounder`, or `Wicket-keeper` |
| battingStyle  | string  | no       | For example `Right-hand` or `Left-hand`          |
| matches       | integer | no       | Number of matches (default `0`)                  |
| runs          | integer | no       | Career runs (default `0`)                        |

## Technologies

- Node.js
- Express.js
- MongoDB Atlas free cluster (M0) with Mongoose
- Postman for API testing

The assignment is demonstrated on this computer at `http://localhost:3000`. A public host such as Render is not required.

## How to run

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to the free Atlas cluster connection string (database name `cricketers_api`).
3. Install and start:

```bash
npm install
npm start
```

The server starts at `http://localhost:3000`.

Base URL:

```
http://localhost:3000/api/cricketers
```

The API stores records in the Atlas database `cricketers_api`, collection `cricketers`. On first connection to an empty collection, three sample players are inserted so you can test GET immediately.

View the same records in MongoDB Compass by connecting to that Atlas cluster and opening `cricketers_api` → `cricketers`.

## Endpoints

| Method | URL                       | Status (success) | Description              |
|--------|---------------------------|------------------|--------------------------|
| POST   | `/api/cricketers`         | 201 Created      | Add a cricketer          |
| GET    | `/api/cricketers`         | 200 OK           | List all cricketers      |
| GET    | `/api/cricketers/:id`     | 200 OK           | Get one cricketer        |
| PUT    | `/api/cricketers/:id`     | 200 OK           | Replace an existing record |
| DELETE | `/api/cricketers/:id`     | 200 OK           | Delete a cricketer       |

Error status codes:

- `400 Bad Request` — invalid JSON, missing fields, or invalid ID
- `404 Not Found` — no record for that ID, or unknown route
- `500 Internal Server Error` — unexpected server failure

### Create

`POST http://localhost:3000/api/cricketers`

```json
{
  "name": "Shaheen Afridi",
  "country": "Pakistan",
  "role": "Bowler",
  "battingStyle": "Left-hand",
  "matches": 53,
  "runs": 196
}
```

### Read all

`GET http://localhost:3000/api/cricketers`

### Read one

`GET http://localhost:3000/api/cricketers/<mongodb-id>`

Use the `id` returned by POST (a 24-character MongoDB ObjectId), not `1`.

### Update

`PUT http://localhost:3000/api/cricketers/<mongodb-id>`

```json
{
  "name": "Babar Azam",
  "country": "Pakistan",
  "role": "Batsman",
  "battingStyle": "Right-hand",
  "matches": 125,
  "runs": 5900
}
```

### Delete

`DELETE http://localhost:3000/api/cricketers/<mongodb-id>`

After deleting, GET for the same id should return `404 Not Found`.

## Postman

1. Open Postman.
2. Import `postman/Cricketers_API.postman_collection.json`.
3. Start the API with `npm start`.
4. Run the requests in order, or use **Run collection**.

## GitHub

https://github.com/muhammadtalha973/cricketers-crud-rest-api
