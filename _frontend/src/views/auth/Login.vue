<template>
    <div id="login">
        <h1>Login</h1>
        <input type="text" name="username" v-model="input.username" placeholder="Username" />
        <input type="password" name="password" v-model="input.password" placeholder="Password" />
        <button type="button" v-on:click="login()">Login</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
	name: 'Login',
	data() {
		return {
			input: {
				username: '',
				password: ''
			}
		};
	},

	mounted() {
		var self = this;
		if (localStorage.token_key && localStorage.ref_token && localStorage.uid) {
			axios({
				method: 'post',
				url: 'http://localhost:1234/User/auth',
				data: {},
				headers: {
					'x-access-token': localStorage.token_key
				}
			})
				.then(data => {
					self.$router.push({ name: 'App4' });
				})
				.catch(err => {
					axios({
						method: 'post',
						url: 'http://localhost:1234/Auth/new_token',
						data: {
							ref_token: localStorage.ref_token,
							id: localStorage.uid
						}
					})
						.then(user => {
							window.localStorage.token_key = user.data.access_token;
							self.$router.push({ name: 'App4' });
						})
						.catch(err => {
							self.login();
						});
				});
		} else {
			self.login();
		}
	},

	methods: {
		login() {
			var self = this;

			var objToPost = {
				//Username: 'admin',
				//Password: 'admin',
				Username: self.input.username,
				Password: self.input.password,
				type: 2
			};
			axios
				.post('http://localhost:1234/Auth/login', objToPost)
				.then(res => {
					window.localStorage.ref_token = res.data.refresh_token;
					window.localStorage.token_key = res.data.access_token;
					window.localStorage.uid = res.data.user.uid;
					//window.localStorage.driver_status = parseInt(res.data.user.status);
					//window.localStorage.user_type = res.data.user.type;
					self.$router.push({ name: 'App4' });
					app.isLogin = true;
					alert('success login');
				})
				.catch(err => {
					console.log('err login'+err);
				});
		}
	}
};
</script>

<style scoped>
#login {
	width: 500px;
	border: 1px solid #cccccc;
	background-color: #ffffff;
	margin: auto;
	margin-top: 200px;
	padding: 20px;
}
</style>