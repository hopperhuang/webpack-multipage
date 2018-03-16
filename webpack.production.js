const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const postcssPxtorem = require('postcss-pxtorem')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const getFiles = require('./getFile')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 创建extract多个实例, 将抽离的文件放到assets/css目录下,contenthash命名，防止内容更新后，css文件却被304命中
const extractCSS = new ExtractTextPlugin('assets/css/[contenthash]-one.css')
const extractLESS = new ExtractTextPlugin('assets/css/[contenthash]-two.css')

const files = getFiles()
const fileEntrys = {}
const _plugin = []
files.forEach(function (file) {
  // 处理入口
  fileEntrys[file[0]] = file[1]
  // 处理html模板
  _plugin.push(new HtmlWebpackPlugin({ // html webpack plugin配置
    filename: `./${file[0]}/index.html`, // 生成的html存放路径，相对于path
    template: `./src/pages/${file[0]}/index.ejs`,
    inject: 'body', // js插入的位置，true/'head'/'body'/false
    hash: false, // 为静态资源生成hash值
    chunks: [file[0], 'manifest'], // 需要引入的chunk，不配置就会引入所有页面的资源, 一定要引入manifest
    minify: { // 压缩HTML文件
      removeComments: true, // 移除HTML中的注释
      collapseWhitespace: false // 删除空白符与换行符
    },
    links: [
      // 加入reset.css
      '/assets/css/reset.css'
    ],
    scripts: [
      // 引入flex 和 jquery
      '/assets/js/flex.js',
      '/assets/js/jquery.min.js'
    ]
  }))
})
const entry = { ...fileEntrys }
const plugins = [
  extractCSS,
  extractLESS,
  new webpack.HashedModuleIdsPlugin(),
  new CleanWebpackPlugin(['dist']),
  new CopyWebpackPlugin([{ // 转移静态资源文件到特定的文件夹
    from: './src/assets/reset.css',
    // 相对路径，相对于dist文件夹
    to: './assets/css',
    toType: 'dir'
  }, {
    from: './src/assets/flex.js',
    // 相对路径，相对于dist文件夹
    to: './assets/js',
    toType: 'dir'
  }, {
    from: './src/assets/jquery.min.js',
    // 相对路径，相对于dist文件夹
    to: './assets/js',
    toType: 'dir'
  }]),
  ..._plugin]

module.exports = {
  entry,
  output: {
    // 利用文件内容hash来做缓存
    filename: 'assets/js/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    // 打包上传时，这里应该填写cdn路径, 将文件上传到cdn/assets/文件夹下，否则不会起作用
    publicPath: '/'
  },
  module: {
    rules: [
      // 抽离css到head
      {
        test: /\.css$/,
        use: extractCSS.extract([
          'css-loader',
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
        ])
      },
      // 抽离css到head
      {
        test: /\.less$/,
        use: extractLESS.extract([
          'css-loader',
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
          'less-loader'
        ])
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
  externals: {
    'jquery': '$'
  },
  devtool: 'source-map',
  optimization: { // 分离运行时代码
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins
}
