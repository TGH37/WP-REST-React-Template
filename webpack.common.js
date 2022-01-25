const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        removeComments: true,
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
        test: /\.jsx|js|tsx|ts?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.png|jpg|gif$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs"
          }
        },
      },
     
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", 
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "svgs"
            }
          }
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
};