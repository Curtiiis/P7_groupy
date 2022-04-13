import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// const state = {
//     token: null
// }

const store = new Vuex.Store({
    state: {
        token: null,
    },
    getters: {
        token: (state) => {
            return state.token;
        }
    },
    actions: {
        token(context, token) {
            context.commit('token', token)
        }
    },
    mutations: {
        setToken(state, token) {
            state.token = token
        },
        removeToken(state) {
            state.token = null
        }
    }
});

export default store;