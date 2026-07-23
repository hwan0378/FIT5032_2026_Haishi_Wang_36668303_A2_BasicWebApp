<template>
  <div class="container mt-4">
    <!-- 拦截：用户没登录，或者角色不是 Coordinator -->
    <div
      v-if="currentUser === null || currentUser.role !== 'Coordinator'"
      class="alert alert-danger text-center p-5 mt-5 shadow-sm"
    >
      <h3 class="fw-bold">Access Denied</h3>
      <p class="fs-5">
        You must be logged in as a <strong>Charity Coordinator</strong> to view this dashboard.
      </p>
      <router-link to="/" class="btn btn-primary mt-3">Return to Home</router-link>
    </div>

    <!-- Coordinator，正常显示后台界面 -->
    <div v-else class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h3 class="card-title fw-bold text-dark mb-4">Coordinator Dashboard</h3>

            <!-- 搜索与筛选区域 -->
            <div class="p-3 mb-4 bg-light rounded border">
              <h5 class="text-dark mb-3">Data Filter Criteria</h5>
              <div class="row g-3">
                <!-- 按患者编号搜索 -->
                <div class="col-md-4">
                  <label class="form-label text-dark">Search Patient ID (RID)</label>
                  <input
                    type="text"
                    v-model="searchRID"
                    class="form-control"
                    placeholder="Enter RID..."
                  />
                </div>

                <!-- 按随访阶段过滤 -->
                <div class="col-md-4">
                  <label class="form-label text-dark">Filter by Visit Phase (VISCODE)</label>
                  <select v-model="searchVisitCode" class="form-select">
                    <option value="">All Phases</option>
                    <option value="bl">Baseline (bl)</option>
                    <option value="m06">Month 6 (m06)</option>
                    <option value="m12">Month 12 (m12)</option>
                  </select>
                </div>

                <div class="col-md-4 d-flex align-items-end">
                  <button v-on:click="clearFilters" class="btn btn-outline-secondary w-100">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <!-- 数据表格 -->
            <h5 class="text-dark mb-3">
              Patient Health Data Report
              <span class="badge bg-primary float-end"
                >Total: {{ filteredRecordCount }} records</span
              >
            </h5>

            <div class="table-responsive">
              <table class="table table-striped table-hover border">
                <thead class="table-light">
                  <tr>
                    <th>Patient ID (RID)</th>
                    <th>Visit Phase (VISCODE)</th>
                    <th>Secondary Phase (VISCODE2)</th>
                    <th>MMSE Score</th>
                    <th>Assessment Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredRecordList.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">No matching data found.</td>
                  </tr>

                  <tr v-for="(record, index) in filteredRecordList" v-bind:key="index">
                    <td class="fw-bold">{{ record.patientRID }}</td>
                    <td>{{ record.visitCode }}</td>
                    <td>{{ record.visitCode2 }}</td>
                    <td class="text-primary fw-bold">{{ record.mmseScore }}</td>
                    <td>
                      <!-- 小于24分预警 -->
                      <span v-if="record.mmseScore < 24" class="badge bg-danger"
                        >Needs Attention (Low)</span
                      >
                      <span v-else class="badge bg-success">Good Status</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',

  data() {
    return {
      // 存储当前登录用户的信息
      currentUser: null,
      // 存放所有原始数据
      allRecords: [],
      // 绑定给搜索框的变量
      searchRID: '',
      // 绑定给下拉菜单的变量
      searchVisitCode: '',
    }
  },

  computed: {
    filteredRecordList() {
      return this.allRecords.filter((record) => {
        // 检查 RID 是否匹配
        let isRidMatch = true
        if (this.searchRID !== '') {
          isRidMatch = record.patientRID.includes(this.searchRID)
        }

        // 检查阶段代码是否匹配
        let isVisitCodeMatch = true
        if (this.searchVisitCode !== '') {
          isVisitCodeMatch = record.visitCode === this.searchVisitCode
        }

        if (isRidMatch === true && isVisitCodeMatch === true) {
          return true
        } else {
          return false
        }
      })
    },

    filteredRecordCount() {
      return this.filteredRecordList.length
    },
  },

  mounted() {
    let savedUser = localStorage.getItem('current_user')
    if (savedUser !== null) {
      this.currentUser = JSON.parse(savedUser)
    }

    // 页面加载时，读取所有历史健康数据
    let savedData = localStorage.getItem('my_health_records')
    if (savedData !== null) {
      this.allRecords = JSON.parse(savedData)
    } else {
      this.allRecords = []
    }
  },

  methods: {
    clearFilters() {
      this.searchRID = ''
      this.searchVisitCode = ''
    },
  },
}
</script>

<style scoped>
.table th,
.table td {
  font-size: 1.05rem;
  vertical-align: middle;
}
</style>
