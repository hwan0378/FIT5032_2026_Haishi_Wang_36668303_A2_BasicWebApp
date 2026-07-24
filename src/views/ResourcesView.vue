<template>
  <div class="container mt-4 mb-5">
    <div class="text-center mb-5">
      <h1 class="fw-bolder text-dark">Education & Resources</h1>
      <p class="text-dark fw-bold fs-4 mt-3">Evidence-based guides for healthy aging.</p>
    </div>

    <div class="row">
      <!-- 左侧文章区 -->
      <div class="col-md-6 mb-4">
        <h3 class="fw-bolder text-primary mb-4 border-bottom pb-2">Featured Articles</h3>

        <div
          v-for="(article, index) in articleList"
          v-bind:key="index"
          class="card shadow border-2 border-secondary rounded-4 mb-4"
        >
          <div class="card-body p-4">
            <h4 class="card-title fw-bolder text-dark mb-3">{{ article.title }}</h4>

            <ul class="mt-3 text-dark fs-5 fw-bold" style="line-height: 1.8">
              <li
                v-for="(point, pointIndex) in article.points"
                v-bind:key="pointIndex"
                class="mb-3"
              >
                {{ point }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 网站评分卡片 -->
        <div class="card shadow border-3 border-warning rounded-4 mb-4 bg-light">
          <div class="card-body p-4">
            <h3 class="card-title fw-bolder text-dark border-bottom border-warning pb-3">
              Rate Our Website
            </h3>
            <p class="text-dark fw-bold fs-5 mb-4">
              How would you rate your experience with the ElderCare platform?
            </p>

            <div
              class="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-3 border"
            >
              <span class="badge bg-warning text-dark fs-4 p-2 shadow-sm">
                Average: {{ calculateWebsiteAverageRating() }} ★
              </span>
              <span class="text-dark fw-bold fs-5">({{ websiteRatings.length }} reviews)</span>
            </div>

            <div class="input-group input-group-lg shadow-sm">
              <span class="input-group-text bg-dark text-white fw-bold">Your Rating:</span>
              <select v-model="userSelectedScore" class="form-select border-dark">
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Good</option>
                <option value="3">3 Stars - Average</option>
                <option value="2">2 Stars - Poor</option>
                <option value="1">1 Star - Terrible</option>
              </select>
              <button
                v-on:click="submitWebsiteRating"
                class="btn btn-warning fw-bolder text-dark px-4"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧 FAQ -->
      <div class="col-md-6">
        <h3 class="fw-bolder text-primary mb-4 border-bottom pb-2">Caregiver FAQ</h3>

        <div
          v-for="(faq, index) in faqList"
          v-bind:key="index"
          class="card shadow-sm border-2 rounded-4 mb-4 bg-light"
        >
          <div class="card-body p-4">
            <h4 class="card-title fw-bolder text-primary border-bottom border-secondary pb-3 mb-3">
              Q: {{ faq.question }}
            </h4>
            <p class="card-text text-dark fs-5 fw-bold" style="line-height: 1.6">
              <strong class="text-success fs-4 me-2">A:</strong> {{ faq.answer }}
            </p>
          </div>
        </div>

        <div class="card border-3 border-primary rounded-4 mb-3 mt-5 shadow">
          <div class="card-body text-center p-5">
            <h3 class="text-dark fw-bolder mb-3">Still have questions?</h3>
            <p class="text-dark fs-5 fw-bold mb-4">
              Our community coordinators are here to help you.
            </p>
            <router-link to="/community" class="btn btn-primary btn-lg fw-bold px-5 shadow-sm"
              >Contact Support</router-link
            >
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
      websiteRatings: [],
    }
  },
  mounted() {
    let savedRatings = localStorage.getItem('website_ratings_data')
    if (savedRatings !== null) {
      this.websiteRatings = JSON.parse(savedRatings)
    } else {
      this.websiteRatings = []
    }
  },
  methods: {
    calculateWebsiteAverageRating() {
      if (this.websiteRatings.length === 0) {
        return 'No ratings'
      }

      // 评分：遍历历史评分求和，保留 1 位小数
      let totalSum = 0
      for (let i = 0; i < this.websiteRatings.length; i++) {
        totalSum = totalSum + this.websiteRatings[i]
      }

      let average = totalSum / this.websiteRatings.length
      return average.toFixed(1)
    },
    submitWebsiteRating() {
      let newScore = parseInt(this.userSelectedScore)
      this.websiteRatings.push(newScore)
      localStorage.setItem('website_ratings_data', JSON.stringify(this.websiteRatings))
      alert('Thank you for your feedback!')
    },
  },
}
</script>

<style scoped></style>
