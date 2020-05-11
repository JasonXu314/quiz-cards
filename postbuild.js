const fs = require('fs');
console.log(fs.readdirSync(process.cws()));

const folders = fs.readdirSync('./.next/server/static');

const dest =  folders.filter((file) => fs.statSync(`./.next/server/static/${file}`).isDirectory() && file !== 'development')[0];

fs.copyFileSync('./cards.json', `./.next/server/static/${dest}/cards.json`);