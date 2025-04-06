const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { faker } = require("@faker-js/faker");

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       // change if needed
  host: "localhost",
  database: "exabloom",   // match your db
  password: "",           // fill in only if required
  port: 5432,
});

const messageContents = [];

function loadMessagesFromCSV() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "message_content.csv"))
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        const content = Object.values(row)[0];
        if (content) messageContents.push(content);
      })
      .on("end", () => {
        console.log(`Loaded ${messageContents.length} messages from CSV`);
        resolve();
      })
      .on("error", reject);
  });
}

async function generateContactsAndMessages() {
  console.log("Generating contacts and messages...");

  for (let i = 0; i < 100000; i++) {
    const name = faker.person.fullName();
    const phone = faker.phone.number();

    let contactId;
    try {
      const res = await pool.query(
        "INSERT INTO contacts (name, phone_number) VALUES ($1, $2) RETURNING id",
        [name, phone]
      );
      contactId = res.rows[0].id;
    } catch (err) {
      console.error("Error inserting contact:", err);
      continue;
    }

    const numMessages = Math.floor(Math.random() * 100); // up to 100 messages
    const messagePromises = [];

    for (let j = 0; j < numMessages; j++) {
      const content = messageContents[Math.floor(Math.random() * messageContents.length)];
      const timestamp = faker.date.past(1); // within the past year

      messagePromises.push(
        pool.query(
          "INSERT INTO messages (contact_id, content, timestamp) VALUES ($1, $2, $3)",
          [contactId, content, timestamp]
        )
      );
    }

    // Wait for all messages to be inserted
    try {
      await Promise.all(messagePromises);
    } catch (err) {
      console.error("Error inserting messages:", err);
    }

    if (i % 1000 === 0) {
      console.log(`${i} contacts created...`);
    }
  }

  console.log("✅ Data generation complete!");
  await pool.end();
}

async function main() {
  try {
    await loadMessagesFromCSV();
    await generateContactsAndMessages();
  } catch (err) {
    console.error("Error:", err);
    pool.end();
  }
}

main();
