// pages/sanLiangDengChang/mine/help/help.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        helpDate: [
            { id: 0, header: '1小伞充电是否安全?', text: '设备采用安全电流，且只能传输电力，并不支持数据传输，因此无法获取任何手机信息，100%安全。', isShow: false, icon: 'up' },
            { id: 1, header: '2扫码付款了,插上却无法给手机充电', text: '数据线损坏或者答设备当前网络信号差，5分钟内可在[留言页]填写资料，可联系客服退款', isShow: false, icon: 'up' },
            { id: 2, header: '3可以同时充几台手机', text: '可支持多台设备同时充电', isShow: false, icon: 'up' },
            { id: 3, header: '4小伞充电租借如何计费', text: '从小伞数据线亮灯开始计算租赁时间，点击归还小伞充电结束。没有归还就会继续产生租赁费用，充好电请及时点击归还，方便他人使用。前5分钟免费，超出5分钟按小时数计算，不同区域计费规则不同，以实际为准。', isShow: false, icon: 'up' },
            { id: 4, header: '5小伞充电支持哪些手机类型', text: '小伞充电自带三合一接口充电线，能支持安卓手机、苹果5/6及以上机型和Tpye-c手机。', isShow: false, icon: 'up' },
            { id: 5, header: '6小伞充电是否支持快充', text: '支持，小伞充电可以根据插入的设备，自动识别是否进行快充，充电速度吧一般的充电器快一倍不止，且具有多重保护功能，可以不损伤手机电池的情况下达到最快的充电速度。', isShow: false, icon: 'up' }
        ]
    },

    helpClik(e) {
        let ID = e.currentTarget.id
        let helpDate = this.data.helpDate;
        var show = !e.currentTarget.dataset.show;
        var mText = 'helpDate[' + ID + '].isShow';
        var mIcon = 'helpDate[' + ID + '].icon';
        this.setData({
            [mText]: show
        })
    },

    // 拨号
    linkFun() {
        wx.makePhoneCall({
            phoneNumber: '400-108-1806',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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