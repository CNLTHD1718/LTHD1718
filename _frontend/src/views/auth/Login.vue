<template>
    <div class="container ">
      <div class="row d-flex justify-content-center">
        <div class="col-md-6">
          <!-- Card -->
          <div class="card">

            <!-- Card body -->
            <div class="card-body">

              <!-- Material form register -->
              <form>
                <p class="h4 text-center py-4">Đăng Nhập</p>

                <!-- Material input text -->
                <div class="md-form">
                  <i class="fa fa-user prefix grey-text"></i>
                  <input
                    type="text"
                    required
                    v-model="username"
                    value='1'
                    class="form-control"
                  >
                  <label
                    for="materialFormCardNameEx"
                    class="font-weight-light"
                  >Tài khoản</label>
                </div>

                <!-- Material input password -->
                <div class="md-form">
                  <i class="fa fa-lock prefix grey-text"></i>
                  <input
                    required
                    v-model="password"
                    type="password"
                    value='1'
                    class="form-control"
                  >
                  <label
                    for="materialFormCardPasswordEx"
                    class="font-weight-light"
                  >Mật khẩu</label>
                </div>

                <div class="text-center py-4 mt-3">
                  <button
                    class="btn btn-success"
                    type="button"
                    @click="login"
                  >Đăng nhập</button>
                </div>
              </form>
              <!-- Material form register -->

            </div>
            <!-- Card body -->
          </div>
          <!-- Card -->
        </div>
      </div>
    </div>

</template>
<script>
import axios from 'axios';
export default {
	data() {
		return {
			username: '',
			password: ''
		};
	},
	mounted() {
		var self = this;
		if (
			localStorage.ref_token &&
			localStorage.access_token &&
			localStorage.User &&
			localStorage.role
		) {
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
		login: function() {
			var self = this;
			let Username = self.username;
			let Password = self.password;
			self.$store
				.dispatch('login', { Username, Password })
				.then(res => {
					console.log('login success view');
					console.log(res);
					switch (res.Type) {
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
				})
				.catch(err => {
					toastr.remove();
					toastr.clear();
					toastr.error('Tên đăng nhập hoặc mật khẩu không đúng.', {
						timeOut: 3000
					});
					console.log(err);
				});
		},
	}
};
</script>