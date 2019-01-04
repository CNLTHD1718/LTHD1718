<template>

  <div
    class="container-fluid"
    style="z-index:9;background-image: url(https://www.grab.com/vn/wp-content/uploads/sites/11/2016/08/bike_banner.jpg);"
  >

    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-md-6">
          <!-- Card -->
          <div class="card">

            <!-- Card body -->
            <div class="card-body">

              <!-- Material form register -->
              <form>
                <p class="h4 text-center py-3">Thông Tin Khách Hàng</p>

                <!-- Material input text -->
                <div class="md-form">
                  <i class="fa fa-user prefix black-text"></i>
                  <input
                    type="text"
                    id="txtName"
                    class="form-control black-text"
                  >
                  <label
                    for="txtName"
                    class="font-weight-light black-text"
                  >Tên</label>
                </div>

                <!-- Material input email -->
                <div class="md-form">
                  <i class="fa fa-phone prefix black-text"></i>
                  <input
                    type="email"
                    id="txtPhone"
                    class="form-control black-text"
                  >
                  <label
                    for="txtPhone"
                    class="font-weight-light black-text"
                  >Điện thoại</label>
                </div>

                <!-- Material input email -->
                <div class="md-form">
                  <i class="fa fa-address-card prefix black-text"></i>
                  <input
                    type="email"
                    id="txtAddress"
                    class="form-control black-text"
                  >
                  <label
                    for="txtAddress"
                    class="font-weight-light black-text"
                  >Địa chỉ</label>
                </div>

                <!--Textarea with icon prefix-->
                <div class="md-form amber-textarea active-amber-textarea-2">
                  <i class="fa fa-sticky-note prefix black-text"></i>
                  <textarea
                    type="text"
                    id="txtNote"
                    class="md-textarea form-control black-text"
                    rows="3"
                  ></textarea>
                  <label
                    for="txtNote"
                    class="black-text"
                  >Ghi chú</label>
                </div>

                <div class="text-center py-4 mt-3">
                  <button
                    class="btn btn-success"
                    type="button"
                    @click='AddRequestSocket'
                  >Tiếp nhận</button>
                </div>
              </form>
              <!-- Material form register -->
            </div>
            <!-- Card body -->

          </div>
          <!-- Card -->
        </div>
        <div
          class="col-md-6"
          style="height:100%"
        >
          <!-- Card -->
          <div class="card">

            <!-- Card body -->
            <div class="card-body">

              <!-- Material form register -->

              <p class="h4 text-center py-3">Lịch Sử Khách Hàng</p>

              <!-- Material input email -->
              <div class="form-inline md-form form-sm active-cyan active-cyan-2 mt-2">
                <a @click="getHistory"><i
                    class="fas fa-search active"
                    aria-hidden="true"
                  ></i></a>
                <input
                  class="form-control form-control-sm ml-3 w-75"
                  type="text"
                  id="textsearch"
                  placeholder="Search"
                  aria-label="Search"
                >
              </div>
              <div
                class="col-12 cus-scrollbar style-1"
                style="max-height:62vh"
              > <div
                  class="list-group mb-1"
                  href="javascript:;"
          v-for="c in listHistory"
          :key="c.Id"
                >
                  <div class="narrower  style-1 border">
                    <!-- Card content -->
                    <a href="javascript:;">
                      <div class="card-body card-body-cascade py-1 ">
                        <!-- Label -->
                        <h6 class="green-text"><i class="fa fa-clock"></i>
                          <font class="black-text font-weight-bold"> {{c.DateCreate}}</font>
                        </h6>
                        <h6 class="green-text"><i class="fa fa-user"></i>
                          <font class="black-text font-weight-bold"> {{c.Name}}</font>
                        </h6>
                        <!-- Title -->
                        <h6 class="green-text"><i class="fa fa-map-marker"></i>
                          <font class="black-text "> {{c.Address}}</font>
                        </h6>
                        <!-- Text -->
                        <h6 class="green-text"><i class="fa fa-sticky-note"></i>
                          <font class="black-text "> {{c.Note}}</font>
                        </h6>
                      </div>
                    </a>
                  </div>
                </div>
                
              </div>
            </div>

          </div>
          <!-- Card -->
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';
export default {
	name: 'App1',
	msg: 'hi every',
	props: {
		msg: String
	},

	data() {
		return {
			socket: io('localhost:1234'),
      timeOut: null,
      listHistory:{}
		};
	},
	mounted() {
		var self = this;
		self.socket.emit('add-user', { username: self.$store.state.user.Id }); //register username to socket server
		self.socket.on('res-add-new-request', data => {
			console.log(data);
			clearTimeout(self.timeOut);
			if (data.res == 'success') {
				self.clearImput();
				toastr.success('Tiếp nhận thông tin thành công', { timeOut: 3000 });
			} else toastr.error('Tiếp nhận thông tin thất bại', { timeOut: 3000 });
		});
	},
	methods: {
		AddRequestSocket() {
			var self = this;
			var newReq = {
				Name: document.getElementById('txtName').value,
				Address: document.getElementById('txtAddress').value,
				Phone: document.getElementById('txtPhone').value,
				Note: document.getElementById('txtNote').value,
				uid: self.$store.state.user.Id
			};
			self.socket.emit('add-new-request', newReq);

			self.timeOut = setTimeout(function() {
				self.NotRespone();
			}, 10000);
		},
		NotRespone() {
			toastr.error('Máy chủ không phản hồi', { timeOut: 3000 });
		},
		clearImput() {
			$('#txtName').val('');
			$('#txtAddress').val('');
			$('#txtPhone').val('');
			$('#txtNote').val('');
		},
		get_new_access_token(rf, id) {
			return axios({
				method: 'post',
				url: 'http://127.0.0.1:1234/Auth/new_token',
				data: {
					ref_token: rf,
					id: id
				}
			});
		},

		getHistory() {
			var self = this;
			var phone = document.getElementById('textsearch').value;
			axios({
				method: 'get',
				url: 'http://localhost:1234/Request/req-history?Phone='+phone,
				//data: { Phone: phone },
				headers: {
					'x-access-token': self.$store.state.token
				}
			})
				.then(res => {
					self.listHistory=res.data;
				})
				.catch(err => {
					self
						.get_new_access_token(
							self.$store.state.rfToken,
							self.$store.state.user.Id
						)
						.then(data => {
							console.log('update token');
							self.$store
								.dispatch('updatetoken', data)
								.then(() => {
									console.log('update token success');
                  self.getHistory();
                  return;
								})
								.catch(err => {
									console.log('err ' + err);
								});
						})
						.catch(err => {
							self.$store
								.dispatch('logout')
								.then(() => {
									self.$router.push({ name: 'Login' });
								})
								.catch(err => {
									console.log('err ' + err);
								});
						});
				});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
