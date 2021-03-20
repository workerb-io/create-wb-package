
const path = require('path')
const helpers = require('./webpack.helpers.js');
const WBMetaJsonGenerator = require("wb-packager-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const fileSystem = helpers.generateFS(__dirname + '/src/actions', "workerB")

const entryFiles = helpers.generateEntryPaths(fileSystem.children);

const mode = process.argv.filter(val => val.includes("--mode"));
let environment = "production";
if(mode.length > 0 && mode[0].includes("dev")) {
  environment = "development";
}

const entryPaths = helpers.getFiles(entryFiles, ".ts").map(file => file.replace('.ts', ''));


/**
 * Add a description of the required folders in folderDescriptionList 
 * as an object with path and description as property
 * 
 * @property {path} [string] relative path of the folder w.r.t. Entrypoint
 * EntryPoint => /src/actions
 * @property {description} [string] description for the folder
 * @property {iconPath} [string] folder icon -> remote url OR local icon path (w.r.t. root)
 * 
 * Example:
 * 
 * const folderDescriptionList = [
 *    {
 *      path: "/orgs",
 *      description: "List all the organizations",
 *      iconPath: "https://cdn.remote.com/icon.png"
 *    },
 *    {
 *      path: "/orgs/options/users",
 *      description: "List all the users",
 *      iconPath: "src/actions/orgs/options/users/user_icons/user.png"
 *    }
 * ]
 * 
 */

const folderDescriptionList = [
  {
    path: "/components",
    description: "List all the inner components and actions",
    iconPath: "src/actions/components/component_icons/component.png"
  }
]

/**
 * Add relevant 
 * <package name>
 * <package description> 
 * <package icon> "Remote/Local url"
 * add folderDescriptionList
 * in WBMetaJsonGenerator in plugins
 * 
 */

module.exports = {
    entry: entryPaths.reduce((result, entryPath) => {
        result[entryPath] = "./src/actions/" + entryPath + ".ts"
        return result;
    }, {}),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        globalObject: 'this',
        libraryTarget: 'umd',
        library: 'main',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ["@babel/preset-env"]
                  }
                }
            }
        ]
    },
    plugins: [
        new WBMetaJsonGenerator({
            environment,
            package: "package_name",
            packageDescription: "package_description",
            packageIcon: "https://raw.githubusercontent.com/workerb-io/wb-github/master/src/actions/logo.png",
            readmeFile: 'README.md',
            folderDescriptionList
        })
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: /(@description|@name|@ignore)/i,
            },
          },
        }),
      ],
    }
}