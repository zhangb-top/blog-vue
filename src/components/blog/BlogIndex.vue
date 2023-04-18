<template>
  <div class="blog-index-content">
    <!-- 文章列表 -->
    <articles-card v-if="isShow" :articles="articles" :currentPage="this.pagination.currentPage" :pageSize="this.pagination.pageSize" :total="total" v-on:current-change="handleCurrentChange"></articles-card>
    <!-- 右边 -->
    <div class="right" v-if="isShow">
      <!-- 分类 -->
      <el-card class="type">
        <div slot="header" class="clearfix">
          <span>分类</span>
          <el-button style="float: right; padding: 3px 0" type="text" class="btn" @click="toType">more</el-button>
        </div>
        <div v-for='item in types' :key="item.id" @click="toType($event,item.id)" class="type-item">
          {{item.name}}
        </div>
      </el-card>
      <!-- 标签 -->
      <el-card class="tag">
        <div slot="header" class="clearfix">
          <span>标签</span>
          <el-button style="float: right; padding: 3px 0" type="text" class="btn" @click="toTag">more</el-button>
        </div>
        <div class="tags-box">
          <div v-for='item in tags' :key="item.id" @click="toTag($event,item.id)" class="tag-item">
            <el-tag type="warning">{{item.name}}</el-tag>
          </div>
        </div>
      </el-card>
      <!-- 最新文章 -->
      <el-card class="new-articles">
        <div slot="header" class="clearfix">
          <span>最新文章</span>
        </div>
        <div v-for='item in newArticles' :key="item.id" class="new-articles-item" @click="gotoDetail(item)">
          {{item.title}}
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getArticlesByPageAPI, updateArticleAPI } from '@/api/articleAPI'
import { getTypesAPI } from '@/api/typeAPI'
import { getTagsAPI } from '@/api/tagAPI'

import ArticlesCard from './ArticlesCard.vue'

export default {
  components: { ArticlesCard },
  name: 'BlogIndex',
  data() {
    return {
      // 最新文章
      newArticles: [],
      articles: [],
      types: [],
      tags: [],
      total: 0,
      // 文章是否加载完成
      isShow: false,
      pagination: {
        currentPage: 1,
        pageSize: 7
      },
      // 欢迎语
      welcomeMsg: '人生如梦，年华似水，携一缕清风的洒脱，采一片流云的飘逸，淡然前行，且闻花香，一路欢笑一路歌'
    }
  },
  methods: {
    async getArticlesByPage() {
      const { data: res } = await getArticlesByPageAPI(this.pagination.currentPage, this.pagination.pageSize, true)
      this.newArticles = this.pagination.currentPage === 1 ? res.data : this.newArticles
      this.articles = res.data
      this.total = res.total
    },
    async getTypes() {
      const { data: res } = await getTypesAPI()
      // 取4个
      res.data.some((item, index) => {
        if (index === 4) return true
        this.types.push(item)
      })
    },
    async getTags() {
      const { data: res } = await getTagsAPI()
      // 取10个
      if (res.data.length === 10) return (this.tags = res.data)
      res.data.some((item, index) => {
        if (index === 10) return true
        this.tags.push(item)
      })
    },
    // 获取数据
    getData() {
      this.getTypes()
      this.getTags()
      // 要放在最后
      this.getArticlesByPage()
    },
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage
      this.getArticlesByPage()
    },
    gotoDetail(article) {
      // 增加watch量
      article.watch++
      updateArticleAPI(article)
      const { href } = this.$router.resolve({ path: '/detail', query: { id: article.id, title: article.title } })
      window.open(href, '_blank')
    },
    toType(e, id) {
      if (!id) return this.$router.push({ path: '/type' })
      this.$router.push({ path: '/type', query: { id: id } })
    },
    toTag(e, id) {
      if (!id) return this.$router.push({ path: '/tag' })
      this.$router.push({ path: '/tag', query: { id: id } })
    },
    showNatification() {
      const h = this.$createElement
      this.$notify({
        title: '欢迎浏览promise的博客',
        message: h('i', { style: 'color: teal' }, this.welcomeMsg),
        showClose: false,
        offset: 100
      })
    }
  },
  created() {
    this.getData()
    this.isShow = true
    this.showNatification()
  }
}
</script>

<style lang='scss' scope>
.blog-index-content {
  margin-top: 60px;
  display: flex;
  justify-content: space-evenly;
  .type,
  .tag,
  .new-articles {
    background-color: rgba($color: #fff, $alpha: 0.5) !important;
    border: none !important;
    width: 18.75rem;
    margin-bottom: 20px;
    .clearfix {
      color: #fff;
      font-size: 20px;
      .btn {
        font-size: 18px;
        color: #40407a;
      }
    }
  }
  .new-articles-item,
  .type-item {
    cursor: pointer;
    line-height: 40px;
    border-bottom: 1px solid #718093;
  }
  .new-articles-item {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .tags-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .tag-item {
      cursor: pointer;
      margin-bottom: 10px;
    }
  }
  .type-item {
    text-align: center;
    line-height: 40px;
    border: none;
  }
  .type-item:hover {
    color: #fff;
  }
  .new-articles-item:hover {
    color: #0097e6;
  }
}
// 手机端适配
@media screen and (max-width: 750px) {
  .blog-index-content {
    display: block;
    .right {
      .el-card {
        width: 100%;
        .type-item:hover {
          color: #303133;
        }
        .new-articles-item:hover {
          color: #303133;
        }
      }
    }
  }
}
</style>