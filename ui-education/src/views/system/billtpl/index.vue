<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="模板" prop="billtplcode">
        <el-select
          v-model="queryParams.billtplcode"
          placeholder="请选择单据模板编码"
          clearable
          filterable
        >
          <el-option
            v-for="dict in billtplcodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="显示标题" prop="label">
        <el-input
          v-model="queryParams.label"
          placeholder="请输入显示标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段" prop="prop">
        <el-input
          v-model="queryParams.prop"
          placeholder="请输入字段"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="列表显示">
        <el-select
          v-model="queryParams.showList"
          placeholder="是否列表显示"
          clearable
        >
          <el-option
            v-for="dict in yesornoOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="卡片显示">
        <el-select
          v-model="queryParams.showCard"
          placeholder="是否卡片显示"
          clearable
        >
          <el-option
            v-for="dict in yesornoOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" ref="btnTool">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-sort"
          size="mini"
          @click="handleResort"
          v-hasPermi="['system:billtpl:edit']"
          >重排序</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:billtpl:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:billtpl:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:billtpl:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:billtpl:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      ref="dataTable"
      border
      resizable
      empty-text="暂无数据"
      :max-height="tableMaxHeight"
      v-loading="loading"
      :data="billtplList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="模板编码"
        align="center"
        prop="billtplcode"
      />
      <el-table-column
        label="模板名称"
        align="center"
        prop="billtplcode"
        :formatter="billtplcodeFormat"
      />
      <el-table-column label="排序" align="center" prop="sortindex" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="字段" align="center" prop="prop" />
      <el-table-column label="显示标题" align="center" prop="label" />
      <!-- <el-table-column
        label="查询条件"
        align="center"
        prop="query"
        :formatter="queryFormat"
      /> -->
      <el-table-column
        label="导出字段"
        align="center"
        prop="export"
        :formatter="exportFormat"
      />
      <el-table-column
        label="列表显示"
        align="center"
        prop="showList"
        :formatter="showListFormat"
      />
      <el-table-column
        label="卡片显示"
        align="center"
        prop="showCard"
        :formatter="showCardFormat"
      />

      <el-table-column
        label="对齐方式"
        align="center"
        prop="align"
        :formatter="alignFormat"
      />
      <el-table-column
        label="列固定"
        align="center"
        prop="fixed"
        :formatter="fixedFormat"
      />
      <el-table-column label="宽" align="center" prop="width" />
      <el-table-column label="最小宽" align="center" prop="minWidth" />
      <el-table-column label="最大宽" align="center" prop="maxWidth" />
      <el-table-column
        label="显示tooltip"
        width="95"
        align="center"
        prop="tooltip"
        :formatter="tooltipFormat"
      />
      <!-- <el-table-column label="格式化函数" width="95" align="center" prop="formatter" /> -->
      <!-- <el-table-column label="列模板" align="center" prop="tpl" /> -->

      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:billtpl:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:billtpl:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>

    </el-table>

    <pagination
      ref="pageTool"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改单据模板对话框 -->
    <el-dialog
      append-to-body
      :title="title"
      :visible.sync="open"
      width="620px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="单据模板">
          <el-select
            v-model="form.billtplcode"
            placeholder="请选择单据模板"
            disabled
          >
            <el-option
              v-for="dict in billtplcodeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sortindex">
          <el-input-number v-model="form.sortindex" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型" clearable>
            <el-option
              v-for="dict in columnTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段" prop="prop">
          <el-input v-model="form.prop" placeholder="请输入字段" />
        </el-form-item>
        <el-form-item label="显示标题" prop="label">
          <el-input v-model="form.label" placeholder="请输入类型" />
        </el-form-item>

        <el-form-item label="对齐方式">
          <el-select
            v-model="form.align"
            placeholder="请选择对齐方式"
            clearable
          >
            <el-option
              v-for="dict in alignOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="列固定">
          <el-select v-model="form.fixed" placeholder="请选择列固定" clearable>
            <el-option
              v-for="dict in fixedOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宽" prop="width">
          <el-input v-model="form.width" placeholder="请输入宽" />
        </el-form-item>
        <el-form-item label="最小宽" prop="minWidth">
          <el-input v-model="form.minWidth" placeholder="请输入最小宽" />
        </el-form-item>
        <el-form-item label="最大宽" prop="maxWidth">
          <el-input v-model="form.maxWidth" placeholder="请输入最大宽" />
        </el-form-item>
        <!-- <el-form-item label="格式化" prop="formatter">
          <el-input v-model="form.formatter" placeholder="请输入格式化函数" />
        </el-form-item> -->
        <!-- 空DIV占行剩余位置-->
        <div />
        <!-- <el-form-item label="列模板" prop="tpl">
          <el-input v-model="form.tpl" placeholder="请输入列模板" />
        </el-form-item> -->
        <el-form-item label="显示tip" prop="tooltip">
          <el-checkbox v-model="form.tooltip"></el-checkbox>
        </el-form-item>
        <el-form-item label="列表显示" prop="showList">
          <el-checkbox v-model="form.showList"></el-checkbox>
        </el-form-item>
        <el-form-item label="卡片显示" prop="showCard">
          <el-checkbox v-model="form.showCard"></el-checkbox>
        </el-form-item>
        <!-- 空DIV占行剩余位置-->
        <div />
        <!-- <el-form-item label="查询条件">
          <el-checkbox v-model="form.query"></el-checkbox>
        </el-form-item>
        <el-form-item label="默认查询条件">
          <el-checkbox v-model="form.defaultQuery"></el-checkbox>
        </el-form-item> -->
        <el-form-item label="导出字段" prop="export">
          <el-checkbox v-model="form.export"></el-checkbox>
        </el-form-item>

        <!-- 空DIV占行剩余位置-->
        <div />
        <el-form-item label="必填" prop="notNull">
          <el-checkbox v-model="form.notNull"
          @change="changeNotNull"
          ></el-checkbox>
        </el-form-item>
        <el-form-item label="虚字段" prop="virtual">
          <el-checkbox v-model="form.virtual"
          ></el-checkbox>
        </el-form-item>
        <!-- 空DIV占行剩余位置-->
        <div />
        <el-form-item label="规则" prop="rules" style="min-width: 520px;">
          <el-input :rows="10" style="min-width: 440px;" type="textarea" v-model="form.rules" placeholder="请输入规则JSON" />
        </el-form-item>
        <!-- 空DIV占行剩余位置-->
        <div />
        <el-form-item label="参照JSON" prop="refjson" style="min-width: 520px;">
          <el-input :rows="10" style="min-width: 440px;" type="textarea" v-model="form.refjson" placeholder="请输入参照JSON" />
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
  listBilltpl,
  getBilltpl,
  delBilltpl,
  addBilltpl,
  updateBilltpl,
  exportBilltpl,
  reSortBilltpl,
} from "@/api/system/billtpl";

export default {
  name: "Billtpl",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 单据模板表格数据
      billtplList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 单据模板编码字典
      billtplcodeOptions: [],
      // 对齐方式(left,center,right)字典
      alignOptions: [],
      // 列固定(true,left,right)字典
      fixedOptions: [],
      yesornoOptions: [
        {
          dictValue: true,
          dictLabel: "是",
        },
        {
          dictValue: false,
          dictLabel: "否",
        },
      ],
      // 列类型字典
      columnTypeOptions: [],
      tableMaxHeight: "100%",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        billtplcode: undefined,
        label: undefined,
        prop: undefined,
        showList: "",
        showCard: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  /** created 前执行*/
  beforeCreate() {},
  /** 监听*/
  watch: {},
  created() {
    this.getDicts("bill_tpl").then((response) => {
      this.billtplcodeOptions = response.data;
    });
    this.getDicts("sys_align").then((response) => {
      this.alignOptions = response.data;
    });
    this.getDicts("sys_fixed").then((response) => {
      this.fixedOptions = response.data;
    });
    this.getDicts("column_type").then((response) => {
      this.columnTypeOptions = response.data;
    });
  },
  /** 激活*/
  activated() {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.resizeHeight();
      })();
    };
  },
  methods: {
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
    },
    /** 查询单据模板列表 */
    getList() {
      if (!this.queryParams.billtplcode) {
        this.msgError("未选择模板");
        return;
      }
      this.loading = true;
      listBilltpl(this.queryParams).then((response) => {
        this.billtplList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.resizeHeight();
      });
    },
    // 单据模板编码字典翻译
    billtplcodeFormat(row, column) {
      return this.selectDictLabel(this.billtplcodeOptions, row.billtplcode);
    },
    // 对齐方式(left,center,right)字典翻译
    alignFormat(row, column) {
      return this.selectDictLabel(this.alignOptions, row.align);
    },
    // 列固定(true,left,right)字典翻译
    fixedFormat(row, column) {
      return this.selectDictLabel(this.fixedOptions, row.fixed);
    },
    // 显示是否翻译
    queryFormat(row, column) {
      return row.query ? "是" : "否";
    },
    // 显示是否翻译
    exportFormat(row, column) {
      return row.export ? "是" : "否";
    },
    // 显示是否翻译
    showListFormat(row, column) {
      return row.showList ? "是" : "否";
    },
    // tooltip显示字典翻译
    tooltipFormat(row, column) {
      return row.tooltip ? "是" : "否";
    },
    // 卡片显示字典翻译
    showCardFormat(row, column) {
      return row.showCard ? "是" : "否";
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        billtplcode: this.queryParams.billtplcode,
        type: "text",
        label: undefined,
        align: "center",
        prop: undefined,
        fixed: undefined,
        width: undefined,
        minWidth: undefined,
        maxWidth: undefined,
        tooltip: false,
        formatter: undefined,
        query: undefined,
        defaultQuery: undefined,
        export: false,
        notNull: false,
        virtual: false,
        refjson: undefined,
        rules: undefined,
        tpl: undefined,
        showList: false,
        showCard: false,
        sortindex: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if (!this.queryParams.billtplcode) {
        this.msgError("未选择模板");
        return;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      if (!this.queryParams.billtplcode) {
        this.msgError("未选择模板");
        return;
      }
      this.reset();
      this.open = true;
      this.title = "添加单据模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBilltpl(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单据模板";
      });
    },
    /** 重排序按钮操作 */
    handleResort() {
      this.msgSuccess("开始重新排序");
      if (!this.queryParams.billtplcode) {
        this.msgError("请先选择模板");
        return;
      }
      this.loading = true;
      reSortBilltpl(this.queryParams).then((response) => {
        if (response.code === 200) {
          this.getList();
          this.msgSuccess("重排序成功");
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBilltpl(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addBilltpl(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除单据模板编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delBilltpl(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有单据模板数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportBilltpl(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 必填 */
    changeNotNull(newVal) {
      const notNullRules = '[{required:true,message:"必填",trigger:"blur"}]';
      if (newVal && (!this.form.rules || this.form.rules == '')) {
        this.form.rules = notNullRules;
      }
      if (!newVal && this.form.rules && this.form.rules == notNullRules) {
        this.form.rules = undefined;
      }
    },
  },
};
</script>
