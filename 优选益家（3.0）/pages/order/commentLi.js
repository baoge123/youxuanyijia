// pages/order/commentLi.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
    liFocus:false,
    isAllList: 1,
    page: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var gid=options.gid;
    if(gid){
      this.setData({
        gid:gid
      });
    }
  },
  gotoSeeBigImg(e){
    var img=this.data.url+e.currentTarget.dataset.img;
    var arr = e.currentTarget.dataset.arr;
    for(var i=0;i<arr.length;i++){
      arr[i]=this.data.url+arr[i]
    }
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  gotoFocus(e){
    this.setData({
      liFocus: true,
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
    active: "comment",
    user_id: wx.getStorageSync("user_id"),
    page: that.data.page,
  }
  var params2 = {
    active: "goods_comment",
    goods_id: that.data.gid,
    page: that.data.page,
  }
  params = that.data.gid ? params2 : params;
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
        isAllList: 2,
        count: res.count,
      });
    }
    if(that.data.gid){
      wx.setNavigationBarTitle({
        title: '商品评论',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '我的点评',
      })
    }
  });
}