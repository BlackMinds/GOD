import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'

////////
import Duty from './components/system/Duty.vue'
import Department from './components/system/Department.vue'
import User from './components/system/User.vue'
import Menu from './components/system/Menu.vue'
import Journal from './components/system/Journal.vue'



import store from './store'



Vue.use(Router)

const router = new Router({
    // mode: 'history',
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                
                { path: '/duty', component: Duty },
                { path: '/department', component: Department },
                { path: '/user', component: User },
                { path: '/menu', component: Menu },
                { path: '/journal', component: Journal },

            ]
        }
    ]
})

  export default router