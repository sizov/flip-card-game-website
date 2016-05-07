var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * This is the Webpack configuration file for production.
 */
module.exports = {
    entry: "./src/main",

    target: 'node', // in order to ignore built-in modules like path, fs, etc.

    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

    output: {
        path: __dirname + "/dist/",
        filename: "flip-card-gane-component.js"
    },

    plugins: [
        new ExtractTextPlugin('style.css', {allChunks: true})
    ],

    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader"},
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx', '.css']
    },

    postcss: [
        require('autoprefixer'),
        require('postcss-nested')
    ]
}
