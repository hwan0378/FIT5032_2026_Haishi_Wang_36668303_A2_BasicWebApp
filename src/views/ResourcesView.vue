<template>
  <div class="container mt-4 mb-5">
    <div class="text-center mb-5">
      <h2 class="fw-bold text-dark">Education & Resources</h2>
      <p class="text-muted fs-5">
        Evidence-based guides for healthy aging and practical support for dedicated caregivers.
      </p>
    </div>

    <div class="row">
      <!-- 健康养老文章区 -->
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

            <button class="btn btn-outline-primary btn-sm mt-2">Read Full Article</button>
          </div>
        </div>
      </div>

      <!-- 护理人员常见问题解答 -->
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

        <div class="card border-primary mb-3">
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
      articleList: [
        {
          title: '3 Simple Ways to Keep Your Mind Active',
          points: [
            'Daily Puzzles: Engaging in crosswords or Sudoku for just 20 minutes a day can strengthen neural connections.',
            "Learn a New Skill: Whether it's a new recipe or a simple craft, learning challenges your brain to adapt.",
            'Stay Social: Regular conversations with friends, family, or our community support groups significantly reduce the risk of cognitive decline.',
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
          question: 'How do I track my loved one’s cognitive health over time?',
          answer:
            'Our platform features a secure Personal Health Portal. You can log standardized assessment scores (like the MMSE) after each visit. The system automatically plots this data on an easy-to-read list, allowing you to clearly see long-term health trends.',
        },
        {
          question: 'How can I request a volunteer check-in?',
          answer:
            "Navigate to the 'Community' tab and fill out the 'Request a Volunteer Visit' form. Simply select a date and time, and our Coordinator Dashboard will match you with a vetted local volunteer for a friendly visit.",
        },
        {
          question: 'Are the local support groups free to attend?',
          answer:
            'Yes, all support groups listed on our Community page are completely free and sponsored by the ElderCare Charity. Some online zoom meetings may require prior registration.',
        },
      ],
    }
  },
}
</script>

<style scoped>
.card-body {
  padding: 1.5rem;
}
</style>
