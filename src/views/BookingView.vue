<template>
  <div class="container mt-4">
    <h1 class="fw-bolder text-dark mb-4">Book a Volunteer Visit</h1>
    <p class="text-dark fs-5 fw-bold mb-4">
      Pick a day on the calendar to schedule a friendly volunteer visit. If you already have a
      booking on the same day, the system will reject the duplicate.
    </p>

    <div class="row g-4">
      <!-- 左侧：预约日历 -->
      <div class="col-lg-8">
        <div class="card shadow border-2 border-success rounded-4">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-3">Visit Calendar</h2>
            <p class="text-dark fs-6 fw-bold mb-3">Click any date to book, or click an existing
              booking to cancel it.</p>

            <!-- FullCalendar 月视图日历 -->
            <FullCalendar v-bind:options="calendarOptions" />

            <p class="text-dark fs-6 fw-bold mt-3 mb-0">
              Tip: this calendar works offline too — bookings are saved in your browser.
            </p>
          </div>
        </div>
      </div>

      <!-- 右侧：预约表单 + 我的预约列表 -->
      <div class="col-lg-4">
        <div class="card shadow border-2 border-primary rounded-4 mb-4">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-3">New Booking</h2>

            <!-- 尚未选择日期时提示 -->
            <div v-if="showBookingForm === false" class="text-dark fs-5 fw-bold py-4">
              Select a date on the calendar to start booking.
            </div>

            <!-- 选择日期后的预约表单 -->
            <form v-else v-on:submit.prevent="submitBooking" aria-describedby="booking-errors">
              <div class="mb-3">
                <label class="form-label text-dark fw-bold fs-5" for="bookingDate">Date</label>
                <input
                  id="bookingDate"
                  type="text"
                  v-model="newBooking.date"
                  class="form-control form-control-lg border-2 bg-light"
                  readonly
                  tabindex="-1"
                  aria-label="Selected booking date"
                />
              </div>

              <div class="mb-3">
                <label class="form-label text-dark fw-bold fs-5" for="bookingTimeSlot"
                  >Preferred Time</label
                >
                <select
                  id="bookingTimeSlot"
                  v-model="newBooking.timeSlot"
                  class="form-select form-select-lg border-2"
                >
                  <option value="">Select a time...</option>
                  <option value="Morning">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon">Afternoon (1:00 PM - 5:00 PM)</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label text-dark fw-bold fs-5" for="bookingUserName"
                  >Your Name</label
                >
                <input
                  id="bookingUserName"
                  type="text"
                  v-model="newBooking.userName"
                  class="form-control form-control-lg border-2"
                  placeholder="Enter your full name"
                />
              </div>

              <div class="mb-4">
                <label class="form-label text-dark fw-bold fs-5" for="bookingContact"
                  >Contact Number</label
                >
                <input
                  id="bookingContact"
                  type="tel"
                  v-model="newBooking.contactNumber"
                  class="form-control form-control-lg border-2"
                  placeholder="Enter your phone number"
                />
              </div>

              <!-- 冲突或校验错误 -->
              <div
                v-if="errorMessage !== ''"
                id="booking-errors"
                class="alert alert-danger fs-5 fw-bold p-3"
                role="alert"
              >
                {{ errorMessage }}
              </div>

              <!-- 预约成功提示 -->
              <div
                v-if="successMessage !== ''"
                class="alert alert-success fs-5 fw-bold p-3"
                role="status"
              >
                {{ successMessage }}
              </div>

              <button type="submit" class="btn btn-primary btn-lg w-100 fw-bold shadow-sm">
                Confirm Booking
              </button>
              <button
                type="button"
                v-on:click="cancelBookingForm"
                class="btn btn-outline-secondary btn-lg w-100 mt-2 fw-bold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>

        <!-- 我的预约列表（文字替代日历，供屏幕阅读器使用，也可逐个取消） -->
        <div class="card shadow border-2 rounded-4 bg-light">
          <div class="card-body p-4">
            <h2 class="card-title fw-bolder text-dark mb-3">
              My Bookings
              <span class="badge bg-primary fs-6">{{ bookings.length }}</span>
            </h2>

            <div v-if="bookings.length === 0" class="text-dark fs-5 fw-bold">
              No bookings yet.
            </div>

            <ul class="list-group">
              <li
                v-for="booking in bookings"
                v-bind:key="booking.id"
                class="list-group-item mb-2 border-2 rounded-3 p-3 shadow-sm"
              >
                <div class="fs-5">
                  <strong class="text-dark">{{ booking.date }}</strong>
                  <span class="badge bg-success ms-2">{{ booking.timeSlot }}</span>
                  <br />
                  <span class="text-dark fw-bold">{{ booking.userName }}</span>
                  <br />
                  <span class="text-secondary fw-bold">{{ booking.contactNumber }}</span>
                </div>
                <button
                  v-on:click="deleteBooking(booking.id)"
                  class="btn btn-danger btn-lg mt-2 fw-bold shadow-sm"
                >
                  Cancel Booking
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
// FullCalendar：免费开源的日历组件，配合 Vue 3 使用
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
// interaction 插件负责"点击日期选择"等交互（selectable 依赖它）
import interactionPlugin from '@fullcalendar/interaction'

// 本地存储预约数据的键名
const BOOKINGS_STORAGE_KEY = 'volunteer_bookings'

export default {
  name: 'BookingView',
  components: {
    FullCalendar,
  },
  data() {
    return {
      bookings: [], // 所有预约记录
      showBookingForm: false, // 是否显示预约表单
      errorMessage: '', // 冲突或校验错误提示
      successMessage: '', // 预约成功提示
      newBooking: {
        date: '', // 选中的日期（YYYY-MM-DD）
        timeSlot: '',
        userName: '',
        contactNumber: '',
      },
    }
  },
  computed: {
    // 日历配置：月视图 + 选择日期 + 展示已有预约
    calendarOptions() {
      return {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        selectable: true,
        // 转换预约数据为日历事件
        events: this.bookings.map((booking) => {
          return {
            title: booking.userName + ' · ' + booking.timeSlot,
            date: booking.date,
            extendedProps: { id: booking.id },
          }
        }),
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        height: 'auto',
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'today',
        },
      }
    },
  },
  mounted() {
    // 页面加载时从本地存储读回历史预约
    const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY)
    if (saved !== null) {
      this.bookings = JSON.parse(saved)
    } else {
      this.bookings = []
    }

    // 预约表单默认填当前登录用户的名字，方便快速填写
    const savedUser = localStorage.getItem('current_user')
    if (savedUser !== null) {
      const user = JSON.parse(savedUser)
      if (user.username !== undefined && user.username !== '') {
        this.newBooking.userName = user.username
      }
    }
  },
  methods: {
    // 在日历上点击某一天 → 弹出预约表单
    handleDateSelect(info) {
      if (info.allDay === true) {
        // startStr 形如 "2026-12-31"，只取日期部分
        this.newBooking.date = info.startStr.slice(0, 10)
        this.showBookingForm = true
        this.errorMessage = ''
        this.successMessage = ''
      }
    },

    // 提交预约
    submitBooking() {
      this.errorMessage = ''
      this.successMessage = ''

      // 表单校验
      const name = this.newBooking.userName.trim()
      const contact = this.newBooking.contactNumber.trim()
      if (name === '') {
        this.errorMessage = 'Please enter your name.'
        return
      }
      if (contact === '') {
        this.errorMessage = 'Please enter your contact number.'
        return
      }
      if (this.newBooking.timeSlot === '') {
        this.errorMessage = 'Please select a preferred time.'
        return
      }

      // 冲突管理：同一个人在同一天已有预约则拒绝
      const conflict = this.bookings.some((booking) => {
        return (
          booking.date === this.newBooking.date &&
          booking.userName === name
        )
      })
      if (conflict === true) {
        this.errorMessage =
          'You already have a booking on ' +
          this.newBooking.date +
          '. Please pick another day.'
        return
      }

      // 保存新预约：id 用作删除时的唯一标识
      const newId = Date.now()
      this.bookings.push({
        id: newId,
        date: this.newBooking.date,
        timeSlot: this.newBooking.timeSlot,
        userName: name,
        contactNumber: contact,
      })
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(this.bookings))

      this.successMessage = 'Booking confirmed for ' + this.newBooking.date + '!'
      this.showBookingForm = false
    },

    // 点击日历上的已有预约 → 询问是否取消
    handleEventClick(info) {
      const bookingId = info.event.extendedProps.id
      const confirmed = window.confirm('Cancel this booking?')
      if (confirmed === true) {
        this.deleteBooking(bookingId)
      }
    },

    // 取消一条预约（按 id 删除并保存）
    deleteBooking(bookingId) {
      this.bookings = this.bookings.filter((booking) => {
        return booking.id !== bookingId
      })
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(this.bookings))
    },

    // 关掉预约表单并清空提示
    cancelBookingForm() {
      this.showBookingForm = false
      this.errorMessage = ''
      this.successMessage = ''
    },
  },
}
</script>