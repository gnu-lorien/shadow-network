<template>
    <div id="app">
        <b-navbar id="nav" toggleable="lg" type="dark">
            <b-navbar-brand href="#">Shadow Network</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/">Home</b-nav-item>
                    <b-nav-item to="/about">About</b-nav-item>
                    <b-nav-item to="/login">Login</b-nav-item>
                    <b-nav-item to="/members">Members</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
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