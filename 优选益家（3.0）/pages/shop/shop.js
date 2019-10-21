// pages/shop/shop.js
var app=getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
    advertisement: ["https://songrushuai.sccxbe.com/static/wap/1.0.0/images/banner.jpg", "http://p0.qhimgs4.com/t01b55e942ed670e4ee.jpg", "http://p0.qhimgs4.com/t01b55e942ed670e4ee.jpg"],
    circular: true,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    current: 0,
    imgHeight: [],
    swiperHeight: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // wx.removeStorageSync("shop_id")
    if (options.id){
      // wx.setStorageSync("store_id", options.id)
    }
    
    that.setData({
      id: options.id,
      // id: 2,
      showShop: 1
    });
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude ? res.latitude : ''
        const longitude = res.longitude ? res.longitude : ''
        // const speed = res.speed
        // const accuracy = res.accuracy
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
      }
    })
    // getDetail(that);
  },
  gotoDetail(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail?id='+id,
    })
  },
  selectClass(e){
    var sid = e.currentTarget.dataset.id;
    if(sid!=this.data.tid){
      this.setData({
        tid:sid
      });
    }
  },
  copyAddress(){
    var that = this;
    wx.setClipboardData({
      data: that.data.good.address,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  cellShop(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.good.phone,
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
    wx.removeStorageSync("shop_id")
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
// var getDetail = function (that, callback) {
//   // goods_list goods_id
//   wx.getLocation({
//     type: 'wgs84',
//     success(res) {
//       const latitude = res.latitude ? res.latitude : ''
//       const longitude = res.longitude ? res.longitude : ''
//       // const speed = res.speed
//       // const accuracy = res.accuracy
//       var params = {
//         active: "store",
//         store_id: that.data.id,
//         lat: latitude,
//         lng: longitude,
//       }
//       app.getRequest(params).then((res) => {
//         that.setData({
//           good: res.data.store_list,
//           store_goods_class: res.data.store_goods_class,
//           tid: res.data.store_goods_class[0].id
//         });
//         // if(){}
//         getGoodClassDetail(that, res.data.store_goods_class[0].id);
//         WxParse.wxParse('article', 'html', res.data.store_list.content, that, 25);
//         if (callback) {
//           callback();
//         }
//       });
//     }
//   })

// }
// // store_goods_calss store_goods_class_id
// var getGoodClassDetail= function (that,id) {
//   // goods_list goods_id
//   var params = {
//     active: "store_goods_calss",
//     store_goods_class_id: id,
//     // openid: wx.getStorageSync("token"),
//   }
//   app.getRequest(params).then((res) => {
//     that.setData({
//       goodList: res.data,
//     });


//   });
// }