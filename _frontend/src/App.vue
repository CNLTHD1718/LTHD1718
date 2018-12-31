<template>
	<div>
		<NavBar />
		<router-view />
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

	methods: {
		userSelectedHandler(args) {
			alert('yes');
			console.log(args);
		}
	}
};
</script>

