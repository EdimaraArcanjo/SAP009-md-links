const fs = require("fs");
const fetch = require("node-fetch");

const extractLinks = (data, pathFile) => {
  const regex = /\[(\S.*)\]\((http.*?\))/gm;
  const links = data.match(regex) || [];
  return links.map((link) => {
    const text = link.match(/\[(\S.*)\]/)[1];
    const href = link.match(/\((http.*)\)/)[1];
    return { text, href, file:pathFile };
  });
};

const validateLink = (link) => {
  return fetch(link.href)
    .then((response) => {
      if (response.status === 200) {
        return { text: link.text, href: link.href, file: link.file, status: "ok" };
      } else {
        return { text: link.text, href: link.href, file: link.file, status: "fail" };
      }
    })
    .catch((error) => {
      return { ...link, status: "fail", error: error.message };
    });
};

const getStats = (links) => {
  const uniqueLinks = new Set(links.map((link) => link.href));
  return {
    total: links.length,
    unique: uniqueLinks.size,
  };
};



const mdLinks = (pathFile, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathFile, "utf8", (err, data) => {
      if (err) {
        reject(err.message);
      } else {
        const links = extractLinks(data, pathFile);

        if (options.validate) {
          Promise.all(links.map(validateLink))
            .then(resolve)
            .catch(reject);
        } else if (options.stats) {
          const stats = getStats(links);
          resolve(stats);
        } else {
          resolve(links);
        }
      }
    });
  });
};

module.exports = {mdLinks, extractLinks, getStats, validateLink};
