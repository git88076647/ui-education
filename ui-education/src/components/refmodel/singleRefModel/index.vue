<template>
  <div class="ref-model">
    <!-- 参照模式 -->
    <ref-input
      v-model="inputValue"
      :item-id="selectedValue"
      :fetchData="queryData"
      :config="fieldProps"
      :options="suggestList"
      :loading="fetchDataLoading"
      :placeholder="placeholder"
      :mode="readOnly ? 'read' : 'edit'"
      :show-tags="multiple"
      @change="handleFetchSuggest"
      @detail="handleOpenDetail"
      @select="handleSelectSuggestItem"
      @update-selected="handleUpdateSelectedRow"
      @clear="handleClearInput"
    ></ref-input>
    <!-- 参照详情弹框 -->
    <el-dialog
      class="ref-detail"
      :visible="detailVisible"
      width="70%"
      :title="title"
      append-to-body
      @close="handleCancelSelected"
    >
      <ref-tool-bar
        :table-type="tableType"
        :options="fieldOptions"
        :searchValue="searchValue"
        :defaultField="defaultSearchField"
        :showStopData="stopDataCheckbox"
        @search="handleSearch"
      ></ref-tool-bar>
      <ref-table
        :type="tableType"
        :columns="columns"
        :data="tableList"
        :total="total"
        :height="tableHeight"
        :config="fieldProps"
        :loading="fetchDataLoading"
        :selectedRow="selectedRow"
        :selectedValue="selectedValue"
        @select-change="handleSelectedChange"
      ></ref-table>
      <ref-pagination
        v-show="tableType !== 'check'"
        :total="total"
        @pagination="handleChangeDataList"
      ></ref-pagination>
      <template slot="footer">
        <ref-footer
          :table-type="tableType"
          :selected="selectedRow.length"
          @confirm="handleCheckSelected"
          @cancel="handleCancelSelected"
          @show-selected="handleShowSelected"
        ></ref-footer>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import RefInput from './components/input';
import RefToolBar from './components/tool';
import RefTable from './components/table';
import RefPagination from './components/pagination';
import RefFooter from './components/footer';

import { debounce } from 'lodash';
import { getTableType, fetchRefList } from './utils';
import { putRefData } from '../utils';

export default {
  name: 'SingleRefModel',
  components: { RefInput, RefToolBar, RefTable, RefPagination, RefFooter },
  props: {
    /** 受控的选中值 */
    value: [String, Number, Array],
    /** 参照显示列 */
    columns: {
      type: Array,
      default: () => [],
    },
    /** 下拉列表 */
    fieldOptions: {
      type: Array,
      default: () => [],
    },
    /** 输入框提示 */
    placeholder: {
      type: String,
      default: '请输入搜索内容',
    },
    /** 字段名配置 */
    defaultProps: {
      type: Object,
      default: () => ({}),
    },
    /** 默认的搜索字段 */
    defaultSearchField: String,
    /** 参照资源请求额外参数 */
    extraParams: Object,
    /** 参照数据请求方法 */
    queryData: Function,
    /** 弹出弹框的标题 */
    title: {
      type: String,
      default: '参照选择',
    },
    /** 弹出弹框table的加载中提示语句 */
    tabelLoadingText: {
      type: String,
      default: '正在搜索...',
    },
    /** 弹出弹框搜索按钮显示的名字 */
    searchBtnText: {
      type: String,
      default: '搜索',
    },
    /** 是否可编辑 */
    disabled: Boolean,
    /** 是否显示停用数据切换按钮 */
    stopDataCheckbox: {
      type: Boolean,
      default: false,
    },
    /** 允许多选 */
    multiple: {
      type: Boolean,
      default: false,
    },
    /** 只读模式 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    clearValue: {
      type: String,
      default: '0',
    },
  },
  computed: {
    tableHeight() {
      return this.tableType === 'check' ? '60vh' : '53vh';
    },
    fieldProps() {
      const defaultProps = { data: 'rows', total: 'total', value: 'id', label: 'name' };
      return { ...defaultProps, ...this.defaultProps };
    },
  },
  watch: {
    value: {
      handler(value) {
        if (Array.isArray(value)) {
          // 过滤到空值
          this.selectedValue = value.filter(
            item => item !== this.clearValue || item !== undefined || item !== '',
          );
          return true;
        }
        // 外部清空操作
        if (value === this.clearValue || value === undefined || value === '') {
          this.inputValue = undefined;
          this.selectedRow = [];
          this.selectedValue = [];
          return true;
        }
        this.selectedValue = [value];
        return true;
      },
      immediate: true,
    },
  },
  data() {
    return {
      inputValue: undefined,
      detailVisible: false,
      currentQueryParams: {},
      currentPagination: {},
      searchValue: undefined,
      suggestList: [],
      tableList: [],
      total: undefined,
      selectedRow: [],
      selectedValue: [],
      confirmSelected: [],
      fetchDataLoading: false,
      tableType: getTableType(this.multiple),
    };
  },
  methods: {
    /** 打开详情对话框 */
    handleOpenDetail() {
      this.detailVisible = true;
    },
    /** 搜索防抖 */
    debounceFetchData: debounce(async function(params) {
      const data = await fetchRefList(params, this.queryData, this.fieldProps);
      this.suggestList = data.list;
      this.total = data.total;
      // 设置表格显示数据
      this.tableList = data.list;
      // 移除搜索状态
      this.fetchDataLoading = false;
      // 缓存搜索结果，用于 id 翻译
      putRefData(data.list, this.queryData, this.fieldProps.value);
    }, 500),
    /** 更新选择项 */
    handleUpdateSelectedRow(items) {
      // 只有当选择项为空时进行更新
      if (this.selectedRow.length === 0) {
        this.selectedRow = items;
      }
    },
    /** 选择建议项目 */
    handleSelectSuggestItem(items) {
      const valueName = this.fieldProps.value;
      const labelName = this.fieldProps.label;
      const values = items.map(item => item[valueName]);
      const labels = items.map(item => item[labelName]);
      const currentValue = this.multiple ? values : values[0] || this.clearValue;
      const currentLabel = this.multiple ? labels.join(';') : labels[0];
      this.inputValue = currentLabel;
      this.$emit('input', currentValue);
      this.$emit('change', items);
      this.selectedRow = items;
      this.selectedValue = values;
    },
    /** 清空选择项 */
    handleClearInput() {
      this.selectedRow = [];
      this.selectedValue = [];
      const defaultEmptyValue = this.multiple ? [] : this.clearValue;
      this.$emit('input', defaultEmptyValue);
      this.$emit('change', undefined);
    },
    /** 获取建议列表 */
    handleFetchSuggest(searchValue) {
      // 空值不搜索
      if (searchValue === undefined || searchValue === '') {
        return false;
      }
      // 如果字符串中包含分号
      this.fetchDataLoading = true;
      this.searchValue = searchValue;
      const queryParams = {
        ...this.extraParams,
        [this.defaultSearchField]: searchValue,
        status: '0',
        pageNum: 1,
        pageSize: 10,
      };
      this.debounceFetchData(queryParams);
      return true;
    },
    /** 搜索参照列表 */
    handleSearch(params) {
      this.fetchDataLoading = true;
      this.currentQueryParams = params;
      const queryParams = {
        ...params,
        ...this.extraParams,
        pageNum: 1,
        pageSize: this.currentPagination.pageSize || 10,
      };
      this.debounceFetchData(queryParams);
    },
    /** 更改参照列表分页显示 */
    handleChangeDataList(pagination) {
      this.fetchDataLoading = true;
      this.currentPagination = pagination;
      const queryParams = {
        ...this.currentQueryParams,
        ...this.extraParams,
        ...pagination,
      };
      this.debounceFetchData(queryParams);
    },
    /** 表格选择内容更改 */
    handleSelectedChange(selection) {
      this.selectedRow = selection;
      this.selectedValue = selection.map(item => item[this.fieldProps.value]);
      // 如果当前表格为 check 模式，同步更新表格显示内容
      if (this.tableType === 'check') {
        this.tableList = selection;
      }
    },
    /** 确认选择内容 */
    handleCheckSelected() {
      // 没有选择内容时，提示选择内容
      if (this.selectedRow.length === 0) {
        this.$message.warning('请选择内容');
        return true;
      }
      // 确认操作时，还原弹出框常规显示模式
      this.handleShowSelected(false);
      this.confirmSelected = this.selectedRow;
      // 关闭弹窗，更新数据
      this.detailVisible = false;
      if (this.multiple) {
        this.inputValue = this.selectedRow.map(item => item[this.fieldProps.label]).join(';');
        this.$emit('input', this.selectedValue);
        this.$emit('change', this.selectedRow);
      } else {
        const value = this.selectedValue[0];
        const item = this.selectedRow[0];
        this.inputValue = item[this.fieldProps.label];
        this.$emit('input', value);
        this.$emit('change', item);
      }
      return true;
    },
    /** 取消选择内容 */
    handleCancelSelected() {
      this.detailVisible = false;
      // 还原显示
      this.handleShowSelected(false);
      this.selectedRow = this.confirmSelected;
      this.selectedValue = this.confirmSelected.map(item => item[this.fieldProps.value]);
    },
    /** 查看选择内容 */
    handleShowSelected(checkSelected) {
      if (checkSelected) {
        this.tableType = 'check';
        this.tableList = this.selectedRow;
      } else {
        this.tableType = getTableType(this.multiple);
        this.tableList = this.suggestList;
      }
    },
  },
};
</script>

<style lang="scss">
.ref-model {
  display: inline-block;
}

.ref-detail {
  .el-dialog__body {
    padding: 5px 20px;
  }
}
</style>
