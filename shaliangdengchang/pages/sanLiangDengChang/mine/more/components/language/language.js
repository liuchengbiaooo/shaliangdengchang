// pages/sanLiangDengChang/mine/more/components/language/language.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        language: [
            { id: 0, name: 'English' },
            { id: 1, name: '简体中文' },
            { id: 2, name: '繁体中文' }
        ],
        languageID: 0
    },
    radioLanguage(value) {
        let languageID = value.detail.value
        self.setData({
            languageID
        })
        console.log("value", value)
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