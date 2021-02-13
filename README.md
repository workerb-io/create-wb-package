# create-workerb-package

Its is a light weight utility tool to generate the boilerplate code for any workerb package.
This package aims to reduce the time for development of any package on workerb platform.

## Get Started Immediately

`npm i -g create-workerb-package`

The above command will download the utility on global csope so that you can start creating new packages anywhere in your system

After Installing create-workerb-package utility you can start building your packages by running the following command.

`create-workerb-package`

### Alternatively

_You can use `npx` as_

`npx create-workerb-package`

After running this command the utility will prompt for new package name and description.

![Package name & description:](https://user-images.githubusercontent.com/12980740/107848316-7ff58780-6e18-11eb-8dce-8b7ebac3a8b4.png)

Enter the package name and package description and then run the following commands:

cd `<package-name>`

`npm run build`

npm run build command will create a prduction build of the boilerplate code in the dist folder.

To run this code on workerb action bar you can follow the readme of wb-github package.

Link [wb-github](https://github.com/workerb-io/wb-github)