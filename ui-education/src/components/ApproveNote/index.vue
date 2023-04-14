<template>
  <el-dialog
    append-to-body
    title="审批历史"
    :visible.sync="showDialog"
    width="50%"
  >
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(data, index) in dataList"
          :key="index"
          :type="data.type"
          :timestamp="data.createTime"
          placement="top"
        >
          <el-card>
            <h4>{{ data.note }}</h4>
            <p>{{ data.createByName }} {{data.status == 2 ? "审批于" :(data.status == 3 ? "退回于" : "上报于" )}} {{ data.createTime }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-dialog>
</template>

<script>
import { listApprovenote } from "@/api/pubase/approvenote";
export default {
  props: {
    billid: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  name: "ApproveNote",
  data() {
    return {
      loading: false,
      dataList: [],
    };
  },
  /** created 前执行*/
  beforeCreate() {},
  /** 监听*/
   watch: {
    open(newVal, oldVal) {
      if (newVal) {
        this.getList();
      }
    },
  },
  created() {},
  mounted() {
  },
  /** 激活*/
  activated() {},
  computed: {
    showDialog: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("update:open", val);
      },
    },
  },
  methods: {
    getList() {
      this.loading = true;
      listApprovenote({ billid: this.billid }).then((response) => {
        this.dataList = response.rows;
        this.dataList.forEach((data) => {
          if (data.status == "2") {
            data.type = "success";
          } else if (data.status == "3") {
            data.type = "danger";
          } else {
            data.type = "info";
          }
        });
        this.loading = false;
      });
    },
  },
};
</script>      