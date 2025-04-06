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


