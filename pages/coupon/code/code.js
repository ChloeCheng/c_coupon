
import ajax from '../../../common/ajax.js';
import URL from '../../../common/api-list.js';
import {getUCode} from "../../../union-api/union-auth.js";
const router = require('../../../common/router.js');
import {parseWeChatQuery} from '../../../common/utils.js';
import PageEventFire from '../../../common/pageEventFire.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
       couponObj: {},
       codeImg: ''
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
    getDetail(id, code){    
        wx.showLoading();
        let self = this;
        return ajax.request((URL.coupon.detail + id), {}, function(data){
            wx.hideLoading();
    
            if(data.isSuccess === true){
                self.setData({
                    couponObj: data.data,
                    codeImg: URL.coupon.code + code,
                    code: code.replace(/\s/g,'').replace(/(.{4})/g,"$1 ")
                });
               
            }
           
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getServerConfig(); 
        let query = parseWeChatQuery(options)
        this.getDetail(query.id, query.code);
        // this.getInviteIncomeDetail();
        wx.hideShareMenu();
       
    },

    gotoDetail(){
        router.routeTo('/pages/coupon/detail/detail');
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
     * 用户滚动页面
     */
    onPageScroll({ scrollTop }){
       
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
        return {
           
        }
    }
})