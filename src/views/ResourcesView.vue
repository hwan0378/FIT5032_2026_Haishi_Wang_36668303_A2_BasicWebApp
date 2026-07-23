<template>
  <div class="container mt-4 mb-5">
    <div class="text-center mb-5">
      <h2 class="fw-bold text-dark">Education & Resources</h2>
      <p class="text-muted fs-5">Evidence-based guides for healthy aging.</p>
    </div>

    <div class="row">
      <!-- 健康教育文章区 & 网站打分 -->
      <div class="col-md-6 mb-4">
        <h4 class="fw-bold text-primary mb-3">Featured Articles</h4>

        <div
          v-for="(article, index) in articleList"
          v-bind:key="index"
          class="card shadow-sm border-0 mb-4"
        >
          <div class="card-body">
            <h5 class="card-title fw-bold text-dark">{{ article.title }}</h5>

            <ul class="mt-3 text-dark">
              <li
                v-for="(point, pointIndex) in article.points"
                v-bind:key="pointIndex"
                class="mb-2"
              >
                {{ point }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 网站总体评分卡片 -->
        <div class="card shadow-sm border-0 mb-4 bg-light">
          <div class="card-body">
            <h4 class="card-title fw-bold text-primary border-bottom pb-2">Rate Our Website</h4>
            <p class="text-muted mb-3">
              How would you rate your experience with the ElderCare platform?
            </p>

            <!-- 评分展示区 -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="badge bg-warning text-dark fs-6">
                Average Rating: {{ calculateWebsiteAverageRating() }} ★
              </span>
              <!-- 展示总共有多少人打分 -->
              <span class="text-muted small">({{ websiteRatings.length }} reviews)</span>
            </div>

            <!-- 用户打分操作区 -->
            <div class="input-group input-group-sm">
              <span class="input-group-text">Your Rating:</span>
              <select v-model="userSelectedScore" class="form-select">
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Good</option>
                <option value="3">3 Stars - Average</option>
                <option value="2">2 Stars - Poor</option>
                <option value="1">1 Star - Terrible</option>
              </select>
              <button v-on:click="submitWebsiteRating" class="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 常见问题解答 FAQ -->
      <div class="col-md-6">
        <h4 class="fw-bold text-primary mb-3">Caregiver FAQ</h4>

        <div
          v-for="(faq, index) in faqList"
          v-bind:key="index"
          class="card shadow-sm border-0 mb-3 bg-light"
        >
          <div class="card-body">
            <h5 class="card-title fw-bold text-dark border-bottom pb-2">Q: {{ faq.question }}</h5>
            <p class="card-text text-dark mt-2"><strong>A:</strong> {{ faq.answer }}</p>
          </div>
        </div>

        <!-- 引导联系社区的卡片 -->
        <div class="card border-primary mb-3 mt-4">
          <div class="card-body text-center">
            <h5 class="text-primary fw-bold">Still have questions?</h5>
            <p class="text-muted">Our community coordinators are here to help you.</p>
            <router-link to="/community" class="btn btn-primary">Contact Support</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourcesView',

  data() {
    return {
      // 存放文章数据的数组
      articleList: [
        {
          title: '3 Simple Ways to Keep Your Mind Active',
          points: [
            'Daily Puzzles: Engaging in crosswords or Sudoku can strengthen neural connections.',
            "Learn a New Skill: Whether it's a new recipe or a simple craft, learning challenges your brain.",
            'Stay Social: Regular conversations significantly reduce the risk of cognitive decline.',
          ],
        },
        {
          title: 'Fall Prevention at Home: A Safety Checklist',
          points: [
            'Remove tripping hazards like loose rugs and clutter from walkways.',
            'Install grab bars in the bathroom near the toilet and inside the shower.',
            'Improve lighting in hallways and staircases to ensure clear visibility at night.',
          ],
        },
      ],
      // FAQ 的数据数组
      faqList: [
        {
          question: 'How do I track cognitive health?',
          answer: 'Use our secure Personal Health Portal to log MMSE scores.',
        },
        {
          question: 'Are the local support groups free to attend?',
          answer: 'Yes, they are sponsored and completely free.',
        },
      ],
      userSelectedScore: 5,
      // 存放网站所有的历史打分
      websiteRatings: [],
    }
  },

  mounted() {
    // 页面加载时，读取打分记录
    let savedRatings = localStorage.getItem('website_ratings_data')
    if (savedRatings !== null) {
      this.websiteRatings = JSON.parse(savedRatings)
    } else {
      this.websiteRatings = [5, 4, 5, 4]
    }
  },

  methods: {
    // 计算整个网站平均分
    calculateWebsiteAverageRating() {
      if (this.websiteRatings.length === 0) {
        return 'No ratings yet'
      }

      let totalSum = 0
      for (let i = 0; i < this.websiteRatings.length; i++) {
        totalSum = totalSum + this.websiteRatings[i]
      }

      let average = totalSum / this.websiteRatings.length
      return average.toFixed(1) // toFixed(1) 表示只保留一位小数
    },

    // 提交新分数
    submitWebsiteRating() {
      let newScore = parseInt(this.userSelectedScore)
      this.websiteRatings.push(newScore)
      localStorage.setItem('website_ratings_data', JSON.stringify(this.websiteRatings))
      alert('Thank you for your feedback!')
    },
  },
}
</script>

<style scoped>
.card-body {
  padding: 1.5rem;
}
</style>
