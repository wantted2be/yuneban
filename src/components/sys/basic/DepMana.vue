<template>
  <div>
    <div style="width: 500px">
      <el-input
          placeholder="请输入部门名称进行搜索..."
          prefix-icon="el-icon-search"
          v-model="filterText">
      </el-input>

      <el-tree
          :data="deps"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }" style="display: flex;justify-content: space-between;width: 100%">
        <span>{{ data.name }}</span>
        <span>
          <el-button
              type="primary"
              size="mini"
              class="depBtn"
              @click="() => showAddDept(data)">
            添加部门
          </el-button>
          <el-button
              type="danger"
              size="mini"
              class="depBtn"
              @click="() => deleteDept(data)">
            删除部门
          </el-button>
        </span>
      </span>
      </el-tree>
      <el-dialog
          title="添加部门"
          :visible.sync="dialogVisible"
          width="30%">
        <div>
          <table>
            <tr>
              <td>
                <el-tag>上级部门</el-tag>
              </td>
              <td>
                {{ this.pname }}
              </td>
            </tr>
            <tr>
              <td>
                <el-tag>部门名称</el-tag>
              </td>
              <td>
                <el-input size="small" v-model="dep.name" placeholder="请输入部门名称"></el-input>
              </td>
            </tr>
          </table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDept">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data(){
    return{
      filterText:'',  //搜索的数据
      deps:[],//树形控件展示的数据
      //树形控件 分级和标题设置
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible:false,
      //添加部门数据对象
      dep:{
        name:'',
        parentId:-1,
      },
      pname:'',  //上级部门的名称
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initDeps();
  },
  methods:{
    //获取后端初始化数据
    initDeps(){
      this.getRequest('/system/basic/department/').then(resp=>{
        if(resp){
          this.deps = resp;
        }
      })
    },
    //展示添加部门的对话框
    showAddDept(data){
      this.dep.parentId = data.id;
      this.pname = data.name;
      this.dialogVisible = true;
    },
    // 添加部门
    addDept(){
      this.postRequest('/system/basic/department/',this.dep).then(resp=>{
        if(resp){
          this.initDeps();
          this.dialogVisible = false;
          this.dep.name = '';
          this.dep.parentId = -1;
          this.pname = '';
        }
      })
    },
    //删除部门
    deleteDept(data){
      this.$confirm('此操作将永久该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/department/'+data.id).then(resp=>{
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
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
}
</script>

<style scoped>
.depBtn{
  padding: 2px;

}
</style>