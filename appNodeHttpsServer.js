const https = require('https')
const path = require('path')
const fs = require('fs')

// 根据项目的路径导入生成的证书文件
// console.log(__dirname);
const privateKey = fs.readFileSync(path.join(__dirname, './cert/wentitong.cn.key'), 'utf8')
const certificate = fs.readFileSync(path.join(__dirname, './cert/wentitong.cn.pem'), 'utf8')
const credentials = {
  key: privateKey,
  cert: certificate,
}
// console.log(https);
// 创建https服务器实例
const httpsServer = https.createServer(credentials, (req, res) => {
  res.writeHead(200)
  res.end(`i am your father who are you!`)
})


const SSLPORT = 443

httpsServer.listen(SSLPORT, () => {
  console.log(`HTTPS Server is running on: https://localhost:${SSLPORT}`)
})



