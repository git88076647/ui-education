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
      <el-form-item label="语义模型id" prop="pkSemantic">
        <el-input
          v-model="queryParams.pkSemantic"
          placeholder="请输入语义模型id"
          clearable
          @keyup.enter.native="handleQuery" :disabled="disablePkSemanticEdit"
        />
      </el-form-item>
      <el-form-item label="参数值" prop="valuestr">
        <el-input
          v-model="queryParams.valuestr"
          placeholder="请输入参数文本，比如 如果是固定的字符参数啥的 就是值"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
      <el-form-item label="参数类型" prop="javatype">
        <el-select v-model="queryParams.javatype" placeholder="请选择参数的java类型class全名" clearable>
          <el-option label="请选择字典生成" value/>
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
          v-hasPermi="['rep:semparmar:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['rep:semparmar:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['rep:semparmar:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['rep:semparmar:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <!-- 隐藏 显示查询面板 -->
        <el-button
          v-show="!showQueryForm"
          icon="el-icon-arrow-down"
          size="mini"
          @click="showQueryForm = !showQueryForm"
          v-hasPermi="['rep:semparmar:query']"
        ></el-button>
        <el-button
          v-show="showQueryForm"
          icon="el-icon-arrow-up"
          size="mini"
          @click="showQueryForm = !showQueryForm"
          v-hasPermi="['rep:semparmar:query']"
        ></el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="semparmarList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!-- <el-table-column label="表id" align="center" prop="pkSemparmar"/> -->
      <el-table-column label="编码" align="center" prop="code"/>
      <el-table-column label="名字" align="center" prop="name"/>
      <el-table-column label="语义模型id" align="center" prop="pkSemantic"/>
      <el-table-column label="备注" align="center" prop="description"/>
      <el-table-column label="状态" align="center" prop="statue"/>
      <el-table-column label="组织id" align="center" prop="orgId"/>
      <el-table-column label="参数类型" align="center" prop="javatype"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['rep:semparmar:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['rep:semparmar:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改语义模型参数对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="620px" :close-on-click-modal="false"
      :modal="!disablePkSemanticEdit">
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"/>
        </el-form-item>
        <el-form-item label="语义模型id" prop="pkSemantic">
          <el-input v-model="form.pkSemantic" placeholder="请输入语义模型id" :disabled="disablePkSemanticEdit"/>
        </el-form-item>
        <el-form-item label="参数值" prop="valuestr">
          <el-input v-model="form.valuestr" placeholder="请输入参数文本，比如 如果是固定的字符参数啥的 就是值"/>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号-乐观锁"/>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item label="删除标志" prop="dr">
          <el-input v-model="form.dr" placeholder="请输入删除标志"/>
        </el-form-item>
        <el-form-item label="状态" prop="statue">
          <el-input v-model="form.statue" placeholder="请输入状态"/>
        </el-form-item>
        <el-form-item label="组织id" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入组织id"/>
        </el-form-item>
        <el-form-item label="参数类型">
          <el-select v-model="form.javatype" placeholder="请选择参数的java类型class全名">
            <el-option label="请选择字典生成" value/>
          </el-select>
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
    listSemparmar,
    getSemparmar,
    delSemparmar,
    addSemparmar,
    updateSemparmar,
    exportSemparmar
  } from "@/api/rep/semparmar";

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
        // 语义模型参数表格数据
        semparmarList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pkSemparmar: undefined,
          pageNum: 1,
          pageSize: 10,
          code: undefined,
          name: undefined,
          pkSemantic: undefined,
          valuestr: undefined,
          def1: undefined,
          def2: undefined,
          def3: undefined,
          def4: undefined,
          def5: undefined,
          description: undefined,
          statue: undefined,
          orgId: undefined,
          javatype: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          code: [{required: true, message: "编码不能为空", trigger: "blur"}],
          name: [{required: true, message: "名字不能为空", trigger: "blur"}],
          pkSemantic: [{required: true, message: "所属语义模型不能为空", trigger: "blur"}]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询语义模型参数列表 */
      getList() {
        this.loading = true;
        if(this.semanticId){
          this.queryParams.pkSemantic = this.semanticId;
        }

        listSemparmar(this.queryParams).then(response => {
          this.semparmarList = response.rows;
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
          pkSemparmar: undefined,
          code: undefined,
          name: undefined,
          pkSemantic: undefined,
          valuestr: undefined,
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
          javatype: undefined
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
        this.ids = selection.map(item => item.pkSemparmar);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();

        if(this.semanticId){
          this.form.pkSemantic = this.semanticId;
        }

        this.open = true;
        this.title = "添加语义模型参数";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const pkSemparmar = row.pkSemparmar || this.ids;
        getSemparmar(pkSemparmar).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改语义模型参数";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {

            if(this.semanticId){
              this.form.pkSemantic = this.semanticId;
            }

            if (this.form.pkSemparmar != undefined) {
              updateSemparmar(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addSemparmar(this.form).then(response => {
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
        const pkSemparmars = row.pkSemparmar || this.ids;
        this.$confirm(
          '是否确认删除语义模型参数编号为"' + pkSemparmars + '"的数据项?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(function () {
            return delSemparmar(pkSemparmars);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(function () {
          });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出所有语义模型参数数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function () {
            return exportSemparmar(queryParams);
          })
          .then(response => {
            this.download(response.msg);
          })
          .catch(function () {
          });
      }
    },
    props: {
      //语义模型id
      semanticId: {
        type: String
      },
      // 是否 是被其他组件引用 设定了 固定的语义模型id的
      disablePkSemanticEdit: false
    }
  };
</script>
