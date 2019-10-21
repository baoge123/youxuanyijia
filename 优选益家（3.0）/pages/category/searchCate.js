// pages/category/searchCate.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
    list: [],
    isAllList: 0,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      key: options.key ? options.key : '',
    });
    getData(this);
  },
  //店铺详情
  gotoShopDetail(e){
    debugger
    var id = e.currentTarget.dataset.id;
    if(id){
      wx.navigateTo({
        url: '../shop/shop?id=' + id,
      })
    }
  },
  keyInput(e) {
    this.setData({
      key: e.detail.value
    });
  },
  gotoSerchShop() {
    this.setData({
      list: [],
      isAllList: 0,
      page: 1,
    })
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
      getData(that);
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})

var getData = function (that, callback) {
  var params = {
    active: "store_select",
    goods_class: that.data.key,
    page: that.data.page,
  }
  app.getRequest(params).then((res) => {
    var list = that.data.list;
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