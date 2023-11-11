const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let accounts = [
  { id: 'a1', accountHolderName: 'John Doe', balance: 5000 },
  { id: 'a2', accountHolderName: 'Jane Doe', balance: 3000 },
];

app.get('/accounts/:accountId', (req, res) => {
  const account = accounts.find(acc => acc.id === req.params.accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json(account);
});

app.post('/accounts', (req, res) => {
  const { accountHolderName, initialBalance } = req.body;
  if (!accountHolderName || !initialBalance || initialBalance < 0) {
    return res.status(400).json({ error: 'Invalid account details' });
  }
  const newAccount = {
    id: `a${accounts.length + 1}`,
    accountHolderName,
    balance: initialBalance,
  };
  accounts.push(newAccount);
  res.status(201).json(newAccount);
});

app.listen(PORT, () => {
  console.log(`Account Service is running on http://localhost:${PORT}`);
});
