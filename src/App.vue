<template>
  <div id="app">
    <!-- 无障碍：键盘用户可直接跳到主体内容 -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- 顶部导航栏 -->
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light border-bottom border-2 mb-4 shadow-sm py-3"
      aria-label="Main navigation"
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
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 导航链接菜单 -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav gap-3">
            <li class="nav-item">
              <router-link
                class="nav-link text-dark fw-bold fs-5"
                to="/health-portal"
                v-bind:aria-current="isCurrentRoute('health-portal')"
              >
                My Health
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                class="nav-link text-dark fw-bold fs-5"
                to="/resources"
                v-bind:aria-current="isCurrentRoute('resources')"
              >
                Resources
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                class="nav-link text-dark fw-bold fs-5"
                to="/community"
                v-bind:aria-current="isCurrentRoute('community')"
              >
                Community
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                class="nav-link text-dark fw-bold fs-5"
                to="/directory"
                v-bind:aria-current="isCurrentRoute('directory')"
              >
                Directory
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                class="nav-link text-dark fw-bold fs-5"
                to="/dashboard"
                v-bind:aria-current="isCurrentRoute('dashboard')"
              >
                Dashboard
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 页面主体内容地标 -->
    <main id="main-content" tabindex="-1">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    // 判断当前路由，用于给激活的导航链接标记 aria-current
    isCurrentRoute(routeName) {
      if (this.$route.name === routeName) {
        return 'page'
      }
      return null
    },
  },
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

/* 无障碍：跳过链接默认移出屏幕，聚焦时回到屏幕左上角 */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 9999;
  background-color: #0d6efd;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
}

.skip-link:focus {
  left: 0;
}

/* 无障碍：键盘聚焦时有清晰可见的焦点框 */
:focus-visible {
  outline: 3px solid #0d6efd;
  outline-offset: 2px;
}
</style>
