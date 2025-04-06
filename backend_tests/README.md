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

---
---

## 🧗‍♀️ Challenges Encountered

### 1. Efficiently Handling a Large Volume of Data
Generating and storing 5 million messages posed performance and memory challenges. I addressed this by:
- Inserting data in controlled batches
- Logging progress every 1,000 contacts to monitor script execution
- Using optimized SQL queries and indexes to minimize database strain

### 2. Cleaning and Loading Multiline CSV Data
The original CSV file included multiline entries with irregular formatting. I used the `papaparse` library to:
- Properly parse multiline message content
- Clean up newline characters (`\n`, `\r\n`) for valid JSON formatting

### 3. Repeating Messages per Contact
Ensuring each contact had exactly 50 diverse messages while maintaining variety from the CSV required logic to:
- Loop through the message pool without exhausting it
- Avoid very long message blocks repeating for a single contact

### 4. Performance Bottlenecks in Queries
Naively querying the latest message for every contact in real-time was too slow at scale. I solved this by:
- Creating a **materialized view** to precompute and store only the most recent message per contact
- Adding an **index on the timestamp** to speed up sorting and pagination