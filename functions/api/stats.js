// 无服务器函数：POST /api/stats
// 接收前端传来的健康记录（health records），返回聚合统计结果：
// 总记录数、MMSE 平均 / 最低 / 最高分、状态分布、各就诊阶段的记录数等
import { jsonResponse } from '../_utils.js'

// 计算一组数字的平均值；空数组返回 0
function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0
  }
  let total = 0
  for (let i = 0; i < numbers.length; i++) {
    total = total + numbers[i]
  }
  return total / numbers.length
}

// 处理 POST 请求：请求体格式为 { records: [健康记录数组] }
export async function onRequestPost(context) {
  const request = context.request

  // 解析请求体；JSON 格式错误则返回 400
  let requestBody
  try {
    requestBody = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400)
  }

  const records = Array.isArray(requestBody.records) ? requestBody.records : []
  if (records.length === 0) {
    return jsonResponse({ error: 'No records provided.' }, 400)
  }

  // 逐条遍历记录，收集分数并做计数统计
  const mmseScores = []
  const statusCounts = { good: 0, low: 0 }
  const phaseCounts = {}

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

    // 只统计能转成数字的 MMSE 分数，避免脏数据影响结果
    const score = parseFloat(record.mmseScore)
    if (isNaN(score) === false) {
      mmseScores.push(score)

      // 与前端一致的判定规则：分数低于 24 视为需要关注
      if (score < 24) {
        statusCounts.low = statusCounts.low + 1
      } else {
        statusCounts.good = statusCounts.good + 1
      }
    }

    // 按就诊阶段（VISCODE）统计记录数
    const phase = record.visitCode !== undefined && record.visitCode !== '' ? record.visitCode : 'Unknown'
    if (phaseCounts[phase] === undefined) {
      phaseCounts[phase] = 0
    }
    phaseCounts[phase] = phaseCounts[phase] + 1
  }

  // 组装最终统计结果
  const result = {
    totalRecords: records.length,
    totalScores: mmseScores.length,
    averageMmse: Math.round(calculateAverage(mmseScores) * 10) / 10,
    minMmse: mmseScores.length > 0 ? Math.min(...mmseScores) : null,
    maxMmse: mmseScores.length > 0 ? Math.max(...mmseScores) : null,
    statusBreakdown: statusCounts,
    recordsByPhase: phaseCounts,
    computedAt: new Date().toISOString(),
  }

  return jsonResponse(result)
}
