// 导入配置好的axios js文件
import request from '@/utils/request'

// 查询所有分类
export const getTypesAPI = () => {
  return request.get('/types')
}

// 根据id查询分类
export const getTypeByIdAPI = (id) => {
  return request.get(`/types/${id}`)
}

// 添加分类
export const addTypeAPI = (data) => {
  return request.post('/types', data)
}

// 修改分类
export const updateTypeAPI = (data) => {
  return request.put('/types', data)
}

// 删除分类
export const deleteTypeAPI = (id) => {
  return request.delete(`/types/${id}`)
}