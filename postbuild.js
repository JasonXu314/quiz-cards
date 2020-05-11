const fs = require('fs');
console.log(fs.readdirSync(`${process.cwd()}/.next/serverless`));

const folders = fs.readdirSync(`${process.cwd()}/.next/serverless/static`);

const dest =  folders.filter((file) => fs.statSync(`${process.cwd()}/.next/serverless/static/${file}`).isDirectory() && file !== 'development')[0];

fs.copyFileSync(`${process.cwd()}/cards.json`, `${process.cwd()}/.next/serverless/static/${dest}/cards.json`);