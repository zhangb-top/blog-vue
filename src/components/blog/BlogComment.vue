<template>
  <div class="blog-comment-content">
    <!-- 展示评论 -->
    <el-card v-if="comments.length!==0" class="comments-card">
      <div slot="header" class="clearfix">
        <span id="comment">评论</span>
      </div>
      <div class="comments-box">
        <!-- 一级评论 -->
        <div v-for="(item,index) in comments" :key="item.id" :id="item.id" class="comment-item">
          <div class="header">
            <div class="name">{{item.firstComment.author}}</div>
            <el-button type="text" class="operate" @click="replay(item.firstComment)">回复</el-button>
          </div>
          <div class="createTime">{{item.firstComment.createTime}}</div>
          <div class="context">
            {{item.firstComment.context}}
            <el-button v-if="!item.isShowChildren" type="text" class="operate" @click="getCommentByTopId(item,index)">展开评论</el-button>
            <el-button v-else type="text" class="operate" @click="closeCommentChildren(index)">收起评论</el-button>
            <el-divider></el-divider>
            <!-- 二级以下评论 -->
            <div style="padding-left:40px;" v-show="item.isShowChildren">
              <div v-if="item.children.length===0&&item.isShowChildren">
                没有更多评论了~
                <el-divider></el-divider>
              </div>
              <div v-for="item2 in item.children" :key="item2.id" :id="item2.id" class="comment-item">
                <div class="header">
                  <div class="name">{{item2.author}} 回复 {{item2.parentName}}</div>
                  <el-button type="text" class="operate" @click="replay(item2)">回复</el-button>
                </div>
                <div class="createTime">{{item2.createTime}}</div>
                <div class="context">
                  {{item2.context}}
                  <el-divider></el-divider>
                </div>
              </div>
            </div>
            <!-- 二级评论end -->
          </div>
        </div>
      </div>
      <!-- 一级评论end -->
    </el-card>
    <!-- 空 -->
    <el-card v-else class="comments-card">
      <div slot="header" class="clearfix">
        <span id="comment">评论</span>
      </div>
      <el-empty description="快点发布评论吧~"></el-empty>
    </el-card>
    <!-- 评论区 -->
    <el-form ref="formData" :rules="rules" :model="formData">
      <el-form-item prop="context">
        <el-input class="textarea-input" ref="textarea" type="textarea" :autosize="{ minRows: 4}" :placeholder="placeholder" resize="none" v-model.trim="formData.context">
        </el-input>
      </el-form-item>
      <div class="form">
        <el-form-item prop="author">
          <el-input v-model.trim="formData.author" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model.trim="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addComment('formData')">发布</el-button>
          <el-button @click="resetForm('formData')">重置</el-button>
          <el-button type="info" @click="replayBlog">回复博客</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getCommentsByArticleIdAPI, getCommentByTopIdAPI, addCommentAPI } from '@/api/commentAPI'

export default {
  name: 'BlogComment',
  props: {
    // 文章id，查找评论
    articleId: {
      required: true,
      type: Number
    }
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!value) {
        callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      // 查询得到一级的评论
      comments: [],
      // 表单信息
      formData: {
        author: '',
        context: '',
        articleId: this.articleId,
        parentId: 0,
        topId: 0,
        email: '',
        createTime: ''
      },
      // 验证规则
      rules: {
        author: [
          { required: true, message: '请输入您的大名', trigger: 'blur' },
          { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' }
        ],
        email: { required: true, trigger: 'blur', validator: checkEmail },
        context: { required: true, message: '评论为空，what do you want to do?', trigger: 'blur' }
      },
      // 文本框内容
      placeholder: '回复博客'
    }
  },
  methods: {
    async getCommentsByArticleId() {
      const { data: res } = await getCommentsByArticleIdAPI(this.articleId)
      if (res.code !== 30001) return
      res.data.forEach(item => {
        this.comments.push({ firstComment: item, children: [], isShowChildren: false })
      })
    },
    async getCommentByTopId(comment, index) {
      this.comments[index].isShowChildren = true
      if (this.comments[index].children.length !== 0) return
      const { data: res } = await getCommentByTopIdAPI(this.articleId, comment.firstComment.id)
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.comments.some(item => {
        if (item.firstComment !== comment.firstComment) return false
        item.children = res.data
        return true
      })
    },
    // 收起评论
    closeCommentChildren(index) {
      this.comments[index].isShowChildren = false
    },
    // 点击回复按钮
    replay(comment) {
      this.placeholder = '回复' + comment.author
      this.$refs.textarea.focus()
      this.formData.parentId = comment.id
      this.formData.topId = comment.topId === 0 ? comment.id : comment.topId
      console.log(this.formData)
    },
    // 回复博客
    replayBlog() {
      this.placeholder = '回复博客'
      this.formData.parentId = 0
      this.formData.topId = 0
      this.formData.context = ''
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.replayBlog()
    },
    // 发布评论
    addComment(formName) {
      const h = this.$createElement
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.formData.createTime = this.dateFormat(new Date())
          const { data: res } = await addCommentAPI(this.formData)
          if (res.code !== 50001) return this.$message({ message: res.msg, type: 'error' })
          this.comments = []
          this.getCommentsByArticleId()
          this.resetForm('formData')
          this.$notify({
            title: '提示',
            message: h('i', { style: 'color: teal' }, res.msg),
            offset: 100
          })
        } else {
          this.$notify({
            title: '提示',
            message: h('i', { style: 'color: #eb3b5a' }, '有必填项未填或不符合格式'),
            offset: 100
          })
          return false
        }
      })
    },
    // 日期格式化
    dateFormat(date) {
      var year = date.getFullYear() // 年
      var month = this.showTime(date.getMonth() + 1) // 月
      var day = this.showTime(date.getDate()) // 日
      var hour = this.showTime(date.getHours()) // 时
      var minutes = this.showTime(date.getMinutes()) // 分
      var seconds = this.showTime(date.getSeconds()) // 秒
      console.log(`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`)
      return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
    },
    // 封装一个不够两位数就补零的函数
    showTime(t) {
      var time
      time = t > 10 ? t : '0' + t
      return time
    }
  },
  created() {
    this.getCommentsByArticleId()
  }
}
</script>

<style lang='scss' scope>
.blog-comment-content {
  background-color: #fff;
  padding: 1.25rem;
  margin-top: 1.25rem;
  border-radius: 0.3125rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: rgba($color: #74b9ff, $alpha: 0.3);
  .comments-card {
    width: 100%;
    border: none !important;
    background-color: rgba($color: #fff, $alpha: 0.6) !important;
    margin-bottom: 1.25rem;
    .clearfix {
      font-size: 20px;
    }
    .comments-box {
      .header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .name {
          flex: 1;
          color: #f39c12;
        }
      }
      .createTime {
        margin-bottom: 0.9375rem;
        color: #7f8c8d;
      }
    }
  }
  .form {
    display: flex;
    justify-content: space-between;
  }
  .operate {
    font-size: 16px;
  }
  .btn-box {
    margin-top: 1.25rem;
  }
  .context {
    .operate {
      display: block;
      margin-top: 10px;
    }
  }
  .author .el-form-item__label,
  .email .el-form-item__label {
    color: #fff;
  }
  .el-form-item__error {
    font-size: 0.875rem;
    font-weight: 700;
  }
  .el-empty__description p {
    color: #57606f;
  }
}
</style>