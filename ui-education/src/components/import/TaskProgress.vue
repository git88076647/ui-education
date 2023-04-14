<template>
  <el-dialog
    append-to-body
    :title="title"
    :visible.sync="showDialog"
    width="60%"
  >
    <el-table
      ref="dataTable"
      v-loading="loading"
      :data="dataList"
      empty-text="暂无数据"
      v-show="!errorShow"

    >
      <el-table-column type="index" label="序号" align="center" fixed="left" />
      <el-table-column label="任务ID" align="center" prop="uuid" />
      <el-table-column label="方案" align="center" prop="schemeName" />
      <el-table-column label="文件名" align="center" prop="fileName" v-if="showFileName"/>
      <el-table-column label="终止" align="center" prop="stop" width="50" >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.stop?'X':'' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总数" align="center" prop="total" />
      <el-table-column label="成功数" align="center" prop="successCount" />
      <el-table-column label="失败数" align="center" prop="errorCount" />
      <el-table-column label="操作人" align="center" prop="operatorByName" />
      <el-table-column
        label="开始时间"
        align="center"
        prop="beginDate"
        width="150"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ parseTime(scope.row.beginDate) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="截至时间"
        align="center"
        prop="endDate"
        width="150"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ parseTime(scope.row.endDate) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            v-show="showError && scope.row.errorCount > 0"
            size="mini"
            type="text"
            icon="el-icon-warning"
            @click="handleErrorInfo(scope.row)"
            >错误</el-button
          >
          <el-button
            v-if="!scope.row.stop && !scope.row.endDate"
            size="mini"
            type="text"
            icon="el-icon-switch-button"
            @click="handleStopTask(scope.row)"
            v-hasPermi="['excel:task:stop']"
            >终止</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['excel:task:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 错误明细 -->
    <el-table
      :data="errorDetails"
      max-height="400"
      v-if="errorShow"
      class="details-table"
      border
      resizable
    >
      <template v-for="(item, index) in errorColumns">
        <el-table-column
          :key="index"
          :prop="item"
          :label="item"
          :width="item.length * 15 + 20"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </template>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button v-show="!errorShow" type="danger" @click="handleCleanFinish"
        >清空已完成</el-button
      >
      <el-button v-show="!errorShow" type="primary" @click="getList"
        >刷新</el-button
      >
      <el-button v-show="errorShow" type="info" @click="handleBackList"
        >返回</el-button
      >
      <el-button v-show="errorShow" type="primary" @click="handleDownload"
        >下载</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import {
  listTask,
  getTask,
  delTask,
  cleanFinish,
  errorDatas,
  stopTask,
} from "@/api/excel/import";
import XLSX from "xlsx";

export default {
  props: {
    showError:{
      type: Boolean,
      default: true,
    },
    // 过滤方案类型
    exectype: {
      type: String,
      default: "",
    },
    taskId: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      default: false,
    },
    title:{
      type:String,
      default:"进度",
    },
    showFileName:{
      type:Boolean,
      default: true,
    }
  },
  name: "TaskProgress",
  data() {
    return {
      loading: false,
      dataList: [],
      titleBak:undefined,
      timer: undefined,
      errorShow: false,
      errorDetails: [],
      errorColumns: [],
    };
  },
  /** created 前执行*/
  beforeCreate() {},
  /** 监听*/
  watch: {
    open(newVal, oldVal) {
      if (newVal) {
        console.log("定时器开始查询进度");
        this.getList();
        this.timer = setInterval(this.getList, 5000);
      } else {
        console.log("清除查询进度定时器");
        clearInterval(this.timer);
      }
    },
  },
  created() {},
  /** 激活*/
  activated() {},
  computed: {
    showDialog: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("update:open", val);
      },
    },
  },
  methods: {
    getList() {
      this.loading = true;
      listTask({ exectype: this.exectype }).then((response) => {
        this.dataList = response.rows;
        this.loading = false;
      });
    },
    /** 清空完成的任务 */
    handleCleanFinish() {
      this.loading = true;
      console.log("清空完成的任务：" + this.exectype);
      cleanFinish(this.exectype).then((response) => {
        this.loading = false;
        if (response.code == 200) {
          this.msgSuccess("操作成功");
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 停止导入任务 */
    handleStopTask(row) {
      stopTask(row.uuid).then((response) => {
        if (response.code == 200) {
          this.msgSuccess("操作成功");
          this.getList();
        }
      });
    },
    /** 错误 */
    handleErrorInfo(row) {
      this.loading = true;
      // errorDatasByES("import-task-faildata", { searchValue: row.uuid }).then(
      errorDatas({ uuid: row.uuid }).then((response) => {
        this.loading = false;
        if (response.code == 200) {
          console.log(response);
          this.msgSuccess("操作成功");
          if(!response.data || !response.header || response.data.length == 0 || response.header.length == 0){
              this.msgError("没有错误明细");
              return;
          }
          this.errorDetails = response.data;
          this.errorColumns = Object.values(response.header);
          this.errorShow = true;
          this.titleBak=this.title;
          this.title = "错误明细";

        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 返回进度列表 */
    handleBackList() {
      this.errorDetails = [];
      this.errorColumns = [];
      this.errorShow = false;
      this.title = this.titleBak;
    },
    /** 下载 */
    handleDownload() {
      const jsonData = this.errorDetails.map((item) => {
        const newItem = {};
        this.errorColumns.forEach((key) => {
          newItem[key] = item[key];
        });
        return newItem;
      });
      console.log(jsonData);
      const workbook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(jsonData);
      XLSX.utils.book_append_sheet(workbook, workSheet);
      XLSX.writeFile(workbook, "错误明细.xlsx");
    },
    /** 删除 */
    handleDelete(row) {
      this.loading = true;
      delTask(row.uuid).then((response) => {
        this.loading = false;
        if (response.code == 200) {
          this.msgSuccess("操作成功");
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
  },
};
</script>
