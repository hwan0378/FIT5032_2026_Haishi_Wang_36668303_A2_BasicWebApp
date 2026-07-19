<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h3 class="card-title fw-bold text-dark mb-4">Coordinator Dashboard</h3>

            <!-- 搜索与筛选区域 -->
            <div class="p-3 mb-4 bg-light rounded border">
              <h5 class="text-dark mb-3">Data Filter Criteria</h5>
              <div class="row g-3">
                <!-- 1. 按 RID 搜索 -->
                <div class="col-md-4">
                  <label class="form-label text-dark">Search Patient ID (RID)</label>
                  <input
                    type="text"
                    v-model="searchRID"
                    class="form-control"
                    placeholder="Enter RID..."
                  />
                </div>

                <!-- 2. 按随访阶段 -->
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

            <!-- 数据表格展示 -->
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
                  <!-- 过滤后没有数据 -->
                  <tr v-if="filteredRecordList.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">
                      No matching data found. Please adjust the filters above, or add new data in
                      the Personal Health Portal.
                    </td>
                  </tr>
                  <!-- 过滤后有数据 -->
                  <tr v-for="(record, index) in filteredRecordList" v-bind:key="index">
                    <td class="fw-bold">{{ record.patientRID }}</td>
                    <td>{{ record.visitCode }}</td>
                    <td>{{ record.visitCode2 }}</td>
                    <td class="text-primary fw-bold">{{ record.mmseScore }}</td>
                    <td>
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

  // 数据变量
  data() {
    return {
      allRecords: [],
      searchRID: '',
      searchVisitCode: '',
    }
  },

  // 计算属性
  computed: {
    filteredRecordList() {
      return this.allRecords.filter((record) => {
        // RID 匹配
        let isRidMatch = true
        if (this.searchRID !== '') {
          isRidMatch = record.patientRID.includes(this.searchRID)
        }

        // VISCODE 匹配
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
