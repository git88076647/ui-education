<template>
  <ul class="timeline-wrapper">
    <li class="timeline-item" v-for="item in timelineList" :key="item.id">
      <div class="timeline-box">
        <div class="out-circle"></div>
        <div class="long-line"></div>
      </div>
      <div class="timeline-content">
        <h3 class="timeline-date">
          {{ item.createTime }}
          <el-tag :type="getTagType(item.status)" effect="dark">
            {{ getTagString(item.status) }}
          </el-tag>
        </h3>
        <div class="timeline-desc">
          <span class="label">审批人</span>
          <span class="content">{{ item.createByName }}</span>
        </div>
        <div class="timeline-desc">
          <span class="label">批语</span>
          <span class="content">{{ item.note }}</span>
        </div>
      </div>
    </li>
    <li class="timeline-item">
      <div class="timeline-box">
        <div class="out-circle"></div>
      </div>
      <div class="timeline-content">
        <div class="timeline-none">
          <div class="timeline-none__inner">没有更多数据了</div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { listApprovenote } from '@/api/pubase/approvenote';

export default {
  name: 'Timeline',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return { timelineList: [] };
  },
  methods: {
    getTagType(status) {
      return status === '0' || status === 0 ? 'success' : 'danger';
    },
    getTagString(status) {
      return status === '0' || status === 0 ? '通过' : '退回';
    },
  },
  mounted() {
    this.timelineList = listApprovenote({ id: this.id });
  },
};
</script>

<style scoped lang="scss">
ul.timeline-wrapper {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 时间线 */
.timeline-item {
  display: flex;

  .timeline-box {
    display: flex;
    flex: 0 0 16px;
    flex-direction: column;
    align-items: center;

    .out-circle {
      width: 16px;
      height: 16px;
      background: rgba(14, 116, 218, 0.1);
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      border: 1px solid #c9cdd6;
    }

    .long-line {
      width: 2px;
      flex: 1 1 0px;
      background: rgba(14, 116, 218, 1);
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
      opacity: 0.1;
    }
  }

  .timeline-content {
    box-sizing: border-box;
    padding-left: 10px;
    flex: 1 1 0px;

    .timeline-date {
      font-size: 18px;
      color: #606266;
      font-weight: 500;
      margin-top: 0px;
      margin-bottom: 16px;
      height: 16px;
      line-height: 18px;
      ::v-deep .el-tag {
        transform: translateY(-2px);
        user-select: none;
      }
    }

    .timeline-desc {
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 12px;

      .label {
        color: #909399;
        user-select: none;
        display: inline-block;
        width: 46px;
        text-align-last: justify;
        margin-right: 4px;
        &::after {
          content: ':';
          position: absolute;
        }
      }
    }

    .timeline-none {
      display: block;
      height: 1px;
      width: 100%;
      margin: 8px 0;
      background-color: #dcdfe6;
      position: relative;
      &__inner {
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        position: absolute;
        background-color: #fff;
        padding: 0 20px;
        font-weight: 500;
        color: #909399;
        font-size: 14px;
        user-select: none;
      }
    }
  }
}
</style>
