<script>
import { isArray } from 'lodash';
import FieldRef from './ref';

export default {
  name: 'field-select',
  props: {
    value: [String, Number],
    mode: String,
    disabled: Boolean,
    /**
     * 通过模板配置的信息
     */
    config: [Object, Array],
    /**
     * 主动传入的数据源，覆盖模板配置的数据源
     */
    options: Array,
    placeholder: String,
  },
  components: { FieldRef },
  computed: {
    selectionOptions() {
      this.isRef = false;
      if (this.options) {
        return this.options;
      }
      if (isArray(this.config)) {
        return this.config;
      }
      this.isRef = true;
      return [];
    },
    keyMap() {
      return new Map(
        this.selectionOptions.map(item => {
          return [item.value || item.dictValue, item.label || item.dictLabel];
        }),
      );
    },
  },
  data() {
    return {
      isRef: false,
    };
  },
  render(h) {
    const { value, mode, disabled, config, options } = this.$props;
    const { isRef } = this.$data;

    const finalOptions = options || config;

    const handleChange = newValue => {
      this.$emit('input', newValue);
    };

    if (mode === 'edit') {
      return (
        <el-select
          value={this.value}
          disabled={disabled}
          onInput={handleChange}
          placeholder={this.placeholder || '请选择'}
          clearable
        >
          {this.selectionOptions.map(item => {
            return (
              <el-option
                key={item.value}
                value={item.value || item.dictValue}
                label={item.label || item.dictLabel}
                disabled={item.status == '1'}
              >
                <span style="float: left">{item.label || item.dictLabel}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {item.status && item.status == '1' ? '停用' : ''}
                </span>
              </el-option>
            );
          })}
        </el-select>
      );
    }

    if (Array.isArray(this.selectionOptions)) {
      return <span>{this.keyMap.get(value)}</span>;
    }

    if (isRef && config && typeof config === 'object' && !isArray(config)) {
      return <field-ref value={value} {...{ props: config }} />;
    }

    return <span>{this.keyMap.get(value)}</span>;
  },
};
</script>
