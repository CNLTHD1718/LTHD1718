<template>
  <div
    class="row"
    style="padding-top:10px"
  >
    <div class="col s3">
      <div class="list-group">
        <div>
          <blockquote>
            List request
          </blockquote>
          <ul>
            <li
              v-for="c in listRequest"
              :key="c.Id"
              href="javascript:;"
              class="list-group-item"
              :class="{active: c.Id === selectedIdRequest}"
              @click="getRequest(c.Id)"
            >
              <div class="card">
                <div class="card-content">
                  <span class="activator grey-text text-darken-4">
                    Khach hang: {{c.Name}}
                    <i class="material-icons right">more_vert</i></span><br />
                  <span class="">Dia diem : {{c.Address}}</span><br />
                  <div v-if="c.Status==0">
                    <span class="red-text text-darken-2">Chua dinh vi</span><br />
                  </div>
                  <div v-if="c.Status==1">
                    <span class="blue-text text-darken-2">Da dinh vi</span><br />
                  </div>
                  <div v-if="c.Status==2">
                    <span class="green-text text-accent-3">Da co xe nhan</span><br />
                  </div>
                  <div v-if="c.Status==3">
                    <span class="yellow-text text-darken-2">Dang di chuyen</span><br />
                    <span class="yellow-text text-darken-2">Tai xe</span><br />
                  </div>
                  <div v-if="c.Status==4">
                    <span class="grey-text text-darken-2">Da hoan thanh</span>
                  </div>

                </div>
                <div class="card-reveal">
                  <span class="card-title  activator grey-text text-darken-4"><i class="material-icons right">close</i></span>
                  <span class="red-text text-darken-2">Ghi chu: {{c.Note}} </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col s3">
      <div class="input-group">
        <div>
          Driver info
          <ul>
            <li
              v-for="c in listDriver"
              :key="c.Id"
              href="javascript:;"
              class="list-group-item"
              :class="{active: c.Id === selectedIdDriver}"
              @click="getDriver(c.Id)"
            >
              <div>Ho ten: {{c.Name}}</div>
              <div>Dia chi: {{c.Address}}</div>
              <div v-if="c.Status==0">Trang thai: <font style="color:grey">Offline</font>
              </div>
              <div v-if="c.Status==1">Trang thai: <b style="color:green">Online</b>
              </div>
              <div v-if="c.Status==2">Trang thai: <font style="color:yellow">Dang don khach</font>
              </div>
              <div v-if="c.Status==3">Trang thai: <font style="color:orange">Dang cho khach</font>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="col s6">
      <button @click="handleRequest">test 1</button>
      <button @click="handleRequest2">test 2</button>
      <button @click="createFakeMoving">test 3</button>
      <button @click="startRouteAnimation">test 4</button>
      <gmap-map
        ref="mapRef"
        :center="center"
        :zoom="12"
        style="width:100%;  height: 400px;"
      >
        <gmap-marker
          ref="myMarker"
          v-bind:position="oldPosition"
          :draggable="true"
          :icon="{ url: require('../assets/automobile.png')}"
        ></gmap-marker>
      </gmap-map>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

export default {
	name: 'App3',

	data() {
		return {
			listRequest: [],
			listDriver: [],
			selectedIdRequest: -1,
			selectedIdDriver: -1,

			directionsDisplay: null,

			center: { lat: 10.77191, lng: 106.65358 },
			markers: [],
			places: [],
			coordinates: {},
			currentPlace: null,

			socket: io('localhost:1234'),

			marker: null,
			i: 0,
			oldPosition: {
				lat: 10.8267449758182,
				lng: 106.688824563477
			},
			newPosition: {
				lat: 10.7711932938878,
				lng: 106.653494169312
			},

			autoDriveSteps: [],
			speedFactor: 10
		};
	},

	mounted() {
		var self = this;
		axios
			.get('http://localhost:1234/Request')
			.then(res => {
				self.listRequest = res.data;
			})
			.catch(err => {
				console.log(err);
			});
		axios
			.get('http://localhost:1234/User2')
			.then(res => {
				self.listDriver = res.data;
			})
			.catch(err => {
				console.log(err);
			});

		self.geolocate(); //create map

		self.socket.on('load-new-request', data => {
			// load list request
			console.log(data);
			self.listRequest = data;
		});

		self.socket.on('load-all-driver', data => {
			//load list driver
			console.log(data);
			self.listDriver = data;
		});

		self.socket.on('hi there', data => {
			console.log(data);
			alert('123');
		});
	},

	methods: {
		getRequest(id) {
			var self = this;
			self.selectedIdRequest = id;
			console.log('request: ' + id);



		},
		getDriver(id) {
			var self = this;
			self.selectedIdDriver = id;
			console.log('driver: ' + id);
		},
		handleRequest2() {
			var self = this;
			self.marker.setPosition(self.newPosition);
		},
		handleRequest() {
			var self = this;
			self.directionsService = new google.maps.DirectionsService();
			self.directionsDisplay.setMap(self.$refs.mapRef.$mapObject);

			var a = {
				lat: 10.8267449758182,
				lng: 106.688824563477
			};
			var b = {
				lat: 10.7711932938878,
				lng: 106.653494169312
			};
			console.log('driver LatLng : ');
			console.log(a);
			console.log('customer LatLng : ');
			console.log(b);

			self.directionsService.route(
				{
					origin: a,
					destination: b,
					travelMode: 'DRIVING'
				},
				function(response, status) {
					if (status === 'OK') {
						self.directionsDisplay.setDirections(response);
						console.log('driving ok');

						// calculate positions for the animation steps
						// the result is an array of LatLng, stored in autoDriveSteps
						//autoDriveSteps = new Array();
						var remainingSeconds = 0;
						var leg = response.routes[0].legs[0]; // supporting single route, single legs currently
						leg.steps.forEach(function(step) {
							var stepSeconds = step.duration.value;
							var nextStopSeconds = self.speedFactor - remainingSeconds;
							while (nextStopSeconds <= stepSeconds) {
								var nextStopLatLng = self.getPointBetween(
									step.start_location,
									step.end_location,
									nextStopSeconds / stepSeconds
								);
								self.autoDriveSteps.push(nextStopLatLng);
								nextStopSeconds += self.speedFactor;
							}
							remainingSeconds =
								stepSeconds + self.speedFactor - nextStopSeconds;
						});
						if (remainingSeconds > 0) {
							console.log('pust autodrivesteps');
							console.log(self.autoDriveSteps);
							self.autoDriveSteps.push(leg.end_location);
						}
					} else {
						console.log('Directions request failed due to ' + status);
					}
				}
			);
			console.log('autoDriveSteps length is: ');
			console.log(self.autoDriveSteps.length);

			//self.startRouteAnimation();
		},
		getPointBetween(a, b, ratio) {
			// helper method to calculate a point between A and B at some ratio
			return new google.maps.LatLng(
				a.lat() + (b.lat() - a.lat()) * ratio,
				a.lng() + (b.lng() - a.lng()) * ratio
			);
		},
		startRouteAnimation() {
			var self = this;
			// start the route simulation
			console.log('autoDriveSteps length is: ');
			console.log(self.autoDriveSteps.length);
			var autoDriveTimer = setInterval(function() {
				// stop the timer if the route is finished
				if (self.autoDriveSteps && self.autoDriveSteps.length == 0) {
					clearInterval(autoDriveTimer);
				} else {
					// move marker to the next position (always the first in the array)
					console.log('self.autoDriveSteps');
					console.log(self.autoDriveSteps);
					console.log('self.autoDriveSteps.length');
					console.log(self.autoDriveSteps.length);
					console.log('set positon here ');
					console.log(self.autoDriveSteps[0]);
					self.marker.setPosition(self.autoDriveSteps[0]);
					// remove the processed position
					self.autoDriveSteps.shift();
				}
			}, 50);
		},
		createFakeMoving() {
			var self = this;
			var steps = 72;
			var timerInterval = 5000; // every step takes 50ms
			// we calculate the temporary position
			for (let i = 1; i <= steps; i++) {
				let tempPosition = {
					lat:
						self.oldPosition.lat +
						(i * (self.newPosition.lat - self.oldPosition.lat)) / steps,
					lng:
						self.oldPosition.lng +
						(i * (self.newPosition.lng - self.oldPosition.lng)) / steps
				};

				setTimeout(() => {
					let x = tempPosition;
					console.log(tempPosition);
					self.marker.setPosition(x);
				}, i * 1000);

			}
		},
		updateFakeMoving(movingPosition) {
			var self = this;
			setTimeout(function() {
				self.marker.setPosition(movingPosition);
				console.log(movingPosition);
			}, 2000);
		},
		geolocate: function() {
			var self = this;
			navigator.geolocation.getCurrentPosition(position => {});
			setTimeout(function() {
				self.directionsDisplay = new google.maps.DirectionsRenderer();
				self.marker = self.$refs.myMarker.$markerObject;
				// self.marker = new google.maps.Marker({
				// 	position: new google.maps.LatLng(50.8, 4.7),
				// 	map: self.$refs.mapRef.$mapObject
				// });
				//console.log(self.marker);
			}, 2000); // async this after create map
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
	width: 100%;
}
a {
	color: #42b983;
}
</style>
