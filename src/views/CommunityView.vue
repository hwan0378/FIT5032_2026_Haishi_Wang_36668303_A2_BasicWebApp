<template>
  <div class="container mt-4">
    <h1 class="fw-bolder text-dark mb-4">Community</h1>

    <div class="row">
      <!-- 志愿者探访预约表单 -->
      <div class="col-md-6 mb-4">
        <div class="card shadow border-2 border-info rounded-4">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">Request a Visit</h2>
            <p class="text-dark fs-5 fw-bold mb-4">
              Schedule a friendly check-in from our vetted volunteers.
            </p>

            <form v-on:submit.prevent="submitVolunteerRequest" aria-describedby="visit-form-errors">
              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="visitUserName"
                  >Your Name</label
                >
                <input
                  id="visitUserName"
                  type="text"
                  v-model="newRequest.userName"
                  class="form-control form-control-lg border-2"
                  placeholder="Enter your full name"
                />
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="visitContactNumber"
                  >Contact Number</label
                >
                <input
                  id="visitContactNumber"
                  type="tel"
                  v-model="newRequest.contactNumber"
                  class="form-control form-control-lg border-2"
                  placeholder="Enter your phone number"
                />
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="visitPreferredDate"
                  >Preferred Date</label
                >
                <input
                  id="visitPreferredDate"
                  type="text"
                  v-model="newRequest.preferredDate"
                  class="form-control form-control-lg border-2"
                  placeholder="e.g., 2026-12-31"
                />
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="visitPreferredTime"
                  >Preferred Time</label
                >
                <select
                  id="visitPreferredTime"
                  v-model="newRequest.preferredTime"
                  class="form-select form-select-lg border-2"
                >
                  <option value="">Select a time...</option>
                  <option value="Morning">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                </select>
              </div>

              <!-- 校验错误列表：role=alert 自动播报 -->
              <div
                v-if="errorMessageList.length > 0"
                id="visit-form-errors"
                class="alert alert-danger fs-5 fw-bold p-3"
                role="alert"
              >
                <ul class="mb-0">
                  <li v-for="(message, index) in errorMessageList" v-bind:key="index">
                    {{ message }}
                  </li>
                </ul>
              </div>

              <!-- 提交成功提示：role=status 温和播报 -->
              <div
                v-if="isSubmissionSuccessful === true"
                class="alert alert-success fs-5 fw-bold p-3"
                role="status"
              >
                Your request has been submitted successfully!
              </div>

              <button
                type="submit"
                class="btn btn-info text-dark btn-lg w-100 mt-2 fw-bold shadow-sm"
              >
                Submit Request
              </button>
            </form>

            <hr class="my-4 border-2" />
            <h4 class="text-dark fw-bolder mb-3">My Pending Requests</h4>

            <div v-if="savedRequestList.length === 0" class="text-dark fs-5 fw-bold">
              You have no pending requests.
            </div>

            <ul class="list-group">
              <li
                v-for="(request, index) in savedRequestList"
                v-bind:key="index"
                class="list-group-item bg-light border-2 mb-2 rounded-3 p-3 shadow-sm"
              >
                <div class="fs-5">
                  <strong class="text-dark">Date:</strong> {{ request.preferredDate }} ({{
                    request.preferredTime
                  }})
                  <br />
                  <span class="text-dark fw-bold">Contact: {{ request.contactNumber }}</span>
                </div>
                <button
                  v-on:click="cancelRequest(index)"
                  class="btn btn-danger btn-lg mt-3 fw-bold shadow-sm"
                >
                  Cancel Request
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 本地互助小组卡片 -->
      <div class="col-md-6">
        <div class="card shadow border-2 rounded-4 mb-4 bg-light">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-4 border-bottom pb-3">
              Local Support Groups
            </h2>
            <p class="text-dark fs-5 fw-bold mb-4">
              Connect with others and find emotional support.
            </p>

            <div class="card border border-2 border-primary mb-4 shadow-sm rounded-4">
              <div class="card-body p-4">
                <h3 class="card-title text-primary fw-bolder">Memory Cafe Gathering</h3>
                <p class="card-text text-dark fs-5 mb-2">
                  A safe and welcoming space for individuals with memory loss and caregivers.
                </p>
                <p class="text-dark fw-bold fs-5 mb-3 bg-light p-2 rounded">
                  Every Tuesday, 10:00 AM
                </p>
                <button class="btn btn-primary btn-lg fw-bold">Get Directions</button>
              </div>
            </div>

            <div class="card border border-2 border-success mb-4 shadow-sm rounded-4">
              <div class="card-body p-4">
                <h3 class="card-title text-success fw-bolder">Caregiver Support Circle</h3>
                <p class="card-text text-dark fs-5 mb-2">
                  Share advice, resources, and emotional support.
                </p>
                <p class="text-dark fw-bold fs-5 mb-3 bg-light p-2 rounded">
                  First Thursday, 6:00 PM (Online)
                </p>
                <button class="btn btn-success btn-lg fw-bold">Join Online</button>
              </div>
            </div>

            <div class="card border border-2 border-warning mb-4 shadow-sm rounded-4">
              <div class="card-body p-4">
                <h3 class="card-title text-dark fw-bolder">Senior Wellness Walk</h3>
                <p class="card-text text-dark fs-5 mb-2">
                  Gentle outdoor exercise combined with friendly conversation.
                </p>
                <p class="text-dark fw-bold fs-5 mb-3 bg-light p-2 rounded">
                  Every Friday, 9:00 AM - Riverside Park
                </p>
                <button class="btn btn-warning btn-lg fw-bold text-dark">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityView',
  data() {
    return {
      newRequest: {
        userName: '',
        contactNumber: '',
        preferredDate: '',
        preferredTime: '',
      },
      savedRequestList: [],
      errorMessageList: [],
      isSubmissionSuccessful: false,
    }
  },
  mounted() {
    // 页面挂载时初始化：从本地存储读取历史数据
    let savedData = localStorage.getItem('volunteer_requests')
    if (savedData !== null) {
      this.savedRequestList = JSON.parse(savedData)
    } else {
      this.savedRequestList = []
    }
  },
  methods: {
    submitVolunteerRequest() {
      this.errorMessageList = []
      this.isSubmissionSuccessful = false

      // 必填项校验
      if (this.newRequest.userName === '') {
        this.errorMessageList.push('[Error] Please enter your name.')
      }
      if (this.newRequest.contactNumber === '') {
        this.errorMessageList.push('[Error] Please enter your contact number.')
      }
      if (this.newRequest.preferredDate === '') {
        this.errorMessageList.push('[Error] Please select a preferred date.')
      }
      if (this.newRequest.preferredTime === '') {
        this.errorMessageList.push('[Error] Please select a preferred time.')
      }

      // 如果校验通过，执行安全清理与保存
      if (this.errorMessageList.length === 0) {
        // 安全要求：强制替换危险的 HTML 标签，防止 XSS 攻击
        let safeUserName = this.newRequest.userName.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        let safeContact = this.newRequest.contactNumber.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        let safeDate = this.newRequest.preferredDate.replace(/</g, '&lt;').replace(/>/g, '&gt;')

        let requestToSave = {
          userName: safeUserName,
          contactNumber: safeContact,
          preferredDate: safeDate,
          preferredTime: this.newRequest.preferredTime,
        }

        this.savedRequestList.push(requestToSave)
        localStorage.setItem('volunteer_requests', JSON.stringify(this.savedRequestList))

        this.isSubmissionSuccessful = true

        // 重置表单状态
        this.newRequest.userName = ''
        this.newRequest.contactNumber = ''
        this.newRequest.preferredDate = ''
        this.newRequest.preferredTime = ''
      }
    },
    cancelRequest(indexNumber) {
      this.savedRequestList.splice(indexNumber, 1)
      localStorage.setItem('volunteer_requests', JSON.stringify(this.savedRequestList))
    },
  },
}
</script>

<style scoped></style>
