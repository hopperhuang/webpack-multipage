const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const postcssPxtorem = require('postcss-pxtorem')
const webpack = require('webpack')

module.exports = {
  entry: {
    module_one: './src/pages/module_one/index.js',
    module_two: './src/pages/module_two/index.js',
    flex: './src/assets/flex.js'
  },
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
    openPage: '/module_one/index.html'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
      // favicon路径，通过webpack引入同时可以生成hash值
      // favicon: './src/img/favicon.ico',
      filename: './module_one/index.html', // 生成的html存放路径，相对于path
      // template: 'html-withimg-loader!' + path.resolve(__dirname, 'src/pages/module_one/index.ejs'), // html模板路径
      template: './src/pages/module_one/index.ejs',
      inject: 'body', // js插入的位置，true/'head'/'body'/false
      hash: false, // 为静态资源生成hash值
      chunks: ['module_one', 'flex'], // 需要引入的chunk，不配置就会引入所有页面的资源
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
      chunks: ['module_two', 'flex'], // 需要引入的chunk，不配置就会引入所有页面的资源
      title: 'm2',
      links: [
        // 加入reset.css
        'https://cdn.bootcss.com/minireset.css/0.0.2/minireset.css'
      ]
    })
  ]
}
