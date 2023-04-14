<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--应用数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <div class="tac mb5">应用列表</div>
          <div class="link-top"></div>
        </div>
        <div class="head-container mt5">
          <el-tree
            :data="appsOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            node-key="id"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <span slot-scope="{node, data}">
              <el-badge :value="node.data.badge" type="primary">
                <el-tooltip
                  :content="node.label + '(' + node.data.badge + ')'"
                  placement="top-end"
                  effect="dark"
                >
                  <span>{{node.label}}</span>
                </el-tooltip>
              </el-badge>
            </span>
          </el-tree>
        </div>
      </el-col>

      <!--应用数据-->
      <el-col :span="20" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              :disabled="multiple"
              @click="handleUp"
              v-hasPermi="['monitor:apps:status']"
            >上线</el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDown"
              v-hasPermi="['monitor:apps:status']"
            >下线</el-button>
          </el-col>

          <el-table
            v-loading="loading"
            :data="instanceList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="45" align="center" />

            <el-table-column label="应用名称" align="center" prop="app" />
            <el-table-column label="服务ID" align="center" width="200">
              <template slot-scope="scope">
                <router-link v-if="scope.row.app != 'ZUUL-SERVER' && scope.row.app != 'EUREKA-SERVER' " :to="'/monitor/server/' + scope.row.app + '/' + scope.row.instanceId" class="link-type">
                  <span>{{ scope.row.instanceId }}</span>
                </router-link>
                <span v-else>{{ scope.row.instanceId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="HOST" align="center" prop="hostName" width="120" />
            <el-table-column label="端口" align="center" prop="port.$" width="60" />
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-value="UP"
                  inactive-value="OUT_OF_SERVICE"
                  @change="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="注册时间" align="center" prop="registrationTimestamp" width="160">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.leaseInfo.registrationTimestamp) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" prop="lastRenewalTimestamp" width="160">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.leaseInfo.lastRenewalTimestamp) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="180"
              class-name="small-padding fixed-width"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-refresh"
                  @click="handleRefresh(scope.row)"
                  v-hasPermi="['monitor:apps:refresh']"
                >重注</el-button>
                <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-refresh"
                @click="handleReload(scope.row)"
                v-hasPermi="['monitor:apps:reload']"
                >重启</el-button>-->
                <el-button
                  v-if="scope.row.instanceId !== 1"
                  size="mini"
                  type="text"
                  icon="el-icon-switch-button"
                  @click="handleShutDown(scope.row)"
                  v-hasPermi="['monitor:apps:shutdown']"
                >停机</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag append-to-body :title="title" :visible.sync="open" width="620px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px"></el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  treeselect,
  listInstance,
  down,
  up,
  shutdown,
  reload,
  refresh
} from "@/api/monitor/apps";

export default {
  name: "Apps",
  components: {},
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
      // 应用实例数据
      instanceList: null,
      // 弹出层标题
      title: "",
      // 应用列表选项
      appsOptions: undefined,
      //选中组织
      selectAppId: undefined,
      // 是否显示弹出层
      open: false,

      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,

        appId: undefined
      },
      // 表单校验
      rules: {}
    };
  },
  watch: {},
  created() {
    this.getTreeselect();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      if (!this.selectAppId) {
        return;
      }
      this.loading = true;
      listInstance(this.selectAppId).then(response => {
        this.instanceList = response.data.application.instance;
        this.total = this.instanceList.length;
        this.loading = false;
      });
    },
    /** 查询应用树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.appsOptions = response.data;
        this.loading = false;
      });
    },

    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.appId = data.id;
      this.selectAppId = data.id;
      this.getList();
    },

    handleStatusChange(row) {
      const _this = this;
      const text = "UP" == row.status ? "上线" : "下线";
      this.$confirm(
        "确认要[" + text + "][" + row.instanceId + "]服务吗?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          _this.loading = true;
          if ("UP" == row.status) {
            return up(row.app, row.instanceId);
          } else {
            return down(row.app, row.instanceId);
          }
        })
        .then(() => {
          setTimeout(function() {
            _this.loading = false;
            _this.msgSuccess(text + "成功");
          }, 3500);
        })
        .catch(function() {
          //console.log('取消操作');
          //console.log(row.status);
          row.status = row.status === "UP" ? "OUT_OF_SERVICE" : "UP";
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
        appId: this.selectAppId
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.appId = undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.instanceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 下线按钮操作 */
    handleDown(row) {
      const instanceId = row.instanceId || this.ids;
      const _this = this;
      this.$confirm('是否确认下线为"' + instanceId + '"的服务?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          if (instanceId instanceof Array) {
            let ret;
            instanceId.forEach(function(item, index, arr) {
              console.log("下线：" + _this.selectAppId + "  " + item);
              ret = down(_this.selectAppId, item);
            });
            return ret;
          } else {
            return down(_this.selectAppId, instanceId);
          }
        })
        .then(() => {
          _this.loading = true;
          setTimeout(function() {
            _this.getList();
            _this.msgSuccess("下线成功");
          }, 3500);
        })
        .catch(function() {});
    },
    /** 上线线按钮操作 */
    handleUp(row) {
      const instanceId = row.instanceId || this.ids;
      const _this = this;
      this.$confirm('是否确认上线为"' + instanceId + '"的服务?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          if (instanceId instanceof Array) {
            let ret;
            instanceId.forEach(function(item, index, arr) {
              console.log("上线：" + _this.selectAppId + "  " + item);
              ret = up(_this.selectAppId, item);
            });
            return ret;
          } else {
            return up(_this.selectAppId, instanceId);
          }
        })
        .then(() => {
          _this.loading = true;
          setTimeout(function() {
            _this.getList();
            _this.msgSuccess("上线成功");
          }, 3500);
        })
        .catch(function() {});
    },
    /** 停机按钮操作 */
    handleShutDown(row) {
      const instanceId = row.instanceId || this.ids;
      const _this = this;
      this.$confirm('是否确认停机为"' + instanceId + '"的服务?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          if (instanceId instanceof Array) {
            let ret;
            instanceId.forEach(function(item, index, arr) {
              console.log("停机：" + _this.selectAppId + "  " + item);
              ret = shutdown(_this.selectAppId, item);
            });
            return ret;
          } else {
            return shutdown(_this.selectAppId, instanceId);
          }
        })
        .then(() => {
          _this.loading = true;
          setTimeout(function() {
            _this.getList();
            _this.msgSuccess("停机成功");
          }, 3500);
        })
        .catch(function() {});
    },
    /** 重启按钮操作 */
    handleReload(row) {
      this.msgSuccess("待实现");
      return;
      const instanceId = row.instanceId || this.ids;
      const _this = this;
      this.$confirm('是否确认重启为"' + instanceId + '"的服务?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          if (instanceId instanceof Array) {
            let ret;
            instanceId.forEach(function(item, index, arr) {
              console.log("重启：" + _this.selectAppId + "  " + item);
              _this.loading = true;
              ret = reload(_this.selectAppId, item);
            });
            return ret;
          } else {
            _this.loading = true;
            return reload(_this.selectAppId, instanceId);
          }
        })
        .then(() => {
          setTimeout(function() {
            _this.getList();
            _this.msgSuccess("重启成功");
          }, 3500);
        })
        .catch(function() {});
    },
    /** 重新注册按钮操作 */
    handleRefresh(row) {
      const instanceId = row.instanceId || this.ids;
      const _this = this;
      this.$confirm('是否确认重新注册为"' + instanceId + '"的服务?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          if (instanceId instanceof Array) {
            let ret;
            instanceId.forEach(function(item, index, arr) {
              console.log("重新注册：" + _this.selectAppId + "  " + item);
              _this.loading = true;
              ret = refresh(_this.selectAppId, item);
            });
            return ret;
          } else {
            _this.loading = true;
            return refresh(_this.selectAppId, instanceId);
          }
        })
        .then(() => {
          setTimeout(function() {
            _this.getList();
            _this.msgSuccess("重新注册成功");
          }, 3500);
        })
        .catch(function() {});
    }
  }
};
</script>