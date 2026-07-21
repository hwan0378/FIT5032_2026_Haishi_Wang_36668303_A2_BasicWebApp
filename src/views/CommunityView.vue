<template>
  <div class="container mt-4">
    <div class="row">
      <!-- 志愿者探访预约表单 -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h4 class="card-title fw-bold text-dark mb-4">Request a Volunteer Visit</h4>
            <p class="text-muted mb-4">
              Schedule a friendly check-in or request assistance from our vetted community
              volunteers.
            </p>

            <form v-on:submit.prevent="submitVolunteerRequest">
              <!-- 姓名 -->
              <div class="mb-3">
                <label class="form-label text-dark">Your Name</label>
                <input
                  type="text"
                  v-model="newRequest.userName"
                  class="form-control"
                  placeholder="Enter your full name"
                />
              </div>

              <!-- 联系电话 -->
              <div class="mb-3">
                <label class="form-label text-dark">Contact Number</label>
                <input
                  type="tel"
                  v-model="newRequest.contactNumber"
                  class="form-control"
                  placeholder="Enter your phone number"
                />
              </div>

              <!-- 期望日期 -->
              <div class="mb-3">
                <label class="form-label text-dark">Preferred Date</label>
                <input type="date" v-model="newRequest.preferredDate" class="form-control" />
              </div>

              <!-- 期望时间段 -->
              <div class="mb-3">
                <label class="form-label text-dark">Preferred Time</label>
                <select v-model="newRequest.preferredTime" class="form-select">
                  <option value="">Select a time...</option>
                  <option value="Morning">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                </select>
              </div>

              <div v-if="errorMessageList.length > 0" class="alert alert-danger p-3">
                <ul class="mb-0">
                  <li v-for="(message, index) in errorMessageList" v-bind:key="index">
                    {{ message }}
                  </li>
                </ul>
              </div>

              <div v-if="isSubmissionSuccessful === true" class="alert alert-success p-3">
                Your request has been submitted successfully! A coordinator will contact you soon.
              </div>

              <button type="submit" class="btn btn-primary w-100 mt-2">Submit Request</button>
            </form>

            <hr class="my-4" />
            <h5 class="text-dark fw-bold mb-3">My Pending Requests</h5>
            <div v-if="savedRequestList.length === 0" class="text-muted small">
              You have no pending volunteer requests.
            </div>
            <ul class="list-group">
              <li
                v-for="(request, index) in savedRequestList"
                v-bind:key="index"
                class="list-group-item bg-light"
              >
                <strong>Date:</strong> {{ request.preferredDate }} ({{ request.preferredTime }})
                <br />
                <span class="text-muted small">Contact: {{ request.contactNumber }}</span>
                <button
                  v-on:click="cancelRequest(index)"
                  class="btn btn-sm btn-link text-danger p-0 mt-2"
                >
                  Cancel Request
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 本地互助小组资源 -->
      <div class="col-md-6">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h4 class="card-title fw-bold text-dark mb-4">Local Support Groups</h4>
            <p class="text-muted mb-4">
              Connect with others, share experiences, and find emotional support in your local
              community.
            </p>

            <div class="card border mb-3">
              <div class="card-body">
                <h5 class="card-title text-primary fw-bold">Memory Cafe Gathering</h5>
                <p class="card-text text-dark mb-1">
                  A safe and welcoming space for individuals with memory loss and their caregivers.
                </p>
                <p class="text-muted small mb-3">
                  Every Tuesday, 10:00 AM - Downtown Community Center
                </p>
                <button class="btn btn-outline-primary btn-sm">Get Directions</button>
              </div>
            </div>

            <div class="card border mb-3">
              <div class="card-body">
                <h5 class="card-title text-primary fw-bold">Caregiver Support Circle</h5>
                <p class="card-text text-dark mb-1">
                  Share advice, resources, and emotional support with other dedicated caregivers.
                </p>
                <p class="text-muted small mb-3">
                  First Thursday of the month, 6:00 PM - Online Zoom
                </p>
                <button class="btn btn-outline-primary btn-sm">Join Online</button>
              </div>
            </div>

            <div class="card border">
              <div class="card-body">
                <h5 class="card-title text-primary fw-bold">Senior Wellness Walk</h5>
                <p class="card-text text-dark mb-1">
                  Gentle outdoor exercise combined with friendly conversation.
                </p>
                <p class="text-muted small mb-3">Every Friday, 9:00 AM - Riverside City Park</p>
                <button class="btn btn-outline-primary btn-sm">Learn More</button>
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
      // 存放所有已经提交的预约记录
      savedRequestList: [],
      // 存放报错信息的数组
      errorMessageList: [],
      isSubmissionSuccessful: false,
    }
  },

  mounted() {
    // 页面打开时，从本地仓库读取之前的预约记录
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

      if (this.errorMessageList.length === 0) {
        let requestToSave = {
          userName: this.newRequest.userName,
          contactNumber: this.newRequest.contactNumber,
          preferredDate: this.newRequest.preferredDate,
          preferredTime: this.newRequest.preferredTime,
        }

        this.savedRequestList.push(requestToSave)

        localStorage.setItem('volunteer_requests', JSON.stringify(this.savedRequestList))

        this.isSubmissionSuccessful = true

        this.newRequest.userName = ''
        this.newRequest.contactNumber = ''
        this.newRequest.preferredDate = ''
        this.newRequest.preferredTime = ''
      }
    },

    cancelRequest(indexNumber) {
      // 从数组中删除这一条记录
      this.savedRequestList.splice(indexNumber, 1)
      // 重新保存本地仓库
      localStorage.setItem('volunteer_requests', JSON.stringify(this.savedRequestList))
    },
  },
}
</script>

<style scoped>
.small {
  font-size: 0.95rem;
}
</style>
