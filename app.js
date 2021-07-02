const http2 = require('http2')
// const https = require('http2')
const koa = require('koa')
const path = require('path')
const fs = require('fs')
// const https = require('https')
const KoaRouter = require('koa-router')
const Static = require('koa-static-cache')
const nunjucks = require('koa-nunjucks-2')
// var net =require('net');
const middleWare = require('./wentitong/middleware/index')



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
// app.use((ctx, next) => {
//     console.log(ctx);
//     next()
// });


middleWare(app);

// 引入子路由
const indexRouter = require('./wentitong/router/index')
const articleRouter = require('./wentitong/router/article')
// 搜索页面
const searchRouter = require('./wentitong/router/search')
// html 文档
// const htmlRouter = require('./wentitong/router/html')
// // css js 文档
// const cssRouter = require('./wentitong/router/css')
// const jsRouter = require('./wentitong/router/js')

// 所有文档的 入口
const docRouter = require('./wentitong/router/doc')
// 所有文档的 介绍
const navigationRouter = require('./wentitong/router/navigation')

// test router
const testRouter = require('./wentitong/router/test')


// api 全局访问的路口
const apiRouter = require('./wentitong/router/api');
// sitemap.html 页面
const sitemapRouter = require('./wentitong/router/sitemap')
// 后台地址 xin
const xinRouter = require('./wentitong/router/xin')
// 手机端 wap
const wapRouter = require('./wentitong/router/wap')

const userRouter = require('./wentitong/router/user')
// google的验证
// const googleRouter = require('./wentitong/router/google8b82122c9116fb07')

// router.use('/index', indexRouter) 前台地址
router.use('/', indexRouter);
router.use('/article', articleRouter);
// router.use('/html', htmlRouter);
// router.use('/css', cssRouter);
// router.use('/js', jsRouter);
router.use('/test', testRouter);
router.use('/doc', docRouter);
router.use('/navigation', navigationRouter);
router.use('/api', apiRouter);
router.use('/sitemap', sitemapRouter);
router.use('/search', searchRouter);

// router.use('/google8b82122c9116fb07.html', googleRouter);



// 后台地址
router.use('/xin', xinRouter);

router.use('/wap', wapRouter);
// 用户地址
router.use('/user', userRouter);

// 没有的路由处理办法 * 或者 /* 都报错 只有 /(.*)才能正常匹配
router.all('/(.*)', async (ctx, next) => {
  ctx.response.status = 404

  ctx.response.body = "<h2>I LIKE U !</h2>";
})

app.use(router.routes())
app.use(router.allowedMethods()); //允许设置 响应头
// logger
// app.use(logger())


// app.use();
// 创建https服务器实例
// const httpsServer = https.createServer(credentials, app.callback())
const http2Server = http2.createSecureServer(credentials, app.callback())

// 设置https的访问端口号
const SSLPORT = 443

// 启动服务器，监听对应的端口
http2Server.listen(SSLPORT, () => {
  console.log(`HTTPS Server is running on: https://localhost:${SSLPORT}`)
})


// console.log(httpsServer);
