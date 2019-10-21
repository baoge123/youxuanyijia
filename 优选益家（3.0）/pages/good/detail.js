// pages/good/detail.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),

    navbar: ['商品简介', '用户评价'],
    //count:[0,2,3],                                  //记录不同状态记录的数量
    currentTab: 0,
    // advertisement: ["https://songrushuai.sccxbe.com/static/wap/1.0.0/images/banner.jpg", "http://p0.qhimgs4.com/t01b55e942ed670e4ee.jpg", "http://p0.qhimgs4.com/t01b55e942ed670e4ee.jpg"],
    logoImg: 'https://songrushuai.sccxbe.com/static/wap/1.0.0/images/banner.jpg',
    circular: true,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    current: 0,

    imgHeight: [],
    swiperHeight: '',
    windowHeight: 0,
    windowWidth: '',
    showModel: 0,
    cartNumber: 1,
    skuids: [],
    stock: 0,
    store_id: 1,
    isFub: 1,
    payType: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    

    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    that.setData({
      id: options.id,
    })
    getUserData(that);
    // getSkuData(that);
    //获取二维码
    getErCode(that);
  },

  //响应点击导航栏
  navbarTap: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      TypeItem: that.data.navbar[that.data.currentTab]
    })
  },
  gotoHistory(e) {
    // luckdraw/winningList
    var aid = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '../luckdraw/winningList?aid=' + aid + "&gid=" + this.data.id,
    })
  },
  //活动规则
  gotoActiveGz() {
    wx.navigateTo({
      url: '../luckdraw/detail?gid=' + this.data.id,
    })
  },
  //查看评论列表
  gotoCommentLi() {
    wx.navigateTo({
      url: '../order/commentLi?gid=' + this.data.id,
    })
  },
  gotoShowModelTwo() {
    var that = this;
    // this.setData({
    //   showModel: 2,
    //   shareImg:'',
    // });
    if (!that.data.erCodeImg) {
      getErCode(that, function() {
        wx.navigateTo({
          url: 'sharePage?erCodeImg=' + that.data.erCodeImg + "&price_now=" + that.data.good.goods_price_now + "&price=" + that.data.good.goods_price + "&goods_name=" + that.data.good.goods_name + "&goods_img=" + that.data.good.goods_img,
        })
      });
    } else {
      wx.navigateTo({
        url: 'sharePage?erCodeImg=' + that.data.erCodeImg + "&price_now=" + that.data.good.goods_price_now + "&price=" + that.data.good.goods_price + "&goods_name=" + that.data.good.goods_name + "&goods_img=" + that.data.good.goods_img,
      })
    }
  },
  //购买会员
  gotoBuyVip() {
    
    wx.navigateTo({
      url: '../user/buySvip',
    })
  },
  gotoCart() {
      if(!wx.getStorageSync("token")){
        wx.showModal({
          title: '您还未登录',
          content: '请登录',
        })
       
      }else{
        wx.navigateTo({
          url: '../cart/cart',
        })
      }
  },
  //选中规格
  sureShopping(e) {
    var idx = e.currentTarget.dataset.idx,
      id = e.currentTarget.dataset.id,
      that = this,
      skuids = this.data.skuids;
    skuids[idx] = id;
    if (idx == 0) {
      //如果选择一级规格，那去查询二级规格最新库存，重新赋值二级规格参数 goods_space_two  goods_space_id

      skuids[1] = ""; //重置二级选择的id
      var params = {
        active: "goods_space_two",
        goods_space_id: id,
      }
      app.getRequest(params).then((res) => {
        var good = that.data.good;

        good.guige_name_none[1].space = res.data;
        that.setData({
          good: good,
          skuItem: '',
          skuids: skuids,
        });
      });
    } else if (idx == 1) {
      //如果还没有选择上级规格，那么提示请选择上级规格
      var skuIds = that.data.skuids;
      if (!skuIds) {
        wx.showToast({
          title: '请选择上级规格',
          icon: "none"
        })
        return;
      }
      //如果有更新为最新的库存数据，那么赋值库存价格
      var good = that.data.good;
      var data = good.guige_name_none[1].space;
      for (var i = 0; i < data.length; i++) {
        if (skuIds[1] == data[i].id) {
          that.setData({
            skuItem: data[i],
            skuids: skuids,
          });
        }
      }
      //如果是选择的定金的支付方式，就显示定金的价格
      var payType = that.data.payType
      if (payType == 1) {
        var skuItem = that.data.skuItem;
        skuItem.space_price = that.data.good.dingjin;
        that.setData({
          skuItem: skuItem,
        })
      }

    }
    // that.setData({
    //   skuids: skuids,
    // });
  },
  //确认操作
  sureProductShop: function() {
    var buyType = this.data.buyType,
      that = this; //add buy
    var skuItem = this.data.skuItem;
    if (!skuItem) {
      wx.showToast({
        title: '请先选择规格',
        icon: "none"
      })
      return;
    }
    if (that.data.cartNumber > skuItem.space_num) {
      wx.showToast({
        title: '购买数量大于库存，请修改数量',
        icon: "none"
      })
      return;
    }
    if (buyType == "add") {
      //添加购物车  car_add openid  goods_id store_id goods_space_id guige_num
      var params = {
        active: "car_add",
        openid: wx.getStorageSync("token"),
        goods_id: that.data.id,
        store_id: that.data.store_id,
        goods_space_id: that.data.skuItem.id,
        guige_num: that.data.cartNumber,
        fan_u: that.data.isFub,

      }
      app.getRequest(params).then((res) => {
        wx.showToast({
          title: '添加购物车成功',
        })
        // wx.setStorageSync("orderPayStatus", '');
        setTimeout(function() {
          that.setData({
            skuItem: '',
            showModel: 0,
            skuids: [],
            payType: 0,
          });
        }, 1500);
        getDetail(that);
      });
    } else {
      //直接购买存储购买数据
      var buyInfos = [{
        store_id: that.data.store_id, //
        goods_id: that.data.id, //
        goods_space_id: that.data.skuItem.id,
        guige_num: that.data.cartNumber, //
        fan_u: that.data.isFub,
        space_img: that.data.skuItem.space_img, // /
        space_name: that.data.skuItem.space_one_name + ' ' + that.data.skuItem.space_two_name, //
        goods_name: that.data.good.goods_name, //
        store_name: that.data.good.store_name, //
        goods_u: that.data.good.goods_u,
        space_price: that.data.skuItem.space_price, //
        u_num: that.data.good.u_num,
        order_pay_status: that.data.payType,
        goods_u_status: that.data.good.goods_u_status
      }];
      wx.setStorageSync("buyInfos", JSON.stringify(buyInfos));
      // wx.setStorageSync("orderPayStatus", that.data.payType);
      that.setData({
        skuItem: '',
        showModel: 0,
        skuids: []
      });
      wx.navigateTo({
        url: '../order/createOrder',
      })

    }
  },
  editCount(e) {
    var skuItem = this.data.skuItem;
    if (!skuItem) {
      wx.showToast({
        title: '请先选择规格',
        icon: "none"
      })
      return;
    }
    var number = skuItem.space_num;
    var iptNum = e.detail.value;
    if (iptNum > number) {
      wx.showToast({
        title: '输入购买已超过当前库存，请修改数量',
        icon: "none"
      })
      iptNum = number;
    }
    this.setData({
      cartNumber: iptNum
    });

  },
  addNumber(e) {
    var skuItem = this.data.skuItem;
    if (!skuItem) {
      wx.showToast({
        title: '请先选择规格',
        icon: "none"
      })
      return;
    }
    var number = skuItem.space_num;
    this.setData({
      cartNumber: this.data.cartNumber + 1 > number ? this.data.cartNumber : this.data.cartNumber + 1
    });
  },

  jianNumber(e) {
    var skuItem = this.data.skuItem;
    if (!skuItem) {
      wx.showToast({
        title: '请先选择规格',
        icon: "none"
      })
      return;
    }
    this.setData({
      cartNumber: this.data.cartNumber - 1 < 1 ? 1 : this.data.cartNumber - 1
    });
  },
  gotoPayType(e) {
    var id = e.currentTarget.dataset.id,
      that = this;
      if(id==that.data.payType){
        return;
      }
    this.setData({
      payType: id,
    })
    //如果存在选好的规格，是定金支付，那么显示定金价格
    var skuItem = that.data.skuItem;
    if (skuItem) {
      if (id == 1) {
        that.setData({
          space_price: skuItem.space_price,
        })
        skuItem.space_price = that.data.good.dingjin;
      } else {
        skuItem.space_price = that.data.space_price;
      }
      that.setData({
        skuItem: skuItem,
      })
    }
  },
  gotoOpenAddModel(e) {
    var type = e.currentTarget.dataset.type;
    // if (type == "add") {
      if(!wx.getStorageSync("token")){
        wx.showModal({
          title: '您还未登录',
        })
      }else{
      this.setData({
        payType: 0
      })
      // }
      this.setData({
        showModel: 1,
        buyType: type,
      });
    }
      },
    
  //关闭模态框
  closeModel: function() {
    this.setData({
      showModel: 0,
    });
  },
  //是否返U币
  gotoIsFub(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      isFub: id,
    });
  },
  imageLoad: function(e) {
    var height = e.detail.height;
    var width = e.detail.width;
    var imgHeight = this.data.imgHeight;
    var index = e.currentTarget.dataset.index;
    var ratio = 750 * 0.85 / width * height,
      that = this;

    imgHeight[index] = ratio;

    that.setData({
      imgHeight: imgHeight,
      swiperHeight: imgHeight[0] ? imgHeight[0] : '',
    });
  },
  //滑块位置改变的时候，根据滑块位置设置滑块高度
  swiperChange: function(e) {
    var current = e.detail.current;
    var data = this.data.imgHeight;
    this.setData({
      swiperHeight: data[current],
      current: current,
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
    getDetail(this, function() {
      WxParse.wxParse('article', 'html', that.data.content, that, 25);
      //处理默认选择第一个规格，拿到第一个一级规格，查询第二级规格
      var skuids = [];
      var params = {
        active: "goods_space_two",
        goods_space_id: that.data.good.guige_name_none[0].space[0].id,
      }
      app.getRequest(params).then((ress) => {
        var good = that.data.good;

        good.guige_name_none[1].space = ress.data;
        skuids[0] = that.data.good.guige_name_none[0].space[0].id,
          skuids[1] = ress.data[0].id;
        that.setData({
          good: good,
          skuItem: ress.data[0],
          skuids: skuids,
        });
      });
    });
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

  }
})

var getDetail = function(that, callback) {
  // goods_list goods_id
  var params = {
    active: "goods_list",
    // goods_id: wx.getStorageSync("goods_id1"),
    goods_id: that.data.id,
    openid: wx.getStorageSync("token"),
  }
  app.getRequest(params).then((res) => {
    that.setData({
      good: res.data,
      num:res.data.car_num,
      store_id: res.data.store_id,
      content: res.data.goods_content
    });
    if (callback) {
      callback();
    }


    // WxParse.wxParse('article', 'html', res.data.goods_content, that, 25);

  });
}

// 获取用户信息
var getUserData = function(that) {
  var params = {
    openid: wx.getStorageSync("token"),
    active: "user"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      userData: res.data
    });
  });
}
//获取二维码
var getErCode = function(that, callback) {
  var params = {
    active: "erweima",
    goods_id: that.data.id,
    user_id: wx.getStorageSync("user_id"),
  }
  app.getRequest(params).then((res) => {
    that.setData({
      erCodeImg: res.data
    });
    if (callback) {
      callback();
    }
  });
}
// 
var getSkuData = function(that) {
  var params = {
    active: "goods_space",
    goods_id: that.data.id,
  }
  app.getRequest(params).then((res) => {
    that.setData({
      sku: res.data
    });
  });
}