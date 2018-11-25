<template>
	<div class="row">
		<div class="col-sm-4 col-md-4">
			<button @click="logout">log out</button>
		</div>
		<div class="col-sm-4 col-md-4">
			<input type="checkbox" @change="onChange" v-model="isOnline" data-toggle="toggle" data-on="<i class='fa fa-play'></i> Online" data-onstyle="success" data-off="<i class='fa fa-pause'></i> Offline" data-offstyle="danger">
			Online
		</div>

		<div class="col-sm-4 col-md-4">

		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'HelloWorld',
	msg: 'hi every',
	props: {
		msg: String
	},

	data() {
		return {
			isOnline: false
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
					self.loadData(localStorage.token_key);
					//self.driver.status =  parseInt( localStorage.driver_status);
				})
				.catch(err => {
					// self
					// 	.get_new_access_token(localStorage.ref_token, localStorage.uid)
					// 	.then(user => {
					// 		self.loadData(user.data.access_token);
					// 		//self.driver.status = user.data.status;
					// 	})
					// 	.catch(err => {
					// 		console.log('err catch' + err);
					// 		self.$router.push({ name: 'Login' });
					// 	});
					console.log('not get new access token');
				});
		} else {
			//window.location.href = 'http://localhost:3000/Login';
			self.$router.push({ name: 'Login' });
		}
	},

	methods: {
		onChange() {
			var self = this;
			//alert('check' + this.isOnline);
			if (self.isOnline) {
			}
		},
		logout() {},

		loadData(token) {
			var self = this;
			localStorage.token_key = token;
			//var user_type = localStorage.user_type;
			var user_id = localStorage.uid;
		},
		get_new_access_token(rf, id) {
			return axios({
				method: 'post',
				url: 'http://localhost:1234/Auth/new_token',
				data: {
					ref_token: rf,
					id: id
				}
			});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
