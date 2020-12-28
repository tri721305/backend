const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const common = require('./webpack.common.js');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    /*
     * Plugin: MiniCssExtractPlugin
     * Description: This plugin extracts CSS into separate files.
     * It creates a CSS file per JS file which contains CSS.
     * It supports On-Demand-Loading of CSS and SourceMaps.
     * See: https://github.com/webpack-contrib/mini-css-extract-plugin
     */
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
      chunkFilename: '[id].[fullhash].css',
    }),
    /*
     * Plugin: CleanWebpackPlugin
     * Description: A webpack plugin to remove/clean your build folder(s).
     * See: https://github.com/johnagan/clean-webpack-plugin
     */
    new CleanWebpackPlugin(),
    new IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      /*
       * Plugin: TerserWebpackPlugin
       * Description: This plugin uses terser to minify your JavaScript.
       * See: https://webpack.js.org/plugins/terser-webpack-plugin
       */
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
});
