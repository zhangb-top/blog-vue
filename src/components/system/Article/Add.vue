<template>
  <div class="add-content">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 发布文章 -->
    <div class="article-title-container">
      <el-input style="width:82%" size="medium" class="title-input" v-model="article.title" placeholder="输入文章标题" />
      <el-button type="warning" size="medium" @click="openSaveDialog" style="margin-left:10px">保存草稿</el-button>
      <el-button type="danger" size="medium" @click="openSubmitDialog" style="margin-left:10px">发布文章</el-button>
    </div>
    <!-- 文章内容 -->
    <mavon-editor ref="md" v-model="article.context" style="height:calc(100vh - 200px);width:calc(185vh);" class="mavon-editor" />
    <!-- 填写信息弹出框 -->
    <el-dialog :title="`发布文章：${article.title}`" :visible.sync="showDialog" width="30%">
      <el-form label-position="left" label-width="80px" :model="article" size="medium">
        <!-- 内容 -->
        <el-form-item label="作者">
          <el-input v-model="article.author"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" resize='none' v-model="article.description"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-if="!isSave" v-model="article.status" :active-value="1" :inactive-value="0"></el-switch>
          <el-switch v-else disabled v-model="article.status" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="article.typeId" placeholder="请选择文章类别">
            <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="article.tagId" placeholder="请选择标签">
            <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button v-if="!isSave" type="primary" @click="handleSubmit">发布</el-button>
        <el-button v-else type="primary" @click="handleSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTypesAPI } from '@/api/typeAPI'
import { addArticleAPI, getArticleByIdAPI, updateArticleAPI } from '@/api/articleAPI'
import { getTagsAPI } from '@/api/tagAPI'
export default {
  name: 'Add',
  data() {
    return {
      showDialog: false,
      // 文章
      article: {
        id: '',
        author: 'promise',
        title: '',
        description: '',
        context: '',
        createTime: '',
        status: '',
        typeId: '',
        love: 0,
        watch: 0
      },
      // 类别
      types: [],
      // 标签
      tags: [],
      // 选中的标签
      checkedTags: [],
      // 判断是保存还是发布
      isSave: false
    }
  },
  methods: {
    assertNotEmpty(target, msg) {
      if (!target) {
        this.$message({
          message: msg,
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 打开保存文章信息填写框
    openSaveDialog() {
      if (this.assertNotEmpty(this.article.title, '请填写文章标题') && this.assertNotEmpty(this.article.context, '请填写文章内容')) {
        this.getTypes()
        this.getTags()
        this.isSave = true
        this.showDialog = true
      }
    },
    // 打开发布文章信息填写框
    openSubmitDialog() {
      if (this.assertNotEmpty(this.article.title, '请填写文章标题') && this.assertNotEmpty(this.article.context, '请填写文章内容')) {
        this.getTypes()
        this.getTags()
        this.showDialog = true
      }
    },
    // 编辑/发布文章
    async handleSubmit() {
      if (this.$route.query.id) {
        var { data: res } = await updateArticleAPI(this.article)
      } else {
        this.article.createTime = this.dateFormat(new Date())
        var { data: res } = await addArticleAPI(this.article)
      }
      let type = res.code === 50001 || res.code === 40001 ? 'success' : 'error'
      this.$message({
        message: res.msg,
        type: type
      })
      if (type === 'error') return
      this.showDialog = false
      for (let key in this.article) {
        this.article[key] = ''
      }
    },
    // 取消按钮
    handleCancel() {
      this.showDialog = false
    },
    // 查询所有分类
    async getTypes() {
      const { data: res } = await getTypesAPI()
      this.types = res.data
    },
    // 查询所有标签
    async getTags() {
      const { data: res } = await getTagsAPI()
      this.tags = res.data
    },
    async getArticleById(id) {
      const { data: res } = await getArticleByIdAPI(id)
      this.article = res.data
    },
    // 选择tag
    checkTag(id) {
      console.log(id)
    },
    // 日期格式化
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
    }
  },
  created() {
    if (this.$route.query.id) this.getArticleById(this.$route.query.id)
  }
}
</script>

<style lang="scss" scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 1.25rem;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.clearfix span {
  font-weight: 600;
}

@media screen and (max-width: 750px) {
  .mavon-editor {
    width: 90% !important;
  }
  .article-title-container {
    display: block;
    .title-input {
      margin-bottom: 0.625rem;
    }
  }
}
</style>