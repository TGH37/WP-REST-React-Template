const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "main.[contenthash].js",
    publicPath: '/',
    path: path.resolve(__dirname, "dist"),
  },
  // devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),

  ],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".ts", ".tsx", ".jsx", ".js"],
  },
  devServer: {    
    historyApiFallback: true,
 },
  module: {
    rules: [
      {
        test: /\.js|jsx|tsx|ts?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", {loader: "css-loader", options: {modules: {localIdentName: "[name]__[local]"}}}, "sass-loader"],
      },
      {
        test: /\.png|jpg|gif$/,
        use: ["file-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack","file-loader"],
      },
    ],
  },
};