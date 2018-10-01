
import ajax from '../../common/ajax.js';
import URL from '../../common/api-list.js';
import {getUCode} from "../../union-api/union-auth.js";
const router = require('../../common/router.js');
import {parseWeChatQuery} from '../../common/utils.js';
import PageEventFire from '../../common/pageEventFire.js';
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
        list: [
            /*{
                childCouponItem:"免费券",
                circulation:100,
                couponCode:"0000001",
                couponDesc:"洗车券",
                couponImgURL:"/20180905/20180905142039205468789.jpg",
                couponInnerCode:"0000001",
                couponItem:"保养",
                couponName:"西侧全",
                couponType:"免费券",
                createdBy:"e4ef5855-eef9-4f44-8139-bc97960305d2",
                createdOn:"2018-09-05 14:20:26",
                customerPayPrice:0,
                expenseDesc:"好的",
                id:"f82d98a6-16c0-46d2-bbe5-8165021b8889",
                isAllWaiterShopUser:true,
                isPublish:true,
                lineNum:0,
                modifiedBy:"e4ef5855-eef9-4f44-8139-bc97960305d2",
                modifiedOn:"2018-09-05 14:49:42",
                remarks:null,
                settlementPrice:100,
                usedRange:"上海",
                usefulEndTime:"2018-09-26 00:00:00",
                usefulStartTime:"2018-09-12 00:00:00"
            }*/
        ],
        tabs: [
            {name: '全部',id: 'ALL', data: [], pageStart: 0, isEnd: false, loading: false},
            {name: '洗车',id: 'carWash', data: [], pageStart: 0, isEnd: false, loading: false},
            {name: '保养',id: 'carKeep', data: [], pageStart: 0, isEnd: false, loading: false}
        ],
        activeTabIndex: 0,
        hideDialog: false,
        itemArray: ['全部','洗车','保养'],   //项目
        itemArrayIndex: 0,
        typeArray: ['全部', '免费券', '代金券', '减免券'],  //分类
        typeArrayIndex: 0,
        isEnd: false,
        page: 0
    },
    gotoSearchSuggest(){
      router.routeTo('/pages/search/search');
    },
    gotoAddCoupon(){
      router.routeTo('/pages/coupon/add/add');
    },
    bindPickerChangeForItem(e){
        this.setData({
            itemArrayIndex: e.detail.value,
            list: [],
            page: 0,
            isEnd: false
        });
        this.getList();
    },

    bindPickerChangeForType(e){
        this.setData({
            typeArrayIndex: e.detail.value
        });

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

   /**
     * 洗车/保养/全部
     */
    getTabItemData(tabIndex){
        let tab = this.data.tabs[tabIndex];
        if(tab.loading) return Promise.resolve();
        // if(homeModel[tab.func]){
            let param = `?page=${tab.pageStart+1}&limit=20&couponitem=洗车`;
    
            tab.loading = true;
            // console.log(param)
            return ajax.request((URL.index.list+ '?' + param), {}, function(data){
                tab.loading = false;
                console.log(data);
            })
            
            /*[tab.func](param).then(({list, category})=>{
                tab.loading = false;
                let data = {},
                    tabStr = `activitiesModule.tabs[${tabIndex}]`;
                if(tab.id === 'rank' && !categoryIndex && category.length>0){
                    data[`${tabStr}.categoryList`] = category;
                    this.setData({
                        [`activitiesModule.tabs[${tabIndex}].categoryList`]:category
                    });
                }
                data[`${tabStr}.page`] = tab.page+1;
                data[`${tabStr}.data`] = tab.data.concat(list);
                if(list.length<20){
                    data[`${tabStr}.isEnd`] = true;
                    this.setData({
                        [`${tabStr}.isEnd`]:true
                    });

                }
                // this.setData(data);
                this.setData({
                    [`activitiesModule.tabs[${tabIndex}].activeCategoryIndex`]: categoryIndex || 0,
                    [`activitiesModule.tabs[${tabIndex}].page`]: tab.page+1,
                    [`activitiesModule.tabs[${tabIndex}].data`]: tab.data.concat(list)
                });
                return list;
            });*/
        // }
    },

    getList(pullDown){
        let param = `?page=${this.data.page+1}&limit=20${this.data.itemArrayIndex > 0 ? ('&couponitem=' + this.data.itemArray[this.data.itemArrayIndex]) : ''}`;
        wx.showLoading();
        let self = this;
        return ajax.request((URL.index.list + param), {}, function(data){
            wx.hideLoading();
            if(pullDown){
                wx.stopPullDownRefresh();
            }
            if(data.isSuccess === true){
                if(data.data.length < 20){
                    self.setData({
                        isEnd: true
                    }); 
                }
                self.setData({
                    page: self.data.page + 1,
                    list: self.data.list.concat(data.data)
                });
               return self.data.list;
            }
           
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getServerConfig(); 
        let query = parseWeChatQuery(options)
        // wx.hideShareMenu();
        
       
    },

    updateInfo(){
        autoLogin().then(data => {
            if(data.login) {
                this.getList();
            }
            
        })
        this.setData({
            hideDialog: false
        });
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
                this.getList();
            }
            
        })
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
      PageEventFire.fire('page-scroll', scrollTop);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            itemArrayIndex: 0,
            typeArrayIndex: 0,
            page: 0,
            list: []
        });
        this.getList(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            imageUrl: 'https://a.vpimg3.com/upload/vtd/creatives/20180428/imageuploadrandom/1524888203054.jpg',
            title: '[有人@我]海量优惠券，了解下~',
            path: '/pages/index/index'
        }
    }
})