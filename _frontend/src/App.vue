<template>
	<div>
		<NavBar />
		<div class="container-fluid">
			<router-view />
		</div>
	</div>
</template>

<script>
import NavBar from './components/NavBar.vue';

import axios from 'axios';

export default {
	name: 'App',

	components: {
		NavBar
	},

	// data () {
	//   return {
	//     selectedCategoryName: '***',
	//     productList: []
	//   }
	// },

	methods: {
		userSelectedHandler(args) {
			alert('yes');
			console.log(args);
			// var self = this;
			// var id = args.id;
			// axios.get(`http://localhost:3000/categories/${id}/products`)
			//   .then(res => {
			//     self.productList = res.data.products;
			//   })
			//   .catch(err => {
			//     console.log(err);
			//   })

			// self.selectedCategoryName = args.CatName;
		}
	}
};
</script>

<style lang="css" scoped>
</style>
