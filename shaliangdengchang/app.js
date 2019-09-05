//app.js
App({
  onLaunch: function (options) { //小程序初始化完成
    let that = this;
    //打开小程序 功能 传参过来=》  分类页id值处理
    console.log(options)
    if (options.query.scene) {
      this.globalData.DeviceSn = options.query.scene
      wx.showLoading({
        title: '已选中设备：' + options.query.scene,
      })
    }

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '检测出有新版本，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
    //第三方发布
    console.log('动态获取该小程序的appid及对应的shopid')
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    console.log(extConfig)
    if (JSON.stringify(extConfig) != '{}') {
      if (extConfig.ShopId != undefined) {
        console.log('解析到上传代码设置的的shopid:' + extConfig.ShopId)
        this.globalData.wscShopId = extConfig.ShopId;
      }
    }
  },
  onShow(options) {
    console.log('初始化加载', options)
    if (options.query.scene) {
      this.globalData.DeviceSn = options.query.scene
    }
  },
  /*全局变量*/
  globalData: {
    wxCode: '', //微信openid
    sessionId: '', //默认sessionid', //用于.net返回的sessionId 保证它是登陆状态的
    // imgAjaxUrl: 'http://192.168.2.230:8000', //服务器
    // ajaxResetUrl: 'http://192.168.2.230:9021', //服务器  微商城9021 小平台9031 其他9001  
    imgAjaxUrl: 'https://www1.zaiyunli.com',//图片访问路径前缀
    //ajaxResetUrl: 'https://wsc.zaiyunli.com', //接口请求路径
    ajaxResetUrl: 'http://47.107.227.121:8088', //接口请求路径
    isLogin: 0, //是否已登录 
    IsAdmin: '', //账号是否超管 
    //wscShopId: 'c3bacfd1-ce86-4a59-ba9d-e49d53278274', // 外网  汉能伞 备用（不定） 测试shopid  帐号：13817530635  密码: zyl123654 wx34ca8b8ee9085ce2
     wscShopId: "efc624c8-361b-4285-b233-3337199bba92",  //内网  账号： 19999999666  密码： 123  
    isPay: 0, //是否支付 0未支付 1已支付    
    ChargingFlag: 0, // 充电状态 0 未充电  1 在充电
    DeviceSn: "", //扫描设备后返回  "A01001101900046B"
    isPopUpFlag: true,
    LevelName: null,  //判断是否升级
    userInfo: [] //上传用户信息后后台返回的用户信息集合
  },
  //ajax调用 公用函数
  ajaxResetS: function (URL, RequestType, DataObject, CallBack) {
    //设置正在加载ajax请求
    var NowSessionID = getApp().globalData.sessionId; //用于.net返回的sessionId 保证它是登陆状态的
    wx.request({
      url: getApp().globalData.ajaxResetUrl + URL,
      data: DataObject,
      method: RequestType, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': 'ASP.NET_SessionId=' + NowSessionID
      }, // 设置请求的 header
      success: function (res) {
        console.log(res,'cheng')
        /*登录验证类，防止500错误*/
        if (res.data.error != undefined && res.data.error == 1) { // SessionID过期
          getApp().globalData.isLogin = 0;
          wx.reLaunch({
            url: '/pages/sanLiangDengChang/guide/guide'
          })
          return;
        }
        // 请求成功后的回调函数
        CallBack(res);
      },
      fail: function (res) {
        console.log(res)
        getApp().wxtsLayer(res.errMsg + '请切换网络或重启微信进程！')
      },
    })
  },
  ajaxReset: function (URL, RequestType, DataObject, CallBack) {
    wx.request({
      url: getApp().globalData.ajaxResetUrl + URL,
      data: DataObject,
      method: RequestType,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      success: function (res) {
        CallBack(res)
      },
      fail: function (res) {
        console.log(res)
        getApp().wxtsLayer(res.errMsg + '请切换网络或重启微信进程！')
      }
    })
  },
  wxtsLayerB2: function (title, content, successBack) {
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          successBack(res)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /*气泡提示*/
  qptsLayer: function (data) {
    wx.showToast({
      title: data,
      icon: 'success',
      duration: 2000
    })
  },
  qptsLayerB: function (data, callBack) {
    wx.showToast({
      title: data,
      icon: 'success',
      duration: 2000,
      complete: function () {
        callBack();
      }
    })
  },
  //温馨提示
  wxtsLayer: function (data) {
    wx.showModal({
      title: '温馨提示',
      content: data,
      showCancel: false,
      success: function (res) {
        if (res.confirm) { }
      }
    })
  },
  wxtsLayerB: function (data, callBack) {
    wx.showModal({
      title: '温馨提示',
      content: data,
      showCancel: false,
      success: function (res) {
        callBack();
      }
    })
  },
  autoWxRegister: function (callback, failCallback, beforeLogin, that) { //微信自动注册
    console.log('进入-公用的微信注册')
    if (getApp().globalData.isLogin == 0) {
      wx.login({ //登录态的刷新
        success: function (res) { //接口调用成功的回调函数
          console.log(res, '++++++++')
          var codes = res.code
          if (res.code) {
            // getApp().ajaxReset('/Weixin/WxaRegisterNew', 'post', {
            //   code: codes,
            //   encryptedData: '',
            //   iv: '',
            //   LoginPort: 'SM'
            // }, function (res) {
            //   if (res.data.ReturnModel.Code == 1) {
            //     //报错提醒
            //     getApp().qptsLayer(res.data.ReturnModel.Msg);
            //     return
            //   }
            //   //将 用户名 赋值到全局变量
            //   if (res.data.ReturnModel.Code == 0) {

            //     getApp().globalData.isLogin = 1
            //     getApp().globalData.SessionID = res.data.SessionID
            //     console.log('微信登录成功后返回的SessionID')
            //     getApp().globalData.Phone = res.data.ReturnModel.Data.Phone;
            //     getApp().globalData.IsAdmin = res.data.ReturnModel.Data.IsAdmin; 
            //     getApp().globalData.UserID = res.data.ReturnModel.Data.UserID;
            //     getApp().globalData.UserName = res.data.ReturnModel.Data.Name;
            //   }
            //   getApp().loginComplete(res.data.ReturnModel.Code, res, callback)
            // })

            //拿到appid与SessionID
            getApp().ajaxReset('/app/login/wxLogin', 'post', {
              code: codes
            }, function (res) {
              console.log(res, "Sgfag")
              if (res.data.status == '0') {
                getApp().qptsLayer(res.data.msg);
                return
              }
              if (res.data.status == '1') {
                getApp().globalData.SessionID = res.data.data.sessionKey;
                getApp().globalData.wxCode = res.data.data.openid;
                console.log("res", getApp().globalData.SessionID)
              }
              getApp().loginComplete(res, callback)
            })




            //console.log("数据", getApp().globalData.nowUserInfo)


          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    } else {
      console.log(' //已经登录')
      if (beforeLogin != undefined) {
        beforeLogin()
      }
    }
  },
  loginComplete: function (res, callback) {
    //console.log('登录完成', res)
    getApp().globalData.isLogin = 1
    //var Names = res.data.ReturnModel.Data.Name
    getApp().globalData.SessionID = res.data.data.sessionKey; //把sessinid赋值到公用值，以便调用
    callback(res)
  },
  //支付
  zylPay: function (Title, SourceType, TradeMode, ShopId, TradeFee, SourceId, successCallBack, failCallBack) {
    // 标题 业务类型 支付方式 卖家店铺id 金额 订单号
    //Title标题=在**BelongSys平台，的SourceType场景，用TradeType机器 使用TradeMode支付方式，向商家ShopId 付款了TradeFee金额 生成 SourceId订单；
    //SourceType: string	来源（业务）类型(1、版本升级，2订单付款，3线下支付，4红包充值，5退款，6提现，7核销, 8积分兑换, 9平台补贴, 10商盟收益)
    // TradeType: 'JSAPI',//	string	交易模式(JSAPI—公众号支付、NATIVE—原生扫码支付、APP—app支付、MICROPAY—刷卡支付，ACCOUNTBALANCE—账户余额) 参数值可为”JSAPI”
    //TradeMode: string	交易方式 0现金，1账内转帐（余额支付），2微信，3支付宝，4网银，5第三方（优畅），6京东白条
    // ShopId （卖家）商家店铺id
    // TradeFee: that.data.totalMoney,//	string	交易金额
    // SourceId	string	1.若是微信只支持第一笔订单支付  2.其他可多个订单id逗号隔开 3、当线下支付时，来源单号可空(00000000-0000 - 0000 - 0000 - 000000000000)，也可为优惠券领取Id(DrawId)因线下支付时无订单存在)
    var ajaxJson = {
      // Code: res.code,//	string	微信Code 当微信支付时不可空，其它为空字符串
      Title, //支付备注
      BelongSys: 'SM',
      SourceType, //哪里交易 线上线下
      // TradeType,//交易模式
      TradeMode, //交易方式
      ShopId, //商家店铺id
      TradeFee, //	交易金额
      SourceId, //订单号
      CallBackUrl: '', //	string	回调地址（https://XXXXX.com/PayForWX/CallBack） （可空）
      ProductId: '', //	string	商品Id（可空）,但交易模式为NATIVE时，必填
      ClientIp: '', //	否	string	客户端IP（可空）
      Device_Info: '', //	string	设备号（可空）

    };
    if (TradeMode == 2) { //微信付款
      ajaxJson.TradeType = 'JSAPI';
      wx.login({
        success: function (res) {
          console.log(res)
          if (res.code) {
            ajaxJson.Code = res.code, //	string	微信Code 当微信支付时不可空，其它为空字符串
              //新版 如喜 支付通道接口
              getApp().ajaxResetS('/PayForWX/Pay', 'post', ajaxJson, function (res) {
                console.log(ajaxJson, res, '支付时的参数及返回值')
                if (res.data.Code == 1) {
                  var payData = res.data.Data
                  wx.requestPayment({
                    'timeStamp': payData.timeStamp,
                    'nonceStr': payData.nonceStr,
                    'package': payData.package,
                    'signType': payData.signType,
                    'paySign': payData.paySign,
                    'success': function (res) {
                      console.log(res, '支付调用AAAAAAAAAA')
                      getApp().wxtsLayerB('微信支付成功!', function () {
                        // 关闭所有页面 并跳转至订单详情页
                        successCallBack && successCallBack()
                      })
                    },
                    'fail': function (res) {
                      failCallBack()
                      getApp().wxtsLayerB('微信支付调用失败!')
                    }
                  })
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: res.data.Msg
                  })
                }
              })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  }
})

