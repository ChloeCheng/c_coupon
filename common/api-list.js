let URL = {
    index: {
        list1: 'https://z.mln.ren/api/coupon/list',
        list: 'https://z.mln.ren/api/coupon/front/pc/listbyitem'
    },
    coupon: {
        detail: 'https://z.mln.ren/api/coupon/front/detail/',
        get: 'https://z.mln.ren/api/couponGiveOutRecord/front/receive/',
        add: 'https://z.mln.ren/api/couponGiveOutRecord/front/inputcode/',
    },
    user: {
        list: 'https://z.mln.ren/api/couponGiveOutRecord/front/mycouponrecord',
        login: 'https://z.mln.ren/api/personalCustomer/front/getoradd',
        findunionid: 'https://z.mln.ren/api/wechat/findunionid',
    }
}

export default URL;