#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');

const CURR_DIR = process.cwd();
const UTF8 = "utf8";
const PACKAGE_JSON_FILE = "package.json";
const WEBPACK_CONFIG_FILE = "webpack.config.js";
const GITIGNORE = "gitignore";

var PACKAGE_NAME = '';
var PACKAGE_DESCRIPTION = '';

/**
 * Input the package-name from user and create the package directory with that name
 */
const QUESTIONS = [
  {
    name: 'package-name',
    type: 'input',
    message: 'Package name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Package name may only include letters, numbers, underscores and hashes.';
    }
  },
  {
    name: 'package-description',
    type: 'input',
    message: 'Package description:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\ \d])+$/.test(input)) return true;
      else return 'Package description may only include letters, numbers, underscores and hashes.';
    }
  }
];

/**
 * After getting answer from the user (resolving the promise) it will create the directory
 * with package-name as name and then calls the function (createDirectoryContents) to create
 * complete directory structure of workerb package boilerplate
 */
inquirer.prompt(QUESTIONS)
  .then(answers => {
    PACKAGE_NAME = answers['package-name'];
    PACKAGE_DESCRIPTION = answers['package-description'];
    const templatePath = `${__dirname}/../templates`;
    const packagePath = `${CURR_DIR}/${PACKAGE_NAME}`;
  
    fs.mkdirSync(packagePath);

    createDirectoryContents(templatePath, PACKAGE_NAME);

    installPackages(packagePath);
});

/**
 * createDirectoryContents function read the contents of templatePath. All the files 
 * in the templatePath will be copy to newProjectPath in the CURR_DIR and for
 * folders this function will be called recursively with updated templatePath [templatePath/folder]
 * and updated newProjectPath [newProjectPath/folder]
 * @param {string} templatePath act as a source from which files will ne copied
 * @param {string} newProjectPath 
 * 
 * @return {undefined}
 */
function createDirectoryContents (templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath);
  
    filesToCreate.forEach(file => {
      const origFilePath = `${templatePath}/${file}`;
      
      // get stats about the current file
      const stats = fs.statSync(origFilePath);
  
      if (stats.isFile()) {
        let contents = fs.readFileSync(origFilePath, UTF8);
        // update package name and description in package.json and webpack.config.js file
        if(file === PACKAGE_JSON_FILE || file === WEBPACK_CONFIG_FILE) {
          contents = contents.replace(/package_name/g, PACKAGE_NAME);
          contents = contents.replace(/package_description/g, PACKAGE_DESCRIPTION);
        }
        // Explicitly updating the name of gitignore is neccesary as it was
        // not generating after publishing the code in npmjs
        if(file === GITIGNORE) {
          file = ".gitignore";
        }
        const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
        fs.writeFileSync(writePath, contents, UTF8);
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
        
        // recursive call
        createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
      }
    });
}

/**
 * installPackages function will install all the dependecies present in 
 * dynamically created package.json
 * compatible with Window | Linux | Unix environment
 * @param {string} packagePath absolute path where user is running 
 * create-workerb-package command
 * 
 * @return {undefined}
 */

function installPackages(packagePath) {
  const command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

  const install = spawn(
    command, 
    ['install'], 
    {
      env: process.env, 
      cwd: packagePath, 
      stdio: 'inherit' 
    }
  );

  install.on("error", err => {
    console.log(`error: ${err.message}`);
  });

  install.on("close", code => {
    console.log(`child process exited with code: ${code}`);
  });
}