#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');

const CURR_DIR = process.cwd();

const QUESTIONS = [
  {
    name: 'package-name',
    type: 'input',
    message: 'Package name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Package name may only include letters, numbers, underscores and hashes.';
    }
  }
];


inquirer.prompt(QUESTIONS)
  .then(answers => {
    const packageName = answers['package-name'];
    const templatePath = `${__dirname}/../templates`;
  
    fs.mkdirSync(`${CURR_DIR}/${packageName}`);

    createDirectoryContents(templatePath, packageName);
});

function createDirectoryContents (templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath);
  
    filesToCreate.forEach(file => {
      const origFilePath = `${templatePath}/${file}`;
      
      // get stats about the current file
      const stats = fs.statSync(origFilePath);
  
      if (stats.isFile()) {
        const contents = fs.readFileSync(origFilePath, 'utf8');
        
        const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
        fs.writeFileSync(writePath, contents, 'utf8');
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
        
        // recursive call
        createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
      }
    });
}