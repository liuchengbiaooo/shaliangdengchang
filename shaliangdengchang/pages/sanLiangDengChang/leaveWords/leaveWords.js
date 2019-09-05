let self
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop: false,
    content: '',
    name: '',
    tel: '',
    // radios: [
    //   { Id: 0, TypeName: '故障反馈' },
    //   { Id: 1, TypeName: '投诉建议' },
    //   { Id: 2, TypeName: '业务咨询' },
    //   { Id: 3, TypeName: '其他' },
    // ],
    deviceCode:''
  },
  // 跳转到订单
  gotoOrderFun() {
    wx.navigateTo({
      url: '/pages/sanLiangDengChang/mine/mineOrders/miniOrders',
    })
  },
  radioChange() { },
  getQuestions() {
    getApp().ajaxResetS('/Sunshade/GetSunshade_Feedback_TypeSettingPageInfos', 'post', {
      ShopId: getApp().globalData.wscShopId,
      PageIndex: 1,
      PageSize: 100,
    }, function (res) {
      console.log(res)
      self.setData({
        radios: res.data.Data.Items
      })
    })
  },
  // 提交留言
  submitHandler(e) {
    const val = e.detail.value
    const data = {
      userId: getApp().globalData.wxCode,
      surnames: val.name,
      phoneNumber: val.tel,
      sex: val.sex,
      content: val.textarea,
      //TypeId: val.request,
      deviceCode:val.deviceCode
    }
    const dataArr = Object.values(data)
    console.log("执行", data.userId, data.surnames, data.phoneNumber, data.sex, data.content, data.deviceCode)
    for (let val of dataArr) {
      if (!val) {
        wx.showModal({
          title: '温馨提示',
          content: '请将留言信息填写完整',
          showCancel: false
        })
        return
      }
    }
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (val.tel.length != '11' || !myreg.test(val.tel)) {
      wx.showModal({
        title: '温馨提示',
        content: '手机号输入有误',
        showCancel: false
      })
      return
    }
    // console.log("执行", ShopId, RealName, Phone, Sex, Content, TypeId)
    getApp().ajaxResetS('/app/device/savaDeviceFault', 'post', data, function(res) {
      console.log("tianj",res)
      if (res.data.status == "1") {
        self.setData({
          showPop: true,
          content: '',
          name: '',
          tel: '',
          deviceCode:''
        })
      } else {
        self.setData({
          showPop: false,
          content: '',
          name: '',
          tel: '',
          deviceCode:''
        })
        wx.showModal({
          title: '温馨提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    })
  },
  // 关闭弹窗
  closePop() {
    self.setData({
      showPop: false
    })
  },
  //获取设备二维码
  equipmentQRcode(){
    wx.scanCode({
      success(res) {
        const DeviceSn = res.path.split('?scene=')[1];
        //const DeviceSn = res.path;
        console.log("shje",res)
        self.setData({
          deviceCode: DeviceSn
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this
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
    //self.getQuestions()
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