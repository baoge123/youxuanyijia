// pages/luckdraw/detail.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // debugger
    this.setData({
      type: options.type ? options.type : '',
      gid: options.gid ? options.gid : "",
    })
    getService(this);
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
  onShareAppMessage: function() {

  }
})

var getService = function(that) {
  // shuoming
  var params = {
    active: "active_shuoming"
  }
  var params2 = {
    goods_id: that.data.gid,
    active: "active_serve"
  }
  params = that.data.gid ? params2 : params;
  app.getRequest(params).then((res) => {
    WxParse.wxParse('article', 'html', res.data.content, that, 25);
    if (!that.data.gid) {
      wx.setNavigationBarTitle({
        title: res.data.title,
      })
    }
  });
}