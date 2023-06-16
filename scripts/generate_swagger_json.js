//Load the package
const yaml = require('js-yaml');
const fs = require('fs');

const input = process.argv[0]

//Read the Yaml file
const data = fs.readFileSync('src/.generated/swagger.yaml', {encoding: 'utf8'});

//Convert Yml object to JSON
const yamlData = yaml.load(data);

//Write JSON to Yml
const jsonData = JSON.stringify(yamlData);
fs.writeFileSync('input_file.json', jsonData, 'utf8');
