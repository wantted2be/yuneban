<template>
  <div>
    <div>
      <el-input
          class="addPosInput"
          size="small"
          placeholder="添加职位"
          @keydown.enter.native = 'addPosition'
          suffix-icon="el-icon-plus"
          v-model="pos.name">
      </el-input>
      <el-button icon="el-icon-plus" type="primary" size="small" plain @click="addPosition">添加</el-button>
    </div>
    <div class="positionManaMain">
      <el-table
          size="small"
          stripe
          border
          :data="positions"
          @selection-change="handleSelectionChange"
          style="width: 70%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位"
            width="120">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
            width="200">
        </el-table-column>
<!--        <el-table-column-->
<!--            prop="enabled"-->
<!--            label="是否启用"-->
<!--            width="120">-->
<!--        </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button size="small" style="margin-top: 8px" type="danger" :disabled="this.multipleSelection.length==0" @click="deleteMany">批量删除</el-button>
    <el-dialog
        title="编辑职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-tag>职位名称</el-tag>
        <el-input v-model="updatePos.name" class="updatePosInput" size="small"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data(){
    return{
      pos:{
        name:'',
      },
      positions:[],
      dialogVisible:false,
      updatePos:{
        name:''
      },
      multipleSelection: [],
    }
  },
  methods:{
    //添加职位信息
    addPosition(){
      if(this.pos.name){
        this.postRequest('/system/basic/pos/',this.pos).then(resp=>{
          if(resp){
            this.initPositions();
            this.pos.name = '';
          }
        })
      }else{
        this.$message.error('职位名称不能为空！！！');
      }
    },
    //删除职位信息
    handleDelete(index,data){
      this.$confirm('此操作将永久该职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/'+data.id).then(resp=>{
          if(resp){
            this.initPositions();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showEditView(index,data){
      this.dialogVisible = true;
      Object.assign(this.updatePos,data);  //采用拷贝方式  修改bug
      this.updatePos.createDate='';
    },
    //编辑职位信息
    doUpdate(){
      this.putRequest('/system/basic/pos/',this.updatePos).then(resp=>{
        if(resp){
          this.initPositions();
          this.dialogVisible = false;
        }
      })
    },
    //批量删除
    deleteMany(){
      this.$confirm('此操作将永久删除这些职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item=>{
          ids = ids + 'ids=' + item.id + '&';
        });
        this.deleteRequest('/system/basic/pos/' + ids).then(resp=>{
          if(resp){
            this.initPositions();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //初始化职位信息
    initPositions(){
      this.getRequest('/system/basic/pos/').then(resp=>{
        if(resp){
          this.positions = resp;
        }
      })
    },
    //多选框
    handleSelectionChange(val){
      this.multipleSelection = val;

    }
  },
  mounted() {
    this.initPositions();
  }
}
</script>

<style scoped>
.addPosInput{
  width: 300px;
  margin-right: 8px;
}
.positionManaMain{
  margin-top: 10px;
}
.updatePosInput{
  width: 200px;
  margin-left: 8px;

}
</style>