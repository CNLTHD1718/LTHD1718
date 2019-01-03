<template>
	<div class="view intro-2" style="">
		<div class="full-bg-img">
			<div class="mask rgba-purple-light flex-center">
				<div class="container text-center white-text wow fadeInUp animated" style="visibility: visible; animation-name: fadeInUp;">
					<h2>This Navbar is fixed and transparent</h2>
					<br>
					<h5>It will always stay visible on the top, even when you scroll down</h5>
					<p>Navbar's background will switch from transparent to solid color while scrolling down</p>
					<br>
					<p>Full page intro with background image will be always displayed in full screen mode, regardless of device </p>
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


</style>
