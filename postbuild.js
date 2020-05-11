const fs = require('fs');
console.log(fs.readdirSync(`${process.cwd()}/.next/serverless/pages`));

const folders = fs.readdirSync(`${process.cwd()}/.next/serverless/pages`);

const dest =  folders.filter((file) => fs.statSync(`${process.cwd()}/.next/serverless/pages/${file}`).isDirectory() && file !== 'development')[0];

fs.copyFileSync(`${process.cwd()}/cards.json`, `${process.cwd()}/.next/serverless/pages/${dest}/cards.json`);