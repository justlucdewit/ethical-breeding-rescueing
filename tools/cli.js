const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const db = new sqlite3.Database('database/database.db');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\n> '
});

const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

async function createAnimalSource() {
    const name = await askQuestion('Enter the Name: ');
    const email = await askQuestion('Enter the Email: ');
    const phoneNumber = await askQuestion('Enter the PhoneNumber: ');
    const type = await askQuestion('Enter the Type (Breeder/Rescue): ');
    const animal = await askQuestion('Enter the Animal (comma-separated list): ');
    const country = await askQuestion('Enter the Country: ');
    const coordinates = await askQuestion('Enter the Coordinates: ');
    
    try {
        await dbRun(
            'INSERT INTO AnimalSources (Name, Email, PhoneNumber, Type, Animal, EthicsState, Country, Coordinates) VALUES (?, ?, ?, ?, ?, \'pre-review\', ?, ?)',
            [name, email, phoneNumber, type, animal, country, coordinates]
        );
        console.log('\nAnimal source inserted successfully.');
        rl.prompt();
    } catch (err) {
        console.error('\nError inserting data:', err.message);
        rl.prompt();
    }
}

async function listAnimalSources() {
    const sources = await dbAll('SELECT * FROM AnimalSources');
    console.log('');
    sources.forEach(src => console.log(` - ${src.Name}`));
}
    
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

function closeAndExit() {
    console.log('Exiting CLI.');
    db.close();
    rl.close();
}

const commandHandlers = {
    help: () => {
        console.log('Available commands:');
        console.log('=============Animal Sources===============');
        console.log('list-source   - List all animal sources');
        console.log('insert-source - Insert a new animal source');
        console.log('');
        console.log('=============Other         ===============');
        console.log('exit          - Exit the CLI');
    },
    'insert-source': createAnimalSource,
    'list-source': listAnimalSources,
    exit: closeAndExit,
    default: () => console.log('Invalid command. Type "help" for instructions.'),
};

rl.on('line', (input) => {
    const command = input.trim().toLowerCase();
    const handler = commandHandlers[command] || commandHandlers.default;
    handler();
    rl.prompt();
});

rl.on('close', () => {
    console.log('CLI closed.');
    process.exit(0);
});

console.clear()
console.log('Welcome to the Ethical breeders and rescues CLI Tool 🐹\nType "help" for instructions.');
rl.prompt();