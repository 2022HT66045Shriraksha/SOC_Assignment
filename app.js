const express = require('express');
const app = express();
const port = process.env.PORT || 3200;
app.listen(port, () => {
 console.log(`running at port ${port}`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const accounts = [];
/** * creating a New account */
app.post("/new_account", (req, res) => {
const account = req.body;
if (account.food_name || account.customer_name || account.food_qty) {
    accounts.push({
...account,
id: accounts.length + 1,
date: Date.now().toString()
});
console.log();
res.status(200).json({
message: "Account created successfully"
});
} else {
res.status(401).json({
message: "Invalid Account creation"
});
}
});

/**
* Getting All accounts
*/
app.get("/get_accounts", (req, res) => {
    res.status(200).send(accounts);
   });

/**
* Update account
*/
app.patch("/account/:id", (req, res) => {
    const account_id = req.params.id;
    const account_update = req.body;
    for (let account of accounts) {
    if (account.id == account_id) {
    if (account_update.food_name != null || undefined)
    account.food_name = account_update.food_name;
    if (account_update.food_qty != null || undefined)
    account.food_qty = account_update.food_qty;
    if (account_update.customer_name != null || undefined)
    account.customer_name = account_update.customer_name;
    return res
    .status(200)
    .json({ message: "Updated Succesfully", data: account });
    }
    }
    res.status(404).json({ message: "Invalid account Id" });
    });

    /**
* Delete account
*/
app.delete("/account/:id", (req, res) => {
    const account_id = req.params.id;
    for (let account of accounts) {
    if (account.id == account_id) {
        account.splice(accounts.indexOf(account), 1);
    return res.status(200).json({
    message: "Deleted Successfully"
    });
    }
    }
    res.status(404).json({ message: "Invalid account Id" });
    });