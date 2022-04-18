<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input v-model="empName" @keydown.enter.native="initEmps" clearable @clear="initEmps" placeholder="请输入员工姓名进行搜索。。。" prefix-icon="el-icon-search" style="width: 300px;margin-right: 10px"></el-input>
        <el-button type="primary" @click="initEmps" icon="el-icon-search">搜索</el-button>
        <el-button type="primary"><i class="fa fa-angle-double-down" aria-hidden="true"></i>高级搜索</el-button>
      </div>
      <div>
        <el-button type="success"><i class="fa fa-level-up" aria-hidden="true"></i> 导入数据</el-button>
        <el-button type="success"><i class="fa fa-level-down" aria-hidden="true"></i> 导入数据</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加员工</el-button>
      </div>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="emps"
          stripe
          border
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="85">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="50">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            width="95"
            align="left">
        </el-table-column>
        <el-table-column
            prop="idCard"
            label="省份证号码"
            width="150"
            align="left">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            label="婚姻状况"
            width="70"
            align="left">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            label="民族"
            width="50"
            align="left">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            label="籍贯"
            width="80"
            align="left">
        </el-table-column>
        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            width="100"
            align="left">
        </el-table-column>
        <el-table-column
            prop="email"
            label="电子邮件"
            width="180"
            align="left">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            width="100"
            align="left">
        </el-table-column>
        <el-table-column
            prop="address"
            label="联系地址"
            width="270"
            align="left">
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="所属部门"
            width="100"
            align="left">
        </el-table-column>
        <el-table-column
            prop="joblevel.name"
            label="职称"
            width="100"
            align="left">
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            width="100"
            align="left">
        </el-table-column>
        <el-table-column
            prop="engageForm"
            label="聘用形式"
            width="100"
            align="left">
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            label="最高学历"
            width="80"
            align="left">
        </el-table-column>
        <el-table-column
            prop="school"
            label="毕业院校"
            width="150"
            align="left">
        </el-table-column>
        <el-table-column
            prop="specialty"
            label="专业"
            width="150"
            align="left">
        </el-table-column>
        <el-table-column
            prop="workState"
            label="在职状态"
            width="70"
            align="left">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            label="入职日期"
            width="95"
            align="left">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            label="转正日期"
            width="95"
            align="left">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            label="合同起始日期"
            width="95"
            align="left">
        </el-table-column>
        <el-table-column
            prop="endContract"
            label="合同结束日期"
            width="95"
            align="left">
        </el-table-column>
        <el-table-column
            label="合同期限"
            width="100"
            align="left">
          <template slot-scope="scope">
            <el-tag>{{scope.row.contractTerm}}</el-tag>年
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right"
            width="200">
          <template slot-scope="scope">
            <el-button size="mini" style="padding: 3px">编辑</el-button>
            <el-button type="primary" size="mini" style="padding: 3px">查看高级资料</el-button>
            <el-button type="danger" size="mini" style="padding: 3px">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            layout="sizes,prev, pager, next, jumper, ->, total"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="添加员工" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-form ref="empForm" :model="emp" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名:" prop="name">
                <el-input style="width: 150px" size="mini" prefix-icon="el-icon-edit" v-model="emp.name" placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender" style="margin-top: 5px;">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                    v-model="emp.birthday"
                    type="date"
                    size="mini"
                    style="width: 150px"
                    value-format="yyyy-MM-dd"
                    placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌:" prop="politicId">
                <el-select v-model="emp.politicId"
                           placeholder="政治面貌" size="mini" style="width: 200px">
                  <el-option
                      v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="民族:" prop="nationId">
                <el-select v-model="emp.nationId" placeholder="民族" size="mini" style="width: 150px">
                  <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input size="mini" style="width: 120px" vmodel="emp.nativePlace" placeholder="请输入籍贯" prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input size="mini" style="width: 150px" vmodel="emp.email" placeholder="请输入电子邮箱" prefix-icon="el-icon-message"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址:" prop="address">
                <el-input size="mini" style="width: 200px" vmodel="mp.address" placeholder="请输入联系地址"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <el-select v-model="emp.posId" placeholder="职位"
                           size="mini" style="width: 150px">
                  <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px">
                  <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:" prop="departmentId">
                <el-popover
                    placement="right"
                    title="请选择部门"
                    width="200"
                    trigger="manual"
                    v-model="popVisible">
                  <el-tree :data="allDeps"
                           :props="defaultProps" default-expand-all
                           @node-click="handleNodeClick"></el-tree>
                    <div slot="reference" style="width: 150px;display: inline-flex;
                         font-size: 13px;border: 1px solid #dedede;height: 24px;border-radius:5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box" @click="showDepView">
                      {{inputDepName}}
                    </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码:" prop="phone">
                <el-input size="mini" style="width: 200px" vmodel="emp.phone" placeholder="请输入电话号码"
                          prefix-icon="el-icon-phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="workID">
                <el-input size="mini" style="width: 150px" vmodel="emp.workID" placeholder="请输入工号"
                          prefix-icon="el-icon-edit" disabled>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select v-model="emp.tiptopDegree" placeholder="学历" size="mini" style="width: 150px">
                  <el-option
                      v-for="item in tiptopDegrees"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校:" prop="school">
                <el-input size="mini" style="width: 150px" vmodel="emp.school" placeholder="请输入毕业院校"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称:" prop="specialty">
                <el-input size="mini" style="width: 200px" vmodel="emp.specialty" placeholder="请输入专业名称"
                          prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <el-date-picker
                    v-model="emp.beginDate"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px"
                    placeholder="入职日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px"
                    placeholder="转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginContract">
                <el-date-picker
                    v-model="emp.beginContract"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px"
                    placeholder="合同起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同截止日期:" prop="endContract">
                <el-date-picker
                    v-model="emp.endContract"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px"
                    placeholder="合同截止日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码:" prop="idCard">
                <el-input size="mini" style="width: 180px" vmodel="emp.idCard" placeholder="请输入身份证号码" prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式:" prop="engageForm">
                <el-radio-group v-model="emp.engageForm" style="margin-top: 5px;">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况:" prop="wedlock">
                <el-radio-group v-model="emp.wedlock" style="margin-top: 5px;">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data(){
    return{
      emps:[],
      loading:false,
      total:0,
      currentPage:1,
      size:10,
      empName:'',
      dialogVisible:false,
      nations:[],
      joblevels:[],
      politicsstatus:[],
      positions:[],
      popVisible: false,
      allDeps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      inputDepName: '',
      tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      emp:{
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: null,
        conversionTime: '',
        notWorkDate: null,
        beginContract: '',
        endContract: '',
        workAge: null,
        salaryId: null,
        salary: null
      },
      rules: {
        name: [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
        gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '身份证号码格式不正确', trigger: 'blur'}],
        wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
        nationId: [{required: true, message: '请输入民族', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
        address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
        departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
        jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
        posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
        engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
        tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
        specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
        school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
        beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
        workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
        workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
        contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
        conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
        notWorkDate: [{required: true, message: '请输入离职日期', trigger: 'blur'}],
        beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
        endContract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
        workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}],
      },
    }
  },
  methods:{
    doAddEmp() {
      this.$refs['empForm'].validate(valid => {
        if (valid) {
          this.postRequest('/employee/basic/', this.emp).then(resp => {
            if (resp) {
              this.dialogVisible = false;
              this.initEmps();
            }
          })
        }
      })
    },
    handleNodeClick(data) {
      this.inputDepName = data.name;
      this.emp.departmentId = data.id;
      this.popVisible = !this.popVisible;
    },
    showDepView() {
      this.popVisible = !this.popVisible;
    },
    getMaxWorkID() {
      this.getRequest('/employee/basic/maxWorkID').then(resp => {
        if (resp) {
          this.emp.workID = resp.obj;
        }
      })
    },
    initPositions(){
      this.getRequest("/employee/basic/positions").then(resp=>{
        if(resp){
          this.positions = resp;
        }
      })
    },
    initData(){
      if(!window.sessionStorage.getItem("nations")){
        this.getRequest("/employee/basic/nations").then(resp=>{
          if(resp){
            this.nations = resp;
            window.sessionStorage.setItem("nations",JSON.stringify(resp));
          }
        })
      }else{
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      if(!window.sessionStorage.getItem("joblevels")){
        this.getRequest("/employee/basic/joblevels").then(resp=>{
          if(resp){
            this.joblevels = resp;
            window.sessionStorage.setItem("joblevels",JSON.stringify(resp));
          }
        })
      }else{
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
      if(!window.sessionStorage.getItem("politicsstatus")){
        this.getRequest("/employee/basic/politicsstatus").then(resp=>{
          if(resp){
            this.politicsstatus = resp;
            window.sessionStorage.setItem("politicsstatus",JSON.stringify(resp));
          }
        })
      }else{
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
      }
      if (!window.sessionStorage.getItem("allDeps")) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("allDeps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("allDeps"));
      }
    },
    showAddEmpView(){
      this.dialogVisible = true;
      this.getMaxWorkID();
      this.initPositions();
    },
    //分页大小
    sizeChange(size){
      this.size = size;
      this.initEmps()
    },
    //切换页面显示数据
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initEmps();
    },
    //初始化员工列表，获取对应所有分页的员工数据
    initEmps(){
      this.loading = true;
      this.getRequest("/employee/basic/?currentPage="+this.currentPage+"&size="+this.size+"&name="+this.empName).then(resp=>{
        this.loading =false;
        if(resp){
          this.emps = resp.data;
          this.total = resp.total;
        }
      })
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
  },
}
</script>

<style scoped>

</style>