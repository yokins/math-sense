/*
 * @Author: yokins·shi(施永坚)
 * @Description: 改革春风吹满地，搬起砖来不吃力
 * @Date: 2019-08-16 13:58:40
 * @LastEditTime: 2019-08-16 15:05:20
 */
import Vue from 'vue'
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
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/mine',
      name: 'mine',
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
      name: 'homework/:homework_id/start',
      component: homework_start
    },
    {
      path: '/homework/:homework_id/judge',
      name: 'homework/:homework_id/judge',
      component: homework_judge
    },
    {
      path: '/homework/:homework_id/loading',
      name: 'homework/:homework_id/loading',
      component: homework_loading
    },
    {
      path: '/homework/:homework_id/result',
      name: 'homework/:homework_id/result',
      component: homework_result
    },
    {
      path: '/homework/:homework_id/question/:question_id/do',
      name: 'homework/:homework_id/question/:question_id/do',
      component: question_do
    },
    {
      path: '/homework/:homework_id/question/:question_id/show',
      name: 'homework/:homework_id/question/:question_id/show',
      component: question_show
    }
  ]
})

export default router
