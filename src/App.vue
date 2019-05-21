<template>
  <div id="app">
    <div id="nav" class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#">Shadow Network</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor02">
        <ul class="navbar-nav mr-auto">
          <router-link tag="li" class="nav-item" exact-active-class="active" to="/">
            <a class="nav-link">Home</a>
          </router-link>
          <router-link tag="li" class="nav-item" exact-active-class="active" to="/about">
            <a class="nav-link">About</a>
          </router-link>
          <router-link tag="li" class="nav-item" exact-active-class="active" to="/login">
            <a class="nav-link">Login</a>
          </router-link>
          <router-link tag="li" class="nav-item" exact-active-class="active" to="/members">
            <a class="nav-link">Members</a>
          </router-link>
        </ul>
          <!--
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="text" placeholder="Search">
          <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
        </form>
        -->
      </div>
    </div>
    <header-view/>
    <router-view/>
  </div>
</template>

<script>
  /* global Parse */
  Parse.serverURL = 'https://shadownetwork.herokuapp.com/parse/1'; // This is your Server URL
  Parse.initialize(
          'APPLICATION_ID', // This is your Application ID
          'g8q6x9uvsept5Sjfz3hdiiP3mh5mgOoda2rZeP4I' // This is your Javascript key
  );

  import HeaderView from './views/HeaderView.vue'

  export default {
    name: "App",
    components: {
      HeaderView
    }
  }
</script>