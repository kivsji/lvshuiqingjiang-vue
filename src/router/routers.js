import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
      notCache: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'power',
    component: Main,
    redirect: '/activeManage/active',
    meta: {
      icon: 'ios-apps'
    },
    children: [{
        path: 'menu',
        name: 'menu',
        meta: {
          title: '菜单设置',
          icon: 'ios-construct-outline'
        },
        component: () => import('@/view/lvshuiqingjiang/menu/menu.vue')
      }, {
        path: 'coupons',
        name: 'coupons',
        meta: {
          title: '奖券管理',
          icon: 'ios-card'
        },
        children: [{
          path: 'couponsList',
          name: 'couponsList',
          meta: {
            title: '奖券列表',
            icon: 'ios-browsers-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/coupons/couponsList.vue')
        }, {
          path: 'couponsRecords',
          name: 'couponsRecords',
          meta: {
            title: '奖券持有',
            icon: 'ios-browsers-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/coupons/couponsRecords.vue')
        }],
        component: () => import('@/view/lvshuiqingjiang/coupons/coupons.vue')
      }, {
        path: 'activeManage',
        name: 'activeManage',
        meta: {
          title: '活动管理',
          icon: 'ios-browsers-outline'
        },
        children: [{
          path: 'active',
          name: 'active',
          meta: {
            title: '一般活动',
            icon: 'ios-browsers-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/active/active.vue')
        }, {
          path: 'lotteryActive',
          name: 'lotteryActive',
          meta: {
            title: '抽奖活动',
            icon: 'ios-browsers-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/active/lotteryActive.vue')
        }, {
          path: 'customActive',
          name: 'customActive',
          meta: {
            title: '个性定制',
            icon: 'ios-browsers-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/active/activeDetail.vue')
        }, {
          path: 'activeShare',
          name: 'activeShare',
          meta: {
            title: '活动分享',
            icon: 'ios-browsers-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/active/activeShare.vue')
        }],
        component: () => import('@/view/lvshuiqingjiang/active/activeManage.vue')
      },
      {
        path: 'vip',
        name: 'vip',
        meta: {
          title: 'vip管理',
          icon: 'ios-person'
        },
        children: [{
          path: '/vipList',
          name: 'vipList',
          meta: {
            title: 'VIP列表',
            icon: 'ios-list-box-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/vip/vipList.vue')
        }, {
          path: '/vipSet',
          name: 'vipSet',
          meta: {
            title: 'VIP设置',
            icon: 'ios-settings-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/vip/vipSet.vue')
        }, {
          path: '/vipGroup',
          name: 'vipGroup',
          meta: {
            title: 'VIP等级',
            icon: 'ios-star-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/vip/vipGroup.vue')
        }, {
          path: '/vipMoney',
          name: 'vipMoney',
          meta: {
            title: 'VIP充值设置',
            icon: 'logo-yen'
          },
          component: () => import('@/view/lvshuiqingjiang/vip/vipMoney.vue')
        }, {
          path: '/vipTag',
          name: 'vipTag',
          meta: {
            title: 'VIP标签',
            icon: 'ios-pricetag-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/vip/vipTag.vue')
        }],
        component: () => import('@/view/lvshuiqingjiang/vip/vip.vue')
      }, {
        path: 'shop',
        name: 'shop',
        meta: {
          title: '商城管理',
          icon: 'ios-cart-outline'
        },
        children: [{
          path: '/shopType',
          name: 'shopType',
          meta: {
            title: '产品分类',
            icon: 'ios-apps-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/shop/shopType.vue')
        }, {
          path: '/shopDefail',
          name: 'shopDefail',
          meta: {
            title: '产品列表',
            icon: 'ios-cube-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/shop/shopDefail.vue')
        }, {
          path: '/shopSwipe',
          name: 'shopSwipe',
          meta: {
            title: '商城轮播',
            icon: 'ios-cube-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/shop/shopSwipe.vue')
        }, {
          path: '/shopSet',
          name: 'shopSet',
          meta: {
            title: '商城设置',
            icon: 'ios-apps-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/shop/shopSet.vue')
        }, {
          path: '/shopOrder',
          name: 'shopOrder',
          meta: {
            title: '订单列表',
            icon: 'ios-apps-outline'
          },
          component: () => import('@/view/lvshuiqingjiang/shop/shopOrder.vue')
        }],
        component: () => import('@/view/lvshuiqingjiang/shop/shop.vue')
      }, {
        path: 'ticket',
        name: 'ticket',
        meta: {
            title: '门票管理',
            icon: 'ios-pricetag-outline'
        },
        children: [{
            path: '/ticketlist',
            name: 'ticketlist',
            meta: {
                title: '门票列表',
                icon: 'ios-apps-outline'
            },
            component: () => import('@/view/lvshuiqingjiang/ticket/ticketList.vue')
        },{
            path: '/ticketOrder',
            name: 'ticketOrder',
            meta: {
                title: '门票订单',
                icon: 'ios-apps-outline'
            },
            component: () => import('@/view/lvshuiqingjiang/ticket/ticketOrder.vue')
        }],
        component: () => import('@/view/lvshuiqingjiang/ticket/ticket.vue')
      }
    //   {
    //     path: 'order',
    //     name: 'order',
    //     meta: {
    //       title: '订单管理',
    //       icon: 'ios-cart-outline'
    //     },
    //     component: () => import('@/view/lvshuiqingjiang/order/order.vue'),
    //     children: [{
    //       path: '/orderList',
    //       name: 'orderList',
    //       meta: {
    //         title: '订单列表',
    //         icon: 'ios-apps-outline'
    //       },
    //       component: () => import('@/view/lvshuiqingjiang/order/orderList.vue')
    //     }]
    //   }
    ],
  }, {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
