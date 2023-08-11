const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust the path to your main entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Adjust the output path as needed
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // If you're using Babel for transpilation
        },
      },
    ],
  },
  // Other webpack configuration options
};