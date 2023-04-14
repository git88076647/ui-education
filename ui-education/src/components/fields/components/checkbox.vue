<script>
export default {
  name: 'field-checkbox',
  props: {
    value: [Boolean, String],
    mode: String,
    label: String,
    disabled: Boolean,
  },
  render() {
    const mode = this.mode;
    const disabled = this.disabled;

    const handleChange = status => {
      this.$emit('input', status);
    };

    if (mode === 'edit') {
      return (
        <el-checkbox value={this.value} disabled={disabled} onInput={handleChange}>
          {this.label}
        </el-checkbox>
      );
    }

    return <span>{this.value ? 'X' : ''}</span>;
  },
};
</script>
