<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">云E办</div>
        <el-dropdown class="userinfo" @command="commandHandler">
          <span class="el-dropdown-link">{{user.name}}<i><img :src="user.userFace"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index" v-if="!item.hidden">
              <template slot="title">
                <i :class="item.iconCls" style="color: #1accff;margin-right: 5px"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item :index="children.path" v-for="(children,indexj) in item.children" :key="indexj">{{children.name}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path !== '/homepage'">
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path =='/homepage'">
            welcome to our YunEBan system!!!
          </div>
          <router-view class="homerouterview"></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
export default {
  name: "HomePage",
  data(){
    return{
      user:JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  methods:{
    commandHandler(command){
      if(command === 'logout'){
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //注销登录
          this.postRequest('/logout');
          //清空用户信息
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          this.$store.commit('initRoutes',[]);
          //跳转到登录页面
          this.$router.replace('/');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  },
  computed:{
    routes(){
      return this.$store.state.routes;
    }
  },
}
</script>

<style scoped>
.homeHeader{
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}
.homeHeader .title{
  text-align: center;
  font-size: 30px;
  font-family: 华光淡古印_CNKI;
  text-align: center;
  color: white;
}
.homeHeader .userinfo{
  cursor: pointer;
}
.el-dropdown-link img{
  width:48px ;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}
.homeWelcome{
  text-align: center;
  font-size: 30px;
  font-family: 华光淡古印_CNKI;
  color: #409eff;
  padding-top: 50px;
}
.homerouterview{
  margin-top: 10px;
}
</style>