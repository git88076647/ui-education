<template>
  <el-tooltip content="消息" effect="dark" placement="bottom">
      <div >
        <el-badge :value="total" :max='99' >
          <a @click="click" aria-hidden="true" class="el-icon-chat-dot-square" style="font-size: 18px;"></a>
        </el-badge>
      </div>
  </el-tooltip>
</template>

<script>

export default {
  name: 'TodoMessage',
  data() {
    return {
      total:10,

     
    }
  },
  mounted() {
    
  },
  beforeDestroy() {
   
  },
  methods: {
    click() {
      this.msgSuccess("代办消息,可考虑跳转到工作台");
    },
    
  }
}
</script>

<style>
.el-badge__content.is-fixed{
  top: 12px;
}
</style>
