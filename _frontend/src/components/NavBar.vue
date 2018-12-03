<template>
  <div>
    <nav class="nav-wrapper indigo">
      <div class="container">
        <a class="brand-logo">
          <router-link to="/">title</router-link>
        </a>

        <a
          class="sidenav-trigger"
          data-target="mobile-link"
        >
          <i class="material-icons">menu</i>
        </a>
        <ul class="right hide-on-med-and-down">
          <li>
            <router-link to="/App1">App1</router-link>
          </li>
          <li>
            <router-link to="/App2">App2</router-link>
          </li>
          <li>
            <router-link to="/App3">App3</router-link>
          </li>
          <li>
            <router-link to="/App4">App4</router-link>
          </li>
          <li>
            <router-link to="/Login">Login</router-link>
          </li>
          <li>
            <a
              class='usdrop'
              href='#'
              data-target='userdropdown'
            >User</a>
          </li>
          <li><a
              class="dropdown-trigger"
              data-target="dropdown1"
              href="#plan"
            >Test<i class="material-icons right">arrow_drop_down</i></a></li>

        </ul>

      </div>
      <ul
        id="dropdown1"
        class="dropdown-content nested"
      >
        <li><a href="#">Info</a></li>
        <li><a href="#">Logout</a></li>
      </ul>

    </nav>
    <ul
      class="sidenav"
      id="mobile-link"
    >
      <li>
        <router-link to="/App1">App1</router-link>
      </li>
      <li>
        <router-link to="/App2">App2</router-link>
      </li>
      <li>
        <router-link to="/App3">App3</router-link>
      </li>
      <li>
        <router-link to="/App4">App4</router-link>
      </li>
      <li>
        <router-link to="/Login">Login</router-link>
      </li>
      <li>
        <router-link>Logout</router-link>
      </li>
    </ul>

  </div>
</template>
<style scoped>
.dropdown-content {
	background-color: #3f51b5 !important;
	margin: 0;
	display: none;
	min-width: 150px; /* Changed this to accomodate content width */
	max-height: auto;
	margin-left: -1px; /* Add this to keep dropdown in line with edge of navbar */
	overflow: hidden; /* Changed this from overflow-y:auto; to overflow:hidden; */
	opacity: 0;
	position: absolute;
	white-space: nowrap;
	z-index: 1;
	will-change: width, height;
}
.dropdown-content li > span {
	color: #3f51b5 !important;
}
</style>
