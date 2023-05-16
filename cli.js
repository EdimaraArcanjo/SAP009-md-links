const mdLinks = require("./mdlinks");

mdLinks("./texts/text-file3.md")
  .then((arr) => {
    console.log(arr);
  })
  .catch
