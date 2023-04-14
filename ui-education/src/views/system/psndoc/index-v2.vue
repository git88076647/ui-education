
<template>

  <div class="app-container">
    <el-row :gutter="20" v-show='!showCard'>
      <!--部门数据-->
      <el-col :span="4" :xs="24">
	      
        <div class="head-container" style="margin-bottom:5px">
         
            <el-cascader
              v-model="queryParams.orgId"
              placeholder="请选择组织"
              :options="orgOptions"
              :show-all-levels='false'
              :props="{ checkStrictly: true,emitPath:false }"
              filterable
              clearable
              style="margin-bottom: 10px"
              ></el-cascader>
          
            <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
            
              prefix-icon="el-icon-search"
              style="margin-bottom: 10px"
            />
          <div v-loading.body="loading" class="lefttree">
            <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              default-expand-all
              @node-click="handleNodeClick"
            >
            </el-tree>
          </div>
          
        </div>
      
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" >

        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" v-if="showQuery">
          <el-form-item label="人员工号" prop="psnCode">
            <el-input
              v-model="queryParams.psnCode"
              placeholder="请输入人员工号"
              clearable
              
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="人员姓名" prop="psnName">
            <el-input
              v-model="queryParams.psnName"
              placeholder="请输入人员姓名"
              clearable
              
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <!-- <psnAvatar :psndoc="form" /> -->
          </el-form-item>
          <el-form-item label="人员状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择人员状态" clearable >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:psndoc:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:psndoc:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:psndoc:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:psndoc:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <!-- 显示查询面板 -->
            <el-button
              v-if="!showQuery"
              icon="el-icon-arrow-down"
              size="mini"
              @click="handleShowQuery"
              v-hasPermi="['system:psndoc:query']"
            ></el-button>
            <!-- 隐藏查询面板 -->
            <el-button
              v-if="showQuery"
              icon="el-icon-arrow-up"
              size="mini"
              @click="handleHideQuery"
              v-hasPermi="['system:psndoc:query']"
            ></el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="psndocList" @selection-change="handleSelectionChange" @sort-change="handleSortChange" @row-click="handleRowClick"  >
          <el-table-column type="selection" width="55" align="center" fixed='left' />
          <el-table-column label="人员姓名" align="center" prop="psnName" sortable='custom' />
          <el-table-column label="人员工号" align="center" prop="psnCode"  sortable='custom' />
          <el-table-column label="组织" align="center" prop="orgName" />
          <el-table-column label="部门" align="center" prop="deptName" sortable=custom />
          
          <el-table-column label="电子邮箱" align="center" prop="email" />
          <el-table-column label="手机号码" align="center" prop="phonenumber" />
          <el-table-column label="家庭电话" align="center" prop="homephone" />
          <el-table-column label="用户性别" align="center" prop="sex" :formatter="sexFormat" />
        
          <el-table-column label="人员状态" align="center" prop="status" :formatter="statusFormat" />
          <el-table-column label="地址" align="center" prop="address" />
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleCard(scope.row)"
                v-hasPermi="['system:psndoc:query']"
              >详情</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:psndoc:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:psndoc:remove']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
         <el-tabs v-model="activeName" >
          <el-tab-pane label="任职记录" name="jobs">
            <el-table v-loading="jobsLoading" :data="currJobs"  >
              <el-table-column label="组织" align="center" prop="orgIdName" />
              <el-table-column label="部门" align="center" prop="deptIdName" />
              <el-table-column label="岗位" align="center" prop="postIdName" />
              <el-table-column label="生效日期" align="center" prop="effecttime" width="120">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.effecttime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="失效日期" align="center" prop="invalidtime" width="120">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.invalidtime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" :formatter="statusFormat" width="60"></el-table-column>
              <el-table-column prop="mainjob" label="是否主职" :formatter="mainJobFormat" width="80"></el-table-column>

            </el-table>
          </el-tab-pane>
         </el-tabs>
        
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    
    </div>
  </div>
</template>

<script>
import { listPsndoc, getPsndoc, delPsndoc, addPsndoc, updatePsndoc, exportPsndoc,listPsnjobs } from "@/api/system/psndoc";
import { treeselect as orgTreeselect } from "@/api/system/org";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import psnAvatar from "./psnAvatar";

export default {
  name: "Psndoc",
  components: { psnAvatar},
  data() {
    return {
      // 遮罩层
      loading: true,
      jobsLoading: false,
      //选中tabs
      activeName: 'jobs',
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 人员管理表格数据
      psndocList: [],
      //当前选中人员的任职记录
      currJobs:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 用户性别字典
      sexOptions: [],
      // 人员状态字典
      statusOptions: [],
      // 是否主职字典
      mainJobOptions: [],
      // 所属组织
      orgOptions: [],
      // 部门
      deptOptions: [],
      //选中部门
      selectDeptId:undefined,
      // 树查询部门名称
      deptName: undefined,
      //显示查询面板
      showQuery:false,
      //卡片不可编辑
      cardDisabled:false,
      //显示卡片
      showCard:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: undefined,
        isAsc: 'asc',
        orgId: undefined,
        deptId: undefined,
        psnCode: undefined,
        psnName: undefined,
        status: undefined,
       
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        orgId: [
          { required: true, message: "组织不能为空", trigger: "blur" }
        ],        
        deptId: [
          { required: true, message: "部门不能为空", trigger: "blur" }
        ],        
        psnCode: [
          { required: true, message: "人员工号不能为空", trigger: "blur" }
        ],        
        psnName: [
          { required: true, message: "人员姓名不能为空", trigger: "blur" }
        ],      }
    };
  },
  watch: {
    // 根据名称筛选组织树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    'queryParams.orgId': {
      handler(newValue, oldValue) {
        this.refreshDeptTree();
        this.getList();
      },
      deep: true
     
    }
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("psn_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.mainJobOptions = response.data;
    });
    orgTreeselect().then(response => {
      this.orgOptions = response.data;
    });
 
  },
  methods: {
    handleSortChange(arg){
      // console.log(arg);
      this.queryParams.orderByColumn = arg.prop;
      this.queryParams.isAsc = ('ascending' == arg.order ? 'asc' :'desc');
      this.getList();
    },
    handleShowQuery(){
      this.showQuery=true;
    },
    handleHideQuery(){
      this.showQuery=false;
    },
    onPsnAvatarChange(arg){
      // console.log(arg);
      this.form.avatar=arg;
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
	    this.selectDeptId = data.id;
      this.getList();
    },
    // 刷新左侧部门树
    refreshDeptTree(){
      if((!this.queryParams.orgId || this.queryParams.orgId=='')){
        this.deptOptions = [];
      }else{
        deptTreeselect(this.queryParams.orgId).then(response => {
          this.deptOptions = response.data;
        });
      }
    },
    /** 查询人员管理列表 */
    getList() {
      this.loading = true;
      listPsndoc(this.queryParams).then(response => {
        this.psndocList = response.rows;
        if(this.psndocList && this.psndocList.length > 0){
          this.currJobs = this.psndocList[0].psnJobs;
        }
        this.total = response.total;
        this.loading = false;
      });
    },
    // 用户性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 人员状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
     // 是否主职字典翻译
    mainJobFormat(row, column) {
      return this.selectDictLabel(this.mainJobOptions, row.mainjob);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.showCard=false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        psnId: undefined,
        orgId: this.queryParams.orgId,
        deptId: this.selectDeptId,
        deptId1: undefined,
        deptId2: undefined,
        deptId3: undefined,
        psnCode: undefined,
        psnName: undefined,
        email: undefined,
        phonenumber: undefined,
        homephone: undefined,
        sex: undefined,
        avatar: undefined,
        status: "0",
        address: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.deptId=undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.psnId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      if(!this.queryParams.orgId || this.queryParams.orgId == ''){
         this.msgError("请先选择组织");
        return;
      }
      this.reset();
      this.open = true;
      this.showCard=true;
      this.cardDisabled=false;
      this.title = "新增人员";
    },
    /** 详情按钮操作 */
    handleCard(row) {
      this.reset();
      const psnId = row.psnId || this.ids
      this.$router.push({ path: "/system/psndocCard/"+psnId, query: {orgId: this.queryParams.orgId,deptId: this.selectDeptId,cardDisabled: true } });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      if(!this.queryParams.orgId || this.queryParams.orgId == ''){
        this.msgError("请先选择组织");
        return;
      }
      const psnId = row.psnId || this.ids
      this.$router.push({ path: "/system/psndocCard/"+psnId, query: {orgId: this.queryParams.orgId,deptId: this.selectDeptId,cardDisabled: false } });
     
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.psnId != undefined) {
            updatePsndoc(this.form).then(response => {
              if (response.code == 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.showCard=false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPsndoc(this.form).then(response => {
              if (response.code == 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.showCard=false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const psnIds = row.psnId || this.ids;
      this.$confirm('是否确认删除人员管理编号为"' + psnIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPsndoc(psnIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      if(!this.queryParams.orgId || this.queryParams.orgId == ''){
         this.msgError("请先选择组织");
        return;
      }
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出当前条件下的所有人员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPsndoc(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 点击人员 */
    handleRowClick(row, column, event){
      /** 多tabs时如果每个页签数据量很大，可以考虑点击具体页签的时候再加载页签数据 */
      // if(this.activeName == 'jobs'){
        if(row && !row.psnJobs){
          this.jobsLoading = true;
          listPsnjobs({psnId:row.psnId,tab:'jobs'}).then(response => {
                this.jobsLoading = false;
                if (response.code == 200) {
                  row.psnJobs = response.data;
                  this.currJobs = row.psnJobs;
                } 
              });
        }else{
          this.currJobs = row.psnJobs;
        }
      // }
     

    }
  }
};
</script>