import Vue from 'vue';
import Router from 'vue-router';
import App1 from './views/App1.vue';
import App2 from './views/App2.vue';
import App3 from './views/App3.vue';
import App4 from './views/App4.vue';
import Home from './views/Home.vue';
import Login from './views/auth/Login.vue';

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
			meta: { requiresAuth: true, App1Auth: true }
		},
		{
			path: '/App2',
			name: 'App2',
			component: App2,
			meta: { requiresAuth: true, App2Auth: true }
		},
		{
			path: '/App3',
			name: 'App3',
			component: App3,
			meta: { requiresAuth: true, App3Auth: true }
		},
		{
			path: '/App4',
			name: 'App4',
			component: App4,
			meta: { requiresAuth: true, App4Auth: true }
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
	if (to.meta.requiresAuth) {
		var authUser = localStorage.role;
		var token = localStorage.access_token;
		//console.log(authUser + `|` + token);
		if (!authUser || !token) {
			console.log('route to login');
			next({ name: 'Login' });
		} else {
			if (to.matched.some(record => record.meta.App1Auth)) {
				if (authUser == '1') {
					next();
				} else if (authUser == '2') {
					next({ name: 'App2' });
				} else if (authUser == '3') {
					next({ name: 'App3' });
				} else if (authUser == '4') {
					next({ name: 'App4' });
				}
			} else if (to.matched.some(record => record.meta.App2Auth)) {
				if (authUser == '2') {
					next();
				} else if (authUser == '1') {
					next({ name: 'App1' });
				} else if (authUser == '3') {
					next({ name: 'App3' });
				} else if (authUser == '4') {
					next({ name: 'App4' });
				}
			} else if (to.matched.some(record => record.meta.App3Auth)) {
				if (authUser == '3') {
					next();
				} else if (authUser == '1') {
					next({ name: 'App1' });
				} else if (authUser == '2') {
					next({ name: 'App2' });
				} else if (authUser == '4') {
					next({ name: 'App4' });
				}
			} else if (to.matched.some(record => record.meta.App4Auth)) {
				if (authUser == '4') {
					next();
				} else if (authUser == '1') {
					next({ name: 'App1' });
				} else if (authUser == '2') {
					next({ name: 'App2' });
				} else if (authUser == '3') {
					next({ name: 'App3' });
				}
			} else {
				next({ name: 'Login' });
			}
		}
		//  else if (to.meta.App1Auth) {
		// 	if (authUser == '1') {
		// 		next();
		// 	} else {
		// 		next('/Login');
		// 		console.log('route to login from app 1');
		// 	}
		// } else if (to.meta.App2Auth) {
		// 	//const authUser = JSON.parse(window.localStorage.getItem('lbUser'))
		// 	if (authUser == '2') {
		// 		next();
		// 	} else {
		// 		next('/Login');
		// 		console.log('route to login from app 2');
		// 	}
		// }
	} else {
		next();
	}
});

export default router;
