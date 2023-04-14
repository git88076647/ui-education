<template>
  <div class="app-container">
    <el-row>
      <el-select v-model='currInstance' @change="handleSelect" placeholder="选择查看的服务" clearable >
        <el-option
          v-for="instance in instanceOptions"
          :key="instance.value"
          :label="instance.label"
          :value="instance.value"
        />
      </el-select>
      <span style="color:red">tips:本服务限定局域网内访问！</span>
    </el-row>
    
    <div v-loading="loading" :style="'height:'+ height">
      <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
    </div>
  </div>
</template>
<script>
import {list } from "@/api/monitor/druid";

export default {
  name: "Druid",
  data() {
    return {
      src:undefined,
      height: document.documentElement.clientHeight - 94.5 + "px;",
      loading: true,
      instanceOptions:[],
      currInstance:undefined
    };
  },
  created(){
    this.getList();

  },
  mounted: function() {
    setTimeout(() => {
      this.loading = false;
    }, 230);
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - (94.5 + 32) + "px;";
    };
  },
  methods: {
    getList(){
      list().then(response =>{
        this.instanceOptions = response.data;

      });
    },
    handleSelect(){
      this.src = this.currInstance;
    }
  }
};
</script>
