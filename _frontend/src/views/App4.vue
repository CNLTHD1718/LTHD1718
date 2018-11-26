<template>
	<div class="row">
		<div class="col-sm-4 col-md-4">
			<button @click="logout">log out</button>
			<button @click="vieww">view</button>

		</div>
		<div class="col-sm-4 col-md-4">
			<input type="checkbox" @change="changeStatus" v-model="isOnline" data-toggle="toggle" data-on="<i class='fa fa-play'></i> Online" data-onstyle="success" data-off="<i class='fa fa-pause'></i> Offline" data-offstyle="danger">
			Online
			<button @click="acceptRequest">Accept</button>
			<button @click="declineRequest">Decline</button>
			<button @click="doneRequest">Done</button>

			<gmap-map ref="mapRef" :center="center" :zoom="15" style="width:100%;  height: 500px;">
				<gmap-circle ref="circle" :radius="100" v-bind:fillColor="fillColor1" v-bind:center="center" :draggable='false' />
				<gmap-marker ref="myMarker" v-bind:position="coordinates" :draggable="true" @dragend="updateCoordinates"></gmap-marker>
			</gmap-map>
		</div>

		<div class="col-sm-4 col-md-4">

		</div>
	</div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';
import haversine from 'haversine';

export default {
	name: 'App4',

	data() {
		return {
			isOnline: false,

			center: { lat: 10.77191, lng: 106.65358 },
			markers: [],
			places: [],
			coordinates: { lat: 10.77191, lng: 106.65358 },
			currentPlace: null,
			fillColor1: '#0000FF'
		};
	},

	mounted() {
		var self = this;
		if (localStorage.token_key && localStorage.ref_token && localStorage.uid) {
			axios({
				method: 'post',
				url: 'http://localhost:1234/User/auth',
				data: {},
				headers: {
					'x-access-token': localStorage.token_key
				}
			})
				.then(data => {
					self.loadData(localStorage.token_key);
					//self.driver.status =  parseInt( localStorage.driver_status);
				})
				.catch(err => {
					self
						.get_new_access_token(localStorage.ref_token, localStorage.uid)
						.then(user => {
							self.loadData(user.data.access_token);
							//self.driver.status = user.data.status;
						})
						.catch(err => {
							//console.log('err catch' + err);
							self.$router.push({ name: 'Login' });
						});
					console.log('get new access token');
				});
		} else {
			self.$router.push({ name: 'Login' });
		}

		self.geolocate(); //create map
		//self.addMarker();
		self.testingtt();
	},

	methods: {
		acceptRequest() {},
		declineRequest() {},
		doneRequest(){
			
		}
		changeStatus() {
			var self = this;
			if (self.isOnline) {
				alert('ýes');
			}
		},
		logout() {
			var self = this;
			localStorage.token_key = '';
			localStorage.ref_token = '';
			localStorage.uid = '';
			self.$router.push({ name: 'Login' });
		},
		loadData(token) {
			var self = this;
			localStorage.token_key = token;
			//var user_type = localStorage.user_type;
			var user_id = localStorage.uid;
		},
		get_new_access_token(rf, id) {
			return axios({
				method: 'post',
				url: 'http://localhost:1234/Auth/new_token',
				data: {
					ref_token: rf,
					id: id
				}
			});
		},

		vieww() {
			console.log(this.coordinates);
			console.log(this.center);
		},
		updateCoordinates(location) {
			var self = this;

			//console.log('0before ' + self.coordinates.lat + ',' + self.coordinates.lng);

			var center_coordinates = {
				latitude: self.center.lat,
				longitude: self.center.lng
			};
			var new_coordinates = {
				latitude: location.latLng.lat(),
				longitude: location.latLng.lng()
			};
			//console.log(haversine(center_coordinates, new_coordinates, { unit: 'meter' }));
			//console.log(haversine(center_coordinates, new_coordinates, {threshold: 100,unit: 'meter'}));
			//console.log('1center ' +center_coordinates.latitude +',' + center_coordinates.longitude );
			//console.log('2old ' + self.coordinates.lat + ',' + self.coordinates.lng);
			//console.log( '3new_ ' + new_coordinates.latitude + ',' + new_coordinates.longitude );

			if (
				haversine(center_coordinates, new_coordinates, {
					threshold: 100,
					unit: 'meter'
				})
			) {
				self.coordinates = {
					lat: location.latLng.lat(),
					lng: location.latLng.lng()
				};
				alert('Success');
			} else {
				alert('Error : maximum is 100m !!');
				self.coordinates = self.center;
			}
			//console.log('4old ' + self.coordinates.lat + ',' + self.coordinates.lng);
		},
		testingtt() {
			//alert('yes me')
			const start = {
				latitude: 30.849635,
				longitude: -83.24559
			};

			const end = {
				latitude: 27.950575,
				longitude: -82.457178
			};

			console.log(haversine(start, end, { unit: 'meter' }));
			console.log(haversine(start, end, { threshold: 100, unit: 'meter' }));
		},
		//MAP
		addMarker() {
			var self = this;
			var circle = new google.maps.Circle({
				center: self.center,
				radius: 1000,
				fillColor: '#0000FF',
				fillOpacity: 0.1,
				map: this.$refs.mapRef,
				strokeColor: '#FFFFFF',
				strokeOpacity: 0.1,
				strokeWeight: 2
			});
		},
		geolocate: function() {
			navigator.geolocation.getCurrentPosition(position => {
				// this.center = {
				// 	lat: position.coords.latitude,
				// 	lng: position.coords.longitude
				// };
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
