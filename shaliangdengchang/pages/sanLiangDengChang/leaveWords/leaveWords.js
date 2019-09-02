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
    radios: []
  },
  // 跳转到订单
  gotoOrderFun() {
    wx.navigateTo({
      url: '/pages/sanLiangDengChang/mine/mineOrders/miniOrders',
    })
  },
  radioChange() {},
  getQuestions() {
    getApp().ajaxResetS('/Sunshade/GetSunshade_Feedback_TypeSettingPageInfos', 'post', {
      ShopId: getApp().globalData.wscShopId,
      PageIndex: 1,
      PageSize: 100,
    }, function(res) {
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
      ShopId: getApp().globalData.wscShopId,
      RealName: val.name,
      Phone: val.tel,
      Sex: val.sex,
      Content: val.textarea,
      TypeId: val.request
    }
    const dataArr = Object.values(data)
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
    if (val.tel.length != '11') {
      wx.showModal({
        title: '温馨提示',
        content: '手机号输入有误',
        showCancel: false
      })
      return
    }

    getApp().ajaxResetS('/Sunshade/AddFeedbackInfo', 'post', data, function(res) {
      if (res.data.Code == 2) {
        self.setData({
          showPop: true,
          name: '',
          tel: '',
          content: ''
        })
      } else {
        self.setData({
          showPop: false,
          name: '',
          tel: '',
          content: ''
        })
        wx.showModal({
          title: '温馨提示',
          content: res.data.Msg,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
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
    self.getQuestions()
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