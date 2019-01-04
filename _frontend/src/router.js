import Vue from 'vue';
import Router from 'vue-router';
import App1 from './views/App1.vue';
import App2 from './views/App2.vue';
import App3 from './views/App3.vue';
import App4 from './views/App4.vue';
import Home from './views/Home.vue';
import Login from './views/auth/Login.vue';
import store from './store.js';

Vue.use(Router);

var router = new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/App1',
			name: 'App1',
			component: App1,
			meta: { requiresAuth: true }
		},
		{
			path: '/App2',
			name: 'App2',
			component: App2,
			meta: { requiresAuth: true }
		},
		{
			path: '/App3',
			name: 'App3',
			component: App3,
			meta: { requiresAuth: true }
		},
		{
			path: '/App4',
			name: 'App4',
			component: App4,
			meta: { requiresAuth: true }
		},
		{
			path: '/Login',
			name: 'Login',
			component: Login
		},
		{
			path: '*',
			redirect: { name: 'not found' }
		}
	]
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		console.log('Type user: ');
		console.log(store.getters.appType);
		console.log('to.path');
		console.log(to.path);

		var apptype = '/App' + store.getters.appType;
		console.log('apptype');
		console.log(apptype);

		if (store.getters.isLoggedIn) {
			if (apptype == to.path) {
				next();
			} else {
				next('/Login');
			}
		} else {
			next('/Login');
		}
	} else {
		next();
	}
})

export default router;
