<template>
  <div class="blog-type-content">
    <!-- 头部 -->
    <el-card v-if="isShow" class="types">
      <div slot="header" class="clearfix">
        <span>分类</span>
        <el-button style="float: right; padding: 3px 0" type="text" class="btn">共{{types.length}}个</el-button>
      </div>
      <div class="tags-box">
        <el-tag v-for="item in types" :key="item.id" :id="item.id" type="info" class="tag-item" effect="plain" @click="getArticlesByTypeId(item.id)">
          {{ item.name }}
        </el-tag>
      </div>
    </el-card>
    <!-- 文章部分 -->
    <articles-card v-if="isShow" :articles="articles" :currentPage="this.pagination.currentPage" :pageSize="this.pagination.pageSize" :total="total" :width="'55%'" v-on:current-change="handleCurrentChange" class="articles"></articles-card>
  </div>
</template>

<script>
import { getTypesAPI } from '@/api/typeAPI'
import { getArticlesByTypeIdAPI } from '@/api/articleAPI'
import ArticlesCard from './ArticlesCard.vue'
export default {
  components: { ArticlesCard },
  name: 'BlogType',
  data() {
    return {
      types: [],
      typeId: 1,
      articles: [],
      total: 0,
      pagination: {
        currentPage: 1,
        pageSize: 7
      },
      // 文章是否加载完成
      isShow: false
    }
  },
  methods: {
    // 查询所有分类
    async getTypes() {
      const { data: res } = await getTypesAPI()
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.types = res.data
    },
    async getArticlesByTypeId(id) {
      if (document.getElementById(this.typeId)) {
        document.getElementById(this.typeId).style = 'none'
        document.getElementById(id).style.borderColor = '#1e90ff'
        document.getElementById(id).style.color = '#1e90ff'
      }
      this.typeId = id
      const { data: res } = await getArticlesByTypeIdAPI(this.typeId, true, this.pagination.currentPage, this.pagination.pageSize)
      this.articles = res.data
      this.total = res.total
    },
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage
      this.getArticlesByTypeId(this.typeId)
    }
  },
  created() {
    if (this.$route.query.id) this.typeId = this.$route.query.id
    this.getTypes()
    this.getArticlesByTypeId(this.typeId)
    this.isShow = true
  },
  updated() {
    document.getElementById(this.typeId).style.borderColor = '#1e90ff'
    document.getElementById(this.typeId).style.color = '#1e90ff'
  }
}
</script>

<style lang='scss' scope>
.blog-type-content {
  margin-top: 60px;
  .types {
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
        cursor: pointer;
        margin: 8px;
        font-size: 16px;
      }
      .tag-item:hover {
        color: #a29bfe;
      }
    }
  }
  .articles {
    margin: 20px auto;
  }
}
// 手机端适配
@media screen and (max-width: 750px) {
  .blog-type-content {
    .types {
      margin: 0;
      width: 100%;
    }
  }
}
</style>