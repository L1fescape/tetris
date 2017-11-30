const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

module.exports = {
  entry: './index.tsx',
  output: {
    filename: 'bundle.js',
    path: dist
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.d.ts', '.js', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.ejs'
    }),
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
    ]
  }
}
