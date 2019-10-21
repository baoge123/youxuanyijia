// pages/order/createOrder.js
var app = getApp()
Page({
  data: {
    url: wx.getStorageSync("url"),
    product: '',
    coupon: '',
    total: '',
    couponedTotal: '', 
    couponPrice: '',
    num: '',
    couponCodeId: [],
    Consignee: '',
    area: '',
    address: '',
    addressPhone: '',
    AreaName: '',
    hidden: '',
    hidden: true,
    nocancel: false,
    isAddress: 1,
    postage: '',
    company: '',
    goods_total: '',
    cartNumber: 1,
    address_id: '',
    ptype: 1, //当前的支付方式
    fixedBox: 0,
    isdku_num: 0,
    isdk_balance: 0,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    });
    //查询用户地址
    that.selectUserAddress()
  },
  selectUserAddress() {
    var that = this;
    var params = {
      active: "user_address",
      user_id: wx.getStorageSync("user_id")
    }
    app.getRequest(params).then((res) => {
      if (res.data.length > 0) {
        var addressInfo = {
          userName: res.data[0].true_name,
          telNumber: res.data[0].user_phone,
          provinceName: '',
          cityName: '',
          countyName: '',
          detailInfo: res.data[0].address,
        }
        that.setData({
          addressInfo: addressInfo,
        })
      } else {
        that.setData({
          noAddress: 1,
        });
      }
    });
  },
  //u币抵扣
  isdkuNum() {
    var status = this.data.userData.status,
      that = this;
    if (status == 1) {
      var isUb = this.data.isdku_num == 1 ? 0 : 1;

      var dku_num = this.data.dku_num,
        dku_num_s = parseFloat(this.data.dku_num_s),
        dk_balance = parseFloat(this.data.dk_balance),
        dk_balance_s = parseFloat(this.data.dk_balance_s),
        userData = this.data.userData;
      var total = parseFloat(this.data.total);;
      var isdk_balance = this.data.isdk_balance;
      if (isUb == 1) {

        if (dku_num_s >= 0) {
          //有使用余额，可使用的U币为剩余的额度，
          total = total - dku_num_s - dk_balance_s;
          that.setData({
            dku_num_s: parseInt(dku_num_s),
          });
        } else {
          //直接先点的U币抵扣，
          total = parseFloat(this.data.total) - (dku_num ? dku_num : 0);
          //计算可使用的余额金额 如果使用U币抵扣后，用户余额大于了剩余的金额，那么最多使用余额为剩余的金额。
          var bal = dk_balance > total ? total.toFixed(2): dk_balance.toFixed(2);
          that.setData({
            dku_num_s: parseInt(dku_num),
            dk_balance_s: bal
          });
        }
      } else {
        // 全部取消了
        if (isdk_balance == 0) {
          this.setData({
            dku_num_s: -1,
            dk_balance_s: -1,
            dku_num: that.data.dku_num,
            dk_balance: that.data.dk_balance,
            total: that.data.total,
            sjTotal: -1,
          });
        } else {
          //如果是取消后还有使用余额，总价要减去抵扣的u币，
          total = total - dk_balance_s.toFixed(2);
        }

      }
      this.setData({
        isdku_num: isUb,
        sjTotal: total.toFixed(2),
      });
    } else {
      wx.showToast({
        title: '超级会员才能使用U币抵扣，您还不是超级会员',
        icon: "none"
      })
    }
  },
  //选择余额抵扣
  isdkBalance() {
    var isB = this.data.isdk_balance == 1 ? 0 : 1;
    var dk_balance = this.data.dk_balance,
      dk_balance_s = parseFloat(this.data.dk_balance_s),
      isdku_num = this.data.isdku_num,
      dku_num = this.data.dku_num,
      dku_num_s = parseFloat(this.data.dku_num_s),
      that = this,
      userData = this.data.userData;
    // var total = parseFloat(isB == 1 ? this.data.sjTotal : this.data.total);
    // total = total >= 0 ? total : this.data.total;
    var total = parseFloat(this.data.total);
    if (isB == 1) {
      if (dk_balance_s >= 0) { //dku_num_s
        total = total - dk_balance_s - dku_num_s;
        that.setData({
          dk_balance_s: dk_balance_s.toFixed(2),
        });
      } else {
        total = total - parseFloat(dk_balance);
        //计算可使用的Ubi金额 如果剩余的U币大于实际支付金额，那么使用u币为剩余的总额
        that.setData({
          dku_num_s: dku_num > total ? parseInt(total) : parseInt(dku_num),
          dk_balance_s: dk_balance.toFixed(2),
        });
      }

    } else {
      //如果是取消后还有使用U币抵扣，name总价要减去抵扣的u币，
      if (isdku_num == 0) {
        this.setData({
          dku_num_s: -1,
          dk_balance_s: -1,
          dku_num: that.data.dku_num,
          dk_balance: that.data.dk_balance,
          total: that.data.total,
          sjTotal: -1,
        });
      } else {
        // total = this.data.dku_num_s ?'':
        total = total - dku_num_s.toFixed(2);
      }

    }
    this.setData({
      isdk_balance: isB,
      sjTotal: total.toFixed(2),
    });
  },

  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    var that = this;
    var order_param = JSON.parse(wx.getStorageSync("buyInfos"));
    // var adderssStr = wx.getStorageSync("adderssStr");
    if (order_param) {
      getUserData(that, function() {
        //如果存在商品数据 计算商品总价  数量 总的可抵扣U币
        var total = 0,
          number = 0,
          goods_uTotal = 0;
        for (var i = 0; i < order_param.length; i++) {
          var t = order_param[i].guige_num * order_param[i].space_price;
          total += t;
          number += order_param[i].guige_num;
          if (order_param[i].goods_u_status == 1) {
            goods_uTotal += order_param[i].goods_u * order_param[i].guige_num;
          }

        }
        //计算可抵扣的U币 余额 如果余额大于商品总金额，可全部余额抵扣，只支付0；U币抵扣低于商品总的可抵扣u币
        var userData = that.data.userData;
        var dku_num = userData.u_num * userData.bili_u,
          dk_balance = userData.balance;
        if (dku_num > goods_uTotal) {
          dku_num = goods_uTotal * userData.bili_u
        }
        if (dk_balance > total) {
          dk_balance = total
        }
        that.setData({
          order_param: order_param,
          total: total.toFixed(2),
          number: number,
          goods_uTotal: goods_uTotal,
          dku_num: dku_num,
          dk_balance: dk_balance,
        });
      });
    }

  },

  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  //修改地址
  gotoAddress: function() {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        that.setData({
          addressInfo: res
        });
        var noAddress = that.data.noAddress;
        if (noAddress == 1) {
          var params = {
            active: "user_address_add",
            user_id: wx.getStorageSync("user_id"),
            true_name: res.userName,
            user_phone: res.telNumber,
            address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
            status: 1,
          }
          app.getRequest(params).then((sult) => {
            that.setData({
              noAddress: 0,
            });
          });
        }
      }
    })
  },
  //更改状态下单
  gotoEditOrder(id) {
    var params = {
      active: "order_status",
      id: id,
    }
    app.getRequest(params, "GET").then((res) => {
      wx.showToast({
        title: "支付成功"
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '../order/list?id=1'
        })
      }, 2000);
    });
  },
  //提交订单
  sendOrder: function() {
    var that = this;
    
    var data1 = that.data.product;
    if (!that.data.addressInfo) {
      wx.showModal({
        title: '您还未添加收货地址',
        content: '请添加收货地址',
        success: function(res) {
          if (res.confirm) {
            wx.chooseAddress({
              success: function(res) {
                that.setData({
                  addressInfo: res
                });
              }
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      var type = wx.getStorageSync("payType"),
        order_param = that.data.order_param,
        params = '',
        url = "", //'submit-order'
        params = "",
        s_u_num = that.data.isdku_num == 1 ? (that.data.dku_num_s != -1 ? that.data.dku_num_s : that.data.dku_num) : 0,
        s_balance = that.data.isdk_balance == 1 ? (that.data.dk_balance_s != -1 ? that.data.dk_balance_s : that.data.dk_balance) : 0;

      //购买
      var orderData = {
        user_name: that.data.addressInfo.userName,
        user_phone: that.data.addressInfo.telNumber,
        user_address: that.data.addressInfo.provinceName + that.data.addressInfo.cityName + that.data.addressInfo.countyName + that.data.addressInfo.detailInfo,
        user_id: that.data.userData.id,
        u_num: s_u_num,
        balance: s_balance,
      };
      var ids = [];
      var cart_ids = [];
      for (var i = 0; i < order_param.length; i++) {
        var item = {
          goods_id: order_param[i].goods_id,
          goods_space_id: order_param[i].goods_space_id,
          goods_num: order_param[i].guige_num,
          store_id: order_param[i].store_id,
          fan_u: order_param[i].fan_u,
          order_pay_status: order_param[i].order_pay_status,
          // cart_id:order_param[]
        };
        ids.push(item);
        if (order_param[i].cart_id) {
          cart_ids.push(order_param[i].cart_id);
        }

      }
      orderData.data = ids;
      var jsData = JSON.stringify(orderData);
      var sjTotal = that.data.sjTotal;
      params = {
        active: "order_add",
        data: jsData, //数量
      };
      // }
      app.getRequest(params).then((ress) => {
        // active pay   openid  order_id
        var params = {
          openid: wx.getStorageSync("token"),
          active: 'pay',
          order_id: ress.data,
        }
        // 如果实际支付的金额为0，不需要发起支付，直接下单成功。
        if (sjTotal <= 0) {
          that.gotoEditOrder(ress.data);
        } else {

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
                    // console.log("支付成功");
                    // console.log(res);
                    that.gotoEditOrder(ress.data);
                  },
                  'fail': function(res) {
                    console.log(res);
                    wx.showToast({
                      title: '支付失败',
                      icon: "none"
                    })
                    setTimeout(function() {
                      wx.navigateTo({
                        url: '../order/list?id=0&name=待付款'
                      })
                    }, 1500);
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: payargs.data.msg,
                })
              }
            }

          })
        }
        if (cart_ids.length > 0) {
          var cids = cart_ids.join(',')
          that.deleteCart(cids);
        }
      });
    }
  },
  //从购物车中删除
  deleteCart: function(ids) {
    var that = this;
    var params = {
      active: 'car_del',
      openid: wx.getStorageSync("token"),
      car_id: ids,
    }
    app.getRequest(params).then((res) => {});
  },
})
//获取用户信息
var getUserData = function(that, callback) {
  var params = {
    openid: wx.getStorageSync("token"),
    active: "user"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      userData: res.data
    });
    if (callback) {
      callback();
    }
  });
}