<template>
  <div>
    <img src="@/assets/logo_1.png" />
  </div>
</template>

<script>

export default {
  name: 'Header',
  data () {
    return {
      msg: 'this is header'
    }
  },
  mounted(){
    // classification();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 150px;
  position: absolute;
  left: -190px;
  top: -5px;
  cursor: pointer;
  filter:drop-shadow(#fff 200px 0);
  user-select: none; /* 没有为不同浏览器设置兼容格式 */
}
</style>
