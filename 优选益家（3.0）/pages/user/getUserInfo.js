// pages/user/getUserInfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUser: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("上级id:" + options.user_id);
    console.log("所带参数");
    console.log(options);
    var that=this;
    this.setData({
      up_id: options.user_id ? options.user_id : "",
    });
    // this.setData({
    //   up_id: "1557913438",
    // });
    var token=wx.getStorageSync("token");
    if(!token){
      loginCallback(that);
    }
    var user_id = wx.getStorageSync("user_id");
    var store_id = wx.getStorageSync("store_id");
    if (store_id){
      wx.redirectTo({
        url: '../shop/login',
      })
      return;
    }

    if (!user_id) {
      this.setData({
        isUser: 1,
      });
    } else {
      wx.getUserInfo({
        success: function(e) {
          var userInfo = e.userInfo;
          var params = {
            user_name: userInfo.nickName,
            user_img: userInfo.avatarUrl,
            openid: wx.getStorageSync("token"),
            up_id: that.data.up_id,
            active: "user_add",
          }
          app.getRequest( params).then((res) => {
            console.log("自动登陆成功");
          });
        }
      })
      wx.switchTab({
        url: '../index/index',
      })
    }
    
  },
  bindGetUserInfo: function(e) {
    var that = this;
    // loginCallback(that, function() {
      console.log("opendid:" + wx.getStorageSync("token"));
      var userInfo = e.detail.userInfo;
      if (userInfo) {
        wx.setStorageSync("userInfo", userInfo);
        var params = {
          user_name: userInfo.nickName,
          user_img: userInfo.avatarUrl,
          openid: wx.getStorageSync("token"),
          up_id: that.data.up_id,
          active: "user_add"
        }
        app.getRequest(params).then((res) => {
          wx.setStorageSync("user_id", res.data)
          console.log("登陆成功");
          console.log("绑定上级成功：id:" + that.data.up_id);
          wx.switchTab({
            url: '../user/main'
          })
        });
      }
    // });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})

var loginCallback = function(that, callback) {
  wx.login({
    success: ress => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = ress.code;
      var params = {
        active: "openid",
        js_code: code,
      }
      console.log("登陆CODE"+code);
      wx.request({
        url: wx.getStorageSync('url'),
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        data: params,
        success: function(res) {
          wx.setStorageSync("token", res.data.openid);
          if (callback){
            callback();
          }
        }

      })
    }
  })
}