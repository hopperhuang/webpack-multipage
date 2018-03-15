# webpack-multipage


## Getting Started

Install dependencies.

```bash
$ npm i
```
```bash
$ npm i serve -g
```

Start dev server.

```bash
$ npm start
```

Build.

```bash
$ npm run build
```

Serve

```bash
$ npm run serve
```

import pictures

```
// index.ejs
<img src="${ require('../../assets/panghu.jpg') }">
```

import css/less

```
// index.js
import './index.css'
```

hotRealoadHtml

```
// index.js
require('./index.ejs') // you should remove this statement to minimize to package's size when you build your project
```


Feature:
1. hot reload html
2. auto link flex.js, rem = 37.5
3. import jquery for development
4. package css style into static css file when build

structure:
 ```
project
│   README.md
│      
│
└───src
    │--- assets
    │      │___ flex.js
    │
    └───pages
        │   
        │___module_one   
                │
                │___ index.ejs(required)
                │___ index.js(required)
                │___ index.css(required)
               .

```

