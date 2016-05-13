const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: /src/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      }, {
        test: /\.json$/,
        include: /src/,
        loader: 'json-loader',
      }, {
        test: /\.(jpg|png)$/,
        include: /src/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    root: path.join(__dirname, 'src'),
    extensions: ['', '.js', '.jsx', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
    }),
    new CopyWebpackPlugin([{
      from: 'src/vendor',
      to: 'vendor',
    }]),
  ],
  watch: true,
};
