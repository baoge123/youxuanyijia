// pages/category/category.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
    type: 1,
    sn: 1,
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    var offLineItem = wx.getStorageSync("offLineItem");
    if (offLineItem) {
      that.setData({
        type: 2,
      });
      getCagetoryOneShop(this, function () {
        getTwoCateShop(that);
      });
      // wx.removeStorageSync("offLineItem");
    } else {
      that.setData({
        type: 1,
      });
      getCagetoryOne(this, function () {
        getTwoCate(that);
      });
    }
  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value,
    });
    if (this.data.type == 1) {
      wx.showToast({
        title: '本地生活才可根据地区筛选商户哟',
        icon: "none"
      })
    } else {
      getTwoCateShop(this);
    }
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
  // 查看商户主页
  gotoShopCenter(e) {
    var sid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shop/shop?id=' + sid,
    })
  },
  //查看分类下商品，传id名称
  gotoGoodsList(e) {
    var id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../category/all1?id=' + id + "&name=" + name,
    })
  },
  //切换一级分类，更改广告位图片
  changeCategory(e) {
    var that = this;
    if (that.data.type == 1) {
      var id = e.currentTarget.dataset.id,
        img = e.currentTarget.dataset.img,
        name = e.currentTarget.dataset.name,
        uid = e.currentTarget.dataset.uid;
      this.setData({
        sn: id,
        categoryImg: img,
        categoryName: name,
        uid: uid,
      });
      getTwoCate(this);
    } else {
      var id = e.currentTarget.dataset.id,
        name = e.currentTarget.dataset.name,
        uid = e.currentTarget.dataset.uid;
      this.setData({
        sn: id,
        categoryName: name,
        uid: uid,
      });
      getTwoCateShop(that);
    }
  },
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
      getCagetoryOne(this, function () {
        getTwoCate(that);
      });
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
    var that = this,
      type = this.data.type;
    if (type == 1) {
      getCagetoryOne(that, function () {
        getTwoCate(that);
      });
      wx.stopPullDownRefresh()
    } else {
      getCagetoryOneShop(this, function () {
        getTwoCateShop(that);
      });
      wx.stopPullDownRefresh()
    }
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
//获取一级分类
var getCagetoryOne = function (that, callback) {

  var params = {
    active: "goods_class"
  }
  app.getRequest(params).then((res) => {
    var categoryItem = wx.getStorageSync("categoryItem");
    if (categoryItem) {
      that.setData({
        goodsClass: res.data,
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

//获取二级分类
var getTwoCate = function (that, callback) {

  var params = {
    active: "goods_class_list",
    uid: that.data.sn,
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

// //获取商铺产品
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