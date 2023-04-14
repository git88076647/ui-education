<template>
  <div v-loading="loading" :style="'height:'+ height">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
  </div>
</template>

<script>
// import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'

export default {
  
  data() {
    // console.log('33333333333333333333333333');
    // console.log(this.$route.path);
    // console.log(this.$route.name);
    // console.log(this.$route.params);
    // console.log(this.$route.params);
    // console.log(this.$route.query);
    // console.log('extUrl ' + Cookies.get(this.$route.path + 'extUrl'));
    // console.log('extUrl decode ' + Base64.decode(Cookies.get(this.$route.path + 'extUrl')));
    let url='/';
    // let extUrl = Cookies.get(this.$route.path + 'extUrl');
    // let extUrl = this.$route.query.extUrl;
    let extUrl = localStorage.getItem(this.$route.path + 'extUrl');
    if(extUrl && extUrl != ''){
      url = Base64.decode(extUrl);
    }else{
      console.error(this.$route.path+'没有配置扩展URL');
      setTimeout(function(){
        top.location.href = location.origin; 
      },1500);
    }
    return {
      src: url,
      height: document.documentElement.clientHeight - 94.5 + "px;",
      loading: true
    };
  },
  mounted: function() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + "px;";
    };
  }
};
</script>
