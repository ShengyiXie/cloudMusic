import request from '../../utils/request'

// pages/personal/personal.js
let startY;//手指起始坐标
let moveY;//手指移动坐标
let moveDistance;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {},//用户信息
    recentPlayList: []//用户的播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      //更新userInfo的状态
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      //获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId);
    }


  },

  //获取用户播放记录的功能函数
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request('/user/record', { uid: userId, type: 0 })
    //手动定义唯一值
    let index = 0;
    let recentPlayList = recentPlayListData.allData.slice(0, 10).map(item => {
      item.id = index++;
      return item
    })
    this.setData({
      recentPlayList
    })
  },
  // 手指点击
  handleTouchStart(event) {
    //手指起始坐标,初始的值
    startY = event.touches[0].clientY;
    // 手指点击的时候先把过渡干掉，结束的时候再加上
    this.setData({
      coverTransition: ''
    })
  },
  // 手指移动
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    // 动态更新coverTransform的值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })

  },
  // 手指松开
  handleTouchEnd() {
    // 动态更新coverTransform的值
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'
    })
  },

  //跳转至登录Login页面的回调
  toLogin() {
    wx.navigateTo({
      url: '../login/login'
    })
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