// 共享工具：给无服务器函数统一返回 JSON，并允许跨域调用
// 说明：文件名以 _ 开头的文件不会被当作路由，只供其他函数 import
export function jsonResponse(data, statusCode = 200) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
