<template>
  <div>
    <!--Navbar-->
    <nav class="mb-1 navbar navbar-expand-lg navbar-dark  success-color">
      <router-link
        to="/"
        class="navbar-brand"
      ><b>Trang Chủ</b></router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent-3"
        aria-controls="navbarSupportedContent-3"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent-3"
      >
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active pl-10">
            <router-link
              to="/App1"
              class="nav-link waves-effect waves-light font-weight-bold"
            >App1: Nhận Thông Tin Khách
            </router-link>
          </li>
          <li class="nav-item active pl-10">
            <router-link
              to="/App2"
              class="nav-link waves-effect waves-light font-weight-bold"
            >App2: Xác Nhận Vị Trí Khách
            </router-link>
          </li>
          <li class="nav-item active pl-10">
            <router-link
              to="/App3"
              class="nav-link waves-effect waves-light font-weight-bold"
            >App3: Danh Sách Yêu Cầu
            </router-link>
          </li>
          <li class="nav-item active pl-10">
            <router-link
              to="/App4"
              class="nav-link waves-effect waves-light font-weight-bold"
            >App4: Tài Xế
            </router-link>
          </li>

        </ul>
        <ul class="navbar-nav ml-auto nav-flex-icons">
          <li
            class="nav-item active"
            v-if="this.$store.getters.isLoggedIn"
          >
            <a
              class="nav-link waves-effect waves-light"
              style="font-weight: 400;"
              @click="logout"
            >Đăng Xuất
            </a>
          </li>
          <li
            class="nav-item"
            v-else
          >
            <router-link
              to="/Login"
              class="nav-link waves-effect waves-light font-weight-bold"
              style="font-weight: 400;"
            >Đăng Nhập</router-link>
          </li>

        </ul>
      </div>
    </nav>
    <!--/.Navbar-->
  </div>
</template>

<script>
import io from 'socket.io-client';
export default {
	data() {
		return {
			socket: io('localhost:1234')
		};
	},
	methods: {
		logout() {
			var self = this;
			if (self.$store.getters.appType == 4) {
				var newReq = {
					Id: self.$store.state.user.Id,
					Status: 0
				};
				console.log('change status to 0');
				self.socket.emit('driver-change-status', newReq);
			}
			self.$store
				.dispatch('logout')
				.then(() => {
			    self.$router.push({ name: 'Login' });
			  })
				.catch(err => {
					console.log('err ' + err);
				});
		}
	}
};
</script>

<style scoped>
.pl-10 {
	padding-left: 10px;
}
.font-weight-bold {
	font-weight: 400 !important;
}
</style>


