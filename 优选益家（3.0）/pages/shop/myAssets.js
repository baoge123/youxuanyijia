// pages/user/myAssets.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [{
      name: "全部",
      id: 0,
    }, {
      name: "收入",
      id: 1
    }, {
      name: "支出",
      id: 2
    }, {
      name: "待核销",
      id: 3
    }, {
      name: "待入账",
      id: 4
    }],
    typeName: 0,

    isAllList: 0,
    page: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  selectType(e) {
    var typeName = e.currentTarget.dataset.id;
    if (typeName != this.data.typeName) {
      this.setData({
        isAllList: 1,
        page: 1,
        list: [],
        typeName: typeName,
      });
      getList(this);
    }
  },
  //充值
  gotoRecharge() {
    wx.navigateTo({
      url: '../money/recharge',
    })
  },
  //提现
  gotoMonyeGet() {
    wx.navigateTo({
      url: '../money/get?money=' + this.data.shopInfo.blance+"&store_id="+this.data.shopInfo.id,
    })
  },

  //佣金明细
  commissionDetail() {
    wx.navigateTo({
      url: 'my/commissionDetail',
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
    getShopInfo(this);
    this.setData({
      isAllList: 1,
      page: 1,
      list: [],
    });
    getList(this);
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
      getOrderList(that);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
var getShopInfo = function(that, id) {
  // goods_list goods_id
  var params = {
    active: "store_list",
    store_id: wx.getStorageSync("store_id"),
    // openid: wx.getStorageSync("token"),
  }
  app.getRequest(params).then((res) => {
    that.setData({
      shopInfo: res.data,
    });
  });
}
var getList = function (that) {
  var params = {
    active: "store_profit_too",
    store_id: wx.getStorageSync("store_id"),
    status: that.data.typeName,
    page: that.data.page,
  }
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