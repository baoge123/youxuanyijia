// pages/luckdraw/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentId: '1',
    section: [{
      name: '智能门锁',
      typeId: '1'
    }, {
        name: '扫地机器人',
      typeId: '2'
    },],
    id:"",
    jindu:"",
    num:"",
    jindu2:"",
    num2:"",
    jindu1: "",
    num1: "",
    url: wx.getStorageSync("url"),
    list: [],
    isAllList: 0,
    page: 1,
    currentTab: 0,
    jiayong:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getData1(this)
    getData(this)
    good_goods(this)
    // this.setData({
    //   jindu: this.data.jindu,
    //   num: this.data.num
    // })
  },
 
  // gotoDetail(e){
  //   var id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../good/detail?id=' + id,
  //   })
  // },
  //点击每个导航的点击事件
  handleTap: function (e) {
    let id = e.currentTarget.id;
      this.setData({
        currentId: id,
      })
   if(id==1){
     this.setData({
       currentId: id,
       jindu: this.data.jindu1,
       num: this.data.num1
     })
    //  getData(this)
   }else if(id==2){
     
     this.setData({
       currentId: id,
       jindu: this.data.jindu2,
       num: this.data.num2
     })
   }
  
  },
  gotoGz() {
    wx.navigateTo({
      url: 'detail?type=mggz',
    })
  },
  gotoDetail(e) {
    var id = e.currentTarget.dataset.id;
    var goods_id = e.currentTarget.dataset.goods_id;
    console.log(goods_id)
    //  wx.setStorageSync("goods_id1", goods_id)
    wx.navigateTo({
      url: '../good/detail?id=' + goods_id,
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
    // var that = this;
    // this.setData({
    //   page: that.data.page + 1,
    // });
    // if (that.data.isAllList == 1) {
    //   wx.showToast({
    //     title: '已加载全部数据..',
    //     icon: "none"
    //   })
    // } else
    //   getData(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

var getData = function (that, callback) {
  var params = {
    active: "active_goods",
    class_id: 1,
  }
  app.getRequest(params).then((res) => {
    console.log(res)
    that.setData({
      jiayong: res.data.goods,
      active_img: res.data.active_img,
      jindu1: res.data.jindu,
      num1: res.data.num,
      jindu: res.data.jindu,
      num: res.data.num,
    });
    if (callback) {
      callback();
    }
  });
}

var getData1 = function (that, callback) {
  var params = {
    active: "active_goods",
    class_id: 2,
  }
  app.getRequest(params).then((res) => {
    console.log(res)
    that.setData({
      jiqi: res.data.goods,
      active_img: res.data.active_img,
      jindu2: res.data.jindu,
      num2: res.data.num
    });
    if (callback) {
      callback();
    }
  });
}



var good_goods = function (that, callback) {

  var params = {
    active: "active_class",
  }
  app.getRequest(params).then((res) => {
    console.log(res)
    that.setData({
      good_goods: res.data,
    });
    if (callback) {
      callback();
    }
  });

}



