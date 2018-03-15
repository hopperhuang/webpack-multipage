// 按需引入jquery文件。
import jq from 'jquery'

// 引入我们需要的css
import './index.css'

// 引入ejs模板，html变动时，热更新网页,build打包发布时请删除，减少代码大小。
require('./index.ejs')

function component () {
  var element = document.createElement('div')

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = '这是一个页面'
  console.log(process.env.NODE_ENV)
  console.log(jq)
  return element
}

document.body.appendChild(component())
