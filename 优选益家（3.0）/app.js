//app.js
App({
  onLaunch: function() {
    var that = this;
    // wx19a031580c28cdca http://yjxcx.sccxbe.com/5cc5210253bcb.jpg
    // 2d7ef61b4e1c02c2eaaea93dc8cb6a16
    // wx.setStorageSync("url", "https://yjxcx.sccxbe.com");
    wx.setStorageSync("url", "https://www.iyxyj.com")
  },
  getRequest: function(params,method) {
    wx.showLoading({
      title: '加载中',
    })
    let promise = new Promise(function(resolve, reject) {
      wx.request({
        url: wx.getStorageSync('url'),
        method: method ? method:'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        data: params,
        success: function(res) {
          wx.hideLoading();
          if (res.data.code != 0) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
            })
            return;
          }
          resolve(res.data);
        }

      })
    });
    return promise
  },

  //计算图片高度事件
  viewImg: function(width, height, winWidth) {
    var ratio = width / height,
      viewHeight = winWidth / ratio;
    return viewHeight;
  },
  /* 验证手机号 */
  testPhone: function(phone) {
    var reg = /^1(3|4|5|7|8|9)\d{9}$/;
    if (!(reg.test(phone))) {
      wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      return true;
    }
  },
  globalData: {
    userInfo: null
  }
})