// pages/shop/shop.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    store_id: String, //默认选中第一个商品规格
    latitude: String,
    longitude: String,
    // price: Number,
    // img: String,
    // type: String,

    // standards: Array,//规格参数
    // normal: String,
  },
  /**
   * 组件的初始数据
   */
  data: {
    comment:[],
    user:[],
    username:wx.getStorageSync("userData"),

    url: wx.getStorageSync("url"),
    advertisement: ["https://songrushuai.sccxbe.com/static/wap/1.0.0/images/banner.jpg", "http://p0.qhimgs4.com/t01b55e942ed670e4ee.jpg", "http://p0.qhimgs4.com/t01b55e942ed670e4ee.jpg"],
    circular: true,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    current: 0,
    imgHeight: [],
    swiperHeight: '',
    shop_id: wx.getStorageSync("store_id"),
    // store_id: wx.getStorageSync("store_id"),
    latitude: "30.64242",
    longitude: "104.04311"
  },
  observers: {

  },
  lifetimes: {
    attached() {
      
      // 在组件实例进入页面节点树时执行
      // that.setData({
      //   id: options.id,
      //   // id: 2,
      // });
      this.setData({
        shop_id: wx.getStorageSync("store_id"),
        store_id: this.data.store_id,
      });
      this.getDetail();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // buy1(){
    //   if (!wx.getStorageSync("token")) {
    //     wx.showModal({
    //       title: '您还未登录',
    //       content: '请先登录',
    //     })
    //   } else {
    //     wx.navigateTo({
    //       url: "../order/createOrder?id=' + id",
    //     })
    //   }
    //   },
     
    show: function() {
      // var store_id=this.data;
      // getDetail();
    },
    gotoDetail(e) {
      this.setData({
        
      })
      var id = e.currentTarget.dataset.id;
       if(!wx.getStorageSync("token")){
         wx.showModal({
           title: '您还未登录',
           content: '请登录 ',
         })
       }else{
         wx.navigateTo({
           url: 'detail?id=' + id,
         })
       }
     
    },
    selectClass(e) {
      var sid = e.currentTarget.dataset.id,
        that = this;
      if (sid != this.data.tid) {
        this.setData({
          tid: sid
        });
        that.getGoodClassDetail(sid);
      }
    },
    gotoOpenMap() {
      //判断用户是否授权
      var that = this;
      var data = that.data.good;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
                if (!res.authSetting['scope.userLocation']) {
                  wx.showToast({
                    title: '请允许使用我的地理位置',
                    icon: "none"
                  })
                } else {
                  console.log(res.authSetting)
                  wx.authorize({
                    scope: 'scope.userLocation',
                    success() {
                      //获取商户经纬度
                      wx.openLocation({
                        latitude: parseFloat(data.lat),
                        longitude: parseFloat(data.lot),
                        name: data.address,
                        scale: 28
                      })
                    }
                  })
                }

              }
            })
          } else {
            console.log(res.authSetting)
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
                wx.openLocation({
                  latitude: parseFloat(data.lat),
                  longitude: parseFloat(data.lot),
                  name: data.address,
                  scale: 28
                })
              }
            })
          }
        }
      })

    },

    // gotoZhengBox() {
    //   var time = this.data.good.time;
    //   var zAry = this.data.good.zizhi;
    //   wx.navigateTo({
    //     url: 'info?time=' + time + "&zizhi=" + zAry,
    //   })
    // },
    copyAddress() {
      var that = this;
      wx.setClipboardData({
        data: that.data.good.address,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
              wx.showToast({
                title: '复制成功',
              })
            }
          })
        }
      })
    },
    cellShop() {
      var that = this;
      if (that.data.good.sever_phone) {
        wx.makePhoneCall({
          phoneNumber: that.data.good.sever_phone,
        })
      } else {
        wx.showToast({
          title: '商户暂未设置服务电话',
          icon: "none"
        })
      }

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
    getDetail: function(callback) {
      // goods_list goods_id
      var that = this;

      var params = {
        active: "store",
        store_id: that.properties.store_id ? that.properties.store_id : wx.getStorageSync("store_id"),
        lat: wx.getStorageSync("latitude"),
        lng: wx.getStorageSync("longitude"),
      }
      app.getRequest(params).then((res) => {
        that.setData({
          comment:res.data.comment,
          pinjia: res.data.comment_num,
          user:res.data.user,
          good: res.data.store_list,
          store_goods_class: res.data.store_goods_class,
          tid: res.data.store_goods_class.length > 0 ? res.data.store_goods_class[0].id : '',
         
        });
        if (res.data.store_goods_class.length > 0) {
          that.getGoodClassDetail(res.data.store_goods_class[0].id);
        }
        WxParse.wxParse('article', 'html', res.data.store_list.content, that, 25);
        if (callback) {
          callback();
        }
      });
      // wx.getLocation({
      //   type: 'wgs84',
      //   success(res) {
      //     const latitude = res.latitude ? res.latitude : ''
      //     const longitude = res.longitude ? res.longitude : ''
      //     // const speed = res.speed
      //     // const accuracy = res.accuracy

      //   }
      // })

    },
    // store_goods_calss store_goods_class_id
    getGoodClassDetail: function(id) {

      var that = this;
      this.setData({
        goodList: [],
      });
      // goods_list goods_id
      var params = {
        active: "store_goods_calss",
        store_goods_class_id: id,
        // openid: wx.getStorageSync("token"),
      }
      app.getRequest(params).then((res) => {
        that.setData({
          goodList: res.data,
          tid: id,
        });


      });
    }
  },
  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  onLoad: function(options) {
    // var that = this;
    // that.setData({
    //   id: options.id,
    //   // id: 2,
    // });
    // that.getDetail();
    
    
  },

})


