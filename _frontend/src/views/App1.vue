<template>
	<div class="row">
		<div class="col-sm-4 col-md-4">
		</div>
		<div class="col-sm-4 col-md-4">
			<h1>{{ msg }}</h1>
			<form>
				<div class="form-group">
					<label for="exampleInputEmail1">Name</label>
					<input type="text" class="form-control" id="txtName">
				</div>
				<div class="form-group">
					<label for="exampleInputPassword1">Phone</label>
					<input type="text" class="form-control" id="txtPhone">
				</div>
				<div class="form-group">
					<label for="exampleInputPassword1">Address</label>
					<input type="text" class="form-control" id="txtAddress">
				</div>
				<div class="form-group">
					<label for="exampleInputPassword1">Note</label>
					<input type="text" class="form-control" id="txtNote">
				</div>
				<button type="button" class="btn btn-primary" @click="AddRequest()">Add</button>
				<button type="button" class="btn btn-danger" @click="AddRequestSocket()">AddRequestSocket</button>

			</form>
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
