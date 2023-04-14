<template>
  <el-dialog append-to-body :title="title" :visible.sync="showDialog" width="98%">
    <el-table
      ref="dataTable"
      v-loading="loading"
      :data="dataList"
      empty-text="暂无数据"
      height="65vh"
    >
      <el-table-column type="index" label="序号" align="center" fixed="left" />
      <el-table-column label="价格档案/政策" align="center" prop="type">
        <template slot-scope="scope">
          <div>
            <span>{{
              scope.row.type == '1' ? '价格档案' : scope.row.type == '2' ? '政策' : scope.row.type
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="typename" />
      <el-table-column label="公式" align="center" prop="typetext" min-width="160px">
        <template slot-scope="scope">
          <div>
            <span>{{
              scope.row.type == '1' ? Number(scope.row.typetext).toFixed(4) : scope.row.typetext
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="nmny">
        <template slot-scope="scope">
          <div>
            <span>{{ Number(scope.row.nmny).toFixed(4) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="公式ID" align="center" prop="typedataId" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.typedataId }}</span>
          <i v-if="row.typedataId" class="el-icon-view" @click="handleViewDetail(row)"></i>
        </template>
      </el-table-column>
      <!-- <el-table-column label="数据ID" align="center" prop="dataId"  min-width="100px"/> -->
      <el-table-column label="创建人" align="center" prop="createByName" min-width="90px" />
      <el-table-column label="创建时间" align="center" prop="beginDate" width="150">
        <template slot-scope="scope">
          <div>
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { listExeclog } from '@/api/calcu/execlog';

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '执行日志',
    },
    dataId: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      loading: false,
      dataList: [],
      titleBak: undefined,
    };
  },
  /** created 前执行*/
  beforeCreate() {},
  /** 监听*/
  watch: {
    open(newVal, oldVal) {
      if (newVal) {
        this.getList();
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
        this.$emit('update:open', val);
      },
    },
  },
  methods: {
    getList() {
      this.loading = true;
      listExeclog({ dataId: this.dataId }).then(response => {
        this.dataList = response.rows;
        this.loading = false;
      });
    },
    handleViewDetail(row) {
      const id = row.typedataId;
      const type = row.type;
      let openUrl;
      openUrl = type === '1' ? '/contrast/price' : openUrl;
      openUrl = type === '2' ? '/policymange/policy' : openUrl;
      if (openUrl) {
        window.open(`${openUrl}?id=${id}`, '_blank');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-icon-view {
  color: #1870ff;
  cursor: pointer;
}
</style>
