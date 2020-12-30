import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
    state:{
        //存放的键值对就是所要管理的状态
        cache: [],
    },
    mutations:{
        //es6语法，等同edit:funcion(){...}
        edit(state,val){
            state.cache.push(val)
        },
        delete(state,val) {
            let index = state.cache.indexOf(val)
            state.cache.splice(index,1)
        }
    }
})

export default store

