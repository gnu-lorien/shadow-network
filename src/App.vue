<template>
    <div id="app">
        <b-navbar id="nav" toggleable="md" type="dark">
            <b-navbar-brand @click.prevent="gohome">Expendable Assets</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/">Home</b-nav-item>
                    <b-nav-item to="/members">Members</b-nav-item>
                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template slot="button-content"><em>User</em></template>
                        <!-- <b-dropdown-item href="#">Profile</b-dropdown-item> -->
                        <b-dropdown-item to="/login" v-if="!hasCurrentUser">Login</b-dropdown-item>
                        <b-dropdown-item @click.prevent="signout" v-if="hasCurrentUser">Sign Out</b-dropdown-item>
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
        name: "App",
        computed: {
            username() {
                return this.$store.state.user.username;
            },
            hasCurrentUser: function() {
                return this.username !== "";
            }
        },
        methods: {
            gohome() {
                if (Parse.User.current()) {
                    this.$router.push({name: 'members'});
                } else {
                    this.$router.push('/');
                }
            },
            async signout() {
                await this.$store.dispatch("logoutParse");
                this.$router.push('/');
            }
        }
    }
</script>