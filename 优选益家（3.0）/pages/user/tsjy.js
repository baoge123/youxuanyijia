// pages/user/tsjy.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:wx.getStorageSync("url"),
    uploads: [],
    images: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: util.getImgWidth(30, 20, 3),
    });
  },
  titleInput(e){
    this.setData({
      title:e.detail.value,
    })
  }, 
  nameInput(e) {
    this.setData({
      name: e.detail.value,
    })
  }, 
  phoneInput(e) {
    this.setData({
      phone: e.detail.value,
    })
  }, 
  //提交信息
  sendInfo: function (e) {
    var that = this,title=this.data.title;
    if (!this.data.title) {
      wx.showToast({
        title: '请输入投诉或建议的标题',
        icon: "none"
      })
      return;
    }
    if (!this.data.content) {
      wx.showToast({
        title: '请输入您宝贵的意见',
        icon: "none"
      })
      return;
    }
    if (!this.data.name) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: "none"
      })
      return;
    }
    if(!this.data.phone){
      wx.showToast({
        title: '请输入有效手机号或邮箱',
        icon: "none"
      })
      return;
    }
    // testPhone
    var img_arr = that.data.uploads.join(',');
    var params = {
      active:"complaint",
      title: title,
      phone: that.data.phone,
      true_name:that.data.name,
      // access_token: wx.getStorageSync("access_token"),
      content: that.data.content,
      img_arr: img_arr,
    }
    app.getRequest( params).then((res) => {
      debugger
      wx.showToast({
        title: '提交成功',
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000);
    });
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
            url: wx.getStorageSync('url') + "?active=img",
            // filePath: tempFilePaths[i], http://yjxcx.sccxbe.com/upload/5cdd1256487ab.jpg
            filePath: tempFilePaths[i],
            name: 'files',
            formData: {
              "active": 'img',
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
  // onShareAppMessage: function () {

  // }
})
