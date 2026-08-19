<template>
  <div class="container mt-4">
    <h1 class="fw-bolder text-dark mb-4">Admin Dashboard</h1>
    <p class="text-dark fs-5 fw-bold mb-4">
      Overview of registered users and site activity. Only accounts with the Admin role
      can access this page.
    </p>

    <!-- 站点数据概览卡片 -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card shadow border-2 border-primary rounded-4">
          <div class="card-body p-4 text-center">
            <h2 class="card-title fs-6 text-secondary fw-bold text-uppercase">Total Users</h2>
            <p class="display-5 fw-bolder text-primary mb-0">{{ totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow border-2 border-success rounded-4">
          <div class="card-body p-4 text-center">
            <h2 class="card-title fs-6 text-secondary fw-bold text-uppercase">Volunteer Bookings</h2>
            <p class="display-5 fw-bolder text-success mb-0">{{ localStats.bookings }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow border-2 border-info rounded-4">
          <div class="card-body p-4 text-center">
            <h2 class="card-title fs-6 text-secondary fw-bold text-uppercase">Visit Requests</h2>
            <p class="display-5 fw-bolder text-info mb-0">{{ localStats.requests }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow border-2 border-warning rounded-4">
          <div class="card-body p-4 text-center">
            <h2 class="card-title fs-6 text-secondary fw-bold text-uppercase">Health Records</h2>
            <p class="display-5 fw-bolder text-warning mb-0">{{ localStats.healthRecords }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- 角色分布饼图 -->
      <div class="col-lg-5">
        <div class="card shadow border-2 border-success rounded-4 h-100">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">
              User Role Distribution
            </h2>

            <div v-if="isLoadingUsers" class="text-dark fs-5 fw-bold text-center py-4">
              Loading users from Firestore...
            </div>
            <div v-else-if="userLoadError" class="alert alert-danger fs-5 fw-bold p-3" role="alert">
              {{ userLoadError }}
            </div>
            <div v-else-if="totalUsers === 0" class="text-dark fs-5 fw-bold text-center py-4">
              No users registered yet.
            </div>
            <VChart v-else v-bind:option="roleChartOption" autoresize class="chart-box" />
          </div>
        </div>
      </div>

      <!-- 角色统计明细 -->
      <div class="col-lg-7">
        <div class="card shadow border-2 rounded-4 bg-light">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">Registered Users</h2>

            <div class="d-flex flex-wrap gap-2 mb-4">
              <span class="badge bg-secondary fs-5">Senior/Caregiver: {{ roleCounts.Senior }}</span>
              <span class="badge bg-primary fs-5">Coordinator: {{ roleCounts.Coordinator }}</span>
              <span class="badge bg-danger fs-5">Admin: {{ roleCounts.Admin }}</span>
              <span class="badge bg-dark fs-5">Other: {{ roleCounts.Other }}</span>
            </div>

            <!-- 复用单元 1 的交互式表格：排序 / 搜索 / 分页 / 导出 -->
            <DataTable
              v-bind:table-data="userList"
              v-bind:columns="userColumns"
              caption="Registered Users"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { VChart } from '../utils/echarts'
import DataTable from '../components/DataTable.vue'

// 业务数据在 localStorage 中的键名（与各页面保持一致）
const BUSINESS_KEYS = {
  bookings: 'volunteer_bookings',
  requests: 'volunteer_requests',
  healthRecords: 'my_health_records',
}

export default {
  name: 'AdminDashboardView',
  components: {
    VChart,
    DataTable,
  },
  data() {
    return {
      userList: [], // Firestore 里所有注册用户
      isLoadingUsers: true, // 是否正在加载用户
      userLoadError: '', // 加载失败时的提示文字
      roleCounts: {
        Senior: 0,
        Coordinator: 0,
        Admin: 0,
        Other: 0,
      },
      // 用户表格列配置（username 只读展示，不参与排序以外的操作）
      userColumns: [
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
      ],
    }
  },
  computed: {
    // 用户总数 = 表格行数
    totalUsers() {
      return this.userList.length
    },

    // 从 localStorage 统计各业务数据条数，供概览卡片展示
    localStats() {
      const stats = {}
      const keys = Object.keys(BUSINESS_KEYS)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const saved = localStorage.getItem(BUSINESS_KEYS[key])
        if (saved === null) {
          stats[key] = 0
          continue
        }
        // 无法解析或不是数组时按 0 处理，避免页面崩溃
        let count = 0
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            count = parsed.length
          }
        } catch {
          // JSON 解析失败时忽略，保持计数为 0
        }
        stats[key] = count
      }
      return stats
    },

    // 角色分布饼图配置
    roleChartOption() {
      const data = []
      if (this.roleCounts.Senior > 0) {
        data.push({ name: 'Senior / Caregiver', value: this.roleCounts.Senior })
      }
      if (this.roleCounts.Coordinator > 0) {
        data.push({ name: 'Coordinator', value: this.roleCounts.Coordinator })
      }
      if (this.roleCounts.Admin > 0) {
        data.push({ name: 'Admin', value: this.roleCounts.Admin })
      }
      if (this.roleCounts.Other > 0) {
        data.push({ name: 'Other', value: this.roleCounts.Other })
      }

      return {
        title: { text: 'Users by Role', left: 'center', textStyle: { fontSize: 16 } },
        tooltip: { trigger: 'item' },
        legend: { orient: 'horizontal', bottom: 0 },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: data,
            label: { formatter: '{b}: {c}' },
          },
        ],
      }
    },
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    // 拉取 Firestore 中的全部用户，并统计各角色人数
    async loadUsers() {
      this.isLoadingUsers = true
      this.userLoadError = ''
      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const users = []

        // 重置角色计数
        this.roleCounts.Senior = 0
        this.roleCounts.Coordinator = 0
        this.roleCounts.Admin = 0
        this.roleCounts.Other = 0

        // 逐条读取用户文档，规整成表格数据
        for (let i = 0; i < snapshot.size; i++) {
          const document = snapshot.docs[i]
          const data = document.data()
          const role = data.role !== undefined ? data.role : 'Other'

          users.push({
            uid: document.id,
            username: data.username !== undefined ? data.username : '(no name)',
            email: data.email !== undefined ? data.email : '',
            role: role,
          })

          // 按角色累加计数（未知角色归入 Other）
          if (role in this.roleCounts) {
            this.roleCounts[role] = this.roleCounts[role] + 1
          } else {
            this.roleCounts.Other = this.roleCounts.Other + 1
          }
        }

        this.userList = users
      } catch {
        this.userLoadError =
          'Failed to load users from Firestore. Please check your Firestore database rules or network.'
      } finally {
        this.isLoadingUsers = false
      }
    },
  },
}
</script>

<style scoped>
/* 图表容器需要明确高度才能正常显示 */
.chart-box {
  height: 340px;
  width: 100%;
}
</style>