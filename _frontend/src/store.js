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
		"LOGG": (state, payload) => {
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
		logout(state) {
			state.status = '';
			state.token = '';
		},
	},
	actions: {
		login({ commit }, user) {
			return new Promise((resolve, reject) => {
				commit('auth_request');
				axios({ url: 'http://localhost:1234/Auth/login', data: user, method: 'POST' })
					.then(resp => {
						const token = resp.data.access_token;
						//const user = resp.data.user;
						console.log('resp');
						console.log(resp);
						localStorage.setItem('token', token);
						axios.defaults.headers.common['Authorization'] = token;
						commit('LOGG', resp.data);
						resolve(resp.data.user);
					})
					.catch(err => {
						commit('auth_error');
						localStorage.removeItem('token');
						reject(err);
					})
			})
		},
		register({ commit }, user) {
			return new Promise((resolve, reject) => {
				commit('auth_request');
				const token = 'duongnnb_token';
				const user = 'duong';
				localStorage.setItem('token', token);
				// Add the following line:
				axios.defaults.headers.common['Authorization'] = token;
				commit('auth_success', token, user);
				resolve();
				// axios(
				// 	{
				// 		url: 'http://localhost:3000/register'
				// 		, data: user
				// 		, method: 'POST'
				// 	})
				// 	.then(resp => {
				// 		const token = resp.data.token;
				// 		const user = resp.data.user;
				// 		localStorage.setItem('token', token);
				// 		// Add the following line:
				// 		axios.defaults.headers.common['Authorization'] = token;
				// 		commit('auth_success', token, user);
				// 		resolve(resp);
				// 	})
				// 	.catch(err => {
				// 		commit('auth_error', err);
				// 		localStorage.removeItem('token');
				// 		reject(err);
				// 	})
			})
		},
		logout({ commit }) {
			// eslint-disable-next-line no-unused-vars
			return new Promise((resolve, reject) => {
				commit('logout');
				localStorage.removeItem('token');
				delete axios.defaults.headers.common['Authorization'];
				resolve();
			})
		}
	},
	getters: {
		isLoggedIn: state => !!state.token,
		authStatus: state => state.status,
		appType: state => state.appType
	}
})
