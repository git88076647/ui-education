<template>
  <el-table
    ref="table"
    :data="value"
    :max-height="maxHeight"
    @row-click="handleToggleSelection"
    style="user-select: none"
  >
    <el-table-column type="selection" align="center"></el-table-column>
    <el-table-column label="列" prop="label" align="center"></el-table-column>
  </el-table>
</template>

<script>
import Sortable from 'sortablejs'
import { cloneDeep } from 'lodash'

export default {
  name: 'SortTable',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    selection: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    selection: {
      handler(value) {
        this.$nextTick(() => {
          this.setSelection(value.map((item) => item.prop))
        })
      },
      immediate: true
    }
  },
  computed: {
    /** 表格最大高度 */
    maxHeight() {
      return document.documentElement.clientHeight - 120
    }
  },
  methods: {
    /**
     * 获取表格的selection
     */
    getSelection() {
      return this.$refs.table.selection
    },
    /**
     * 设置表格选中行
     */
    setSelection(keys) {
      // 先清空选择，然后设置选中
      this.$refs.table.clearSelection()
      this.value
        .filter((item) => keys.includes(item.prop))
        .forEach((item) => {
          this.$refs.table.toggleRowSelection(item)
        })
    },
    /**
     * 切换行选中状态
     */
    handleToggleSelection(row, column, event) {
      this.$refs.table.toggleRowSelection(row)
    },
    /**
     * 拖动排序
     */
    dropRow() {
      const el = this.$refs.table.$el.querySelector('.el-table__body tbody')
      Sortable.create(el, {
        animation: 150,
        onUpdate: ({ oldIndex, newIndex }) => {
          const data = this.value
          let minIndex = Math.min(oldIndex, newIndex)
          let maxIndex = Math.max(oldIndex, newIndex)
          let step = 0
          // 置换改变行的 sortindex 值
          data[oldIndex].sortindex = data[newIndex].sortindex
          // 设置置换方案
          if (newIndex > oldIndex) {
            minIndex++
            step--
          } else if (newIndex < oldIndex) {
            maxIndex--
            step++
          }
          // 更新所有受影响的数值
          for (let index = minIndex; index < maxIndex + 1; index++) {
            data[index].sortindex += step
          }
          // 更新数组内部顺序
          const currRow = data.splice(oldIndex, 1)[0]
          data.splice(newIndex, 0, currRow)
          // 还原DOM
          const newItem = el.children[newIndex]
          const oldItem = el.children[oldIndex]
          el.removeChild(newItem)
          if (newIndex > oldIndex) {
            el.insertBefore(newItem, oldItem)
          } else {
            el.insertBefore(newItem, oldItem.nextSibling)
          }
        }
      })
    }
  },
  mounted() {
    this.dropRow()
  }
}
</script>
