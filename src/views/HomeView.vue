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

              <!-- 错误提示：role=alert 让屏幕阅读器自动播报 -->
              <div
                v-if="authErrorMessage !== ''"
                id="auth-alert"
                class="alert alert-danger fs-5 p-3 fw-bold"
                role="alert"
              >
                {{ authErrorMessage }}
              </div>

              <!-- 登录表单（邮箱 + 密码） -->
              <form
                v-if="isLoginMode === true"
                v-on:submit.prevent="handleLogin"
                aria-describedby="auth-alert"
              >
                <div class="mb-3">
                  <label class="form-label text-dark fw-bold fs-5" for="loginEmail"
                    >Email Address</label
                  >
                  <input
                    id="loginEmail"
                    type="email"
                    v-model="loginForm.email"
                    class="form-control form-control-lg border-2"
                    autocomplete="email"
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
                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100 mb-3 fw-bold"
                  v-bind:disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Signing in...' : 'Login' }}
                </button>
                <p class="text-center text-dark fs-5">
                  Don't have an account?
                  <a href="#" class="fw-bold" v-on:click.prevent="switchMode">Register here</a>
                </p>
              </form>

              <!-- 注册表单（用户名 + 邮箱 + 密码 + 角色） -->
              <form
                v-if="isLoginMode === false"
                v-on:submit.prevent="handleRegister"
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
                  <label class="form-label text-dark fw-bold fs-5" for="regEmail"
                    >Email Address</label
                  >
                  <input
                    id="regEmail"
                    type="email"
                    v-model="registerForm.email"
                    class="form-control form-control-lg border-2"
                    autocomplete="email"
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

                <button
                  type="submit"
                  class="btn btn-success btn-lg w-100 mb-3 fw-bold"
                  v-bind:disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Creating account...' : 'Register' }}
                </button>
                <p class="text-center text-dark fs-5">
                  Already have an account?
                  <a href="#" class="fw-bold" v-on:click.prevent="switchMode">Login here</a>
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
            <button v-on:click="handleLogout" class="btn btn-danger btn-lg px-4 fw-bold shadow-sm">
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
// 引入认证服务：注册后自动登录，登录 / 登出都交给 Firebase 处理
import {
  registerUser,
  loginUser,
  logoutUser,
  restoreSession,
  getFirebaseErrorMessage,
} from '../services/auth'

export default {
  name: 'HomeView',
  data() {
    return {
      currentUser: null, // 当前登录的用户（null 表示未登录）
      isLoginMode: true, // true = 显示登录表单，false = 显示注册表单
      authErrorMessage: '', // 表单上方的错误提示文字
      isSubmitting: false, // 提交中禁用按钮，避免重复点击
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      },
    }
  },
  async mounted() {
    // 刷新页面后：等待 Firebase 恢复会话，再决定显示登录框还是主页
    try {
      const profile = await restoreSession()
      if (profile !== null) {
        this.currentUser = profile
      }
    } catch {
      // 网络异常时保持未登录状态，用户可稍后重试
    }
  },
  methods: {
    // 校验邮箱格式是否合法
    isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(email)
    },

    // 切换登录 / 注册表单时，清掉上次的错误提示
    switchMode() {
      this.isLoginMode = !this.isLoginMode
      this.authErrorMessage = ''
    },

    // 提交注册：先做前端校验，再调用 Firebase 创建账户
    async handleRegister() {
      this.authErrorMessage = ''

      // 必填项校验
      if (
        this.registerForm.username === '' ||
        this.registerForm.email === '' ||
        this.registerForm.password === '' ||
        this.registerForm.confirmPassword === '' ||
        this.registerForm.role === ''
      ) {
        this.authErrorMessage = 'Please fill in all registration fields.'
        return
      }

      // 邮箱格式校验
      if (this.isValidEmail(this.registerForm.email) === false) {
        this.authErrorMessage = 'Please enter a valid email address.'
        return
      }

      // 密码一致性校验
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.authErrorMessage = 'Passwords do not match.'
        return
      }

      // 密码复杂度校验（沿用 A2 的规则）
      const pwd = this.registerForm.password
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

      this.isSubmitting = true
      try {
        // 注册成功后 Firebase 会自动登录，直接进入主页内容
        this.currentUser = await registerUser(
          this.registerForm.email,
          this.registerForm.username,
          this.registerForm.password,
          this.registerForm.role,
        )

        // 清空注册表单
        this.registerForm.username = ''
        this.registerForm.email = ''
        this.registerForm.password = ''
        this.registerForm.confirmPassword = ''
        this.registerForm.role = ''
      } catch (error) {
        // 把 Firebase 错误代码翻译成友好的提示
        this.authErrorMessage = getFirebaseErrorMessage(error)
      } finally {
        this.isSubmitting = false
      }
    },

    // 提交登录：调用 Firebase 校验邮箱密码
    async handleLogin() {
      this.authErrorMessage = ''

      // 邮箱格式校验
      if (this.isValidEmail(this.loginForm.email) === false) {
        this.authErrorMessage = 'Please enter a valid email address.'
        return
      }
      if (this.loginForm.password === '') {
        this.authErrorMessage = 'Please enter your password.'
        return
      }

      this.isSubmitting = true
      try {
        this.currentUser = await loginUser(this.loginForm.email, this.loginForm.password)
        this.loginForm.email = ''
        this.loginForm.password = ''
      } catch (error) {
        this.authErrorMessage = getFirebaseErrorMessage(error)
      } finally {
        this.isSubmitting = false
      }
    },

    // 登出：退出 Firebase 并回到登录框
    async handleLogout() {
      try {
        await logoutUser()
      } catch {
        // 即使登出请求失败，也照常清理本地登录状态
      }
      this.currentUser = null
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
