let self
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserName: '',
    UserPicURL: '',
    preMoney: ''
  },
  // 拨号
  linkFun () {
    wx.makePhoneCall({
      phoneNumber: '400-108-1806',
    })
  },

  getUserInfo () {
    // 获取用户基本信息
    getApp().ajaxResetS('/MySetting/GetUserBaseInfo', 'post', '', function (res) {
      if (res.data.Code == 1) {
        let datas = res.data.Data;
        self.setData({
          UserName: datas.UserName != '' ? datas.UserName : datas.ComName,
          UserPicURL: getApp().globalData.imgAjaxUrl + datas.UserPicURL,
        })
        console.log(self.data)
      }
    });

    // 账户余额信息
    getApp().ajaxResetS('/PersonMyOrder/GetAccountList', 'post', '', function (res) {
      if (res.data.Code == 1) {
        let datas = res.data.Data;
        self.setData({
          preMoney: datas.PersonAccount.Balance
          // compayMoney: datas.CompanyAccount.Balance
        })
      }
    });
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
    self.getUserInfo()
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