<template>
  <div class="had-container">

      <a>app1 test</a>
  </div>
</template>

<script>
import axios from 'axios';
export default {
	name: 'Login',
	data() {
		return {
			// user: {
			// 	username: '',
			// 	password: ''
			// }
		};
	},
	mounted(){
		var self=this;
		if(localStorage.ref_token&&localStorage.access_token&&localStorage.User&&localStorage.role)
		{
			switch (localStorage.role) {
						case '1':
							self.$router.push({ name: 'App1' });
							break;
						case '2':
							self.$router.push({ name: 'App2' });
							break;
						case '3':
							self.$router.push({ name: 'App3' });
							break;
						case '4':
							self.$router.push({ name: 'App4' });
							break;
						default:
							console.log(localStorage.role);
							console.log('not found type');
							break;
					}
					
		}
	},
	//#region mount
	// mounted() {
	// 	var self = this;
	// 	if (
	// 		localStorage.token_key &&
	// 		localStorage.ref_token &&
	// 		localStorage.uid
	// 	) {
	// 		axios({
	// 			method: 'post',
	// 			url: 'http://localhost:1234/User/auth',
	// 			data: {},
	// 			headers: {
	// 				'x-access-token': localStorage.token_key
	// 			}
	// 		})
	// 			.then(data => {
	// 				self.$router.push({ name: 'App4' });
	// 			})
	// 			.catch(err => {
	// 				axios({
	// 					method: 'post',
	// 					url: 'http://localhost:1234/Auth/new_token',
	// 					data: {
	// 						ref_token: localStorage.ref_token,
	// 						id: localStorage.uid
	// 					}
	// 				})
	// 					.then(user => {
	// 						window.localStorage.token_key =
	// 							user.data.access_token;
	// 						self.$router.push({ name: 'App4' });
	// 					})
	// 					.catch(err => {
	// 						//self.login();
	// 					});
	// 			});
	// 	} else {
	// 		//self.login();
	// 	}
	// },
	//#endregion
	methods: {
		login() {
			var self = this;

			var objToPost = {
				Username: document.getElementById('username').value,
				Password: document.getElementById('password').value
			};
			axios
				.post('http://localhost:1234/Auth/login', objToPost)
				.then(res => {
					localStorage.ref_token = res.data.refresh_token;
					localStorage.access_token = res.data.access_token;
					localStorage.role = res.data.user.Type;
					localStorage.Id = res.data.user.Id;

					localStorage.setItem('UserObj', JSON.stringify(res.data.user));
					var retrievedObject = localStorage.getItem('UserObj');

					console.log('retrievedObject: ', JSON.parse(retrievedObject));
					
					switch (res.data.user.Type) {
						case 1:
							self.$router.push({ name: 'App1' });
							break;
						case 2:
							self.$router.push({ name: 'App2' });
							break;
						case 3:
							self.$router.push({ name: 'App3' });
							break;
						case 4:
							self.$router.push({ name: 'App4' });
							break;
						default:
							console.log(res.data.user.Type);
							console.log('not found type');
							break;
					}
					//alert('success login');
				})
				.catch(err => {
					console.log('err login |' + err);
					alert('login failed');
				});
			return;
			alert('login failed');
		}
	}
};
</script>

<style scoped>
body {
	display: flex;
	min-height: 100vh;
	flex-direction: column;
}

main {
	flex: 1 0 auto;
}
.brand-logo > img {
	width: 50px;
	height: 50px;
	margin-top: 5px;
}
/* Menu - profile */
.bg-card-user {
	background: rgba(0, 77, 64, 0.5);
	padding: 15px 0;
}
.truncate > img {
	width: 180px;
	margin-top: 6px;
	margin-bottom: 6px;
}
/* FOOTER */
footer .foot-text {
	margin-top: 10px;
}

/* LOGIN */
.logueo {
	/* PARALLAX */
	height: 650px !important;
}
i.iconis {
	font-size: 1em !important;
	margin-top: 8px;
}
.login {
	border: 1px solid #fff;
	width: 80%;
	margin: 0 auto;
	background-color: rgba(255, 255, 255, 0.7);
	padding: 20px;
}
</style>
