<template>
  <div class="row">
    <div
      class="col s12"
      style="padding-top:10px"
    >
      <div class="col s3">
        <blockquote>
         List request
        </blockquote>
      </div>
      <div class="col s9">
        <button
          @click="locatePlace"
          class="btn waves-effect waves-light"
          type="button"
          name="action"
        >Locate this
          <i class="material-icons right">add_location</i>
        </button>
      </div>
    </div>
    <div class="col s3">
      <div>
        <div id="containlist">
          <ul class="collection">
            <li
              v-for="c in list"
              :key="c.Id"
              href="javascript:;"
              class="collection-item avatar"
              @click="getThisPlace(c.Id,c.Address)"
            >
              <div class="card">
                <div class="card-content">
                  <span class="title">Ho ten: {{c.Name}}</span>
                  <p>Dia diem: {{c.Address}} <br>
                    Ghi chu: {{c.Note}}
                  </p>
                  <a
                    href="#!"
                    class="secondary-content"
                  ><i class="material-icons">location_searching</i></a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>
    <div class="col s9">
      <div id="myMap">
        <gmap-map
          :center="center"
          :zoom="12"
          style="width:100%;  height: 400px;"
          ref="mapRef"
        >
          <!-- <gmap-marker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="center=m.position"
            :draggable="true"
            @drag="updateCoordinates"
          ></gmap-marker> -->
          <gmap-marker
            ref="myMarker"
            :draggable="true"
            v-bind:position="coordinates"
            :icon="{ url: require('../assets/automobile.png')}"
            @dragend="updateCoordinates"
          ></gmap-marker>
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

			center: { lat: 10.77191, lng: 106.65358 },
			markers: [],
			places: [],
			coordinates: null,
			currentPlace: null,
			marker: null,
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
		self.geolocate(); // map

		self.socket.on('load-new-request', data => {
			console.log(data);
			//alert('receive');
			self.list = data;
		});
		self.$refs.mapRef.$mapPromise.then(map => {
			self.marker = self.$refs.myMarker.$markerObject;
			console.log(self.marker);
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
					//self.marker.setPosition(self.coordinates);
					var marker2 = self.$refs.myMarker.$markerObject;
					marker2.setPosition(self.coordinates);
					self.center = self.coordinates;
				}
			});
		},

		updateCoordinates(location) {
			var self = this;
			self.coordinates = {
				lat: location.latLng.lat(),
				lng: location.latLng.lng()
			};
		},

		locatePlace() {
			var self = this;
			var objToPost = {
				Id: self.selectedId,
				Lat: self.coordinates.lat,
				Lng: self.coordinates.lng
			};
			console.log(objToPost);

			var newReq = {
				Id: self.selectedId,
				Lat: self.coordinates.lat,
				Lng: self.coordinates.lng
			};
			self.socket.emit('identify-location', newReq);
			M.toast({ html: 'Located Success', classes: 'light-blue accent-3' });
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
#containlist {
	overflow-y: scroll;
	min-width: 200px;
	height: 550px;
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
	margin: 0 0px;
	width: 100%;
}
a {
	color: #42b983;
}
.collection .collection-item {
	padding: 0px 0px !important;
}
.card {
	margin: 0rem 0 0rem 0;
}
</style>
