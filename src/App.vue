<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/resources">Resources</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<script>
  /* global Parse */
  Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
  Parse.initialize(
          '5lGxsIwF81tR4LjrzxJsgpIdmDZaIvNWshmpXhNz', // This is your Application ID
          'g8q6x9uvsept5Sjfz3hdiiP3mh5mgOoda2rZeP4I' // This is your Javascript key
  );
</script>