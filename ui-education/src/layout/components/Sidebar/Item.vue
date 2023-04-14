<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
   
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      //左侧菜单树只支持自带的图标，
      //https://www.iconfont.cn/ 去下载svg 放 src\assets\icons\svg
      // if(icon.startsWith('fa')){
      //   vnodes.push(<i class={icon}></i>)
      // }else{
        vnodes.push(<svg-icon icon-class={icon}/>)
      // }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
