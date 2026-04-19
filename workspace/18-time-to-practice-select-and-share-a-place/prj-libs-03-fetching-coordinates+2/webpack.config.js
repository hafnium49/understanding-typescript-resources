const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    // Load environment variables from the workspace-root .env file
    // (three directory levels up from this project: prj-libs-XX/ →
    // 18-time-to-practice-…/ → workspace/ → repository root).
    // dotenv-webpack uses webpack's DefinePlugin internally to replace
    // every process.env.VAR reference in the bundled code with a
    // literal string at build time.
    new Dotenv({
      path: path.resolve(__dirname, '../../../.env')
    })
  ]
};
