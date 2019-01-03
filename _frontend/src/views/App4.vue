<template>
  <div
    class="col s4"
    style="margin:0 auto;"
  >
    <div id="dStatus" class="row d-flex justify-content-center cus-scrollbar style-1">
      <button
        id="btnOn"
        class="btn waves-effect waves-light btn-success"
        type="button"
        name="action"
		style="width:45%"
        @click="changeStatus(1)"
      ><i
          class="fa fa-power-off"
          aria-hidden="true"
        ></i>
        Bắt Đầu Nhận khách
      </button>

      <button
        id="btnOff"
        class="btn waves-effect waves-light pulse btn-success"
        type="button"
        name="action"
        style="opacity: .4;display:none;width:45%"
        @click="changeStatus(0)"
      >Đang chờ khách...
      </button>

      <button
        id="btnChangePlace"
        class="btn btn-primary"
        type="button"
        name="action"
		style="width:45%"
        @click="changePlace"
      >Thay đổi vị trí
      </button>
      <button
        id="btnSave"
        class="btn btn-primary"
        type="button"
        name="action"
        style="display:none;width:45%"
        @click="savechange"
      >Xác nhận thay đổi
      </button>
    </div>
    <gmap-map
      ref="mapRef"
      :center="center"
      :zoom="18"
      style="width:100%;  height: 400px;"
    >
      <gmap-marker
        ref="myMarker"
        v-bind:position="coordinates"
        :draggable="true"
        :icon="{ url: require('../assets/motobike.png')}"
        @dragend="updateCoordinates"
      ></gmap-marker>
    </gmap-map>

    <!-- Button trigger modal -->
    <button
      type="button"
      class="btn btn-primary"
      data-toggle="modal"
      @click="openmodal"
      style="display:none"
    >
      Launch demo modal
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modalreq"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-body">
            <div class="col-lg-7">

              <!-- Category -->
              <a
                href="#!"
                class="green-text"
              >
                <h6 class="font-weight-bold mb-1"><i class="fas fa-suitcase pr-2"></i>Nhận được yêu cầu mới</h6>
              </a>
              <!-- Post title -->
              <h5 class="mb-2">Vị trí: </h5>
              <h5 class="mb-2">Cách: 10km</h5>
              <h5 class="mb-2">SĐT: </h5>
              <h5 class="mb-2">Ghi chú</h5>

            </div>
            <!-- Grid column -->
            <div
              id="modelRequest1"
              class="btn-group"
              role="group"
              style="width: 100%;"
            >
              <button
                type="button"
                class="btn btn-success btnm"
                @click="acceptRequest()"
              >Chấp nhận</button>
              <button
                type="button"
                class="btn btn-red btnm"
                @click="declineRequest()"
              >Từ chối</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      style="width: 100%;display:none"
      id="modelProcess"
    >
      <button
        id='btnStart'
        @click="startRequest"
        class="btn waves-effect waves-light green"
        type="button"
        style="height: 50px;width: 100%;"
      >
        Bắt đầu</button>
      <button
        id='btnEnd'
        @click="doneRequest"
        class="btn waves-effect waves-light green"
        type="button"
        style="height: 50px;width: 100%;display:none"
      >
        Đến nơi</button>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';
import haversine from 'haversine';
import $AB from 'jquery';
export default {
	name: 'App4',

	data() {
		return {
			isOnline: false,
			timeOut: null,
			isDismiss: 0,
			isChangePosition: 0,
			directionsDisplay: null,
			center: { lat: 10.77191, lng: 106.65358 },
			tempPosition: null,
			circle: null,
			coordinates: { lat: 10.77191, lng: 106.65358 },
			currentPlace: null,
			fillColor1: '#0000FF',

			customer_LatLng: {},
			driver: null,
			req_id: null,
			req_for_driver: {},
			socket: io('localhost:1234')
			//mapSettings
		};
	},

	mounted() {
		var self = this;

		$AB(document).ready(function() {
			$('#modalreq').on('hidden.bs.modal', function() {
				if (self.isDismiss == 1) self.declineRequest();
			});
		});
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
		self.driver = JSON.parse(localStorage.getItem('UserObj'));
		self.$refs.mapRef.$mapPromise
			.then(map => {
				//map.panTo({ lat: 1.38, lng: 103.8 });
				self.directionsDisplay = new google.maps.DirectionsRenderer();
				console.log('success set self.directionsDisplay');
				self.circle = new google.maps.Circle({
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

		self.socket.emit('add-user', { username: self.$store.state.user.Id }); //register username to socket server

		console.log('add user socket' + self.$store.state.user.Id);

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
				u_id: self.$store.state.user.Id,
				req_id: data.Id,
				dlat:self.coordinates.lat,
				dlng:self.coordinates.lng,
				rlat:self.customer_LatLng.lat,
				rlng:self.customer_LatLng.lng
			};
			self.showNewRequest();
			console.log('driver-receive-new-request from server ' + data);
		});
	},

	methods: {
		changePlace() {
			var self = this;
			$('#btnSave').show();
			$('#btnChangePlace').hide();
			self.isChangePosition = 1;
			self.tempPosition = self.center;
		},
		changePosition(location) {
			var self = this;
			self.tempPosition = {
				lat: location.latLng.lat(),
				lng: location.latLng.lng()
			};
		},
		savechange() {
			var self = this;
			self.isChangePosition = 0;
			self.coordinates = self.tempPosition;
			self.center = self.tempPosition;
			var marker = self.$refs.myMarker.$markerObject;
			marker.setPosition(self.center);
			self.circle.setCenter(self.center);

			var newReq = {
				Id: self.$store.state.user.Id,
				Lat: self.coordinates.lat,
				Lng: self.coordinates.lng
			};
			self.socket.emit('driver-change-location', newReq);
			$('#btnSave').hide();
			$('#btnChangePlace').show();
			toastr.remove();
			toastr.clear();
			toastr.success('Thay đổi vị trí thành công', { timeOut: 500 });
		},
		openmodal() {
			$('#modalreq').modal('show');
		},
		acceptRequest() {
			var self = this;
			self.isDismiss = 0;
			$('#modalreq').modal('hide');
			clearTimeout(self.timeOut);
			console.log('driver accept request');
			console.log(self.req_for_driver);
			self.socket.emit('driver-accept-request', self.req_for_driver);
			self.showDirectionFromDriverToCustomer();
			$('#modelProcess').fadeIn();
			$('#dStatus').hide();
			$('#dStatus').removeClass('d-flex');

			toastr.remove();
			toastr.clear();
			toastr.success('Chấp nhận yêu cầu thành công', { timeOut: 500 });
		},
		declineRequest() {
			var self = this;
			self.isDismiss = 0;
			$('#modalreq').modal('hide');
			clearTimeout(self.timeOut);
			self.socket.emit('driver-decline-request', self.req_for_driver);

			toastr.remove();
			toastr.clear();
			toastr.warning('Bạn đã từ chối yêu cầu', { timeOut: 500 });
		},
		startRequest() {
			var self = this;
			self.socket.emit('driver-start-request', self.req_for_driver);

			$('#btnStart').hide();
			$('#btnEnd').show();
		},
		doneRequest() {
			var self = this;
			self.socket.emit('driver-done-request', self.req_for_driver);
			self.updateDriverLocationAfterDone();
			self.directionsDisplay.setMap(null); //delete previous direction

			toastr.success('Bạn đã hoàn thành chuyến.', { timeOut: 3000 });
			$('#modelProcess').fadeOut();
			$('#dStatus').fadeIn();
			$('#dStatus').addClass('d-flex');

			$('#btnStart').fadeIn();
			$('#btnEnd').fadeOut();
		},
		showNewRequest() {
			var self = this;
			self.isDismiss = 1;
			$('#modalreq').modal('show');
			self.timeOut = setTimeout(function() {
				self.declineRequest();
			}, 10000);
		},
		changeStatus(x) {
			var self = this;
			if (x == 0) {
				$('#btnOff').hide();
				$('#btnOn').show();
			} else {
				$('#btnOn').hide();
				$('#btnOff').show();
			}
			var newReq = {
				Id: self.$store.state.user.Id,
				Status: x
			};
			self.socket.emit('driver-change-status', newReq);
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
			var newReq = {
				Id: self.$store.state.user.Id,
				Lat: self.customer_LatLng.lat,
				Lng: self.customer_LatLng.lng
			};
			self.socket.emit('driver-change-location', newReq);
		},

		updateCoordinates(location) {
			toastr.remove();
			toastr.clear();
			var self = this;
			if (self.isChangePosition == 1) {
				self.changePosition(location);
				return;
			}
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
				toastr.success('Cập nhật vị trí thành công.', { timeOut: 500 });
				console.log('change location success');
				var driver = self.$store.state.user;
				var newReq = {
					Id: driver.Id,
					Lat: self.coordinates.lat,
					Lng: self.coordinates.lng
				};
				self.socket.emit('driver-change-location', newReq);
			} else {
				toastr.error('Phạm vi thay đổi tối đa 100m');
				self.coordinates = self.center;
				var marker = self.$refs.myMarker.$markerObject;
				marker.setPosition(self.center);
			}
		},
		geolocate() {
			var self = this;
			return new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(position => {
					if (
						self.$store.state.user.Lat == null ||
						self.$store.state.user.Lat == ''
					) {
						self.center = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
						self.coordinates = self.center;
						var newReq = {
							Id: self.$store.state.user.Id,
							Lat: self.coordinates.lat,
							Lng: self.coordinates.lng
						};
						console.log('Location default');
						setTimeout(function() {
							self.socket.emit('driver-change-location', newReq);
						}, 2000);
					} else {
						console.log('lat not null');
						console.log(self.$store.state.user.Lat);
					}
					//console.log(position);
				});
				resolve();
			});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.btnm {
	width: 50%;
}
.modal-body {
	padding: 0px !important;
	padding-top: 1rem !important;
}
</style>
