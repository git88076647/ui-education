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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
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
          v-hasPermi="['dispatcher:job:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['dispatcher:job:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['dispatcher:job:remove']"
        >删除</el-button>
      </el-col>
     
    </el-row>

    <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务ID" align="center" prop="jobId" />
      <el-table-column label="任务名称" align="center" prop="jobName" />
      <el-table-column label="任务组名" align="center" prop="jobGroup" :formatter="jobGroupFormat" />
      <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" />
      <el-table-column label="cron执行表达式" align="center" prop="cronExpression" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleRun(scope.row)"
            v-hasPermi="['dispatcher:job:run']"
          >执行一次</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['dispatcher:job:query']"
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

    <!-- 添加或修改定时任务调度对话框 -->
    <el-dialog v-dialogDrag append-to-body :title="title" :visible.sync="open" width="620px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="80px" :disabled="viewDisabled">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="form.jobName" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item label="任务组名">
          <el-select v-model="form.jobGroup" placeholder="请选择任务组名">
            <!-- class='el-input--100 el-select--100'-->
            <el-option
              v-for="dict in jobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调用目标字符串" prop="invokeTarget">
          <el-input v-model="form.invokeTarget" type="textarea" placeholder="请输入内容" clearable />
        </el-form-item>

        <el-form-item label="cron执行表达式" prop="cronExpression">
          <el-autocomplete
            v-model="form.cronExpression"
            :fetch-suggestions="cronSuggestions"
            placeholder="请输入cron执行表达式"
            clearable
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="计划执行策略">
          <el-select v-model="form.misfirePolicy" placeholder="请选择计划执行策略">
            <el-option
              v-for="dict in misfirePolicyOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否并发执行">
          <el-select v-model="form.concurrent" placeholder="请选择是否并发执行">
            <el-option
              v-for="dict in concurrentOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <div :class="elStyle"> -->
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- </div> -->
        <el-row>
          <el-form-item label="参数" prop="exeParams" class="el-textarea-box">
            <el-input v-model="form.exeParams" type="textarea" placeholder="请输入内容" clearable />
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listJob,
  getJob,
  delJob,
  addJob,
  updateJob,
  runJob
} from "@/api/monitor/job";

export default {
  name: "Job",
  data() {
    return {
      //动态切换class
      elStyle: "el-style--11111", //动态变换这里就行了
      viewDisabled: false,
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
      // 定时任务调度表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 任务组名字典
      jobGroupOptions: [],
      // 计划执行策略字典
      misfirePolicyOptions: [],
      // 是否并发执行字典
      concurrentOptions: [],
      // 状态字典
      statusOptions: [],
      //cron默认,下面的默认值会从 字典里重新加载
      cronSuggestionsOptions: [
        { value: "0/10 * * * * ?" },
        { value: "0 0/10 * * * ?" },
        { value: "0 0 0/2 * * ?" },
        { value: "0 10 23 * * ?" }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined,
        remark: undefined
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
        ],
        cronExpression: [
          { required: true, message: "cron执行表达式不能为空", trigger: "blur" }
        ],
        misfirePolicy: [
          {
            required: true,
            message: "计划执行策略 不能为空",
            trigger: "blur"
          }
        ],
        concurrent: [
          {
            required: true,
            message: "是否并发执行 不能为空",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "状态 不能为空",
            trigger: "blur"
          }
        ],
        exeParams: [
          { required: true, message: "参数不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_job_group").then(response => {
      this.jobGroupOptions = response.data;
    });
    this.getDicts("sys_job_policy").then(response => {
      this.misfirePolicyOptions = response.data;
    });
    this.getDicts("sys_allow_forbidden").then(response => {
      this.concurrentOptions = response.data;
    });
    this.getDicts("sys_job_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_job_cron").then(response => {
      this.cronSuggestionsOptions = []
      response.data.forEach(item => {
        this.cronSuggestionsOptions.push({'value':item.dictValue})
      });
    });
    
  },
  methods: {
    cronSuggestions(queryString, cb) {
      var cronSuggestionsOptions = this.cronSuggestionsOptions;
      var results = queryString
        ? cronSuggestionsOptions.filter(this.createFilter(queryString))
        : cronSuggestionsOptions;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return cronSuggestionsOption => {
        return (
          cronSuggestionsOption.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    /** 查询定时任务调度列表 */
    getList() {
      this.loading = true;
      listJob(this.queryParams).then(response => {
        this.jobList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.jobGroup);
    },
    // 计划执行策略字典翻译
    misfirePolicyFormat(row, column) {
      return this.selectDictLabel(this.misfirePolicyOptions, row.misfirePolicy);
    },
    // 是否并发执行字典翻译
    concurrentFormat(row, column) {
      return this.selectDictLabel(this.concurrentOptions, row.concurrent);
    },
    // 状态字典翻译
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
        jobId: undefined,
        jobName: undefined,
        jobGroup: "DEFAULT",
        invokeTarget: "microServiceDefaultJobTask",
        cronExpression: "0 0/10 * * * ?",
        misfirePolicy: "3",
        concurrent: "1",
        status: "0",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        version: undefined,
        exeParams: undefined
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
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.viewDisabled=false;
      this.title = "添加定时任务调度";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const jobId = row.jobId || this.ids;
      getJob(jobId).then(response => {
        this.form = response.data;
        this.open = true;
        this.viewDisabled=false;
        this.title = "修改定时任务调度";
      });
    },
    /** 详情按钮操作 */
    handleView(row) {
      this.reset();
      const jobId = row.jobId || this.ids;
      getJob(jobId).then(response => {
        this.form = response.data;
        this.viewDisabled=true;
        this.open = true;
        this.title = "查看定时任务调度";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.jobId != undefined) {
            updateJob(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            
            });
          } else {
            addJob(this.form).then(response => {
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
      const jobIds = row.jobId || this.ids;
      this.$confirm(
        '是否确认删除定时任务调度编号为"' + jobIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delJob(jobIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 执行一次按钮操作 */
    handleRun(row) {
      const jobIds = row.jobId || this.ids;
      this.$confirm(
        '是否确认执行一次定时任务调度编号为"' + jobIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return runJob(jobIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("执行成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有定时任务调度数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportJob(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>