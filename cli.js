#!/usr/bin/env node

const mdLinks = require("./mdlinks");
const file = process.argv[2];
const options = {
  validate: process.argv.includes("--validate"),
  stats: process.argv.includes("--stats")
}


mdLinks(file, options)
  .then((arr) => {
    if (options.stats) {
      console.log(`Total: ${arr.length}`);
      const uniqueLinks = new Set(arr.map(el => el.href));
      console.log(`Unique: ${uniqueLinks.size}`);
    }

    arr.forEach(el => {
      if (options.validate) {
        console.log(`${el.text} ${el.href} ${el.status}`);
      } else {
        console.log(`${el.text} ${el.href}`);
      }
    });
  })
  .catch((err) => console.log(err));
