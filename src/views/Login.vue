<template>
    <div class="container" v-if="hasCurrentUser">
        <div class="row">
            <div class="col text-center">
                <p>Logged in as {{ username }}</p>
                <button v-on:click="logout">Log Out</button>
            </div>
        </div>
    </div>
    <div class="container" v-else>
        <div class="row">
            <div class="col text-center">
                <b-tabs>
                    <b-tab title="Log in" active>
                        <form class="form-signin">
                            <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
                            <label for="inputUsername" class="sr-only">Username</label>
                            <input v-model="formUsername" type="email" id="inputUsername" class="form-control" placeholder="Username" required="" autofocus="">
                            <label for="inputPassword" class="sr-only">Password</label>
                            <input  v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required="">
                            <button v-on:click="login" class="btn btn-lg btn-primary btn-block" type="button">Sign in</button>
                            <p class="mt-5 mb-3 text-muted">© 2017-2018</p>
                        </form>
                    </b-tab>
                    <b-tab title="Sign Up">
                        <form class="form-signup">
                            <h1 class="h3 mb-3 font-weight-normal">Please sign up</h1>
                            <label for="inputUsernameSignup" class="sr-only">Username</label>
                            <input v-model="formUsername" id="inputUsernameSignup" class="form-control" placeholder="Username" required="" autofocus="">
                            <label for="inputEmailSignup" class="sr-only">Email address</label>
                            <input v-model="email" type="email" id="inputEmailSignup" class="form-control" placeholder="Email address" required="" autofocus="">
                            <label for="inputPasswordSignup" class="sr-only">Password</label>
                            <input  v-model="password" type="password" id="inputPasswordSignup" class="form-control" placeholder="Password" required="">
                            <button v-on:click="signup" class="btn btn-lg btn-primary btn-block" type="button">Sign Up</button>
                        </form>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import Parse from 'parse';
    export default {
        name: "Login",
        data: function () {
            return {
                email: "",
                password: "",
                formUsername: ""
            }
        },
        computed: {
            username() {
                return this.$store.state.user.username;
            },
            hasCurrentUser: function() {
                return this.username !== "";
            }
        },
        methods: {
            async login() {
                if (this.password.length === 0) {
                    alert("Please enter a password");
                    return;
                }
                if (this.formUsername.length === 0) {
                    alert("Please enter a username");
                    return;
                }

                await this.$store.dispatch('loginParse', {
                    username: this.formUsername,
                    password: this.password
                });
                this.$router.replace("/members");
            },
            async signup() {
                if (this.email.length === 0) {
                    alert("Please enter an email");
                    return;
                }
                if (this.password.length === 0) {
                    alert("Please enter a password");
                    return;
                }
                if (this.formUsername.length === 0) {
                    alert("Please enter a username");
                    return;
                }

                await this.$store.dispatch('signupParse', {
                    username: this.formUsername,
                    email: this.email,
                    password: this.password
                });
                this.$router.replace("/members");
            },
            async logout() {
                await this.$store.dispatch('logoutParse');
            }
        }
    }
</script>

<style scoped>

</style>