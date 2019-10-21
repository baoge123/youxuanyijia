// pages/user/main.js
var app = getApp()
Page({

  /**d
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userinfo"),
     
    imgurl: wx.getStorageSync("url"),
    list: [{
        url: "../../image/icon/Group.png",
        id: 0,
        name: "待付款"
      },
      {
        url: "../../image/icon/Group2.png",
        id: 1,
        name: "待发货/消费"
      },
      {
        url: "../../image/icon/Group3.png",
        id: 2,
        name: "待收货"
      },
      {
        url: "../../image/icon/Group4.png",
        id: 3,
        name: "待评价"
      },
      {
        url: "../../image/icon/Group5.png",
        id: 4,
        name: "售后"
      }
    ],
    service: [{
        url: "../../image/fenxiao.png",
        id: 1,
        name: "售后"
      },

      {
        url: "../../image/LOGO.png",
        id: 4,
        name: "关于我们"
      }
    ],
    liTwo: [{
        url: "../../image/sc.png",
        id: 2,
        name: "我的收藏"
      },
      {
        url: "../../image/kf.png",
        id: 3,
        name: "客服"
      },
    ],
    isPartner: 1,
    carouselList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  // loginout(){
  //   wx.removeStorageSync('token')
  //   this.setData({
  //     // openid : wx.removeStorageSync('token')
  //   });
  //   // getUserData1(this);
  //   wx.removeStorageSync('userinfo')
  //   this.setData({
  //     userInfo: wx.getStorageSync('userinfo')
  //   });
  //   loginout(this)
  // },
  gotoshop(){
    wx.navigateTo({
      url: '../shop/login',
    })
  },
 
  loginout() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('userData')
    wx.removeStorageSync('userinfo')
    this.setData({
      userData: wx.getStorageSync('userData'),
      userInfo:[],
    });
    loginout(this)
  },
 
  bindGetUserInfo(res) {
    console.log(res.detail.userInfo);
    if (res.detail.userInfo) {
      console.log("点击了同意授权");
      // getUserData1(this);
      loginCallback(this)
      // setUserInfo(this)
      this.setData({
        userInfo: wx.getStorageSync('userinfo')
      });
      wx.setStorageSync("userinfo", res.detail.userInfo)
    } else {
      console.log("点击了拒绝授权");
      
    }
    
  },
   
 
 user(){
   getUserData1(this);
  //  loginCallback(this)
 },
  // bindGetUserInfo(res) {
  //   console.log(res.detail.userInfo);
  //   if (!wx.getStorageSync('token')){
  //     if (res.detail.userInfo) {
  //       console.log("点击了同意授权");
  //       loginCallback(this).then(
  //         setUserInfo(this)
  //       )
  //     } else {
  //       console.log("点击了拒绝授权");
  //     }
  //   }else{
  //     getUserData1(this);
  //   }
    
  // },
  gotoActiveList() {
    wx.navigateTo({
      url: '../luckdraw/list',
    })
  },
  gotoCodeId(){
    var that = this, id = that.data.userData.id;
    id = id.toString();
    wx.setClipboardData({
      data: id,
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
  //查看名片
  gotoShreImg() {
    // this.setData({
    //   userInfo: wx.getStorageSync('userinfo')
    // });
    // var nickName = this.data.userInfo.nickName,
    //  avatarUrl = this.data.userInfo.avatarUrl;
    // console.log(this.data.userInfo)
    // wx.navigateTo({
    //   url: 'sharePage?nickName=' + nickName + "&avatarUrl=" + avatarUrl,
    // })
    if (!wx.getStorageSync('userinfo')){
      wx.showToast({
        title: '请先登录',
      })
    }else{
         this.setData({
      userInfo: wx.getStorageSync('userinfo')
    });
    var nickName = this.data.userInfo.nickName,
     avatarUrl = this.data.userInfo.avatarUrl;
    console.log(this.data.userInfo)
    wx.navigateTo({
      url: 'sharePage?nickName=' + nickName + "&avatarUrl=" + avatarUrl,
    })
    }
   
  },
  gotoCjjvLi() {
    wx.navigateTo({
      url: '../luckdraw/history',
    })
  },
  //商家端登陆
  gotoShopLogin() {
    wx.navigateTo({
      url: '../shop/login',
    })
  },
  //员工端登陆
  gotoWorkLogin() {
    wx.navigateTo({
      url: '../worker/login',
    })
  },
  //评论列表
  gotoCommentLi() {
    wx.navigateTo({
      url: '../order/commentLi',
    })
  },
  //投诉建议
  gotoTsjy() {
    wx.navigateTo({
      url: 'tsjy',
    })
  },
  //服务说明
  gotoService() {
    wx.navigateTo({
      url: 'service',
    })
  },
  gotoGetMoney() {
    wx.navigateTo({
      url: '../money/get',
    })
  },
  gotoSelectAddress(e) {
    wx.chooseAddress({
      success: function(res) {
        var params = {
          active: "user_address_add",
          user_id: wx.getStorageSync("user_id"),
          true_name: res.userName,
          user_phone: res.telNumber,
          address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          status:1,
        }
        app.getRequest(params).then((res) => {
          wx.showToast({
            title: '设置默认地址成功',
            icon:"none"
          })
        });
      }
    })
  },
  gotoOrderList(e) {
    var id = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../order/list?id=' + id,
    })
  },
  //我的资产
  myAssets() {
    wx.navigateTo({
      url: 'myAssets',
    })
  },
  //我的U币
  myubi() {
    wx.navigateTo({
      url: 'my/ubi',
    })
  },
  gotoMyTeam() {
    wx.navigateTo({
      url: 'team',
    })
  },
  gotoType: function(e) {
    var id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name,
      that = this;
    id = parseInt(id);
    // wx.navigateTo({
    //   url: '../order/list?id=' + id + "&name=" + name
    // })
    switch (id) {
      case 1:
        wx.navigateTo({
          url: '../balance/fxRebate'
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../collection/collection'
        })
        break;
      case 3:

        break;
      case 4:
        if (that.data.isPartner == 1) {
          wx.navigateTo({
            url: 'partner/center',
          })
        }
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
    getUserData1(this)
    
    // loginCallback(this)
    var that = this;
    // that.setData({
    //   userInfo: wx.getStorageSync('userinfo')
    // });
    var that = this;
    wx.getSetting({
      success: res => {
        if (wx.getStorageSync('userinfo')) {
          // 已经授权，可以直接调用 getUserInfo 更新用户信息
              // getUserData1(this);
        } 
      }
    })
    if (wx.getStorageSync('token')) {
     
    }
    // getUserData(that);
    // isShop(that);
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
    if (wx.getStorageSync('userData')) {
       getUserData1(this);
    }
          
       
    
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      path: '/pages/user/getUserInfo?user_id=' + wx.getStorageSync("user_id"),
    }
  }

})

// 获取用户信息

var getUserData1 = function (that) {
  var params = {
    openid: wx.getStorageSync("token"),
    active: "user"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      userData: res.data
    });
    wx.setStorageSync("user_id", res.data.id);
    wx.setStorageSync("userData", res.data);
  });
}

var setUserInfo = function(that) {
  wx.getUserInfo({
    success: function(e) {
      var userInfo = e.userInfo;
      var params = {
        user_name: userInfo.nickName,
        user_img: userInfo.avatarUrl,
        openid: wx.getStorageSync("token"),
        up_id: '',
        active: "user_add"
      }
      app.getRequest(params).then((res) => {
        that.setData({
          // userInfo1: res.code,
        })
        wx.setStorageSync("userCode", res.code);
        getUserData1(that);
        
      });
    }
  })
}

var loginCallback = function (that, callback) {
  wx.login({
    success: ress => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = ress.code;
      var params = {
        active: "openid",
        js_code: code,
      }
      wx.request({
        url: wx.getStorageSync('url'),
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        data: params,
        success: function (res) {
          that.setData({
            openid: res.data.openid,
          })
          wx.setStorageSync("token", res.data.openid);
          setUserInfo(that)
        }
      })
    }
  })
}


var loginout = function (that) {
  var params = {
    // openid: wx.getStorageSync("token"),
    active: "user_del"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      userData1: res.data
    });
    wx.setStorageSync("user_code", res.code);
    wx.removeStorageSync('userData')
    
  });
}