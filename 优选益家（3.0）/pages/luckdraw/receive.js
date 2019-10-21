// pages/luckdraw/receive.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    VerifyCode: "获取验证码",
    url:wx.getStorageSync("url"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // url: 'receive?id=' + id + "&pname=" + pname + "&pimg=" + pimg,
    this.setData({
      id:options.id?options.id:"",
      pname: options.pname ? options.pname : "",
      pimg: options.pimg ? options.pimg : "",
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

  },
  nameIpt(e){
    this.setData({
      user_name: e.detail.value,
    });
  },
  idCodeIpt(e) {
    this.setData({
      user_number: e.detail.value,
    });
  },
  phoneIpt(e) {
    this.setData({
      phone: e.detail.value,
    });
  },
  nameIpt(e) {
    this.setData({
      user_name: e.detail.value,
    });
  },
  smsIpt(e) {
    this.setData({
      code: e.detail.value,
    });
  },
  addressIpt(e) {
    this.setData({
      user_address: e.detail.value,
    });
  },
  sureSend() {
    var mobile = this.data.phone,that=this;
    if (!app.testPhone(mobile)) {
      return;
    };
    var user_name = this.data.user_name;
    if (!user_name) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: "none"
      })
      return;
    }
    var user_number = this.data.user_number;
    if (!user_number) {
      wx.showToast({
        title: '请输入身份证号',
        icon: "none"
      })
      return;
    }
    var phone = this.data.phone;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return;
    }
    var code = this.data.code;
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
      return;
    }

    var user_address = this.data.user_address;
    if (!user_address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none"
      })
      return;
    }
    var params = {
      active: "veryify_code",
      phone: mobile,
      code: code,
    }
    app.getRequest(params).then((ress) => {
      var params = {
        active: "lingjiang",
        phone: phone,
        user_number: user_number,
        user_address: user_address,
        user_phone:phone,
        active_list_id: that.data.id,
        user_name: user_name,
        // code: code,
        user_id: wx.getStorageSync("user_id"),
      }
      app.getRequest(params).then((res) => {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
        });
        setTimeout(function () {
          wx.navigateBack({})
        }, 1000);
      });
    });

  },
  setVerify: function (e) { //发送验证码
    var mobile = this.data.phone;
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
  setTimeout(function () {
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