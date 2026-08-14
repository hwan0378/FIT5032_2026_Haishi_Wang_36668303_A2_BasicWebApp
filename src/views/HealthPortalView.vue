<template>
  <div class="container mt-4">
    <div class="row">
      <!-- 数据输入表单 -->
      <div class="col-md-5 mb-4">
        <div class="card shadow border-2 border-primary rounded-4">
          <div class="card-body p-4">
            <h3 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">Log Assessment</h3>

            <form v-on:submit.prevent="saveNewRecord">
              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5">Patient ID (RID)</label>
                <input
                  type="text"
                  v-model="newRecord.patientRID"
                  class="form-control form-control-lg border-2"
                  placeholder="e.g., 4021"
                />
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5">Visit Phase (VISCODE)</label>
                <select v-model="newRecord.visitCode" class="form-select form-select-lg border-2">
                  <option value="">Select phase...</option>
                  <option value="bl">Baseline (bl)</option>
                  <option value="m06">Month 6 (m06)</option>
                  <option value="m12">Month 12 (m12)</option>
                  <option value="m18">Month 18 (m18)</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5">Secondary Phase</label>
                <input
                  type="text"
                  v-model="newRecord.visitCode2"
                  class="form-control form-control-lg border-2"
                  placeholder="e.g., m06"
                />
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5">MMSE Score (0-30)</label>
                <input
                  type="number"
                  v-model="newRecord.mmseScore"
                  class="form-control form-control-lg border-2"
                  placeholder="Enter score"
                />
              </div>

              <div v-if="errorMessageList.length > 0" class="alert alert-danger fs-5 fw-bold p-3">
                <ul class="mb-0">
                  <li v-for="(message, index) in errorMessageList" v-bind:key="index">
                    {{ message }}
                  </li>
                </ul>
              </div>

              <button type="submit" class="btn btn-primary btn-lg w-100 mt-2 fw-bold shadow-sm">
                Save Tracking Record
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- 历史数据展示区 -->
      <div class="col-md-7">
        <div class="card shadow border-2 rounded-4 bg-light">
          <div class="card-body p-4">
            <h3 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">
              Tracking History
              <span class="badge bg-primary float-end fs-5">Total: {{ totalRecordCount }}</span>
            </h3>

            <!-- 导出 PDF 报告按钮 -->
            <button
              type="button"
              v-on:click="exportPDFReport"
              class="btn btn-success btn-lg fw-bold shadow-sm mb-3"
            >
              Export PDF Report
            </button>

            <div v-if="recordList.length === 0" class="text-dark fs-5 text-center py-5 fw-bold">
              No records found. Please add one on the left.
            </div>

            <!-- 列表加大字号和间距 -->
            <ul class="list-group">
              <li
                v-for="(record, index) in recordList"
                v-bind:key="index"
                class="list-group-item d-flex justify-content-between align-items-center mb-3 shadow-sm border-1 border-secondary rounded-3 p-3"
              >
                <div class="fs-5">
                  <strong class="text-dark">RID: {{ record.patientRID }}</strong>
                  <br />
                  <span class="text-secondary fw-bold"
                    >Phase: {{ record.visitCode }} / {{ record.visitCode2 }}</span
                  >
                  <br />
                  <span class="text-primary fw-bolder fs-4">Score: {{ record.mmseScore }}</span>
                </div>
                <button
                  v-on:click="deleteRecord(index)"
                  class="btn btn-danger btn-lg fw-bold shadow-sm"
                >
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
import { exportToPDF } from '../utils/export'

export default {
  name: 'HealthPortalView',
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
      // PDF 报告里的列配置
      reportColumns: [
        { key: 'patientRID', label: 'Patient ID (RID)' },
        { key: 'visitCode', label: 'Visit Phase (VISCODE)' },
        { key: 'visitCode2', label: 'Secondary Phase (VISCODE2)' },
        { key: 'mmseScore', label: 'MMSE Score' },
      ],
    }
  },
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

      // 表单校验：检查必填项与分数边界范围限制
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
        // 安全机制：清理关键字符串，防御跨站脚本攻击 (XSS)
        let safeRID = this.newRecord.patientRID.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        let safeViscode2 = this.newRecord.visitCode2.replace(/</g, '&lt;').replace(/>/g, '&gt;')

        let recordToSave = {
          patientRID: safeRID,
          visitCode: this.newRecord.visitCode,
          visitCode2: safeViscode2,
          mmseScore: this.newRecord.mmseScore,
        }

        this.recordList.push(recordToSave)
        localStorage.setItem('my_health_records', JSON.stringify(this.recordList))

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

    // 把当前所有健康记录导出为 PDF 报告
    exportPDFReport() {
      if (this.recordList.length === 0) {
        alert('No records to export. Please add a record first.')
        return
      }
      exportToPDF(this.recordList, this.reportColumns, 'Health_Assessment_Report.pdf', 'My Health Assessment Report')
    },
  },
}
</script>

<style scoped></style>
