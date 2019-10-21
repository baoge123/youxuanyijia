// pages/money/get.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    biliPrice:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // url: '../money/get?money=' + this.data.shopInfo.blance + "&store_id=" + this.data.shopInfo.id,
    this.setData({
      balance: options.money ? options.money : 0,
      store_id: options.store_id ? options.store_id : '',
    });
    activeTixianSelect(this);
  },
  //
  gotoSureAction() {
    var that = this;
    var allMoney = parseInt(this.data.allMoney), balance = parseInt( this.data.balance);
    var store_id = this.data.store_id;
    if (!allMoney) {
      wx.showToast({
        title: '请输入提现金额',
        icon: "none"
      })

      return;
    }
    if (allMoney <10) {
      wx.showToast({
        title: '提现金额不得小于10元',
        icon: "none"
      })
      return;
    }
    if (allMoney > balance){
      wx.showToast({
        title: '已超过可提现金额',
        icon: "none"
      })
      return;
    }
    if (allMoney > 20000) {
      wx.showToast({
        title: '单笔最多提现20000元',
        icon: "none"
      })
      return;
    }
    if (store_id) {
      var params = {
        store_id: store_id,
        active: "store_profit",
        price: that.data.allMoney
      }
      app.getRequest(params).then((res) => {
        wx.showToast({
          title: '已提交审核，请在提现记录中查看进度',
          icon: "none"
        })
        setTimeout(function() {
          wx.navigateBack({})
        }, 1000);
      });

    } else {

      var params = {
        user_id: "user_id",
        active: "tixian_add",
        price: that.data.allMoney,
        user_id: wx.getStorageSync("user_id"),
      }
      app.getRequest(params).then((res) => {
        wx.showToast({
          title: '已提交审核，请在提现记录中查看进度',
          icon: "none"
        })
        setTimeout(function() {
          getUserData(that);
        }, 1000);
      });
    }
  },
  allMoneyIpt(e) {
    var val = parseInt(e.detail.value);
    if (val > parseInt(this.data.balance)) {
      wx.showToast({
        title: '已超过可提现金额',
        icon: "none"
      })
      this.setData({
        allMoney: this.data.balance,
      });
    } else if (val > 2000) {
      wx.showToast({
        title: '已超过提现上限20000元',
        icon: "none"
      })
    } else {
      // if (val<10) {
      //   wx.showToast({
      //     title: '提现金额不得小于10元',
      //     icon: "none"
      //   })
      // } 
      this.setData({
        allMoney: e.detail.value,
      });
      this.tixianbili();
    }
  },
  //全部提现
  allMoney() {
    this.setData({
      allMoney: parseInt(this.data.balance/ 10) * 10
    });
    this.tixianbili();
  },
  tixianbili(){
    var tixian_bili = this.data.tixian_bili;
    this.setData({
      biliPrice: (tixian_bili * parseInt(this.data.allMoney)/100).toFixed(2),
    });
  },
  //提现记录
  gotoTxjl() {
    wx.navigateTo({
      url: 'record?store_id='+this.data.store_id,
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
    if (!this.data.store_id) {
      getUserData(this);
    }
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
// 获取用户信息
var getUserData = function(that) {
  var params = {
    openid: wx.getStorageSync("token"),
    active: "user"
  }
  app.getRequest(params).then((res) => {
    // debugger
    that.setData({
      userData: res.data,
      balance: res.data.balance,
    });
    wx.setStorageSync("user_id", res.data.id);
  });
}
var activeTixianSelect= function (that) {
  var params = {
    active: "tixian_select"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      tixian_bili: res.data.tixian_bili,
    });
  });
}