// 导入配置好的axios js文件
import request from '@/utils/request'

// 统计评论总数
export const getCommentCountAPI = () => {
  return request.get('/comments/count')
}

// 分页查询
export const getCommentsByPageAPI = (currentPage, pageSize, searchData) => {
  return request.get(`/comments/${currentPage}/${pageSize}?author=${searchData.author}&articleTitle=${searchData.articleTitle}&context=${searchData.context}`)
}

// 根据文章id查询所有一级评论
export const getCommentsByArticleIdAPI = articleId => {
  return request.get(`/comments/${articleId}`)
}

// 根据一级id，查询所有子级评论
export const getCommentByTopIdAPI = (articleId, topId) => {
  return request.get(`/comments/level/${articleId}/${topId}`)
}

// 发布评论
export const addCommentAPI = comment => {
  return request.post('/comments', comment)
}

// 删除评论
export const deleteCommentByIdAPI = id => {
  return request.delete(`/comments/${id}`)
}
