// 无服务器函数：POST /api/export
// 接收前端传来的表格数据（行 + 列定义），在服务器端生成 CSV 文件内容返回
// 用途：与 D.2 邮件附件配合，可在服务器端生成更可靠的标准 CSV
import { jsonResponse } from '../_utils.js'

// 把一个字段值转成 CSV 单元格：含逗号 / 引号 / 换行时用双引号包裹
function csvCell(value) {
  let text = String(value === undefined || value === null ? '' : value)
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    text = '"' + text.replace(/"/g, '""') + '"'
  }
  return text
}

// 处理 POST 请求：请求体格式为 { rows: [数据行], columns: [{ key, label }] }
export async function onRequestPost(context) {
  const request = context.request

  // 解析请求体；JSON 格式错误则返回 400
  let requestBody
  try {
    requestBody = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400)
  }

  const rows = Array.isArray(requestBody.rows) ? requestBody.rows : []
  const columns = Array.isArray(requestBody.columns) ? requestBody.columns : []
  if (columns.length === 0) {
    return jsonResponse({ error: 'No columns provided.' }, 400)
  }

  // 第一行是表头：取每一列的 label 文字
  const headerLine = columns.map((column) => csvCell(column.label)).join(',')

  // 其余行是数据：按列的 key 依次读取每一行的值
  const bodyLines = rows.map((row) => {
    return columns.map((column) => csvCell(row[column.key])).join(',')
  })

  // 加上 BOM（字节顺序标记），让 Excel 打开 CSV 时中文不会乱码
  const csvContent = '\uFEFF' + [headerLine, ...bodyLines].join('\r\n')

  // 以附件形式返回 CSV 文件
  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="server_export.csv"',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
