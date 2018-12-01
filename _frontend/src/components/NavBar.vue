<template>
  <div>
    <nav class="nav-wrapper indigo">
      <div class="container">
        <a class="brand-logo">title</a>
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

        </ul>
      </div>
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
    </ul>
  </div>
</template>
