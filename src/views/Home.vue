<template>
  <div class="home">
    <img class="mb-4" alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Expendable Assets"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
