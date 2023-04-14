<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      v-show="showQueryForm"
    >
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据源" prop="datasource">
        <el-input
          v-model="queryParams.datasource"
          placeholder="请输入数据源"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="格式JSON" prop="formatjson">
        <el-input
          v-model="queryParams.formatjson"
          placeholder="请输入前端格式化设计json对象"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="格式HTML" prop="formathtml">
        <el-input
          v-model="queryParams.formathtml"
          placeholder="请输入前端格式化设计生成的html内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 隐藏自定义项目前
      <el-form-item label="格式HTML" prop="def1">
        <el-input
          v-model="queryParams.def1"
          placeholder="请输入前端格式化设计生成的html内容"
          clearable
          
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="格式HTML" prop="def2">
        <el-input
          v-model="queryParams.def2"
          placeholder="请输入前端格式化设计生成的html内容"
          clearable
          
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="格式HTML" prop="def3">
        <el-input
          v-model="queryParams.def3"
          placeholder="请输入前端格式化设计生成的html内容"
          clearable
          
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="格式HTML" prop="def4">
        <el-input
          v-model="queryParams.def4"
          placeholder="请输入前端格式化设计生成的html内容"
          clearable
          
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="格式HTML" prop="def5">
        <el-input
          v-model="queryParams.def5"
          placeholder="请输入前端格式化设计生成的html内容"
          clearable
          
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      -->
      <el-form-item label="备注" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="statue">
        <el-input
          v-model="queryParams.statue"
          placeholder="请输入状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组织id" prop="orgId">
        <el-input
          v-model="queryParams.orgId"
          placeholder="请输入组织id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="查询类" prop="querclass">
        <el-input
          v-model="queryParams.querclass"
          placeholder="请输入数据查询实现类"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['rep:semantic:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['rep:semantic:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['rep:semantic:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['rep:semantic:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <!-- 隐藏 显示查询面板 -->
        <el-button
          v-show="!showQueryForm"
          icon="el-icon-arrow-down"
          size="mini"
          @click="showQueryForm = !showQueryForm"
          v-hasPermi="['rep:semantic:query']"
        ></el-button>
        <el-button
          v-show="showQueryForm"
          icon="el-icon-arrow-up"
          size="mini"
          @click="showQueryForm = !showQueryForm"
          v-hasPermi="['rep:semantic:query']"
        ></el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="semanticList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表id" align="center" prop="pkSemantic" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="名字" align="center" prop="name" />
      <el-table-column label="数据源" align="center" prop="datasource" />
      <el-table-column label="格式JSON" align="center" prop="formatjson" />
      <el-table-column label="格式HTML" align="center" prop="formathtml" />
      <!-- 隐藏自定义项目前
      <el-table-column label="格式HTML" align="center" prop="def1" />
      <el-table-column label="格式HTML" align="center" prop="def2" />
      <el-table-column label="格式HTML" align="center" prop="def3" />
      <el-table-column label="格式HTML" align="center" prop="def4" />
      <el-table-column label="格式HTML" align="center" prop="def5" />
      -->
      <el-table-column label="备注" align="center" prop="description" />
      <el-table-column label="状态" align="center" prop="statue" />
      <el-table-column label="组织id" align="center" prop="orgId" />
      <el-table-column label="查询类" align="center" prop="querclass" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['rep:semantic:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['rep:semantic:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改语义模型对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="620px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="数据源" prop="datasource">
          <el-input v-model="form.datasource" placeholder="请输入数据源" />
        </el-form-item>
        <el-form-item label="格式JSON" prop="formatjson">
          <el-input v-model="form.formatjson" placeholder="请输入前端格式化设计json对象" />
        </el-form-item>
        <el-form-item label="格式HTML" prop="formathtml">
          <el-input v-model="form.formathtml" placeholder="请输入前端格式化设计生成的html内容" />
        </el-form-item>
        <!-- 隐藏自定义项目前
        <el-form-item label="格式HTML" prop="def1">
          <el-input v-model="form.def1" placeholder="请输入前端格式化设计生成的html内容" />
        </el-form-item>
        <el-form-item label="格式HTML" prop="def2">
          <el-input v-model="form.def2" placeholder="请输入前端格式化设计生成的html内容" />
        </el-form-item>
        <el-form-item label="格式HTML" prop="def3">
          <el-input v-model="form.def3" placeholder="请输入前端格式化设计生成的html内容" />
        </el-form-item>
        <el-form-item label="格式HTML" prop="def4">
          <el-input v-model="form.def4" placeholder="请输入前端格式化设计生成的html内容" />
        </el-form-item>
        <el-form-item label="格式HTML" prop="def5">
          <el-input v-model="form.def5" placeholder="请输入前端格式化设计生成的html内容" />
        </el-form-item>
        -->
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号-乐观锁" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="删除标志" prop="dr">
          <el-input v-model="form.dr" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="状态" prop="statue">
          <el-input v-model="form.statue" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="组织id" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入组织id" />
        </el-form-item>
        <el-form-item label="查询类" prop="querclass">
          <el-input v-model="form.querclass" placeholder="请输入数据查询实现类" />
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
import {
  listSemantic,
  getSemantic,
  delSemantic,
  addSemantic,
  updateSemantic,
  exportSemantic
} from "@/api/rep/semantic";

export default {
  data() {
    return {
      //是否显示搜索界面
      showQueryForm: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 语义模型表格数据
      semanticList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: undefined,
        name: undefined,
        datasource: undefined,
        formatjson: undefined,
        formathtml: undefined,
        def1: undefined,
        def2: undefined,
        def3: undefined,
        def4: undefined,
        def5: undefined,
        description: undefined,
        statue: undefined,
        orgId: undefined,
        querclass: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
        name: [{ required: true, message: "名字不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询语义模型列表 */
    getList() {
      this.loading = true;
      listSemantic(this.queryParams).then(response => {
        this.semanticList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        pkSemantic: undefined,
        code: undefined,
        name: undefined,
        datasource: undefined,
        formatjson: undefined,
        formathtml: undefined,
        def1: undefined,
        def2: undefined,
        def3: undefined,
        def4: undefined,
        def5: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        version: undefined,
        description: undefined,
        dr: undefined,
        statue: undefined,
        orgId: undefined,
        querclass: undefined
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
      this.ids = selection.map(item => item.pkSemantic);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加语义模型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkSemantic = row.pkSemantic || this.ids;
      getSemantic(pkSemantic).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改语义模型";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkSemantic != undefined) {
            updateSemantic(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSemantic(this.form).then(response => {
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
      const pkSemantics = row.pkSemantic || this.ids;
      this.$confirm(
        '是否确认删除语义模型编号为"' + pkSemantics + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delSemantic(pkSemantics);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有语义模型数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportSemantic(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>