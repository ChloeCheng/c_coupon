
import ajax from '../../common/ajax.js';
import URL from '../../common/api-list.js';
import {getUCode} from "../../union-api/union-auth.js";
const router = require('../../common/router.js');
import {parseWeChatQuery} from '../../common/utils.js';
import PageEventFire from '../../common/pageEventFire.js';
import storage from '../../common/storage.js';
import {autoLogin} from '../../common/login.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headImage: '',
        detail: [],
        noData: false,
        dataResponse: false,
        tabs: [
            {name: '有效',status: 0, id:'valid', data: [], page: 0, isEnd: false, loading: false},
            {name: '已使用',status: -1, id:'used', data: [], page: 0, isEnd: false, loading: false},
            {name: '已过期',status: 99, id:'overtime', data: [], page: 0, isEnd: false, loading: false}
        ],
        activeTabIndex: 0,
        hideDialog: false
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
    updateInfo(){
        autoLogin().then(data => {
            if(data.login) {
                this.getTabItemData(this.data.activeTabIndex);
            }
            
        })
        this.setData({
            hideDialog: false
        });
    },

    gotoAddCoupon(){
        router.routeTo('/pages/coupon/add/add');
    },
    handleTabChange({detail}){
        let {tab, index} = detail;
        this.setData({
            'activeTabIndex': index
        });
        if(tab.data.length===0){
            this.getTabItemData(index);
        }
       
        // console.log(index)
    },
    /**
     * 有效/过期/已使用
     */
    getTabItemData(tabIndex){
        let tab = this.data.tabs[tabIndex];
        let self = this;
        if(tab.loading) return Promise.resolve();
        let param = {
            userId: storage.get('userId'),
            page: tab.page+1,
            limit: 20,
            status : tab.status
        } 
           
        tab.loading = true;
        // console.log(param)
        return ajax.request((URL.user.list), param, function(data){
            tab.loading = false;
            // console.log(data);
            let tmp = {},tabStr = `tabs[${tabIndex}]`;
            // data[`${tabStr}.page`] = tab.page+1;
            // data[`${tabStr}.data`] = tab.data.concat(data.data);
            if(data.data.length<20){
                data[`${tabStr}.isEnd`] = true;
                self.setData({
                    [`${tabStr}.isEnd`]:true
                });

            }
            // this.setData(data);
            
            self.setData({
                [`tabs[${tabIndex}].page`]: tab.page+1,
                [`tabs[${tabIndex}].data`]: tab.data.concat(data.data)
            });
            // console.log(tabIndex)
            console.log(self.data.tabs)
            return data.data;
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
        this.setData({
            hideDialog: getApp().globalData.authSettingUserInfo
        })
        autoLogin().then(data => {
            if(data.login) {
                this.getTabItemData(this.data.activeTabIndex);
            }
            
        })
    },
    /**
     * 用户滚动页面
     */
    onPageScroll({ scrollTop }){
        PageEventFire.fire('page-scroll', scrollTop);
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
            imageUrl: 'https://a.vpimg3.com/upload/vtd/creatives/20180428/imageuploadrandom/1524888203054.jpg',
            title: '[有人@我]我发现了个免费开店赚钱机会！你赶紧了解下~',
            path: '/pages/setup/setup?ucode='+getUCode()
        }
    }
})