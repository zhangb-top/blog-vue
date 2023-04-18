<template>
  <div class="blog-tag-content">
    <!-- 头部 -->
    <el-card v-if="isShow" class="tags">
      <div slot="header" class="clearfix">
        <span>标签</span>
        <el-button style="float: right; padding: 3px 0" type="text" class="btn">共{{tags.length}}个</el-button>
      </div>
      <div class="tags-box">
        <el-radio v-for="item in tags" :key="item.id" v-model="tagId" :label="item.id" class="tag-item" border @input="getArticlesByTagId">{{ item.name }}</el-radio>
      </div>
    </el-card>
    <!-- 文章部分 -->
    <articles-card v-if="isShow" :articles="articles" :currentPage="this.pagination.currentPage" :pageSize="this.pagination.pageSize" :total="total" :width="'55%'" v-on:current-change="handleCurrentChange" class="articles"></articles-card>
  </div>
</template>

<script>
import { getTagsAPI } from '@/api/tagAPI'
import { getArticlesByTagIdAPI } from '@/api/articleAPI'
import ArticlesCard from './ArticlesCard.vue'
export default {
  components: { ArticlesCard },
  name: 'BlogTag',
  data() {
    return {
      articles: [],
      // 文章是否加载完成
      isShow: false,
      tags: [],
      tagId: 1,
      total: 0,
      pagination: {
        currentPage: 1,
        pageSize: 7
      }
    }
  },
  methods: {
    async getTags() {
      const { data: res } = await getTagsAPI()
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.tags = res.data
    },
    async getArticlesByTagId() {
      const { data: res } = await getArticlesByTagIdAPI(this.tagId, true, this.pagination.currentPage, this.pagination.pageSize)
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.articles = res.data
      this.total = res.total
    },
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage
      this.getArticlesByTagId()
    }
  },
  created() {
    if (this.$route.query.id) this.tagId = Number.parseInt(this.$route.query.id)
    this.getTags()
    this.getArticlesByTagId()
    this.isShow = true
  }
}
</script>

<style lang='scss' scope>
.blog-tag-content {
  margin-top: 60px;
  .tags {
    background-color: rgba($color: #fff, $alpha: 0.5) !important;
    border: none !important;
    width: 55%;
    margin: auto;
    .clearfix {
      color: #fff;
      font-size: 20px;
      .btn {
        font-size: 18px;
        color: #40407a;
      }
    }
    .tags-box {
      display: flex;
      justify-content: start;
      flex-wrap: wrap;
      align-items: center;
      .tag-item {
        margin: 8px;
        .el-radio__label {
          color: #2d3436;
          font-size: 16px;
        }
      }
    }
  }
  .articles {
    margin: 20px auto;
  }
}
// 手机端适配
@media screen and (max-width: 750px) {
  .blog-tag-content {
    .tags {
      margin: 0;
      width: 100%;
    }
  }
}
</style>