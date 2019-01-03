<template>
  <!--Main Navigation-->
  <header>
<NavBar />
		<router-view />
	



</header>
<!--Main Navigation-->
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

