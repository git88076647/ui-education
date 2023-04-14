<template>
  <div class="ref-pagination">
    <el-pagination
      :total="total"
      :current-page.sync="current"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 100, 300, 500]"
      @current-change="handleChangeCurrentPage"
      @size-change="hadnleChangePageSize"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'RefPagination',
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      current: 1,
      pageSize: 10,
    };
  },
  methods: {
    handleChangeCurrentPage(pageNum) {
      this.$emit('pagination', { pageNum, pageSize: this.pageSize });
    },
    hadnleChangePageSize(pageSize) {
      this.$emit('pagination', { pageNum: this.current, pageSize });
    },
  },
};
</script>

<style lang="scss">
.ref-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}
</style>
