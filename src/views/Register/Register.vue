<template>
  <div class="logon-content">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>注册</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="gotoLogon">我有账号，去登录</el-button>
      </div>
      <el-form :rules="rules" :model="formdata" ref="formdata" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="formdata.username" type="text" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="formdata.password" type="password" auto-complete="off" @blur="check"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model.trim="formdata.confirmPassword" type="password" auto-complete="off" @blur="check"></el-input>
          <div v-if="isShow" class="el-form-item__error">两次密码不一致</div>
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <el-col :span="20">
            <el-input v-model.trim="formdata.checkCode" type="text" auto-complete="off"></el-input>
            <img class="checkCodeImg" :src="checkCodeImg" @click="changeCheckCodeImg">
            <a class="changeCheckCodeImg" @click="changeCheckCodeImg">换一张</a>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="logon('formdata')">注册</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { logonAPI } from '@/api/userAPI'
export default {
  name: 'Logon',
  data: () => {
    return {
      // 判断密码验证错误的信息是否要展示
      isShow: false,
      // 验证码图片
      checkCodeImg: 'http://localhost:6060/example_war/checkCode',
      // 表单数据
      formdata: {
        username: '',
        password: '',
        confirmPassword: '',
        checkCode: ''
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        confirmPassword: [{ required: true, message: ' ' }],
        checkCode: [{ required: true, message: '请填写验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 检查两次密码是否一致
    check() {
      if (this.formdata.password != this.formdata.confirmPassword) this.isShow = true
      else this.isShow = false
    },
    // 切换验证码图片
    changeCheckCodeImg() {
      this.checkCodeImg = 'http://localhost:6060/example_war/checkCode?' + new Date().getMilliseconds()
    },
    // 注册函数
    logon(formdata) {
      this.$refs[formdata].validate(async valid => {
        if (valid) {
          // 从返回的数据中解析data数据，并且重命名为res
          const { data: res } = await logonAPI(this.formdata)
          if (res === 'ERROR') {
            this.$message({
              message: '注册失败',
              type: 'success'
            })
          } else if (res === 'OK') {
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            setTimeout(() => {
              // 跳转到登录页面
              location.href = '/login'
            }, 3000)
          } else {
            this.$message({
              message: res,
              type: 'error'
            })
          }
        } else {
          this.$message('请填写正确信息')
        }
      })
    },
    // 重置函数
    reset() {
      this.formdata.username = ''
      this.formdata.password = ''
    },
    // 跳转到注册页面
    gotoLogon() {
      location.href = '/login'
    }
  }
}
</script>

<style>
.box-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
}
.el-col {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.checkCodeImg {
  margin: 0 15px;
  border-radius: 10px;
}
.changeCheckCodeImg {
  width: 100px;
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
}
</style>