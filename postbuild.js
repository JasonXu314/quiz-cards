const fs = require('fs');
// console.log(process.cwd());
// console.log(fs.readdirSync(`${process.cwd()}/.next/serverless/pages/api`));

// fs.copyFileSync(`${process.cwd()}/cards.json`, `${process.cwd()}/.next/serverless/pages/api/cards.json`);

fs.copyFileSync(`${process.cwd()}/cards.json`, `${process.cwd()}/.next/cards.json`);