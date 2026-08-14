<template>
  <div class="card shadow border-2 rounded-4">
    <div class="card-body p-4">
      <!-- 标题行：标题 + 记录总数徽章 + 全局搜索 + 清空按钮 -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h3 class="fw-bolder text-dark mb-0">
          {{ caption }}
          <span class="badge bg-primary fs-5">{{ totalCount }} records</span>
        </h3>

        <div class="d-flex flex-wrap gap-2">
          <input
            type="search"
            v-model="globalSearch"
            class="form-control form-control-lg border-2"
            placeholder="Search all columns..."
            aria-label="Search all columns"
          />
          <button
            type="button"
            v-on:click="clearAllFilters"
            class="btn btn-dark btn-lg fw-bold shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div class="table-responsive rounded-3 shadow-sm border border-2">
        <table class="table table-striped table-hover table-bordered mb-0">
          <!-- 给屏幕阅读器使用的表格标题 -->
          <caption class="visually-hidden">{{ caption }}</caption>

          <thead class="table-dark fs-5">
            <tr>
              <!-- 点击表头按钮即可排序 -->
              <th
                v-for="col in columns"
                v-bind:key="col.key"
                scope="col"
                class="p-3"
                v-bind:aria-sort="
                  sortKey === col.key
                    ? sortDirection === 1
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                "
              >
                <button
                  type="button"
                  class="btn btn-link text-white p-0 fw-bolder text-decoration-none w-100 d-flex justify-content-between align-items-center border-0"
                  v-on:click="toggleSort(col.key)"
                  v-bind:aria-label="'Sort by ' + col.label"
                >
                  <span>{{ col.label }}</span>
                  <span aria-hidden="true">{{ sortArrow(col.key) }}</span>
                </button>
              </th>
            </tr>

            <!-- 按列搜索行：每一列独立的关键词输入框 -->
            <tr>
              <th v-for="col in columns" v-bind:key="'search-' + col.key" class="p-2">
                <input
                  type="text"
                  v-model="perColumnSearch[col.key]"
                  class="form-control form-control-sm border-2"
                  v-bind:placeholder="'Search ' + col.label"
                  v-bind:aria-label="'Search by ' + col.label"
                />
              </th>
            </tr>
          </thead>

          <tbody class="fs-5 text-dark fw-bold">
            <tr v-if="displayRows.length === 0">
              <td v-bind:colspan="columns.length" class="text-center py-5">
                No matching data found.
              </td>
            </tr>

            <!-- 特殊列可以通过具名插槽自定义显示内容 -->
            <tr v-for="(row, index) in displayRows" v-bind:key="index">
              <td v-for="col in columns" v-bind:key="col.key" class="p-3">
                <slot v-bind:name="col.key" v-bind:row="row" v-bind:value="getColumnValue(row, col)">
                  {{ getColumnValue(row, col) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页控件：每页固定 10 行 -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mt-3 fs-5 fw-bold text-dark">
        <span>
          Showing {{ displayStartIndex }} - {{ displayEndIndex }} of {{ totalCount }} records
        </span>

        <nav aria-label="Pagination">
          <ul class="pagination pagination-lg mb-0">
            <li class="page-item" v-bind:class="{ disabled: currentPage === 1 }">
              <button
                type="button"
                class="page-link"
                v-on:click="goToPage(currentPage - 1)"
                v-bind:disabled="currentPage === 1"
              >
                Previous
              </button>
            </li>

            <li
              class="page-item"
              v-for="page in pageNumbers"
              v-bind:key="page"
              v-bind:class="{ active: page === currentPage }"
            >
              <button type="button" class="page-link" v-on:click="goToPage(page)">{{ page }}</button>
            </li>

            <li class="page-item" v-bind:class="{ disabled: currentPage === totalPages }">
              <button
                type="button"
                class="page-link"
                v-on:click="goToPage(currentPage + 1)"
                v-bind:disabled="currentPage === totalPages"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    // 表格要展示的原始数据行
    tableData: {
      type: Array,
      required: true,
    },
    // 列配置：{ key: 数据字段名, label: 表头文字, sortType: 'string' 或 'number' }
    columns: {
      type: Array,
      required: true,
    },
    // 表格标题文字
    caption: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      sortKey: '', // 当前正在排序的列
      sortDirection: 1, // 1 = 升序, -1 = 降序
      globalSearch: '', // 全局搜索关键词
      perColumnSearch: {}, // 每一列的独立搜索关键词
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示行数（需求固定为 10）
    }
  },
  computed: {
    // 先按全局搜索 + 按列搜索过滤原始数据
    filteredRows() {
      return this.tableData.filter((row) => {
        // 全局搜索：任意一列包含关键词即保留
        if (this.globalSearch !== '') {
          const combined = this.columns
            .map((col) => String(this.getColumnValue(row, col)).toLowerCase())
            .join(' ')
          if (combined.includes(this.globalSearch.toLowerCase()) === false) {
            return false
          }
        }

        // 按列搜索：每一列的独立关键词都要匹配
        for (let i = 0; i < this.columns.length; i++) {
          const col = this.columns[i]
          const keyword = this.perColumnSearch[col.key]
          if (keyword !== '' && keyword !== undefined) {
            const value = String(this.getColumnValue(row, col)).toLowerCase()
            if (value.includes(keyword.toLowerCase()) === false) {
              return false
            }
          }
        }

        return true
      })
    },

    // 再对过滤结果进行排序
    sortedRows() {
      if (this.sortKey === '') {
        return this.filteredRows
      }

      // 浅拷贝后再排序，避免修改原始数组
      const result = [...this.filteredRows]
      const targetCol = this.columns.find((col) => col.key === this.sortKey)

      result.sort((rowA, rowB) => {
        const valueA = this.getColumnValue(rowA, targetCol)
        const valueB = this.getColumnValue(rowB, targetCol)

        let comparison = 0
        // 数字列用数值比较，文本列用字母顺序比较
        if (targetCol.sortType === 'number') {
          const numA = parseFloat(valueA)
          const numB = parseFloat(valueB)
          if (isNaN(numA) === false && isNaN(numB) === false) {
            comparison = numA - numB
          }
        } else {
          comparison = String(valueA).localeCompare(String(valueB))
        }

        return comparison * this.sortDirection
      })

      return result
    },

    // 当前页要显示的行（分页切分）
    displayRows() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      return this.sortedRows.slice(startIndex, startIndex + this.pageSize)
    },

    totalCount() {
      return this.filteredRows.length
    },

    totalPages() {
      if (this.totalCount === 0) {
        return 1
      }
      return Math.ceil(this.totalCount / this.pageSize)
    },

    // 页码列表，例如 [1, 2, 3, 4]
    pageNumbers() {
      const pages = []
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i)
      }
      return pages
    },

    // 当前页第一条记录在全表中的位置
    displayStartIndex() {
      if (this.totalCount === 0) {
        return 0
      }
      return (this.currentPage - 1) * this.pageSize + 1
    },

    displayEndIndex() {
      const endIndex = this.currentPage * this.pageSize
      if (endIndex > this.totalCount) {
        return this.totalCount
      }
      return endIndex
    },
  },
  created() {
    // 组件创建时，为每一列初始化一个空的搜索关键词
    this.initColumnSearches()
  },
  watch: {
    // 当筛选结果变少导致当前页超出总页数时，自动回到最后一页
    totalCount() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      }
    },
  },
  methods: {
    // 为每一列建立独立的搜索关键词，存放在对象中
    initColumnSearches() {
      const searches = {}
      for (let i = 0; i < this.columns.length; i++) {
        searches[this.columns[i].key] = ''
      }
      this.perColumnSearch = searches
    },

    // 点击表头切换排序：同一列再点一次切换升降序
    toggleSort(columnKey) {
      if (this.sortKey === columnKey) {
        this.sortDirection = this.sortDirection === 1 ? -1 : 1
      } else {
        this.sortKey = columnKey
        this.sortDirection = 1
      }
    },

    // 显示排序箭头：升序 ▲、降序 ▼、未排序 ↕
    sortArrow(columnKey) {
      if (this.sortKey !== columnKey) {
        return '↕'
      }
      return this.sortDirection === 1 ? '▲' : '▼'
    },

    // 清空所有搜索条件，并回到第一页
    clearAllFilters() {
      this.globalSearch = ''
      this.initColumnSearches()
      this.currentPage = 1
    },

    // 跳转到指定页，并限制页码范围
    goToPage(page) {
      if (page < 1) {
        page = 1
      }
      if (page > this.totalPages) {
        page = this.totalPages
      }
      this.currentPage = page
    },

    // 读取某一行指定列的值；找不到就返回空字符串
    getColumnValue(row, column) {
      const value = row[column.key]
      if (value === undefined || value === null) {
        return ''
      }
      return value
    },
  },
}
</script>

<style scoped>
/* 表头排序按钮悬停时高亮，提示可以点击 */
thead th button:hover {
  color: #ffc107 !important;
}
</style>
