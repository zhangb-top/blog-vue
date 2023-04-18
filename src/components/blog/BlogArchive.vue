<template>
  <div class="blog-archive-content">
    <!-- 头部 -->
    <div class="head">
      <div class="title">归档</div>
      <div class="total">共 <span>{{total}}</span> 篇博客</div>
    </div>
    <!-- 时间轴 -->
    <el-timeline reverse class="timeline">
      <el-timeline-item v-for="(item,index) in yearMonth" :key="index" :timestamp="item.date | dateFormate" placement="top">
        <!-- 折叠面板 -->
        <el-collapse @change="changeCollapse(item.date,index)">
          <el-collapse-item class="item" title="Please click me">
            <div class="item-title" v-for="(article,index) in item.articles" :key="index" @click="gotoDetail(article.id)">{{article.title}}</div>
          </el-collapse-item>
        </el-collapse>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getYearMonthFromArticlesAPI, getTitleByYearMonthAPI, getTotalArticleAPI } from '@/api/articleAPI'
export default {
  name: 'BlogArchive',
  data() {
    return {
      yearMonth: [],
      total: 0
    }
  },
  methods: {
    // 获取年月
    async getYearMonthFromArticles() {
      const { data: res } = await getYearMonthFromArticlesAPI()
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      res.data.forEach(date => {
        this.yearMonth.push({ date: date, articles: [] })
      })
    },
    // 查询文章总数量
    async getTotalArticles() {
      const { data: res } = await getTotalArticleAPI(true)
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.total = res.total
    },
    // 获取年月对应的文章标题
    async getTitleByYearMonth(date, index) {
      // 减轻服务器压力
      if (this.yearMonth[index].articles.length !== 0) return
      const { data: res } = await getTitleByYearMonthAPI(date)
      if (res.code !== 30001) return this.$message({ message: res.msg, type: 'error' })
      this.yearMonth[index].articles = res.data
    },
    changeCollapse(date, index) {
      this.getTitleByYearMonth(date, index)
    },
    gotoDetail(id) {
      const { href } = this.$router.resolve({ path: '/detail', query: { id: id } })
      window.open(href, '_blank')
    }
  },
  filters: {
    dateFormate(date) {
      return date.slice(0, 4) + '年' + date.slice(4) + '月'
    }
  },
  created() {
    this.getTotalArticles()
    this.getYearMonthFromArticles()
  }
}
</script>

<style lang='scss' scope>
.blog-archive-content {
  margin: 5rem auto 0 auto;
  width: 60%;
  .head {
    display: flex;
    align-items: center;
    background-color: rgba($color: #fff, $alpha: 0.5);
    padding: 1.25rem;
    margin-bottom: 3.125rem;
    border-radius: 0.3125rem;
    .title {
      flex: 1;
      color: #fff;
      font-size: 1.5rem;
    }
    .total {
      color: #fff;
      font-size: 1.125rem;
      span {
        color: blueviolet;
        font-size: 1.25rem;
      }
    }
  }
  .timeline {
    padding: 0;
  }
  .el-timeline-item__timestamp {
    color: #fff;
    font-size: 0.9375rem;
  }
  .item {
    border-radius: 0.3125rem;
    overflow: hidden;
    .item-title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .el-collapse-item__header {
      border: none;
      font-size: 1rem;
    }
    .el-collapse-item__content div {
      margin-bottom: 0.9375rem;
      cursor: pointer;
      font-size: 1rem;
    }
    .el-collapse-item__content div:hover {
      color: #0097e6;
    }
  }
  .el-collapse {
    border: none;
    .el-collapse-item__header {
      padding-left: 0.9375rem;
      background-color: rgba($color: #fff, $alpha: 0.5);
    }
    .el-collapse-item__content {
      padding: 0.9375rem;
    }
    .el-collapse-item__wrap {
      border: none;
      background-color: rgba($color: #fff, $alpha: 0.5);
    }
  }
}
// 手机端适配
@media screen and (max-width: 750px) {
  .blog-archive-content {
    margin: 5rem auto 0 auto;
    width: 80%;
    .head {
      .title {
        font-size: 1.25rem;
      }
    }
    .el-collapse-item__content div:hover {
      color: #000;
    }
  }
}
</style>