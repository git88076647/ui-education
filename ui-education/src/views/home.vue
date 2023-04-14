<template>
  <div class="home">
    <!-- <img src="../assets/image/logo.png" alt="logo" /> -->
    <h1>永远相信美好的事情即将发生</h1>
    <h2>Don’t let one failure discourage you, try again.</h2>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 150px;
  position: relative;
  background-image: url('../assets/image/login-background.svg');

  img {
    width: 150px;
  }

  h1,
  h2 {
    color: #606266;
  }

  h1 {
    font-size: 3em;
  }
}
</style>
