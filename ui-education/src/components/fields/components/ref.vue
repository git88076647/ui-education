<script>
import refMap from './refMap';

export default {
  name: 'field-ref',
  props: {
    value: [String, Number, Array],
    /**
     * 配置的 queryData ，字符串形式会转化为对应的参照函数
     *
     * 参照函数map：./refMap.js
     */
    queryData: [Function, String],
    /**
     * id字段名称
     */
    idField: String,
    /**
     * label字段名称
     */
    labelField: String,
    /**
     * data字段名称
     */
    dataField: String,
    /**
     * 工作模式
     */
    mode: String,
    /**
     * 是否可编辑
     */
    disabled: Boolean,
    // ---------- 以下为 single-ref-model 字段透传 ----------
    /**
     * 参照显示列
     */
    columns: {
      type: Array,
      default: () => [],
    },
    /**
     * 下拉列表
     */
    fieldOptions: {
      type: Array,
      default: () => [],
    },
    /**
     * 输入框提示
     */
    placeholder: {
      type: String,
      default: '请输入搜索内容',
    },
    /**
     * 字段名配置
     */
    defaultProps: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 默认的搜索字段
     */
    defaultSearchField: String,
    /**
     * 参照资源请求额外参数
     */
    extraParams: Object,
    /**
     * 弹出弹框的标题
     */
    title: {
      type: String,
      default: '参照选择',
    },
    /**
     * 弹出弹框table的加载中提示语句
     */
    tabelLoadingText: {
      type: String,
      default: '正在搜索...',
    },
    /**
     * 弹出弹框搜索按钮显示的名字
     */
    searchBtnText: {
      type: String,
      default: '搜索',
    },
    /**
     * 是否显示停用数据切换按钮
     */
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
    clearValue: String,
  },
  computed: {
    queryDataMethod() {
      if (typeof this.queryData === 'string') {
        const refFunction = refMap[this.queryData];
        if (refFunction) {
          return refFunction;
        } else {
          throw new Error(`参照函数 ${this.queryData} 不存在，请在refMap中添加`);
        }
      } else if (typeof this.queryData === 'function') {
        return this.queryData;
      } else {
        throw new Error(`queryData 不是有效值，当前值为 ${this.queryData}`);
      }
    },
  },
  render() {
    const queryDataMethod = this.queryDataMethod;
    const {
      value,
      queryData,
      mode,
      disabled,
      idField,
      labelField,
      dataField,
      ...refConfig
    } = this.$props;
    const defaultProps = { data: dataField, value: idField, label: labelField };

    const handleChange = newValue => {
      this.$emit('input', newValue);
    };

    if (mode === 'edit') {
      return (
        <single-ref-model
          value={value}
          onInput={handleChange}
          queryData={queryDataMethod}
          defaultProps={defaultProps}
          {...{ props: { ...refConfig, clearValue: '0' } }}
        />
      );
    }

    return (
      <show-ref-name
        disabled={disabled}
        id={value}
        query-data={queryDataMethod}
        id-field={idField}
        label-field={labelField}
        data-field={dataField}
      />
    );
  },
};
</script>
