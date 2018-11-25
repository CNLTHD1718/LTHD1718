<template>
	<div class="row">
		<div class="col-sm-3 col-md-3">
			<div class="list-group">
				<div>
					<ul>
						<li v-for="c in list" :key="c.Id" href="javascript:;" class="list-group-item" :class="{active: c.Id === selectedId}" @click="getThisPlace(c.Id,c.Address)">

							<div>Ho ten: {{c.Name}}</div>
							<div>Dia diem: {{c.Address}}</div>
							<div>Ghi chu: {{c.Note}} </div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="col-sm-9 col-md-9">
			<div id="myMap">
				<div>
					<div class="input-group">
						<gmap-autocomplete id="mapcomp" class="form-control" @place_changed="setPlace">
						</gmap-autocomplete>
						<button @click="addMarker" class="btn btn-primary">Find</button>
						<button @click="locatePlace" class="btn btn-info">Locate this</button>

					</div>
					<br />

				</div>
				<br>
				<gmap-map :center="center" :zoom="12" style="width:100%;  height: 400px;">
					<gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" @click="center=m.position" :draggable="true" @drag="updateCoordinates"></gmap-marker>
				</gmap-map>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

export default {
	name: 'App2',

	data() {
		return {
			list: [],
			selectedId: -1,

			center: { lat: 21.010584, lng: 105.804688 },
			markers: [],
			places: [],
			coordinates: {},
			currentPlace: null,

			user: '',
			message: '',
			messages: [],
			socket: io('localhost:1234')
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
		self.geolocate(); //create map

		self.socket.on('load-new-request', data => {
			console.log(data);
			//alert('receive');
			self.list = data;
			// you can also do this.messages.push(data)
		});
	},

	methods: {
		getThisPlace(id, place) {
			var self = this;
			self.selectedId = id;
			document.getElementById('mapcomp').value = place;
			// // alert(JSON.stringify(c));
			//self.$emit('userSelected', c);
		},
		updateCoordinates(location) {
			var self = this;
			self.coordinates = {
				lat: location.latLng.lat(),
				lng: location.latLng.lng()
			};
			//alert(location.latLng.lat());
		},

		locatePlace() {
			var self = this;
			var objToPost = {
				Id: self.selectedId,
				Lat: self.coordinates.lat,
				Lng: self.coordinates.lng
			};
			console.log(objToPost);
			axios
				.post('http://localhost:1234/Request/identify', objToPost)
				.then(res => {
					alert('located success');
				})
				.catch(err => {
					console.log(err);
				});
		},

		//method for google map
		setPlace(place) {
			this.currentPlace = place;
		},
		addMarker() {
			var self = this;
			if (self.currentPlace) {
				var marker = (self.coordinates = {
					lat: self.currentPlace.geometry.location.lat(),
					lng: self.currentPlace.geometry.location.lng()
				});
				self.markers = [];
				self.places = [];
				self.markers.push({ position: marker });
				self.places.push(self.currentPlace);
				self.center = marker;
				//this.currentPlace = null;
			} else {
				alert('Find something first!');
			}
		},
		geolocate: function() {
			navigator.geolocation.getCurrentPosition(position => {
				this.center = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
			});
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
#mapcomp {
	width: 600px;
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
	width: 100%;
}
a {
	color: #42b983;
}
</style>
