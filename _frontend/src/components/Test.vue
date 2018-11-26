<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Users</h3>
    </div>
    <div class="list-group">
      <a v-for="c in list"
        :key="c.id"
        href="javascript:;"
        class="list-group-item"
        :class="{active: c.id === selectedId}"
        @click="userClicked(c.id, c.username)">
        {{c.username}}
      </a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'Users',

	data() {
		return {
			list: [
				// { id: 1, username: 'Laptop'},
				// { id: 2, username: 'Tablet'},
			],
			selectedId: -1
		};
	},

	mounted() {
		var self = this;
		axios
			.get('http://localhost:1234/user/all')
			.then(res => {
				self.list = res.data;
			})
			.catch(err => {
				console.log(err);
			});
	},

	methods: {
		userClicked(id, name) {
			alert('test' + id + name);
			var self = this;
			self.selectedId = id;

			var c = {
				id: id,
				username: name
			};
			// // alert(JSON.stringify(c));
			self.$emit('userSelected', c);
		}
	}
};
</script>

<style lang="css" scoped>
</style>
