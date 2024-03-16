<script setup>
</script>

<template>
  <div class="wrapper">
    <router-view />

  </div>
</template>

<style scoped>
router-view{
  display: flex;
  justify-content: center;
}
.header{
  text-align: center;
  padding-bottom: 50px;
}
.wrapper{
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction: column;
  justify-content: center;
}
</style>
