import './index.less'

function component () {
  var element = document.createElement('div')
  const a = 1
  console.log(a)

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = '这是这组件是又静态页面的scrpit生成的。第二个静态页面'
  console.log(process.env.NODE_ENV)

  return element
}

document.body.appendChild(component())
