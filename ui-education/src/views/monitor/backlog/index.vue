<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="日期">
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
	  <el-form-item label="搜索" prop="searchValue" >
        <el-input
          v-model="queryParams.searchValue"
          placeholder="请输入关键字"
          @keyup.enter.native="handleQuery"
          style='min-width:326.66px'
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="采集时间" align="center" prop="timestamp" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.timestamp) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息" align="left" prop="message" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="60">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
            v-hasPermi="['monitor:backlog:query']"
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

    <!-- 操作日志详情 -->
    <el-dialog v-dialogDrag append-to-body title="后台日志详情" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item label="采集源：">{{ form.source }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="索引：">{{ form.index }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分片：">{{ form.shard }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机：">{{ form.host }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采集时间：">{{ parseTime(form.timestamp) }}</el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="信息: ">{{ form.message }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-table .info-row {
  background: #f0f9eb;
}

.el-table .warn-row {
  background: oldlace;
}
.el-table .error-row {
  background: #f56c6c;
}
</style>

<script>
import { list } from "@/api/monitor/backlog";

export default {
  name: "Backlog",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: undefined
      }
    };
  },
  created() {
    this.resetQuery();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.message.includes("DEBUG")) {
        return "";
      } else if (row.message.includes("INFO")) {
        return "info-row";
      } else if (row.message.includes("WARN")) {
        return "warn-row";
      } else if (row.message.includes("ERROR")) {
        return "error-row";
      }
      return "";
    },
    /** 查询登录日志 */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange))
        .then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      let date = new Date();
      date.setDate(date.getDate() - 3);
      let beginDate = this.parseTime(date, "{y}-{m}-{d}");
      let currDate = this.parseTime(new Date(), "{y}-{m}-{d}");
      this.dateRange = [beginDate, currDate];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    }
  }
};
</script>

