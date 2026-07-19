<template>
  <div class="home-view">
    <section class="hero text-center py-5 px-3 bg-light rounded shadow-sm mb-5 mt-3">
      <div class="container py-4">
        <h1 class="display-5 fw-bold text-primary mb-4">Empowering Your Golden Years, Together.</h1>

        <p class="lead text-secondary mb-5 px-md-5">
          Track your daily wellness, discover vital health resources, and connect with a community
          that cares. A secure, easy-to-use platform designed for seniors and their dedicated
          caregivers.
        </p>

        <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <router-link to="/health-portal" class="btn btn-primary btn-lg px-4 gap-3">
            Log My Health Today
          </router-link>
          <router-link to="/community" class="btn btn-outline-secondary btn-lg px-4">
            Find Local Support
          </router-link>
        </div>
      </div>
    </section>

    <section class="features container pb-5">
      <div class="row g-4">
        <!-- 模块 1: 健康门户 -->
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0 bg-white">
            <div class="card-body text-center d-flex flex-column">
              <h3 class="card-title h4 text-dark mb-3">Personal Health Portal</h3>
              <p class="card-text text-muted mb-4">
                Securely log your standardized cognitive assessments (like the MMSE) and view your
                long-term health trends on easy-to-read graphs.
              </p>
              <router-link to="/health-portal" class="btn btn-outline-primary mt-auto">
                Go to Portal
              </router-link>
            </div>
          </div>
        </div>

        <!-- 模块 2: 教育与资源 -->
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0 bg-white">
            <div class="card-body text-center d-flex flex-column">
              <h3 class="card-title h4 text-dark mb-3">Education & Resources</h3>
              <p class="card-text text-muted mb-4">
                Access our high-contrast, step-by-step guides on healthy aging, falls prevention,
                and practical tips for dedicated caregivers.
              </p>
              <router-link to="/resources" class="btn btn-outline-primary mt-auto">
                Learn More
              </router-link>
            </div>
          </div>
        </div>

        <!-- 模块 3: 社区与互助 -->
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0 bg-white">
            <div class="card-body text-center d-flex flex-column">
              <h3 class="card-title h4 text-dark mb-3">Community Support</h3>
              <p class="card-text text-muted mb-4">
                Connect with vetted local support groups or seamlessly request a friendly volunteer
                check-in to combat social isolation.
              </p>
              <router-link to="/community" class="btn btn-outline-primary mt-auto">
                Get Connected
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.text-primary {
  color: #0d6efd !important;
}
</style>
