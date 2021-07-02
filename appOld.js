const koa = require('koa')
const path = require('path')
const fs = require('fs')
const https = require('https')
const KoaRouter = require('koa-router')
const Static = require('koa-static-cache')
const nunjucks = require('koa-nunjucks-2')
const logger = require('koa-logger')

// 实例化路由
const router = new KoaRouter();
// 根据项目的路径导入生成的证书文件
const privateKey = fs.readFileSync(path.join(__dirname, './cert/wentitong.cn.key'), 'utf8')
const certificate = fs.readFileSync(path.join(__dirname, './cert/wentitong.cn.pem'), 'utf8')
const credentials = {
  key: privateKey,
  cert: certificate,
}

// 创建koa实例
const app = new koa()
// 读取 json 中间件


// 引入时常的中间件
  const responseDurationMiddleware = require('./wentitong/middleware/response_duration');
  app.use(responseDurationMiddleware);
  // 引入响应头 中间件
  const repHeaderMiddleware = require('./wentitong/middleware/response_header');
  app.use(repHeaderMiddleware)


// 静态资源
app.use( Static(path.join(__dirname , 'wentitong/public/static'), {
  prefix : '/',
  gzip: true
}))
//nunjucks渲染模板
app.use(nunjucks({

	ext: 'html',
	path: path.join(__dirname, '/wentitong/public/views'),//视图模板
	nunjucksConfig:{
        trimBlocks: true, //开启转义
        autoescape:true,
        noCache: process.env.NODE_ENV !== 'production', //前端代码更改自动刷新
        
	}
}))

// 引入子路由
const indexRouter = require('./wentitong/router/index')
const articleRouter = require('./wentitong/router/article')



// router.use('/index', indexRouter)
router.use('/', indexRouter)
router.use('/article', articleRouter)

app.use(router.routes())
app.use(router.allowedMethods());
// logger
app.use(logger())
// // 响应 api 的json 数据 
// const responseJsonMiddleware = require('./wentitong/middleware/response_data')

// app.use(responseJsonMiddleware)


// app.use();
// 创建https服务器实例
const httpsServer = https.createServer(credentials, app.callback())

// 设置https的访问端口号
const SSLPORT = 443


// 创建http服务，重定向到https

// 启动服务器，监听对应的端口
httpsServer.listen(SSLPORT, () => {
  console.log(`HTTPS Server is running on: https://localhost:${SSLPORT}`)
})