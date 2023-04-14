<template>
  <el-table border :data="data" :height="height" v-loading="loading" @row-click="handleRowClick">
    <template v-for="(column, index) in currentColumns">
      <!-- 单选列 -->
      <el-table-column
        v-if="column.type === 'radio'"
        :key="index"
        label="选择"
        align="center"
        width="55"
      >
        <template slot-scope="{ row }">
          <el-radio v-model="selectedValue[0]" :label="row[config.value]"></el-radio>
        </template>
      </el-table-column>
      <!-- 多选列 -->
      <el-table-column
        v-else-if="column.type === 'selection'"
        :key="index"
        label="选择"
        align="center"
        width="55"
      >
        <template v-slot:header>
          <el-checkbox
            :value="checkAll"
            :indeterminate="indeterminate"
            @change="hangleToggleSelectAll"
          ></el-checkbox>
        </template>
        <template slot-scope="{ row }">
          <el-checkbox-group v-model="selectedValue" @change="handleRowClick(row)">
            <el-checkbox :label="row[config.value]"></el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        v-else-if="column.type === 'option'"
        :key="index"
        label="操作"
        align="center"
        width="55"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleDeleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
      <!-- 字段显示列 -->
      <el-table-column
        v-else
        :key="index"
        :prop="column.prop"
        :label="column.label"
        :min-width="minColumnWidth(column)"
        align="center"
      ></el-table-column>
    </template>
  </el-table>
</template>

<script>
import { concat, differenceBy, intersection, unionBy } from 'lodash';

export default {
  name: 'RefTable',
  props: {
    type: {
      type: String,
      default: 'single',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    config: Object,
    loading: {
      type: Boolean,
      default: false,
    },
    selectedRow: {
      type: Array,
      default: () => [],
    },
    selectedValue: {
      type: Array,
      default: () => [],
    },
    height: {
      type: [String, Number],
      default: '55vh',
    },
  },
  computed: {
    currentColumns() {
      let preColumn = [];
      if (this.type === 'single') {
        preColumn = [{ type: 'radio', with: '55' }];
      }
      if (this.type === 'multiple') {
        preColumn = [{ type: 'selection', with: '55' }];
      }
      let suffixColumn = [];
      if (this.type === 'check') {
        suffixColumn = [{ type: 'option', width: '55' }];
      }
      return concat(preColumn, this.columns, suffixColumn);
    },
    checkAll() {
      const valueName = this.config.value;
      const currentPageValues = this.data.map(item => item[valueName]);
      const intersecValues = intersection(this.selectedValue, currentPageValues);
      return currentPageValues.length !== 0 && intersecValues.length === currentPageValues.length;
    },
    indeterminate() {
      const valueName = this.config.value;
      const currentPageValues = this.data.map(item => item[valueName]);
      const intersecValues = intersection(this.selectedValue, currentPageValues);
      return intersecValues.length > 0 && intersecValues.length < currentPageValues.length;
    },
  },
  data() {
    return {
      confirmSelected: [],
    };
  },
  methods: {
    /** 计算表格列宽，最小 80 */
    minColumnWidth(column) {
      const defaultWidth = column.width || 80;
      const lableWidth = column.label.length * 15 + 20;
      return Math.max(defaultWidth, lableWidth);
    },
    /** 全选/全消事件 */
    hangleToggleSelectAll(checked) {
      const valueName = this.config.value;
      const newSelectedRow = checked
        ? unionBy(this.selectedRow, this.data, valueName)
        : differenceBy(this.selectedRow, this.data, valueName);
      this.$emit('select-change', newSelectedRow);
    },
    /** 表格行单击事件 */
    handleRowClick(row) {
      const valueName = this.config.value;
      // 单选表格
      if (this.type === 'single') {
        this.$emit('select-change', [row]);
      }
      // 多选表格
      if (this.type === 'multiple') {
        const currentValue = row[valueName];
        const newSelectedRow = this.selectedValue.includes(currentValue)
          ? this.selectedRow.filter(item => item[valueName] !== currentValue)
          : this.selectedRow.concat(row);
        this.$emit('select-change', newSelectedRow);
      }
    },
    /** 删除已选择内容 */
    handleDeleteRow(row) {
      const valueName = this.config.value;
      const currentValue = row[valueName];
      const newSelectedRow = this.selectedRow.filter(item => item[valueName] !== currentValue);
      this.$emit('select-change', newSelectedRow);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-checkbox__label,
::v-deep .el-radio__label {
  display: none;
}
</style>
