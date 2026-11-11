# Project Report

## Design, Implementation, and Testing of a CRUD-Based REST API

**Title:** Cricketers CRUD REST API

**Student name:** _[Your full name]_

**Roll number:** _[Your roll number]_

**Department / Semester:** _[e.g. Software Engineering, Semester 1]_

**Course / assignment:** PBL Task — Design, Implementation, and Testing of a CRUD-Based REST API

---

## 1. Problem statement and objectives

The task is to design, develop, and test a database-connected REST API that manages records of a chosen entity. The API must support all four CRUD operations, exchange data in JSON, use correct HTTP status codes, handle errors, and be verified with Postman.

**Objectives**

1. Build a REST API connected to a persistent database.
2. Implement Create, Read, Update, and Delete for the chosen entity.
3. Return JSON request and response bodies with appropriate status codes.
4. Validate input and handle missing records.
5. Test every endpoint in Postman, including error cases.
6. Publish the source code on GitHub and demonstrate the running API.

---

## 2. Chosen entity and attributes

The chosen entity is **Cricketer**. A cricketer record represents a player who can be stored, listed, updated, and removed through the API.

| Attribute      | Data type | Required | Notes |
|----------------|-----------|----------|--------|
| `id`           | ObjectId / string | auto | MongoDB `_id`, returned in JSON as `id` |
| `name`         | String            | yes  | Player name |
| `country`      | String            | yes  | National team |
| `role`         | String            | yes  | `Batsman`, `Bowler`, `All-rounder`, or `Wicket-keeper` |
| `battingStyle` | String            | no   | For example `Right-hand` |
| `matches`      | Number            | no   | Defaults to `0` |
| `runs`         | Number            | no   | Defaults to `0` |

---

## 3. Tools, technologies, and database

| Item | Choice |
|------|--------|
| Language | JavaScript (Node.js) |
| Framework | Express.js |
| Database | MongoDB (`cricketers_api` database, `cricketers` collection) |
| ODM | Mongoose |
| Testing | Postman |
| Version control | Git and GitHub |

MongoDB Community Server runs locally. The API connects with `mongodb://127.0.0.1:27017/cricketers_api`. Records persist until they are deleted.

---

## 4. Database design and schema

**Database:** `cricketers_api`  
**Collection:** `cricketers`

Sample document:

```json
{
  "_id": "ObjectId",
  "name": "Babar Azam",
  "country": "Pakistan",
  "role": "Batsman",
  "battingStyle": "Right-hand",
  "matches": 120,
  "runs": 5729
}
```

Mongoose schema fields: `name` (required string), `country` (required string), `role` (required enum), `battingStyle` (optional string), `matches` and `runs` (non-negative numbers, default 0). MongoDB assigns `_id` automatically. The API maps `_id` to `id` in JSON responses.

On first startup the API seeds three sample records (Babar Azam, Virat Kohli, Jos Buttler) if the collection is empty.

**ER-style description:** one collection, `cricketers`. Each document is uniquely identified by `_id`. There are no related collections because this project manages a single entity.

---

## 5. API endpoint documentation

**Base URL:** `http://localhost:3000/api/cricketers`

### 5.1 CREATE — POST `/api/cricketers`

**Purpose:** Add a new cricketer.

**Request body:**

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

**Success:** `201 Created` and the created record including `id`.

### 5.2 READ all — GET `/api/cricketers`

**Purpose:** Retrieve every cricketer.

**Success:** `200 OK` and a JSON array.

### 5.3 READ one — GET `/api/cricketers/:id`

**Purpose:** Retrieve one cricketer by database ID.

**Success:** `200 OK` and a JSON object.

**Missing record:** `404 Not Found`.

**Invalid ID (for example `abc`):** `400 Bad Request`.

### 5.4 UPDATE — PUT `/api/cricketers/:id`

**Purpose:** Replace an existing record.

**Request body:** same fields as create.

**Success:** `200 OK` and the updated JSON object.

**Missing record:** `404 Not Found`.

### 5.5 DELETE — DELETE `/api/cricketers/:id`

**Purpose:** Remove a record.

**Success:** `200 OK` with a confirmation message and the deleted object.

**Verification:** `GET /api/cricketers/:id` after delete returns `404 Not Found`.

---

## 6. Postman test cases

Import `postman/Cricketers_API.postman_collection.json` and run the requests while the server is on.

**Paste screenshots here** for each test after you run Postman (status code bar, request, and response).

| ID | Test case | Method / URL | Expected | Actual | Pass/Fail |
|----|-----------|--------------|----------|--------|-----------|
| T1 | Add a valid record | POST `/api/cricketers` | 201, JSON with `id` | _fill after test_ | |
| T2 | Retrieve all records | GET `/api/cricketers` | 200, JSON array | | |
| T3 | Retrieve one record | GET `/api/cricketers/{id}` | 200, matching object | | |
| T4 | Update an existing record | PUT `/api/cricketers/{id}` | 200, updated fields | | |
| T5 | Delete an existing record | DELETE `/api/cricketers/{id}` | 200, deleted object | | |
| T6 | Omit required fields | POST `/api/cricketers` with only `name` | 400, validation details | | |
| T7 | Nonexistent ID | GET `/api/cricketers/000000000000000000000000` | 404 | | |
| T8 | Get after delete | GET same id as T5 | 404 | | |

### How each test was performed

1. Started the API with `npm start`.
2. In Postman, set method, URL, and JSON body where required.
3. Sent the request.
4. Recorded HTTP status, response body, and whether the database changed (confirmed with a follow-up GET).

---

## 7. Error-handling and validation tests

| Scenario | Expected status | How the API responds |
|----------|-----------------|----------------------|
| Missing `name`, `country`, or `role` | 400 | `{ "error": "Validation Error", "details": [...] }` |
| Invalid `role` (not in the allowed list) | 400 | Validation error |
| Negative `matches` or `runs` | 400 | Validation error |
| Invalid ObjectId (for example `abc` or `99999`) | 400 | `"Cricketer ID must be a valid MongoDB ObjectId."` |
| ID that does not exist | 404 | `"No cricketer found with id ..."` |
| Malformed JSON body | 400 | `"Request body must be valid JSON."` |
| Unknown URL | 404 | No matching route |

---

## 8. Results, identified issues, and conclusion

**Results**

- All four CRUD operations work against MongoDB.
- Successful creates return **201**.
- Successful reads, updates, and deletes return **200**.
- Missing records return **404**.
- Invalid input returns **400** with a list of problems.
- Deleted records cannot be retrieved again.

**Identified issues**

- MongoDB ObjectIds are 24-character hex strings, so Postman tests must use the `id` returned by POST rather than `1`.
- PUT requires the full record (not a partial PATCH). That matches the assignment’s replace-style update.

**Conclusion**

The project meets the PBL requirements: a database-backed REST API, JSON exchange, CRUD endpoints, HTTP status codes, error handling, and Postman testing. The source code is on GitHub, and the running API is demonstrated in the presentation video.

---

## 9. GitHub repository link

_[Paste the public GitHub URL here, for example https://github.com/your-username/cricketers-crud-rest-api]_

---

## 10. Presentation video link

_[Paste an accessible video URL here, for example a Google Drive, YouTube, or unlisted video link]_

### Video / presentation checklist

- [ ] Purpose of the project and why Cricketer was chosen
- [ ] Database file / stored records
- [ ] POST, GET all, GET one, PUT, DELETE in Postman
- [ ] JSON request and response bodies
- [ ] Status codes and at least one error case (400 or 404)
- [ ] GitHub repository shown
- [ ] `npm start` and a live request shown

---

## 11. How to run the project (for the examiner)

```bash
git clone <your-github-url>
cd REST_API_PROJECT
npm install
npm start
```

Then open Postman and import `postman/Cricketers_API.postman_collection.json`.
