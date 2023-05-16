// importar função que lê o pathfile
const fs = require("fs")
// importar função que pega os links
//importar função que valida os links

const mdLinks = (pathFile) => {
  const regex = /\[(\S.*)\]\((http.*?\))/gm;
  const arr = [];
  return new Promise((resolve, reject) => {
    fs.readFile(pathFile, "utf8", (err, data) => {
      if (err) {
        reject(err.message);
      } else {
        const links = data.match(regex);
        console.log(data)
        links.forEach((link) => {
          const text = link.match(/\[(\S.*)\]/)[1];
          const href = link.match(/\((http.*)\)/)[1];
          const file = pathFile
          arr.push({ text, href, file });
        });
        resolve(arr);
      }
    });
  });
};

/* cli.js */
mdLinks("./texts/text-file3.md")
  .then((arr) => {
    console.log(arr);
  })
  .catch((err) => {
    console.log(err);
  })


module.exports = mdLinks;
