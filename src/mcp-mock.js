const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Example endpoint simulating a user API
app.get('/api/user', (req, res) => {
  res.json({ id: 1, name: 'Alice' });
});

// AI model mock endpoint that echoes the prompt
app.post('/api/ai-chat', (req, res) => {
  const { prompt } = req.body;
  res.json({ reply: `Echo: ${prompt}` });
});

// Add more endpoints as needed here

app.listen(port, () => {
  console.log(`Mock MCP backend is running at http://localhost:${port}`);
});
