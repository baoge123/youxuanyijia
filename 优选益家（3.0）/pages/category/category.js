// pages/index/index.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var QQMapWX = require('../../wxParse/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    type: 2, //1为优选自营 2位线下商户,
   
    
    curNav: '',
    imagewidth: 0, //缩放后的宽 
    imageheight: 0, //缩放后的高 
    url: wx.getStorageSync("url"),
    rows: '',
    advertisement: [1, 1, 1],
    sn: 1,
    advertisement: [],
   
    circular: true,
    indicatorDots: false,
   
    autoplay: true,
    interval: 5000,
    duration: 500,
    current: 0,

    isAllList: 1,
    page: 1,
    list: [],
    imgHeight: [],
    swiperHeight: '',
    windowHeight: 0,
    
    cateid: 1,

    fixedBox: 0,
    addressName: "成都市",
    latitude: "30.64242",
    longitude: "104.04311",
    key: '',
    goods_hot: [],
    isAllList: 0,
    page: 1,
    flexs: 0, //1浮动，0显示。
  },
    
  onPreLoad:function(){
      this.fetch({
       id:req.query.channelId?req.query.channelId:defaultId,
       isPreload:true
      })
      console.log(111)
    // getYouxuanShop(this);
  }, 
  onLoad: function (options) {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'F6DBZ-7GMKV-ZGTPC-U3A2O-5NXHS-6XBFE'
    });
    
    var that = this;
    wx.removeStorageSync("store_id");

    
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) { //成功后的回调
            // var addressName = addressRes.result;
            // console.log(addressName.formatted_addresses.recommend)
            that.setData({
             addressName: addressRes.result.address_reference.landmark_l2.title,
              latitude: addressRes.result.location.lat,
              longitude: addressRes.result.location.lng
            })
            // latlngGetAddress(that);
            wx.setStorageSync("latitude", res.latitude);
            wx.setStorageSync("longitude", res.longitude);
            getYouxuanShop(that);
          },
          fail: function (error) {
            console.error(error);
          },
          complete: function (addressRes) {
            console.log(addressRes);
          }
        })
      }
    })
    
    // 获取需要吸顶的view的在屏幕的那个位置
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
    //                 latitude:res. latitude,
    //                 longitude:res. longitude,
    //               });
    //               wx.setStorageSync("latitude", res.latitude);
    //               wx.setStorageSync("longitude", res.longitude);
    //               // latlngGetAddress(that)
    //               getYouxuanShop(that);
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
    //             latitude:res.latitude,
    //             longitude:res.longitude,
    //           });
    //           wx.setStorageSync("latitude", res.latitude);
    //           wx.setStorageSync("longitude", res.longitude);
    //           // latlngGetAddress(that)
    //           getYouxuanShop(that);
    //         }
    //       })
    //     }
    //   }
    // })

    // getYouxuanShop(this);
    // getData(that);
    // tcDetail(that)
    if (!wx.getStorageSync("token")) {
      loginCallback(that);
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

    getOffLineData(this);
    getShopList(this);
    // getYouxuanShop(this);
    
    // getData(this);
  },
  gotoDetailImg(e){
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
        scrollTop: that.data.tops - 50,
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
      url: '../luckdraw/list',
    })
  },
  //弹框跳转
  
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
    if (that.data.type == 2) {
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
      }, 500);
    }

  },

  onShow: function (e) {
    console.log('signin')
    // const _this = this;
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
    //         _this.setData({
    //           addressName: addressRes.result.formatted_addresses.recommend
    //         })
    //       },
    //       fail: function (error) {
    //         console.error(error);
    //       },
    //       complete: function (addressRes) {
    //         console.log(addressRes);
    //       }
    //     })
    //   }
    // })
   

    var that = this;
    that.setData({
      // flexs: 0,
      // tops:0,
    });
    // if (that.data.type == 1) {
    //   wx.removeStorageSync("store_id");
    //   var query = wx.createSelectorQuery(),
    //     that = this;
    //   setTimeout(function() {
    //     query.select('.scroll_box').boundingClientRect();
    //     query.exec((res) => {
    //       that.setData({
    //         tops: res[0].top
    //       })
    //       // tops = res[0].top;
    //       // var listHeight = res[0].height; // 获取list高度
    //       // console.log("吸顶的高度：" + res[0].top)

    //     })
    //   }, 600);
    // }
  },
  gotoCategory() {
    wx.switchTab({
      url: '../category/category',
    })
  },
  gotoNewList() {
    wx.navigateTo({
      url: '../new/list',
    })
  },
  //定位
  gotoSelectdwAdderss() {
    var that = this;
    wx.getSetting({
      success(res) {

        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success(res) {

              // console.log(res.authSetting)
              if (!res.authSetting['scope.userLocation']) {
                wx.showToast({
                  title: '请允许使用我的地理位置',
                  icon: "none"
                })
              } else {
                wx.authorize({
                  scope: 'scope.userLocation',
                  success() {
                    wx.chooseLocation({
                      success(ress) {
                        //需保持新定位，重新请求数据
                        that.setData({
                          addressName: ress.name,
                          latitude: ress.latitude,
                          longitude: ress.longitude,
                        });
                        // getShopList,

                        // latlngGetAddress(that);
                        // getYouxuanShop(that);
                        
                        wx.setStorageSync("addressName", res.name);
                        wx.setStorageSync("latitude", res.latitude);
                        wx.setStorageSync("longitude", res.longitude);
                      }
                    })
                  }
                })
              }

            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.chooseLocation({
                success(ress) {
                  //需保持新定位，重新请求数据
                  that.setData({
                    addressName: ress.name,
                    latitude: ress.latitude,
                    longitude: ress.longitude,
                  });
                  // getShopList,
                  
                  // latlngGetAddress(that);
                  getYouxuanShop(that);
                  wx.setStorageSync("addressName", res.name);
                  wx.setStorageSync("latitude", res.latitude);
                  wx.setStorageSync("longitude", res.longitude);
                }
              })
            }
          })
        }
      }
    })

  },
  // 全部商户
  gotoAllProduct() {
    wx.navigateTo({
      url: '../category/all?id='+this.data.cateid,
    })
    wx.switchTab({
      url: '../category/category',
    })
  },
  
  
  
  //选择类型

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
  //滑块位置改变的时候，根据滑块位置设置滑块高度
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


  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this,
      type = this.data.type;
    if (type == 1) {
      that.setData({
        idxData: '',
        cateid: '',
        goods_hot: [],
        isAllList: 0,
        page: 1,
        shopHot: [],
        flexs: 0,
      });
      // getData(that);
      getFirstData(that);
      wx.stopPullDownRefresh()
    } else {
      that.setData({
        storeClass: [],
        hotStoreClass: [],
        goods_hot: [],
        shopHot: [],
        shopLunbo: [],
        flexs: 0,
        selectStoreClassId: 'yx'
      });

      getOffLineData(that);
      
      getShopList(that);
      wx.stopPullDownRefresh()
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.type == 2) {
      this.setData({
        page: that.data.page + 1,
      });
      if (that.data.isAllList == 0) {
        wx.showToast({
          title: '已加载全部数据..',
          icon: "none"
        })
      } else
        11111
    }
  },
  /**
   * 用户点击右上角分享
   */
 
  gotoSelectOffCategory(e) {

    var id = e.currentTarget.dataset.id,
      that = this;
    getFirstData(this, function () {
      that.toTopBox();
    });
    that.setData({
      store_hot: [],
      flexs: 1,
    });
    setTimeout(function () {
      that.toTopBox();
    }, 400)
    if (id == "yx") {
      that.setData({
        selectStoreClassId: 'yx'
      });
      getYouxuanShop(that);
    } else {
      if (!id) {
        return;
      }
      that.getStoreClassList(id);
    }


  },
  getStoreClassList(id) {
    var that = this;
    
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
var getYouxuanShop = function (that, callback) {
  var params = {
    active: "youxuan",
    lat: that.data.latitude,
    lng: that.data.longitude
  }
  app.getRequest(params).then((res) => {
    that.setData({
      store_hot: res.data,
    });
  });
}



//登陆回调事件

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

var getShopList = function (that) {
  var params = {
    active: "store_index",
    lat: that.data.latitude,
    lng: that.data.longitude,
    page: that.data.page,
  }
  app.getRequest(params).then((res) => {
    that.setData({
      // goods_hot: res.data.data,
      shopHot: res.data.hot,
      shopLunbo: res.data.lunbo,
    });
  });

}
var latlngGetAddress = function (that) {
  var params = {
    active: "lat_lng",
    lat: that.data.latitude,
    lng: that.data.longitude,
  }
  app.getRequest(params).then((res) => {
    that.setData({
      addressName: res.data
    });
   

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
var getFirstData = function (that, callback) {
  var params = {
    active: "first_goods",
    id: that.data.cateid ? that.data.cateid : '',
    page: that.data.page,
  }
  app.getRequest(params).then((res) => {
    var list = that.data.goods_hot;
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
        list = list.concat(res.data[i]);
      }
      that.setData({
        goods_hot: list,
        isAllList: 2
      });
    }
    // that.setData({
    //   goods_hot: res.data,
    // });
    if (callback) {
      callback()
    }
  });
}