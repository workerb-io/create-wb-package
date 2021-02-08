# create-workerb-package

Its is a light weight utility tool to generate the boilerplate code for any workerb package.
This package aims to reduce the time for development of any package on workerb platform.

## Get Started Immediately

`npm i -g create-workerb-package`

The above command will download the utility on global csope so that you can start creating new packages anywhere in your system

After Installing create-workerb-package utility you can start building your packages by running the following command.

`create-workerb-package`

After running this command the utility will prompt for new package name.

![Package name:](https://user-images.githubusercontent.com/12980740/107119637-f0e3ef00-68ae-11eb-93f9-fe76b13b8fc8.png)

Enter the package name and then

cd `<package-name>`

`yarn install`

`yarn build`

yarn build command will create a prduction build of the boilerplate code in the dist folder.

To run this code on workerb action bar you can follow the readme of wb-github package.

Link [wb-github](https://github.com/workerb-io/wb-github)