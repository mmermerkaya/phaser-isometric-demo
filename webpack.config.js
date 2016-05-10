const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/build/`,
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
    root: `${__dirname}/src/`,
    extensions: ['', '.js', '.jsx', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
};
