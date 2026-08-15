<template>
  <div class="home-view">
    <!-- 登录/注册模块 -->
    <div v-if="currentUser === null" class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow border-0 rounded-4">
            <div class="card-body p-5">
              <h1 v-if="isLoginMode === true" class="h3 fw-bolder text-center text-primary mb-4">
                Login to ElderCare
              </h1>
              <h1 v-if="isLoginMode === false" class="h3 fw-bolder text-center text-primary mb-4">
                Register New Account
              </h1>

              <!-- 错误/成功提示：role=alert 让屏幕阅读器自动播报 -->
              <div
                v-if="authErrorMessage !== ''"
                id="auth-alert"
                class="alert alert-danger fs-5 p-3 fw-bold"
                role="alert"
              >
                {{ authErrorMessage }}
              </div>

              <!-- 登录表单 -->
              <form
                v-if="isLoginMode === true"
                v-on:submit.prevent="loginUser"
                aria-describedby="auth-alert"
              >
                <div class="mb-3">
                  <label class="form-label text-dark fw-bold fs-5" for="loginUsername"
                    >Username</label
                  >
                  <input
                    id="loginUsername"
                    type="text"
                    v-model="loginForm.username"
                    class="form-control form-control-lg border-2"
                    autocomplete="username"
                  />
                </div>
                <div class="mb-4">
                  <label class="form-label text-dark fw-bold fs-5" for="loginPassword"
                    >Password</label
                  >
                  <input
                    id="loginPassword"
                    type="password"
                    v-model="loginForm.password"
                    class="form-control form-control-lg border-2"
                    autocomplete="current-password"
                  />
                </div>
                <button type="submit" class="btn btn-primary btn-lg w-100 mb-3 fw-bold">
                  Login
                </button>
                <p class="text-center text-dark fs-5">
                  Don't have an account?
                  <a href="#" class="fw-bold" v-on:click.prevent="isLoginMode = false"
                    >Register here</a
                  >
                </p>
              </form>

              <!-- 注册表单 -->
              <form
                v-if="isLoginMode === false"
                v-on:submit.prevent="registerUser"
                aria-describedby="auth-alert"
              >
                <div class="mb-3">
                  <label class="form-label text-dark fw-bold fs-5" for="regUsername"
                    >Choose Username</label
                  >
                  <input
                    id="regUsername"
                    type="text"
                    v-model="registerForm.username"
                    class="form-control form-control-lg border-2"
                    autocomplete="username"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label text-dark fw-bold fs-5" for="regPassword"
                    >Choose Password</label
                  >
                  <input
                    id="regPassword"
                    type="password"
                    v-model="registerForm.password"
                    class="form-control form-control-lg border-2"
                    autocomplete="new-password"
                  />
                  <div class="mt-2 text-secondary fw-bold fs-6" id="passwordHint">
                    Must be at least 8 characters, include an uppercase letter, a lowercase letter,
                    and a number.
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label text-dark fw-bold fs-5" for="regConfirmPassword"
                    >Confirm Password</label
                  >
                  <input
                    id="regConfirmPassword"
                    type="password"
                    v-model="registerForm.confirmPassword"
                    class="form-control form-control-lg border-2"
                    autocomplete="new-password"
                  />
                </div>

                <div class="mb-4">
                  <label class="form-label text-dark fw-bold fs-5" for="regRole"
                    >Select Your Role</label
                  >
                  <select
                    id="regRole"
                    v-model="registerForm.role"
                    class="form-select form-select-lg border-2"
                  >
                    <option value="">Select a role...</option>
                    <option value="Senior">Senior / Caregiver</option>
                    <option value="Coordinator">Charity Coordinator</option>
                  </select>
                </div>

                <button type="submit" class="btn btn-success btn-lg w-100 mb-3 fw-bold">
                  Register
                </button>
                <p class="text-center text-dark fs-5">
                  Already have an account?
                  <a href="#" class="fw-bold" v-on:click.prevent="isLoginMode = true">Login here</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录后的主页内容 -->
    <div v-if="currentUser !== null">
      <section
        class="hero text-center py-5 px-3 bg-light rounded-4 shadow mb-5 mt-3 border border-2"
      >
        <div class="container py-4">
          <h1 class="display-4 fw-bolder text-primary mb-4">Empowering Your Golden Years.</h1>

          <p class="lead text-dark fw-bold mb-3 px-md-5 fs-4">
            Welcome back, <span class="text-primary">{{ currentUser.username }}</span
            >!
            <span class="badge bg-secondary ms-2 fs-6">Role: {{ currentUser.role }}</span>
          </p>
          <p class="text-dark mb-5 px-md-5 fs-5">
            Track your daily wellness, discover vital health resources, and connect with a community
            that cares.
          </p>

          <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <router-link
              to="/health-portal"
              class="btn btn-primary btn-lg px-4 gap-3 fw-bold shadow-sm"
            >
              Log My Health Today
            </router-link>
            <router-link to="/community" class="btn btn-dark btn-lg px-4 fw-bold shadow-sm">
              Find Local Support
            </router-link>
            <button v-on:click="logoutUser" class="btn btn-danger btn-lg px-4 fw-bold shadow-sm">
              Logout
            </button>
          </div>
        </div>
      </section>

      <section class="features container pb-5">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100 shadow border-2 border-primary rounded-4">
              <div class="card-body text-center d-flex flex-column p-4">
                <h3 class="card-title h3 fw-bold text-dark mb-3">Health Portal</h3>
                <p class="card-text text-dark fs-5 mb-4">
                  Securely log your standardized cognitive assessments and view your long-term
                  health trends.
                </p>
                <router-link to="/health-portal" class="btn btn-primary btn-lg mt-auto fw-bold"
                  >Go to Portal</router-link
                >
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 shadow border-2 border-success rounded-4">
              <div class="card-body text-center d-flex flex-column p-4">
                <h3 class="card-title h3 fw-bold text-dark mb-3">Resources</h3>
                <p class="card-text text-dark fs-5 mb-4">
                  Access our high-contrast, step-by-step guides on healthy aging and practical tips.
                </p>
                <router-link to="/resources" class="btn btn-success btn-lg mt-auto fw-bold"
                  >Learn More</router-link
                >
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 shadow border-2 border-info rounded-4">
              <div class="card-body text-center d-flex flex-column p-4">
                <h3 class="card-title h3 fw-bold text-dark mb-3">Community</h3>
                <p class="card-text text-dark fs-5 mb-4">
                  Connect with vetted local support groups or seamlessly request a friendly
                  volunteer check-in.
                </p>
                <router-link to="/community" class="btn btn-info text-dark btn-lg mt-auto fw-bold"
                  >Get Connected</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      currentUser: null,
      isLoginMode: true,
      authErrorMessage: '',
      loginForm: {
        username: '',
        password: '',
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        role: '',
      },
    }
  },
  mounted() {
    let savedUser = localStorage.getItem('current_user')
    if (savedUser !== null) {
      this.currentUser = JSON.parse(savedUser)
    }
  },
  methods: {
    registerUser() {
      this.authErrorMessage = ''

      if (
        this.registerForm.username === '' ||
        this.registerForm.password === '' ||
        this.registerForm.confirmPassword === '' ||
        this.registerForm.role === ''
      ) {
        this.authErrorMessage = 'Please fill in all registration fields.'
        return
      }

      // 密码一致性校验
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.authErrorMessage = 'Passwords do not match.'
        return
      }

      // 密码复杂度校验
      let pwd = this.registerForm.password

      if (pwd.length < 8) {
        this.authErrorMessage = 'Password must be at least 8 characters long.'
        return
      }
      if (/[a-z]/.test(pwd) === false) {
        this.authErrorMessage = 'Password must include at least one lowercase letter.'
        return
      }
      if (/[A-Z]/.test(pwd) === false) {
        this.authErrorMessage = 'Password must include at least one uppercase letter.'
        return
      }
      if (/[0-9]/.test(pwd) === false) {
        this.authErrorMessage = 'Password must include at least one number.'
        return
      }

      let allUsers = localStorage.getItem('registered_users')
      let parsedUsers = []

      if (allUsers !== null) {
        parsedUsers = JSON.parse(allUsers)
      }

      // 封装新用户对象
      let newUser = {
        username: this.registerForm.username,
        password: this.registerForm.password,
        role: this.registerForm.role,
      }

      parsedUsers.push(newUser)
      localStorage.setItem('registered_users', JSON.stringify(parsedUsers))

      this.isLoginMode = true
      this.authErrorMessage = 'Registration successful! Please login.'

      this.registerForm.username = ''
      this.registerForm.password = ''
      this.registerForm.confirmPassword = ''
      this.registerForm.role = ''
    },

    loginUser() {
      this.authErrorMessage = ''
      let allUsers = localStorage.getItem('registered_users')
      let parsedUsers = []

      if (allUsers !== null) {
        parsedUsers = JSON.parse(allUsers)
      }

      let foundUser = null

      // 遍历本地用户库对比账户
      for (let i = 0; i < parsedUsers.length; i++) {
        if (
          parsedUsers[i].username === this.loginForm.username &&
          parsedUsers[i].password === this.loginForm.password
        ) {
          foundUser = parsedUsers[i]
        }
      }

      if (foundUser !== null) {
        this.currentUser = foundUser
        localStorage.setItem('current_user', JSON.stringify(foundUser))
        this.loginForm.username = ''
        this.loginForm.password = ''
      } else {
        this.authErrorMessage = 'Invalid username or password.'
      }
    },

    logoutUser() {
      this.currentUser = null
      localStorage.removeItem('current_user')
      this.isLoginMode = true
    },
  },
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
}
.card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}
</style>
