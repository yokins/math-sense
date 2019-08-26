/*
 * @Author: yokins·shi(施永坚)
 * @Description: 改革春风吹满地，搬起砖来不吃力
 * @Date: 2019-08-16 13:58:40
 * @LastEditTime: 2019-08-26 09:13:27
 */
import Vue from 'vue'
import store from './store'
import Router from 'vue-router'
import home from './views/home.vue'
import login from './views/login.vue'
import mine from './views/mine.vue'
import tree from './views/tree.vue'
import feedback from './views/feedback.vue'
import mistake from './views/mistake.vue'
import homework_start from './views/homework/start'
import homework_judge from './views/homework/judge'
import homework_result from './views/homework/result'
import homework_loading from './views/homework/loading'
import question_do from './views/question/do'
import question_show from './views/question/show'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        need_tabbar: true
      },
      component: home
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        skip_login: true
      },
      component: login
    },
    {
      path: '/mine',
      name: 'mine',
      meta: {
        need_tabbar: true
      },
      component: mine
    },
    {
      path: '/tree',
      name: 'tree',
      component: tree
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: feedback
    },
    {
      path: '/mistake',
      name: 'mistake',
      component: mistake
    },
    {
      path: '/homework/:homework_id/start',
      name: 'homework_start',
      component: homework_start
    },
    {
      path: '/homework/:homework_id/judge',
      name: 'homework_judge',
      component: homework_judge
    },
    {
      path: '/homework/:homework_id/loading',
      name: 'homework_loading',
      component: homework_loading
    },
    {
      path: '/homework/:homework_id/result',
      name: 'homework_result',
      component: homework_result
    },
    {
      path: '/homework/:homework_id/question/:question_id/do',
      name: 'homework_question_do',
      component: question_do
    },
    {
      path: '/homework/:homework_id/question/:question_id/show',
      name: 'homework_question_show',
      component: question_show
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.current_user) {
    to.name === 'login'
      ? next({
          replace: true,
          name: 'home'
        })
      : next()
  } else {
    to.meta.skip_login
      ? next()
      : next({
          replace: true,
          name: 'login'
        })
  }
})

export default router
