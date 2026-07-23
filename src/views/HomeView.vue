<template>
  <div class="home-view">
    <!-- 如果用户未登录，显示登录/注册模块 -->
    <div v-if="currentUser === null" class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm border-0">
            <div class="card-body p-5">
              <!-- 根据当前是登录还是注册模式切换显示 -->
              <h3 v-if="isLoginMode === true" class="fw-bold text-center text-primary mb-4">
                Login to ElderCare
              </h3>
              <h3 v-if="isLoginMode === false" class="fw-bold text-center text-primary mb-4">
                Register New Account
              </h3>

              <div v-if="authErrorMessage !== ''" class="alert alert-danger p-3">
                {{ authErrorMessage }}
              </div>

              <!-- 登录表单 -->
              <form v-if="isLoginMode === true" v-on:submit.prevent="loginUser">
                <div class="mb-3">
                  <label class="form-label text-dark">Username</label>
                  <input type="text" v-model="loginForm.username" class="form-control" />
                </div>
                <div class="mb-4">
                  <label class="form-label text-dark">Password</label>
                  <input type="password" v-model="loginForm.password" class="form-control" />
                </div>
                <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>
                <p class="text-center text-muted">
                  Don't have an account?
                  <a href="#" v-on:click.prevent="isLoginMode = false">Register here</a>
                </p>
              </form>

              <!-- 注册表单 -->
              <form v-if="isLoginMode === false" v-on:submit.prevent="registerUser">
                <div class="mb-3">
                  <label class="form-label text-dark">Choose Username</label>
                  <input type="text" v-model="registerForm.username" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label text-dark">Choose Password</label>
                  <input type="password" v-model="registerForm.password" class="form-control" />
                </div>

                <div class="mb-4">
                  <label class="form-label text-dark">Select Your Role</label>
                  <select v-model="registerForm.role" class="form-select">
                    <option value="">Select a role...</option>
                    <option value="Senior">Senior / Caregiver</option>
                    <option value="Coordinator">Charity Coordinator</option>
                  </select>
                </div>

                <button type="submit" class="btn btn-success w-100 mb-3">Register</button>
                <p class="text-center text-muted">
                  Already have an account?
                  <a href="#" v-on:click.prevent="isLoginMode = true">Login here</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 如果用户已登录，显示原本的主页内容 -->
    <div v-if="currentUser !== null">
      <section class="hero text-center py-5 px-3 bg-light rounded shadow-sm mb-5 mt-3">
        <div class="container py-4">
          <h1 class="display-5 fw-bold text-primary mb-4">
            Empowering Your Golden Years, Together.
          </h1>

          <p class="lead text-secondary mb-3 px-md-5">
            Welcome back, <strong>{{ currentUser.username }}</strong
            >! (Role: {{ currentUser.role }})
          </p>
          <p class="lead text-secondary mb-5 px-md-5">
            Track your daily wellness, discover vital health resources, and connect with a community
            that cares.
          </p>

          <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <router-link to="/health-portal" class="btn btn-primary btn-lg px-4 gap-3">
              Log My Health Today
            </router-link>
            <router-link to="/community" class="btn btn-outline-secondary btn-lg px-4">
              Find Local Support
            </router-link>
            <button v-on:click="logoutUser" class="btn btn-danger btn-lg px-4">Logout</button>
          </div>
        </div>
      </section>

      <section class="features container pb-5">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100 shadow-sm border-0 bg-white">
              <div class="card-body text-center d-flex flex-column">
                <h3 class="card-title h4 text-dark mb-3">Personal Health Portal</h3>
                <p class="card-text text-muted mb-4">
                  Securely log your standardized cognitive assessments (like the MMSE) and view your
                  long-term health trends.
                </p>
                <router-link to="/health-portal" class="btn btn-outline-primary mt-auto"
                  >Go to Portal</router-link
                >
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 shadow-sm border-0 bg-white">
              <div class="card-body text-center d-flex flex-column">
                <h3 class="card-title h4 text-dark mb-3">Education & Resources</h3>
                <p class="card-text text-muted mb-4">
                  Access our high-contrast, step-by-step guides on healthy aging, falls prevention,
                  and practical tips.
                </p>
                <router-link to="/resources" class="btn btn-outline-primary mt-auto"
                  >Learn More</router-link
                >
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 shadow-sm border-0 bg-white">
              <div class="card-body text-center d-flex flex-column">
                <h3 class="card-title h4 text-dark mb-3">Community Support</h3>
                <p class="card-text text-muted mb-4">
                  Connect with vetted local support groups or seamlessly request a friendly
                  volunteer check-in.
                </p>
                <router-link to="/community" class="btn btn-outline-primary mt-auto"
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
      // 当前登录的用户信息
      currentUser: null,
      // 控制界面显示登录表单(true)还是注册表单(false)
      isLoginMode: true,
      authErrorMessage: '',
      // 绑定给登录表单的数据
      loginForm: {
        username: '',
        password: '',
      },
      // 绑定给注册表单的数据
      registerForm: {
        username: '',
        password: '',
        role: '',
      },
    }
  },

  mounted() {
    // 页面加载时，去浏览器的 LocalStorage 检查是否有保存的登录状态
    let savedUser = localStorage.getItem('current_user')
    if (savedUser !== null) {
      this.currentUser = JSON.parse(savedUser)
    }
  },

  methods: {
    // 注册新用户
    registerUser() {
      this.authErrorMessage = ''

      // 基础表单验证
      if (
        this.registerForm.username === '' ||
        this.registerForm.password === '' ||
        this.registerForm.role === ''
      ) {
        this.authErrorMessage = 'Please fill in all registration fields.'
        return // 遇到错误停止
      }

      // 从 LocalStorage 获取以前注册过的所有用户
      let allUsers = localStorage.getItem('registered_users')
      let parsedUsers = []

      if (allUsers !== null) {
        parsedUsers = JSON.parse(allUsers)
      }

      // 创建一个新用户对象
      let newUser = {
        username: this.registerForm.username,
        password: this.registerForm.password,
        role: this.registerForm.role,
      }

      // 把新用户放进数组，再存回浏览器
      parsedUsers.push(newUser)
      localStorage.setItem('registered_users', JSON.stringify(parsedUsers))

      // 注册成功后，切换回登录界面
      this.isLoginMode = true
      this.authErrorMessage = 'Registration successful! Please login.'
      this.registerForm.username = ''
      this.registerForm.password = ''
      this.registerForm.role = ''
    },

    // 用户登录
    loginUser() {
      this.authErrorMessage = ''

      let allUsers = localStorage.getItem('registered_users')
      let parsedUsers = []

      if (allUsers !== null) {
        parsedUsers = JSON.parse(allUsers)
      }

      let foundUser = null

      // 循环对比每一个用户，看看账号密码是否匹配
      for (let i = 0; i < parsedUsers.length; i++) {
        if (
          parsedUsers[i].username === this.loginForm.username &&
          parsedUsers[i].password === this.loginForm.password
        ) {
          foundUser = parsedUsers[i]
        }
      }

      // 如果找到了匹配的用户
      if (foundUser !== null) {
        this.currentUser = foundUser
        localStorage.setItem('current_user', JSON.stringify(foundUser))
        this.loginForm.username = ''
        this.loginForm.password = ''
      } else {
        // 如果没找到匹配的，报错
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
