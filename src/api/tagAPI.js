// 导入配置好的axios js文件
import request from '@/utils/request'

// 查询所有标签
export const getTagsAPI = () => {
  return request.get('/tags')
}

// 根据id查询标签
export const getTagByIdAPI = (id) => {
  return request.get(`/tags/${id}`)
}

// 添加标签
export const addTagAPI = (data) => {
  return request.post('/tags', data)
}

// 修改标签
export const updateTagAPI = (data) => {
  return request.put('/tags', data)
}

// 删除标签
export const deleteTagAPI = (id) => {
  return request.delete(`/tags/${id}`)
}