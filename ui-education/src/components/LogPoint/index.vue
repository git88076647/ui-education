<template>

  <el-tooltip content="日志" effect="dark" placement="bottom">
    <div>
      <el-popover
        placement="left"
        width="500"
        trigger="click"
        @show="showLog"
        >
        <el-tabs v-model="activeName" :stretch=true >
          <el-tab-pane label="链式追踪" name="traceLog">
            <el-table :data="logsData" max-height="400" >
              <el-table-column width="50" type="index" label="序号"> </el-table-column>
              <el-table-column property="traceid" label="TraceID"></el-table-column>
              <el-table-column property="apmtraceid" label="APMTraceID"></el-table-column>
              <el-table-column property="ts" width='180' label="时间" >
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.ts) }}</span>
                </template>

              </el-table-column>
            </el-table>

          </el-tab-pane>
          <el-tab-pane label="操作日志" name="operLog" v-loading="operLogLoading">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
              <el-form-item label="操作日期"  prop="dateRange">
                <el-date-picker
                  v-model="dateRange"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryOperLog">搜索</el-button>
            </el-form>
            <el-table :data="operLogsData" max-height="400" >
              <el-table-column width="50" type="index" label="序号"> </el-table-column>
              <el-table-column label="TraceID" align="center" prop="traceid" />
              <el-table-column label="系统模块" align="center" prop="title" />
              <el-table-column label="操作类型" align="center" prop="businessType" :formatter="typeFormat" />
              <el-table-column label="主机" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
              <el-table-column label="操作地点" align="center" prop="operLocation" />
              <el-table-column label="操作状态" align="center" prop="status" :formatter="statusFormat" />
              <el-table-column label="操作日期" align="center" prop="operTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.operTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="登录日志" name="loginLog" v-loading="loginLogLoading">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
              <el-form-item label="登录日期"  prop="logindateRange">
                <el-date-picker
                  v-model="logindateRange"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryLoginLog">搜索</el-button>
            </el-form>
            <el-table :data="loginLogsData" max-height="400" >
              <el-table-column width="50" type="index" label="序号"> </el-table-column>
              <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
              <el-table-column label="登录地点" align="center" prop="loginLocation" />
              <el-table-column label="浏览器" align="center" prop="browser" />
              <el-table-column label="操作系统" align="center" prop="os" />
              <el-table-column label="登录状态" align="center" prop="status" :formatter="statusFormat" />
              <el-table-column label="操作信息" align="center" prop="msg" />
              <el-table-column label="登录日期" align="center" prop="loginTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.loginTime) }}</span>
                </template>
              </el-table-column>

            </el-table>
          </el-tab-pane>
          
        </el-tabs>

        
        <a  slot="reference" aria-hidden="true" class="fa fa-dot-circle-o" style="font-size: 18px;"></a>
      </el-popover>
    </div>
  </el-tooltip>
</template>

<script>
import {getAll as logGetAll} from '@/utils/logutils'
import {myList as loginLogList } from "@/api/monitor/logininfor";
import {myList as operLogList } from "@/api/monitor/operlog";

export default {
  name: 'LogPoint',
  data() {
    return {
      activeName: 'traceLog',
      operLogLoading : false,
      loginLogLoading : false,
      /** 链式追踪 */
      /** 链式追踪 */
      logsData:[],
      /** 操作日志 */
      operLogsData:[],
      /** 登录日志 */
      loginLogsData:[],
      // 类型数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {

      },
       // 日期范围
      dateRange: [],
       // 日期范围
      logindateRange: [],
      // 表单校验
      rules: {
        dateRange: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
        logindateRange: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
      }
    }
  },
  
  mounted() {
   
  },
  beforeDestroy() {
   
  },
  created() {
    let currDate = this.parseTime(new Date(),'{y}-{m}-{d}');
    this.dateRange = [currDate,currDate]
    this.logindateRange = [currDate,currDate]
    this.getDicts("sys_oper_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
   showLog() {
       this.logsData = logGetAll();
       this.activeName = 'traceLog';
    },
    
   
    // 操作日志状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.businessType);
    },
    handleQueryOperLog(){
      if(!this.dateRange || this.dateRange.length == 0 || !this.dateRange[0] || this.dateRange[0] == ''){
        this.msgError('日期必选！');
        return;
      }
      this.operLogLoading = true;
      operLogList(this.addDateRange(this.queryParams,this.dateRange)).then(
        response => {
          this.operLogsData = response.rows;
          this.operLogLoading = false;
        }
      ).catch(err => {
          this.operLogLoading = false;
      });

    },
    handleQueryLoginLog(){
      if(!this.logindateRange || this.logindateRange.length == 0 || !this.logindateRange[0] || this.logindateRange[0] == ''){
        this.msgError('日期必选！');
        return;
      }
      this.loginLogLoading = true;

      loginLogList(this.addDateRange(this.queryParams,this.logindateRange)).then(
        response => {
          this.loginLogsData = response.rows;
          this.loginLogLoading = false;
        }
      ).catch(err => {
          this.loginLogLoading = false;
      });

    },
    
  } ,
  
}
</script>
