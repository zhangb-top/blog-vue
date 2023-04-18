<template>
  <div :style="{width:width}" class="articles-card-content">
    <el-card v-if="articles.length!==0" class="articles-card">
      <div slot="header" class="clearfix">
        <span>博客</span>
        <el-button style="float: right; padding: 3px 0" type="text" class="btn">共{{total}}篇</el-button>
      </div>
      <div v-for='item in articles' :key="item.id" class="article-item">
        <Article :article="item"></Article>
      </div>
      <div class="bottom">
        <el-pagination @current-change="currentChange" :current-page="currentPage" :page-size="pageSize" :total="total" class="pagination" background layout="prev, next">
        </el-pagination>
      </div>
    </el-card>
    <el-card v-else class="articles-card">
      <div slot="header" class="clearfix">
        <span>博客</span>
        <el-button style="float: right; padding: 3px 0" type="text" class="btn">共{{total}}篇</el-button>
      </div>
      <el-empty description="木有文章啊"></el-empty>
    </el-card>
  </div>
</template>

<script>
import Article from './Article.vue'
export default {
  components: { Article },
  name: 'ArticlesCard',
  props: {
    articles: {
      required: true,
      type: Array
    },
    total: {
      required: true,
      type: Number
    },
    currentPage: {
      required: true,
      type: Number
    },
    pageSize: {
      required: true,
      type: Number
    },
    width: {
      default: '37.5rem',
      type: String
    }
  },
  methods: {
    currentChange(currentPage) {
      this.$emit('current-change', currentPage)
    }
  }
}
</script>

<style lang='scss' scope>
.articles-card {
  background-color: rgba($color: #fff, $alpha: 0.5) !important;
  border: none !important;
  .clearfix {
    color: #fff;
    font-size: 20px;
    .btn {
      font-size: 18px;
      color: #40407a;
    }
  }
  .bottom {
    height: 2.1875rem;
    position: relative;
    .pagination {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
    }
  }
  .el-empty__description p {
    color: #57606f;
  }
}

// 手机端适配
@media screen and (max-width: 750px) {
  .articles-card-content {
    width: 100% !important;
    margin: auto;
    margin-bottom: 1.25rem;
  }
}
</style>