<template>
  <div>
    <!--Navbar-->
    <nav class="mb-1 navbar navbar-expand-lg navbar-dark  green accent-4-color">
      <router-link
        to="/"
        class="navbar-brand"
      >Home</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent-3"
        aria-controls="navbarSupportedContent-3"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent-3"
      >
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link
              to="/App1"
              class="nav-link waves-effect waves-light"
            >App1
              <span class="sr-only">(current)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/App2"
              class="nav-link waves-effect waves-light"
            >App2</router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/App3"
              class="nav-link waves-effect waves-light"
            >App3</router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/App4"
              class="nav-link waves-effect waves-light"
            >App4</router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/Login"
              class="nav-link waves-effect waves-light"
            >Login</router-link>
          </li>

        </ul>
        <ul class="navbar-nav ml-auto nav-flex-icons">

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle waves-effect waves-light"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <i class="fa fa-user"></i>
            </a>
            <div
              class="dropdown-menu dropdown-menu-right dropdown-default"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <a
                class="dropdown-item waves-effect waves-light"
                href="#"
              >Action</a>
              <a
                class="dropdown-item waves-effect waves-light"
                href="#"
              >Another action</a>
              <a
                class="dropdown-item waves-effect waves-light"
                href="#"
              >Something else here</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <!--/.Navbar-->
  </div>
</template>

