// pages/user/team.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllList: 1,
    page: 1,
    list: [],
    type:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  gotoSelectType(e){
    var type=e.currentTarget.dataset.type;
    if(type){
      this.setData({
        isAllList: 1,
        page: 1,
        list: [],
        type:type,
      });
      getList(this);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
      getList(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
var getList = function(that) {
  var params = {
    active: "team",
    user_id: wx.getStorageSync("user_id"),
    page: that.data.page,
    status:that.data.type,
  }
  app.getRequest(params).then((res) => {
    var list = that.data.list, type = that.data.type;
    var ordata = type == 0 ? res.data.user : res.data;
    if (ordata.length == 0) {
      that.setData({
        isAllList: 1
      });
    } else {
      
            
      for (var i = 0; i < ordata.length; i++) {
        list.push(ordata[i]);
      }
      that.setData({
        list: list,
        isAllList: 2,
      });
    }
    if(that.data.type==0){
      that.setData({
        yiji: res.data.yiji,
        erji: res.data.erji,
        count: res.data.count,
        san: res.data.san,
      });
    }
    
  });
}