#!/usr/bin/env node

const mdLinks = require("./mdlinks");
const fetch = require("node-fetch");

const file = process.argv[2];
const options = {
  validate: process.argv.includes("--validate"),
  stats: process.argv.includes("--stats")
};

mdLinks(file, options)
  .then((result) => {
    if (options.stats) {
      console.log(`Total: ${result.total}`);
      console.log(`Unique: ${result.unique}`);
    } else {
      result.forEach((link) => {
        if (options.validate) {
          console.log(`${link.text} ${link.href} ${link.status}`);
        } else {
          console.log(`${link.text} ${link.href}`);
        }
      });
    }

  })
  .catch((err) => console.error(err));

