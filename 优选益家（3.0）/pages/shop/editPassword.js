// pages/shop/editPassword.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      this.setData({
        type: options.type ? options.type:'',
        phone: options.phone ? options.phone : '',
        status: options.status ? options.status : '',
      });

  },
  gotoSureEdit() {
    var that = this,
      password = that.data.password,
      password2 = that.data.password2;
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: "none",
      })
      return;
    }
    if (!password2) {
      wx.showToast({
        title: '请再次输入密码',
        icon: "none",
      })
      return;
    }
    if (password != password2) {
      wx.showToast({
        title: '请确认密码一致',
        icon: "none",
      })
      return;
    }
    var params = {
      active:"store_password",
      phone: that.data.phone,
      password: that.data.password,
      status: that.data.status,
    }
    app.getRequest(params).then((res) => {
      wx.showToast({
        title: '修改成功',
      })
      setTimeout(function(){
        wx.navigateBack({
          delta: 1,
        })
      },1500);


    });

  },
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },
  passwordInput2(e) {
    this.setData({
      password2: e.detail.value
    });
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