const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        // removeComments: true,
      }
    }),
  ],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.jsx|js?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.tsx|ts?$/,
        use: ['babel-loader','ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.png|gif$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs"
          }
        },
      },
      {
        test: /\.jpg$/,
        use: ["optimized-images-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack","file-loader"],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
};