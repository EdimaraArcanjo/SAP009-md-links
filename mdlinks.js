const fs = require("fs");
const {link} = require("fs/promises");

const mdLinks = (pathFile, options) => {
  const regex = /\[(\S.*)\]\((http.*?\))/gm;
  const arr = [];

  return new Promise((resolve, reject) => {
    fs.readFile(pathFile, "utf8", (err, data) => {
      if (err) {
        reject(err.message);
      } else {
        const links = data.match(regex);
        links.forEach((link) => {
          const text = link.match(/\[(\S.*)\]/)[1];
          const href = link.match(/\((http.*)\)/)[1];
          const file = pathFile;
          arr.push({ text, href, file });
        });
        if (options.validate) {
          Promise.all(
            arr.map((link) => {
              return fetch(link.href)
                .then((response) => {
                  if (response.status === 200) {
                    return { text: link.text, href: link.href, file: link.file, status: "ok" };
                  } else {
                    return { text: link.text, href: link.href, file: link.file, status: "fail" };
                  }
                })
                .catch((error) => {
                    return { text: link.text, href: link.href, file: link.file, status: "fail", error: error.message };
                });
            })
          )
            .then(resolve)
            .catch(reject);
        } else {
          if (options.stats) {
            const linksUnicos = new Set(links);
            resolve({ total: links.length, unicos: linksUnicos.size });
          }

          else {
            resolve(arr);
          }
        }
      }
    });
  });
};

module.exports = mdLinks;


