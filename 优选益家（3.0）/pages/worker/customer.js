// pages/worker/customer.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
    types: [{
      name: "全部客户",
      id: 0,
    }, {
      name: "会员商户",
      id: 1
    }, {
      name: "非会员",
      id: 2
    }, {
      name: "审核中",
      id: 3
    }],
    typeName: 0,

    isAllList: 0,
    page: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  gotoCustomer(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'infos?id='+id,
    })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
var getList = function (that) {
  var params = {
    active: "staff_store_list",
    staff_id: wx.getStorageSync("staff_id"),
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