// pages/shop/settledin.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: wx.getStorageSync("url"),
    region: ["四川省", "成都市", "成华区"],
    uploads: [],
    images: [],
    licenseAry: [],
    shwoModel: 0,
    startTime: "09:00",
    endTime: "20:00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      imgWidth: util.getImgWidth(30, 20, 3),
      staff_id: options.staff_id ? options.staff_id : ''
    })
    getOffLineData(that);
  },
  deleteImg(e) {
    var item = e.currentTarget.dataset.item,
      len = e.currentTarget.dataset.len,
      that = this;
    wx.showModal({
      title: '确认删除本张图片吗？',
      success: function(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          var imgs = len == 1 ? that.data.uploads : that.data.licenseAry;
          for (var i = 0; i < imgs.length; i++) {
            if (imgs[i] == e.currentTarget.dataset.img) {
              imgs.splice(i, 1);
              break;
            }
          }
          if (len == 1) {
            that.setData({
              uploads: imgs
            });
          } else {
            that.setData({
              licenseAry: imgs
            });
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  gotoSureJoin() {
    var store_name = this.data.store_name,
      store_class = this.data.store_class,
      person = this.data.person,
      phone = this.data.phone,
      store_address = this.data.store_address, //
      person_zheng = this.data.person_zheng,
      person_fang = this.data.person_fang,
      license = this.data.license,
      ambient_arr = this.data.uploads,
      content = this.data.content,
      that = this;
    if (!store_name) {
      wx.showToast({
        title: '请输入店铺名称',
        icon: "none"
      })
      return;
    }
    if (!store_class) {
      wx.showToast({
        title: '请选择行业类别',
        icon: "none"
      })
      return;
    }
    if (!person) {
      wx.showToast({
        title: '请输入负责人/法人姓名',
        icon: "none"
      })
      return;
    }
    if (!phone) {
      wx.showToast({
        title: '请输入电话',
        icon: "none"
      })
      return;
    }

    if (!store_address) {
      wx.showToast({
        title: '请输入店铺地址',
        icon: "none"
      })
      return;
    }
    var sever_phone = that.data.servicePhone;
    if (!sever_phone) {
      wx.showToast({
        title: '请输入服务电话',
        icon: "none"
      })
      return;
    }
    var startTime = that.data.startTime;

    var endTime = that.data.endTime;

    if (!person_zheng) {
      wx.showToast({
        title: '请上传身份证正面',
        icon: "none"
      })
      return;
    }
    if (!person_fang) {
      wx.showToast({
        title: '请上传身份证反面',
        icon: "none"
      })
      return;
    }

    // if (!license) {
    //   wx.showToast({
    //     title: '请上传营业执照',
    //     icon: "none"
    //   })
    //   return;
    // }
    var licenseAry = that.data.licenseAry;
    if (licenseAry.length == 0) {
      wx.showToast({
        title: '请至少上传一张营业执照',
        icon: "none"
      })
      return;
    }
    if (ambient_arr.length == 0) {
      wx.showToast({
        title: '请上传门头照片',
        icon: "none"
      })
      return;
    }

    if (!content) {
      wx.showToast({
        title: '请输入经营内容',
        icon: "none"
      })
      return;
    }
    var store_img = that.data.store_img;
    if (!store_img) {
      wx.showToast({
        title: '请至少上传一张店铺logo',
        icon: "none"
      })
      return;
    }
    // store_class person phone store_address person_zheng person_fang license ambient_arr  content
    var params = {
      active: "store_apply",
      store_name: store_name,
      store_class_id: store_class,
      // store_class:
      person: person,
      phone: phone,
      store_address: that.data.region[0] + that.data.region[1] + that.data.region[2] + "," + store_address, //
      person_zheng: person_zheng,
      person_fang: person_fang,
      license: licenseAry.join(","),
      ambient_arr: ambient_arr.join(","),
      content: content,
      openid: wx.getStorageSync("token"),
      staff_id: that.data.staff_id,
      time: startTime + "-" + endTime,
      store_img: store_img,
      sever_phone: sever_phone,
    }
    app.getRequest(params).then((res) => {
      wx.showToast({
        title: '已提交申请，请耐心待定审核',
        icon: "none"
      })
      setTimeout(function() {
        wx.navigateBack({})
      }, 2000)
    });
  },
  timeStartChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  timeEndChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  hylbPickerChange(e) {
    var index = e.detail.value;
    var data = this.data.storeClass;
    this.setData({
      hylbItem: data[index].store_class_name,
      store_class: data[index].id
    });
  },
  //店铺名称
  store_nameIpt(e) {
    this.setData({
      store_name: e.detail.value,
    })
  },
  //法人
  personIpt(e) {
    this.setData({
      person: e.detail.value,
    })
  },
  servicePhoneIpt(e) {
    this.setData({
      servicePhone: e.detail.value,
    })
  },
  //法人电话
  phoneIpt(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  //店铺地址详情
  store_addressDetailIpt(e) {
    this.setData({
      store_address: e.detail.value,
    })
  },
  //经营内容
  contentIpt(e) {
    this.setData({
      content: e.detail.value,
    })
  },
  // //店铺名称
  u_bilieIpt(e) {
    this.setData({
      u_bilie: e.detail.value,
    })
  },
  //身份证 银业执照 图片上传
  upload: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 1) {
          wx.showToast({
            title: '请选择一张身份证' + id == 1 ? '正面' : '反面' + '图片上传',
            icon: "none"
          })
          return;
        }
        // uploads.push(tempFilePaths[i]); 如果是正面图片，设置正面图片参数
        if (id == 1) {
          that.setData({
            idCardz: tempFilePaths[0]
          });
        } else {
          that.setData({
            idCardf: tempFilePaths[0]
          });
        }

        wx.uploadFile({
          url: wx.getStorageSync('url') + "?active=img",
          filePath: tempFilePaths[0],
          name: 'files',
          formData: {
            "active": 'img',
            "files": tempFilePaths[0],
          },
          formData: {},
          success: function(res) {
            var data = JSON.parse(res.data);
            if (id == 1) {
              that.setData({
                person_zheng: data.data,
              });
            } else {
              that.setData({
                person_fang: data.data,
              });
            }
          },
          fail: function() {
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function() {
            wx.hideLoading();
          }
        })
        wx.hideToast();
      }
    })
  },
  // uploadYyzz: function(e) {
  //   var that = this;
  //   
  //   wx.chooseImage({
  //     success: function(res) {
  //       var tempFilePaths = res.tempFilePaths;
  //       if (tempFilePaths.length > 1) {
  //         wx.showToast({
  //           title: '请选择一张营业执照图片上传',
  //           icon: "none"
  //         })
  //         return;
  //       }


  //       wx.uploadFile({
  //         url: wx.getStorageSync('url') + "?active=img",
  //         filePath: tempFilePaths[0],
  //         name: 'files',
  //         formData: {
  //           "active": 'img',
  //           "files": tempFilePaths[0],
  //         },
  //         formData: {},
  //         success: function(res) {
  //           var data = JSON.parse(res.data);
  //           that.setData({
  //             license: data.data,
  //           });
  //         },
  //         fail: function() {
  //           wx.showModal({
  //             title: '提示',
  //             content: '上传失败',
  //             showCancel: false
  //           })
  //         },
  //         complete: function() {
  //           wx.hideLoading();
  //         }
  //       })
  //       wx.hideToast();
  //     }
  //   })
  // },
  storeImgUpload: function(e) {
    var that = this;
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 1) {
          wx.showToast({
            title: '请选择一张店铺logo上传',
            icon: "none"
          })
          return;
        }
        wx.uploadFile({
          url: wx.getStorageSync('url') + "?active=img",
          filePath: tempFilePaths[0],
          name: 'files',
          formData: {
            "active": 'img',
            "files": tempFilePaths[0],
          },
          formData: {},
          success: function(res) {
            var data = JSON.parse(res.data);
            that.setData({
              store_img: data.data,
            });
          },
          fail: function() {
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function() {
            wx.hideLoading();
          }
        })
        wx.hideToast();
      }
    })
  },
  uploadDpmtz: function(e) {
    var that = this;
    var len = e.currentTarget.dataset.len;
    var length = len == 1 ? that.data.uploads.length : that.data.licenseAry.length
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;

        const num = that.data.uploads.length + tempFilePaths.length;

        if ((length + tempFilePaths.length) > 5) {
          wx.showModal({
            title: '提示',
            content: "最多上传5张图片",
            showCancel: false
          })
          return;
        }
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: wx.getStorageSync('url') + "?active=img",
            filePath: tempFilePaths[i],
            name: 'files',
            formData: {
              "active": 'img',
              "files": tempFilePaths[i],
            },
            formData: {},
            success: function(ress) {
              var data = JSON.parse(ress.data);
              var uploads = that.data.uploads;
              var licenseAry = that.data.licenseAry;
              if (len == 1) {
                uploads.push(data.data);
                that.setData({
                  uploads: uploads,
                });
              } else if (len == 2) {
                licenseAry.push(data.data);
                that.setData({
                  licenseAry: licenseAry,
                });
              }
            },
            fail: function() {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
            complete: function() {
              wx.hideLoading();

            }
          })
        }

      }
    })

  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})

// 获取线下商户一级分类
var getOffLineData = function(that) {
  var params = {
    active: "store_class",
  }
  app.getRequest(params).then((res) => {
    that.setData({
      storeClass: res.data,
    });
  });
}