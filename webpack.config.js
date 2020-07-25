const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'client', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Steam Reviews',
      template: path.resolve(__dirname, 'public', 'template.html'),
      cdnModule: 'react'
    }),
    new WebpackCdnPlugin({
      modules: {
        'react': [
          { name: 'react', var: 'React', path: `umd/${process.env.NODE_ENV === 'production' ? 'react.production.min.js' : 'react.development.js'}` },
          { name: 'react-dom', var: 'ReactDOM', path: `umd/${process.env.NODE_ENV === 'production' ? 'react-dom.production.min.js' : 'react-dom.development.js'}` }
        ]
      }
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    proxy: {
      '/': 'http://localhost:3001'
    },
    contentBase: path.resolve(__dirname, 'public'),
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'client'),
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        include: [
          path.resolve(__dirname, 'client')
        ],
        loader: ['style-loader', 'css-loader']
      }
    ],
  }
};
