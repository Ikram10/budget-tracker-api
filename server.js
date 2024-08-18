const express = require('express');
const app = express()

const PORT = 3000;

let totalBudget = 1000;
let envelopes = [];

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res, next) => {
    res.send("Hello, World");
});

app.post('/envelopes', (req, res, next) => {
    const { name, amount } = req.body;

    if (!name || typeof amount !== 'number' || amount < 0) {
        console.log("Incorrect arguments provided");
        return res.status(400).send("Error: invalid arguments for envelope");
    }

    if (totalBudget - amount < 0) {
        console.log("Not enough funds to create envelope");
        return res.status(400).send("Error: not enough funds");

    }

    envelopes.push({ name, amount });
    totalBudget -= amount; //deduct amount from total budget

    console.log("Envelope created successfully...")
    res.status(200).send("Envelope created successfully")

})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});