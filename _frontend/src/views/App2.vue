<template>
  <div
    class="container-fluid fadeInDown animated "
    style="background-color: #f2f2f2"
  >
    <div class="row">
      <div class="col-md-3">
        <h5 class="pt-3"><strong style="color:#00BA51;">Danh sách yêu cầu {{list.length}}</strong></h5>
      </div>
      <div class="col-md-9">
        <div
          class="row "
          style="padding-left: 15px;"
        >
          <button
            @click="locatePlace"
            class="btn btn-success btn-rounded waves-effect"
            type="button"
            name="action"
          ><i
              class="fas fa-cogs pr-2"
              aria-hidden="true"
            ></i>Xác nhận vị trí
          </button>

        </div>
      </div>
    </div>
    <div class="row">
      <div
        class="col-md-3  cus-scrollbar style-1"
        style="height: 500px; overflow-y: auto;"
      >

        <div
          class="mt-3 list-group hoverable style-1  " style="height: 130px;overflow-y: auto;overflow-x: hidden"
          v-for="c in list"
          :key="c.Id"
          href="javascript:;"
          :class="{active: c.Id === selectedId}"
          @click="getThisPlace(c.Id,c.Address)"
        >
          <!-- Item -->
          <a
            target="_blank"
            href="javascript:;"
            class="card  list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <div>
              <p class="green-text mb-0"><i class="fa fa-user"></i>
                <font class="black-text font-weight-bold"> {{c.Name}}</font>
              </p>
              <p class="green-text mb-0"><i class="fa fa-map-marker"></i>
                <font class="black-text "> {{c.Address}}</font>
              </p>
              <p class="green-text mb-0"><i class="fa fa-phone"></i>
                <font class="black-text"> {{c.Phone}}</font>
              </p>
              <p class="green-text mb-0"><i class="fa fa-sticky-note"></i>
                <font class="black-text"> {{c.Note}}</font>
              </p>

            </div>

            <i
              class="fa fa-chevron-right"
              style="font-size: 1.3rem;"
            ></i>
          </a>
          <!-- Item -->
        </div>

      </div>
      <div class="col-md-9">

        <div id="myMap">

          <gmap-map
            :center="center"
            :zoom="12"
            style="width:100%;  height: 100%;"
            ref="mapRef"
          >
            <gmap-marker
              ref="myMarker"
              :draggable="true"
              v-bind:position="coordinates"
              @dragend="updateCoordinates"
            ></gmap-marker>
            <!-- :icon="{ url: require('../assets/automobile.png')}" -->
          </gmap-map>
        </div>
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
			center: { lat: 10.77191, lng: 106.65358 },
			coordinates: null,
			Rcoordinates: null,
			currentPlace: null,
			marker: null,
			socket: io('localhost:1234')
		};
	},

	mounted() {
		var self = this;
		axios
			.get('http://localhost:1234/Request/req-unidentified')
			.then(res => {
				self.list = res.data;
			})
			.catch(err => {
				console.log(err);
			});
		self.geolocate(); // map

		self.socket.on('load-new-request', data => {
			// console.log(data);
			self.list = data;
		});

		self.$refs.mapRef.$mapPromise.then(map => {
			self.marker = self.$refs.myMarker.$markerObject;
			// console.log(self.marker);
		});
	},

	methods: {
		getThisPlace(id, place) {
			var self = this;
			self.selectedId = id;

			var geocoder = new google.maps.Geocoder();
			var address = place;
			geocoder.geocode({ address: address }, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();
					console.log(latitude + '/' + longitude);
					self.coordinates = {
						lat: latitude,
						lng: longitude
					};
					var marker2 = self.$refs.myMarker.$markerObject;
					marker2.setPosition(self.coordinates);
					self.center = self.coordinates;
				}
			});
		},

		updateCoordinates(location) {
			var self = this;
			self.Rcoordinates = {
				lat: location.latLng.lat(),
				lng: location.latLng.lng()
			};
			toastr.remove();
			toastr.clear();
			toastr.success('Thay đổi vị trí thành công.', {
				autoDismiss: true,
				maxOpened: 1,
				newestOnTop: true,
				extendedTimeOut: 1000,
				tapToDismiss: true,
				timeOut: 1000
			});
		},

		locatePlace() {
			toastr.remove();
			toastr.clear();

			var self = this;

			if (!self.coordinates) {
				toastr.error('Xác nhận vị trí thất bại.', { timeOut: 3000 });
				return;
			}
			if (self.Rcoordinates == null) {
				self.Rcoordinates = self.coordinates;
				//console.log('Rcoordinates null')
			}

			var newReq = {
				Id: self.selectedId,
				Lat: self.coordinates.lat,
				Lng: self.coordinates.lng,
				RLat: self.Rcoordinates.lat,
				RLng: self.Rcoordinates.lng
			};
			console.log(newReq);
			self.socket.emit('identify-location', newReq);
			toastr.success('Xác nhận vị trí thành công', { timeOut: 3000 });
		},

		geolocate: function() {
			var self = this;
			navigator.geolocation.getCurrentPosition(position => {
				self.center = {
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
.card {
	flex-direction: unset;
}
#myMap {
	height: 500px;
	width: 100%;
}
</style>
