<template>
  <div class="my-aside-content">
    <el-menu :collapse="collapse" background-color="#576574" text-color="#fff" active-text-color="#54a0ff" :default-active="myPath" class="el-menu-vertical-demo" router unique-opened>
      <el-menu-item route="/home/view" index="/home/view">
        <i class="el-icon-s-platform" style="font-size: 24px;"></i>
        <span>视图</span>
      </el-menu-item>
      <el-submenu index='/'>
        <template slot="title">
          <i class="el-icon-collection" style="font-size: 24px;"></i>
          <span>文章</span>
        </template>
        <el-menu-item-group>
          <el-menu-item route="/home/select" index="/home/select">
            <span>管理</span>
          </el-menu-item>
          <el-menu-item route="/home/add" index="/home/add">
            <span>编辑</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item route="/home/comment" index="/home/comment">
        <i class="el-icon-chat-dot-square" style="font-size: 24px;"></i>
        <span>评论</span>
      </el-menu-item>
      <el-menu-item route="/home/type" index="/home/type">
        <i class="el-icon-price-tag" style="font-size: 24px;"></i>
        <span>分类</span>
      </el-menu-item>
      <el-menu-item route="/home/tag" index="/home/tag">
        <i class="el-icon-collection-tag" style="font-size: 24px;"></i>
        <span>标签</span>
      </el-menu-item>
      <el-menu-item route="/index" index="/">
        <i class="el-icon-position" style="font-size: 24px;"></i>
        <span>前台</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'MyAside',
  data() {
    return {
      myPath: '',
      collapse: false
    }
  },
  watch: {
    $route: function () {
      this.myPath = this.$route.matched[1] ? this.$route.matched[1].path : this.$route.matched[0].path
    }
  },
  created() {
    this.myPath = this.$route.matched[1] ? this.$route.matched[1].path : this.$route.matched[0].path
    if (window.screen.width <= 750) this.collapse = true
  }
}
</script>

<style lang='scss' scope>
.my-aside-content {
  width: 200px;
  height: 100%;
  background-color: #576574;
  color: #333;
  text-align: center;
  .el-menu {
    border: 0;
  }
}

/* 手机端适配 */
@media screen and (max-width: 750px) {
  .my-aside-content {
    width: 4rem;
  }
  .el-menu-item-group__title {
    display: none;
  }
  .el-menu--popup {
    min-width: 6.25rem;
  }
}
</style>