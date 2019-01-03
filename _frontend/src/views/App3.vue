<template>
  <div
    class="container-fluid fadeInDown animated "
    style="background-color: #f2f2f2;"
  >
    <div
      class="row d-flex justify-content-center"
      style="background-color: #f2f2f2;"
    >
      <h3 class="font-weight-bold green-text">Danh sách yêu cầu</h3>
    </div>
    <div class="row">
      <div class="col-1-5 cus-scrollbar style-1">
        <h4>
          <span class="badge badge-danger">Chưa Định Vị </span>
          <span class="badge badge-danger fr"> {{listRequest0.length}}</span>
        </h4>
        <div
          class="list-group"
          v-for="c in listRequest0"
          :key="c.Id"
          href="javascript:;"
          :class="{active: c.Id === selectedIdRequest}"
          @click="getRequest(c.Id)"
        >

          <!-- Card Narrower -->
          <div class="card card-cascade narrower hoverable style-1" style="height: 130px;overflow-y: auto;">
            <!-- Card content -->
            <a href="javascript:;">
              <div class="card-body card-body-cascade">
                <!-- Label -->
                <h6 class="green-text"><i class="fa fa-calendar"></i>
                  <font class="black-text font-weight-bold"> {{c.DateCreate}}</font>
                </h6>
                <h6 class="green-text"><i class="fa fa-user"></i>
                  <font class="black-text font-weight-bold"> {{c.Name}}</font>
                </h6>
                <!-- Title -->
                <h6 class="green-text"><i class="fa fa-map-marker"></i>
                  <font class="black-text "> {{c.Address}}</font>
                </h6>
                <!-- Text -->
                <h6 class="green-text"><i class="fa fa-sticky-note"></i>
                  <font class="black-text "> {{c.Note}}</font>
                </h6>
              </div>
            </a>
          </div>
          <!-- Card Narrower -->

        </div>

      </div>
      <div class="col-1-5 cus-scrollbar style-1">
        <h4><span class="badge badge-primary">Đã Định Vị</span>
          <span class="badge badge-primary fr"> {{listRequest1.length}}</span></h4>
        <div
          class="list-group"
          v-for="c in listRequest1"
          :key="c.Id"
          href="javascript:;"
          :class="{active: c.Id === selectedIdRequest}"
          @click="getRequest(c.Id)"
        >

          <!-- Card Narrower -->
          <div class="card card-cascade narrower hoverable style-1" style="height: 130px;overflow-y: auto;">
            <!-- Card content -->
            <a href="javascript:;">
              <div class="card-body card-body-cascade">
                <h6 class="green-text"><i class="fa fa-calendar"></i>
                  <font class="black-text font-weight-bold"> {{c.DateCreate}}</font>
                </h6>
                <!-- Label -->
                <h6 class="green-text"><i class="fa fa-user"></i>
                  <font class="black-text font-weight-bold"> {{c.Name}}</font>
                </h6>
                <!-- Title -->
                <h6 class="green-text"><i class="fa fa-map-marker"></i>
                  <font class="black-text "> {{c.Address}}</font>
                </h6>
                <!-- Text -->
                <h6 class="green-text"><i class="fa fa-sticky-note"></i>
                  <font class="black-text "> {{c.Note}}</font>
                </h6>

              </div>
            </a>
          </div>
          <!-- Card Narrower -->

        </div>
      </div>
      <div class="col-1-5 cus-scrollbar style-1">
        <h4><span class="badge badge-success">Đã Có Xe Nhận</span>
          <span class="badge badge-success fr"> {{listRequest2.length}}</span></h4>
        <div
          class="list-group"
          v-for="c in listRequest2"
          :key="c.Id"
          href="javascript:;"
          :class="{active: c.Id === selectedIdRequest}"
          @click="getRequest(c.Id)"
        >

          <!-- Card Narrower -->
          <div class="card card-cascade narrower hoverable style-1" style="height: 130px;overflow-y: auto;">
            <!-- Card content -->
            <a href="javascript:;">
              <div class="card-body card-body-cascade">
                <h6 class="green-text"><i class="fa fa-calendar"></i>
                  <font class="black-text font-weight-bold"> {{c.DateCreate}}</font>
                </h6>
                <!-- Label -->
                <h6 class="green-text"><i class="fa fa-user"></i>
                  <font class="black-text font-weight-bold"> {{c.Name}}</font>
                </h6>
                <!-- Title -->
                <h6 class="green-text"><i class="fa fa-map-marker"></i>
                  <font class="black-text "> {{c.Address}}</font>
                </h6>
                <!-- Text -->
                <h6 class="green-text"><i class="fa fa-sticky-note"></i>
                  <font class="black-text "> {{c.Note}}</font>
                </h6>

              </div>
            </a>
          </div>
          <!-- Card Narrower -->

        </div>
      </div>
      <div class="col-1-5 cus-scrollbar style-1">
        <h4><span class="badge badge-warning">Đang Di Chuyển</span>
          <span class="badge badge-warning fr"> {{listRequest3.length}}</span></h4>
        <div
          class="list-group"
          v-for="c in listRequest3"
          :key="c.Id"
          href="javascript:;"
          :class="{active: c.Id === selectedIdRequest}"
          @click="getRequest(c.Id)"
        >

          <!-- Card Narrower -->
          <div class="card card-cascade narrower hoverable style-1" style="height: 130px;overflow-y: auto;">
            <!-- Card content -->
            <a href="javascript:;">
              <div class="card-body card-body-cascade">
                <h6 class="green-text"><i class="fa fa-calendar"></i>
                  <font class="black-text font-weight-bold"> {{c.DateCreate}}</font>
                </h6>
                <!-- Label -->
                <h6 class="green-text"><i class="fa fa-user"></i>
                  <font class="black-text font-weight-bold"> {{c.Name}}</font>
                </h6>
                <!-- Title -->
                <h6 class="green-text"><i class="fa fa-map-marker"></i>
                  <font class="black-text "> {{c.Address}}</font>
                </h6>
                <!-- Text -->
                <h6 class="green-text"><i class="fa fa-sticky-note"></i>
                  <font class="black-text "> {{c.Note}}</font>
                </h6>

              </div>
            </a>
          </div>
          <!-- Card Narrower -->

        </div>
      </div>
      <div class="col-1-5 cus-scrollbar style-1">
        <h4><span class="badge badge-light">Đã Hoàn Tất</span>
          <span class="badge badge-light fr"> {{listRequest4.length}}</span></h4>
        <div
          class="list-group"
          v-for="c in listRequest4"
          :key="c.Id"
          href="javascript:;"
          :class="{active: c.Id === selectedIdRequest}"
          @click="getRequest(c.Id)"
          data-toggle="modal" data-target="#modalreq"
        >

          <!-- Card Narrower -->
          <div class="card card-cascade narrower hoverable style-1" style="height: 130px;overflow-y: auto;">
            <!-- Card content -->
            <a href="javascript:;">
              <div class="card-body card-body-cascade">
                <h6 class="green-text"><i class="fa fa-calendar"></i>
                  <font class="black-text font-weight-bold"> {{c.DateCreate}}</font>
                </h6>
                <!-- Label -->
                <h6 class="green-text"><i class="fa fa-user"></i>
                  <font class="black-text font-weight-bold"> {{c.Name}}</font>
                </h6>
                <!-- Title -->
                <h6 class="green-text"><i class="fa fa-map-marker"></i>
                  <font class="black-text "> {{c.Address}}</font>
                </h6>
                <!-- Text -->
                <h6 class="green-text"><i class="fa fa-sticky-note"></i>
                  <font class="black-text "> {{c.Note}}</font>
                </h6>

              </div>
            </a>
          </div>
          <!-- Card Narrower -->

        </div>
      </div>
    </div>



    <!-- Modal -->
    <div class="modal fade top" id="modalreq" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="false" style="display: none; padding-right: 17px;">
    <div class="row d-flex justify-content-center col-7 modal-dialog modal-full-height modal-top modal-notify modal-success" role="document">
      <!--Content-->
      <div class="modal-content col-10 px-0">
        <!--Header-->
        <div class="modal-header">
          <p class="heading lead">Thông Tin Yêu Cầu</p>

          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" class="white-text">×</span>
          </button>
        </div>

        <!--Body-->
         <div class="modal-body">
            <div
              class="row col-lg-12 "
              style="padding-bottom: 10px; !important"
            >
              <!-- Category -->
              <div class="col-md-6 ">
                <h6 class="font-weight-bold mb-1 green-text"><i class="fas fa-suitcase pr-2"></i>Thông Tin Yêu Cầu</h6>

                <!-- Post title -->
                <!-- Card Narrower -->
                <div class="card card-cascade narrower hoverable  style-1" style="height: 130px;overflow-y: auto;">
                  <!-- Card content -->
                  <a href="javascript:;">
                    <div class="card-body card-body-cascade">
                      <!-- Label -->
                      <h6 class="green-text"><i class="fa fa-user"></i>
                        <font class="black-text font-weight-bold"> {{reqDetail.Name}}</font>
                      </h6>
                      <!-- Title -->
                      <h6 class="green-text"><i class="fa fa-map-marker"></i>
                        <font class="black-text "> {{reqDetail.Address}}</font>
                      </h6>
                      <!-- Title -->
                      <h6 class="green-text"><i class="fa fa-phone"></i>
                        <font class="black-text "> {{reqDetail.Phone}}</font>
                      </h6>
                      <!-- Text -->
                      <h6 class="green-text"><i class="fa fa-sticky-note"></i>
                        <font class="black-text "> {{reqDetail.Note}}</font>
                      </h6>

                    </div>
                  </a>
                </div>
                <!-- Card Narrower -->
              </div>
              <div class="col-md-6 ">
                <h6 class="font-weight-bold mb-1 green-text"><i class="fas fa-car pr-2"></i>Thông Tin Tài Xế</h6>
                <!-- Card Narrower -->
                <div class="card card-cascade narrower style-1" style="height: 130px;overflow-y: auto;">
                  <!-- Card content -->
                  <a href="javascript:;">
                    <div
                      class="card-body card-body-cascade"
                      v-if="reqDetail.DriverUser !== null"
                    >
                      <!-- Label -->
                      <h6 class="green-text"><i class="fa fa-user"></i>
                        <font class="black-text font-weight-bold"> {{reqDetail.DriverName}} ({{reqDetail.DriverUser}})</font>
                      </h6>
                      <!-- Title -->
                      <h6 class="green-text"><i class="fa fa-clock"></i>
                        <font class="black-text ">Tiếp hận : {{reqDetail.TimeAccept}}</font>
                      </h6>
                      <!-- Title -->
                      <h6 class="green-text"><i class="fa fa-clock"></i>
                        <font class="black-text ">Hoàn Thành: {{reqDetail.TimeDone}}</font>
                      </h6>

                    </div>
                    <div
                      class="card-body card-body-cascade"
                      v-else
                    >
                      <h6 class="red-text"><i class="fa fa-clock"></i>
                        <font class="black-text font-weight-bold"> Không có dữ liệu</font>
                      </h6>
                    </div>
                  </a>
                </div>
                <!-- Card Narrower -->
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <!-- <button @click="handleRequest">test 1</button>
                <button @click="handleRequest2">test 2</button>
                <button @click="createFakeMoving">test 3</button>
                <button @click="startRouteAnimation">test 4</button> -->
                <gmap-map
                  :center="center"
                  ref="mapRef"
                  :zoom="12"
                  style="width:100%;  height: 320px;"
                >
                  <!-- :center="center" -->
                  <gmap-marker
                    ref="myMarker"
                    v-bind:position="oldPosition"
                    :draggable="true"
                    :icon="{ url: require('../assets/motobike.png')}"
                  ></gmap-marker>
                </gmap-map>
              </div>
            </div>
          </div>

      </div>
      <!--/.Content-->
    </div>
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
			listRequest0: [],
			listRequest1: [],
			listRequest2: [],
			listRequest3: [],
			listRequest4: [],
			selectedIdRequest: -1,
			reqDetail: {
				ID: null,
				Name: null,
				Address: null,
				Phone: null,
				Note: null,
				Driver: null,
				DriverName: null,
				TimeAccept: null,
				TimeDone: null,
				DriverUser: null
			},
			directionsDisplay: null,
			center: { lat: 10.77191, lng: 106.65358 },
			coordinates: {},
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
				self.reloadRequest(res.data);
			})
			.catch(err => {
				console.log(err);
			});
		self.socket.emit('add-user', { username: self.$store.state.user.Id });
		self.geolocate(); //create map

		self.socket.on('load-all-request', data => {
			var self = this;
			//console.log(data);
			self.reloadRequest(data);
		});

		self.socket.on('receive-detail-request', data => {
			var self = this;
			self.reqDetail = data[0];
			self.showdirect(self.reqDetail);
			//console.log(self.reqDetail);
		});
	},

	methods: {
		showdirect(data) {
			if (data.RLat) {
				var self = this;
				var driver = {
					lat: data.DLat,
					lng: data.DLng
				};
				var request = {
					lat: data.RLat,
					lng: data.RLng
				};

				self.directionsService = new google.maps.DirectionsService();
				self.directionsDisplay.setMap(self.$refs.mapRef.$mapObject);

				self.directionsService.route(
					{
						origin: driver,
						destination: request,
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
			}
		},
		reloadRequest(data) {
			var self = this;
			self.listRequest = data;
			self.listRequest0 = self.listRequest.filter(c => c.Status == 0);
			self.listRequest1 = self.listRequest.filter(c => c.Status == 1);
			self.listRequest2 = self.listRequest.filter(c => c.Status == 2);
			self.listRequest3 = self.listRequest.filter(c => c.Status == 3);
			self.listRequest4 = self.listRequest.filter(c => c.Status == 4);
		},
		getRequest(id) {
			var self = this;
			self.selectedIdRequest = id;
			//console.log('request: ' + id);
			var req = {
				id: self.selectedIdRequest,
				uid: self.$store.state.user.Id
			};
			self.socket.emit('get-detail-request', req);
			$('#modalreq').modal('show');
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
			navigator.geolocation.getCurrentPosition(position => {
				setTimeout(function() {
					self.directionsDisplay = new google.maps.DirectionsRenderer();
					self.marker = self.$refs.myMarker.$markerObject;
					self.center = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
				}, 2000); // async this after create map
			});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
	margin-top: 7px !important;
}
.dvif {
	height: 6px;
}
.col-1-5 {
	width: 20%;
	float: left;
	position: relative;
	min-height: 1px;
	padding-right: 5px;
	padding-left: 5px;
	height: 500px;
	overflow-y: auto;
}
.fr {
	float: right;
}
.mycl3-text {
	color: #65ec46;
}
.card-body {
	padding-top: 8 !important;
	padding-bottom: 0 !important;
}
.modal-header {
	padding: 0.5rem !important;
	padding-right: 1rem !important;
}
</style>
