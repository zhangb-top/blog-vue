// 导入配置好的axios js文件
import request from '@/utils/request'

// 根据id修改文章状态
export const updateStatusByIdAPI = (status, id) => {
  return request.put(`/articles/${id}/${status}`)
}

// 添加文章
export const addArticleAPI = data => {
  return request.post('/articles', data)
}

// 修改文章
export const updateArticleAPI = data => {
  return request.put('/articles', data)
}

// 删除文章
export const deleteArticleAPI = id => {
  return request.delete(`/articles/${id}`)
}

// 根据id查询文章
export const getArticleByIdAPI = id => {
  return request.get(`/articles/${id}`)
}

// 分页查询
export const getArticlesByPageAPI = (currentPage, pageSize, flag) => {
  return request.get(`/articles/${currentPage}/${pageSize}?flag=${flag}`)
}

// 模糊查询
export const searchArticlesByPageAPI = (searchData, currentPage, pageSize) => {
  return request.get(`/articles/selectDim?status=${searchData.status}&author=${searchData.author}&startDate=${searchData.date[0]}&endDate=${searchData.date[1]}&currentPage=${currentPage}&pageSize=${pageSize}`)
}

// 获取总文章数，总浏览数，总喜欢数
export const getCountsAPI = () => {
  return request.get('/articles/counts')
}

// 根据分类id查询文章
export const getArticlesByTypeIdAPI = (id, flag, currentPage, pageSize) => {
  return request.get(`/articles/type/${currentPage}/${pageSize}?typeId=${id}&flag=${flag}`)
}

// 根据标签id查询文章
export const getArticlesByTagIdAPI = (id, flag, currentPage, pageSize) => {
  return request.get(`/articles/tag/${currentPage}/${pageSize}?tagId=${id}&flag=${flag}`)
}

// 归档查询所有文章的年月
export const getYearMonthFromArticlesAPI = () => {
  return request.get('/articles/yearmonth')
}

// 根据归档年月查询对应文章
export const getTitleByYearMonthAPI = date => {
  return request.get(`/articles/titles?date=${date}`)
}

// 单独查询文章总数量
export const getTotalArticleAPI = (flag) => {
  return request.get(`/articles/total?flag=${flag}`)
}