// pages/category/category.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 前台显示list
    showlist: [],
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,

    url: wx.getStorageSync("url"),
    type: 1,
    status:"0",
    store:[],
    model: [{
      tid: 1,
      name: "家用电器"
    },
    {
      tid: 2,
      name: "手机数码"
    },
    {
      tid: 3,
      name: "电脑办公"
    }
    ],
    key: "",
    region: ["四川省", "成都市", "成华区"],
    // 筛选
    tabTxt: ['商户', '评分', '销量'],//分类
    tab: [true, true, true],
    pinpaiList: [{ 'id': '1', 'title': '品牌1' }, { 'id': '1', 'title': '品牌1' }],
    pinpaiList1:[],
    pinpai_id: 0,//品牌
    pinpai_txt: '',
    jiage_id: 0,//价格
    jiage_txt: '',
    xiaoliang_id: 0,//销量
    xiaoliang_txt: '',
    sn:"",

    latitude: "30.64242",
    longitude: "104.04311",
    page:1,
    isAllList: 0,
    dataList:[],
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    getTwoCateShop1(this);
    getCagetoryOneShop(this)
  },

  gotoSerchShop() {
    this.setData({
      list: [],
      isAllList: 0,
      page: 1,
    })
    getData(this);
  },
  // 选项卡
  filterTab: function (e) {
    var data = [true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },

  //筛选项点击操作
  // filter: function (e) {
  //   var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
  //   switch (e.currentTarget.dataset.index) {
  //     case '0':
  //       tabTxt[0] = txt;
  //       self.setData({
  //         tab: [true, true, true],
  //         tabTxt: tabTxt,
  //         pinpai_id: id,
  //         pinpai_txt: txt
  //       });
  //       break;
  //     case '1':
  //       tabTxt[1] = txt;
  //       self.setData({
  //         tab: [true, true, true],
  //         tabTxt: tabTxt,
  //         jiage_id: id,
  //         jiage_txt: txt
  //       });
  //       break;
  //     case '2':
  //       tabTxt[2] = txt;
  //       self.setData({
  //         tab: [true, true, true],
  //         tabTxt: tabTxt,
  //         xiaoliang_id: id,
  //         xiaoliang_txt: txt
  //       });
  //       break;
  //   }
  //   //数据筛选
  //   self.getDataList();
  // },
  filter(e){
    var self = this, status = e.currentTarget.dataset.status, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    wx.setStorageSync('saihuan_id', id)
    wx.setStorageSync('store_id', id)
    wx.setStorageSync('saihuan1_id', status)
    this.setData({
      dataList:[],
      page:1,
    })
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          pinpai_id: id,
          pinpai_txt: txt
        });
        break;
      // case '1':
      //   tabTxt[1] = txt;
      //   self.setData({
      //     tab: [true, true, true],
      //     tabTxt: tabTxt,
      //     jiage_id: id,
      //     jiage_txt: txt
      //   });
      //   break;
      // case '2':
      //   tabTxt[2] = txt;
      //   self.setData({
      //     tab: [true, true, true],
      //     tabTxt: tabTxt,
      //     xiaoliang_id: id,
      //     xiaoliang_txt: txt
      //   });
      //   break;
    }
    // self.getDataList();
    getTwoCateShop1(this)
  },
  //加载数据
  getDataList: function () {
    //调用数据接口，获取数据


  },




  keyInput(e) {
    this.setData({
      key: e.detail.value,
    });
  },
  // gotoSearch() {
  //   if (this.data.type == 1) {
  //     wx.navigateTo({
  //       url: 'search?key=' + this.data.key,
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: 'searchCate?key=' + this.data.key,
  //     })
  //   }
  // },
  gotoSearch() {
    wx.navigateTo({
        url: '../../pages/category/searchCate?key=' + this.data.key,
      })
  },
  //查看商户主页
  gotoShopCenter(e) {
    var sid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shop/shop?id=' + sid,
    })
  },

   gotoShopIndex(e) {

    var sid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shop/shop?id=' + sid,
    })
  },

  //pinfen
  filter1(e) {
    var self = this, status = e.currentTarget.dataset.status, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    wx.setStorageSync('saihuan1_id', status)
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          pinpai_id: id,
          pinpai_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          jiage_id: id,
          jiage_txt: txt
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          xiaoliang_id: id,
          xiaoliang_txt: txt
        });
        break;
    }
    getpinfen (this)
    
  },
  
  filter2(e) {
    var self = this, status = e.currentTarget.dataset.status, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    wx.setStorageSync('saihuan1_id', status)
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          pinpai_id: id,
          pinpai_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          jiage_id: id,
          jiage_txt: txt
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          xiaoliang_id: id,
          xiaoliang_txt: txt
        });
        break;
    }
    getpinfen(this)

  },
  //选择类型
 
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
      getTwoCateShop1(this)
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
        that.setData({
          addressName: res.name,
          latitude: res.latitude,
          longitude: res.longitude,
        });
      }
    })
  },
})




//获取商铺分类


//获取商铺产品


var getCagetoryOneShop = function (that, callback) {
  // store_class_list  store_class_id
  var params = {
    active: "store_class",
    
  }
  app.getRequest(params).then((res) => {
    that.setData({
      pinpaiList: res.data
    });
    if (callback) {
      callback();
    }
  });
}

var getTwoCateShop1 = function (that, callback) {
  // store_class_list  store_class_id
  var params = {
    active: "store_class_dest",
    store_class_id: wx.getStorageSync("store_id"),
    lat: wx.getStorageSync("latitude"),
    lng: wx.getStorageSync("longitude"),
    page:that.data.page,
  }
  app.getRequest(params).then((res) => {
    var dataList = that.data.dataList;
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
        dataList = dataList.concat(res.data[i]);
      }
      that.setData({
        dataList: dataList,
        isAllList: 2
      });
    }
    // WxParse.wxParse('article', 'html', res.data.content, that, 25);

  });
}
// 评分
var getpinfen = function (that, callback) {
  // store_class_list  store_class_id
  var params = {
    active: "store_sort",
    store_class_id: wx.getStorageSync("saihuan_id"),
    status: wx.getStorageSync('saihuan1_id'),
    where: that.data.region[1] + that.data.region[2],
    lat: wx.getStorageSync("latitude"),
    lng: wx.getStorageSync("longitude"),

  }
  app.getRequest(params).then((res) => {
    
    that.setData({
      dataList: res.data,
   
    });
    console.log(tha.num)
    if (callback) {
      callback();
    }
  });
}
