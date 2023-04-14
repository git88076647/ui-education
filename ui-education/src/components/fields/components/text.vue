<script>
export default {
  name: 'field-text',
  props: {
    value: [String, Number],
    mode: String,
    disabled: Boolean,
    placeholder: String,
  },
  render() {
    const { value, mode, disabled } = this.$props;

    const handleChange = newValue => {
      this.$emit('input', newValue);
    };

    if (mode === 'edit') {
      return (
        <el-input
          value={value}
          onInput={handleChange}
          disabled={disabled}
          placeholder={this.placeholder || '请输入'}
          clearable
        />
      );
    }

    return <span>{value}</span>;
  },
};
</script>
