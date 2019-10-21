// pages/user/my/ubi.js
var app=getApp();
var WxParse = require('../../../wxParse/wxParse.js');
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
      id: 1,
      tid: 1
    }, {
      name: "支出",
      id: 2,
      tid: 3
    }],
    typeName: 0,
    showModel:0,

    isAllList: 1,
    page: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getUbiService(this)
  },
  selectType(e){
    var id = e.currentTarget.dataset.id, that = this;
    this.setData({
      typeName: id,

      isAllList: 1,
      page: 1,
      list: [],
    })
    getList(that);
  },
  gotoShowMode(){
    this.setData({
      showModel: this.data.showModel==1?0:1,

    });
  },
  //赠与好友
  ubiTurn(){
    wx.navigateTo({
      url: 'ubiTurn?num=' + this.data.userData.u_num,
    })
  },
  gotoHiddenModel(){
    this.setData({
      showModel:0,
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
    getUserData(this);
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
// 获取用户信息
var getUserData = function (that) {
  var params = {
    openid: wx.getStorageSync("token"),
    active: "user"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      userData: res.data
    });
  });
}
var getUbiService=function(that){
  // shuoming
  var params = {
    // openid: wx.getStorageSync("token"),
    active: "shuoming"
  }
  app.getRequest(params).then((res) => {
    WxParse.wxParse('article', 'html', res.data.content, that, 25);
    that.setData({
      userData: res.data
    });
  });
}
var getList = function (that) {
  var params = {
    active: "user_u",
    user_id: wx.getStorageSync("user_id"),
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