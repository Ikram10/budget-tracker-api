const express = require('express');
const app = express()
const generateUid = require('./helper-functions')

const PORT = 4000;

let totalBudget = 1000;
let budgetRem = totalBudget;
let envelopes = [{
    id: 12,
    name: "Groceries",
    amount: 50
}, {
    id: 15,
    name: "Fuel",
    amount: 150

}];

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res, next) => {
    res.send("Hello, World");
});

//gets all envelope objects
app.get('/envelopes', (req, res, next) => {
    res.json(envelopes)
})

app.get('/envelopes/:id', (req, res, next) => {
    let id = Number(req.params.id);
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

    if (budgetRem - amount < 0) {
        console.log("Not enough funds remaining");
        return res.status(400).send("Error: not enough funds");

    }

    envelopes.push(
        {
            id: generateUid(envelopes),
            name,
            amount
        });
    budgetRem -= amount; //deduct amount from total budget

    console.log(`Envelope created successfully`);
    res.status(200).send("Envelope created successfully");
})

app.post('/envelopes/transfer/:fromId/:toId', (req, res, next) => {
    const fromId = Number(req.params.fromId);
    const toId = Number(req.params.toId);
    const transferAmount = Number(req.body.amount);

    console.log(`Attempting to transfer ${transferAmount} from ${fromId} to ${toId}...`)

    // Find the envelopes
    const fromEnvelope = envelopes.find(envelope => envelope.id === fromId);
    const toEnvelope = envelopes.find(envelope => envelope.id === toId);

    // Check if both envelopes exist
    if (!fromEnvelope || !toEnvelope) {
        console.log("Error: cannot find source envelope and/or to envelope")
        return res.status(404).send('Error: One or both of the envelopes were not found.');
    }

    // Check if there is enough balance in the fromEnvelope
    if (fromEnvelope.balance < transferAmount) {
        console.log("Error: not enough funds in source envelope")
        return res.status(400).send('Error: Insufficient funds in the source envelope.');
    }

    // Perform the transfer
    fromEnvelope.amount -= transferAmount;
    toEnvelope.amount += transferAmount;

    // Return a success response
    res.send({
        message: 'Transfer successful',
        fromEnvelope: fromEnvelope,
        toEnvelope: toEnvelope
    });
})

app.put('/envelopes/:id', (req, res, next) => {
    const id = Number(req.params.id);
    console.log(`Searching for envelope with id ${id}...`);
    const envelope = envelopes.find(element => element.id === id);
    const { name, amount } = req.body;

    if (!envelope) {
        return res.status(404).send('Error: Envelope not found');
    }

    let budgetCost = envelope.amount - amount;

    console.log(`Budget will cost ${budgetCost}...`);

    // Update the envelope's properties
    if (name) envelope.name = name;
    if (amount) envelope.amount = amount;

    totalBudget -= budgetCost;
    console.log(`Envelope updated... total budget is now ${totalBudget}`);

    res.send(envelope);
})

app.delete('/envelopes/:id', (req, res, next) => {
    const id = Number(req.params.id);
    console.log(`Searching for envelope with id ${id}...`);
    const envelope = envelopes.find(element => element.id === id);

    if (!envelope) {
        console.log(`Error: cannot find envelope with id ${id}`)
        return res.status(404).send("Error: cannot find envelope with id")
    }

    const envelopeIndex = envelopes.findIndex(element => element.id === id)
    console.log(`Attempting to delete envelope with index ${envelopeIndex}...`);

    envelopes.splice(envelopeIndex, 1);
    console.log("Envelope deleted successfully")

    res.send(envelopes);

})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    
});