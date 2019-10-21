// pages/user/my/ubiTurn.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
    showModel: 0,

    isAllList: 1,
    page: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num:options.num,
    });
    // iptNum
  },
  gotoSelectUser(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      userId:id,
      showModel: 0,
    });
  },
  gotoSureSend(){
    var iptNum = this.data.iptNum, that = this, userId = this.data.userId;
    if (!iptNum){
      wx.showToast({
        title: '请输入转让U币数量',
        icon:"none"
      })
      return;
    }
    if (!userId) {
      wx.showToast({
        title: '请输入好友ID',
        icon: "none"
      })
      return;
    }
    var params = {
      active: "assignment",
      user_id: wx.getStorageSync("user_id"),
      u_num: iptNum,
      up_user_id:userId
    }
    app.getRequest(params).then((res) => {
      that.setData({
        iptNum:'',
        userId:'',
      });
      wx.showToast({
        title: '转让成功',
      })
      setTimeout(function(){
        wx.navigateBack({
          
        })
      },1500)
    });
  },
  userIdInput(e){
    this.setData({
      userId:e.detail.value,
    });
  },
  gotoZRall(){
    this.setData({
      iptNum: this.data.num,
    });
  },
  iptNumber(e){
    debugger
    var val=e.detail.value;
    if (parseInt(val) > parseInt(this.data.num)) {
      wx.showToast({
        title: '已超过可转让U币',
      })
      this.setData({
        iptNum: this.data.num,
      });
    } else {
      this.setData({
        iptNum: e.detail.value,
      });
    }
  },
  selectFrend(){
    this.setData({
      showModel: 1,
    });
  },
  gotoHiddenModel() {
    this.setData({
      showModel: 0,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// user_u_list

var getList = function (that) {
  var params = {
    active: "user_u_list",
    user_id: wx.getStorageSync("user_id"),
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