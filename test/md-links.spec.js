const { debug } = require('console');
const {mdLinks, getStats, validateLink, extractLinks} = require('../mdlinks.js');
const fs = require('fs')
const fetch = require('node-fetch');


jest.mock('node-fetch');
jest.mock('fs')



describe('extractLinks', () => {
  test('should extract links from data', () => {
    const data = `
      text text [link 1](https://www.link1.com) \n text text [link 2](https://www.link2.com) \n text text [link 3](https://www.link3.com)
    `;

    const pathFile = '/path/to/file';
    const expectedLinks = [
      { text: 'link 1', href: 'https://www.link1.com', file: '/path/to/file' },
      { text: 'link 2', href: 'https://www.link2.com', file: '/path/to/file' },
      { text: 'link 3', href: 'https://www.link3.com', file: '/path/to/file' },
    ];

    expect(extractLinks(data, pathFile)).toStrictEqual(expectedLinks);
  });

  test('should return an empty array if no links are found', () => {
    const data = 'Text without any links.';
    const pathFile = '/path/to/file';

    expect(extractLinks(data, pathFile)).toEqual([]);
  });
});



describe('getStats', () => {

  test('should return statistics object with total and unique link counts', () => {
    const links = [
      {
        href: 'https://facebook.com',
        text: 'Google',
        file: 'example.md',
      },
      {
        href: 'https://google.com',
        text: 'Google',
        file: 'another.md',
      },
      {
        href: 'https://google.com',
        text: 'Google',
        file: 'another.md',
      }
    ];

    const result = getStats(links);

    expect(result).toEqual({
      total: 3,
      unique: 2,
    });
  });
});





describe('mdLinks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('return an array of links when no options are provided', async () => {
    const path = 'example.md';
    const options = {};

    const fileData = '[Google](https://google.com)';
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, fileData);
    });

    const result = await mdLinks(path, options);

    expect(result).toEqual([
      {
        href: 'https://google.com',
        text: 'Google',
        file: path,
      },
    ]);
  });



  test('return statistics when `stats` option is provided', async () => {
    const path = 'example.md';
    const options = {
      stats: true,
    };

    const fileData = '[Google](https://google.com)';
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, fileData);
    });

    const result = await mdLinks(path, options);

    expect(result).toEqual({
      total: 1,
      unique: 1,
    });
  });
});



describe('validateLink', () => {
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });
  test('return a successful link object when the response status is 200', async () => {
    const link = {
      text: 'Example Link',
      href: 'https://www.example.com',
      file: 'example.md'
    };

    const response = {
      status: 200
    };

    fetch.mockImplementation(()=> Promise.resolve({
      status: 200,
     }))



    const result = await validateLink(link);

    expect(result).toEqual({
      text: link.text,
      href: link.href,
      file: link.file,
      status: 'ok'
    });

  });

  test('return a failed link object when the response status is not 200', async () => {
    const link = {
      text: 'Example Link',
      href: 'https://www.example.com',
      file: 'example.md'
    };

    fetch.mockImplementation(()=> Promise.resolve({
      status: 404,
     }))

    const result = await validateLink(link);

    expect(result).toStrictEqual({
      text: link.text,
      href: link.href,
      file: link.file,
      status: 'fail'
    });

  });
});
