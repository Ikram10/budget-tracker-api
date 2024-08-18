const randomNumber = () => Math.floor(Math.random() * 1000);

const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }];


const generateUid = array => {
    let id;

    do {
        id = randomNumber(); // Generate a new ID
    } while (array.some(object => object.id === id)); // Check if ID already exists in the array

    return id; // Return the unique ID
}


module.exports = generateUid;