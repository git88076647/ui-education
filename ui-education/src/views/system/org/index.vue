<template>
  <div class="app-container">
    <!-- 列表-->
    <div  v-show="!showCard">
      <el-form :inline="true">
        <el-form-item label="组织编码">
          <el-input
            v-model="queryParams.orgCode"
            placeholder="请输入组织编码"
            clearable
          
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="组织名称">
          <el-input
            v-model="queryParams.orgName"
            placeholder="请输入组织名称"
            clearable
          
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="组织状态" clearable >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >搜索</el-button>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:org:add']"
          >新增</el-button>
        </el-form-item>
      </el-form>
   
      <el-table
        v-loading="loading"
        :data="orgList"
        row-key="orgId"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
      <el-table-column prop="orgCode" label="组织编码" width="200" :show-overflow-tooltip="true" ></el-table-column>
        <el-table-column prop="orgName" label="组织名称" width="200" :show-overflow-tooltip="true" ></el-table-column>
        <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="200">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="fixed-width">
          <template slot-scope="scope">
            <el-button 
              size="mini" 
              type="text" 
              icon="el-icon-edit" 
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:org:edit']"
            >修改</el-button>
            <el-button 
              size="mini" 
              type="text" 
              icon="el-icon-plus" 
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:org:add']"
            >新增</el-button>
            <el-button
              v-if="scope.row.parentId != 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:org:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改组织对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="600px"> -->
    <!-- 卡片-->
    <div v-show="showCard">  
      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="80px">
        
            <el-form-item label="上级组织" prop="parentId">
              <el-cascader
              v-model="form.parentId"
              placeholder="请选择上级组织"
              :options="orgOptions"
              :show-all-levels='false'
              :props="{ checkStrictly: true,emitPath:false }"
              filterable
              clearable
              ></el-cascader>
            </el-form-item>
         
            <el-form-item label="组织编码" prop="orgCode">
              <el-input v-model="form.orgCode" placeholder="请输入组织编码" />
            </el-form-item>
         
            <el-form-item label="组织名称" prop="orgName">
              <el-input v-model="form.orgName" placeholder="请输入组织名称" />
            </el-form-item>
         
            <el-form-item label="组织简称" prop="orgShortName">
              <el-input v-model="form.orgShortName" placeholder="请输入组织简称" />
            </el-form-item>
         
            <el-form-item label="信用代码" prop="creditCode">
              <el-input v-model="form.creditCode" placeholder="社会统一信用代码" />
            </el-form-item>
          
            <el-form-item label="组织地址" prop="address">
              <el-input v-model="form.address" placeholder="组织地址" />
            </el-form-item>
         
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
        
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
         
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
         
            <el-form-item label="组织状态">
              <el-select v-model="form.status" placeholder="组织状态" clearable >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
         
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
      </el-form>
      <div slot="footer" class="el-dialog--center" >
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    <!-- </el-dialog> -->
  </div>
  </div>
</template>

<script>
import { listOrg, getOrg, treeselect, delOrg, addOrg, updateOrg } from "@/api/system/org";

export default {
  name: "Org",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      orgList: [],
      // 组织组织树选项
      orgOptions: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //显示卡片
      showCard:false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
	    orgCode: undefined,
        orgName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: false, message: "上级组织不能为空", trigger: "blur" }
        ],
		    orgCode: [
          { required: true, message: "组织编码不能为空", trigger: "blur" }
        ],
        orgName: [
          { required: true, message: "组织名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询组织列表 */
    getList() {
      // console.log('2222222');
      this.loading = true;
      listOrg(this.queryParams).then(response => {
        this.orgList = response.data;
        this.loading = false;
      });
    },
    /** 查询组织下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.orgOptions = response.data;
      });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        orgId: undefined,
        parentId: undefined,
		    orgCode: undefined,
        orgName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.orgId;
      }
      this.open = true;
      this.showCard=true;
      this.title = "添加组织";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getOrg(row.orgId).then(response => {
        this.form = response.data;
        this.open = true;
        this.showCard=true;
        this.title = "修改组织";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.orgId != undefined) {
            updateOrg(this.form).then(response => {
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
            addOrg(this.form).then(response => {
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
      this.$confirm('是否确认删除名称为"' + row.orgName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrg(row.orgId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>