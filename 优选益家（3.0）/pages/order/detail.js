// pages/order/detail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
    // user:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getuser(this)

    console.log("订单详情数据");
    console.log(options);
    this.setData({
      id:options.id,
      type: options.type ? options.type:""
    });
  },
  sureScanCode(){
    var that=this;
    var params = {
      active: "refund",
      store_id: wx.getStorageSync("store_id"),
      order_id: that.data.info.id,
      // openid: wx.getStorageSync("token"),
    }
    app.getRequest(params).then((res) => {
       wx.showToast({
         title: '核销成功',
         icon:"icon"
       })
       setTimeout(function(){
         wx.navigateBack({})
       },2000)

    });
  },
  hiddenBox(){
    this.setData({
      fixedBox:0,
    });
  },
  gotoShowErcode(){
    this.setData({
      fixedBox:1,
    });
  },
  //查看物流
  gotoLogistics(){
    wx.navigateTo({
      url: 'logistics?oid=' + this.data.info.id,
    })
  },
  //去评价
  gotoCommentOn(e) {
    var item =this.data.info;
    wx.navigateTo({
      url: 'comment?oid=' + item.id + "&pimg=" + item.goods_img + "&store_id=" + item.store_id,
    })
  },
  //去确认收货
  gotoSureOrder: function (e) {
    var oid = this.data.id,
      that = this;
    var params = {
      active: "shouhuo",
      id: oid,
      openid:wx.getStorageSync("token"),
    }
    app.getRequest(params).then((payargs) => {
      wx.showToast({
        title: '确认收货成功',
      })
      setTimeout(function () {
        getData(that);
      }, 2000);
    });
  },
  //取消订单
  orderDel(e) {
    var oid = this.data.id,
      that = this;
    wx.showModal({
      title: '订单管理',
      content: '确认取消这个订单吗？',
      success: function (res) {
        if (res.confirm) {
          var params = {
            active: "order_del",
            order_id: oid,
          }
          app.getRequest(params).then((res) => {
            wx.showToast({
              title: "取消成功"
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 2000);
          });
        }
      }
    })

  },
  //去支付
  gotoPayOrder: function (e) {
    var oid = this.data.id,
      that = this;
    var params = {
      openid: wx.getStorageSync("token"),
      active: 'pay',
      order_id: oid,
    }

    wx.request({
      url: wx.getStorageSync('url'),
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      data: params,
      success: function (payargs) {
        wx.hideLoading();

        if (payargs.data.code == 0) {
          var pay = payargs.data.data[0];
          wx.requestPayment({
            timeStamp: pay.time.toString(),
            nonceStr: pay.nonce_str,
            package: "prepay_id=" + pay.prepay_id,
            signType: "MD5",
            paySign: pay.paysign,
            'success': function (res) {
              //支付成功
              console.log(res);
              var params = {
                active: "order_status",
                id: oid,
              }
              app.getRequest(params, "GET").then((res) => {
                wx.showToast({
                  title: "支付成功"
                })
                setTimeout(function () {
                  getData(that);
                }, 2000);
              });
            },
            'fail': function (res) {
              console.log(res);
              wx.showToast({
                title: '支付失败',
                icon: "none"
              })
            }
          })
        }
      }

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
    getData(this);
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
var getData=function(that){
  var params = {
    active: "order_list",
    order_id: that.data.id,
    // openid: wx.getStorageSync("token"),
  }
  app.getRequest(params).then((res) => {
    that.setData({
      info: res.data,
    });
  });
}


var getuser = function (that) {
  var params = {
    active: "user",
    order_id: wx.getStorageSync("token") ,
    // openid: wx.getStorageSync("token"),
  }
  app.getRequest(params).then((res) => {
    that.setData({
      user: res.data,
    });
   
  });
}