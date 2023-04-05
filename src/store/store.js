import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import shake from './modules/shake'
import config from './modules/config'
import model from './modules/model'
import edge from './modules/edge'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        user,
        shake,
        config,
        model,
        edge
    }
})
