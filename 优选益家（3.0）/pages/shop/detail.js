// pages/shop/detail.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
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
    showModel: 0,
    cartNumber: 1,
    skuids: [],
    stock: 0,
    store_id: 1,
    isFub: 0,
    payType: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var wid = 750 / res.windowWidth
        that.setData({
          windowHeight: res.windowHeight * wid
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
  gotoShowModelTwo() {
    var that = this;
    wx.navigateTo({
      url: '../good/sharePage?erCodeImg=' + that.data.erCodeImg + "&price_now=" + that.data.good.goods_price_now + "&price=" + that.data.good.goods_price + "&goods_name=" + that.data.good.goods_name + "&goods_img=" + that.data.good.goods_img,
    })
  },
  //购买会员
  gotoBuyVip() {
    wx.navigateTo({
      url: '../user/buySvip',
    })
  },
  gotoCart() {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  //选中规格
  sureShopping(e) {
    var idx = e.currentTarget.dataset.idx,
      sku = e.currentTarget.dataset.sku,
      that = this;
    that.setData({
      skuItem: sku,
    });
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
        setTimeout(function() {
          that.setData({
            skuItem: '',
            showModel: 0,
            skuids: []
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
        space_name: that.data.skuItem.space_name, //
        goods_name: that.data.good.goods_name, //
        store_name: that.data.good.store_name, //
        goods_u: that.data.good.goods_u,
        space_price: that.data.skuItem.space_price, //
        u_num: that.data.good.u_num,
        order_pay_status: that.data.payType,
        goods_u_status: that.data.good.goods_u_status
      }];
      wx.setStorageSync("buyInfos", JSON.stringify(buyInfos));
      that.setData({
        skuItem: '',
        showModel: 0,
        skuids: []
      });
      wx.navigateTo({
        url: '../order/createOrder1',
      })
      // var params = {
      //   active: "car_add",
      //   openid: wx.getStorageSync("token"),
      //   goods_id: that.data.id,
      //   store_id: that.data.store_id,
      //   goods_space_id: that.data.skuItem.id,
      //   guige_num: that.data.cartNumber,
      //   space_name: that.data.skuItem.space_one_name,
      // }
      // app.getRequest(params).then((res) => {
      //   var good = that.data.good;
      //   good.guige_name_none[1].space = res.data;
      //   that.setData({
      //     good: good,
      //     // skuItem:'',
      //   });
      // });
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
  gotoOpenAddModel(e) {
    if (!wx.getStorageSync("token")){
      wx.showToast({
        title: '请先登录',
      })
    }else{
      var type = e.currentTarget.dataset.type;
    this.setData({
      showModel: 1,
      buyType: type,
    });
    }
    
    // var type = e.currentTarget.dataset.type;
    // this.setData({
    //   showModel: 1,
    //   buyType: type,
    // });
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
    var that=this;
    getDetail(this,function(){
      var good=that.data.good;
      that.setData({
        skuItem: good.guige[0]
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
    active: "store_goods_list",
    goods_id: that.data.id,
    openid: wx.getStorageSync("token"),
  }
  app.getRequest(params).then((res) => {
    that.setData({
      good: res.data,
      store_id: res.data.store_id,
    });
    wx.setStorageSync("good", res.data.goods_price_yuan)
    WxParse.wxParse('article', 'html', res.data.goods_content, that, 25);
    if (callback) {
      callback();
    }
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