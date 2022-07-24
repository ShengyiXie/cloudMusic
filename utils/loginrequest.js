// 发送ajax请求
import config from "./config";
//暴露出去，所以封装成一个函数，动态的数据传入
export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        //1.new Promise初始化promise实例的状态为pending
        wx.request({
            url: config.host1 + url,
            data,
            method,
            // 发送cookies要设置请求头
            header: {
                cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
            },
            success: (res) => {
                //console.log(res);
                if (data.isLogin) {//登录请求
                    //将用户的cookie存入至本地
                    wx.setStorage({
                        key: 'cookies',
                        data: res.cookies
                    })

                }
                //2.成功执行resolve,修改promise的状态为成功resolved
                resolve(res.data);
            },
            fail: (err) => {
                // console.log(err);
                //修改promise的状态为失败rejected
                reject(err);
            }
        })
    })
}