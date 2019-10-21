// pages/index/hotProductLi.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
    type: 0,
    list: [],
    isAllList: 0,
    page: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;

    this.setData({
      id: id,
    });
    getData(this);
  },
  gotoDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../good/detail?id=' + id,
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
    var that = this;
    this.setData({
      page: that.data.page + 1,
    });
    if (that.data.isAllList == 0) {
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

var getData = function (that, callback) {
  var status = that.data.type;
  status = status == 3 ? (that.data.isPrice == 1 ? 3 : 4) : (that.data.pxNum == 0 ? 1 : status);
  var params = {
    active: "goods",
    class_id: that.data.id,
    num: that.data.page,
    status: status,//0中和排序 1评论数量 2销量 3价格搞到底  4价格底到高
  }
  app.getRequest(params).then((res) => {
    var list = that.data.list;
    if (res.data.length == 0) {
      that.setData({
        isAllList: 1
      });
    } else {
      for (var i = 0; i < res.data.length; i++) {
        list = list.concat(res.data[i]);
      }
      that.setData({
        list: list,
        isAllList: 2
      });
    }
    if (callback) {
      callback();
    }
  });
}