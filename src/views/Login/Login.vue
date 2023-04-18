<template>
  <div class="login-content">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>登录</span>
      </div>
      <el-form :rules="rules" :model="formdata" ref="formdata" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="formdata.username" type="text" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="formdata.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('formdata')">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入配置好的API文件（返回const数据的，要加{}）
import { loginAPI } from '@/api/userAPI'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data: () => {
    return {
      // 表单数据
      formdata: {
        username: '',
        password: ''
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updateTokenInfo']),
    // 登录函数
    login(formdata) {
      this.$refs[formdata].validate(async valid => {
        if (valid) {
          // 从返回的数据中解析data数据，并且重命名为res
          const { data: res } = await loginAPI(this.formdata)
          if (res.code !== 10001) {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          } else {
            // 把登录成功的结果，存储到 vuex 中
            this.updateTokenInfo(res.token)
            // 登录成功后，跳转到主页
            this.$router.push('/home')
          }
        } else {
          this.$message('请填写正确的用户名和密码')
        }
      })
    },
    // 重置函数
    reset() {
      this.formdata.username = ''
      this.formdata.password = ''
    }
  }
}
</script>

<style lang="scss" scope>
.login-content {
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100%;
  background-size: cover;
  background-image: url('../../assets/bg-img.jpg');
}
.box-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
}

@media screen and (max-width: 750px) {
  .box-card {
    width: 90%;
  }
}
</style>>