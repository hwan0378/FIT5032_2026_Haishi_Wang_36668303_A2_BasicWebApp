// ECharts 集中注册：一次性引入本次用到的图表类型与组件，供各页面复用
// vue-echarts 需要先注册这些模块，:option 里才能正常渲染对应图表
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'

// 注册后即可使用折线图 / 柱状图 / 饼图与常用组件
use([
  CanvasRenderer, // 基本渲染器
  LineChart, // 折线图（健康数据趋势）
  BarChart, // 柱状图（评分分布）
  PieChart, // 饼图（管理员面板角色分布）
  TooltipComponent, // 悬浮提示
  GridComponent, // 直角坐标系网格
  TitleComponent, // 图表标题
  LegendComponent, // 图例
])

// 导出封装好的图表组件，页面里直接 <VChart :option="..."> 使用
export { default as VChart } from 'vue-echarts'