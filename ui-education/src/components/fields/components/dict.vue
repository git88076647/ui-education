<script>
export default {
  name: 'field-dict',
  props: {
    value: [String, Number],
    dictMap: Object,
    mode: String,
    disabled: Boolean,
    placeholder: String,
  },
  computed: {
    formatValue() {
      return this.dictMap[this.value];
    },
    options() {
      return Object.entries(this.dictMap).map(([value, label]) => {
        return { value, label };
      });
    },
  },
  render() {
    const mode = this.mode;
    const disabled = this.disabled;

    const handleChange = selection => {
      this.$emit('input', selection);
    };

    if (mode === 'edit') {
      return (
        <el-select value={this.value} onInput={handleChange} placeholder="请选择" clearable>
          {this.options.map(item => {
            return <el-option key={item.value} value={item.value} label={item.label} />;
          })}
        </el-select>
      );
    }

    return <span>{this.formatValue}</span>;
  },
};
</script>
