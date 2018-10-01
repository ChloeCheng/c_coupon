
import ajax from '../../common/ajax.js';
import {getUCode} from "../../union-api/union-auth.js";
const router = require('../../common/router.js');
import {parseWeChatQuery} from '../../common/utils.js';
import PageEventFire from '../../common/pageEventFire.js';
import throttle from '../../common/lodash.throttle.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword:'',
        list: [{
            name: '10元红包10元红包10元红包10元红包10元红包10元红包10元红包',
            shareTitle: '分享title',
            wxSmallProPicUrl: '',
            vivaUrl:'https://mst.vip.com/uploadfiles/exclusive_subject/te/v1/CtmEw6Z2kMA64toVh6R6qQ.php',
            couponField: '全场券',
            amount: '20',
            useCondition: '满100元减20.5元满100元减20.5元满100元减20.5元满100元减20.5元满100元减20.5元',
            leftNum: 20,
            showType: 1, // 1:单张券, 2:组合券
            couponNum: 3,
            proReason: '购买蓝月亮洗衣液券后价28元，全网最低购买蓝月亮洗衣液券后价28元，全网最低'
         },
         {
            name: '唯品会新人大礼包',
            shareTitle: '分享title',
            wxSmallProPicUrl: '',
            vivaUrl:'https://viva.vip.com/XRJ_jaOJuwGJ4GCg4jNIIQ.html?wapid=vivap_9786',
            couponField: '全场券',
            amount: '99999',
            useCondition: '满100元减20.5元',
            leftNum: 0,
            showType: 2, // 1:单张券, 2:组合券
            couponNum: 3,
            proReason: '购买蓝月亮洗衣液券后价28元，全网最低'
         },
         {
            name: '10元红包',
            shareTitle: '分享title',
            wxSmallProPicUrl: '',
            vivaUrl:'https://viva.vip.com/XRJ_jaOJuwGJ4GCg4jNIIQ.html?wapid=vivap_9786',
            couponField: '全场券',
            amount: '9999',
            useCondition: '满100元减20.5元',
            leftNum: 20,
            showType: 1, // 1:单张券, 2:组合券
            couponNum: 3,
            proReason: '购买蓝月亮洗衣液券后价28元，全网最低'
         },
         {
            name: '10元红包',
            shareTitle: '分享title',
            wxSmallProPicUrl: '',
            vivaUrl:'https://viva.vip.com/XRJ_jaOJuwGJ4GCg4jNIIQ.html?wapid=vivap_9786',
            couponField: '全场券',
            amount: '688',
            useCondition: '满100元减20.5元',
            leftNum: 20,
            showType: 1, // 1:单张券, 2:组合券
            couponNum: 3,
            proReason: '购买蓝月亮洗衣液券后价28元，全网最低'
         },
         {
          name: '10元红包10元红包10元红包10元红包10元红包10元红包10元红包',
          shareTitle: '分享title',
          wxSmallProPicUrl: '',
          vivaUrl:'https://mst.vip.com/uploadfiles/exclusive_subject/te/v1/CtmEw6Z2kMA64toVh6R6qQ.php',
          couponField: '全场券',
          amount: '20',
          useCondition: '满100元减20.5元满100元减20.5元满100元减20.5元满100元减20.5元满100元减20.5元',
          leftNum: 20,
          showType: 1, // 1:单张券, 2:组合券
          couponNum: 3,
          proReason: '购买蓝月亮洗衣液券后价28元，全网最低购买蓝月亮洗衣液券后价28元，全网最低'
       },
       {
          name: '唯品会新人大礼包',
          shareTitle: '分享title',
          wxSmallProPicUrl: '',
          vivaUrl:'https://viva.vip.com/XRJ_jaOJuwGJ4GCg4jNIIQ.html?wapid=vivap_9786',
          couponField: '全场券',
          amount: '99999',
          useCondition: '满100元减20.5元',
          leftNum: 0,
          showType: 2, // 1:单张券, 2:组合券
          couponNum: 3,
          proReason: '购买蓝月亮洗衣液券后价28元，全网最低'
       },
       {
          name: '10元红包',
          shareTitle: '分享title',
          wxSmallProPicUrl: '',
          vivaUrl:'https://viva.vip.com/XRJ_jaOJuwGJ4GCg4jNIIQ.html?wapid=vivap_9786',
          couponField: '全场券',
          amount: '9999',
          useCondition: '满100元减20.5元',
          leftNum: 20,
          showType: 1, // 1:单张券, 2:组合券
          couponNum: 3,
          proReason: '购买蓝月亮洗衣液券后价28元，全网最低'
       },
       {
          name: '10元红包',
          shareTitle: '分享title',
          wxSmallProPicUrl: '',
          vivaUrl:'https://viva.vip.com/XRJ_jaOJuwGJ4GCg4jNIIQ.html?wapid=vivap_9786',
          couponField: '全场券',
          amount: '688',
          useCondition: '满100元减20.5元',
          leftNum: 20,
          showType: 1, // 1:单张券, 2:组合券
          couponNum: 3,
          proReason: '购买蓝月亮洗衣液券后价28元，全网最低'
       }],
        activeTabIndex: 0,
        supervisorInfo: false
    },
   /**
     * 监听搜索输入
     */
    searchInput: throttle(function (e) {
        const keyword = e.detail.value;
        if (keyword) {
            this.setData({keyword});
        } else {
            this.setData({
                keyword: ''
            });
        }
    }, 500),

    /**
     * 
     */
    onSearch(){

    },

    getServerConfig(){
        let app = getApp();
        API.get('user.serverConfig', {
            platform: 'ios',
            appversion: app.globalData.version
        }).then(data=>{
            if(data && data.data){
                this.setData({
                    headImage: data.data.newVerInviteBannerUrl
                });
            }
        });
    },
    handleTabChange({detail}){
        let {tab, index} = detail;
        if(tab.data.length===0){
            // this.getTabItemData(index);
        }
        this.setData({
            'activeTabIndex': index
        });
        // console.log(index)
    },
    handleDoubtTap(){
        wx.showModal({
            content: '1、被邀请的好友自动加入你的团队成为你的队员\r\n2、队员每推广一单，您将额外获得此单收益的10%（您的等级越高，比例越高），队员的收益不受影响\r\n3、自2018年6月14日0点之后的订单才贡献团队收益',
            showCancel: false
        });
    },

    getInviteIncomeDetail(){
        API.get('income.inviteIncomeDetail').then(data=>{
            if(data && data.data){
                this.setData({
                    [`tabs[${this.data.activeTabIndex}].data`]: data.data,
                    dataResponse: true,
                    noData: data.data.length > 0 ? false : true
                });
            }
        })
    },
     /**
     * 点击：队员详情
     */
    onTeamMemberDetailTap (e) {
        let {currentTarget:{dataset:{item}}} = e;
        router.routeTo('fulishe/pages/special/special', {
          url: encodeURIComponent('https://wxk.vip.com/team_member?userId=' + item.invitedUserId)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getServerConfig(); 
        let query = parseWeChatQuery(options)
       
        // this.getInviteIncomeDetail();
        wx.hideShareMenu();
       
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
     * 用户滚动页面
     */
    onPageScroll({ scrollTop }){
      // PageEventFire.fire('page-scroll', scrollTop);
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
        return {
            imageUrl: 'https://a.vpimg3.com/upload/vtd/creatives/20180428/imageuploadrandom/1524888203054.jpg',
            title: '[有人@我]我发现了个免费开店赚钱机会！你赶紧了解下~',
            path: '/pages/setup/setup?ucode='+getUCode()
        }
    }
})