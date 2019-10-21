// pages/order/comment.js


var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:wx.getStorageSync("userData"),
    uploads: [],
    fids: [],
    images: [],
    xqstar: 5,
    wdstar: 5,
    wgstar: 5,
    gsstar: 5,
    content: "",
    url: wx.getStorageSync("url"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      //根据外边距，内边距，没排显示的照片张数计算每张图宽高
      imgWidth: getImgWidth(30, 0, 3),
      oid: options.oid ? options.oid : '',
      pimg: options.pimg ? options.pimg : '',
      store_id: options.store_id ? options.store_id:'',
    });
    loadLabel(this);
  },
  //查看标签
  gotoLabel() {
    wx.navigateTo({
      url: 'label?id=' + this.data.pid,
    })
  },
  selectXqStar: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      xqstar: num + 1,
    });
  },
  selectWdStar: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      wdstar: num + 1,
    });
  },
  selectWgStar: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      wgstar: num + 1,
    });
  },
  selectGsStar: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      gsstar: num + 1,
    });
  },
  gotoSelectStar: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      star: index + 1
    });
  },
  //提交信息
  sendInfo: function (e) {
    var that = this;
    var img_arr = that.data.uploads.join(',');
    if (that.data.content != null && that.data.content!=""){
      var params = {
        order_id: that.data.oid,
        fuwu_xing: that.data.xqstar,
        goods_xing: that.data.wdstar,
        huangjing_xing: that.data.wgstar,
        content: that.data.content,
        img_arr: img_arr,
        user_name: that.data.user.user_name,
        user_img: that.data.user.user_img,
        active: "pinlun",
      }
      app.getRequest(params).then((res) => {
        wx.showToast({
          title: '评论成功',
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      });
    }else{
      wx.showToast({
        title: '评价不能为空',
      })
    }
    
  },
  textInput: function (e) {
    this.setData({
      content: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //图片上传
  upload: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        if (that.data.uploads.length + tempFilePaths.length > 5) {
          wx.showModal({
            title: '提示',
            content: '最多上传5张图片',
            showCancel: false
          })
          return;
        }
        var uploads = that.data.uploads;
        for (var i = 0; i < tempFilePaths.length; i++) {
          
          wx.uploadFile({
            url: wx.getStorageSync('url')+"?active=img",
            // filePath: tempFilePaths[i], http://yjxcx.sccxbe.com/upload/5cdd1256487ab.jpg
            filePath: tempFilePaths[i],
            name: 'files',
            formData: {
              "active":'img',
              "files": tempFilePaths[i],
            },
            formData: {},
            success: function (res) {
              // if (res.statusCode == 200) {
              var data = JSON.parse(res.data);
              uploads.push(data.data);
              that.setData({
                uploads: uploads,
              });
              // }
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        }
        wx.hideToast();
      }
    })
  },
  //长按删除图片
  deleteImg: function (e) {
    var that = this;
    var leng = parseInt(e.currentTarget.dataset.len);
    wx.showModal({
      title: '确认删除本张图片吗？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          switch (leng) {
            case 1:
              var imgs = that.data.uploads,
                images = that.data.images;
              for (var i = 0; i < imgs.length; i++) {
                if (imgs[i] == e.currentTarget.dataset.img) {
                  imgs.splice(i, 1);
                  images.splice(i, 1);
                  break;
                }
              }
              that.setData({
                uploads: imgs
              });
              break;

          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查看图片
  preview: function (e) {
    var current = e.currentTarget.dataset.img;
    var leng = parseInt(e.currentTarget.dataset.len);
    switch (leng) {
      case 1:
        var urls = this.data.uploads;
        wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: urls // 需要预览的图片http链接列表
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // tagsname
    var tagsname = wx.getStorageSync("tagsname");
    this.setData({
      tagsname: tagsname,
    });
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

  }
})

var getImgWidth = function (padding, margin, length) {
  var result = null;
  wx.getSystemInfo({
    success: function (res) {
      result = (res.windowWidth - padding - margin) / length;
    }
  });
  return result;
}
// lxzxcx/load_comment_label_alias
var loadLabel = function (that) {
  var params = {
    active: "store_class",
    store_id: that.data.store_id,
  }
  app.getRequest(params).then((res) => {
    that.setData({
      aroma: res.data[0].pinlun1,
      taste: res.data[0].pinlun2,
      exterior: res.data[0].pinlun3,
    });
  });
}