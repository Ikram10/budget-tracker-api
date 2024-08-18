const express = require('express');
const app = express()
const generateUid = require('./helper-functions')

const PORT = 3000;

let totalBudget = 1000;
let envelopes = [];

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res, next) => {
    res.send("Hello, World");
});

//gets all envelope objects
app.get('/envelopes', (req, res, next) => {
    res.json(envelopes)
})

app.get('/envelopes/:userId', (req, res, next) => {
    let id = Number(req.params.userId);
    console.log(`Searching for envelope with id ${id}...`);

    let envelope = envelopes.find(element => element.id === id);
    console.log(`Envelope: ${envelope}`);

    if (envelope) {
        return res.send(envelope);
    } else {
        console.log(`Error: envelope with id ${id} not found`);
        return res.status(404).send("Error: envelope not found");
    }
})

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

    envelopes.push(
        {
            id: generateUid(envelopes),
            name,
            amount
        });
    totalBudget -= amount; //deduct amount from total budget

    console.log(`Envelope created successfully... total budget is now ${totalBudget}`);
    res.status(200).send("Envelope created successfully")

})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    
});