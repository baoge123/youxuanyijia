// pages/money/record.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllList: 1,
    page: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      store_id: options.store_id ? options.store_id:'',
    });
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
    var store_id = this.data.store_id;
    
    getList(this);
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
    var that = this;
    this.setData({
      page: that.data.page + 1,
    });
    if (that.data.isAllList == 1) {
      wx.showToast({
        title: '已加载全部数据..',
        icon: "none"
      })
    } else
      getList(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// active tixian user_id
var getList=function(that){
  var store_id = that.data.store_id;
  
  var params = {
    active: "tixian",
    user_id: wx.getStorageSync("user_id"),
    // status: that.data.typeName,
    page: that.data.page,
  }
  var params2 = {
    active: "store_cash",
    store_id: store_id,
    page: that.data.page,
  }
  params = store_id ? params2 : params;
  app.getRequest(params).then((res) => {
    if (res.data.length == 0) {
      that.setData({
        isAllList: 1
      });
    } else {
      var list = that.data.list;
      var ordata = res.data;
      for (var i = 0; i < ordata.length; i++) {
        list.push(ordata[i]);
      }
      that.setData({
        list: list,
        isAllList: 2
      });
    }
  });
}