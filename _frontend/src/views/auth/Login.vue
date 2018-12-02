<template>
  <div class="had-container">

    <div class="parallax-container logueo">
      <div class="parallax"><img src="https://alistapart.com/d/438/fig-6--background-blend-mode.jpg"></div>
      <div class="row"><br>
        <div class="col m8 s8 offset-m2 offset-s2 center">
          <h4 class="truncate bg-card-user">
            <!-- <img
              src="https://cdn3.iconfinder.com/data/icons/happily-colored-snlogo/128/medium.png"
              alt=""
              class="circle responsive-img"
            > -->
            <div class="row login">
              <h4>He Thong Dat Xe</h4>
              <form class="col s12">
                <div class='row'>
                  <div class='input-field col m12'>
                    <i class="material-icons iconis prefix">account_box</i>
                    <input
                      type='text'
                      name='username'
                      id='username'
                    />
                    <label for='username'>Username</label>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s12">
                    <i class="material-icons iconis prefix">enhanced_encryption</i>
                    <input
                      type="password"
                      name="password"
                      id="password"
                    >
                    <label for="password">Pasword</label>
                  </div>
                  <label style='float: right;'>
                    <a><b style="color: #F5F5F5;">Forgot Password?</b></a>
                  </label>
                </div>
                <div class="row">
                  <button
                    class="btn waves-effect waves-light"
                    type="button"
                    v-on:click="login()"
                  >Login</button>
                </div>
              </form>
            </div>
          </h4>
        </div>
      </div>
    </div>
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
					localStorage.User = res.data.user;
					localStorage.role = res.data.user.Type;
					localStorage.Id = res.data.user.Id;
					console.log(res.data.user);
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
