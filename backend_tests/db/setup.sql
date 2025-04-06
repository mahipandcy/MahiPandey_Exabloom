DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  phone_number VARCHAR(30)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  contact_id INT REFERENCES contacts(id),
  content TEXT,
  timestamp TIMESTAMP
);
