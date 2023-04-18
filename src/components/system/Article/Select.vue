<template>
  <div class="select-content">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
      <el-breadcrumb-item>管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 查询 -->
    <el-form :model="searchData" :inline="true" class="demo-form-inline">
      <el-form-item label="作者">
        <el-input v-model="searchData.author" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchData.status" placeholder="请选择状态">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="searchData.date" @change="changeDate">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查 询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table border ref="table" :data="articles" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" label="#" align="center">
      </el-table-column>
      <el-table-column property="title" label="标题" align="center" prop="title">
      </el-table-column>
      <el-table-column property="description" label="简介" align="center" prop="description">
      </el-table-column>
      <el-table-column property="author" width="100" label="作者" align="center" prop="author">
      </el-table-column>
      <el-table-column property="createTime" width="150" label="创作时间" align="center" prop="createTime">
      </el-table-column>
      <el-table-column property="status" width="100" label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus($event,scope.row.id)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column property="caozuo" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编 辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { updateStatusByIdAPI, getArticlesByPageAPI, searchArticlesByPageAPI, deleteArticleAPI } from '@/api/articleAPI'
export default {
  name: 'Select',
  data() {
    return {
      articles: [],
      pageSizes: [6, 10, 14],
      pageSize: 6,
      total: 0,
      currentPage: 1,
      searchData: {
        status: '',
        author: '',
        date: []
      }
    }
  },
  methods: {
    // 获取文章列表
    async getArticlesByPage() {
      const { data: res } = await getArticlesByPageAPI(this.currentPage, this.pageSize, false)
      this.articles = res.data
      this.total = res.total
    },
    // 修改文章
    handleEdit(id) {
      this.$router.push({ path: '/home/add', query: { id: id } })
    },
    // 删除文章
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteArticleAPI(id)
          let type = res.code === 60001 ? 'success' : 'error'
          this.$message({
            message: res.msg,
            type: type
          })
          this.getArticlesByPage()
        })
        .catch(() => {})
    },
    // 修改状态
    async changeStatus(status, id) {
      const { data: res } = await updateStatusByIdAPI(status, id)
      let type = res.code === 40001 ? 'success' : 'error'
      this.$message({
        message: res.msg,
        type: type
      })
    },
    // 每页条数变化
    handleSizeChange(e) {
      this.pageSize = e
      if (this.searchData.author === '' && this.searchData.status === '' && this.searchData.date === []) return this.getArticlesByPage()
      return this.search()
    },
    // 页面变化
    handleCurrentChange(e) {
      this.currentPage = e
      if (this.searchData.author === '' && this.searchData.status === '' && this.searchData.date === []) return this.getArticlesByPage()
      return this.search()
    },
    // 选择的时间变化
    changeDate(e) {
      this.searchData.date[0] = this.dateFormat(e[0])
      this.searchData.date[1] = this.dateFormat(e[1])
    },
    dateFormat(date) {
      var year = date.getFullYear() // 年
      var month = this.showTime(date.getMonth() + 1) // 月
      var day = this.showTime(date.getDate()) // 日
      var str = ''
      str = str + year + '-' + month + '-' + day
      return str
    },
    // 封装一个不够两位数就补零的函数
    showTime(t) {
      var time
      time = t > 10 ? t : '0' + t
      return time
    },
    // 查询
    async search() {
      if (this.searchData.date[0] === undefined) this.searchData.date[0] = ''
      if (this.searchData.date[1] === undefined) this.searchData.date[1] = ''
      const { data: res } = await searchArticlesByPageAPI(this.searchData, this.currentPage, this.pageSize)
      if (res.code === 30001) {
        this.articles = res.data
        this.total = res.total
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    }
  },
  created() {
    this.getArticlesByPage()
  }
}
</script>

<style lang='scss' scope>
.select-content {
  width: 99%;
}
.el-form {
  margin-top: 20px;
}
.el-table {
  margin-bottom: 10px;
}

@media screen and (max-width: 750px) {
  .el-date-editor {
    width: 100% !important;
  }
}
</style>