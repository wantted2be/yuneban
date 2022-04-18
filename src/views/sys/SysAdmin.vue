<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 10px">
      <el-input v-model="keywords" prefix-icon="el-icon-search" placeholder="通过用户名搜索用户" style="width: 400px;margin-right: 8px"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <div class="adminContainer">
      <el-card class="admin-card" v-for="(admin,index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{admin.name}}</span>
          <el-button style="float: right; padding: 3px 0; color: #00eaff" icon="el-icon-delete" type="text" @click="deleteAdmin"></el-button>
        </div>
        <div>
          <div class="imgContainer">
            <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userFaceImg">
          </div>
          <div class="userinfoContainer">
            <div>用户名：{{admin.name}}</div>
            <div>手机号码：{{admin.phone}}</div>
            <div>电话号码：{{admin.telephone}}</div>
            <div>地址：{{admin.address}}</div>
            <div>用户状态：
              <el-switch
                  @change="enabledChange(admin)"
                  v-model="admin.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="启用"
                  inactive-text="禁用">
              </el-switch>
            </div>
            <div>
              用户角色：
              <el-tag type="success" style="margin-right: 4px" v-for="(role,indexj) in admin.roles" :key="indexj">{{role.nameZh}}</el-tag>
              <el-popover
                  placement="right"
                  title="角色列表"
                  width="200"
                  @show="showPop(admin)"
                  @hide="hidePop(admin)"
                  trigger="click">
                <el-select multiple v-model="selectRoles" placeholder="请选择">
                  <el-option
                      v-for="(r,index) in allRoles"
                      :key="index"
                      :label="r.nameZh"
                      :value="r.id">
                  </el-option>
                </el-select>
                <el-button type="text" slot="reference" icon="el-icon-more"></el-button>
              </el-popover>
            </div>
            <div>
              备注：{{admin.remark}}
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysAdmin",
  data(){
    return{
      admins:[],  //用于存放后端初始化来的数据
      keywords:'',  //用于搜索框的数据，用于查找的字段
      allRoles:[],  //所有的角色名称
      selectRoles:[],  //角色选中的数组
    }
  },
  mounted() {
    this.initAdmins();
  },
  methods:{
    hidePop(admin){
      let flag = false;
      let roles = [];
      Object.assign(roles,admin.roles);
      if(roles.length != this.selectRoles.length){
        flag =true;
      }else{
        for(let i=0;i<roles.length;i++){
          let role =roles[i];
          for(let j=0;j<this.selectRoles.length;j++){
            let sr = this.selectRoles[i];
            if(role.id == sr){
              roles.splice(i,1);
              i--;
              break;
            }
          }
        }
        if(roles.length!=0){
          flag =true;
        }
      }
      if(flag){
        let url = '/system/admin/role?adminId=' + admin.id;
        this.selectRoles.forEach(sr=>{
          url += '&rids='+sr;
        });
        this.putRequest(url).then(resp=>{
          if(resp){
            this.initAdmins();
          }
        })
      }
    },
    showPop(admin){
      this.initAllRoles();
      let roles = admin.roles;
      this.selectRoles= [];
      roles.forEach(r=>{
        this.selectRoles.push(r.id);
      });
    },
    // 获取所有的角色
    initAllRoles(){
      this.getRequest("/system/admin/roles").then(resp=>{
        if(resp){
          this.allRoles = resp;
        }
      })
    },
    //初始化获取数据库所有的操作员
    initAdmins(){
      this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp=>{
        this.admins = resp;
      })
    },
    //根据搜索框的输入进行查找
    search(){
      this.initAdmins();
    },
    //删除操作员
    deleteAdmin(admin){
      this.$confirm('此操作将永久该操作员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/admin/'+data.id).then(resp=>{
          if(resp){
            this.initDeps();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //更新操作员
    enabledChange(admin){
      this.putRequest("/system/admin/",admin).then(resp=>{
        if(resp){
          this.initAdmins();
        }
      })
    }
  }
}
</script>

<style scoped>
.adminContainer{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 10px;
}
.admin-card{
  width: 350px;
  margin-bottom: 20px;
}
.userFaceImg{
  width: 72px;
  height: 72px;
  border-radius: 72px;
}
.imgContainer{
  width: 100%;
  display: flex;
  justify-content: center;
}
.userinfoContainer{
  font-size: 12px;
  color: #0D78DC;
}
</style>