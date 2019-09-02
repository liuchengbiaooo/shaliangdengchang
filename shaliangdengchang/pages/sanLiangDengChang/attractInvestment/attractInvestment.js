let self
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      CompanyName: '',
      Name: '',
      Phone: '',
      Area: ''
    }
  },
  joinFun(e) {
    const val = e.detail.value
    const arr = Object.values(val)
    for (let i=0; i<arr.length; i++) {
      if (!arr[i]) {
        wx.showModal({
          title: '温馨提示',
          content: '请将信息填写完整',
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
    const data = {
      ShopId: getApp().globalData.wscShopId,
      CompanyName: val.company,
      Name: val.name,
      Phone: val.tel,
      Area: val.dress
    }
    getApp().ajaxResetS('/Sunshade/AddBuuinessInfo', 'post', data, (res) => {
      self.setData({
        form: {
          CompanyName: '',
          Name: '',
          Phone: '',
          Area: ''
        }
      })
      if(res.data.Code == 1) {
        wx.showModal({
          title: '温馨提示',
          content: '提交成功',
          showCancel: false
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: res.data.Msg,
          showCancel: false
        })
      }
    })
  },
  // 拨号
  makeCall () {
    wx.makePhoneCall({
      phoneNumber: '400-108-1806',
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