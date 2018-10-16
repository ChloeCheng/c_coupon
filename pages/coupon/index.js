
import ajax from '../../common/ajax.js';
import URL from '../../common/api-list.js';
import {getUCode} from "../../union-api/union-auth.js";
const router = require('../../common/router.js');
import {parseWeChatQuery} from '../../common/utils.js';
import PageEventFire from '../../common/pageEventFire.js';
const storage = require('../../common/storage.js')
import {autoLogin} from '../../common/login.js';
const formatTime = require('../../common/formatTime.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
       useBtn: false, //立即使用按钮
       couponObj: {},   // 券详情
       hideDialog: false,
       atOnceGet: false,    // 立即领取
    },

    updateInfo(){
        autoLogin().then(data => {
            if(data.login) {
                this.getDetail(query.id);
            }
            
        })
        this.setData({
            hideDialog: false
        });
    },

  
    getCoupon(){
        
        let userid = storage.get('userId');
       
        let self = this;
        return ajax.request((URL.coupon.get + userid + '/' + this.data.couponObj.id), {}, function(data){

            if(data.isSuccess === true){
                wx.showToast({
                    title: '领取成功',
                    icon: 'success',
                    duration: 1500
                });
        
            } else {
                wx.showToast({
                    title: '你已经领取过，可不能贪心哟～',
                    icon: "none",
                    duration: 1500
                }); 

            }

            setTimeout(function(){
                wx.switchTab({
                    url: '/pages/user/user'
                })
            }, 1500)
           
        })

    },
    getDetail(id){
        
        wx.showLoading();
        let self = this;
        return ajax.request((URL.coupon.detail + id), {}, function(data){
            wx.hideLoading();
    
            if(data.isSuccess === true){
                let obj = data.data;
                obj.usefulStartTime = obj.usefulStartTime.split(' ')[0]; //formatTime.formatTime(new Date(obj.usefulStartTime));
                obj.usefulEndTime = obj.usefulEndTime.split(' ')[0]; //formatTime.formatTime(new Date(obj.usefulEndTime));

                self.setData({
                    couponObj: obj
                });

                if(self.data.atOnceGet){
                    self.getCoupon();
                }
               
            }
           
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getServerConfig(); 
        let query = parseWeChatQuery(options);
       
        // this.getInviteIncomeDetail();
        wx.hideShareMenu();
        
        
        this.setData({
            useBtn: (query.use === 'true' ? true : false),
            atOnceGet: (query.get === 'true' ? true : false)
        })

        autoLogin().then(data => {
            if(data.login) {
                this.getDetail(query.id);
            }
        })
       
    },

    gotoDetail(){
        router.routeTo('/pages/coupon/detail/detail');
    },

    gotoCode(){
        router.routeTo('/pages/coupon/code/code?id=' + this.data.couponObj.id);
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