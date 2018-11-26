<template>
	<div class="row">
		<div class="col-sm-3 col-md-3">
			<div class="list-group">
				<div>
					Request info
					<ul>
						<li v-for="c in listRequest" :key="c.Id" href="javascript:;" class="list-group-item" :class="{active: c.Id === selectedIdRequest}" @click="getRequest(c.Id)">
							<div>Ho ten: {{c.Name}}</div>
							<div>Dia diem: {{c.Address}}</div>
							<div>Ghi chu: {{c.Note}} </div>
							<div v-if="c.Status==0">Trang thai: <font style="color:red">Chua dinh vi</font>
							</div>
							<div v-if="c.Status==1">Trang thai: <font style="color:blue">Da dinh vi </font>
							</div>
							<div v-if="c.Status==2">Trang thai: <font style="color:green">Da co xe nhan </font>
							</div>
							<div v-if="c.Status==3">Trang thai: <font style="color:yellow">Dang di chuyen </font>
							</div>
							<div v-if="c.Status==4">Trang thai: <font style="color:grey">Da hoan thanh </font>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="col-sm-3 col-md-3">
			<div class="input-group">
				<div>
					Driver info
					<ul>
						<li v-for="c in listDriver" :key="c.Id" href="javascript:;" class="list-group-item" :class="{active: c.Id === selectedIdDriver}" @click="getDriver(c.Id)">
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

		<div class="col-sm-6 col-md-6">
			<gmap-map :center="center" :zoom="12" style="width:100%;  height: 400px;">
				<gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" @click="center=m.position" :draggable="true" @drag="updateCoordinates"></gmap-marker>
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

			center: { lat: 10.77191, lng: 106.65358 },
			markers: [],
			places: [],
			coordinates: {},
			currentPlace: null,

			socket: io('localhost:1234')
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

		geolocate: function() {
			navigator.geolocation.getCurrentPosition(position => {});
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
