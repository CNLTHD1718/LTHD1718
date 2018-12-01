<template>
  <div class="row">
    <div class="col s4"></div>
    <div class="col s4">
      <h1>{{ msg }}</h1>
      <form>
        <div class="input-field col s12">
          <i class="material-icons prefix">account_circle</i>
          <input
            id="txtName"
            type="text"
            class="validate"
          >
          <label for="icon_prefix">First Name</label>
        </div>

        <div class="input-field col s12">
          <i class="material-icons prefix">phone</i>
          <input
            id="txtPhone"
            type="tel"
            class="validate"
          >
          <label for="icon_telephone">Telephone</label>
        </div>

        <div class="input-field col s12">
          <i class="material-icons prefix">address</i>
          <input
            id="txtAddress"
            class="validate"
            type="text"
          >
          <label for="icon_telephone">Address</label>
        </div>
        <div class="input-field col s12">
          <i class="material-icons prefix">note</i>
          <textarea
            id="txtNote"
            class="materialize-textarea"
          ></textarea>
          <label for="icon_telephone">Note</label>
        </div>

        <!-- <button type="button" class="btn btn-primary" @click="AddRequest()">Add</button> -->
        <button
          class="btn waves-effect waves-light green accent-4"
          type="button"
          name="action"
          @click="AddRequestSocket()"
          style="float: right;"
        >Submit
          <i class="material-icons right ">send</i>
        </button>

      </form>
    </div>
    <div class="col s4"></div>

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
			socket: io('localhost:1234')
		};
	},

	methods: {
		AddRequestSocket() {
			var self = this;
			var newReq = {
				Name: document.getElementById('txtName').value,
				Address: document.getElementById('txtAddress').value,
				Phone: document.getElementById('txtPhone').value,
				Note: document.getElementById('txtNote').value
			};

			self.socket.emit('add-new-request', newReq);
      M.toast({ html: 'Thêm thành công', classes: 'light-blue accent-3' });
      self.clearImput();
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
