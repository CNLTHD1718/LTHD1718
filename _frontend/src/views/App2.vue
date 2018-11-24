<template>
  <div class="row">
    <div class="col-sm-3 col-md-3">
      <div class="list-group">
        <a v-for="c in list" :key="c.Id" href="javascript:;" class="list-group-item" :class="{active: c.Id === selectedId}" @click="RequestClicked(c.Id, c.Name)">
          {{c.Name}}
        </a>
      </div>
    </div>
    <div class="col-sm-9 col-md-9">
      <div id="myMap">

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'App2',

	data() {
		return {
			list: [
				// { CatID: 1, CatName: 'Laptop'},
				// { CatID: 2, CatName: 'Tablet'},
			],
			selectedId: -1
		};
	},

	mounted() {
		var self = this;
		axios
			.get('http://localhost:1234/Request')
			.then(res => {
				self.list = res.data;
			})
			.catch(err => {
				console.log(err);
      });
      
      // console.log("map: ", google.maps)
            // this.map = new google.maps.Map(document.getElementById('myMap'), {
            // center: {lat: 21.010584, lng: 105.804688},
            // scrollwheel: false,
            // zoom: 4
            // })
    
	},

	methods: {
		RequestClicked(id, name) {
			alert('test' + id + name);
			var self = this;

			// // alert(JSON.stringify(c));
			//self.$emit('userSelected', c);
		}
	}
};
</script>


    
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#myMap {
	height: 400px; /* The height is 400 pixels */
	width: 100%; /* The width is the width of the web page */
}
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
