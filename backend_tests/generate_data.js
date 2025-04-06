const fs = require("fs");
const csv = require("csv-parser");
const faker = require("faker");
const { Pool } = require("pg");

const pool = new Pool({
  user: "your_pg_user",
  host: "localhost",
  database: "your_db_name",
  password: "your_password",
  port: 5432,
});

const messageContents = [];

// Step 1: Load CSV Messages
function loadMessages() {
  return new Promise((resolve) => {
    fs.createReadStream("backend_tests/message_content.csv")
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        const content = Object.values(row)[0];
        if (content) messageContents.push(content);
      })
      .on("end", resolve);
  });
}

// Step 2: Generate Contacts and Messages
async function generateData() {
  console.log("Loading CSV...");
  await loadMessages();

  console.log("Inserting contacts...");
  for (let i = 0; i < 100000; i++) {
    const name = faker.name.findName();
    const phone = faker.phone.phoneNumber();

    const result = await pool.query(
      "INSERT INTO contacts(name, phone_number) VALUES($1, $2) RETURNING id",
      [name, phone]
    );
    const contactId = result.rows[0].id;

    // Generate messages for contact (average 50 per contact)
    const numMessages = Math.floor(Math.random() * 100);
    const queries = [];
    for (let j = 0; j < numMessages; j++) {
      const content = messageContents[Math.floor(Math.random() * messageContents.length)];
      const timestamp = faker.date.past(1); // within 1 year
      queries.push(pool.query(
        "INSERT INTO messages(contact_id, content, timestamp) VALUES($1, $2, $3)",
        [contactId, content, timestamp]
      ));
    }

    await Promise.all(queries);

    if (i % 1000 === 0) console.log(`${i} contacts inserted`);
  }

  console.log("Done.");
  pool.end();
}

generateData();
