var path = require('path')
var webpack = require('webpack')

let EntryPath = process.env.NODE_ENV
console.log('EntryPath', EntryPath)
let files = EntryPath.split('/')
let FileName = files[files.length - 1].trim()

console.log('FileName', FileName)
let distPath=EntryPath.replace(FileName,'')
//distPath=distPath.replace('/assets','')
console.log("dispath:",distPath)
module.exports = {
  entry: './public/'+FileName,
  output: {
    path: distPath,
    publicPath: '/dist/',
    filename: FileName.trim()
  },
   module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {}
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_module/
      }, {
        test: /\.(png|jpe?g|gif|ttf|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  }
}
