import util from '../libs/util'
import { updatePaswd } from 'biyi-admin'

/**
 * 配置静态路由
 * 分为两种路由：
 * 1.路由出口在App.vue
 * 2.路由出口在main.vue
 * 注意：为避免不必要的错误，每个路由需设置name属性！！！
 * 注意：为避免不必要的错误，每个路由需设置name属性！！！
 * 注意：为避免不必要的错误，每个路由需设置name属性！！！
 */

// 1.路由出口在App.vue
const singleRoutes = [
    {
    // 设置初始页面
        path: '',
        redirect: '/subDataset'
    },
    // {
    //     path: '/projectDetails/',
    //     name: 'projectDetails',
    //     component: () => import('../views/project-management/projectDetails')
    // },
    {
        path: '/applicationResultDetail/',
        name: 'applicationResultDetail',
        component: () => import('../views/application-management/components/applicationResultDetail')
    },
    // {
    //     path: '/Invitation-information/',
    //     name: 'Invitation-information',
    //     component: () => import('../views/project-management/components/Invitation-information')
    // },
    // {
    //     path: '/metadata-configuration/',
    //     name: 'metadata-configuration',
    //     component: () => import('../views/child-data-preparation/metadata-configuration')
    // },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/system-page/login/login.vue'),
        meta: {
            // 密码规则校验开关
            validatePaswd: true
        }
    },
    // {
    //     path: '/register',
    //     name: 'register',
    //     component: () => import('../views/system-page/register/index.vue')
    // },
    // {
    //     path: '/RegisterSuccess',
    //     name: 'RegisterSuccess',
    //     component: () => import('../views/system-page/register/register-success.vue')
    // },
    {
        path: '/update-password',
        name: 'update-password',
        component: updatePaswd
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/error-pages/404.vue')
    },
]
/**
 * 路由出口在main.vue，包括了菜单项和非菜单页面
 * 若该页面属于菜单页面，需要添加type: 'menu'属性
 */
const staticTree = [
    // 联邦学习平台
    // {
    //     path: '/main-console',
    //     name: 'main-console',
    //     title: '联邦学习平台',
    //     icon: 'ios-paper',
    //     type: 'menu',
    //     component: () => import('../views/main/main.vue'),
    //     children: [
    //         {
    //             path: '/home',
    //             name: 'home',
    //             title: '联邦学习平台',
    //             icon: 'ios-paper',
    //             type: 'menu',
    //             component: () => import('../views/form-demo/index.vue')
    //         }
    //     ]
    // },
    // 数据准备
    {
        path: '/main-console',
        name: 'main-console',
        title: '数据准备',
        icon: 'ios-paper',
        type: 'menu',
        component: () => import('../views/main/main.vue'),
        children: [
            {
                path: '/subDataset',
                name: 'subDataset',
                title: '边缘节点数据集',
                icon: 'ios-paper',
                type: 'menu',
                component: () => import('../views/dataPreparation/sub-dataset/subDataset.vue'),
                children: [
                    {
                        path: '/metaConfig',
                        name: 'metaConfig',
                        title: '元数据配置',
                        icon: 'ios-paper',
                        type: 'non-menu',
                        component: () => import('../views/dataPreparation/sub-dataset/metaConfig.vue')
                    },
                    {
                        path: '/metaDetails',
                        name: 'metaDetails',
                        title: '元数据详情',
                        icon: 'ios-paper',
                        type: 'non-menu',
                        component: () => import('../views/dataPreparation/central-dataset/metaDetails.vue')
                    }
                ]
            }
        ]
    },
    
]
const staticMenuList = util.getMenuList(staticTree)
const staticMainRoutes = util.getMenuRoutes(staticTree)

// 汇总所有的路由
const staticRoutes = [...staticMainRoutes, ...singleRoutes]

export { staticRoutes, staticMenuList, staticTree }
