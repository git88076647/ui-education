<template>
  <span>{{ refName }}</span>
</template>

<script>
import { showRefName } from '../utils';

export default {
  name: 'ShowRefName',
  props: {
    id: {
      type: [String, Number],
    },
    queryData: {
      type: Function,
      required: true,
    },
    idField: {
      type: String,
      default: 'id',
    },
    labelField: {
      type: String,
      default: 'name',
    },
    dataField: {
      type: String,
      default: 'rows',
    },
  },
  data() {
    return {
      refName: '',
    };
  },
  watch: {
    id: {
      handler(value) {
        if (value) {
          showRefName(value, this.queryData, this.idField, this.dataField).then(resData => {
            const refContent = resData ? resData[this.labelField] : undefined;
            this.refName = refContent || value;
          });
        } else {
          this.refName = '';
        }
      },
      immediate: true,
    },
  },
};
</script>
