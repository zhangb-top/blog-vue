<template>
  <div class="blog-aside-content">
    <el-menu router :default-active="myPath" class="el-menu-welcome" mode="horizontal" text-color="#fff" active-text-color="#ffd04b">
      <div class="logo" @click="gotoWelcome">blog / promise</div>
      <el-menu-item route="/" index="/index" class="item">首页</el-menu-item>
      <el-menu-item route="/type" index="/type" class="item">分类</el-menu-item>
      <el-menu-item route="/tag" index="/tag" class="item">标签</el-menu-item>
      <el-menu-item route="/archive" index="/archive" class="item">归档</el-menu-item>
      <a href="https://zb-chatgpt-648f.vercel.app/" target="_blank" class="chatgpt">ChatGPT</a>
      <div class="snowflake-btn" @click="isShowSnowFlake">❄</div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'BlogAside',
  data() {
    return {
      myPath: '/index',
      isShow: true
    }
  },
  methods: {
    // 去首页
    gotoWelcome() {
      this.$router.push({ path: '/' })
    },
    // 去后台管理系统
    gotoSystem() {
      this.$router.push({ path: '/login' })
    },
    // 展示雪花
    isShowSnowFlake() {
      this.isShow = !this.isShow
      if (this.isShow) return (document.querySelector('.snow-container').style.display = 'none')
      document.querySelector('.snow-container').style.display = 'block'
      const snowflakes = document.querySelectorAll('.snowflake')
      snowflakes.forEach(snowflake => {
        // 设置❄生成位置随机
        const randomX = Math.floor(Math.random() * window.innerWidth)
        const randomY = Math.floor(Math.random() * window.innerHeight)
        const size = Math.random() * 50
        snowflake.style.left = `${randomX}px`
        snowflake.style.top = `${randomY}px`
        snowflake.style.fontSize = `${size}px`
        // 流动方向随机
        const animation = snowflake.animate(
          [
            { transform: 'translate(-50%, -50%) rotate(-45deg) translateY(-100%)', opacity: 0 },
            { transform: 'translate(-50%, -50%) rotate(-45deg) translateY(100%)', opacity: 1 },
            { transform: 'translate(-50%, -50%) rotate(-45deg) translateY(200%)', opacity: 0 }
          ],
          {
            duration: 3000,
            iterations: Infinity
          }
        )
        animation.pause()
        setTimeout(() => {
          animation.play()
        }, Math.floor(Math.random() * 5000))
      })
    }
  },
  watch: {
    $route: function () {
      this.myPath = this.$route.matched[1] ? this.$route.matched[1].path : '/'
    }
  },
  created() {
    this.myPath = this.$route.matched[1] ? this.$route.matched[1].path : '/'
  }
}
</script>

<style lang='scss' scope>
.el-menu-welcome {
  border-bottom: none !important;
  background-color: rgba($color: #545c64, $alpha: 0.5) !important;
  z-index: 9999;
  width: 100%;
  position: fixed !important;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
  .item:hover {
    background-color: rgba($color: #545c64, $alpha: 0.5) !important;
  }
  .item {
    background-color: rgba($color: #545c64, $alpha: 0) !important;
  }
  .logo {
    font-family: '华文行楷';
    cursor: pointer;
    position: absolute;
    color: #48dbfb;
    left: 6%;
    font-size: 2.25rem;
  }
  .system {
    cursor: pointer;
    position: absolute;
    color: #fff;
    right: 5%;
    font-size: 1.125rem;
  }
  .snowflake-btn {
    cursor: pointer;
    position: absolute;
    color: #48dbfb;
    right: 6%;
    font-size: 2.25rem;
  }
  .chatgpt {
    display: inline-block;
    padding: 20px;
    color: #e84118;
    text-decoration: none;
  }
}

// 手机端适配
@media screen and (max-width: 750px) {
  .blog-aside-content {
    .logo {
      display: none;
    }
    .snowflake-btn {
      display: none;
    }
  }
}
</style>