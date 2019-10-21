// pages/category/category.js
var app = getApp();
var qqmapsdk;
var WxParse = require('../../wxParse/wxParse.js');
var QQMapWX = require('../../wxParse/qqmap-wx-jssdk.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    url: wx.getStorageSync("url"),
    business:[],
    addressName: wx.getStorageSync("address"),
   
    xxAction: 1, //线下分类展开1,收起2
    // 轮播
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    circular:true,
    interval: 2000,
    duration: 1000,
    
    // 分类
    
    storeClass:[],
    // 商品滚动
    
    // 优质商家
    flag: 0,
    noteMaxLen: 300, // 最多放多少字
    info: "",
    noteNowLen: 0,//备注当前字数

    latitude: "",
    longitude: "",
    page: 1,
    isAllList: 0,
    store:[],
    storegoods:[],
    xin:[],
    fen:[],
  },
  
  /*,
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   
    getData(this)
    wx.hideShareMenu();
    
    var that = this;
    var offLineItem = wx.getStorageSync("offLineItem");
    that.refesh()
    getShopList(that)
    getOffLineData(that)
    // getShop(that)
    // getStoreList1(that)
  },

  refesh: function () {
    console.log(232356)
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'F6DBZ-7GMKV-ZGTPC-U3A2O-5NXHS-6XBFE'
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          
          success: function (addressRes) { //成功后的回调
            // var addressName = addressRes.result;
            // console.log(addressName.formatted_addresses.recommend)
            that.setData({
              addressName: addressRes.result.address_reference.landmark_l2.title
            })
            wx.setStorageSync("address", addressRes.result.address_reference.landmark_l2.title)

            wx.setStorageSync("latitude", addressRes.result.location.lat)
            wx.setStorageSync("longitude", addressRes.result.location.lng)
            getStoreList1(that)
            // getYouxuanShop(that);
          },
          fail: function (error) {
            console.error(error);
          },
          complete: function (addressRes) {
            // 位置信息
            console.log(addressRes);
          }
        })
      }
    })
  
  },
  gototkDetail() {
    if (wx.getStorageSync("token")) {
      getu(this)
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }
  },
  // 轮播跳转
  gotoDetailImg(e) {
    var id = e.currentTarget.dataset.id,
      type = e.currentTarget.dataset.type;
    if (id < 15) {
      wx.navigateTo({
        url: '../new/detail?id=' + id + "&type='公告'",
        // url:  '../good/detail?id=' + id,
      })
    } else {
      wx.navigateTo({
        // url: '../category/category?id=' + id + "&type='公告'",
        url: '../shop/shop?id=' + id,
      })
    }
  },

  keyWordInput(e) {
    this.setData({
      key: e.detail.value,
    });
  },
  gotoSerch() {
      wx.navigateTo({
        url: '../category/searchCate?key=' + this.data.key,
      })
  },

  // 全部分类
  getstore(e) {
    var id = e.currentTarget.dataset.id
    // img = e.currentTarget.dataset.img,
    // name = e.currentTarget.dataset.name,
    // var uid = e.currentTarget.dataset.uid;
    // this.setData({
    //   sn: id,
    //   // categoryImg: img,
    //   // categoryName: name,
    //   uid: uid,
    // });
    wx.setStorageSync('store_id', id)
    wx.navigateTo({
      url: '../category1/storeall?id=' + e.currentTarget.dataset.id
    })
  },
 

  //展开收起
  goXxAction() {
    var xxAction = this.data.xxAction;
    this.setData({
      xxAction: xxAction == 1 ? 2 : 1,
    })
  },
  // vip
  buyVip(){
    wx.navigateTo({
      url: '../../pages/user/buySvip',
    })
  },
  
  keyInput(e) {
    this.setData({
      key: e.detail.value,
    });
  },
  gotoSearch() {
    if (this.data.type == 1) {
      wx.navigateTo({
        url: 'search?key=' + this.data.key,
      })
    } else {
      wx.navigateTo({
        url: 'searchCate?key=' + this.data.key,
      })
    }
  },
  //查看商户主页
  gotoShopCenter(e) {
    var sid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shop/shop?id=' + sid,
    })
  },
 
 
  //切换一级分类，更改广告位图片
 
  //选择类型
  gotoSelectType(e) {
    var id = e.currentTarget.dataset.id,
      that = this;
    if (id != this.data.type) {
      this.setData({
        type: id,
        twoClass: [],
      });
    }
    if (id == 1) {
     
    } else {
      getCagetoryOneShop(this, function () {
        getTwoCateShop(that);
      });
    }
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
    var that=this;
    wx.showLoading({
      title: '玩命加载中',

    })
    // that.refesh()

    setTimeout(function () {
     
      that.refesh()
      wx.hideLoading()
    }, 2000)
  

      wx.stopPullDownRefresh()
      // 下拉刷新停止
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
      getStoreList1(this)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //定位
  gotoSelectdwAdderss() {
    var that = this;
    wx.chooseLocation({
      success(res) {
        //需保持新定位，重新请求数据
        console.log(res)
        that.setData({
          addressName: res.name,
          latitude: res.latitude,
          longitude: res.longitude,
          store: [],
          page: 1,
          isAllList: 0
        });
        wx.setStorageSync("latitude", res.latitude)
        wx.setStorageSync("longitude", res.longitude)
        getStoreList1(that)
      }
    })
    
  },
  // 商户信息
  gotoShopIndex(e) {
    var sid = e.currentTarget.dataset.id;
   
    wx.navigateTo({
      url: '../shop/shop?id=' + sid,
    })
  },
})
//商户信息

// 获取线下商户一级分类
var getOffLineData = function (that) {
  var params = {
    active: "store_class",
  }
  app.getRequest(params).then((res) => {
    that.setData({
      storeClass: res.data,
      selectStoreClassId: 'yx'
    });
    // that.getStoreClassList(res.data[0].id);
  });
}


//获取二级分类

//获取商铺分类
var getCagetoryOneShop = function (that, callback) {
  var params = {
    active: "store_class"
  }
  app.getRequest(params).then((res) => {
    var categoryItem = wx.getStorageSync("offLineItem");
    if (categoryItem) {
      that.setData({
        goodsClass: res.data,
        sn: categoryItem.id,
        categoryImg: '',
        categoryName: categoryItem.store_class_name,
      });
      wx.removeStorageSync("offLineItem");
    } else {
      that.setData({
        goodsClass: res.data,
        sn: res.data[0].id,
        categoryImg: '',
        categoryName: res.data[0].store_class_name,
      });
    }
    if (callback) {
      callback();
    }
  });
}

//获取商铺产品
var getTwoCateShop = function (that, callback) {
  // store_class_list  store_class_id
  var params = {
    active: "store_class_list",
    store_class_id: that.data.sn,
    where: that.data.region[1] + that.data.region[2]
  }
  app.getRequest(params).then((res) => {
    that.setData({
      twoClass: res.data,
    });
    if (callback) {
      callback();
    }
  });
}
// 轮播
var getShopList = function (that) {
  var params = {
    active: "store_lunbo"
  }
  app.getRequest(params).then((res) => {
    console.log(res)
    that.setData({
      imgUrls: res.data
    });
  });

}
// 首页推荐商户
var getStoreList1 = function (that) {
  var params = {
    active: "store_hot",
    lat: wx.getStorageSync("latitude"),            
    lng: wx.getStorageSync("longitude"),
    page:that.data.page
  }
  app.getRequest(params).then((res) => {
    var store = that.data.store;
    if (res.data.length == 0) {
      wx.showToast({
        title: '已加载全部数据..',
        icon: "none"
      })
      that.setData({
        isAllList: 1
      });
    } else {
      for (var i = 0; i < res.data.length; i++) {
        store = store.concat(res.data[i]);
      }
      that.setData({
        store: store,
        isAllList: 2
      });
    }
    // WxParse.wxParse('article', 'html', res.data.content, that, 25);
  });

}

var getData = function (that) {
  var params = {
    active: "carousel"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      // imgUrls: res.data.lunbo,
      // advertisement: res.advertisement
      fen: res.data.fen,
      xin: res.data.xin,
      jinkou: res.data,
      cateid: res.data.hot_class.length > 0 ? res.data.hot_class[0].id : ''
      // goods_hot: res.data.goods_hot,
    });
    // getFirstData(that);
  });
}

var getu = function (that, callback) {

  var params = {
    active: "u_coin_new",
    openid: wx.getStorageSync("token")
  }
  app.getRequest(params).then((res) => {
    console.log(res)
    wx.showToast({
      title: res.data,
    })
    that.setData({
      orderInfo: res,
    });
    if (callback) {
      callback();
    }
  });

}

