<template>
  <div class="container mt-4 mb-5">
    <div class="text-center mb-5">
      <h1 class="fw-bolder text-dark">Education & Resources</h1>
      <p class="text-dark fw-bold fs-4 mt-3">Evidence-based guides for healthy aging.</p>
    </div>

    <div class="row">
      <!-- 文章区 -->
      <div class="col-md-6 mb-4">
        <h2 class="fw-bolder text-primary mb-4 border-bottom pb-2">Featured Articles</h2>

        <div
          v-for="(article, index) in articleList"
          v-bind:key="index"
          class="card shadow border-2 border-secondary rounded-4 mb-4"
        >
          <div class="card-body p-4">
            <h3 class="card-title fw-bolder text-dark mb-3">{{ article.title }}</h3>

            <ul class="mt-3 text-dark fs-5 fw-bold" style="line-height: 1.8">
              <li
                v-for="(point, pointIndex) in article.points"
                v-bind:key="pointIndex"
                class="mb-3"
              >
                {{ point }}
              </li>
            </ul>

            <hr class="my-4 border-secondary border-2 opacity-25" />

            <!-- 文章评分区：aria-live 让评分变化时屏幕阅读器自动播报 -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span
                class="badge bg-warning text-dark fs-5 p-2 shadow-sm"
                aria-live="polite"
                aria-atomic="true"
              >
                Avg Rating: {{ calculateArticleAverage(article.ratings) }} ★
              </span>
              <span class="text-dark fw-bold fs-6">({{ article.ratings.length }} reviews)</span>
            </div>

            <div class="input-group input-group-lg shadow-sm">
              <span class="input-group-text bg-dark text-white fw-bold">Rate:</span>
              <select
                v-model="article.currentUserScore"
                class="form-select border-dark"
                aria-label="Rate this article"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
              <button
                v-on:click="submitArticleRating(index)"
                class="btn btn-warning fw-bolder text-dark px-4"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="col-md-6">
        <h2 class="fw-bolder text-primary mb-4 border-bottom pb-2">Caregiver FAQ</h2>

        <div
          v-for="(faq, index) in faqList"
          v-bind:key="index"
          class="card shadow-sm border-2 rounded-4 mb-4 bg-light"
        >
          <div class="card-body p-4">
            <h3 class="card-title fw-bolder text-primary border-bottom border-secondary pb-3 mb-3">
              Q: {{ faq.question }}
            </h3>
            <p class="card-text text-dark fs-5 fw-bold" style="line-height: 1.6">
              <strong class="text-success fs-4 me-2">A:</strong> {{ faq.answer }}
            </p>
          </div>
        </div>

        <div class="card border-3 border-primary rounded-4 mb-3 mt-5 shadow">
          <div class="card-body text-center p-5">
            <h2 class="text-dark fw-bolder mb-3">Still have questions?</h2>
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

    <!-- 文章评分分布柱状图 -->
    <div class="card shadow border-2 border-warning rounded-4 mt-4">
      <div class="card-body p-4">
        <h2 class="card-title fw-bolder text-dark mb-3 border-bottom pb-3">Rating Distribution</h2>
        <VChart v-bind:option="ratingChartOption" autoresize class="chart-box" />
      </div>
    </div>
  </div>
</template>

<script>
import { VChart } from '../utils/echarts'
// Firestore：评分数据写入并读取 Firestore，满足图表数据源来自 Firestore（F.1 Interactive Charts）
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default {
  name: 'ResourcesView',
  components: {
    VChart,
  },
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
          ratings: [5, 4, 5],
          currentUserScore: 5,
        },
        {
          title: 'Fall Prevention at Home: A Safety Checklist',
          points: [
            'Remove tripping hazards like loose rugs and clutter from walkways.',
            'Install grab bars in the bathroom near the toilet and inside the shower.',
            'Improve lighting in hallways and staircases to ensure clear visibility at night.',
          ],
          ratings: [5, 5],
          currentUserScore: 5,
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
    }
  },
  computed: {
    // 评分分布柱状图的数据配置：依赖 articleList，有人打分后图表自动更新
    ratingChartOption() {
      // 横轴是 1~5 星
      const categories = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars']
      const scoreValues = [1, 2, 3, 4, 5]

      // 每篇文章一簇柱，统计每个分数出现的次数
      const series = this.articleList.map((article, index) => {
        const counts = scoreValues.map((value) => {
          let count = 0
          for (let i = 0; i < article.ratings.length; i++) {
            if (article.ratings[i] === value) {
              count = count + 1
            }
          }
          return count
        })
        return {
          name: 'Article ' + (index + 1),
          type: 'bar',
          data: counts,
        }
      })

      return {
        title: {
          text: 'How readers rated each article',
          left: 'center',
          textStyle: { fontSize: 16 },
        },
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        grid: { left: 50, right: 30, top: 60, bottom: 60 },
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value', name: 'Ratings', minInterval: 1 },
        series,
      }
    },
  },
  mounted() {
    // 页面加载时，读取整个文章列表的数据（包含用户最新打的分数）
    let savedArticles = localStorage.getItem('article_ratings_data')
    if (savedArticles !== null) {
      this.articleList = JSON.parse(savedArticles)
    }

    // 评分图表数据源来自 Firestore：在线时优先用 Firestore 中的评分
    this.loadRatingsFromFirestore()
  },
  methods: {
    // 传入当前文章的评分数组，计算均值
    calculateArticleAverage(ratingsArray) {
      if (ratingsArray.length === 0) {
        return 'No ratings'
      }

      let totalSum = 0
      for (let i = 0; i < ratingsArray.length; i++) {
        totalSum = totalSum + ratingsArray[i]
      }

      let average = totalSum / ratingsArray.length
      return average.toFixed(1)
    },

    // 提交单篇文章的新分数（async：需要等待 Firestore 写入）
    async submitArticleRating(articleIndex) {
      // 通过索引找到用户正在打分的具体文章
      let article = this.articleList[articleIndex]

      // 把选中的分数转为数字，并推入该文章的评分数组
      let newScore = parseInt(article.currentUserScore)
      article.ratings.push(newScore)

      // 将更新后的整个 articleList 数组存入 LocalStorage（离线也能保存）
      localStorage.setItem('article_ratings_data', JSON.stringify(this.articleList))

      // 同步写入 Firestore，供评分分布图读取；失败（如离线）时忽略
      try {
        await addDoc(collection(db, 'ratings'), {
          articleIndex: articleIndex,
          score: newScore,
          createdAt: new Date().toISOString(),
        })
      } catch {
        // Firestore 写入失败不影响评分功能
      }

      alert('Thank you for rating this article!')
    },

    // 从 Firestore 读取所有评分并重建每篇文章的评分数组；失败则保持本地评分
    async loadRatingsFromFirestore() {
      try {
        const snapshot = await getDocs(collection(db, 'ratings'))
        if (snapshot.size === 0) {
          return
        }

        // 按文章索引把评分分组
        const ratingsByArticle = {}
        for (let i = 0; i < snapshot.docs.length; i++) {
          const data = snapshot.docs[i].data()
          const articleIndex = data.articleIndex
          if (ratingsByArticle[articleIndex] === undefined) {
            ratingsByArticle[articleIndex] = []
          }
          ratingsByArticle[articleIndex].push(Number(data.score))
        }

        // 用 Firestore 中的评分替换对应文章的评分数组
        for (let i = 0; i < this.articleList.length; i++) {
          if (ratingsByArticle[i] !== undefined) {
            this.articleList[i].ratings = ratingsByArticle[i]
          }
        }
        localStorage.setItem('article_ratings_data', JSON.stringify(this.articleList))
      } catch {
        // 离线或网络异常：保留本地评分，图表仍可显示
      }
    },
  },
}
</script>

<style scoped>
/* 图表容器需要明确高度才能正常显示 */
.chart-box {
  height: 340px;
  width: 100%;
}
</style>
