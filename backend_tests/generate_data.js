const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const { faker } = require("@faker-js/faker");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "exabloom",
  password: "",
  port: 5432,
});

const messageContents = [];

function loadMessagesFromCSV() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "message_content.csv");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);

      const parsed = Papa.parse(data, {
        skipEmptyLines: true,
      });

      for (const row of parsed.data) {
        const msg = row[0]?.toString().trim();
        if (msg) messageContents.push(msg);
      }

      console.log(`✅ Loaded ${messageContents.length} messages from CSV`);
      resolve();
    });
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

    const numMessages = 50;
    const messagePromises = [];

    for (let j = 0; j < numMessages; j++) {
      const rawContent = messageContents[Math.floor(Math.random() * messageContents.length)];
      const content = rawContent.replace(/[\r\n]+/g, ' ').trim().slice(0, 300);
      const timestamp = faker.date.past(1); // within the past year

      messagePromises.push(
        pool.query(
          "INSERT INTO messages (contact_id, content, timestamp) VALUES ($1, $2, $3)",
          [contactId, content, timestamp]
        )
      );
    }

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