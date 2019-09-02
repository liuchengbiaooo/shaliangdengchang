let self
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop: false,
    list: [],
  },
  // 获取问卷模板
  getQuestionInfos() {
    const data = {
      ShopId: getApp().globalData.wscShopId,
      PageIndex: 1,
      PageSize: 100
    }
    getApp().ajaxResetS('/Sunshade/GetCustomerQuestionnaireTemplate', 'post', data, (res) => {
      let nowList = res.data.Data.Items
      nowList.map((item, idx) => {
        item.AttributeName = item.AttributeName.split('#')
        return item
      })
      self.setData({
        list: nowList
      })
    })
  },
 
  // 提交
  submitHandler(e) {
    const formData = e.detail.value
    const values = Object.values(formData)
    const keys = Object.keys(formData)
    const entries = Object.entries(formData)
    const formArr = []
    let isFull = false
    for (let i = 0; i < entries.length; i++) {
      if (entries[i + 1] && entries[i][0].split('_')[1] == entries[i + 1][0].split('_')[1]) {
        // 将其他(被采纳有奖励)和input框内容合并
        if (entries[i][1] && entries[i + 1][1] && entries[i][1].indexOf('其他（被采纳有奖励）') > -1) {
          entries[i][1] = typeof(entries[i][1] + entries[i + 1][1]) == 'string' ? (entries[i][1] + entries[i + 1][1]).split(',') : (entries[i][1] + entries[i + 1][1])
        }
        entries.splice(i + 1, 1)
      }
      formArr.push({
        [entries[i][0]]: entries[i][1]
      })
    } 
    console.log(formArr)
    for (let i = 0; i < formArr.length; i++) {
      if (!Object.values(formArr[i])[0] || Object.values(formArr[i])[0].length == 0) {
        wx.showModal({
          title: '温馨提示',
          content: '请将问卷填写完整',
          showCancel: false
        })
        return false
      }
    }
    let listData = self.data.list
    let titleArr = []
    titleArr = listData.map((item, ixd) => {
      titleArr.push(item.Title)
      return titleArr
    })
    // 该方法返回数组长度
    formArr.unshift({
      title: titleArr[0]
    })
    const data = {
      ShopId: getApp().globalData.wscShopId,
      SubmitContent: JSON.stringify(formArr)
    }
    getApp().ajaxResetS('/Sunshade/AddCustomerQuestionnaire', 'post', data, function(res) {
      if (res.data.Code == 1) {
        self.setData({
          showPop: true
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
  radioChange(e) {
    console.log(e)
    const value = e.detail.value
    if (typeof value == 'object') { //多选
      self.data.list.map((item, idx) => {
        // item.title = 
      })
    } else { //单选
    }
  },
  formReset() {
    self.setData({
      showPop: false
    })
    wx.reLaunch({
      url: '/pages/sanLiangDengChang/home/home',
    })
  },
  // 跳转到订单
  gotoOrderFun () {
    wx.navigateTo({
      url: '/pages/sanLiangDengChang/mine/mineOrders/miniOrders',
    })
  },
  // 禁止自定义蒙层下的元素滑动
  preventMove() {
    return
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
    self.getQuestionInfos()
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