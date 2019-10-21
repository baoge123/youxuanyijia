// pages/user/buySvip.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      price:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {

        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          rpxHeight: 750 / res.windowWidth * res.windowHeight
        })
      }
    });
  },
  gotoPayVip(){
    wx.navigateTo({
      url: 'paySvip?price='+this.data.price,
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
    getService(this);
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
var getService = function (that) {
  // shuoming
  var params = {
    // openid: wx.getStorageSync("token"),
    active: "vip_serve"
  }
  app.getRequest(params).then((res) => {
    WxParse.wxParse('article', 'html', res.data.content, that, 25);
    that.setData({
      price: res.data.price,
    })
  });
}