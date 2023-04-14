<script>
import FieldCheckbox from './components/checkbox';
import FieldDate from './components/date';
import FieldDateTime from './components/dateTime';
import FieldDict from './components/dict';
import FieldNumber from './components/number';
import FieldRef from './components/ref';
import FieldSelect from './components/select';
import FieldText from './components/text';
import numeral from 'numeral';
import { isArray } from 'lodash';

export default {
  name: 'table-field',
  components: {
    FieldCheckbox,
    FieldDate,
    FieldDateTime,
    FieldDict,
    FieldNumber,
    FieldRef,
    FieldSelect,
    FieldText,
  },
  props: {
    /**
     * 字段类型
     */
    type: String,
    /**
     * 字段状态
     */
    mode: {
      type: String,
      default: 'read',
    },
    /**
     * 编辑态时，空间不可用状态
     */
    disabled: Boolean,
    /**
     * 字段值
     */
    value: [String, Number, Boolean, Array],
    /**
     * 字段设置，通常为json字符串
     */
    option: {
      type: [String, Object, Array, null, undefined],
    },
    /**
     * 额外传入数据源，覆盖option指定的数据源
     */
    data: [Object, Array],
    /**
     * 默认显示值
     */
    defaultValue: {
      type: String,
      default: '',
    },
    /**
     * 行数据
     */
    row: Object,
    /**
     * 列数据
     */
    item: Object,
    /**
     * placeholder 透传属性
     */
    placeholder: String,
  },
  computed: {
    config() {
      const option = this.option;
      if (typeof option === 'string') {
        if (option === '') {
          return undefined;
        } else {
          try {
            return JSON.parse(option);
          } catch (error) {
            console.warn({ errorMessage: 'json字符串解析错误', content: option });
            return undefined;
          }
        }
      } else if (option && typeof option === 'object') {
        return option;
      } else {
        // const item = this.item;
        // const currentProp = item ? `, 当前字段 ${item.label} ${item.prop}` : '';
        // console.warn(`table-field 缺少option${currentProp}`);
        return undefined;
      }
    },
  },
  render(h) {
    const type = this.type;
    const mode = this.mode;
    const config = this.config;
    const dataSourceField = config && !isArray(config) ? config.dataSourceField : undefined;
    const value =
      dataSourceField && this.row && type !== 'text' ? this.row[dataSourceField] : this.value;
    const data = this.data;
    const item = this.item;
    const disabled = this.disabled;

    const handleChange = newValue => {
      this.$emit('input', newValue);
    };

    if (mode === 'read' && (typeof value === 'undefined' || value === null)) {
      return <span />;
    }

    if (type === 'checkbox') {
      return (
        <field-checkbox
          value={value}
          disabled={disabled}
          onInput={handleChange}
          label={item ? item.label : ''}
          mode={mode}
        />
      );
    }

    if (type === 'date') {
      return (
        <field-date
          value={value}
          disabled={disabled}
          onInput={handleChange}
          mode={mode}
          placeholder={this.placeholder}
        />
      );
    }

    if (type === 'dateTime') {
      return (
        <field-date-time
          value={value}
          disabled={disabled}
          onInput={handleChange}
          mode={mode}
          placeholder={this.placeholder}
        />
      );
    }

    if (type === 'dict') {
      const dictMap = config || {};
      return (
        <field-dict
          value={value}
          disabled={disabled}
          onInput={handleChange}
          mode={mode}
          dictMap={dictMap}
        />
      );
    }

    if (type.includes('number')) {
      const numberConfig = config || {};
      const decimal = numeral(type).value() || 0;
      const format = numberConfig.format || '0,00.' + new Array(decimal).fill(0).join('');
      return (
        <field-number
          value={value}
          disabled={disabled}
          onInput={handleChange}
          mode={mode}
          format={format}
        />
      );
    }

    if (type === 'ref') {
      if (config && typeof config === 'object') {
        // console.log(this.item.label, config);
        return (
          <field-ref
            value={value}
            disabled={disabled}
            onInput={handleChange}
            mode={mode}
            placeholder={this.placeholder}
            {...{ props: config }}
          />
        );
      } else {
        console.error({ errorMessage: 'ref JSON信息配置错误', content: config });
        return <span />;
      }
    }

    if (type === 'select') {
      return (
        <field-select
          value={value}
          disabled={disabled}
          onInput={handleChange}
          mode={mode}
          config={config}
          options={data}
          placeholder={this.placeholder}
        />
      );
    }

    return <field-text value={value} disabled={disabled} onInput={handleChange} mode={mode} />;
  },
};
</script>
