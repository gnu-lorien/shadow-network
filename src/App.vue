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
                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template slot="button-content"><em>User</em></template>
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <router-view/>
    </div>
</template>

<script>
    import Parse from 'parse';
    Parse.serverURL = process.env.VUE_APP_PARSE_SERVER_URL;
    Parse.initialize(
        'APPLICATION_ID', // This is your Application ID
        'g8q6x9uvsept5Sjfz3hdiiP3mh5mgOoda2rZeP4I' // This is your Javascript key
    );

    export default {
        name: "App"
    }
</script>