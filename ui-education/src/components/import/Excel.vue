<template>
  <el-dialog
    append-to-body
    title="导入Excel"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    width="500px"
  >
    <el-upload
      align="center"
      class="upload-demo"
      ref="upload"
      :limit="limit"
      :accept="accept"
      :action="action"
      :auto-upload="false"
      :data="importForm"
      :http-request="uploadFile"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

      <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过100MB</div>
    </el-upload>

    <div slot="footer" class="dialog-footer">
      <el-select
        v-model="importForm.schemeId"
        placeholder="选择方案"
        :filter-method="filterExecScheme"
        filterable
        clearable
      >
        <el-option
          v-for="dict in filterExecSchemeOptions"
          :key="dict.dictValue"
          :label="dict.dictLabel"
          :value="dict.dictValue"
        />
      </el-select>
      <el-button type="primary" @click="submitimport" :loading="btnStatus"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { refScheme } from "@/api/pubase/scheme";
import { addTask } from "@/api/excel/import";

export default {
  props: {
    // 过滤方案类型
    exectype: {
      type: String,
      default: "",
    },
    // 显示导入
    openimport: {
      type: Boolean,
      default: false,
    },
    // 显示进度
    openImportProgress: {
      type: Boolean,
      default: false,
    },
    // 最多选择文件
    limit: {
      typr: Number,
      default: 1,
    },
    // 文件扩展名
    accept: {
      type: String,
      default: ".xlsx,.xls",
    },
  },
  name: "ExcelImport",
  data() {
    return {
      action: "#",
      btnStatus: false,
      // 方案
      execSchemeOptions: [],
      // 过滤后方案
      filterExecSchemeOptions: [],
      //上传的业务参数
      importForm: {
        schemeId: undefined,
      },
    };
  },
  /** created 前执行*/
  beforeCreate() {},
  /** 监听*/
  watch: {
    openimport: function (newVal, oldVal) {
      this.btnStatus = false;
    },
  },
  created() {
    //初始化方案数据
    refScheme({ exectype: this.exectype }).then((response) => {
      this.execSchemeOptions = response.rows;
      this.filterExecSchemeOptions = this.execSchemeOptions;
      if (this.filterExecSchemeOptions && this.filterExecSchemeOptions.length == 1) {
        this.importForm.schemeId = this.filterExecSchemeOptions[0].dictValue;
      }
    });
  },
  /** 激活*/
  activated() {},
  computed: {
    showDialog: {
      get() {
        return this.openimport;
      },
      set(val) {
        this.$emit("update:openimport", val);
      },
    },
    showImportProgress: {
      get() {
        return this.openImportProgress;
      },
      set(val) {
        this.$emit("update:openImportProgress", val);
      },
    },
  },
  methods: {
    /** 上传文件 */
    submitimport() {
      this.$refs.upload.submit();
    },
    /** 上传文件 */
    uploadFile(param) {
      console.log("开始上传");
      this.btnStatus = true;
      const isLimit100M = param.file.size / 1024 / 1024 < 100;
      if (!isLimit100M) {
        this.msgError("上传文件大小不能超过 100MB");
        this.btnStatus = false;
        return;
      }
      if(!this.importForm.schemeId){
        this.msgError("请选择方案");
        this.btnStatus = false;
        return ;
      }
      let form = new FormData();
      form.append("file", param.file);
      form.append("schemeId", this.importForm.schemeId);
      addTask(form).then((response) => {
        this.btnStatus=false;
        if (response.code == 200) {
          this.msgSuccess(response.msg);
          this.showDialog = false;
          this.showImportProgress = true;
          this.$refs.upload.clearFiles();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /**
     * 过滤方案
     */
    filterExecScheme(str) {
      let _this = this;
      this.filterExecSchemeOptions = this.execSchemeOptions.filter(function (s) {
        return (
          s.exectype == _this.exectype && ((str && s.dictLabel.indexOf(str) > -1) || !str)
        );
      });
    },
  },
};
</script>
