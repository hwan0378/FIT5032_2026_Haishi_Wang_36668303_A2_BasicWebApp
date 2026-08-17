// 无服务器函数：POST /api/send-email
// 接收邮件内容与可选附件（base64），通过 Resend 发送带附件的邮件
// 对应需求 BR D.2；API Key 从环境变量 RESEND_API_KEY 读取，绝不写死在代码里
import { jsonResponse } from '../_utils.js'

// 简单的邮箱格式校验
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 处理 POST 请求：请求体格式为
// { to, subject, text, attachment: { filename, content(base64) } }
export async function onRequestPost(context) {
  const request = context.request
  const apiKey = context.env.RESEND_API_KEY

  // 服务器未配置 API Key 时给出明确提示（部署后需在 Cloudflare 配置环境变量）
  if (apiKey === undefined || apiKey === '') {
    return jsonResponse({ error: 'RESEND_API_KEY is not configured on the server.' }, 500)
  }

  // 解析请求体；JSON 格式错误则返回 400
  let requestBody
  try {
    requestBody = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400)
  }

  // 必填字段校验
  const to = typeof requestBody.to === 'string' ? requestBody.to.trim() : ''
  const subject = typeof requestBody.subject === 'string' ? requestBody.subject.trim() : ''
  const text = typeof requestBody.text === 'string' ? requestBody.text.trim() : ''

  if (to === '' || isValidEmail(to) === false) {
    return jsonResponse({ error: 'A valid recipient email (to) is required.' }, 400)
  }
  if (subject === '') {
    return jsonResponse({ error: 'Email subject is required.' }, 400)
  }
  if (text === '') {
    return jsonResponse({ error: 'Email content (text) is required.' }, 400)
  }

  // 组装发给 Resend 接口的邮件数据
  const emailData = {
    from: 'ElderCare Charity <onboarding@resend.dev>',
    to: [to],
    subject: subject,
    text: text,
  }

  // 附件（可选）：{ filename, content }，content 为 base64 字符串
  const attachment = requestBody.attachment
  if (attachment !== null && attachment !== undefined) {
    if (typeof attachment.filename === 'string' && typeof attachment.content === 'string') {
      emailData.attachments = [
        { filename: attachment.filename, content: attachment.content },
      ]
    }
  }

  // 调用 Resend 的发送邮件接口
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  })

  const result = await resendResponse.json()

  // 转发 Resend 的失败信息，方便排查
  if (resendResponse.ok === false) {
    const message = result.message !== undefined ? result.message : 'Resend API error.'
    return jsonResponse({ error: message }, resendResponse.status)
  }

  // 发送成功，返回 Resend 的邮件 ID
  return jsonResponse({ success: true, id: result.id })
}
