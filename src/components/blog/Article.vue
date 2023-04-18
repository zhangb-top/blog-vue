<template>
  <div class="article-content">
    <div class="title" @click="gotoDetail">{{article.title}}</div>
    <div class="description">{{article.description}}</div>
    <div class="createInfo">
      <div class="author">{{article.author}}</div>
      <div class="createTime">
        <i class="el-icon-date"></i>
        {{article.createTime}}
      </div>
      <div class="watch">
        <i class="el-icon-view"></i>
        {{article.watch}}
      </div>
      <div class="love">
        <i class="el-icon-star-off"></i>
        {{article.love}}
      </div>
      <el-tag class="tagName" effect="dark" type="warning" size="small">
        {{article.tagName}}
      </el-tag>
    </div>
  </div>
</template>

<script>
import { updateArticleAPI } from '@/api/articleAPI'
export default {
  name: 'Article',
  props: {
    article: {
      required: true,
      type: Object
    }
  },
  methods: {
    gotoDetail() {
      // 增加watch量
      this.article.watch++
      updateArticleAPI(this.article)
      const { href } = this.$router.resolve({ path: '/detail', query: { id: this.article.id, title: this.article.title } })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang='scss' scope>
.article-content {
  padding: 15px;
  .title {
    cursor: pointer;
    font-size: 1.25rem;
    font-weight: 700;
    margin: 10px 0 20px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .description {
    font-size: 1rem;
    margin: 10px 0;
    font-size: 1.125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .createInfo {
    position: relative;
    display: flex;
    font-size: 1.125rem;
    align-items: center;
    .author {
      color: #5f27cd;
      margin-right: 10px;
    }
    .createTime {
      color: #576574;
      margin-right: 10px;
    }
    .watch {
      color: #576574;
      margin-right: 10px;
    }
    .love {
      color: #576574;
      margin-right: 10px;
    }
    .tagName {
      position: absolute;
      right: 0;
    }
  }
}
.title:hover {
  color: #0097e6;
}
// 手机端适配
@media screen and (max-width: 750px) {
  .createTime,
  .watch,
  .love {
    display: none;
  }
  .title:hover {
    color: #000;
  }
}
</style>