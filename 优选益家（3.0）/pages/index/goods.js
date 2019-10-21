// pages/index/goods.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
    hotgoods:[],
    img:[],
    page:1,
    isAllList: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    gethaohuo(this)
    getpage(this)
  },
  gotoHotProduct(e) {
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync("goods_id1", id);
    if (id) {
      wx.navigateTo({
        url: '../good/detail?id=' + id,
      })
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
      gethaohuo(that)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

// 大牌好货
var gethaohuo = function (that) {
  var params = {
    active: "goods_special_select",
    status: wx.getStorageSync("index_status"),
    page:that.data.page,
  }
  app.getRequest(params).then((res) => {
    var hotgoods = that.data.hotgoods;
    if (res.data.length == 0) {
      wx.showToast({
        title: '已加载全部数据..',
        icon: "none"
      })
      that.setData({
        isAllList: 1
      });
    } else {
      for (var i = 0; i < res.data.length; i++) {
        hotgoods = hotgoods.concat(res.data[i]);
      }
      that.setData({
        hotgoods: hotgoods,
        isAllList: 2
      });
    }
    // WxParse.wxParse('article', 'html', res.data.content, that, 25);

  });
}

var getpage = function (that) {
  var params = {
    active: "index_active",
    id: wx.getStorageSync("index_status")
  }
  app.getRequest(params).then((res) => {
    that.setData({
      img: res.data,
    });
    // WxParse.wxParse('article', 'html', res.data.content, that, 25);

  });
}