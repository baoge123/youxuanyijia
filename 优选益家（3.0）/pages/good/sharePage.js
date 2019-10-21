// pages/good/sharePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 'sharePage?erCodeImg=' + that.data.erCodeImg + "&price_now=" + that.data.good.goods_price_now + "&price=" + that.data.good.goods_price + "&goods_name=" + that.data.good.goods_name + "&goods_img=" + that.data.good.goods_img,
   
    this.setData({
      // erCodeImg: options.erCodeImg,
      price_now: options.price_now,
      price: options.price,
      goods_name: options.goods_name,
      // goods_img: options.goods_img,
    });
    console.log("二维码图:" + options.erCodeImg);
    var erCodeImg = wx.getStorageSync("url") + "/"+ options.erCodeImg;
    console.log("现价:" + options.price_now);
    console.log("原价:" + options.price);
    console.log("商品名:" + options.goods_name);
    console.log("商品图:" + options.goods_img);
    var goods_img = wx.getStorageSync("url")+"/"+ options.goods_img;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    wx.downloadFile({
      url:erCodeImg,//网络路径
      success: function (res2) {
        //背景图
        that.setData({
          erCodeImg: res2.tempFilePath
        })
        console.log(res2.tempFilePath)
        console.log('二维码图片缓存本地成功')
        wx.downloadFile({
          url: goods_img,//网络路径  goods_img: options.goods_img,
          success: function (res3) {
            //背景图
            that.setData({
              goods_img: res3.tempFilePath
            })
            
            console.log(res3.tempFilePath)
            // console.log('商品图片缓存本地成功')
            that.createGoodShareImg();
          }
        })

      }
    })
    // this.createGoodShareImg();
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
      fail() {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  },
  createGoodShareImg() {
    // 'sharePage?erCodeImg=' + that.data.erCodeImg + "&price_now=" + that.data.good.goods_price_now + "&price=" + that.data.good.goods_price + "&goods_name=" + that.data.good.goods_name + "&goods_img=" + that.data.good.goods_img,
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    
    var windowWidth = this.data.windowWidth;
    var windowHeight = this.data.windowHeight;
    var nowprice = '￥' + that.data.price_now;
    var pric = '￥' + that.data.price;

    const ctx = wx.createCanvasContext('myCanvas')

    ctx.drawImage(that.data.goods_img, (windowWidth - (windowWidth - 50)) / 2, 20, windowWidth - 50, windowWidth - 50)
    ctx.setFillStyle('white')
    ctx.rect((windowWidth - (windowWidth - 50)) / 2, windowWidth - 50, windowWidth - 50, 100)
    ctx.fill()


    ctx.setFillStyle('black')
    ctx.setFontSize(16)
    this.dealWords({
      ctx: ctx,
      fontSize: 16, //字体大小
      word: that.data.goods_name,
      maxWidth: 150, //
      x: (windowWidth - (windowWidth - 50)) / 2 + 20, //文字在x轴要显示的位置
      y: windowWidth - 40, //文字在y轴要显示的位置
      maxLine: 2 //文字最多显示的行数
    })

    var erCode =that.data.erCodeImg;
    ctx.drawImage(erCode, windowWidth - (windowWidth - (windowWidth - 50)) / 2 - 90, windowWidth - 40, 80, 80)

    ctx.setFillStyle('red')
    ctx.setFontSize(18)
    var nowprice = '￥' + that.data.price_now;
    ctx.fillText(nowprice, (windowWidth - (windowWidth - 50)) / 2 + 20, windowWidth + 30)

    ctx.setFillStyle('#999')
    ctx.setFontSize(12)
    var pric = '￥' + that.data.price;
    ctx.fillText(pric, (windowWidth - (windowWidth - 50)) / 2 + 90, windowWidth + 30)

    ctx.draw();
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
          wx.hideLoading()
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
      path: '/pages/user/getUserInfo?user_id=' + wx.getStorageSync("user_id"),
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