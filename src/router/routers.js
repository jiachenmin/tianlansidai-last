import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
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
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '孩子管理',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/system_configs',
    name: 'system_configs',
    meta: {
      icon: 'ios-cog',
      title: '系统配置'
    },
    component: Main,
    children: [
      {
        path: 'user_center',
        name: 'user_center',
        meta: {
          icon: 'ios-people',
          title: '用户中心'
        },
        component: () => import('@/pages/system-configs/user-center')
      },
      {
        path: 'data_centers',
        name: 'data_centers',
        meta: {
          icon: 'ios-cog',
          title: '资源中心'
        },
        component: () => import('@/pages/system-configs/data-center')
      },
      {
        path: 'power-center',
        name: 'power-center',
        meta: {
          icon: 'ios-lock',
          title: '权限中心'
        },
        component: () => import('@/pages/system-configs/power-center')
      },
      {
        path: 'root-center',
        name: 'root-center',
        meta: {
          icon: 'ios-folder',
          title: '元数据中心'
        },
        component: () => import('@/pages/system-configs/root-center')
      }
    ]
  },
  {
    path: '/application_center',
    name: 'application_center',
    meta: {
      icon: 'md-analytics',
      title: '业务配置'
    },
    component: Main,
    children: [
      {
        path: 'deployment_center',
        name: 'deployment_center',
        meta: {
          icon: 'ios-list-box',
          title: '运营区域管理'
        },
        component: () => import('@/pages/application-center/deployment-center')
      },
      {
        path: 'monitoring_center',
        name: 'monitoring_center',
        meta: {
          icon: 'ios-medical',
          title: '体验项目管理'
        },
        component: () => import('@/pages/application-center/monitoring-center')
      },
      {
        path: 'questionnaire-management',
        name: 'questionnaire-management',
        meta: {
          icon: 'ios-paper',
          title: '调查问卷管理'
        },
        component: () => import('@/pages/application-center/questionnaire-management')
      },
      {
        path: 'intervention-plan',
        name: 'intervention-plan',
        meta: {
          icon: 'md-archive',
          title: '干预方案管理'
        },
        component: () => import('@/pages/application-center/intervention-plan')
      },
      {
        path: 'coupon-management',
        name: 'coupon-management',
        meta: {
          icon: 'md-pricetags',
          title: '优惠卷管理'
        },
        component: () => import('@/pages/application-center/coupon-management')
      }
    ]
  },
  {
    path: '/daily-operation',
    name: 'daily-operation',
    meta: {
      icon: 'md-aperture',
      title: '日常运营'
    },
    component: Main,
    children: [
      {
        path: 'school',
        name: 'school',
        meta: {
          icon: 'ios-book',
          title: '学校管理'
        },
        component: () => import('@/pages/daily-operation/school')
      },
      {
        path: 'hospital',
        name: 'hospital',
        meta: {
          icon: 'ios-heart',
          title: '医院管理'
        },
        component: () => import('@/pages/daily-operation/hospital')
      },
      {
        path: 'children',
        name: 'children',
        meta: {
          icon: 'ios-people',
          title: '孩子管理'
        },
        component: () => import('@/pages/daily-operation/children')
      },
      {
        path: 'commissioner',
        name: 'commissioner',
        meta: {
          icon: 'md-people',
          title: '普查专员管理'
        },
        component: () => import('@/pages/daily-operation/commissioner')
      },
      {
        path: 'smallroom',
        name: 'smallroom',
        meta: {
          icon: 'ios-home',
          title: '小屋管理'
        },
        component: () => import('@/pages/daily-operation/smallroom')
      },
      {
        path: 'task',
        name: 'task',
        meta: {
          icon: 'ios-create',
          title: '普查任务'
        },
        component: () => import('@/pages/daily-operation/task')
      },
      {
        path: 'content',
        name: 'content',
        meta: {
          icon: 'md-paper',
          title: '内容管理'
        },
        component: () => import('@/pages/daily-operation/content')
      },
      {
        path: '/booking_detail',
        name: 'booking_detail',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/pages/daily-operation/booking_detail'),
        props: (route) => ({ query: route.query.q })
      },
      {
        path: '/survey_result',
        name: 'survey_result',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/pages/daily-operation/survey_result'),
        props: (route) => ({ query: route.query.q })
      }

    ]
  },
  {
    path: '/error_store',
    name: 'error_store',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'error_store_page',
        name: 'error_store_page',
        meta: {
          icon: 'ios-bug',
          title: '日志管理'
        },
        component: () => import('@/pages/error-store/error-store.vue')
      }
    ]
  },

  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/pages/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/pages/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/pages/error-page/404.vue')
  },

]
