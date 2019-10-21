// pages/user/paySvip.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      price: options.price?options.price:0,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getUserData(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  sendOrder(){
    if (!wx.getStorageSync('token')){
      wx.showToast({
        title: '请先登录',
      })
     }else{
      var params = {
        openid: wx.getStorageSync("token"),
        active: 'pay',
        // order_id: ress.data,
      }

      wx.request({
        url: wx.getStorageSync('url'),
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        data: params,
        success: function (payargs) {
          wx.hideLoading();

          if (payargs.data.code == 0) {
            var pay = payargs.data.data[0];
            wx.requestPayment({
              timeStamp: pay.time.toString(),
              nonceStr: pay.nonce_str,
              package: "prepay_id=" + pay.prepay_id,
              signType: "MD5",
              paySign: pay.paysign,
              'success': function (res) {
                //支付成功
                console.log(res);
                var params = {
                  user_id: wx.getStorageSync("user_id"),
                  active: "vip"
                }
                app.getRequest(params).then((ress) => {
                  wx.showToast({
                    title: '购买成功啦',
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                    })
                  }, 2000)
                });

              },
              'fail': function (res) {
                console.log(res);
                wx.showToast({
                  title: '支付失败',
                  icon: "none"
                })
                // setTimeout(function () {
                //   wx.navigateTo({
                //     url: '../order/list?id=2&name=待支付'
                //   })
                // }, 2000);
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: payargs.data.msg,
            })
          }
        }

      })
     }
   

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// 获取用户信息
var getUserData = function (that) {
  var params = {
    openid: wx.getStorageSync("token"),
    active: "user"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      userData: res.data
    });
  });
}