import Vue from 'vue'
import Router from 'vue-router'
import api from '../utils/api';
import Login from '@/components/pages/Login';

import reset from '@/components/pages/Reset';


Vue.use(Router)

function requireAuth(to, from, next) {
    if (api.getToken())
        next();
    else
        next('/login');
}
export default new Router({
    routes: [{
            path: '/Login',
            component: Login
        },

        {
            path: '/reset',
            component: reset
        },
        {
            path: '/',
            component: h =>
                import ('@/components/pages/Layout.vue'),
            redirect: '/businessmanage',
            beforeEnter: requireAuth,
            children: [

                // 商户管理
                {
                    path: 'businessmanage',
                    component: h =>
                        import ('@/components/pages/business_manage/BusinessManage.vue'),
                    redirect: '/businessmanage/business',
                    children: [
                        // 商户概况
                        {
                            path: 'business',
                            component: h =>
                                import ('@/components/pages/business_manage/business/Business'),
                            redirect: '/businessmanage/business/profile',
                            children: [{
                                    path: 'profile',
                                    component: h =>
                                        import ('@/components/pages/business_manage/business/profile')
                                },
                                {
                                    path: 'detail',
                                    component: h =>
                                        import ('@/components/pages/business_manage/business/detail')
                                },
                                {
                                    path: 'add',
                                    component: h =>
                                        import ('@/components/pages/business_manage/business/Add')
                                },
                                {
                                    path: 'edit',
                                    component: h =>
                                        import ('@/components/pages/business_manage/business/edit')
                                },
                            ]
                        },

                        {
                            path: 'authentication',
                            component: h =>
                                import ('@/components/pages/business_manage/authentication/Business'),
                            redirect: '/businessmanage/authentication/index',
                            children: [{
                                    path: 'index',
                                    component: h =>
                                        import ('@/components/pages/business_manage/authentication/Authentication')
                                }, {
                                    path: 'certification',
                                    component: h =>
                                        import ('@/components/pages/business_manage/authentication/CertificationForm'),
                                }

                            ]
                        },

                    ]
                },
                // 系统管理
                {
                    path: 'systemmanage',
                    component: h =>
                        import ('@/components/pages/system_manage/SystemManage.vue'),
                    redirect: '/systemmanage/system',
                    children: [
                        // 平台概况
                        {
                            path: 'system',
                            component: h =>
                                import ('@/components/pages/system_manage/system/profile'),
                        },
                        // 控制中心
                        {
                            path: 'control',
                            component: h =>
                                import ('@/components/pages/system_manage/control/Control'),
                        },
                        // 团队管理
                        {
                            path: 'team',
                            component: h =>
                                import ('@/components/pages/system_manage/team/RouterBox'),
                            redirect: '/systemmanage/team/list',
                            children: [{
                                    path: 'list',
                                    component: h =>
                                        import ('@/components/pages/system_manage/team/team'),
                                    redirect: '/systemmanage/team/list/user',
                                    children: [{
                                            path: 'user',
                                            component: h =>
                                                import ('@/components/pages/system_manage/team/User')
                                        }, {
                                            path: 'role',
                                            component: h =>
                                                import ('@/components/pages/system_manage/team/Role'),
                                        },

                                    ],

                                },
                                {
                                    path: 'user_form',
                                    component: h =>
                                        import ('@/components/pages/system_manage/team/userForm'),
                                },
                                {
                                    path: 'role_form',
                                    component: h =>
                                        import ('@/components/pages/system_manage/team/RoleForm'),
                                },
                            ]

                        },
                        // 分类管理

                        {
                            path: 'class',
                            component: h =>
                                import ('@/components/pages/system_manage/class/class'),
                        },
                        // 帮助管理
                        {
                            path: 'help1',
                            component: h =>
                                import ('@/components/pages/system_manage/help/RouterBox'),
                            redirect: '/systemmanage/help1/list',
                            children: [{
                                    path: 'list',
                                    component: h =>
                                        import ('@/components/pages/system_manage/help/List')
                                },
                                {
                                    path: 'help_form',
                                    component: h =>
                                        import ('@/components/pages/system_manage/help/HelpForm')
                                }
                            ]
                        },
                        // 客服

                        {
                            path: 'customer',
                            component: h =>
                                import ('@/components/pages/system_manage/customer/customer'),
                        },
                    ]
                }
            ]
        },
        {
            path: '/test',
            component: h =>
                import ('@/components/pages/test')
        }
    ]
})