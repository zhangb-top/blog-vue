// 导入配置好的axios js文件
import request from '@/utils/request'

// 登录的API接口
export const loginAPI = data => {
  return request.post('/users/login', data)
}

// // 注册的API接口
// export const logonAPI = data => {
//   return request.post('/users/register', data)
// }