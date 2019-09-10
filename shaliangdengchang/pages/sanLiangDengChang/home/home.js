let self
    // 定义仪表盘的初始化数据
const [START1, START2, COUNT, LENGTH, WIDTH] = [8, 22, 60, 18, 3]
const SPEED = 5 //转动速度

Page({
    data: {
        charge: [],
        countDown: '00:00',
        speed: 2, //充电时仪表盘转动速度
        // bgColor: Math.floor(Math.random() * 4),
        model: {
            text: '',
            openType: '0' //1授权 2分享
        },
        showModel: false, //model显示隐藏
        showPop: false,
        energyTotal: 0,
        energyToday: 0,
        LevelName: '',
        LevelPic: '',
        showPic: false,
        picUserName: '',
        homeImgs: [], //轮播图
        isPopUpFlag: getApp().globalData.isPopUpFlag
    },

    // 存入能量仓
    saveEnergy() {
        console.log(getApp().globalData.LevelName)
        getApp().ajaxResetS('/Sunshade/SaveEnergyNumByUserId', 'post', {
            ShopId: getApp().globalData.wscShopId
        }, function(res) {
            if (res.data.Code == 1) {
                // self.getEnergyTotal()
                const data = {
                    Id: getApp().globalData.UserID,
                    ShopId: getApp().globalData.wscShopId
                }
                getApp().ajaxResetS('/Sunshade/GetEnergylevel', 'post', data, res => {
                    if (res.data.Code == 1) {
                        const Data = res.data.Data
                        self.setData({
                            energyTotal: Data.EnergyNum,
                            energyToday: Data.TodayEnergy,
                            LevelName: Data.LevelName,
                            LevelPic: getApp().globalData.imgAjaxUrl + Data.LevelPic,
                        })
                        if (getApp().globalData.LevelName != Data.LevelName) {
                            self.setData({
                                showPic: true
                            })
                            getApp().globalData.LevelName = Data.LevelName
                        } else {
                            wx.showModal({
                                title: '温馨提示',
                                content: '能量已存入',
                                showCancel: false
                            })
                        }
                    }
                })
            }
        })
    },

    // 获取总能量
    getEnergyTotal() {
        const data = {
            Id: getApp().globalData.UserID,
            ShopId: getApp().globalData.wscShopId
        }

        getApp().ajaxResetS('/Sunshade/GetEnergylevel', 'post', data, res => {
            if (res.data.Code == 1) {
                const Data = res.data.Data
                self.setData({
                    energyTotal: Data.EnergyNum,
                    energyToday: Data.TodayEnergy,
                    LevelName: Data.LevelName,
                    LevelPic: getApp().globalData.imgAjaxUrl + Data.LevelPic,
                })
                getApp().globalData.LevelName = Data.LevelName
            }
        })
    },

    // 显示会员等级证书
    showPicFun() {
        if (self.data.LevelName == '小学生') {
            return
        }
        self.setData({
            showPic: true,
            picUserName: getApp().globalData.UserName
        })
    },
    closePicFun() {
        self.setData({
            showPic: false,
            picUserName: ''
        })
    },

    // 跳转到问卷调查页面
    questionHandler() {
        wx.navigateTo({
            url: "/pages/sanLiangDengChang/home/questionnaire/questionnaire",
            success() {
                self.setData({
                    isPopUpFlag: false
                })
            }
        })
    },

    // 获取问卷状态（是否已经提交）
    getQuestionInfos() {
        const data = {
            ShopId: getApp().globalData.wscShopId,
            PageIndex: 1,
            PageSize: 1
        }
        getApp().ajaxResetS('/Sunshade/GetCustomerQuestionnaireTemplate', 'post', data, (res) => {
            if (res.data.Code == 2) { //问卷已经提交过
                self.setData({
                    showPop: false
                })
            } else if (res.data.Code == 1) {
                setTimeout(() => {
                    self.setData({
                        showPop: true
                    })
                }, 5000)
            }
        })
    },

    // 关闭问卷弹窗
    closeQuestion() {
        self.setData({
            isPopUpFlag: false
        })
    },

    //禁止自定义蒙层下的元素滑动 
    preventMove() {
        return
    },

    // model
    close() {
        self.setData({
            showModel: false
        })
    },

    //更新用户等级
    userLevel(LevelName) {
        console.log('zhix')
        self.setData({
            LevelName
        })
    },
    // 点击充电按钮
    freeClickHandler(e) {
        console.log(e, "执行", getApp().globalData.wxCode)
            // if (getApp().globalData.ChargingFlag == 1) {
            //   wx.showModal({
            //     title: '正在充电中...',
            //     content: '本次充电完成后才能续费',
            //     showCancel: false
            //   })
            //   return
            // }
        console.log("用户信息", getApp().globalData.userInfo)
        let phoneNumber = getApp().globalData.userInfo.phoneNumber;
        let LevelName = getApp().globalData.userInfo.levelName; //用户等级
        if (phoneNumber == '') { //判断是否有手机号
            self.setData({
                showModel: true,
                model: {
                    text: '授权手机号码',
                    openType: '1'
                }
            })
        }

        // getApp().ajaxResetS('/app/login/findUserInfo', 'post', {//查询用户信息 拿手机号
        //   WxCode: getApp().globalData.wxCode
        // }, function (res) {
        //   if (res.data.data.phoneNumber == '') {
        //     console.log("sss", res.data.data.phoneNumber);
        //     self.setData({
        //       showModel: true,
        //       model: {
        //         text: '授权手机号码',
        //         openType: '1'
        //       }
        //     })
        //   }
        // })

        if (!phoneNumber == '') { //已授权
            console.log("手机号已经绑定成功！！")
                // self.setData({
                //   showModel: true,
                //   model: {
                //     text: '手机号已绑定成功',
                //     openType: '2'
                //   }
                // })
            if (!getApp().globalData.DeviceSn) { //调取摄像头
                self.sanCodeHandler(LevelName, self.userLevel) //更新等级
                return
            }
        }

        // else { //未授权
        //   self.setData({
        //     showModel: true,
        //     model: {
        //       text: '授权手机号并分享即可免费充电',
        //       openType: '1'
        //     }
        //   })
        // }
    },

    // 手机授权 
    getPhone: function(e) {
        if (e.detail.errMsg == 'getPhoneNumber:fail user canceled' || e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户取消授权
            console.log('授权取消')
        } else {
            //确认授权
            self.setData({
                showModel: false,
                model: {
                    text: '',
                    openType: ''
                }
            })
            let LevelName = getApp().globalData.userInfo.levelName; //用户等级
            wx.login({ //获取微信code验证串
                success: function(msg) {
                    getApp().ajaxReset('/app/login/wxLogin', 'post', { //获取session,必须保证与登录一致
                            code: msg.code
                        }, function(res) {
                            console.log("baocuo")
                            if (res.data.status == '1') {
                                getApp().globalData.SessionID = res.data.data.sessionKey;
                                getApp().globalData.wxCode = res.data.data.openid;
                            }
                        })
                        //解析手机号码加密串
                    getApp().ajaxResetS('/app/login/getPhoneNumber', 'post', {
                        encryptedData: e.detail.encryptedData,
                        session_key: getApp().globalData.SessionID,
                        iv: e.detail.iv
                    }, function(res) {
                        getApp().globalData.phoneNumber = res.data.data.purePhoneNumber;
                        console.log(res.data.data.purePhoneNumber)

                        if (res.data.status == 1) {
                            getApp().ajaxResetS('/app/login/savaUserInfo', 'post', {
                                userName: getApp().globalData.nowUserInfo.nickName,
                                headImg: getApp().globalData.nowUserInfo.avatarUrl,
                                phoneNumber: res.data.data.purePhoneNumber,
                                age: 1,
                                city: getApp().globalData.nowUserInfo.city,
                                gender: getApp().globalData.nowUserInfo.gender,
                                wxCode: getApp().globalData.wxCode
                            }, (result) => {
                                console.log('result', result)
                                if (result.data.status == 1) {
                                    getApp().globalData.isHasPhone = 1
                                    getApp().globalData.DeviceSn = ''
                                    console.log("手机号码绑定成功！！！！")


                                    if (!getApp().globalData.DeviceSn) { //调取摄像头
                                        self.sanCodeHandler(LevelName, self.userLevel) //更新等级
                                        return
                                    }
                                    // 手机号授权绑定成功
                                    // self.setData({
                                    //   showModel: true,
                                    //   model: {
                                    //     //text: '分享即可免费充电',
                                    //     openType: '2'
                                    //   }
                                    // })
                                }
                                // } else if (result.data.Code == -2) {
                                //   wx.showModal({
                                //     title: '温馨提示',
                                //     content: '该手机号码已被使用，请使用其他号码！',
                                //     showCancel: false,
                                //     success: function (msg) {
                                //       // if (msg.confirm) {
                                //       //   wx.navigateTo({
                                //       //     url: '/pages/public/CheckPhone/CheckPhone',
                                //       //   })
                                //       //   return;
                                //       // } else if (msg.cancel) {
                                //       // }
                                //     }
                                //   })
                                // }
                            })
                        }
                    })
                }
            })
        }
    },

    //获取充电时间列表 
    getTimeInfo() {
        wx.request({
            url: getApp().globalData.ajaxResetUrl + '/Sunshade/GetChareTimeSettingInfos',
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'cookie': 'ASP.NET_SessionId=' + getApp().globalData.sessionId
            },
            data: {
                ShopId: getApp().globalData.wscShopId,
                PageIndex: 1,
                PageSize: 20
            },
            success(res) {
                console.log(res)
                if (res.data.Code == 1) {
                    let chargeArr = res.data.Data.List
                    for (let i = 0; i < chargeArr.length; i++) {
                        if (chargeArr[i].ChargeFee == 0) {
                            getApp().globalData.FreeTime = chargeArr[i].ChargeTime
                            getApp().globalData.FreeFee = chargeArr[i].ChargeFee
                            getApp().globalData.IsOpen = chargeArr[i].IsOpen
                            getApp().globalData.IsQuick = chargeArr[i].IsQuick
                        }
                    }
                    self.setData({
                        charge: chargeArr
                    })

                    wx.stopPullDownRefresh() //停止下拉刷新
                } else {
                    wx.showModal({
                        title: '温馨提示',
                        content: res.data.Msg,
                        showCancel: false
                    })
                }
            }
        })
    },

    // 开始绘图 -- 传入时间差
    drawMeter(time) {
        // 获取canvas宽
        const query = wx.createSelectorQuery()
        query.select('#energe').boundingClientRect()
        query.exec((res) => {
            //仪表盘半径 
            const r = res[0].width / 2

            let n1 = 0 //颜色变化的起点
            let n2 = START2 //颜色变化的终点
            if (!time) {
                // 初始化
                self.drawMeterHandler(r, n1, n2)
                return
            }
            clearInterval(self.timer1)

            // 定时调用绘图函数
            self.timer1 = setInterval(() => {
                if (n2 < COUNT) {
                    n2++
                }
                if (n2 === COUNT) {
                    if (n1 < START1) {
                        n1++
                    } else {
                        n1 = 0
                        n2 = START2
                    }
                }
                // 当充电时间到后 停止转动
                if (getApp().globalData.ChargingFlag == 0) {
                    n1 = 0
                    n2 = START2
                    clearInterval(self.timer1)
                    self.drawMeter()
                    return
                }
                self.drawMeterHandler(r, n1, n2)

            }, time / COUNT * 1000)
        })
    },

    // 绘图函数
    drawMeterHandler(r, n1, n2) {

        const ctx = wx.createCanvasContext('energe')
            // 设置绘图中心
        ctx.translate(r, r)

        // 绘制表盘格
        for (let i = 0; i < COUNT; i++) {
            // 每条线起点对应得弧度
            let rad = 2 * Math.PI / COUNT * i

            // 起点坐标 "round"会使线条略微变长，将起始点向中心偏移适当距离
            let x = Math.cos(rad) * (r - 2)
            let y = Math.sin(rad) * (r - 2)

            // 终点坐标
            let x1 = Math.cos(rad) * (r - LENGTH - 2)
            let y1 = Math.sin(rad) * (r - LENGTH - 2)

            // 去掉环的部分  START1 到 START2 之间为空白
            if (rad < 2 * Math.PI / COUNT * START1 || rad > 2 * Math.PI / COUNT * START2) {
                //创建绘图路径
                ctx.beginPath()

                ctx.moveTo(x, y)
                ctx.lineTo(x1, y1)
                ctx.strokeStyle = '#FFF' //初始线为白色
                ctx.lineWidth = WIDTH
                ctx.lineCap = "round"
                ctx.stroke()

                if (rad <= 2 * Math.PI / COUNT * n2 && rad > 2 * Math.PI / COUNT * START1) {
                    ctx.beginPath()

                    ctx.moveTo(x, y)
                    ctx.lineTo(x1, y1)
                    ctx.strokeStyle = '#f7ca49'
                    ctx.lineWidth = WIDTH
                    ctx.lineCap = "round"
                    ctx.stroke()
                }

                if (rad < 2 * Math.PI / COUNT * n1) {
                    ctx.beginPath()

                    ctx.moveTo(x, y)
                    ctx.lineTo(x1, y1)
                    ctx.strokeStyle = '#f7ca49'
                    ctx.lineWidth = WIDTH
                    ctx.lineCap = "round"
                    ctx.stroke()
                }
            }
        }

        ctx.draw()
    },

    // 判断 用户是否是扫码进入 如果不是需要做扫码操作
    sanCodeHandler(e, sucCallBack) {
        // console.log("sfafgaf")
        wx.scanCode({
            success(res) {
                console.log(res, '扫码返回')
                const DeviceSn = res.path.split('?scene=')[1]
                getApp().globalData.DeviceSn = DeviceSn //旧 A01001101900046B
                    //console.log("DeviceSn", DeviceSn)
                sucCallBack(e)
            }
        })
    },

    //点击下单 -> 支付 - 开始充电 并倒计时
    chargeHandler(e) {
        if (getApp().globalData.ChargingFlag == 1) {
            wx.showModal({
                title: '正在充电中...',
                content: '本次充电完成后才能续费',
                showCancel: false
            })
            return
        }

        if (!getApp().globalData.DeviceSn) {
            self.sanCodeHandler(e, self.chargeHandler)
            return
        }

        let ChargeTime = e.currentTarget.dataset.chargetime //充电时长 分钟 * 60
            // let ChargeTime = 1 //充电时长
        let IsQuick = e.currentTarget.dataset.isquick //是否为快充
        let IsOpen = e.currentTarget.dataset.isopen //是开启风扇
        let ChargeFee = e.currentTarget.dataset.chargefee //价格

        // 设置充电时间我全局 支付返回后使用
        getApp().globalData.ChargeTime = ChargeTime

        let request = {
            "ShopId": getApp().globalData.wscShopId,
            "ChargeTime": ChargeTime,
            "ChargeFee": ChargeFee,
            "DeviceSn": getApp().globalData.DeviceSn, //扫描设备后返回  "A01001101900046B"
            "IsQuick": IsQuick,
            "IsOpen": IsOpen
        }

        // 生成订单时禁止其他操作
        wx.showLoading({
            title: '正在生成订单',
            mask: true
        })
        wx.request({
            url: getApp().globalData.ajaxResetUrl + '/Sunshade/AddOrderInfo',
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'cookie': 'ASP.NET_SessionId=' + getApp().globalData.sessionId
            },
            data: {
                request: JSON.stringify(request)
            },
            success(res) {
                if (res.data.Code == '1') {
                    const orderId = res.data.Data //订单号

                    // 支付并运行动画
                    getApp().zylPay('微信支付', 22 /*SourceType*/ , 2, getApp().globalData.wscShopId, ChargeFee, orderId, function() {
                        // 支付成功后2s 设备放电  并执行动画
                        self.dischargeHandler(orderId, function() {
                            // 设备放电获取充电剩余时间
                            //self.getStatus()
                        }, function(res) {
                            getApp().globalData.DeviceSn = ''
                            wx.showModal({
                                title: '温馨提示',
                                content: res.data.Msg + '(' + res.data.Data + ')',
                                showCancel: false
                            })
                        })
                    }, function() {
                        console.log('支付失败')
                    })
                }
                if (res.data.Code != '1') {
                    wx.showModal({
                        title: '温馨提示',
                        content: res.data.Msg,
                        showCancel: false
                    })
                }
            },
            complete() {
                wx.hideLoading()
            }
        })
    },

    //倒计时函数 
    countDown(difftime) {
        // 根据时间差得到对应的分 秒
        let minutes = Math.floor(difftime / 60)
        let seconds = Math.floor(difftime % 60)

        if (seconds < 10) {
            seconds = '0' + seconds
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        self.setData({
            countDown: `${minutes}:${seconds}`
        })
    },

    // 用户充电订单状态 剩余时间
    getStatus() {
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
                // 测试数据
                // let newD = new Date('2019/05/21 11:52:00').getTime()
                // let old = new Date().getTime()
                // let test = (newD - old) / 1000
                // getApp().globalData.remainderTime = test
                // if (test > 0) {

                // 后台返回的充电状态剩余时间
                if (res.data.Code == '1' && res.data.Data) {
                    getApp().globalData.remainderTime = res.data.Data.BlanceSecond

                    let ChargeTime = getApp().globalData.remainderTime
                    if (ChargeTime > 0) {
                        self.animation(ChargeTime, SPEED)
                    }
                } else { //当无返回时间时 Data = ''
                    // 清除倒计时动画
                    self.animation(-1, SPEED)

                    if (res.data.Code == 0) {
                        wx.showModal({
                            title: '温馨提示',
                            content: res.data.Msg,
                            showCancel: false
                        })
                    }
                }
            }
        })
    },

    // 动画
    animation(ChargeTime, speed) {
        getApp().globalData.ChargingFlag = 1 //正在充电标识 
            //  清除上一次定时器
        clearInterval(self.timer)
        clearInterval(self.timer1)

        // 传入-1时清除动画和倒计时，不执行动画效果
        if (ChargeTime == -1) {
            getApp().globalData.ChargingFlag = 0
                // 倒计时清除
            self.countDown(0)
                // 初始化仪表盘
            self.drawMeter()
                //调用能量接口 
                //self.getEnergyTotal()
            return
        }

        let difftime = ChargeTime // 返回时间为秒
            //倒计时 开始
        self.timer = setInterval(() => {
            if (difftime < 0) {
                difftime = 0
                getApp().globalData.ChargingFlag = 0 //充电状态标识
                getApp().globalData.DeviceSn = '' //充电结束清空设备ID
                clearInterval(self.timer)
                    // 初始化仪表盘
                self.drawMeter()
                    //调用能量接口 
                    //self.getEnergyTotal()
                return
            }

            self.countDown(difftime)
            difftime--
        }, 1000)
        self.drawMeter(speed)
    },

    // 设备放电
    dischargeHandler(orderId, successCallback, failCallBack) {
        wx.showLoading({
            title: '启动中,请稍后',
            mask: true
        })
        wx.request({
            url: getApp().globalData.ajaxResetUrl + '/Sunshade/ELE',
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'cookie': 'ASP.NET_SessionId=' + getApp().globalData.sessionId
            },
            data: {
                Order: orderId,
                SNS: getApp().globalData.DeviceSn
                    // line: '',  //1:给有线端口放电,2:给无线端口放电 可选
                    // usb: ''   //0:代表随机,其他的数值代表指定端口   可选
            },
            success(res) {
                if (res.data.Code == '1') {
                    successCallback()
                } else {
                    failCallBack(res)
                }
            },
            complete() {
                wx.hideLoading()
            }
        })
    },
    loginSuccess() {
        if (getApp().globalData.isLogin == 1) {
            // self.getTimeInfo()
            // 初始化仪表盘
            self.drawMeter()
                // 剩余时间状态
                //self.getStatus()
                //self.getEnergyTotal()
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this

        getApp().autoWxRegister(function(res) { //登录
            // console.log("执行",getApp().globalData.SessionID,getApp().globalData.wxCode)

            // 获取问卷状态
            //self.getQuestionInfos()

            //self.loginSuccess()

            //修改用户头像和昵称
            // if (res.data.ReturnModel.Data.Phone) {
            //   getApp().globalData.isHasPhone = 1
            // }
            // let names = {
            //   Name: getApp().globalData.nowUserInfo.nickName
            // }
            // if (res.data.ReturnModel.Data.HeadPic == '/upload/Default.png') {
            //   getApp().ajaxResetS('/MySetting/SaveWeiXinHeadPic', 'post', {
            //     url: getApp().globalData.nowUserInfo.avatarUrl
            //   }, function(res) {})
            // }
            // if (res.data.ReturnModel.Data.Name == '注册/登入') {
            //   getApp().ajaxResetS('/MySetting/SavePartUserInfo', 'post', {
            //     MainData: JSON.stringify(names)
            //   }, function(res) {
            //     if (res.data.Code == 1) { //用户名保存成功后跳转
            //     }
            //   })
            // }

            //上传用户信息
            getApp().ajaxReset('/app/login/savaUserInfo', 'post', {
                userName: getApp().globalData.nowUserInfo.nickName,
                headImg: getApp().globalData.nowUserInfo.avatarUrl,
                age: 1,
                phoneNumber: '',
                city: getApp().globalData.nowUserInfo.city,
                gender: getApp().globalData.nowUserInfo.gender,
                wxCode: getApp().globalData.wxCode
            }, function(res) {
                //拿到用户信息集合
                if (res.data.status == '1') {
                    getApp().ajaxResetS('/app/login/findUserInfo', 'post', {
                        WxCode: getApp().globalData.wxCode
                    }, function(res) {
                        if (res.data.status == '1') {
                            getApp().globalData.userInfo = res.data.data
                        }
                    })
                }
            })
        }, function() {
            console.log("登录接口调用失败")
        }, function(res) {
            console.log('已经登录状态......')
            self.loginSuccess()
        }, self)


        // // 订单跳转到首页充电
        // if (options.chargetime && options.orderid) {
        //   const orderId = options.orderid
        //   // const chargetime = options.chargetime

        //   // 调用放电 -- 执行动画
        //   self.dischargeHandler(orderId, function() { //放电成功回调
        //     self.getStatus()
        //   }, function(res) { //放电失败回调
        //     getApp().globalData.DeviceSn = ''
        //     wx.showModal({
        //       title: '温馨提示',
        //       content: res.data.Msg + '(' + res.data.Data + ')',
        //       showCancel: false
        //     })
        //   })
        // }

        //拿取顶部轮播图图片地址
        getApp().ajaxReset('/app/login/bannerList', 'post', '', function(res) {
            if (res.data.status == 1) {
                let Imgs = res.data.data
                let homeImgs = [];
                Imgs.forEach(item => {
                    if (item.imgType == '2') {
                        homeImgs.push(item)
                    }
                })
                self.setData({
                    homeImgs
                })
            } else {
                console.log('图片数据获取失败！！')
            }
        })
    },
    //var newDate = new Date('2019/1/1 00:00:00')

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(res) {
        self.loginSuccess()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        // 清理定时器
        clearInterval(self.timer)
        clearInterval(self.timer1)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // 清理定时器
        clearInterval(self.timer)
        clearInterval(self.timer1)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        //self.getTimeInfo()
        if (getApp().globalData.isLogin == '1') {
            //self.getStatus()
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(e) {
        console.log(e)
            // 分享毕业证书
        if (e.target.dataset.diploma == "diploma") {
            self.setData({
                showPic: false,
                picUserName: ''
            })
            return {
                title: '伞亮灯场',
                path: '/pages/sanLiangDengChang/guide/guide'
            }
        }
        // 来自页面内转发按钮
        if (e.from === 'button') {
            console.log('按钮分享触发')
            self.setData({
                showModel: false,
                model: {
                    text: '',
                    openType: ''
                }
            })
            setTimeout(() => {
                self.shareAfter(e)
            }, 3000)
        }
        return {
            title: '伞亮灯场',
            path: '/pages/sanLiangDengChang/guide/guide'
        }
    },
    shareAfter(e) {
        if (e.target != undefined) { // 通过点击免费充电则下单
            if (getApp().globalData.ChargingFlag == 1) {
                wx.showModal({
                    title: '正在充电中...',
                    content: '本次充电完成后才能续费',
                    showCancel: false
                })
                return
            }

            let chargetime = getApp().globalData.FreeTime
            let chargefee = getApp().globalData.FreeFee
            console.log(getApp().globalData.DeviceSn, '免费设备码')

            let request = {
                "ShopId": getApp().globalData.wscShopId,
                "ChargeTime": chargetime,
                "ChargeFee": chargefee,
                "IsOpen": getApp().globalData.IsOpen,
                "IsQuick": getApp().globalData.IsQuick,
                "DeviceSn": getApp().globalData.DeviceSn
            }

            // 生成订单时禁止其他操作
            wx.showLoading({
                title: '正在生成订单',
                mask: true
            })
            wx.request({
                url: getApp().globalData.ajaxResetUrl + '/Sunshade/AddOrderInfo',
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'cookie': 'ASP.NET_SessionId=' + getApp().globalData.sessionId
                },
                data: {
                    request: JSON.stringify(request)
                },
                success(res) {
                    if (res.data.Code == '1') {
                        const orderId = res.data.Data

                        // 免费下单成功后放电 - 并执行动画
                        setTimeout(() => {
                            self.dischargeHandler(orderId, function() {
                                //self.getStatus()
                            }, function(res) {
                                getApp().globalData.DeviceSn = ''
                                wx.showModal({
                                    title: '温馨提示',
                                    content: res.data.Msg + '(' + res.data.Data + ')',
                                    showCancel: false
                                })
                            })
                        }, 3000)
                    } else {
                        wx.showModal({
                            title: '温馨提示',
                            content: res.data.Msg,
                            showCancel: false
                        })
                    }
                },
                complete() {
                    wx.hideLoading()
                }
            })
        }
    }
})