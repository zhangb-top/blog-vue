<template>
  <div class="detail-content" v-title :data-title='this.$route.query.title'>
    <!-- 目录 -->
    <div class="scroll">
      <div v-html="heading" class="directory"></div>
    </div>
    <!-- 博客 -->
    <div v-if="markdownContext!==''" class="box">
      <!-- 内容 -->
      <div class="artices-box">
        <div class="article-title-box" id="title">
          {{article.title}}
          <i v-if="!isStarted" class="el-icon-star-off start-icon" @click="onstart"></i>
          <i v-else class="el-icon-star-on start-icon" @click="unstart"></i>
        </div>
        <div class="article-description-box">简介：{{article.description}}</div>
        <hr>
        <div class="article-context-box" ref="article" v-html="markdownContext"></div>
      </div>
      <!-- 评论区 -->
      <blog-comment :articleId="article.id"></blog-comment>
    </div>
    <!-- 跳转评论 -->
    <a href="#comment" class="message">留言</a>
    <a href="#title" class="top">top</a>
  </div>
</template>

<script>
import { getArticleByIdAPI, updateArticleAPI } from '@/api/articleAPI'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import BlogComment from './BlogComment.vue'
export default {
  components: { BlogComment },
  name: 'Detail',
  data() {
    return {
      article: {},
      markdownContext: '',
      heading: '',
      isStarted: false
    }
  },
  methods: {
    async getArticleById(id) {
      const { data: res } = await getArticleByIdAPI(id)
      this.article = res.data
      const purify = DOMPurify(window)
      this.markdownContext = purify.sanitize(marked.parse(this.article.context))
    },
    setOptions() {
      marked.use({
        renderer: new marked.Renderer(),
        highlight: function (code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        },
        langPrefix: 'hljs language-',
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartypants: false,
        xhtml: false
      })
    },
    generateTableOfContents() {
      const headings = this.$refs.article.querySelectorAll('h1,h2,h3,h4,h5,h6')
      if (headings.length === 0) return
      let toc = '<ul>'
      headings.forEach((heading, index) => {
        let marginLeft = this.getMarginLeft(heading.tagName)
        toc += `<li style='margin:10px 0 0 ${marginLeft}px;'><a href="#section-${index + 1}">${heading.textContent}</a></li>`
        heading.setAttribute('id', `section-${index + 1}`)
      })
      toc += '</ul>'
      this.heading = toc
    },
    // 获取marginLeft的值
    getMarginLeft(value) {
      const result = { H1: 0, H2: 15, H3: 30, H4: 45, H5: 60, H6: 75 }
      return result[value]
    },
    // 点赞
    async onstart() {
      const h = this.$createElement
      this.article.love++
      const { data: res } = await updateArticleAPI(this.article)
      if (res.code !== 40001)
        return this.$notify({
          title: '提示',
          message: h('i', { style: 'color: teal' }, res.msg),
          showClose: false,
          offset: 100
        })
      this.isStarted = true
      this.$notify({
        title: '提示',
        message: h('i', { style: 'color: teal' }, '三克油~~~'),
        showClose: false,
        offset: 100
      })
    },
    // 取消点赞
    async unstart() {
      const h = this.$createElement
      this.article.love--
      const { data: res } = await updateArticleAPI(this.article)
      if (res.code !== 40001)
        return this.$notify({
          title: '提示',
          message: h('i', { style: 'color: teal' }, res.msg),
          showClose: false,
          offset: 100
        })
      this.isStarted = false
      this.$notify({
        title: '提示',
        message: h('i', { style: 'color: teal' }, '我会继续努力的~~~'),
        showClose: false,
        offset: 100
      })
    }
  },
  created() {
    this.getArticleById(this.$route.query.id)
    this.setOptions()
  },
  updated() {
    if (screen.width >= 900) this.generateTableOfContents()
  }
}
</script>

<style lang='scss' scope>
.detail-content {
  margin-top: 60px;
  word-wrap: break-word;
  .box {
    transform: translateX(45%);
    width: 60%;
    color: #fff;
    .artices-box {
      background-color: rgba($color: rgb(30, 41, 59), $alpha: 0.5);
      border-radius: 5px;
      padding: 30px;
      p,
      li {
        line-height: 2;
      }
    }
  }

  .article-title-box {
    text-align: center;
    padding: 20px;
    font-size: 26px;
    color: #ee5253;
    .start-icon {
      cursor: pointer;
      margin-left: 3.125rem;
      color: #fff;
    }
  }
  .article-description-box {
    margin-bottom: 20px;
  }
  /* 设置所有盒子的字体行高 */
  blockquote {
    border-left: 4px solid #ee5253;
    p {
      margin-left: 0.625rem;
      font-style: italic;
    }
  }
  .hljs {
    border-radius: 0.3125rem;
    background-color: #0f172a;
    font-size: 16px;
    font-family: 'sans', 'serif', 'monospace';
  }
  img {
    max-width: 100%;
    border-radius: 0.3125rem;
  }
  .scroll {
    position: fixed;
    top: 80px;
    left: 0;
    width: 15.625rem;
    max-height: 80%;
    background-color: rgba($color: #1e293b, $alpha: 0.5);
    border-radius: 0.3125rem;
    overflow-y: scroll;
    word-break: break-all;
    .directory {
      li {
        list-style-type: none;
      }
      a {
        text-decoration: none;
        color: #fff;
      }
    }
  }
  .message,
  .top {
    position: fixed;
    bottom: 50px;
    right: 50px;
    display: block;
    width: 3.125rem;
    height: 3.125rem;
    background-color: rgba($color: #1e293b, $alpha: 0.8);
    text-align: center;
    line-height: 3.125rem;
    border-radius: 50%;
    text-decoration: none;
    color: #fff;
  }
  .top {
    bottom: 120px;
    right: 50px;
  }
  a {
    color: #fff;
    font-weight: 700;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
  }
  table td,
  table th {
    border: 1px solid #cad9ea;
    color: #666;
    height: 30px;
  }
  table thead th {
    background-color: #cce8eb;
    width: 100px;
  }
  table tr:nth-child(odd) {
    background: #fff;
  }
  table tr:nth-child(even) {
    background: #f5fafa;
  }
}
@media screen and (max-width: 750px) {
  .detail-content {
    .article-title-box {
      .start-icon {
        margin-left: 0;
      }
    }
    .message,
    .top {
      display: none;
    }
    .box {
      width: 100%;
      transform: translateX(0);
    }
  }
  .blog-comment-content .form {
    display: block;
  }
}
</style>