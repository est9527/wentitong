// 所有的中间件  迁移到这里
const path = require('path')
//此 koa-static-cache 插件 了解 不能 解析 图片 所以 从新 还使用了 koa-static
const Static = require('koa-static-cache')
// const koaStatic
const koaStatic = require('koa-static')
const nunjucks = require('koa-nunjucks-2')
const bodyParser = require('koa-bodyparser');
// 引入时常的中间件
// const responseDurationMiddleware = require('./response_duration');
// 引入响应头 中间件
const repHeaderMiddleware = require('./response_header');
// 处理json的 响应数据 
const repJsonMiddleware = require('./response_json');
// log4js 日志的使用
const logger = require('./min-log/index.js')
// 处理robots文件
const robots = require('./min-log/robots.js')



module.exports = (app) => {
    // app.use(responseDurationMiddleware);
    // 使用 此 中间件 图片是乱码 应该就是 ctx中type 要修改 现在已经修改 没有设置 以下 这两项
    // 1  const contentType = 'application/json; charset=utf-8';
    // 2 ctx.set('Content-Type', contentType); 
    app.use(repHeaderMiddleware)
    app.use(repJsonMiddleware());
    app.use(logger())

    app.use(bodyParser())

    app.use(robots)


    // 静态资源 css js font 等资源
    app.use(Static(path.join(__dirname, '../public/static/'), {
        prefix: '/',
        gzip: true
    }))
    //   图片上传的资源 根目录 uploads 下
    app.use(koaStatic(path.join(__dirname, '../uploads/')))
    //nunjucks渲染模板
    app.use(nunjucks({

        ext: 'html',
        path: path.join(__dirname, '../public/views'),//视图模板
        nunjucksConfig: {
            trimBlocks: true, //开启转义
            autoescape: true,
            noCache: process.env.NODE_ENV !== 'production', //前端代码更改自动刷新 
        }
    }))
    // const env = new nunjucks.Environment();
    // console.log(nunjucks);
}