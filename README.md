# MahiPandey_Exabloom

## 🖥️ Frontend Tests
*(Add your frontend details here)*

---

## 📦 Backend Tests
This backend project is built using **Node.js**, **Express**, and **PostgreSQL**, designed to handle large-scale message data efficiently. It supports:

- Generating **100,000 contacts** and **5 million messages** from a CSV
- Fast retrieval of the **50 most recent conversations**
- Full-text search on names, phone numbers, and messages
- Performance optimization using **materialized views** and **indexing**

---

### ⚙️ Setup Instructions

1. **Install dependencies**
   ```bash
   cd backend_tests
   npm install

2. **Create the PostgreSQL database**
    ```bash
    createdb exabloom

3. **Run schema setup**
    ```bash
    psql -U postgres -d exabloom -f db/setup.sql

---
### 🧪 Generate Dummy Data
Generates:
-100,000 contacts
-5 million messages

```bash
node generate_data.js
```
---
### 🚀 Optimize for Performance

1. **Create the materialized view**
   ```bash
   psql -U postgres -d exabloom -f db/create_view.sql

2. **Refresh the view after generating data**
    ```bash
    psql -U postgres -d exabloom -f db/refresh_view.sql

---
### 🖥️ Run the Server
```bash
node server.js
```
Server run at:
```bash
http://localhost:3000
```

---
📡 API Endpoints

🔹 [GET /conversations?page=1](http://localhost:3000/conversations?page=1)
Returns 50 most recent conversations (latest message per contact).

🔹 [GET /conversations/search?value=fish&page=1](http://localhost:3000/conversations/search?value=fish&page=1)
Searches by:

- Contact name
- Phone number
- Message content