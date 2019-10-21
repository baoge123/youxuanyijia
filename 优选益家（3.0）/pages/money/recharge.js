// pages/money/recharge.js
var app=getApp();
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

  },
  //确认充值
  gotoSure(){
    var money=this.data.money;
    if(!money){
      wx.showToast({
        title: '请输入充值金额',
        icon:"none",
      })
      return
    }
    var params = {
      user_id: wx.getStorageSync("user_id"),
      active: "profit_add",
      price:that.data.money,
    }
    app.getRequest(params).then((res) => {
      debugger
    });
  },
  moneyInput(e){
    this.setData({
      money:e.detail.value,
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