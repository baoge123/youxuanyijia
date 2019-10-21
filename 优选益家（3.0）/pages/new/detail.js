// pages/new/detail.js
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
  onLoad: function (options) {
    var that=this;
    this.setData({
      type: options.type ? options.type:'',
      id:options.id?options.id:'',
    });
    if (options.type=="service"){
      wx.setNavigationBarTitle({
        title: '服务说明',
      })
      getService(that);
    }else{
      
      getData(that);
    }
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
    active: "service"
  }
  app.getRequest(params).then((res) => {
    WxParse.wxParse('article', 'html', res.data.content, that, 25);

  });
}
var getData= function (that) {
  // shuoming
  var params = {
    // openid: wx.getStorageSync("token"),
    active: "notice_list",
    notice_id:that.data.id,
  }
  app.getRequest(params).then((res) => {
    WxParse.wxParse('article', 'html', res.data.content, that, 25);
    that.setData({
      data: res.data
    });
    wx.setNavigationBarTitle({
      title: res.data.title,
    })
  });
}