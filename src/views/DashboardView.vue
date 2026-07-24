<template>
  <div class="container mt-4">
    <!-- 拦截未登录或非管理员角色的用户访问 -->
    <div
      v-if="currentUser === null || currentUser.role !== 'Coordinator'"
      class="alert alert-danger text-center p-5 mt-5 shadow border-2 rounded-4"
    >
      <h2 class="fw-bolder">Access Denied</h2>
      <p class="fs-4 fw-bold mt-3">
        You must be logged in as a <strong>Charity Coordinator</strong> to view this dashboard.
      </p>
      <router-link to="/" class="btn btn-danger btn-lg mt-3 fw-bold shadow-sm"
        >Return to Home</router-link
      >
    </div>

    <!-- 后台界面 -->
    <div v-else class="row">
      <div class="col-12">
        <div class="card shadow border-2 border-dark rounded-4">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">
              Coordinator Dashboard
            </h2>

            <!-- 搜索与筛选区域 -->
            <div class="p-4 mb-4 bg-light rounded-4 border border-2 border-secondary shadow-sm">
              <h4 class="text-dark fw-bold mb-3">Data Filter Criteria</h4>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label text-dark fw-bold fs-5">Search Patient ID (RID)</label>
                  <input
                    type="text"
                    v-model="searchRID"
                    class="form-control form-control-lg border-2"
                    placeholder="Enter RID..."
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label text-dark fw-bold fs-5">Filter by Visit Phase</label>
                  <select v-model="searchVisitCode" class="form-select form-select-lg border-2">
                    <option value="">All Phases</option>
                    <option value="bl">Baseline (bl)</option>
                    <option value="m06">Month 6 (m06)</option>
                    <option value="m12">Month 12 (m12)</option>
                  </select>
                </div>

                <div class="col-md-4 d-flex align-items-end">
                  <button
                    v-on:click="clearFilters"
                    class="btn btn-dark btn-lg w-100 fw-bold shadow-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <!-- 数据表格 -->
            <h4 class="text-dark fw-bold mb-3 mt-5">
              Patient Health Data Report
              <span class="badge bg-primary float-end fs-5"
                >Total: {{ filteredRecordCount }} records</span
              >
            </h4>

            <div class="table-responsive rounded-3 shadow-sm border border-2">
              <table class="table table-striped table-hover table-bordered mb-0">
                <thead class="table-dark fs-5">
                  <tr>
                    <th class="p-3">Patient ID (RID)</th>
                    <th class="p-3">Visit Phase (VISCODE)</th>
                    <th class="p-3">Secondary Phase (VISCODE2)</th>
                    <th class="p-3">MMSE Score</th>
                    <th class="p-3">Assessment Status</th>
                  </tr>
                </thead>
                <tbody class="fs-5 text-dark fw-bold">
                  <tr v-if="filteredRecordList.length === 0">
                    <td colspan="5" class="text-center py-5">No matching data found.</td>
                  </tr>

                  <tr v-for="(record, index) in filteredRecordList" v-bind:key="index">
                    <td class="p-3 text-primary fw-bolder">{{ record.patientRID }}</td>
                    <td class="p-3">{{ record.visitCode }}</td>
                    <td class="p-3">{{ record.visitCode2 }}</td>
                    <td class="p-3 text-danger fw-bolder fs-4">{{ record.mmseScore }}</td>
                    <td class="p-3">
                      <span v-if="record.mmseScore < 24" class="badge bg-danger fs-6 p-2"
                        >Needs Attention (Low)</span
                      >
                      <span v-else class="badge bg-success fs-6 p-2">Good Status</span>
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
      currentUser: null,
      allRecords: [],
      searchRID: '',
      searchVisitCode: '',
    }
  },
  computed: {
    filteredRecordList() {
      return this.allRecords.filter((record) => {
        let isRidMatch = true
        if (this.searchRID !== '') {
          isRidMatch = record.patientRID.includes(this.searchRID)
        }

        let isVisitCodeMatch = true
        if (this.searchVisitCode !== '') {
          isVisitCodeMatch = record.visitCode === this.searchVisitCode
        }

        // 仅当 RID 与 VISCODE 条件同时满足时才展示
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
  vertical-align: middle;
}
</style>
