// pages/category/all.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
    type:0,
    list: [],
    list1:[],
    isAllList: 0,
    page: 1,
    g_page:1,
    
    isAllList1: 0,
    goodsClass:[],
    orderInfo:"",
    id:"",
    yei:1,
    status:"",
    statu: wx.getStorageSync("status")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // getTwoCate1(that)
    // getTwoCate(that)
    
    

    getclassList(this)

    var id=options.id,name=options.name;
    if(name){
      wx.setNavigationBarTitle({
        title: name,
      })
      
    }
    this.setData({
      id:id,
    });
    
  },
  searchgoods: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  // 商品二级分类
  gotoGoodsList(e) {
   var id = e.currentTarget.dataset.id,
     name = e.currentTarget.dataset.name;
    wx.setStorageSync('class_id', id)
    this.setData({
     list : [],
     yei:1,
      isAllList: 0,
    })
    getGoods(this)
    // wx.navigateTo({
    //   url: '../category/all?id=' + id + "&name=" + name,
    // })
  },
  gotoDetail(e){
    var id=e.currentTarget.dataset.id;
    // wx.setStorageSync("goods_id1", id);
    wx.navigateTo({
      url: '../good/detail?id='+id,
    })
  },
  gotoPxNum(e){
    var px=e.currentTarget.dataset.idx,that=this;
    this.setData({
      pxNum:this.data.pxNum?'':px, 
      list: [],
      isAllList: 0,
      page:1,
    });
    // getData(this);
    setTimeout(function(){
      that.setData({
        isZh:2,
        // pxNum:''
      })
    },1000)
  },
  selectType(e){
    var id = e.currentTarget.dataset.id,that=this;
    this.setData({
      type:id,
    })
    if(id==3){
      var t = !this.data.isPrice ? 1 : (this.data.isPrice == 1 ? 2 : 1);
      this.setData({
        isPrice: t
      });
    }
    if (id == 0) {
      var zh = !this.data.isZh ? 1 : (this.data.isZh == 1 ? 2 : 1)
      this.setData({
        isZh: zh,
        // pxNum:''
      });
    }else{
      this.setData({
        isZh:0,
      })
    }
    this.setData({
      list: [],
      isAllList: 0,
      page: 1,
    })

    getclassList(this)
    getData(this);
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
    var that = this;
        if(that.data.status==0){
          
          this.setData({
            page: that.data.page + 1,
          });
          if (that.data.isAllList == 1) {
            wx.showToast({
              title: '已加载全部数据..',
              icon: "none"
            })
          } else
            getclassList(this)


        }else {
          if (that.data.status == 1) {

            this.setData({
             
              yei: that.data.yei + 1,
            });
            if (that.data.isAllList == 1) {
              wx.showToast({
                title: '已加载全部数据..',
                icon: "none"
              })
            } else
              getGoods(this)
          }
        }
        
          

    
    

      
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

var getData = function (that, callback){
  var status=that.data.type;
   
  status = status == 3 ? (that.data.isPrice == 1 ? 3 : 4) : (that.data.pxNum == 0 ? 1 : status) ;
  var params = {
    active: "goods",
    class_id: wx.getStorageSync("class_id"),
    // class_id: that.data.id,
    page:that.data.page,
    status: status,//0中和排序 1评论数量 2销量 3价格搞到底  4价格底到高
  }
  app.getRequest(params).then((res) => {
    var list = that.data.list;
    console.log(res.data)
    if (res.data.length == 0) {
      wx.showToast({
        title: '已加载全部数据..',
        icon: "none"
      })
      that.setData({
        isAllList: 1,
        list: list
      });
    } else {
      for (var i = 0; i < res.data.length; i++) {
        list = list.concat(res.data[i]);
      }
      that.setData({
        list: list,
        isAllList: 2
      });
    }
    if (callback) {
      callback();
    }

  });
}

var getTwoCate = function (that, callback) {

  var params = {
    active: "goods_class_list",
    uid: wx.getStorageSync("testDate"),
  }
  app.getRequest(params).then((res) => {
    console.log(res)
    that.setData({
      goodsClass: res.data,
      
    });
    getTwoCate1(that)
   
  });

}


var getclassList = function (that, callback) {
  var status = that.data.type;

  status = status == 3 ? (that.data.isPrice == 1 ? 3 : 4) : (that.data.pxNum == 0 ? 1 : status);
  var params = {
    active: "goods_class_list3",
    uid: wx.getStorageSync("testDate"),
    page:that.data.page,
    status:status,
    class_id:""
  }
  app.getRequest(params).then((res) => {
    that.setData({
      goodsClass: res.data.goods_class,
      status:res.data.paging
    });
    wx.setStorageSync("status", res.data.paging)
    var list = that.data.list;
    console.log(res.data)
    if (res.data.goods.length == 0) {
      wx.showToast({
        title: '已加载全部数据..',
        icon: "none"
      })
      that.setData({
        isAllList: 1,
        list:list
      });
    } else {
      for (var i = 0; i < res.data.goods.length; i++) {
        list = list.concat(res.data.goods[i]);
      }
      that.setData({
        list:list,
        isAllList: 2
      });
    }
    if (callback) {
      callback();
    }

  });
}



var getGoods = function (that, callback) {
  var params = {
    active: "goods_class_list3",
    uid: "",
    page:that.data.yei,
    status: 0,
    class_id:wx.getStorageSync('class_id')
  }
  app.getRequest(params).then((res) => {
    that.setData({
      status: res.data.paging
    });
    wx.setStorageSync("status", res.data.paging)
    
    var list = that.data.list;
    
    console.log(res.data)
    if (res.data.goods.length == 0) {
      wx.showToast({
        title: '已加载全部数据..',
        icon: "none"
      })
      that.setData({
        isAllList: 1,
        list: list
      });
    } else {
      for (var i = 0; i < res.data.goods.length; i++) {
        list = list.concat(res.data.goods[i]);
      }
      that.setData({
        list: list,
        isAllList: 2
      });
    }
    if (callback) {
      callback();
    }

  });
}