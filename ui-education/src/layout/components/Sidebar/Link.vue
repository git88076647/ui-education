
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'
import { Base64 } from 'js-base64'
// import Cookies from 'js-cookie'

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    extUrl:{
      type: String,
      required: false
    }
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      // console.log('url: ' + path);
      // console.log('extUrl: ' + this.extUrl);
      // console.log('extUrlBase64: ' + Base64.encode(this.extUrl));
      if(this.extUrl && this.extUrl != ''){
        // Cookies.set(this.to + 'extUrl',Base64.encode(this.extUrl));
        localStorage.setItem(url + 'extUrl',Base64.encode(this.extUrl));
        // return {
        //   is: 'router-link',
        //   to: {
        //     path:this.to,
        //     // query会显示到浏览器地址栏不美观
        //     // query:{
        //     //   extUrl: Base64.encode(this.extUrl)
        //     // }
        //   },
          
        // }
      }
      return {
        is: 'router-link',
        to: {
          path:url,
        },
        
      }
    }
  }
}
</script>
