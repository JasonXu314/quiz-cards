const fs = require('fs');
console.log(fs.readdirSync(`${process.cwd()}/.next`));

const folders = fs.readdirSync(`${process.cwd()}/.next/server/static`);

const dest =  folders.filter((file) => fs.statSync(`${process.cwd()}/.next/server/static/${file}`).isDirectory() && file !== 'development')[0];

fs.copyFileSync(`${process.cwd()}/cards.json`, `${process.cwd()}/.next/server/static/${dest}/cards.json`);