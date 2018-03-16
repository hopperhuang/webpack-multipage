const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const postcssPxtorem = require('postcss-pxtorem')
const webpack = require('webpack')
const getFiles = require('./getFile')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const files = getFiles()
const fileEntrys = {}
const _plugin = []
files.forEach(function (file) {
  // 处理入口
  fileEntrys[file[0]] = file[1]
  // 处理html模板
  _plugin.push(new HtmlWebpackPlugin({ // html webpack plugin 配置
    filename: `./${file[0]}/index.html`, // 生成的html存放路径，相对于path
    template: `./src/pages/${file[0]}/index.ejs`,
    inject: 'body', // js插入的位置，true/'head'/'body'/false
    hash: false, // 为静态资源生成hash值
    chunks: [file[0]], // 需要引入的chunk，不配置就会引入所有页面的资源
    links: [
      // 加入reset.css
      '/assets/css/reset.css'
    ],
    scripts: [
      // 引入flex
      '/assets/js/flex.js'
    ]
  }))
})
const entry = { ...fileEntrys }
const plugins = [new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new CleanWebpackPlugin(['dist']),
  new CopyWebpackPlugin([{
    from: './src/assets/reset.css',
    // 相对路径，相对于dist文件夹
    to: './assets/css',
    toType: 'dir'
  }, {
    from: './src/assets/flex.js',
    // 相对路径，相对于dist文件夹
    to: './assets/js',
    toType: 'dir'
  }]),
  ..._plugin]

module.exports = {
  entry,
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    // 打包上传时，这里应该填写cdn路径
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: [
                    '> 1%',
                    'last 2 versions'
                  ]
                }),
                postcssPxtorem({
                  rootValue: 37.5,
                  unitPrecision: 5,
                  propList: ['*'],
                  selectorBlackList: [],
                  replace: true,
                  mediaQuery: false,
                  minPixelValue: 2
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              modules: false,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: [
                    '> 1%',
                    'last 2 versions'
                  ]
                }),
                postcssPxtorem({
                  rootValue: 37.5,
                  unitPrecision: 5,
                  propList: ['*'],
                  selectorBlackList: [],
                  replace: true,
                  mediaQuery: false,
                  minPixelValue: 2
                })
              ]
            }
          },
          {
            loader: 'less-loader' // compiles Less to CSS
          }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // 将图片生成到dist/assets文件夹
              name: 'assets/img/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      { test: /\.ejs$/, loader: 'ejs-loader' }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true,
    // 打开页面
    openPage: 'module_one/index.html'
  },
  plugins
}
