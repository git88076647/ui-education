<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="锁ID" prop="key">
        <el-input
          v-model="queryParams.key"
          placeholder="请输入锁ID"
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
          type="danger"
          icon="el-icon-unlock"
          size="mini"
          :disabled="multiple"
          @click="handleRelease"
          v-hasPermi="['system:distributedLock:release']"
        >释放锁</el-button>
      </el-col>
      
    </el-row>

    <el-table v-loading="loading" :data="lockList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="锁ID" align="center" prop="lockKey" />
      <el-table-column label="值" align="center" prop="lockValue" />
      
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope" >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-unlock"
            @click="handleRelease(scope.row)"
            v-hasPermi="['system:distributedLock:release']"
          >释放锁</el-button>
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
 
  </div>
</template>

<script>
import { listLock, releaseLock } from "@/api/monitor/distributedLock";

export default {
   name: "Lock",
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
      // 总条数
      total: 0,
      // 文件管理表格数据
      lockList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        key: undefined,
        
      },
      // 表单参数
      form: {},
      // 表单校验
     
    };
  },
  created() {
    // this.getList();
    this.loading = false;
  },
  methods: {
    /** 查询文件管理列表 */
    getList() {
      this.loading = true;
      listLock(this.queryParams).then(response => {
        this.lockList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      this.ids = selection.map(item => item.lockKey)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    
    /** 删除按钮操作 */
    handleRelease(row) {
      const lockIds = row.lockKey || this.ids;
      this.$confirm('是否确认释放锁为"' + lockIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return releaseLock(lockIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
   
    
  }
 
};
</script>