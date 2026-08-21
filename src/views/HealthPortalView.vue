<template>
  <div class="container mt-4">
    <h1 class="fw-bolder text-dark mb-4">My Health Portal</h1>

    <div class="row">
      <!-- 数据输入表单 -->
      <div class="col-md-5 mb-4">
        <div class="card shadow border-2 border-primary rounded-4">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">Log Assessment</h2>

            <form v-on:submit.prevent="saveNewRecord" aria-describedby="health-form-errors">
              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="patientRID"
                  >Patient ID (RID)</label
                >
                <input
                  id="patientRID"
                  type="text"
                  v-model="newRecord.patientRID"
                  class="form-control form-control-lg border-2"
                  placeholder="e.g., 4021"
                />
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="visitCode"
                  >Visit Phase (VISCODE)</label
                >
                <select
                  id="visitCode"
                  v-model="newRecord.visitCode"
                  class="form-select form-select-lg border-2"
                >
                  <option value="">Select phase...</option>
                  <option value="bl">Baseline (bl)</option>
                  <option value="m06">Month 6 (m06)</option>
                  <option value="m12">Month 12 (m12)</option>
                  <option value="m18">Month 18 (m18)</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="visitCode2"
                  >Secondary Phase</label
                >
                <input
                  id="visitCode2"
                  type="text"
                  v-model="newRecord.visitCode2"
                  class="form-control form-control-lg border-2"
                  placeholder="e.g., m06"
                />
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="mmseScore"
                  >MMSE Score (0-30)</label
                >
                <input
                  id="mmseScore"
                  type="number"
                  v-model="newRecord.mmseScore"
                  class="form-control form-control-lg border-2"
                  placeholder="Enter score"
                  min="0"
                  max="30"
                />
              </div>

              <!-- 校验错误列表：role=alert 自动播报 -->
              <div
                v-if="errorMessageList.length > 0"
                id="health-form-errors"
                class="alert alert-danger fs-5 fw-bold p-3"
                role="alert"
              >
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
            <h2 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">
              Tracking History
              <span class="badge bg-primary float-end fs-5">Total: {{ totalRecordCount }}</span>
            </h2>

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

    <!-- MMSE 趋势折线图 -->
    <div class="card shadow border-2 border-warning rounded-4 mt-4">
      <div class="card-body p-4">
        <h2 class="card-title fw-bolder text-dark mb-3 border-bottom pb-3">MMSE Score Trend</h2>
        <div v-if="recordList.length === 0" class="text-dark fs-5 fw-bold text-center py-4">
          No data yet. Add a tracking record to see the trend.
        </div>
        <VChart v-else v-bind:option="mmseChartOption" autoresize class="chart-box" />
      </div>
    </div>

    <!-- 发送健康报告邮件的卡片（附件 = 导出的 CSV） -->
    <div class="card shadow border-2 border-info rounded-4 mt-4">
      <div class="card-body p-4">
        <h2 class="card-title fw-bolder text-dark mb-2 border-bottom pb-3">
          Email My Health Report
        </h2>
        <p class="text-dark fs-5 fw-bold mb-4">
          Send your latest tracking records to a recipient as a CSV attachment.
        </p>

        <form v-on:submit.prevent="sendHealthReportEmail" aria-describedby="email-status">
          <div class="row g-3">
            <div class="col-md-6 mb-3">
              <label class="form-label text-dark fw-bold fs-5" for="emailRecipient"
                >Recipient Email</label
              >
              <input
                id="emailRecipient"
                type="email"
                v-model="emailForm.to"
                class="form-control form-control-lg border-2"
                autocomplete="email"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label text-dark fw-bold fs-5" for="emailMessage"
                >Message (optional)</label
              >
              <textarea
                id="emailMessage"
                v-model="emailForm.note"
                class="form-control form-control-lg border-2"
                rows="2"
              ></textarea>
            </div>
          </div>

          <!-- 发送状态提示：成功用 status 温和播报，失败用 alert 强调 -->
          <div
            v-if="emailStatusMessage !== ''"
            id="email-status"
            v-bind:class="emailStatusIsError ? 'alert alert-danger' : 'alert alert-success'"
            class="fs-5 fw-bold p-3"
            v-bind:role="emailStatusIsError ? 'alert' : 'status'"
          >
            {{ emailStatusMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-info text-dark btn-lg fw-bold shadow-sm"
            v-bind:disabled="isSendingEmail"
          >
            {{ isSendingEmail ? 'Sending...' : 'Send Report Email' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { exportToPDF, buildCSVString } from '../utils/export'
import { VChart } from '../utils/echarts'
// Firestore：交互式图表的数据源来自 Firestore（对应 BR F.1 Interactive Charts）
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { isOnline, enqueueAction } from '../utils/offline'

export default {
  name: 'HealthPortalView',
  components: {
    VChart,
  },
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
      // 邮件发送表单与发送状态
      emailForm: {
        to: '',
        note: '',
      },
      emailStatusMessage: '',
      emailStatusIsError: false,
      isSendingEmail: false,
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
    // MMSE 趋势折线图的数据配置：依赖 recordList，记录变化时图表自动更新
    mmseChartOption() {
      // 每个点用"阶段 + 序号"作标签，方便区分同阶段录入的多条记录
      const labels = this.recordList.map((record, index) => {
        return record.visitCode + ' #' + (index + 1)
      })
      const scores = this.recordList.map((record) => Number(record.mmseScore))

      return {
        title: {
          text: 'MMSE Score by Visit',
          left: 'center',
          textStyle: { fontSize: 16 },
        },
        tooltip: { trigger: 'axis' },
        grid: { left: 50, right: 30, top: 60, bottom: 40 },
        xAxis: { type: 'category', data: labels },
        yAxis: { type: 'value', min: 0, max: 30, name: 'Score' },
        series: [
          {
            type: 'line',
            data: scores,
            smooth: true,
            // 与页面判定规则一致的警戒线：低于 24 分表示需要关注
            markLine: {
              data: [{ yAxis: 24 }],
              lineStyle: { color: '#dc3545' },
              label: { formatter: 'Alert < 24' },
            },
          },
        ],
      }
    },
  },
  mounted() {
    let savedData = localStorage.getItem('my_health_records')
    if (savedData !== null) {
      this.recordList = JSON.parse(savedData)
    } else {
      this.recordList = []
    }

    // 图表数据源来自 Firestore：在线时拉取 Firestore 中的健康记录（含他人录入）
    this.loadRecordsFromFirestore()

    // 默认把收件人填成当前登录用户的邮箱，方便直接发送给自己
    let savedUser = localStorage.getItem('current_user')
    if (savedUser !== null) {
      const user = JSON.parse(savedUser)
      if (user.email !== undefined) {
        this.emailForm.to = user.email
      }
    }
  },
  methods: {
    // 保存新记录（async：需要等待 Firestore 写入完成）
    async saveNewRecord() {
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

        // 同步写入 Firestore，保证图表数据源来自 Firestore；失败（如离线）时忽略
        try {
          await addDoc(collection(db, 'health_records'), {
            patientRID: safeRID,
            visitCode: this.newRecord.visitCode,
            visitCode2: safeViscode2,
            mmseScore: this.newRecord.mmseScore,
            createdAt: new Date().toISOString(),
          })
        } catch {
          // Firestore 写入失败时不影响本地保存与离线使用
        }

        // 离线时把这次操作加入待同步队列，恢复在线后由横幅提示
        if (isOnline() === false) {
          enqueueAction('save_health_record', recordToSave)
        }

        this.newRecord.patientRID = ''
        this.newRecord.visitCode = ''
        this.newRecord.visitCode2 = ''
        this.newRecord.mmseScore = ''
      }
    },

    // 从 Firestore 读取全部健康记录作为图表数据；失败则保持本地缓存
    async loadRecordsFromFirestore() {
      try {
        const snapshot = await getDocs(
          query(collection(db, 'health_records'), orderBy('createdAt', 'asc')),
        )
        const records = snapshot.docs.map((document) => {
          const data = document.data()
          return {
            patientRID: data.patientRID,
            visitCode: data.visitCode,
            visitCode2: data.visitCode2,
            mmseScore: data.mmseScore,
          }
        })
        // Firestore 有数据时以其为准，并同步回本地缓存，保证离线也可查看
        if (records.length > 0) {
          this.recordList = records
          localStorage.setItem('my_health_records', JSON.stringify(records))
        }
      } catch {
        // 离线或网络异常时保留本地缓存数据，图表仍然可用
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
      exportToPDF(
        this.recordList,
        this.reportColumns,
        'Health_Assessment_Report.pdf',
        'My Health Assessment Report',
      )
    },

    // 校验邮箱格式是否合法
    isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(email)
    },

    // 把 UTF-8 文本转成 base64（btoa 只支持拉丁字符，需要先编码成字节）
    utf8ToBase64(text) {
      const bytes = new TextEncoder().encode(text)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary = binary + String.fromCharCode(bytes[i])
      }
      return btoa(binary)
    },

    // 把健康记录作为 CSV 附件发送到指定邮箱
    async sendHealthReportEmail() {
      // 收件人邮箱校验
      if (this.isValidEmail(this.emailForm.to) === false) {
        this.emailStatusIsError = true
        this.emailStatusMessage = 'Please enter a valid recipient email address.'
        return
      }

      // 至少需要一条记录，否则没有附件内容
      if (this.recordList.length === 0) {
        this.emailStatusIsError = true
        this.emailStatusMessage = 'No records to send. Please add a record first.'
        return
      }

      // 生成 CSV 附件：加上 BOM 避免 Excel 乱码，再转成 base64
      const csvText = '\uFEFF' + buildCSVString(this.recordList, this.reportColumns)
      const csvBase64 = this.utf8ToBase64(csvText)

      this.isSendingEmail = true
      this.emailStatusMessage = ''

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: this.emailForm.to,
            subject: 'Your ElderCare Health Report',
            text:
              this.emailForm.note !== ''
                ? this.emailForm.note
                : 'Dear ElderCare user, please find attached your latest health tracking records.',
            attachment: {
              filename: 'Health_Report.csv',
              content: csvBase64,
            },
          }),
        })

        const result = await response.json()

        if (response.ok === false) {
          const reason = result.error !== undefined ? result.error : 'Unknown error.'
          this.emailStatusIsError = true
          this.emailStatusMessage = 'Failed to send email: ' + reason
        } else {
          this.emailStatusIsError = false
          this.emailStatusMessage = 'Email sent successfully! Please check the inbox.'
        }
      } catch {
        this.emailStatusIsError = true
        this.emailStatusMessage = 'Network error. Please check your connection and try again.'
      } finally {
        this.isSendingEmail = false
      }
    },
  },
}
</script>

<style scoped>
.chart-box {
  height: 340px;
  width: 100%;
}
</style>
