<template>
  <div class="welcome-content">
    <!-- 头部 -->
    <div>
      <blog-aside></blog-aside>
    </div>
    <!-- 主体 -->
    <el-main class="home-main-body">
      <div class="snow-container" style="display:none;">
        <span v-for="(item,index) in 50" :key="index" class="snowflake">❄</span>
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </el-main>
    <!-- 底部备案 -->
    <blog-bottom></blog-bottom>
  </div>
</template>

<script>
import BlogAside from '@/components/blog/BlogAside.vue'
import BlogBottom from '@/components/blog/BlogBottom.vue'
export default {
  components: { BlogAside, BlogBottom },
  name: 'Welcome'
}
</script>

<style lang='scss' scope>
.welcome-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100%;
  background-size: cover;
  background-image: url('../../assets/blog-img.jpg');
  .snow-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .snowflake {
    position: absolute;
    top: 0;
    display: block;
    font-size: 20px;
    color: #fff;
  }
}
</style>