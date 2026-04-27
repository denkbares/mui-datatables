const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: ["./examples/Router/index.js"],
  },
  stats: "verbose",
  context: __dirname,
  output: {
    filename: "bundle.js",
    publicPath: "/",
  },
  devtool: "source-map",
  devServer: {
    allowedHosts: "all",
    host: "localhost",
    hot: true,
    port: 5050,
    historyApiFallback: true,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get(
        "/.well-known/appspecific/com.chrome.devtools.json",
        (_req, res) => {
          res.status(204).end();
        }
      );

      return middlewares;
    },
    headers: {
      "Content-Security-Policy": [
        "default-src 'none'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "img-src 'self' data: blob:",
        "connect-src 'self' http://localhost:5050 ws://localhost:5050 http://127.0.0.1:5050 ws://127.0.0.1:5050",
      ].join("; "),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Examples</title>
          </head>
          <body>
            <div id="app-root"></div>
          </body>
        </html>
      `,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
};