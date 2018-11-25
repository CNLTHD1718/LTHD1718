<template>
	<div class="row">
		<div class="col-sm-4 col-md-4">
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
	// mounted() {
	//   var self = this;
	//   axios.get('http://localhost:1234/user/all')
	//     .then(res => {
	//       self.list = res.data;
	//     })
	//     .catch(err => {
	//       console.log(err);
	//     })
	// },

	methods: {
		onChange() {
			var self = this;
			//alert('check' + this.isOnline);
			if(self.isOnline){

			}
			
		},
		AddRequest() {
			alert('test' + document.getElementById('txtName').value);
			var self = this;
			var objToPost = {
				Name: document.getElementById('txtName').value,
				Address: document.getElementById('txtAddress').value,
				Phone: document.getElementById('txtPhone').value,
				Note: document.getElementById('txtNote').value
			};
			axios
				.post('http://localhost:1234/Request/add', objToPost)
				.then(res => {
					alert('succes ');
				})
				.catch(err => {
					console.log(err);
				});
			// // alert(JSON.stringify(c));
			//self.$emit('userSelected', c);
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
