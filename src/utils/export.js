// 数据导出工具：把表格数据导出为 CSV 或 PDF 文件（对应需求 BR E.4）

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// 导出 CSV：接收表格行数据、列配置与文件名，触发浏览器下载
export function exportToCSV(rows, columns, filename) {
  // 第一行是表头
  const header = columns.map((col) => col.label).join(',')

  // 把每一行数据拼成 CSV 文本
  const bodyLines = rows.map((row) => {
    return columns
      .map((col) => {
        const value = row[col.key]
        const text = String(value === undefined || value === null ? '' : value)

        // 若内容含逗号、引号或换行，需要用引号包裹并转义引号
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
          return '"' + text.replace(/"/g, '""') + '"'
        }
        return text
      })
      .join(',')
  })

  const csvContent = [header].concat(bodyLines).join('\n')

  // 加上 BOM（﻿），避免 Excel 打开中文内容乱码
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })

  // 创建临时下载链接并触发浏览器下载
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 导出 PDF：用 jsPDF 加 autoTable 把数据渲染成表格
export function exportToPDF(rows, columns, filename, title) {
  const doc = new jsPDF()

  // 在页面顶部写出报告标题
  doc.setFontSize(16)
  doc.text(title, 14, 20)

  // autoTable 负责把数据绘制成 PDF 表格
  autoTable(doc, {
    head: [columns.map((col) => col.label)],
    body: rows.map((row) =>
      columns.map((col) => {
        const value = row[col.key]
        return String(value === undefined || value === null ? '' : value)
      }),
    ),
    startY: 30,
  })

  doc.save(filename)
}
