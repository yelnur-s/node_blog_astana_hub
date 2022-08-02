const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer');
// для извления css в отдельный файл
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    devServer: {
        static: {
          directory: path.join(__dirname, ''),
        },
        compress: true,
        port: 3000,
      },
  mode: 'development' , 
  entry: ['./js/jquery/jquery-3.4.1.js' , './js/bootstrap/bootstrap.bundle.js' , './lib/easing/easing.min.js' , './lib/owlcarousel/owl.carousel.js' , './mail/jqBootstrapValidation.min.js' , './mail/contact.js' , './js/main.js' , './lib/animate/animate.min.css' , './lib/owlcarousel/assets/owl.carousel.css' , './css/style.css'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
            use: [ MiniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader : "postcss-loader",
                    options: {
                        postcssOptions: {
                            plugins: [
                                "autoprefixer",
                            ]
                        }
                    }
                }
                
            ]
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [new MiniCssExtractPlugin({
    filename: 'all.css',
    chunkFilename: 'all.css'}),
    new webpack.ProvidePlugin({
      $: "jquery",
      masonry: 'masonry-layout'
  })],
  
  resolve: {
    alias: {
      jquery: "jquery"
  }
  },
  mode: 'development'
};