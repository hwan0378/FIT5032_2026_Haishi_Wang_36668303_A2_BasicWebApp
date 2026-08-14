<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light border-bottom border-2 mb-4 shadow-sm py-3"
    >
      <div class="container">
        <!-- 网站 Logo -->
        <router-link class="navbar-brand text-primary fw-bolder fs-3" to="/">
          ElderCare Charity
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 导航链接菜单 -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav gap-3">
            <li class="nav-item">
              <router-link class="nav-link text-dark fw-bold fs-5" to="/health-portal">
                My Health
              </router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link text-dark fw-bold fs-5" to="/resources">
                Resources
              </router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link text-dark fw-bold fs-5" to="/community">
                Community
              </router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link text-dark fw-bold fs-5" to="/directory">
                Directory
              </router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link text-dark fw-bold fs-5" to="/dashboard">
                Dashboard
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
body {
  background-color: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-link:hover {
  color: #0d6efd !important;
}
</style>
