<template>
  <div class="ref-footer">
    <div class="left">
      <span v-show="tableType !== 'check'" class="selected-number" @click="handleShowSelectedData"
        >已选择 {{ selected }} 条数据</span
      >
      <el-button v-show="tableType === 'check'" @click="handleCloseSelectedData">返回</el-button>
    </div>
    <div class="right">
      <el-button @click="handleCancelSelected">取消</el-button>
      <el-button type="primary" @click="handleCheckSelected">确认</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RefFooter',
  props: {
    selected: {
      type: Number,
      default: 0,
    },
    multiple: Boolean,
    tableType: String,
  },
  data() {
    return {};
  },
  methods: {
    handleShowSelectedData() {
      this.$emit('show-selected', true);
    },
    handleCloseSelectedData() {
      this.$emit('show-selected', false);
    },
    handleCancelSelected() {
      this.$emit('cancel', void 0);
    },
    handleCheckSelected() {
      this.$emit('confirm', void 0);
    },
  },
};
</script>

<style lang="scss">
.ref-footer {
  display: flex;
  justify-content: space-between;

  .left {
    .selected-number {
      color: #ff6868;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
    }
  }
  .right {
    & > .el-button + .el-button {
      margin-left: 8px;
    }
  }
}
</style>
