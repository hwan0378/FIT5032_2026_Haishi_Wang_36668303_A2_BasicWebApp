<template>
  <div class="container mt-4 mb-5">
    <div class="text-center mb-5">
      <h1 class="fw-bolder text-dark">Community Directory</h1>
      <p class="text-dark fw-bold fs-4 mt-3">
        Browse support groups, volunteers and local services in one place.
      </p>
    </div>

    <div class="row">
      <div class="col-12">
        <!-- 表 2：社区目录表（支持排序 / 全局搜索 / 按列搜索 / 分页） -->
        <DataTable
          v-bind:table-data="directoryRows"
          v-bind:columns="directoryColumns"
          caption="Community Directory"
        >
          <!-- 状态列使用自定义显示：徽章样式 -->
          <template v-slot:status="{ row }">
            <span v-if="row.status === 'Active'" class="badge bg-success fs-6 p-2">Active</span>
            <span v-else class="badge bg-secondary fs-6 p-2">On Leave</span>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from '../components/DataTable.vue'

export default {
  name: 'DirectoryView',
  components: {
    DataTable,
  },
  data() {
    return {
      // 表 2 的列配置
      directoryColumns: [
        { key: 'name', label: 'Name / Group', sortType: 'string' },
        { key: 'category', label: 'Category', sortType: 'string' },
        { key: 'serviceArea', label: 'Service Area', sortType: 'string' },
        { key: 'phone', label: 'Contact', sortType: 'string' },
        { key: 'email', label: 'Email', sortType: 'string' },
        { key: 'status', label: 'Status', sortType: 'string' },
      ],

      // 模拟数据：社区互助小组、志愿者与本地服务（后续可替换为真实数据源）
      directoryRows: [
        { name: 'Memory Cafe Gathering', category: 'Support Group', serviceArea: 'Clayton', phone: '(03) 9905 1234', email: 'memory.cafe@eldercare.org', status: 'Active' },
        { name: 'Caregiver Support Circle', category: 'Support Group', serviceArea: 'Glen Waverley', phone: '(03) 9905 2345', email: 'caregiver.circle@eldercare.org', status: 'Active' },
        { name: 'Senior Wellness Walk', category: 'Support Group', serviceArea: 'Oakleigh', phone: '(03) 9905 3456', email: 'wellness.walk@eldercare.org', status: 'Active' },
        { name: 'Vietnamese Seniors Club', category: 'Support Group', serviceArea: 'Springvale', phone: '(03) 9905 4567', email: 'vietnamese.club@eldercare.org', status: 'Active' },
        { name: 'Mandarin Friends Group', category: 'Support Group', serviceArea: 'Box Hill', phone: '(03) 9905 5678', email: 'mandarin.friends@eldercare.org', status: 'Active' },
        { name: "Widows' Social Circle", category: 'Support Group', serviceArea: 'Malvern', phone: '(03) 9905 6789', email: 'widows.circle@eldercare.org', status: 'On Leave' },
        { name: "Men's Shed Workshop", category: 'Support Group', serviceArea: 'Bentleigh', phone: '(03) 9905 7890', email: 'mens.shed@eldercare.org', status: 'Active' },
        { name: 'Arts & Crafts Meetup', category: 'Support Group', serviceArea: 'Carnegie', phone: '(03) 9905 8901', email: 'arts.meetup@eldercare.org', status: 'Active' },
        { name: 'Italian Seniors Lunch Club', category: 'Support Group', serviceArea: 'Fawkner', phone: '(03) 9359 8000', email: 'italian.lunch@eldercare.org', status: 'Active' },
        { name: 'Greek Orthodox Friendship Group', category: 'Support Group', serviceArea: 'Oakleigh', phone: '(03) 9569 9000', email: 'greek.friends@eldercare.org', status: 'Active' },

        { name: 'John Smith', category: 'Volunteer', serviceArea: 'Clayton', phone: '0401 111 222', email: 'john.smith@example.com', status: 'Active' },
        { name: 'Mary Johnson', category: 'Volunteer', serviceArea: 'Oakleigh', phone: '0402 222 333', email: 'mary.johnson@example.com', status: 'Active' },
        { name: 'David Lee', category: 'Volunteer', serviceArea: 'Glen Waverley', phone: '0403 333 444', email: 'david.lee@example.com', status: 'On Leave' },
        { name: 'Susan Chen', category: 'Volunteer', serviceArea: 'Box Hill', phone: '0404 444 555', email: 'susan.chen@example.com', status: 'Active' },
        { name: 'Robert Brown', category: 'Volunteer', serviceArea: 'Bentleigh', phone: '0405 555 666', email: 'robert.brown@example.com', status: 'Active' },
        { name: 'Linda Nguyen', category: 'Volunteer', serviceArea: 'Springvale', phone: '0406 666 777', email: 'linda.nguyen@example.com', status: 'Active' },
        { name: 'James Wilson', category: 'Volunteer', serviceArea: 'Carnegie', phone: '0407 777 888', email: 'james.wilson@example.com', status: 'Active' },
        { name: 'Angela Garcia', category: 'Volunteer', serviceArea: 'Malvern', phone: '0408 888 999', email: 'angela.garcia@example.com', status: 'On Leave' },
        { name: 'Kevin Taylor', category: 'Volunteer', serviceArea: 'Dandenong', phone: '0409 999 000', email: 'kevin.taylor@example.com', status: 'Active' },
        { name: 'Emily Davis', category: 'Volunteer', serviceArea: 'Frankston', phone: '0410 000 111', email: 'emily.davis@example.com', status: 'Active' },
        { name: 'Michael Miller', category: 'Volunteer', serviceArea: 'Ringwood', phone: '0411 121 212', email: 'michael.miller@example.com', status: 'Active' },
        { name: 'Sarah White', category: 'Volunteer', serviceArea: 'Caulfield', phone: '0412 232 323', email: 'sarah.white@example.com', status: 'Active' },
        { name: 'Helen Parker', category: 'Volunteer', serviceArea: 'Cheltenham', phone: '0414 454 545', email: 'helen.parker@example.com', status: 'Active' },
        { name: 'George Kim', category: 'Volunteer', serviceArea: 'Northcote', phone: '0415 565 656', email: 'george.kim@example.com', status: 'Active' },

        { name: 'Clayton Community Clinic', category: 'Medical Service', serviceArea: 'Clayton', phone: '(03) 9544 1000', email: 'clinic.clayton@health.gov.au', status: 'Active' },
        { name: 'Box Hill Hospital Outreach', category: 'Medical Service', serviceArea: 'Box Hill', phone: '(03) 9895 2000', email: 'outreach@bhh.gov.au', status: 'Active' },
        { name: 'Monash Health Home Care', category: 'Medical Service', serviceArea: 'Clayton', phone: '(03) 9594 3000', email: 'homecare@monashhealth.org', status: 'Active' },
        { name: 'Mobile Physio Service', category: 'Medical Service', serviceArea: 'Oakleigh', phone: '0413 343 434', email: 'physio.mobile@example.com', status: 'Active' },

        { name: 'Sunshine Senior Day Centre', category: 'Day Centre', serviceArea: 'Sunshine', phone: '(03) 9364 4000', email: 'sunshine.day@eldercare.org', status: 'Active' },
        { name: 'Rosebud Activity Hub', category: 'Day Centre', serviceArea: 'Rosebud', phone: '(03) 5986 5000', email: 'rosebud.hub@eldercare.org', status: 'Active' },
        { name: 'Dandenong Community Centre', category: 'Day Centre', serviceArea: 'Dandenong', phone: '(03) 9791 6000', email: 'dandenong.cc@eldercare.org', status: 'Active' },
        { name: 'Pakenham Social House', category: 'Day Centre', serviceArea: 'Pakenham', phone: '(03) 5941 7000', email: 'pakenham.house@eldercare.org', status: 'Active' },
      ],
    }
  },
}
</script>

<style scoped></style>
