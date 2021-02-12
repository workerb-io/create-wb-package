#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');
const spawn = require('cross-spawn');

const CURR_DIR = process.cwd();

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
  }
];

/**
 * After getting answer from the user (resolving the promise) it will create the directory
 * with package-name as name and then calls the function (createDirectoryContents) to create
 * complete directory structure of workerb package boilerplate
 */
inquirer.prompt(QUESTIONS)
  .then(answers => {
    const packageName = answers['package-name'];
    const templatePath = `${__dirname}/../templates`;
    const packagePath = `${CURR_DIR}/${packageName}`;
  
    fs.mkdirSync(packagePath);

    createDirectoryContents(templatePath, packageName);

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