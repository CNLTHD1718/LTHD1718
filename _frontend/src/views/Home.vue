<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    Home
  </div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'HelloWorld',
	msg: 'hi every',
	props: {
		msg: String
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
