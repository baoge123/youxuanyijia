// pages/worker/worke.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fixedBox: 0,
    VerifyCode: "获取验证码",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  gotoOpenModel() {
    this.setData({
      fixedBox: 2,
    });
  },
  hiddenBox() {
    this.setData({
      fixedBox: 0,
    });
  },
  btnSureSend() {
    var phone = this.data.phone,
      password = this.data.password,
      that = this;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: "none"
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '请输入登陆密码',
        icon: "none"
      })
      return;
    }
    var params = {
      active: "store_login",
      openid: wx.getStorageSync("token"),
      admin: phone,
      password: password,
    }
    app.getRequest(params).then((res) => {
      wx.setStorageSync("store_id", res.data.id);
      wx.setStorageSync("shopType", res.data.status);
      wx.showToast({
        title: '登陆成功',
      })
      setTimeout(function() {

        wx.redirectTo({
          url: 'index',
        })
      }, 1500);
    });
  },
  yzPhoneIpt(e) {
    this.setData({
      yzphone: e.detail.value,
    });
  },
  gotoCustomer() {
    wx.navigateTo({
      url: 'customer',
    })
  },
  gotoAddcustomer() {
    wx.navigateTo({
      url: '../shop/settledin?staff_id=' + wx.getStorageSync("staff_id"),
    })
  },
  gotoEditPassword() {
    this.setData({
      fixedBox: 2
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
    var that = this;
    getWorkerInfo(that);
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

  },

  smsIpt(e) {
    this.setData({
      code: e.detail.value,
    });
  },
  smsSure() {
    var mobile = this.data.yzphone,
      that = this;
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
      that.setData({
        fixedBox: 0
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '../shop/editPassword?phone=' + mobile + "&status=1",
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
var getWorkerInfo = function(that, id) {
  // goods_list goods_id
  var params = {
    active: "staff",
    staff_id: wx.getStorageSync("staff_id"),
    // openid: wx.getStorageSync("token"),
  }
  app.getRequest(params).then((res) => {
    that.setData({
      workInfo: res.data,
    });


  });
}