const common = require('./webpack.common');
const {merge} = require('webpack-merge');
const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common,{
  mode: "production",
  output: {
    filename: "main.[contenthash].js",
    publicPath: '/',
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: "[name].[contenthash].css"
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ]
  }
});