<template>
  <div>
    <el-form
        v-loading="loading"
        element-loading-text="正在登录。。。"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :rules="rules"
        ref="loginForm"
        :model="loginForm"
        class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" v-model="loginForm.code" placeholder="点击图片更换验证码" style="width: 200px;margin-right: 5px"></el-input>
        <img class="codeImg" :src="captchaUrl" @click="updateCaptcha">
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "LoGin",
  data(){
    return{
      loading: false,
      captchaUrl:'/captcha?time=' + new Date(),
      checked: true,
      loginForm:{
        username:'admin',
        password:'123',
        code:'',
      },
      rules:{
        username: [{required:true,message:'请输入用户名',trigger:'blur'}],
        password:[{required:true,message:'请输入密码',trigger:'blur'}],
        code:[{required:true,message:'请输入验证码',trigger:'blur'}],
      },
    }
  },
  methods:{
    submitLogin(){
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest('/login',this.loginForm).then(resp => {
            if(resp){
              this.loading = false;
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.setItem('tokenStr',tokenStr);  //存储用户token
              let path = this.$route.query.redirect;
              this.$router.replace((path=='/'||path==undefined)?'/homepage':path);
              // this.$router.replace('/homepage');  //跳转页面首页
            }
          })
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      });
    },
    updateCaptcha(){
      this.captchaUrl = '/captcha?time=' + new Date();
    },
  },
}
</script>

<style scoped>
.loginContainer{
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  padding: 15px 35px 15px 35px;
  width: 350px;
  background: #ffff;
  border: 1px solid #06f5f5;
  box-shadow: 0 0 25px #cac6c6;
}
.loginTitle{
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.codeImg{
  float: right;
  margin: auto 20px auto auto;
}
.loginRemember{
  text-align: left;
  margin: 0px 0px 15px 0px;
}
.el-form-item__content{
  display: flex;
  align-items: center;
}
/*
本课程新知识点：验证规则书写和绑定以及触发

rules:{
username: [{required:true,message:'请输入用户名',trigger:'blur'}],
password:[{required:true,message:'请输入密码',trigger:'blur'}],
code:[{required:true,message:'请输入验证码',trigger:'blur'}],
},

:rules="rules" prop="username" prop="password" prop="code"

ref="loginForm"
this.$refs["loginForm"].validate((valid) => {
if (valid) {
alert('submit!');
} else {
    this.$message.error('请输入所有字段');
 */
</style>