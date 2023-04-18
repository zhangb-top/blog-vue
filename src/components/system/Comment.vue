<template>
  <div class="comment-content">
    <el-breadcrumb class="top" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 查询 -->
    <el-form :model="searchData" :inline="true" class="demo-form-inline">
      <el-form-item label="作者">
        <el-input v-model="searchData.author" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="searchData.articleTitle" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="searchData.context" placeholder="内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCommentsByPage">查 询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table border ref="table" :data="comments" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" label="#" align="center">
      </el-table-column>
      <el-table-column property="author" label="作者" align="center" prop="author">
      </el-table-column>
      <el-table-column property="context" label="内容" align="center" prop="context">
      </el-table-column>
      <el-table-column property="articleTitle" label="文章标题" align="center" prop="articleTitle">
      </el-table-column>
      <el-table-column property="createTime" label="评论时间" align="center" prop="createTime">
      </el-table-column>
      <el-table-column property="caozuo" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getCommentsByPageAPI, deleteCommentByIdAPI } from '@/api/commentAPI'
export default {
  name: 'Comment',
  data() {
    return {
      comments: [],
      pageSizes: [6, 10, 14],
      pageSize: 6,
      currentPage: 1,
      total: 0,
      searchData: {
        author: '',
        articleTitle: '',
        context: ''
      }
    }
  },
  methods: {
    async getCommentsByPage() {
      const { data: res } = await getCommentsByPageAPI(this.currentPage, this.pageSize, this.searchData)
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.comments = res.data.comments
      this.total = res.data.total
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getCommentsByPage()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getCommentsByPage()
    },
    async handleDelete(id) {
      const { data: res } = await deleteCommentByIdAPI(id)
      if (res.code !== 60001) return this.$message({ message: res.msg, type: 'error' })
      this.$message({ message: res.msg, type: 'success' })
      this.getCommentsByPage()
    }
  },
  created() {
    this.getCommentsByPage()
  }
}
</script>

<style lang='scss' scope>
.top {
  margin-bottom: 1.25rem;
}
</style>