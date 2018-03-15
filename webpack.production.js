const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const postcssPxtorem = require('postcss-pxtorem')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// 创建extract多个实例, 将抽离的文件放到assets/css目录下,contenthash命名，防止内容更新后，css文件却被304命中
const extractCSS = new ExtractTextPlugin('assets/css/[contenthash]-one.css')
const extractLESS = new ExtractTextPlugin('assets/css/[contenthash]-two.css')

module.exports = {
  entry: {
    module_one: './src/pages/module_one/index.js',
    module_two: './src/pages/module_two/index.js',
    flex: './src/assets/flex.js'
  },
  output: {
    // 利用文件内容hash来做缓存
    filename: 'assets/js/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    // 打包上传时，这里应该填写cdn路径
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
  plugins: [
    extractCSS,
    extractLESS,
    new webpack.HashedModuleIdsPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
      // favicon路径，通过webpack引入同时可以生成hash值
      // favicon: './src/img/favicon.ico',
      filename: './module_one/index.html', // 生成的html存放路径，相对于path
      // template: 'html-withimg-loader!' + path.resolve(__dirname, 'src/pages/module_one/index.ejs'), // html模板路径
      template: './src/pages/module_one/index.ejs',
      inject: 'body', // js插入的位置，true/'head'/'body'/false
      hash: false, // 为静态资源生成hash值
      chunks: ['module_one', 'manifest', 'flex'], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      },
      title: 'm1',
      links: [
        // 加入reset.css
        'https://cdn.bootcss.com/minireset.css/0.0.2/minireset.css'
      ]
    }),
    new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
      // favicon路径，通过webpack引入同时可以生成hash值
      // favicon: './src/img/favicon.ico',
      filename: './module_two/index.html', // 生成的html存放路径，相对于path
      // template: 'html-withimg-loader!' + path.resolve(__dirname, 'src/pages/module_two/index.ejs'), // html模板路径
      template: './src/pages/module_two/index.ejs',
      inject: 'body', // js插入的位置，true/'head'/'body'/false
      hash: false, // 为静态资源生成hash值
      chunks: ['module_two', 'manifest', 'flex'], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      },
      title: 'm2',
      links: [
        // 加入reset.css
        'https://cdn.bootcss.com/minireset.css/0.0.2/minireset.css'
      ]
    })
  ]
}
