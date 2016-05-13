var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var PACKAGE_JSON = require('./package.json');

/**
 * This is the Webpack configuration file for production.
 */
module.exports = {
    entry: "./src/example",

    output: {
        path: __dirname + "/dist/",
        filename: PACKAGE_JSON.name + ".js"
    },

    plugins: [
        new ExtractTextPlugin('style.css', {allChunks: true}),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                screw_ie8: true,
                warnings: false
            }
        })
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,

                /**
                 * was like this but CSS names were changed twice, so disabled name change:
                 * loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
                 */

                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
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
};