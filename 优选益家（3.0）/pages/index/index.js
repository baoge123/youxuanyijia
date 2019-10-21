// pages/index/index.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var QQMapWX = require('../../wxParse/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    url: wx.getStorageSync("url"),
    jinkou:[],
    addressName:"成都市",
    fen:[],
    xin:[],
    sn:1,
    goodsClass:[],
    orderInfo:[],
    // 轮播
    swiperIndex: 0,
    current: 0,
    imagewidth: 0, //缩放后的宽 
    imageheight: 0, //缩放后的高 
    imgHeight: [],
    swiperHeight:"",
    windowHeight: 0,
    cateid: 1,
    isAllList: 0,
    page: 1,

    imgUrls: "",
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 1000,
    goods_img:[],

  // 热门推荐
  hot:[],
  },
  onReady() {
    this.showModal()
  },
  showModal() {
    this.setData({
      modalName: 'Image'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  
  
  onLoad: function (options) {
    index_img(this)
    // good_goods(this)
    wx.getStorage({
      key: 'testDate',
      success: function (res) {
        that.setData({
          testDate: res.data,
        })
      }
    })
    
    
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'F6DBZ-7GMKV-ZGTPC-U3A2O-5NXHS-6XBFE'
    });
    var that = this;
    // wx.removeStorageSync("store_id");
   // 获取需要吸顶的view的在屏幕的那个位置
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       },
    //       success: function (addressRes) { //成功后的回调
    //         // var addressName = addressRes.result;
    //         // console.log(addressName.formatted_addresses.recommend)
    //         that.setData({
    //           addressName: addressRes.result.address_reference.landmark_l2.title
    //         })
    //         wx.setStorageSync("address", addressRes.result.address_reference.landmark_l2.title)
          
    //         wx.setStorageSync("latitude", addressRes.result.location.lat)
    //         wx.setStorageSync("longitude", addressRes.result.location.lng)
    //         // getYouxuanShop(that);
    //       },
    //       fail: function (error) {
    //         console.error(error);
    //       },
    //       complete: function (addressRes) {
    //         // 位置信息
    //         console.log(addressRes);
    //       }
    //     })
    //   }
    // })
    // wx.getSetting({
    //   success(ress) {
    //     if (!ress.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success() {
    //           //获取用户当前位置
    //           wx.getLocation({
    //             type: 'wgs84',
    //             success(res) {
    //               const latitude = res.latitude
    //               const longitude = res.longitude
    //               that.setData({
    //                 latitude: latitude,
    //                 longitude: longitude,
    //               });
    //               wx.setStorageSync("latitude", res.latitude);
    //               wx.setStorageSync("longitude", res.longitude);
    //               latlngGetAddress(that)
    //             }
    //           })
    //         }
    //       })
    //     } else {
    //       wx.getLocation({
    //         type: 'wgs84',
    //         success(res) {
    //           const latitude = res.latitude
    //           const longitude = res.longitude
    //           that.setData({
    //             latitude: latitude,
    //             longitude: longitude,
    //           });
    //           wx.setStorageSync("latitude", res.latitude);
    //           wx.setStorageSync("longitude", res.longitude);
    //           latlngGetAddress(that)
    //         }
    //       })
    //     }
    //   }
    // })

    getGood(that)
    getData(that);
    tcDetail(that)
    getCagetoryOne(that)
    if (!wx.getStorageSync("token")) {
      // loginCallback(that);
    }
    //获取设备窗口信息
    wx.getSystemInfo({
      success: function (res) {
        var wid = 750 / res.windowWidth
        that.setData({
          windowHeight: res.windowHeight * wid
        })
      }
    });


  },
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  showModal() {
    this.setData({
      modalName: 'Image'
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 大牌好货
  good(e){
   var id = e.currentTarget.dataset.id
    wx.setStorageSync('index_status', id)
    wx.navigateTo({
      url: '../../pages/index/goods?id='+id,
    })
  },
  // 三十封顶
  sanshi(e) {
    var id = e.currentTarget.dataset.id
    wx.setStorageSync('index_status', id)
    wx.navigateTo({
      url: '../../pages/index/goods?id=' + id,
    })
  },
  // 九九
  jiujiu(e) {
    var id = e.currentTarget.dataset.id
    wx.setStorageSync('index_status', id)
    wx.navigateTo({
      url: '../../pages/index/goods?id=' + id,
    })
  },
  // 热销榜单
  hot(e) {
    var id = e.currentTarget.dataset.id
    wx.setStorageSync('index_status', id)
    wx.navigateTo({
      url: '../../pages/index/goods?id=' + id,
    })
  },
  // vip
  buyVip1() {
    wx.navigateTo({
      url: '../../pages/user/buySvip',
    })
  },
  gethehuo() {
    wx.navigateTo({
      url: '../../pages/Community/tuanzhang',
    })
  },
  // 商品
  getGoodsClass(e){
    var id = e.currentTarget.dataset.id
      // img = e.currentTarget.dataset.img,
      // name = e.currentTarget.dataset.name,
    var  uid = e.currentTarget.dataset.uid;
    this.setData({
      sn: id,
      // categoryImg: img,
      // categoryName: name,
      uid: uid,
    });
    wx.setStorageSync('testDate', this.data.sn)
    wx.navigateTo({
      url: '../category/all?id=' + e.currentTarget.dataset.id 
    })

    // getCagetoryOne(this);
    // getTwoCate(this);
    
  },
  goodAll1(){
    wx.navigateTo({
      url: '../../pages/goodall/goodall'
    })
  },
  gotoNewList() {
    wx.navigateTo({
      url: '../new/list',
    })
  },
  
// 活动专区
 gotoPlay(){
   wx.navigateTo({
     url: '../new/list'
   })
    },
  // 超级VIP
  gotoSvip() {
    wx.navigateTo({
      url: '../user/buySvip'
    })
  },
  // 活动商品
  huodong(){
    wx.navigateTo({
      url: '../luckdraw/list'
    })
  },
// 社区招募
  community(){
    wx.navigateTo({
      url: '../Community/Community'
    })
  },
  choujiang(){
    wx.navigateTo({
      url: '../luckdraw/history'
    })
  },
  gotoDetailImg(e) {
    var id = e.currentTarget.dataset.id,
      type = e.currentTarget.dataset.type;
    wx.setStorageSync("goods_id1", id);
    if (id < 15) {
      wx.navigateTo({
        url: '../new/detail?id=' + id + "&type='公告'",
        // url:  '../good/detail?id=' + id,
      })
    } else {
      wx.navigateTo({
        // url: '../category/category?id=' + id + "&type='公告'",
        url: '../good/detail?id=' + id,
      })
    }

  },

  onPageScroll: function (e) {
    var that = this,
      flexs = this.data.flexs;
    // console.log("height：" + e.scrollTop + " float：" + this.data.flexs + " toTop:" + this.data.tops);
    // console.log("height：" + e.scrollTop);
    var tops = this.data.tops;
    if (e.scrollTop < tops) {
      this.setData({
        flexs: 0,
      })
    } else if (flexs == 0) {
      this.setData({
        flexs: 1,
      })
    }

  },
  toTopBox() {
    var that = this;
    setTimeout(function () {
      console.log("顶部高度：" + that.data.tops);
      wx.pageScrollTo({
        scrollTop: that.data.tops,
        duration: 0
      })
      that.setData({
        flexs: 1,
      });

    }, 500);

  },
  keyWordInput(e) {
    this.setData({
      key: e.detail.value,
    });
  },
  gotoSerch() {
    if (this.data.type == 2) {
      wx.navigateTo({
        url: '../category/searchCate?key=' + this.data.key,
      })
    } else {
      wx.navigateTo({
        url: '../category/search?key=' + this.data.key,
      })
    }
  },
  gotoActiveList() {
    wx.navigateTo({
      url: '../luckdraw/play/play',
    })
  },
  gotoActiveList1() {
    wx.navigateTo({
      url: '../luckdraw/list',
    })
  },
  //弹框跳转
  gototkDetail() {
    if (wx.getStorageSync("token")){
      getu(this)
    }else{
      wx.showToast({
        title: '请先登录',
      })
    }
   
  },
  gotoLookTips() {
    this.setData({
      fixedBox: 0,
    })
  },
  //查看商户推荐的商品 线下
  gotoShopGood(e) {

    var sid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shop/detail?id=' + sid,
    })
  },
  gotoShopIndex(e) {

    var sid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shop/shop?id=' + sid,
    })
  },
  //查看
  gotoMoreTj() {
    var type = this.data.type;
    if (type == 2) {
      wx.setStorageSync("offLineItem", this.data.storeClass[0] ? this.data.storeClass[0] : '');
    }
    wx.switchTab({
      url: '../category/category',
    })
  },
  //查看线下分类
  gotoOfflineClass(e) {
    var item = e.currentTarget.dataset.item;
    wx.setStorageSync("offLineItem", item);
    wx.switchTab({
      url: '../category/category',
    })
  },
  //加入vip
  gotoJoinVip() {
    wx.navigateTo({
      url: '../user/buySvip',
    })
  },
  //热门或推荐商品 查看详情
  gotoHotProduct(e) {
    var id = e.currentTarget.dataset.id;
    // wx.setStorageSync("goods_id1", id);
    if (id) {
      wx.navigateTo({
        url: '../good/detail?id=' + id,
      })
    }
  },
  gotoNoticeDetail(e) {
    var id = e.currentTarget.dataset.id,
      status = e.currentTarget.dataset.status;
    // if (status == 0) {
    wx.navigateTo({
      url: '../new/detail?id=' + id + "&type='资讯'",
    })
    getCagetoryOne(that)
  },
  //查看分类
  gotoCategoryList: function (e) {
    var item = e.currentTarget.dataset.item;
    wx.setStorageSync("categoryItem", item);
    wx.switchTab({
      url: '../category/category',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    if (that.data.type == 1) {
      wx.removeStorageSync("store_id");
      var query = wx.createSelectorQuery(),
        that = this;
      setTimeout(function () {
        query.select('.scroll_box').boundingClientRect();
        query.exec((res) => {
          that.setData({
            tops: res[0].top
          })
          // tops = res[0].top;
          // var listHeight = res[0].height; // 获取list高度
          console.log("吸顶的高度：" + res[0].top)

        })
      }, 300);
    }

  },
  onShow: function (e) {
    var that = this;
    that.setData({
      // flexs: 0,
      // tops:0,
    });
    
  },

 
 
  gotoCategory() {
    wx.switchTab({
      url: '../category/category',
    })
  },
  supplier(){
    wx.navigateTo({
      url: '../supplier/supplier',
    })
  },
  gotoNewList() {
    wx.navigateTo({
      url: '../new/list',
    })
  },
  
  gotoAllProduct() {
    // wx.navigateTo({
    //   url: '../category/all?id='+this.data.cateid,
    // })
    wx.switchTab({
      url: '../category/category',
    })
  },
  //展开收起
  goXxAction() {
    var xxAction = this.data.xxAction;
    this.setData({
      xxAction: xxAction == 1 ? 2 : 1,
    })
  },
  
 
  
  
  imageLoadItem: function (e) {
    // console.log("图片高度：" + ratio);
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
  // 滑块位置改变的时候，根据滑块位置设置滑块高度
  swiperChange: function (e) {
    var current = e.detail.current;
    var data = this.data.imgHeight;
    this.setData({
      swiperHeight: data[current],
      current: current,
    });
  },
  //去商品详情
  gotoDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail2?id=' + id,
    })
  },
  //搜索商品
  gotoSearch() {
    wx.navigateTo({
      url: 'search',
    })
  },

  //切换分类方法
  // changeCategory: function(e) {
  //   var id = e.currentTarget.dataset.id,
  //     that = this;
  //   that.setData({
  //     sn: id,
  //     isAllList: 1,
  //     page: 0,
  //     list: [],
  //   });
  //   getData(that);
  // },
  gotoClass: function (e) {
    //二级分类点击事件
    wx.navigateTo({
      url: '../seekList/seekList?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    index_img(this)
    getShopList(this)
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
      getGood(this)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/user/getUserInfo?user_id=' + wx.getStorageSync("user_id"),
    }
  },
  gotoSelectOffCategory(e) {

    var id = e.currentTarget.dataset.id,
      that = this;
    that.setData({
      store_hot: []
    });
    setTimeout(function () {
      that.toTopBox();
    }, 400)
    if (id == "yx") {
      that.setData({
        selectStoreClassId: 'yx'
      });
      // getYouxuanShop(that);
    } else {
      if (!id) {
        return;
      }
      that.getStoreClassList(id);
    }


  },
  getStoreClassList(id) {
    var that = this;
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     const latitude = res.latitude ? res.latitude : ''
    //     const longitude = res.longitude ? res.longitude : ''

    //   }
    // });
    var params = {
      active: "store_class_dest",
      lat: that.data.latitude,
      lng: that.data.longitude,
      store_class_id: id,
    }
    app.getRequest(params).then((res) => {
      that.setData({
        store_hot: res.data,
        selectStoreClassId: id,
      });
    });
  },
})
// youxuan 
// var getYouxuanShop = function (that, callback) {
//   var params = {
//     active: "youxuan",
//     lat: that.data.latitude,
//     lng: that.data.longitude
//   }
//   app.getRequest(params).then((res) => {
//     that.setData({
//       store_hot: res.data,
//     });
//   });
// }
// 获取分类
var getCagetoryOne = function (that, callback) {

  var params = {
    active: "goods_class"
  }
  app.getRequest(params).then((res) => {
    var categoryItem = wx.getStorageSync("categoryItem");
    if (categoryItem) {
      that.setData({
        c: res.data,
        sn: categoryItem.id,
        categoryImg: categoryItem.class_lunbo_img,
        categoryName: categoryItem.class_name,
      });
      wx.removeStorageSync("categoryItem");
    } else {
      that.setData({
        goodsClass: res.data,
        sn: res.data[0].id,
        categoryImg: res.data[0].class_lunbo_img,
        categoryName: res.data[0].class_name,
      });
    }
    if (callback) {
      callback();
    }
  });
}
var getData = function (that) {
  var params = {
    active: "carousel"
  }
  app.getRequest(params).then((res) => {
    that.setData({
      imgUrls: res.data.lunbo,
      // advertisement: res.advertisement
      fen:res.data.fen,
      xin:res.data.xin,
      jinkou:res.data,
      cateid: res.data.hot_class.length > 0 ? res.data.hot_class[0].id : ''
      // goods_hot: res.data.goods_hot,
    });
    // getFirstData(that);
  });
}

    
// 登陆回调事件
// var loginCallback = function (that, callback) {
//   wx.login({
//     success: ress => {
//       // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       var code = ress.code;
//       var params = {
//         active: "openid",
//         js_code: code,
//       }
//       wx.request({
//         url: wx.getStorageSync('url'),
//         method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
//         header: {
//           'content-type': 'application/x-www-form-urlencoded'
//         }, // 设置请求的 header
//         data: params,
//         success: function (res) {
//           wx.setStorageSync("token", res.data.openid);
//         }
//       })
//     }
//   })
// }

    


var latlngGetAddress = function (that) {
  var params = {
    active: "lat_lng",
    lat: wx.getStorageSync("latitude"),
    lng: wx.getStorageSync("longitude"),
  }
  app.getRequest(params).then((res) => {
    that.setData({
      addressName: res.data
    });
    // wx.setStorageSync("addressName", addressName);
    // WxParse.wxParse('article', 'html', res.data.content, that, 25);

  });
}
// index_cpm  
var tcDetail = function (that) {
  var params = {
    active: "index_cpm",
  }
  app.getRequest(params).then((res) => {
    if (res.data.img_src && res.data.cpm_id) {
      that.setData({
        tkStatus: res.data.status,
        tkcpm_id: res.data.cpm_id,
        fixedBox: 1,
        tkImg: res.data.img_src
      });
    }
    // WxParse.wxParse('article', 'html', res.data.content, that, 25);

  });
}

var getGood = function (that) {
  var params = {
    active: "goods_special_select",
    status:5,
    page:that.data.page,
  }
  app.getRequest(params).then((res) => {
    var hot = that.data.hot;
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
        hot = hot.concat(res.data[i]);
      }
      that.setData({
        hot: hot,
        isAllList: 2
      });
    }
    // WxParse.wxParse('article', 'html', res.data.content, that, 25);

  });
}



// 

var index_img= function (that, callback) {

  var params = {
    active: "active_img",
  }
  app.getRequest(params).then((res) => {
    console.log(res)
    that.setData({
      goods_img: res.data,
    });
    if (callback) {
      callback();
    }
  });

}

