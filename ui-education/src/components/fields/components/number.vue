<script>
import numeral from 'numeral';

export default {
  name: 'field-number',
  props: {
    value: [Number, String],
    format: String,
    mode: String,
    disabled: Boolean,
    placeholder: String,
  },
  computed: {
    formatValue() {
      return numeral(this.value).format(this.format);
    },
    precision() {
      const format = this.format;
      if (format) {
        const decimal = format.split('.')[1];
        return decimal ? decimal.length : 0;
      }
      return 0;
    },
  },
  render() {
    const formatValue = this.formatValue;
    const mode = this.mode;
    const disabled = this.disabled;
    const precision = this.precision;

    const handleChange = newValue => {
      this.$emit('input', newValue);
    };

    if (mode === 'edit') {
      return (
        <el-input-number
          value={Number(formatValue)}
          disabled={disabled}
          onInput={handleChange}
          precision={precision}
          clearable
        />
      );
    }

    return <span>{formatValue}</span>;
  },
};
</script>
