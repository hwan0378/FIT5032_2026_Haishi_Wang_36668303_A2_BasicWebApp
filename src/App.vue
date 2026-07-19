<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div class="container">
      <router-link class="navbar-brand text-primary fw-bold" to="/">ElderCare Charity</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto gap-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/health-portal">My Health</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/resources">Resources</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/community">Community</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="container mt-4">
    <router-view></router-view>
  </main>
</template>

<style>
html,
body {
  font-size: 18px;
  background-color: #fcfcfc;
}

#app .navbar-brand,
#app .nav-link,
#app .btn {
  font-size: 1.1rem;
  font-weight: 500;
}

#app p {
  line-height: 1.7;
}

#app .text-muted {
  color: #495057;
}
</style>
