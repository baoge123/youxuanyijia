// pages/order/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
    // 0未支付 1待发货 2待收货 3待评价 4售后 5全部
    types: [{
      name: "全部",
      id: 5
    }, {
      name: "待付款",
      id: 0
    }, {
      name: "待发货/消费",
      id: 1
    }, {
      name: "待收货",
      id: 2
    }, {
      name: "待评价",
      id: 3
    }, {
      name: "售后",
      id: 4
    }],
    typeName: 5,
    isAllList: 0,
    page: 1,
    list: [],
    action: 0,
    isAll: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      typeName: options.id ? options.id : '5',
      sname: options.name ? options.name : '',
      // list: [],
    });
    // getOrderList(this);
  },
  //去评价
  gotoCommentOn(e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'comment?oid=' + item.id + "&pimg=" + item.goods_img + "&store_id=" + item.store_id,
    })
  },
  gotodetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail?id=' + id,
    })
  },
  //取消订单
  orderDel(e) {
    var oid = e.currentTarget.dataset.oid,
      that = this;
    wx.showModal({
      title: '订单管理',
      content: '确认取消这个订单吗？',
      success: function(res) {
        if (res.confirm) {
          var params = {
            active: "order_del",
            order_id: oid,
          }
          app.getRequest(params).then((res) => {
            wx.showToast({
              title: "取消成功"
            })
            setTimeout(function() {
              that.setData({
                isAllList: 1,
                page: 1,
                list: [],
              });
              getOrderList(that);
            }, 2000);
          });
        }
      }
    })

  },

  //去确认收货
  gotoSureOrder: function(e) {
    var oid = e.currentTarget.dataset.oid,
      that = this;
    var params = {
      active: "shouhuo",
      id: oid,
      openid: wx.getStorageSync("token"),
    }
    app.getRequest(params).then((payargs) => {
      wx.showToast({
        title: '确认收货成功',
      })
      setTimeout(function() {
        that.setData({
          isAllList: 1,
          page: 1,
          list: [],
        });
        getOrderList(that);
      }, 2000);
    });
  },
  //去支付
  gotoPayOrder: function(e) {
    var oid = e.currentTarget.dataset.oid,
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
      success: function(payargs) {
        wx.hideLoading();

        if (payargs.data.code == 0) {
          var pay = payargs.data.data[0];
          wx.requestPayment({
            timeStamp: pay.time.toString(),
            nonceStr: pay.nonce_str,
            package: "prepay_id=" + pay.prepay_id,
            signType: "MD5",
            paySign: pay.paysign,
            'success': function(res) {
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
                setTimeout(function() {
                  that.setData({
                    isAllList: 1,
                    page: 1,
                    list: [],
                    typeName: 1,
                  });
                  getOrderList(that);
                }, 2000);
              });
            },
            'fail': function(res) {
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
  //评论商品
  gotoComment(e) {
    var oid = e.currentTarget.dataset.oid;
    var product = e.currentTarget.dataset.product;
    var ps = [];
    for (var i = 0; i < product.length; i++) {

      var pictureurl = product[i].pictureurl;
      var imgUrls = pictureurl.split(',');
      var item = {
        name: product[i].name,
        id: product[i].id,
        pictureurl: imgUrls[0],
        star: 5,
        content: "",
      };
      ps.push(item);
    }
    wx.setStorageSync("comproduct", ps);
    wx.navigateTo({
      url: 'comment?oid=' + oid,
    })
  },
  //点击事件
  selectType: function(e) {
    var id = e.currentTarget.dataset.id;
    if (id != this.data.typeName) {
      this.setData({
        typeName: e.currentTarget.dataset.id,
        // sname: e.currentTarget.dataset.name,
        list: [],
        isAllList: 1,
        page: 1,
      });
      getOrderList(this);
    }
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
    this.setData({
      isAllList: 1,
      page: 1,
      list: [],
    });
    getOrderList(this);
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
      getOrderList(that);

    that.setData({
      isAll: 0,
    });
  },

})
var getOrderList = function(that) {
  var params = {
    active: "order",
    user_id: wx.getStorageSync("user_id"),
    status: that.data.typeName,
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