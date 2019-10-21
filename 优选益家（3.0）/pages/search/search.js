// pages/search/search.js
var app = getApp();
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
    isclose: true,
    searchvalue: "",
    searchsubmit: true,
    searchreset: false,
    page:1,
    list:[],
    value:"",
    hotsearch: [{ message: "短裤" }, { message: "背带裙" }, { message: "牛仔裤男" }, { message: "运动 休闲男鞋" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    falg: true,
    hotsearch1: [{ message: "短裤" }, { message: "背带裙" }, { message: "牛仔裤男" }, { message: "运动 休闲男鞋" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    hotsearch2: [{ message: "平板电脑" }, { message: "耳机" }, { message: "男鞋" }, { message: "iPhone" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    historydata: [],
    historydatashow: false,
    searchresult: false,
    inputsearch: "",//输入框内的值,
    searchResult: []//虚拟的查询结果
  },

  /*输入框输入后触发，用于联想搜索和切换取消确认*/
  inputoperation: function (e) {
    this.setData({
      value: e.detail.value,
      searchsubmit: false,
      searchreset: true,
      isclose: false,
      searchvalue: e.detail.value
      // searchvalue: this.data.searchvalue.concat(e.detail.value)
    })
  },
  //点击X
  resetinput: function () {
    this.setData({
      searchsubmit: true,
      searchreset: false,
      isclose: true,
      inputsearch: "",
      searchresult: false


    })
  },
  /*取消搜索 */
  cancelsearch: function () {
    wx.navigateBack({
      url: '../index/index'
    })
  },
  /*清除*/
  del(){
    var that=this;
    wx.removeStorage({
      key: 'historydata',
      success: function (res) {
        that.setData({
          historydata: []
        })
      }
      })
  },
  /*换一批操作 */
  changeother: function () {
    this.setData({
      falg: !this.data.falg
    })
  },
  /*点击搜索按钮触发*/
  searchbegin: function () {
    let that = this
    getSearch(this)
    // wx.getStorage({
    //   key: 'historydata',
    //   success: function (res) {
    //     that.setData({
    //       historydata: res.data
    //     })
    //   }
    // })
    wx.setStorage({
      key: "historydata",
      data: that.data.historydata.concat(that.data.searchvalue)
    })
    console.log(that.data.historydata)
    //请求数据调页面
    // wx.navigateTo({
    //   url: '../detail/detail'
    // })
    this.setData({
      searchresult: true,
    })
  },
  // 历史搜素
  history(e){
    console.log(111111111)
    console.log(e)
    let that = this
   
    wx.setStorage({
      key: "historydata",
      data: that.data.historydata.concat(that.data.searchvalue)
    })
    console.log(that.data.historydata)
   
    this.setData({
      searchresult: true,
      value: e.target.dataset.name,
      inputsearch: e.target.dataset.name
    })
    // that.setData({
    //   value: e.detail.value,
    // })
    getSearch(this)

  },
  //点击进入详情页
  gotodetail (e) {
    var id = e.currentTarget.dataset.id;
      wx.setStorageSync('goods_id1', id)
    wx.navigateTo({
      url: '../good/detail?id='+id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 历史搜索
    let that = this
    wx.getStorage({
      key: 'historydata',
      success: function (res) {
        console.log(res.data)
        that.setData({
          historydatashow: true,
          historydata: res.data
        })
      }
    })
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

  }
})

var getSearch = function (that, callback) {
  // var that = this;
  var params = {
    active: "select",
    goods_name: that.data.value,
    page: that.data.page,
  }
  app.getRequest(params).then((res) => {
    var searchResult = that.data.searchResult;
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
        searchResult = searchResult.concat(res.data[i]);
      }
      that.setData({
        searchResult: searchResult,
        isAllList: 2
      });
    }
    if (callback) {
      callback();
    }
  });
}

