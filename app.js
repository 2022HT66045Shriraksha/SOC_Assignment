const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// In-memory data storage
let accounts = [];
let transactions = [];
let users = [];

app.use(bodyParser.json());

// Authentication middleware (simulated)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // In a real scenario, you would verify the token.
  next();
};

// Routes

// Account Resource
app.get('/accounts/:accountId', authenticate, (req, res) => {
  const accountId = req.params.accountId;
  const account = accounts.find(acc => acc.id === accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json(account);
});

// Transaction Resource
app.get('/transactions/:transactionId', authenticate, (req, res) => {
  const transactionId = req.params.transactionId;
  const transaction = transactions.find(trans => trans.id === transactionId);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.json(transaction);
});

app.post('/transactions', authenticate, (req, res) => {
  const { amount, senderAccountId, receiverAccountId } = req.body;

  // Validation
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  const senderAccount = accounts.find(acc => acc.id === senderAccountId);
  const receiverAccount = accounts.find(acc => acc.id === receiverAccountId);
  if (!senderAccount || !receiverAccount) {
    return res.status(404).json({ error: 'Sender or receiver account not found' });
  }
  if (senderAccount.balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  // Update account balances
  senderAccount.balance -= amount;
  receiverAccount.balance += amount;

  // Create transaction
  const transaction = {
    id: `t${transactions.length + 1}`,
    amount,
    senderAccountId,
    receiverAccountId,
    timestamp: new Date(),
  };
  transactions.push(transaction);

  res.status(201).json(transaction);
});

// Admin/Banking Management Resources
app.post('/admin/accounts', authenticate, (req, res) => {
  const { accountHolderName, initialBalance } = req.body;

  // Validation
  if (!accountHolderName || !initialBalance || initialBalance < 0) {
    return res.status(400).json({ error: 'Invalid account details' });
  }

  // Create account
  const account = {
    id: `a${accounts.length + 1}`,
    accountHolderName,
    balance: initialBalance,
  };
  accounts.push(account);

  res.status(201).json(account);
});

app.get('/admin/accounts/:accountId', authenticate, (req, res) => {
  const accountId = req.params.accountId;
  const account = accounts.find(acc => acc.id === accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json(account);
});

// Simulated authentication endpoint
app.post('/auth/login', (req, res) => {
  // Simulated token for simplicity
  const token = 'Bearer mocktoken123';
  res.json({ token });
});

// Simulated logout endpoint
app.post('/auth/logout', authenticate, (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
