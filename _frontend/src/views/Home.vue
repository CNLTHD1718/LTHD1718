<template>
  <div class="bg">
    <div class="row d-flex justify-content-center">
      <div class="col-4">

        <!-- Card -->
        <div class="card card-cascade">

          <!-- Card image -->
          <div class="view view-cascade gradient-card-header peach-gradient">
            <!-- Title -->
            <h4
              class="card-header-title mt-3 font-weight-bold "
              style="color: white;"
            >
              <center>Đồ Án: Công Nghệ Lập Trình Hiện Đại</center>
            </h4>
          </div>

          <!-- Card content -->
          <div class="card-body card-body-cascade text-center">

            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <p class="mb-0"><i class="fas fa-user"></i>
                  1742013 - Nguyễn Ngọc Bình Dương</p>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <p class="mb-0"><i class="fas fa-user"></i>
                  1742062 - Bạch Xuân Thắng
                </p>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <p class="mb-0"><i class="fas fa-user"></i>
                  1742066 - Trịnh Văn Thịnh </p>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <p class="mb-0"><i class="fas fa-user"></i>
                  1742087 - Nguyễn Đình Vương </p>
              </li>
            </ul>
          </div>

          <!-- Card -->

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'HelloWorld'
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .card-body {
	padding: 0.1rem !important;
} */
html {
	height: 100% !important;
	margin: 0;
}

.bg {
	/* The image used */
	background-image: url(https://www.grab.com/vn/wp-content/uploads/sites/11/2016/08/bike_banner.jpg);
	/* Full height */
	height: 50%;

	/* Center and scale the image nicely */
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
