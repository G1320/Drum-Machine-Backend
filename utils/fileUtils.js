const fs = require('fs');
const path = require('path');

const readAndParseJsonFile = (filePath) => {
  console.log(`Reading and parsing JSON file from: ${filePath}`);
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading or parsing the file ${filePath}`, error);
    return {};
  }
};

const normalizeName = (name) => {
  return name.toLowerCase().replace(/\s+/g, '').replace(/-+/g, '');
};

const getHtmlFilePath = async (fileName, dbData) => {
  const fileNameNormalized = normalizeName(fileName);
  const dbNameNormalized = dbData ? (dbData.name ? normalizeName(dbData.name) : '') : '';
  // First, check if an HTML file matching the fileName exists
  const htmlFilePath = path.join(__dirname, `../views/${fileNameNormalized}/${fileNameNormalized}.html`);
  if (fs.existsSync(htmlFilePath)) {
    return htmlFilePath;
  }
  // Next, check if the fileName matches a key in the database data
  if (dbData && dbNameNormalized === fileNameNormalized) {
    return path.join(__dirname, '../../Frontend/dist/index.html');
  }
  // Finally, check the static JSON data file
  const jsonFilePath = path.join(__dirname, '../data/categoryData.json');
  const jsonData = readAndParseJsonFile(jsonFilePath);
  if (jsonData[fileNameNormalized]) {
    return path.join(__dirname, '../../Frontend/dist/index.html');
  }
  // If no match is found, return the "not available" page
  return path.join(__dirname, '../views/na/na.html');
};

module.exports = { readAndParseJsonFile, getHtmlFilePath };
