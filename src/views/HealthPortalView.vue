<template>
  <div id="app" class="container mt-4">
    <div class="row">
      <!-- 数据输入表单 -->
      <div class="col-md-5 mb-4">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h4 class="card-title fw-bold text-dark mb-4">Log Cognitive Assessment</h4>

            <form v-on:submit.prevent="saveNewRecord">
              <!-- 1. 患者标识 (RID) -->
              <div class="mb-3">
                <label class="form-label text-dark">Patient ID (RID)</label>
                <input
                  type="text"
                  v-model="newRecord.patientRID"
                  class="form-control"
                  placeholder="e.g., 4021"
                />
              </div>

              <!-- 2. 基础随访阶段 (VISCODE) -->
              <div class="mb-3">
                <label class="form-label text-dark">Visit Phase (VISCODE)</label>
                <select v-model="newRecord.visitCode" class="form-select">
                  <option value="">Select phase...</option>
                  <option value="bl">Baseline (bl)</option>
                  <option value="m06">Month 6 (m06)</option>
                  <option value="m12">Month 12 (m12)</option>
                </select>
              </div>

              <!-- 3. 辅助随访阶段 (VISCODE2) -->
              <div class="mb-3">
                <label class="form-label text-dark">Secondary Phase (VISCODE2)</label>
                <input
                  type="text"
                  v-model="newRecord.visitCode2"
                  class="form-control"
                  placeholder="e.g., m06"
                />
              </div>

              <!-- 4. 测试分数 -->
              <div class="mb-3">
                <label class="form-label text-dark">MMSE Score (0-30)</label>
                <input
                  type="number"
                  v-model="newRecord.mmseScore"
                  class="form-control"
                  placeholder="Enter score"
                />
              </div>

              <!-- 错误提示区域 -->
              <div v-if="errorMessageList.length > 0" class="alert alert-danger p-3">
                <ul class="mb-0">
                  <li v-for="(message, index) in errorMessageList" v-bind:key="index">
                    {{ message }}
                  </li>
                </ul>
              </div>

              <button type="submit" class="btn btn-primary w-100 mt-2">Save Tracking Record</button>
            </form>
          </div>
        </div>
      </div>

      <!-- 历史数据展示 -->
      <div class="col-md-7">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h4 class="card-title fw-bold text-dark mb-4">
              Longitudinal Tracking History
              <!-- 记录数量 -->
              <span class="badge bg-secondary float-end">Total: {{ totalRecordCount }}</span>
            </h4>

            <div v-if="recordList.length === 0" class="text-muted text-center py-5">
              No records found. Please add one on the left.
            </div>

            <ul class="list-group">
              <li
                v-for="(record, index) in recordList"
                v-bind:key="index"
                class="list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm border"
              >
                <div>
                  <strong>RID: {{ record.patientRID }}</strong>
                  <br />
                  <span class="text-muted"
                    >Matched Phase: {{ record.visitCode }} / {{ record.visitCode2 }}</span
                  >
                  <br />
                  <span class="text-primary fw-bold">MMSE Score: {{ record.mmseScore }}</span>
                </div>
                <button v-on:click="deleteRecord(index)" class="btn btn-outline-danger btn-sm">
                  Remove
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HealthPortalView',

  // 数据变量
  data() {
    return {
      newRecord: {
        patientRID: '',
        visitCode: '',
        visitCode2: '',
        mmseScore: '',
      },
      recordList: [],
      errorMessageList: [],
    }
  },

  // 计算属性
  computed: {
    totalRecordCount() {
      return this.recordList.length
    },
  },

  mounted() {
    let savedData = localStorage.getItem('my_health_records')

    if (savedData !== null) {
      this.recordList = JSON.parse(savedData)
    } else {
      this.recordList = []
    }
  },

  methods: {
    saveNewRecord() {
      this.errorMessageList = []

      if (this.newRecord.patientRID === '') {
        this.errorMessageList.push('Patient ID (RID) cannot be empty.')
      }

      if (this.newRecord.visitCode === '') {
        this.errorMessageList.push('Please select a Visit Phase (VISCODE).')
      }
      if (this.newRecord.visitCode2 === '') {
        this.errorMessageList.push('Secondary Phase (VISCODE2) cannot be empty.')
      }

      if (this.newRecord.mmseScore === '' || this.newRecord.mmseScore === null) {
        this.errorMessageList.push('Please enter an MMSE score.')
      } else if (this.newRecord.mmseScore < 0) {
        this.errorMessageList.push('Score cannot be less than 0.')
      } else if (this.newRecord.mmseScore > 30) {
        this.errorMessageList.push('Score cannot be greater than 30.')
      }

      if (this.errorMessageList.length === 0) {
        let recordToSave = {
          patientRID: this.newRecord.patientRID,
          visitCode: this.newRecord.visitCode,
          visitCode2: this.newRecord.visitCode2,
          mmseScore: this.newRecord.mmseScore,
        }

        this.recordList.push(recordToSave)

        localStorage.setItem('my_health_records', JSON.stringify(this.recordList))

        // 保存成功后清空输入框
        this.newRecord.patientRID = ''
        this.newRecord.visitCode = ''
        this.newRecord.visitCode2 = ''
        this.newRecord.mmseScore = ''
      }
    },

    deleteRecord(indexNumber) {
      this.recordList.splice(indexNumber, 1)
      localStorage.setItem('my_health_records', JSON.stringify(this.recordList))
    },
  },
}
</script>

<style scoped></style>
