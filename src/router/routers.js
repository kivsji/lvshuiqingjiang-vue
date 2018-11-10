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

export default [
    {
        path: '/pp',
        name: 'pp',
        meta: {
            hideInMenu: true
        },
        redirect: '/login'
    },{
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/login.vue')
    },
    {
        path: '/',
        name: 'home',
        redirect: '/pzhanAll/picManage',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true,
            icon: 'md-home'
        },
    },
    {
        path: '/pzhanAll',
        name: '功能',
        component: Main,
        meta: {
            icon: 'ios-paper-outline'
        },
        children: [
            {
                path: 'picManage',
                name: '图片管理',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/picManage/picManage.vue')
            }, {
                path: 'picTag',
                name: '图片标签管理',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/picTag/picTag.vue')
            },{
                path: 'dayRec',
                name: '每日推荐',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/dayRec/dayRec.vue')
            },{
                path: 'topic',
                name: '专题',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/topic/topic.vue')
            }, {
                path: 'lunbo',
                name: '轮播图管理',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/lunbo/lunbo.vue')
            }, {
                path: 'community',
                name: '社区',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/community/community.vue')
            }, {
                path: 'userManage',
                name: '用户管理',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/userManage/userManage.vue')
            },{
                path: 'comment',
                name: '评论管理',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/comment/comment.vue')
            },{
                path: 'report',
                name: '举报',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/report/report.vue')
            },{
                path: 'blackList',
                name: '黑名单',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/blackList/blackList.vue')
            }, {
                path: 'signIn',
                name: '登录奖励',
                meta: {
                    icon: 'ios-paper-outline'
                },
                component: () => import('@/view/pzhanAll/signIn/signIn.vue')
            }
        ]
    },
    {
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
