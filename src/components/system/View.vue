<template>
  <div class="view-content">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 统计主体 -->
    <div class="dashboard-card">
      <div class="dashboard-card-item">
        <div class="dashboard-card-item-title">喜欢总量</div>
        <div class="dashboard-card-item-value">{{ loveCount }}</div>
        <i class="el-icon-star-off icon"></i>
      </div>
      <div class="dashboard-card-item">
        <div class="dashboard-card-item-title">文章总量</div>
        <div class="dashboard-card-item-value">{{ articleCount }}</div>
        <i class="el-icon-tickets icon"></i>
      </div>
      <div class="dashboard-card-item">
        <div class="dashboard-card-item-title">浏览总量</div>
        <div class="dashboard-card-item-value">{{ watchCount }}</div>
        <i class="el-icon-view icon"></i>
      </div>
      <div class="dashboard-card-item">
        <div class="dashboard-card-item-title">评论总量</div>
        <div class="dashboard-card-item-value">{{ commentCount }}</div>
        <i class="el-icon-chat-round icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { getCountsAPI } from '@/api/articleAPI'
import { getCommentCountAPI } from '@/api/commentAPI'
export default {
  name: 'MyView',
  data() {
    return {
      loveCount: 0,
      articleCount: 0,
      watchCount: 0,
      commentCount: 0
    }
  },
  methods: {
    async getCounts() {
      const { data: res } = await getCountsAPI()
      this.loveCount = res.data.loveCount
      this.articleCount = res.data.articleCount
      this.watchCount = res.data.watchCount
    },
    async getCommentCount() {
      const { data: res } = await getCommentCountAPI()
      this.commentCount = res.data
    }
  },
  created() {
    this.getCommentCount()
    this.getCounts()
  }
}
</script>

<style lang='scss' scope>
.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.dashboard-card {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 9.375rem;
}

.dashboard-card-item {
  position: relative;
  background-color: #ecf0f1;
  margin: 10px;
  width: 20%;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
}

.dashboard-card-item:hover .icon {
  font-size: 60px;
}

.dashboard-card-item-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.dashboard-card-item-value {
  font-size: 18px;
  font-weight: bold;
}

.icon {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  font-size: 50px;
  color: #576574;
  transition: all 0.6s;
}

@media screen and (max-width: 750px) {
  .dashboard-card {
    flex-wrap: wrap;
    margin-top: 1.25rem;
    .dashboard-card-item {
      width: 100%;
    }
  }
}
</style>