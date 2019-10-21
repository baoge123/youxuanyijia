// pages/money/get.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // url: 'ubiget?u_num=' + this.data.shopInfo.u_num + "&blance=" + this.data.shopInfo.blance,
    // this.setData({
    //   u_num: options.u_num ? options.u_num:0,
    //   blance: options.blance ? options.blance:0,
    // });
  },

  gotoSureSend() {
    var store_u = this.data.store_u,that=this,
    unum = this.data.shopInfo.u_num;
    if (!store_u) {
      wx.showToast({
        title: '请输入结算数量',
        icon: "none"
      })
      return;
    }
    if (store_u > unum) {
      wx.showToast({
        title: '结算U币大于可结算U币',
        icon: "none"
      })
      return;
    }
    if (store_u % 10 != 0) {
      wx.showToast({
        title: '请结算的数量以10U币为单位',
        icon: "none"
      })
      return
    } 
      var params = {
        store_id: that.data.shopInfo.id,
        active: "balance",
        store_u: that.data.store_u
      }
      app.getRequest(params).then((res) => {
        wx.showToast({
          title: '本次结算已成功，请在账户余额中查看',
          icon: "none"
        })
        that.setData({
          store_u:'',
        });
        setTimeout(function () {
          // wx.navigateBack({})
          getShopInfo(that);
        }, 1000);
      });
  },
  gotoTxjl() {
    wx.navigateTo({
      url: 'record',
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
  },
  store_uIpt(e) {
    var unum = this.data.shopInfo.u_num;
    if (e.detail.value > unum) {
      wx.showToast({
        title: '结算U币大于可结算U币',
        icon: "none"
      })
      this.setData({
        store_u: unum,
      })
    } else if (e.detail.value  % 10 != 0 ){
      wx.showToast({
        title: '结算的数量以10U币为单位',
        icon: "none"
      })
    } 
    //  {
      this.setData({
        store_u: e.detail.value,
      })
    // }
  },
  //计算100的整数
  intNumber(num) {
    // var num=num;
    var total = parseInt(num / 10)
    return total * 10;
  },
  gotoAllUbi(e) {
    var total = parseInt(this.data.shopInfo.u_num / 10);
    this.setData({
      store_u: total * 10
    })
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
      usedUbi: parseInt(res.data.u_num / 10) * 10
    });
  });
}