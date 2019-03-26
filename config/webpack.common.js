const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const constants = require('./webpack.constants.js');
const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins');

module.exports = {
  entry: './src/index.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'config/postcss.config.js'
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader?classPrefix',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.jsx', '.js', '.css' ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './assets/index.html'
    }),
    new BugsnagSourceMapUploaderPlugin({...constants.BUGSNAG, overwrite: true}),
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist')
  },
  optimization: {
    minimizer: [new UglifyJSPlugin({ sourceMap: true })],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
  },

};
