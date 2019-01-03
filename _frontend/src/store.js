/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		status: '',
		token: localStorage.getItem('token') || '',
		user: {},
		appType: ''
	},
	plugins: [createPersistedState({ storage: window.sessionStorage })],
	mutations: {
		LOG_IN: (state, payload) => {
			// console.log('payload');
			// console.log(payload);
			// console.log('token');
			// console.log(token);
			state.status = 'success';
			console.log('payload.access_token');
			console.log(payload.access_token);
			state.token = payload.access_token;
			state.user = payload.user;
			state.appType = payload.user.Type;
		},
		LOG_OUT: state => {
			state.status = null;
			state.token = null;
			state.user = null;
			state.appType = null;
		},
		auth_request(state) {
			state.status = 'loading';
		},
		auth_success(state, token, user) {
			state.status = 'success';
			state.token = token;
			state.user = user;
			state.appType = user.Type;
		},
		auth_error(state) {
			state.status = 'error';
		},
	},
	actions: {
		login({ commit }, user) {
			return new Promise((resolve, reject) => {
				commit('auth_request');
				axios({
					url: 'http://localhost:1234/Auth/login',
					data: user,
					method: 'POST'
				})
					.then(resp => {
						const token = resp.data.access_token;
						//const user = resp.data.user;
						console.log('resp');
						console.log(resp);
						localStorage.setItem('token', token);
						axios.defaults.headers.common['Authorization'] = token;
						commit('LOG_IN', resp.data);
						resolve(resp.data.user);
					})
					.catch(err => {
						commit('auth_error');
						localStorage.removeItem('token');
						reject(err);
					});
			});
		},
		logout({ commit }) {
			return new Promise((resolve, reject) => {
				commit('LOG_OUT');
				delete axios.defaults.headers.common['Authorization'];
				resolve();
			});
		}
	},
	getters: {
		isLoggedIn: state => !!state.token,
		authStatus: state => state.status,
		appType: state => state.appType
	}
});
