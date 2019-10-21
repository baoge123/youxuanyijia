// pages/worker/infos.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    });

  },
  previewImage(e) {
    var img = e.currentTarget.dataset.img,
      ary = e.currentTarget.dataset.ary;
    // debugger
    for(var i=0;i<ary.length;i++){
      ary[i] = this.data.url + ary[i]
    }
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: ary // 需要预览的图片http链接列表
    })
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
    getData(this)
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
var getData = function(that) {
  var params = {
    active: "staff_store",
    store_id: that.data.id,
  }
  app.getRequest(params).then((res) => {
    that.setData({
      info: res.data,
    });
    WxParse.wxParse('article', 'html', res.data.content, that, 25);
  });
}