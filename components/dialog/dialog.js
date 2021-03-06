// pages/shopstore/shop-tab/union-tab.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        hideDialog:{
            type: Boolean,
            value: false,
            observer: function(newValue, oldValue){
                console.log(newValue)
                this._hideDialogFun(newValue);
            } //'_hideDialogFun'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        authorizeUserInfo: true
    },

    ready(){
        let _this = this;
        
        wx.getSetting({
        success(res) {
            if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                success: function(res) {
                    // console.log(res)
                    // getApp().global.wxUserInfo = res.userInfo;
                    // _this.triggerEvent('info')  //写上通用在
                }
                })
                getApp().globalData.authSettingUserInfo = true;
            } else {
                _this.setData({
                'authorizeUserInfo': false
                });
            }
        },
        fail: function(err){
            console.log('checkAuth fail!!!!')
        }
     })

    },

    /**
     * 组件的方法列表
     */
    methods: {
        _hideDialogFun: function(newValue){
            this.setData({
                'authorizeUserInfo': !newValue
            });
        },
        getuserinfo: function(e){
            let _this = this;
            let detail = e.detail;
        
            if (detail.errMsg == 'getUserInfo:ok') {
              this.setData({
                'authorizeUserInfo': true
              }); 
              getApp().globalData.authSettingUserInfo = true;
              wx.getUserInfo({
                success: function(res) {
                    // console.log(res)
                  // getApp().global.wxUserInfo = res.userInfo;
                  _this.triggerEvent('info')
                }
              })    
            }
          },
          _hideDialogFun: function(){
            console.log(this.properties.hideDialog)
            if(this.properties.hideDialog){
                this.setData({
                    'authorizeUserInfo': true
                }); 
            }
          }
    }
})
