<template>
  <div class="container mt-4">
    <!-- 拦截未登录或非协调员角色的用户访问 -->
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
        <h2 class="fw-bolder text-dark mb-4">Coordinator Dashboard</h2>

        <!-- 表 1：患者健康数据表（支持排序 / 全局搜索 / 按列搜索 / 分页） -->
        <DataTable
          v-bind:table-data="healthRecords"
          v-bind:columns="healthColumns"
          caption="Patient Health Data Report"
        >
          <!-- 评估状态列使用自定义显示：按分数显示不同颜色的徽章 -->
          <template v-slot:status="{ row }">
            <span v-if="row.status === 'Needs Attention (Low)'" class="badge bg-danger fs-6 p-2">
              Needs Attention (Low)
            </span>
            <span v-else class="badge bg-success fs-6 p-2">Good Status</span>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from '../components/DataTable.vue'

export default {
  name: 'DashboardView',
  components: {
    DataTable,
  },
  data() {
    return {
      currentUser: null,
      allRecords: [],
      // 表 1 的列配置；sortType 决定排序时用数值还是文本比较
      healthColumns: [
        { key: 'patientRID', label: 'Patient ID (RID)', sortType: 'string' },
        { key: 'visitCode', label: 'Visit Phase (VISCODE)', sortType: 'string' },
        { key: 'visitCode2', label: 'Secondary Phase (VISCODE2)', sortType: 'string' },
        { key: 'mmseScore', label: 'MMSE Score', sortType: 'number' },
        { key: 'status', label: 'Assessment Status', sortType: 'string' },
      ],
    }
  },
  computed: {
    // 把原始记录转换成表格需要的数据：额外算出评估状态文字（用于排序与搜索）
    healthRecords() {
      return this.allRecords.map((record) => {
        const isLowScore = record.mmseScore < 24
        return {
          patientRID: record.patientRID,
          visitCode: record.visitCode,
          visitCode2: record.visitCode2,
          mmseScore: record.mmseScore,
          status: isLowScore ? 'Needs Attention (Low)' : 'Good Status',
        }
      })
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
}
</script>

<style scoped></style>
