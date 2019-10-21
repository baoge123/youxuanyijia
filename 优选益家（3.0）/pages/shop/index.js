// pages/shop/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bomType: 1,
    latitude: "30.64242",
    longitude: "104.04311",
    fixedBox: 0,
    VerifyCode: "获取验证码",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      store_id: wx.getStorageSync("store_id"),
      shopType: wx.getStorageSync("shopType"),
    });
    wx.getSystemInfo({
      success: function(res) {
        var wid = 750 / res.windowWidth
        that.setData({
          windowHeight: res.windowHeight * wid,
        })
      }
    });

    //获取用户当前位置
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
      }
    })
    // getDetail(that);
  },
  yzPhoneIpt(e){
    var phone=e.detail.value;
    this.setData({
      yzphone:phone
    });
  },
  hiddenBox() {
    this.setData({
      fixedBox: 0,
    });
  },
  gotoEditPassword() {
    this.setData({
      fixedBox: 2,
    });
  },
  gotoMyUbi() {
    wx.navigateTo({
      url: 'myUbi',
    })
  },
  gotoMyassets() {
    wx.navigateTo({
      url: 'myAssets',
    })
  },
  //底部选择事件
  seletBomType(e) {
    var type = e.currentTarget.dataset.type,
      that = this;
    this.setData({
      bomType: type
    });
    if (type == 2) {
      wx.setNavigationBarTitle({
        title: '个人中心',
      })
      getShopInfo(that);
    }
  },
  //扫码
  scanCode() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        // 核销数据，
        var orderNum = res.path;
        // orderNum.toString();
        // console.log("长度：" + orderNum.length);
        // orderNum.substring(orderNum.length - 10);
        console.log("订单编号：" + orderNum);
        var params = {
          active: "store_refund",
          store_id: wx.getStorageSync("store_id"),
          order_num: orderNum
          // openid: wx.getStorageSync("token"),
        }
        app.getRequest(params).then((res) => {
          //  wx.showToast({
          //    title: '核销成功',
          //    icon:"icon"
          //  })
          wx.navigateTo({
            url: '../order/detail?id=' + res.data.id + "&type=scanCode",
          })
        });


      }
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
    getShopInfo(this);
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
  // onShareAppMessage: function() {

  // },

  smsIpt(e) {
    this.setData({
      code: e.detail.value,
    });
  },
  smsSure() {
    var mobile = this.data.yzphone,that=this;
    if (!app.testPhone(mobile)) {
      return;
    };
    var code = this.data.code;
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
      return;
    }
    var params = {
      active: "veryify_code",
      phone: mobile,
      code: code,
    }
    app.getRequest(params).then((res) => {
      wx.showToast({
        title: '验证成功',
        icon: 'success',
      });
      setTimeout(function() {
        that.setData({
          fixedBox: 0,
        });
        wx.navigateTo({
          url: 'editPassword?phone=' + mobile,
        })
      }, 1000);
    });

  },
  setVerify: function(e) { //发送验证码
    var mobile = this.data.yzphone;
    if (!app.testPhone(mobile)) {
      return;
    };
    var total_micro_second = 60 * 1000;
    var time = this.data.VerifyCode;
    if (!isNaN(parseInt(time))) {
      if (parseInt(time) > 0) {
        return;
      }
    }
    //验证码倒计时
    count_down(this, total_micro_second);
    // index.ashx?action=sendMsg
    var params = {
      active: "sms",
      phone: mobile
    }
    app.getRequest(params).then((res) => {
      wx.showToast({
        title: '发送成功',
        icon: 'success',
      });
    });
  }
})
// var getDetail = function (that, callback) {
//   // goods_list goods_id
//   var params = {
//     active: "store",
//     store_id: that.data.id,
//     lat:that.data.latitude,
//     lng: that.data.longitude,
//   }
//   app.getRequest(params).then((res) => {
//     that.setData({
//       good: res.data.store_list,
//       store_goods_class: res.data.store_goods_class,
//       tid: res.data.store_goods_class[0].id
//     });
//     // if(){}
//     getGoodClassDetail(that, res.data.store_goods_class[0].id);
//     WxParse.wxParse('article', 'html', res.data.store_list.content, that, 25);
//     if (callback) {
//       callback();
//     }
//   });
var getShopInfo = function(that, id) {
  // goods_list goods_id
  var params = {
    active: "store_list",
    store_id: wx.getStorageSync("store_id"),
    // openid: wx.getStorageSync("token"),
  }
  app.getRequest(params).then((res) => {
    wx.setStorageSync("shop_id", wx.getStorageSync("store_id")) //用于区分是否是自家商品
    that.setData({
      shopInfo: res.data,
    });


  });
}


function count_down(that, total_micro_second) {
  if (total_micro_second <= 0) {
    that.setData({
      VerifyCode: "重新发送"
    });
    // timeout则跳出递归
    return;
  }
  // 渲染倒计时时钟
  that.setData({
    VerifyCode: date_format(total_micro_second) + " 秒"
  });
  setTimeout(function() {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that, total_micro_second);
  }, 10)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return sec;
}
// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}