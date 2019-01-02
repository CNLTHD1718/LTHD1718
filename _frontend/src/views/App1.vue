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
                <p class="h4 text-center py-4">App1</p>

                <!-- Material input text -->
                <div class="md-form">
                  <i class="fa fa-user prefix grey-text"></i>
                  <input
                    type="text"
                    id="txtName"
                    class="form-control"
                  >
                  <label
                    for="txtName"
                    class="font-weight-light"
                  >Name</label>
                </div>

                <!-- Material input email -->
                <div class="md-form">
                  <i class="fa fa-envelope prefix grey-text"></i>
                  <input
                    type="email"
                    id="txtPhone"
                    class="form-control"
                  >
                  <label
                    for="txtPhone"
                    class="font-weight-light"
                  >Phone</label>
                </div>

                <!-- Material input email -->
                <div class="md-form">
                  <i class="fa fa-exclamation-triangle prefix grey-text"></i>
                  <input
                    type="email"
                    id="txtAddress"
                    class="form-control"
                  >
                  <label
                    for="txtAddress"
                    class="font-weight-light"
                  >Address</label>
                </div>

                <!--Textarea with icon prefix-->
                <div class="md-form amber-textarea active-amber-textarea-2">
                  <i class="fas fa-pencil-alt prefix"></i>
                  <textarea
                    type="text"
                    id="txtNote"
                    class="md-textarea form-control"
                    rows="3"
                  ></textarea>
                  <label for="txtNote">Note</label>
                </div>

                <div class="text-center py-4 mt-3">
                  <button
                    class="btn btn-green accent-4"
                    type="button"
                    style="background:#00B23E;"
                    @click='AddRequestSocket'
                  >ADD</button>
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
			timeOut: null
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
				toastr.success('Add Success', { timeOut: 3000 });
			} else toastr.error('Add Err', { timeOut: 3000 });
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
			toastr.error('Not responding from server', { timeOut: 3000 });
		},
		clearImput() {
			$('#txtName').val('');
			$('#txtAddress').val('');
			$('#txtPhone').val('');
			$('#txtNote').val('');
		},
		AddRequest() {
			//var self = this;
			var objToPost = {
				Name: document.getElementById('txtName').value,
				Address: document.getElementById('txtAddress').value,
				Phone: document.getElementById('txtPhone').value,
				Note: document.getElementById('txtNote').value
			};
			axios
				.post('http://localhost:1234/Request/add', objToPost)
				.then(res => {
					alert('success ');
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
