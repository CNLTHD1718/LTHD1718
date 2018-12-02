<template>
  <div class="row">
    <div class="col s4">
      <button @click="logout">log out</button>
      <button @click="vieww">view</button>

    </div>
    <div class="col s4">

      <button
        id="btnOn"
        class="btn waves-effect waves-light cyan pulse green"
        type="button"
        name="action"
        @click="changeStatus(1)"
      >Online
        <i class="material-icons right">power_settings_new</i>
      </button>

      <button
        id="btnOff"
        class="btn waves-effect waves-light pulse green"
        type="button"
        name="action"
        style="opacity: .4;"
        @click="changeStatus(0)"
      >Offline
        <i class="material-icons right">power_settings_new</i>
      </button>

      <gmap-map
        ref="mapRef"
        :center="center"
        :zoom="18"
        style="width:100%;  height: 500px;"
      >
        <!-- <gmap-circle
          ref="circle"
          :radius="100"          
          v-bind:center="center"
          :draggable='false'
        /> -->
        <gmap-marker
          ref="myMarker"
          v-bind:position="coordinates"
          :draggable="true"
          :icon="{ url: require('../assets/automobile.png')}"
          @dragend="updateCoordinates"
        ></gmap-marker>
      </gmap-map>
      <div
        class="=row"
        id='modelRequest'
      >
        <button
          class="btn waves-effect waves-light green nodpadd"
          @click="acceptRequest()"
          type="button"
          style="height: 50px;"
        >
          Accept<i class="material-icons left">check</i></button>
        <button
          class="btn waves-effect waves-light red nodpadd"
          @click="declineRequest()"
          type="button"
          style="height: 50px;"
        >
          Decline<i class="material-icons left">block</i></button>
      </div>
      <div
        class="row"
        id='modelProcess'
      >
        <button
          id='btnStart'
          @click="startRequest"
          class="btn  waves-effect waves-light green  nodpadd"
          type="button"
          style="height: 50px;"
        >Start</button>
        <button
          id='btnEnd'
          @click="doneRequest"
          class="btn waves-effect waves-light grey  pulse nodpadd"
        >End</button>
      </div>

    </div>

    <div class="col s4">

    </div>
  </div>
</template>

<script>

import axios from 'axios';
import io from 'socket.io-client';
import haversine from 'haversine';
import $ from 'jquery';
export default {
	name: 'App4',

	data() {
		return {
			isOnline: false,
			timeOut: null,

			directionsDisplay: null,
			center: { lat: 10.77191, lng: 106.65358 },
			markers: [],
			places: [],
			coordinates: { lat: 10.77191, lng: 106.65358 },
			currentPlace: null,
			fillColor1: '#0000FF',

			customer_LatLng: {},

			req_id: null,
			req_for_driver: {},
			socket: io('localhost:1234')
			//mapSettings
		};
	},

	mounted() {
		var self = this;
		// if (localStorage.token_key && localStorage.ref_token && localStorage.uid) {
		// 	axios({
		// 		method: 'post',
		// 		url: 'http://localhost:1234/User/auth',
		// 		data: {},
		// 		headers: {
		// 			'x-access-token': localStorage.token_key
		// 		}
		// 	})
		// 		.then(data => {
		// 			self.loadData(localStorage.token_key);
		// 			//self.driver.status =  parseInt( localStorage.driver_status);
		// 		})
		// 		.catch(err => {
		// 			self
		// 				.get_new_access_token(localStorage.ref_token, localStorage.uid)
		// 				.then(user => {
		// 					self.loadData(user.data.access_token);
		// 					//self.driver.status = user.data.status;
		// 				})
		// 				.catch(err => {
		// 					//console.log('err catch' + err);
		// 					self.$router.push({ name: 'Login' });
		// 				});
		// 			console.log('get new access token');
		// 		});
		// } else {
		// 	self.$router.push({ name: 'Login' });
		// }

		// At this point, the child GmapMap has been mounted, but
		// its map has not been initialized.
		// Therefore we need to write mapRef.$mapPromise.then(() => ...)
		self.$refs.mapRef.$mapPromise
			.then(map => {
				//map.panTo({ lat: 1.38, lng: 103.8 });
				self.directionsDisplay = new google.maps.DirectionsRenderer();
				console.log('success set self.directionsDisplay');
				var circle = new google.maps.Circle({
					center: self.center,
					radius: 100,
					fillColor: '#0000FF',
					fillOpacity: 0.1,
					map: self.$refs.mapRef.$mapObject,
					strokeColor: '#1818b8',
					strokeOpacity: 0.3,
					strokeWeight: 0.3
				});
				console.log('success create circle');
			})
			.catch(err => {
				console.log('error create map' + err);
			});

		self
			.geolocate()
			.then(() => {
				console.log('success geolocated');
			})
			.catch(err => {
				console.log('error ' + err);
			});

		$('#btnOff').hide();
		$('#btnOn').show();

		self.socket.on('hi there 2', data => {
			//respone from server socket
			console.log('respone from server socket');
		});

		self.socket.emit('add-user', { username: localStorage.uid }); //register username to socket server
		self.socket.on('driver-receive-new-request', data => {
			var self = this;
			self.customer_LatLng = null;
			console.log('driver receive request : ');
			console.log(data);
			self.customer_LatLng = {
				lat: data.Lat,
				lng: data.Lng
			};
			self.req_for_driver = {
				u_id: localStorage.uid,
				req_id: data.Id
			};
			self.showNewRequest();
			console.log('driver-receive-new-request from server ' + data);
		});
	},

	methods: {
		acceptRequest() {
			$('#modelRequest').fadeOut();
			var self = this;
			clearTimeout(self.timeOut);
			console.log('driver accept request');
			console.log(self.req_for_driver);
			self.socket.emit('driver-accept-request', self.req_for_driver);
			self.showDirectionFromDriverToCustomer();			
			$('#modelProcess').fadeIn();
		},
		declineRequest() {
			$('#modelRequest').fadeOut();
			alert('driver decline request');
		},
		startRequest() {
			var self = this;
			self.socket.emit('driver-start-request', self.req_for_driver);
			document.getElementById('btnEnd').disabled = false;
		},
		doneRequest() {
			var self = this;
			self.socket.emit('driver-done-request', self.req_for_driver);
			self.updateDriverLocationAfterDone();
			self.directionsDisplay.setMap(null); //delete previous direction
			alert('done');
			$('#modelProcess').fadeOut();
		},
		showNewRequest() {
			var self = this;
			$('#modelRequest').fadeIn();
			self.timeOut = setTimeout(function() {
				self.declineRequest();
			}, 10000);
		},
		checc() {
			alert('Your toast was');
		},
		changeStatus(x) {
			if (x == 0) {
				$('#btnOff').hide();
				$('#btnOn').show();
			} else {
				$('#btnOn').hide();
				$('#btnOff').show();
			}
			var self = this;
			if (self.isOnline) {
				var newReq = {
					Id: localStorage.uid,
					Status: 1
				};
				self.socket.emit('driver-change-status', newReq);
			} else {
				var newReq = {
					Id: localStorage.uid,
					Status: 0
				};
				self.socket.emit('driver-change-status', newReq);
			}
		},
		logout() {
			var self = this;
			localStorage.token_key = '';
			localStorage.ref_token = '';
			localStorage.uid = '';
			var newReq = {
				Id: 1,
				Status: 0
			};
			self.socket.emit('driver-change-status', newReq);
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
		showDirectionFromDriverToCustomer() {
			var self = this;
			//self.$refs.mapRef.$mapObject;

			self.directionsService = new google.maps.DirectionsService();
			//this.directionsDisplay = new google.maps.DirectionsRenderer();
			self.directionsDisplay.setMap(self.$refs.mapRef.$mapObject);
			console.log('driver LatLng : ');
			console.log(self.coordinates);
			console.log('customer LatLng : ');
			console.log(self.customer_LatLng);

			self.directionsService.route(
				{
					origin: self.coordinates,
					destination: self.customer_LatLng,
					travelMode: 'DRIVING'
				},
				function(response, status) {
					if (status === 'OK') {
						self.directionsDisplay.setDirections(response);
						console.log('driving ok');
					} else {
						console.log('Directions request failed due to ' + status);
					}
				}
			);
		},
		updateDriverLocationAfterDone() {
			var self = this;
			self.center = self.customer_LatLng;
			self.coordinates = self.customer_LatLng;
		},

		vieww() {
			var self = this;
			self.directionsDisplay.setMap(null);
			console.log(this.coordinates);
			console.log(this.center);
		},
		updateCoordinates(location) {
			var self = this;
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
				//alert('Success');
				console.log('change location success');
				var newReq = {
					Id: 1,
					Lat: self.coordinates.lat,
					Lng: self.coordinates.lng
				};
				self.socket.emit('driver-change-location', newReq);
			} else {
				alert('Error : maximum is 100m !!');
				self.coordinates = self.center;
				var marker = self.$refs.myMarker.$markerObject;
				marker.setPosition(self.center);
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

		geolocate() {
			return new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(position => {});
				resolve();
			});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
/* .ddriver {
	padding: 0 !important;
}*/
.nodpadd {
	border-radius: 0px !important;
	width: 50%;
}

/* .btn, .btn-large, .btn-small, .btn-flat {
    border: none;
     border-radius: 0px !important; 
     padding: 0 0 !important
} */
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
