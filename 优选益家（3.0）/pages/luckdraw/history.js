// pages/luckdraw/history.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    url:wx.getStorageSync("url"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getData(this);
  },
  //获取奖品
  getJp(e){
    var id = e.currentTarget.dataset.id, pname = e.currentTarget.dataset.pname, pimg = e.currentTarget.dataset.pimg;
    wx.navigateTo({
      url: 'receive?id='+id+"&pname="+pname+"&pimg="+pimg,
    })
  },
  selectType(e){
    var type = e.currentTarget.dataset.type;
    this.setData({
      type:type,
    });
    getData(this);
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
    getData(this);
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
var getData= function (that) {
  // shuoming
  var params = {
    active: "user_active",
    user_id: wx.getStorageSync("user_id"),
    status:that.data.type
  }

  app.getRequest(params).then((res) => {
    that.setData({
      list:res.data
    });
  });
}