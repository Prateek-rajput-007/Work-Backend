
# 📘 Chapter Performance Dashboard API

A RESTful API built with **Node.js/Express** to manage chapter performance data for educational platforms. It supports filtering, caching, rate limiting, authentication, and file upload. Deployed on **Render**, with MongoDB Atlas for data storage and Upstash Redis for caching.

---

## 🚀 Live Demo
🔗 [API Base URL](https://work-backend-xbtz.onrender.com)

---

## 📂 Endpoints

### `GET /api/v1/chapters`
- Fetch paginated and filtered list of chapters.
- **Query Params:**  
  `subject`, `status`, `page`, `limit`
- **Example:**  
  `https://work-backend-xbtz.onrender.com/api/v1/chapters?subject=Chemistry&status=Not%20Started`

---

### `GET /api/v1/chapters/:id`
- Retrieve a single chapter by its MongoDB ObjectID.
- **Example:**  
  `https://work-backend-xbtz.onrender.com/api/v1/chapters/683f46ee391c774b381bdeae`

---

### `POST /api/v1/chapters`  
- Upload chapter data via JSON file (admin-only).
- **Auth Header:**  
  `Authorization: Bearer <ADMIN_TOKEN>`
- **Body:**  
  `multipart/form-data` with `.json` file.
- **Example:**  
  `https://work-backend-xbtz.onrender.com/api/v1/chapters`

---

## ✨ Features

- ✅ **MongoDB Atlas**: Stores chapter info (`status`, `yearWiseQuestionCount`, etc.)
- ⚡ **Upstash Redis**: Caches GET requests for 1 hour.
- 🛡️ **Rate Limiting**: 30 requests/minute per IP.
- 📤 **Multer File Upload**: Bulk upload chapter data in JSON.
- 🧾 **Logging**: Morgan + custom logger for request and error tracking.
- 🔐 **Authentication**: POST endpoint protected via Bearer Token.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Prateek-rajput-007/Work-Backend.git
cd Work-Backend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your-mongo-uri
REDIS_URL=your-upstash-redis-url
ADMIN_TOKEN=your-secure-admin-token
```

### 4. Run Locally

```bash
npm run dev
```

API will run at: `http://localhost:5000`

---

## 📊 Data Format (JSON Upload)

```json
{
  "subject": "Physics",
  "chapter": "Gravitation",
  "class": "12",
  "unit": "Mechanics",
  "yearWiseQuestionCount": {
    "2019": 4,
    "2020": 6
  },
  "questionSolved": 8,
  "status": "In Progress",
  "isWeakChapter": false
}
```

---

## 🔄 Caching & Rate Limiting

| Feature         | Description                                |
| --------------- | ------------------------------------------ |
| ⏱️ Rate Limit   | 30 requests/minute                         |
| 🧠 Redis Cache  | GET requests cached for 1 hour             |
| 🗑️ Cache Clear | New uploads automatically invalidate cache |

---

## 🧪 Postman Collection

You can use the public Postman collection to test all endpoints.
📩 Contact the owner for access.

---

## 🛡️ Environment Variables Summary

| Variable      | Description                      | Example                           |
| ------------- | -------------------------------- | --------------------------------- |
| `PORT`        | Server port                      | `5000`                            |
| `MONGO_URI`   | MongoDB Atlas connection string  | `mongodb+srv://...`               |
| `REDIS_URL`   | Upstash Redis connection string  | `rediss://default:<password>@...` |
| `ADMIN_TOKEN` | Token for uploading chapter data | `your-secure-admin-token`         |

---

## ⚠️ Note

Render's free tier may introduce a delay of 30–60 seconds on the first request.

---

## 📎 Useful Links

* 🔗 [Live API](https://work-backend-xbtz.onrender.com)
* 💻 [GitHub Repo](https://github.com/Prateek-rajput-007/Work-Backend)

