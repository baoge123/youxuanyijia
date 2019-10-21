// pages/luckdraw/winningList.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      aid:options.aid?options.aid:"",
      gid:options.gid?options.gid:""
    });
    getData(this);
  },
  lookGz(){
    wx.navigateTo({
      url: 'detail?gid='+this.data.gid,
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

var getData = function (that, callback) {
  var params = {
    active: "active_user",
    active_id: that.data.aid,
  }
  app.getRequest(params).then((res) => {
      that.setData({
        list:res.data
      })
  });
}