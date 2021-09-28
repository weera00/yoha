const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const PRODUCTION = !!process.env.PRODUCTION;

module.exports = (env) => {
  const config = {
    mode: PRODUCTION ? 'production' : 'development',
    devtool: 'inline-source-map',
    devServer: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      },
      contentBasePublicPath: ['/'],
      https: true,
      host: '0.0.0.0',
      port: 8090,
      disableHostCheck: true,
      historyApiFallback: {
        disableDotRule: true,
      },
      watchOptions: {
        ignored: [
          path.resolve(__dirname, 'node_modules'),
        ]
      },
    },
    output: {
      path: path.resolve(__dirname, 'www'),
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/demos/draw/index.html',
        filename: 'index.html',
        chunks: ['draw'],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {from: 'node_modules/yoha/', to: 'yoha/'},
          {from: 'node_modules/coi-serviceworker/coi-serviceworker.min', to: './'},
        ]
      })
    ],
    optimization: {
      minimizer: [new TerserPlugin({
        extractComments: false,
        exclude: /\.min\./,
      })],
    },
    module: {
      rules: [
        {
          test: /\.wasm$/i,
          type: 'javascript/auto',
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    entry: {
      draw: {
        import: './src/demos/draw/entry.ts',
        filename: 'draw.js',
      },
    }
  };

  return [config];
}