let self
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    noData: false,
    PageIndex: 1,
    PageSize: 10
  },

  //获取设备SN 
  sanCodeHandler(e, sucCallBack) {
    wx.scanCode({
      success(res) {
        console.log(res, '扫码返回')
        const DeviceSn = res.path.split('?scene=')[1]
        getApp().globalData.DeviceSn = DeviceSn //旧 A01001101900046B
        sucCallBack(e)
      }
    })
  },

  // 删除订单 - 测试使用
  delHandler(e) {
    console.log(e, '删除订单项')
    const chargeStatus = e.target.dataset.chargestatus
    if (chargeStatus == 1) {
      wx.showModal({
        title: '温馨提示',
        content: '当前订单正在充电...',
        showCancel: false,
      })
      return
    }
    wx.showModal({
      title: '温馨提示',
      content: '确定要删除订单吗？',
      success(res) {
        if (res.confirm) {
          const orderId = e.target.dataset.orderid
          wx.request({
            url: getApp().globalData.ajaxResetUrl + '/Sunshade/DeleteOrder',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'cookie': 'ASP.NET_SessionId=' + getApp().globalData.sessionId
            },
            data: {
              OrderId: orderId
            },
            success(res) {
              console.log(res)
              if (res.data.Code == 1) {
                // 刷新订单列表
                self.setData({
                  PageIndex: 1,
                  noData: false
                })
                self.getOrders(self.data.PageIndex)
                if (e.target.chargestatus != 2) { //充电已完成订单不清空设备ID
                  getApp().globalData.DeviceSn = ''
                }
                wx.showToast({
                  title: res.data.Msg,
                })
              }
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })


  },

  // 获取订单列表
  getOrders(PageIndex) {
    wx.request({
      url: getApp().globalData.ajaxResetUrl + '/Sunshade/GetOrderInfos',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': 'ASP.NET_SessionId=' + getApp().globalData.sessionId
      },
      data: {
        ShopId: getApp().globalData.wscShopId,
        PageIndex: PageIndex,
        PageSize: self.data.PageSize
      },
      success(res) {
        // CreateTime
        if (res.data.Code == 1) {
          const Data = res.data.Data.Items
          console.log(Data, '订单')
          let orders = []

          let creatTime = ''
          for (let i = 0; i < Data.length; i++) {
            creatTime = new Date(parseInt(Data[i].CreateTime.split('(')[1].split(')')))

            let year = creatTime.getFullYear()
            let month = creatTime.getMonth() + 1
            let date = creatTime.getDate()
            let hours = creatTime.getHours()
            let minutes = creatTime.getMinutes()
            if (month < 10) {
              month = "0" + month
            }
            if (date < 10) {
              date = "0" + date
            }
            if (hours < 10) {
              hours = "0" + hours
            }
            if (minutes < 10) {
              minutes = "0" + minutes
            }

            let ChargeTimeDuration = ''
            if (Data[i].ChargeTime >= 60) {
              const hs = (Math.floor(Data[i].ChargeTime / 60)).toString().padStart(2,'0')
              const mt = (Data[i].ChargeTime - hs * 60).toString().padStart(2, '0')
              ChargeTimeDuration = `${hs}:${mt}:00`
            } else {
              const mt = Data[i].ChargeTime.toString().padStart(2, '0')
              ChargeTimeDuration = `00:${mt}:00`
            }

            // 拼接时间字符串
            creatTime = year + "-" + month + "-" + date + "  " + hours + ":" + minutes
            orders.push({
              ChargeTimeDuration: ChargeTimeDuration,
              ChargeTime: Data[i].ChargeTime,
              ChargeType: Data[i].ChargeType,
              ChargeStatus: Data[i].ChargeStatus,
              ChargeFee: Data[i].ChargeFee,
              OrderId: Data[i].OrderId,
              Status: Data[i].Status,
              IsQuick: Data[i].IsQuick,
              IsOpen: Data[i].IsOpen,
              CreateTime: creatTime
            })
          }
          if (PageIndex == 1) {
            self.setData({
              orders
            })
          } else {
            let concatOrders = self.data.orders.concat(orders)
            self.setData({
              orders: concatOrders
            })
          }
          wx.stopPullDownRefresh()
          if (Data.length == 0) {
            self.setData({
              noData: true
            })
            return
          }
        }
      }
    })
  },

  // 开始充电
  dischargeHandler(e) {
    if (getApp().globalData.DeviceSn == "") {
      self.sanCodeHandler(e, function() {
        //self.chargeFun(e)
      })
    } else {
      //self.chargeFun(e)
    }
  },

  // 跳转充电
  chargeFun(e) {
    wx.request({
      url: getApp().globalData.ajaxResetUrl + '/Sunshade/GetOrderStatusById',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': 'ASP.NET_SessionId=' + getApp().globalData.sessionId
      },
      data: {
        ShopId: getApp().globalData.wscShopId
      },
      success(res) {
        // 后台返回的充电状态剩余时间
        if (res.data.Code == '1' && res.data.Data) {
          getApp().globalData.remainderTime = res.data.Data.BlanceSecond
          let ChargeTime = getApp().globalData.remainderTime
          if (ChargeTime > 0) {
            wx.showModal({
              title: '正在充电中...',
              content: '本次充电完成后才能续费',
              showCancel: false
            })
          }
        } else { //当无返回时间时 Data = ''
          const chargetime = e.target.dataset.chargetime
          const orderid = e.target.dataset.orderid
          // 跳转回首页 开启充电
          wx.reLaunch({
            url: '/pages/sanLiangDengChang/home/home?chargetime=' + chargetime + '&orderid=' + orderid,
          })
        }
      }
    })
  },


  // 先支付
  paymentHandler(e) {
    if (getApp().globalData.DeviceSn == "") {
      self.sanCodeHandler(e, function() {
        //self.payFun(e)
      })
    } else {
     // self.payFun(e)
    }
  },

  payFun (e) {
    wx.request({
      url: getApp().globalData.ajaxResetUrl + '/Sunshade/GetOrderStatusById',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': 'ASP.NET_SessionId=' + getApp().globalData.sessionId
      },
      data: {
        ShopId: getApp().globalData.wscShopId
      },
      success(res) {
        // 后台返回的充电状态剩余时间
        if (res.data.Code == '1' && res.data.Data) {
          getApp().globalData.remainderTime = res.data.Data.BlanceSecond
          let ChargeTime = getApp().globalData.remainderTime
          if (ChargeTime > 0) {
            wx.showModal({
              title: '正在充电中...',
              content: '本次充电完成后才能续费',
              showCancel: false
            })
          }
        } else { //当无返回时间时 Data = ''
          const chargetime = e.target.dataset.chargetime
          const chargefee = e.target.dataset.chargetime
          const orderId = e.target.dataset.orderid
          // 支付并运行动画
          getApp().zylPay('微信支付', 22 /*SourceType*/, 2, getApp().globalData.wscShopId, chargefee, orderId, function () {
            // 跳转回首页 开启充电
            wx.showModal({
              content: '即将开启充电！',
              showCancel: false,
              success() {
                wx.reLaunch({
                  url: '/pages/sanLiangDengChang/home/home?chargetime=' + chargetime + '&orderid=' + orderId
                })
              }
            })
          }, function () {
            console.log('支付失败')
          })
        }
      }
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
    self.setData({
      PageIndex: 1,
      noData: false
    })
    self.getOrders(self.data.PageIndex)
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
  onPullDownRefresh: function() { //刷新
    self.setData({
      PageIndex: 1,
      noData: false
    })
    self.getOrders(self.data.PageIndex)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() { //加载更多
    let {
      PageIndex
    } = self.data
    PageIndex += 1
    console.log(PageIndex)
    self.setData({
      PageIndex
    })
    self.getOrders(PageIndex)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})