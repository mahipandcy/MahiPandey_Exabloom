-- Create materialized view for optimized /conversations endpoint
CREATE MATERIALIZED VIEW recent_conversations AS
SELECT DISTINCT ON (m.contact_id)
  c.id AS contact_id,
  c.name,
  c.phone_number,
  m.content,
  m.timestamp
FROM contacts c
JOIN messages m ON c.id = m.contact_id
ORDER BY m.contact_id, m.timestamp DESC;

-- Index to speed up ORDER BY
CREATE INDEX idx_recent_conversations_timestamp ON recent_conversations (timestamp DESC);
