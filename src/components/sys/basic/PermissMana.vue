<template>
  <div>
    <div class="permissManaTool">
      <el-input placeholder="请输入角色英文名字" v-model="role.name" size="small">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input placeholder="请输入角色中文名字" v-model="role.nameZh" size="small" @keyup.enter.native="addRoles"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addRoles">添加</el-button>
    </div>
    <div class="permissManaMain">
      <el-collapse accordion @change="change" v-model="activeName">
        <el-collapse-item :title="item.nameZh" :name="item.id" v-for="(item,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0; color: red" icon="el-icon-delete" type="text" @click="deleteRoles(item.id)"></el-button>
            </div>
            <div>
              <el-tree show-checkbox :data="allMenus" :props="defaultProps" :default-checked-keys="selectedMenus" node-key="id" ref="tree" :key="index"></el-tree>
              <div style="display: flex;justify-content: flex-end">
                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                <el-button type="primary" size="mini" @click="doUpdate(item.id,index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import {initMenu} from "@/utils/menus";

export default {
  name: "PermissMana",
  data(){
    return{
      role:{
        name:'',
        nameZh:'',
      },
      roles:[],//接收后端查询的数据，
      allMenus:[],//所有的菜单展示，（权限范围）
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedMenus:[],//默认选中的数组，每一个元素代表不同的菜单权限
      activeName: -1,  //默认激活的面板
    }
  },
  mounted(){
    this.initRoles();
  },
  methods:{
    //初始化数据信息
    initRoles(){
      this.getRequest('/system/basic/permiss/').then(resp=>{
        if(resp){
          this.roles = resp;
        }
      })
    },
    //手风琴改变事件
    change(rid){
      if(rid){
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    //初始化所有的菜单
    initAllMenus(){
      this.getRequest('/system/basic/permiss/menus').then(resp=>{
        if(resp){
          this.allMenus = resp;
        }
      })
    },
    //初始化角色权限菜单
    initSelectedMenus(rid){
      this.getRequest('/system/basic/permiss/mid/'+rid).then(resp=>{
        if(resp){
          this.selectedMenus = resp;
        }
      })
    },
    //更新权限操作
    doUpdate(id,index){
      let tree = this.$refs.tree[index];  //获取对应的tree
      let selectedKeys = tree.getCheckedKeys(true);  //获取选中的叶子节点
      let url = '/system/basic/permiss/?rid=' + id;
      selectedKeys.forEach(item=>{
        url += '&mids=' + item;
      });
      this.putRequest(url).then(resp=>{
        if(resp){
          this.activeName = -1;
        }
      })
    },
    //取消更新
    cancelUpdate(){
      this.activeName = -1;
    },
    addRoles(){
      if(this.role.name && this.role.nameZh){
        this.postRequest('/system/basic/permiss/role',this.role).then(resp=>{
          if(resp){
            this.role.name = '';
            this.role.nameZh ='';
            this.initRoles();
          }
        })
      }else{
        this.$message.error('字段不能为空')
      }
    },
    //删除角色
    deleteRoles(id){
      this.$confirm('此操作将永久该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/permiss/role/'+id).then(resp=>{
          if(resp){
            this.initRoles();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
}
</script>

<style scoped>
.permissManaTool{
  display: flex;
  justify-content: flex-start;
}
.permissManaTool .el-input{
  width: 300px;
  margin-right: 6px;
}
.permissManaMain{
  margin-top: 10px;
  width: 700px;
}
</style>