<template>
  <div class="tag-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 类型 -->
    <div class="radio-box">
      <el-radio v-for="item in tags" :key="item.id" v-model="tagId" :label="item.id" class="radio-item" border @input="getArticlesByTagId">{{ item.name }}</el-radio>
      <el-button type="primary" style="height:100%" @click="addTag">新 增</el-button>
      <el-button type="info" style="height:100%" @click="updateTag">修 改</el-button>
      <el-button type="danger" style="height:100%" @click="deleteTag">删 除</el-button>
    </div>
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
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
    </el-pagination>
    <!-- 新增分类弹框 -->
    <el-dialog title="新增分类" :visible.sync="showDialog" width="30%">
      <el-form label-position="left" label-width="80px" :model="tagFormData" size="medium">
        <!-- 内容 -->
        <el-form-item label="名称">
          <el-input v-model="tagFormData.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTagsAPI, getTagByIdAPI, addTagAPI, updateTagAPI, deleteTagAPI } from '@/api/tagAPI'
import { getArticlesByTagIdAPI, updateStatusByIdAPI, deleteArticleAPI } from '@/api/articleAPI'
export default {
  name: 'Tag',
  data() {
    return {
      tags: [],
      tagId: 1,
      articles: [],
      pagination: { currentPage: 1, pageSize: 6, total: 0, pageSizes: [6, 10, 14] },
      tagFormData: { id: null, name: '' },
      showDialog: false,
      // 判断是修改还是添加
      isUpdate: false
    }
  },
  methods: {
    async getTags() {
      const { data: res } = await getTagsAPI()
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.tags = res.data
    },
    async getArticlesByTagId() {
      const { data: res } = await getArticlesByTagIdAPI(this.tagId, false, this.pagination.currentPage, this.pagination.pageSize)
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.articles = res.data
      this.pagination.total = res.total
    },
    // 修改文章
    handleEdit(id) {
      this.$router.push({ path: '/home/add', query: { id: id } })
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
      this.pagination.pageSize = e
      this.getArticlesByTagId()
    },
    // 删除文章
    handleDelete(id) {
      this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteArticleAPI([id])
          let type = res.code === 60001 ? 'success' : 'error'
          this.$message({
            message: res.msg,
            type: type
          })
          this.getArticlesByTagId()
        })
        .catch(() => {})
    },
    // 删除标签
    deleteTag() {
      this.$confirm('此操作将永久删除该标签和全部博客, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteTagAPI(this.tagId)
          let type = res.code === 60001 ? 'success' : 'error'
          this.$message({
            message: res.msg,
            type: type
          })
          this.tagId = 1
          this.getTags()
          this.getArticlesByTagId()
        })
        .catch(() => {})
    },
    // 修改标签
    async updateTag() {
      this.isUpdate = true
      this.showDialog = true
      const { data: res } = await getTagByIdAPI(this.tagId)
      this.tagFormData = res.data
    },
    // 页面变化
    handleCurrentChange(e) {
      this.pagination.currentPage = e
      this.getArticlesByTagId()
    },
    // 添加标签按钮
    addTag() {
      this.showDialog = true
    },
    // 取消按钮
    handleCancel() {
      this.tagFormData.id = null
      this.tagFormData.name = ''
      this.showDialog = false
    },
    // 确定按钮
    async handleSubmit() {
      if (!this.isUpdate) {
        const { data: res } = await addTagAPI(this.tagFormData)
        if (res.code !== 50001) return this.$message({ message: res.msg, type: 'error' })
        this.$message({ message: res.msg, type: 'success' })
      } else {
        const { data: res } = await updateTagAPI(this.tagFormData)
        if (res.code !== 40001) return this.$message({ message: res.msg, type: 'error' })
        this.isUpdate = false
        this.$message({ message: res.msg, type: 'success' })
      }
      this.getTags()
      this.tagFormData.id = null
      this.tagFormData.name = ''
      this.showDialog = false
    }
  },
  created() {
    this.getTags()
    this.getArticlesByTagId()
  }
}
</script>

<style lang='scss' scope>
.radio-box {
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.3125rem;
  padding: 1.25rem;
  margin: 1.25rem 0;
  .radio-item {
    margin-left: 0 !important;
    margin-bottom: 0.625rem;
  }
}
</style>