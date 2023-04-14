<template>
  <div class="app-container">
    <el-form v-if="showQuery" :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="搜索内容" prop="searchValue">
        <el-input
          v-model="queryParams.searchValue"
          placeholder="请输入模糊搜索内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row ref="btnTool" :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:bizconfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:bizconfig:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:bizconfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:bizconfig:export']"
        >导出</el-button>
      </el-col>
      <!-- 显示查询面板 -->
      <el-button
        v-if="!showQuery"
        icon="el-icon-arrow-down"
        size="mini"
        @click="handleShowQuery"
      ></el-button>
      <!-- 隐藏查询面板 -->
      <el-button
        v-if="showQuery"
        icon="el-icon-arrow-up"
        size="mini"
        @click="handleHideQuery"
      ></el-button>
    </el-row>

    <el-table ref="dataTable" 
    :max-height="tableMaxHeight" 
    v-loading="loading" 
    :data="bizconfigList" 
    @selection-change="handleSelectionChange"
    border resizable
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="键" align="center" prop="key" width="120"  show-overflow-tooltip/>
      <el-table-column label="值" align="center" prop="value" show-overflow-tooltip/>
      <el-table-column label="备注" align="center" prop="remark"  width="120" show-overflow-tooltip/>
      <el-table-column label="创建人"   align="center" prop="createByName" width="80" show-overflow-tooltip/>
      <el-table-column label="创建人"   align="center" prop="createByName" width="80" show-overflow-tooltip/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="100" show-overflow-tooltip/>
      <el-table-column label="修改人"   align="center" prop="updateByName" width="80" show-overflow-tooltip/>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="100" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:bizconfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:bizconfig:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      ref="pageTool"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改业务参数配置对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="620px" :close-on-click-modal=false>
      <el-form ref="form" :model="form"  :rules="rules" label-width="80px">
        <el-form-item label="键" prop="key" >
          <el-input v-model="form.key" placeholder="请输入键" 
          style="min-width: 440px;"
           />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="form.value" placeholder="请输入值" type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          style="min-width: 440px;"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea"
          :autosize="{ minRows: 2, maxRows: 5}"
          style="min-width: 440px;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBizconfig, getBizconfig, delBizconfig, addBizconfig, updateBizconfig, exportBizconfig } from "@/api/system/bizconfig";

export default {
  name: "Bizconfig",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      showQuery: false,
      // 总条数
      total: 0,
      // 业务参数配置表格数据
      bizconfigList: [],
      tableMaxHeight: "100%",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        //多选查询
        //单选查询
        searchValue: undefined,

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        value: [
          { required: true, message: "值不能为空", trigger: "blur" }
        ],        key: [
          { required: true, message: "键不能为空", trigger: "blur" }
        ]
        }
    };
  },
  /** created 前执行*/
  beforeCreate() {
  
  },
  /** 监听*/
  watch: {
  
  },
  created() {
    this.getList();
  },
  /** 激活*/
  activated() {
    
  },
  methods: {
    /** 查询业务参数配置列表 */
    getList() {
      this.loading = true;
      listBizconfig(this.queryParams).then(response => {
        this.bizconfigList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.resizeHeight();
      });
    },
   
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        value: undefined,
        key: undefined,
        version: undefined,
        updateTime: undefined,
        updateBy: undefined,
        createTime: undefined,
        createBy: undefined,
        id: undefined
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加业务参数配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBizconfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业务参数配置";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBizconfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addBizconfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
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
      const ids = row.id ? [row.id] : this.ids;
      this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBizconfig(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBizconfig(queryParams);
        }).then(response => {
        }).catch(function() {});
    },
    handleShowQuery() {
      this.showQuery = true;
      this.resizeHeight();
    },
    handleHideQuery() {
      this.showQuery = false;
      this.resizeHeight();
    },
    /**
     * 重置表格高度
     */
    resizeHeight() {
      let _this = this;
      this.$nextTick(() => {
        let tmp = document.documentElement.clientHeight - 139;
        if (_this.$refs.pageTool && _this.$refs.pageTool.$el) {
          tmp = tmp - _this.$refs.pageTool.$el.offsetHeight;
        }
        if (_this.$refs.btnTool && _this.$refs.btnTool.$el) {
          tmp = tmp - _this.$refs.btnTool.$el.offsetHeight;
        }
        if (_this.$refs.queryForm && _this.$refs.queryForm.$el) {
          tmp = tmp - _this.$refs.queryForm.$el.offsetHeight;
        }
        _this.tableMaxHeight = tmp;
      });
    }
  }
};
</script>