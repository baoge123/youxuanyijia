// pages/cart/cart.js
var app = getApp()
Page({
  data: {
    url: wx.getStorageSync("url"),
    model: [],
    isAllList: 0,
    editFlag: 0,
    total: 0,
    loading: true,
    
    selectItem: [],
    selectObj: '',
    checkAll: false,

    delBtnWidth: 160,
    data: [],
    isScroll: true,
    windowHeight: 0,
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    // _getList(that);
  },

  drawStart: function(e) {
    // console.log("drawStart");  

    var touch = e.touches[0];
    var widx = e.currentTarget.dataset.widx;
    var model = this.data.model;
    for (var index in model[widx].data) {
      var item = model[widx].data[index]
      item.right = 0
    }
    this.setData({
      model: model,
      startX: touch.clientX,
    })

  },
  drawMove: function(e) {
    var touch = e.touches[0]
    var widx = e.currentTarget.dataset.widx;
    var model = this.data.model;
    var item = model[widx].data[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX
    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      model[widx].data[e.currentTarget.dataset.index].right = disX;

      this.setData({
        isScroll: false,
        model: model
      })
    } else {
      model[widx].data[e.currentTarget.dataset.index].right = 0
      this.setData({
        isScroll: true,
        model: model
      })
    }
  },
  drawEnd: function(e) {

    var widx = e.currentTarget.dataset.widx;
    var model = this.data.model;
    var item = model[widx].data[e.currentTarget.dataset.index];
    if (item.right >= this.data.delBtnWidth / 2) {
      model[widx].data[e.currentTarget.dataset.index].right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        data: model,
      })
    } else {
      model[widx].data[e.currentTarget.dataset.index].right = 0
      this.setData({
        isScroll: true,
        data: model,
      })
    }
  },

  onReady: function() {
    // 页面渲染完成
    this.mapCtx = wx.createMapContext('myMap')
  },
  onShow: function() {
    // 页面显示
    // this.onPullDownRefresh();
    this.setData({
      checkAll: false,
      selectItem:[],
      total:0,
      model: [],
    });
    _getList(this);
    wx.removeStorageSync("order_param");
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  //产品点击事件
  gotoProduct: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../category/detail2?id=" + id
    });
  },
  //全选
  checkAll: function(e) {
    var that = this;
    //全选，并且获取累加金额    
    if (e.detail.value[0] != undefined) {
      for (var i = 0; i < that.data.model.length; i++) {
        that.data.model[i].selected = true;
        for (let index in that.data.model[i].data) {
          that.data.model[i].data[index].selected=true;
        }; 
      }
    } else {
      for (var i = 0; i < that.data.model.length; i++) {
        that.data.model[i].selected = false;
        for (let index in that.data.model[i].data) {
          that.data.model[i].data[index].selected = false;
        }; 
      }
    }
    that.setData({
      model: that.data.model
    })
    //计算总价
    _resutTotal(that);
  },
  //选中店铺
  changeRadioShop: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      checkAll = true;
    if (e.detail.value[0] != undefined) {
      that.data.model[index].selected = true;
      for (var i = 0; i < that.data.model.length; i++) {
        if (that.data.model[i].selected == false) {
          checkAll = false;
          break;
        }
      }
      var pdata = that.data.model[index].data;
      for (var j = 0; j < pdata.length; j++) {
        pdata[j].selected = true;
      }
      that.data.model[index].data = pdata
    } else {
      that.data.model[index].selected = false;
      checkAll = false;
      var pdata = that.data.model[index].data;
      for (var j = 0; j < pdata.length; j++) {
        pdata[j].selected = false;
      }
      that.data.model[index].data = pdata
    }
    //处理
    that.setData({
      model: that.data.model,
      checkAll: checkAll
    })
    _resutTotal(that);
  },
  //单选
  changeRadio: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      widx = e.currentTarget.dataset.widx,
      checkAll = true,
      model = that.data.model;
    if (e.detail.value[0] != undefined) {
      model[widx].data[index].selected = true;
    } else {
      model[widx].data[index].selected = false;
    }
    for (var i = 0; i < model.length; i++) {
      var shopSelect=true;
      for (var j = 0; j < model[i].data.length; j++) {
        if (model[i].data[j].selected != true) {
          checkAll = false;
          shopSelect=false;
          break;
        }
      }
      model[i].selected = shopSelect;
    }
    that.setData({
      model:model,
      checkAll: checkAll
    })

    _resutTotal(that);
  },

  //增加数量1
  addCount: function(e) {

    var that = this,
      index = e.currentTarget.dataset.index,
      widx = e.currentTarget.dataset.widx,
      count = that.data.model[widx].data[index].guige_num;
    if (count + 1 < that.data.model[widx].data[index].space_num){
      that.data.model[widx].data[index].guige_num = count + 1;
      that.setData({
        model: that.data.model,
      })
    _changeCount(that, count + 1, that.data.model[widx].data[index].id);
    }
  },

  //减少数量
  jianCount: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      widx = e.currentTarget.dataset.widx,
      count = that.data.model[widx].data[index].guige_num;
    if (count - 1 >= 1) {
      that.data.model[widx].data[index].guige_num = count - 1;
      that.setData({
        model: that.data.model,
      })
      _changeCount(that, count - 1, that.data.model[widx].data[index].id);
    }
    if(count===1){
      var that = this,
        index = e.currentTarget.dataset.index,
        widx = e.currentTarget.dataset.widx,
        model = that.data.model;
      wx.showModal({
        title: '购物车',
        content: '确认要删除宝贝吗？',
        success: function (res) {
          if (res.confirm) {
            var params = {
              active: 'car_del',
              openid: wx.getStorageSync("token"),
              car_id: model[widx].data[index].id,
            }
            app.getRequest(params).then((res) => {
              that.setData({
                model: [],
                isAllList: 0,
              });
              _getList(that);
              wx.showToast({
                title: '删除成功',
              })
            });
          }
        }
      })
    }
  },

  //从购物车中删除
  deleteCart: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      widx = e.currentTarget.dataset.widx,
      model = that.data.model;
    wx.showModal({
      title: '购物车',
      content: '确认要删除宝贝吗？',
      success: function(res) {
        if (res.confirm) {
          var params = {
            active:'car_del',
            openid:wx.getStorageSync("token"),
            car_id: model[widx].data[index].id,
          }
          app.getRequest(params).then((res) => {
            that.setData({
              model: [],
              isAllList: 0,
            });
            _getList(that);
            wx.showToast({
              title: '删除成功',
            })
          });
        }
      }
    })
  },
  //结算
  checkOut: function(e) {
    var that = this,
      selectItem = that.data.selectItem, buyInfos=[];
    if (selectItem.length == 0) {
      wx.showToast({
        title: '请选择要结算商品',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    selectItem.forEach(v => {
      var item = {
        store_id: v.store_id,//
        goods_id: v.goods_id,//
        goods_space_id: v.goods_space_id,
        guige_num: v.guige_num,//
        fan_u: v.fan_u,
        space_img: v.goods_img,// /
        space_name: v.guige_name,//
        goods_name: v.goods_name,//
        store_name: v.store_name,//
        goods_u: v.goods_u,
        space_price: v.guige_price,//
        u_num: v.u_num,
        order_pay_status: 0,
        goods_u_status: v.goods_u_status,
        cart_id:v.id,
      }
      buyInfos.push(item);
    });

    wx.setStorageSync("buyInfos", JSON.stringify(buyInfos));
    wx.navigateTo({
      url: '../order/createOrder',
    });


  },
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      model: [],
      isAllList: 0,
      checkAll:false
    });
    _getList(that);
    wx.stopPullDownRefresh()
  },
})
//计算总价
var _resutTotal = function(that) {
  var Total = 0;
  var params = [],
    model = that.data.model;
  for (var i = 0; i < model.length; i++) {
    // if (model[i].selected) {
      model[i].data.forEach(v => {
        if (v.selected){
          params.push(v);
          Total += (v.guige_price * v.guige_num);
        }
      });
    // }
  }
  that.setData({
    model: that.data.model,
    total: Total.toFixed(2),
    selectItem: params,
  })
}

//获取购物车列表
var _getList = function(that) {
  // 
  var params = {
    openid: wx.getStorageSync("token"),
    active: "car"
  }
  app.getRequest(params).then((res) => {
    if (res.data.length == 0) {
      that.setData({
        isAllList: 1
      });
    }else{
    that.setData({
      model: res.data,
      isAllList: 2
    });
    }
  });
}

//修改数量
var _changeCount = function(that, num, id) {
  var params = {
    car_id: id,
    guige_num: num,
    active:"car_num_add"
  }
  app.getRequest(params).then((res) => {
    _resutTotal(that);
  });

}

var delect= function(e){
 
  index = e.currentTarget.dataset.index,
    widx = e.currentTarget.dataset.widx,
    model = that.data.model;
  wx.showModal({
    title: '购物车',
    content: '确认要删除宝贝吗？',
    success: function (res) {
      if (res.confirm) {
        var params = {
          active: 'car_del',
          openid: wx.getStorageSync("token"),
          car_id: model[widx].data[index].id,
        }
        app.getRequest(params).then((res) => {
          this.setData({
            model: [],
            isAllList: 0,
          });
          _getList(that);
          wx.showToast({
            title: '删除成功',
          })
        });
      }
    }
  })
}