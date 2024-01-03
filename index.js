import fs from "fs"

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

console.log(data);
