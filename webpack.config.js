const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const customMainUrl = isProduction 
    ? 'https://custom.shoaibarif.site/remoteEntry.js'
    : 'http://localhost:5000/remoteEntry.js';

  return {
  mode: argv.mode || "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    publicPath: "auto",
    clean: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "postClearanceAudit",
      filename: "remoteEntry.js",
      remotes: {
        customMain: `customMain@${customMainUrl}`
      },
      exposes: {
        "./App": "./src/App.tsx"
      },
      shared: {
        react: { 
          singleton: true,
          requiredVersion: false
        },
        "react-dom": { 
          singleton: true,
          requiredVersion: false
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "Post Clearance Audit"
    })
  ],
  devServer: {
    port: 5002,
    open: false,
    hot: false,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
  };
};
