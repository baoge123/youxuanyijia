// pages/luckdraw/play/play.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
    goods_img:[],
    imgalist: ["http://sz800800.cn/video/test.png","http://sz800800.cn/video/test.png",
    ],
    photo: ["../../image/sh/hy.png"],
    userInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    index_img(this)
    this.setData({
      userInfo: wx.getStorageSync('userinfo')
    })
    var that = this
    var scene_img = "http://sz800800.cn/video/test.png"//这里添加图片的地址
      that.setData({
        scene: scene_img
      })
  },
  previewImage: function (e) {
    console.log(1);
    var current = e.target.dataset.src;   //这里获取到的是一张本地的图片
    wx.previewImage({
      current: current,//需要预览的图片链接列表
      urls: [current]  //当前显示图片的链接
    })
  },
  getsvip(){
    wx.navigateTo({
      url: '../../user/buySvip',
    })
  },
  getfenxiang(){
    var nickName = this.data.userInfo.nickName,
      avatarUrl = this.data.userInfo.avatarUrl;
    console.log(this.data.userInfo)
    wx.navigateTo({
      url: '../../user/sharePage?nickName=' + nickName + "&avatarUrl=" + avatarUrl,
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


var index_img = function (that, callback) {

  var params = {
    active: "active_img",
  }
  app.getRequest(params).then((res) => {
    console.log(res)
    that.setData({
      goods_img: res.data,
      imgalist: res.data
    });
    if (callback) {
      callback();
    }
  });

}