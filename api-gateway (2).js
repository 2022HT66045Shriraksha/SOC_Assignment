const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Simulated authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // In a real scenario, you would validate the token.
  next();
};

// Routes

// Customer-Facing Resources

app.get('/accounts/:accountId', authenticate, async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/accounts/${req.params.accountId}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
  }
});

app.post('/accounts', authenticate, async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/accounts', req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
