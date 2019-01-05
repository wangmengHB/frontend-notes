<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow:hidden;
  color: white;
  font-size: 16px;
}
</style>
