// pages/user/orders/logistics.js
var app=getApp();
Page({
  data: {
    model:[],
    list:[{
      context:"成都返货",
      time:"2019-02-11"
    },{
        context: "重启返货",
        time: "2019-02-01"
      }, {
        context: "重启返货",
        time: "2019-02-01"
      }, {
        context: "重启返货",
        time: "2019-02-01"
      }],
    name:''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var params = {
      active:"wuliu",
      order_id: options.oid,
    }
    app.getRequest( params).then((res) => {
      if (res.code == 0) {
        var list = res.data;
      that.setData({
        list: list,
      });
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})