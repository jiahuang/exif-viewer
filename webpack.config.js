const webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'app');

module.exports = {
    entry: APP_DIR+'/Exif.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: APP_DIR,
            loader: 'babel',
          }, {
            test: /\.jpe?g$|\.gif$|\.png$/i,
            loader: 'file-loader'
          }
      ]
    }
    // ,
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false,
    //         },
    //         output: {
    //             comments: false,
    //         },
    //     }),
    // ]
}
