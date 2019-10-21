// pages/Community/tuanzhang.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

    
//     array: ['美国', '中国', '巴西', '日本'],
//     objectArray: [
//       {
//         id: 0,
//         name: '美国'
//       },
//       {
//         id: 1,
//         name: '中国'
//       },
//       {
//         id: 2,
//         name: '巴西'
//       },
//       {
//         id: 3,
//         name: '日本'
//       }
//     ],
//     index: 0,
//     multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
//     objectMultiArray: [
//       [
//         {
//           id: 0,
//           name: '无脊柱动物'
//         },
//         {
//           id: 1,
//           name: '脊柱动物'
//         }
//       ], [
//         {
//           id: 0,
//           name: '扁性动物'
//         },
//         {
//           id: 1,
//           name: '线形动物'
//         },
//         {
//           id: 2,
//           name: '环节动物'
//         },
//         {
//           id: 3,
//           name: '软体动物'
//         },
//         {
//           id: 3,
//           name: '节肢动物'
//         }
//       ], [
//         {
//           id: 0,
//           name: '猪肉绦虫'
//         },
//         {
//           id: 1,
//           name: '吸血虫'
//         }
//       ]
//     ],
//     multiIndex: [0, 0, 0],
//     date: '2016-09-01',
//     time: '12:01',
//     region: ['广东省', '广州市', '海珠区'],
//     customItem: '全部'
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },
//   bindPickerChange: function (e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       index: e.detail.value
//     })
//   },
//   bindMultiPickerChange: function (e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       multiIndex: e.detail.value
//     })
//   },
//   bindMultiPickerColumnChange: function (e) {
//     console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
//     var data = {
//       multiArray: this.data.multiArray,
//       multiIndex: this.data.multiIndex
//     };
//     data.multiIndex[e.detail.column] = e.detail.value;
//     switch (e.detail.column) {
//       case 0:
//         switch (data.multiIndex[0]) {
//           case 0:
//             data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
//             data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
//             break;
//           case 1:
//             data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
//             data.multiArray[2] = ['鲫鱼', '带鱼'];
//             break;
//         }
//         data.multiIndex[1] = 0;
//         data.multiIndex[2] = 0;
//         break;
//       case 1:
//         switch (data.multiIndex[0]) {
//           case 0:
//             switch (data.multiIndex[1]) {
//               case 0:
//                 data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
//                 break;
//               case 1:
//                 data.multiArray[2] = ['蛔虫'];
//                 break;
//               case 2:
//                 data.multiArray[2] = ['蚂蚁', '蚂蟥'];
//                 break;
//               case 3:
//                 data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
//                 break;
//               case 4:
//                 data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
//                 break;
//             }
//             break;
//           case 1:
//             switch (data.multiIndex[1]) {
//               case 0:
//                 data.multiArray[2] = ['鲫鱼', '带鱼'];
//                 break;
//               case 1:
//                 data.multiArray[2] = ['青蛙', '娃娃鱼'];
//                 break;
//               case 2:
//                 data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
//                 break;
//             }
//             break;
//         }
//         data.multiIndex[2] = 0;
//         break;
//     }
//     console.log(data.multiIndex);
//     this.setData(data);
//   },
//   bindDateChange: function (e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       date: e.detail.value
//     })
//   },
//   bindTimeChange: function (e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       time: e.detail.value
//     })
//   },
//   bindRegionChange: function (e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       region: e.detail.value
//     })
//   },


//   inputPhoneNum: function (e) {

//     let phoneNumber = e.detail.value

//     if (phoneNumber.length === 11) {

//       let checkedNum = this.checkPhoneNum(phoneNumber)

//     }

//   },

//   checkPhoneNum: function (phoneNumber) {

//     let str = /^1\d{10}$/

//     if (str.test(phoneNumber)) {

//       return true

//     } else {

//       wx.showToast({

//         title: '手机号不正确',

//         image: './../../../../images/fail.png'

//       })

//       return false

//     }

//   },
//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })

var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    array: ['美国', '中国', '巴西', '日本','的撒娇开发'],
    shequ:"",
    xiaoqu:"",
    name: '',//姓名
    tu:[],
    phone: '',//手机号
    code: '',//验证码
    iscode: null,//用于存放验证码接口里获取到的code
    codename: '获取验证码',
    url: wx.getStorageSync("url"),
  },
  //获取input输入框的值
  bindDateChange: function (e) {
    this.setData({
      shequ: e.detail.value
    })
  },
  getxiaoqu: function (e) {
    this.setData({
      xiaoqu: e.detail.value
    })
  },
  getNameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function () {
    var a = this.data.phone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
           
      var that = this;
      console.log(that.data.phone)
      var getHotStoreClass = function (that) {
        var params = {
          active: "sms",
          phone: that.data.phone,
        }
        app.getRequest(params).then((res) => {
          that.setData({
            iscode: res.data.Code,
          });
          
          // WxParse.wxParse('article', 'html', res.data.content, that, 25);

        });
      }
      getHotStoreClass(that)
     
      // wx.request({
      //   data: {},
      //   'url': 接口地址,
      //   success(res) {
      //     console.log(res.data.data)
      //     _this.setData({
      //       iscode: res.data.data
      //     })
          var num = 61;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })

            } else {
              _this.setData({
                codename: num + "s"
              })
            }
          }, 1000)
      //   }
      // })

    }


  },
  //获取验证码
  getVerificationCode() {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },
  //提交表单信息
  save: function () {
    
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.xiaoqu == "") {
      wx.showToast({
        title: '小区不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.name == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.code != this.data.iscode) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
      getcode(that)
      return false;
    } else {
      wx.setStorageSync('name', this.data.name);
      wx.setStorageSync('phone', this.data.phone);
      // wx.redirectTo({
      //   url: '../add/add',
      // })
      var that = this;
      console.log(that.data.phone)
      var getcode = function (that) {
        var params = {
          active: "user_partner",
          user_address:that.data.xiaoqu,
          phone: that.data.phone,
          user_name:taht.data.name,
          // code: that.data.code,
        }
        app.getRequest(params).then((res) => {
          that.setData({
            hotStoreClass: res.data,
          });
          // WxParse.wxParse('article', 'html', res.data.content, that, 25);

        });
      }
      
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    gettu(this)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  save1(){
    var that = this;

    var getVervify = function (that) {
      var params = {
        active: "user_partner",
        phone: that.data.phone,
        user_address:that.data.xiaoqu,
        // code: that.data.code,
        user_name: that.data.name,
        user_id:wx.getStorageSync("user_id")
      }
      app.getRequest(params).then((res) => {
        that.setData({
          hotStoreClass: res.data,
        });
        // WxParse.wxParse('article', 'html', res.data.content, that, 25);

      });
    }
    getVervify(that)
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


var gettu = function (that, callback) {

  var params = {
    active: "user_partner_image",

  }
  app.getRequest(params).then((res) => {
    console.log(res)
    
    that.setData({
      tu: res.data.image,
    });
    if (callback) {
      callback();
    }
  });

}
