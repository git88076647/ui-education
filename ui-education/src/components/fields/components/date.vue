<script>
export default {
  name: 'field-date',
  props: {
    value: [String, Number],
    mode: String,
    disabled: Boolean,
    placeholder: String,
  },
  render() {
    const value = this.value;
    const mode = this.mode;
    const disabled = this.disabled;

    const handleChange = newValue => {
      this.$emit('input', newValue);
    };

    if (mode === 'edit') {
      return (
        <el-date-picker
          value={value}
          onInput={handleChange}
          disabled={disabled}
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder={this.placeholder || '选择日期'}
          clearable
        />
      );
    }

    return <span>{this.parseTime(value, '{y}-{m}-{d}')}</span>;
  },
};
</script>
