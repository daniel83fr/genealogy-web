const webpack = require('webpack');
const path = require('path');
module.exports = {
  entry: {
    cache: './src/cache/randomPhotos.json',
  },
  // output: {
  //   filename: '[name].bundle.js',
  //   publicPath: '/cache/',
  //   path: path.resolve(__dirname, 'dist'),
  // },
};