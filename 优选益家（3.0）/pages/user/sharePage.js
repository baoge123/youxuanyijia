// pages/user/sharePage.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
    user: wx.getStorageSync("userData"),
    windowWidth:"",
    windowHeight:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // sharePage?nickName=' + nickName + "&avatarUrl=" + avatarUrl,mg,
    this.setData({
      nickName: options.nickName,
      avatarUrl: options.avatarUrl,
    });
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    getErCode(that,function(){
      that.createGoodShareImg();
    })
  },
  gotoSaveImg(){
    var that=this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImg,
      success() {
        wx.showToast({
          title: '保存成功'
        })
      },
      fail(err) {
        console.log(err)
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  },
  createGoodShareImg() {
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
    var nickName = that.data.nickName;
    var avatarUrl = that.data.avatarUrl;

    var that = this;
    var windowWidth = that.data.windowWidth;
    var windowHeight = that.data.windowHeight;

    const ctx = wx.createCanvasContext('myCanvas')
    //背景图
    ctx.drawImage("../../image/sh/bb.jpg", (windowWidth - (windowWidth - 80)) / 2, 20, windowWidth - 80, windowWidth + 50)
    ctx.fill()
    //头像
    ctx.drawImage(avatarUrl, windowWidth-(windowWidth + 200 + 5) / 2, 370, 40, 40)
    //名称
    var name = nickName;
    var font_w = ctx.measureText(name)
    font_w = font_w.width
    ctx.setFontSize(14)
    ctx.textAlign = "center"; 
    // ctx.fillText(name, 507, 760)
    ctx.fillText(name, (windowWidth - 160 - (font_w / 4)) / 2, 430)
    //二维码
    ctx.drawImage(that.data.erCodeImg, (windowWidth - 50 - 10) / 2, (windowWidth + 50 + 270) / 2, 60, 60)
    ctx.draw()
    setTimeout(() => {
      // 将生成的canvas图片，转为真实图片
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'myCanvas',
        success: function (res) {
          let shareImg = res.tempFilePath;
          that.setData({
            shareImg: shareImg,
          })
          wx.hideLoading();
        },
        fail: function (res) { }
      })
    }, 500)
  },
  closeModel(){
    wx.navigateBack({
      
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
    return {
      path: '/pages/index/index?user_id=' + wx.getStorageSync("user_id"),
    }
  },
  //处理文字多出省略号显示
  dealWords: function (options) {
    options.ctx.setFontSize(options.fontSize);//设置字体大小
    var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth);//实际总共能分多少行
    var count = allRow >= options.maxLine ? options.maxLine : allRow;//实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
    var endPos = 0;//当前字符串的截断点
    for (var j = 0; j < count; j++) {
      var nowStr = options.word.slice(endPos);//当前剩余的字符串
      var rowWid = 0;//每一行当前宽度  
      if (options.ctx.measureText(nowStr).width > options.maxWidth) {//如果当前的字符串宽度大于最大宽度，然后开始截取
        for (var m = 0; m < nowStr.length; m++) {
          rowWid += options.ctx.measureText(nowStr[m]).width;//当前字符串总宽度
          if (rowWid > options.maxWidth) {
            if (j === options.maxLine - 1) { //如果是最后一行
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 18);  //(j+1)*18这是每一行的高度    
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 18);
            }
            endPos += m;//下次截断点
            break;
          }
        }
      } else {//如果当前的字符串宽度小于最大宽度就直接输出
        options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 18);
      }
    }
  },
})

//获取二维码
var getErCode = function (that, callback) {
  var params = {
    active: "erweima",
    goods_id: '',
    user_id: wx.getStorageSync("user_id"),
  }
  app.getRequest(params).then((res) => {
    var avatarUrl = that.data.avatarUrl;
    // debugger
    // that.setData({
    //   erCodeImg: res.data
    // });
    wx.downloadFile({
      url: avatarUrl,//网络路径
      success: function (res2) {
        //背景图
        that.setData({
          avatarUrl: res2.tempFilePath
        })
        
        wx.downloadFile({
          url: wx.getStorageSync("url") + "/" + res.data,//网络路径  goods_img: options.goods_img,
          success: function (res3) {
            //背景图
            console.log('二维码图片缓存本地成功')
            that.setData({
              erCodeImg: res3.tempFilePath
            })
            if (callback) {
              callback();
            }
          }
        })

      }
    })

  });
}