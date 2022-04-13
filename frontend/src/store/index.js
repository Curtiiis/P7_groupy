import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: "Je suis le token",
    },
    getters: {
        tokenGetter: (state) => {
            return state.token + "123";
        }
    },
    mutations: {
        updateToken(state, token) {
            state.token = token.name
        },
        removeToken(state) {
            state.token = null
        }
    },
    actions: {
        fetchToken(context, token) {
            context.commit('token', token)
        }
    },
    plugins: [createPersistedState()],
});

export default store;