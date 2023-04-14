<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable>
          <el-option
            v-for="dict in jobGroupOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择执行状态" clearable>
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['dispatcher:joblog:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['dispatcher:operlog:clear']"
        >清空</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['dispatcher:joblog:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="joblogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务日志ID" align="center" prop="jobLogId" />
      <el-table-column label="任务名称" align="center" prop="jobName" />
      <el-table-column label="任务组名" align="center" prop="jobGroup" :formatter="jobGroupFormat" />
      <el-table-column label="调用目标" align="center" prop="invokeTarget" />
      <el-table-column label="日志信息" align="center" prop="jobMessage" />
      <el-table-column label="执行状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="异常信息" align="center" prop="exceptionInfo" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
            v-hasPermi="['dispatcher:joblog:query']"
          >详情</el-button>
         
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

    <!-- 添加或修改任务调度日志对话框 -->
    <el-dialog v-dialogDrag append-to-body :title="title" :visible.sync="open" width="620px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="80px" disabled=false>
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="form.jobName" />
        </el-form-item>
        <el-form-item label="任务组名">
          <el-select v-model="form.jobGroup" >
            <el-option
              v-for="dict in jobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态">
          <el-select v-model="form.status" >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调用目标" prop="invokeTarget">
          <el-input v-model="form.invokeTarget" type="textarea"  />
        </el-form-item>
        <el-form-item label="参数" prop="exeParams">
          <el-input v-model="form.exeParams" type="textarea" />
        </el-form-item>
        <el-form-item label="日志信息" prop="jobMessage">
          <el-input v-model="form.jobMessage" type="textarea" />
        </el-form-item>
        
        <el-form-item label="异常信息" prop="exceptionInfo">
          <el-input v-model="form.exceptionInfo" type="textarea"/>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listJoblog,
  getJoblog,
  delJoblog,
  addJoblog,
  updateJoblog,
  exportJoblog,
  cleanJoblog
} from "@/api/monitor/joblog";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      //整个页面loading
      fullscreenLoading : false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 任务调度日志表格数据
      joblogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 任务组名字典
      jobGroupOptions: [],
      // 执行状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        jobMessage: undefined,
        status: undefined,
        createTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        jobGroup: [
          { required: true, message: "任务组名不能为空", trigger: "blur" }
        ],
        invokeTarget: [
          { required: true, message: "调用目标字符串不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_job_group").then(response => {
      this.jobGroupOptions = response.data;
    });
    this.getDicts("sys_job_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询任务调度日志列表 */
    getList() {
      this.loading = true;
      listJoblog(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.joblogList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.jobGroup);
    },
    // 执行状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        jobLogId: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        jobMessage: undefined,
        status: undefined,
        exceptionInfo: undefined,
        createTime: undefined,
        version: undefined
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
      this.ids = selection.map(item => item.jobLogId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务调度日志";
    },
    /** 详情按钮操作 */
    handleView(row) {
      this.title = "查看任务调度日志详情";
      this.form = row;
      this.open = true;
    },
   
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobLogIds = row.jobLogId || this.ids;
      this.$confirm(
        '是否确认删除任务调度日志编号为"' + jobLogIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delJoblog(jobLogIds);
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
      this.$confirm("是否确认导出所有任务调度日志数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportJoblog(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    handleClean() {
      this.loading = true;
      this.$confirm("是否确认清空所有任务调度日志数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return cleanJoblog();
        })
        .then(response => {
          this.getList();
          this.msgSuccess("清空成功");
         
        })
        .catch(function() {});
    }
  }
};
</script>