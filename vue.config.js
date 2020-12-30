// vue.config.js 配置说明
// 这里只列一部分，具体配置惨考文档啊
module.exports = {
    devServer: {
        disableHostCheck: true,
        port: 8080, // 端口号
        // host: '192.168.31.147',
        // host: 'localhost',
        host: '0.0.0.0',
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy: {
            '/api': {
                // target: 'http://localhost:8091/',
                target: 'http://192.168.1.62:8091',
                // target: 'http://192.168.31.157:8090/',//吴工
                // target: 'http://192.168.31.114:8090/',//小杨
                // target: ' http://localhost:8090/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }, // 配置多个代理
    }
}