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
                            <input v-model="username" type="email" id="inputUsername" class="form-control" placeholder="Username" required="" autofocus="">
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
                            <input v-model="username" id="inputUsernameSignup" class="form-control" placeholder="Username" required="" autofocus="">
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
    /* global Parse */
    export default {
        name: "Login",
        data: function () {
            return {
                email: "",
                password: "",
                username: null
            }
        },
        mounted: function () {
            if (Parse.User.current()) {
                this.username = Parse.User.current().get('username');
            } else {
                this.username = null;
            }
        },
        computed: {
            hasCurrentUser: function() {
                return Parse.User.current() !== null;
            }
        },
        methods: {
            login() {
                if (this.password.length === 0) {
                    alert("Please enter a password");
                    return;
                }
                if (this.username.length === 0) {
                    alert("Please enter a username");
                }

                Parse.Cloud.run('hello')
                    .then((response) => {
                        alert("Nothing?");
                        alert(JSON.stringify(response));
                    })
                    .catch(function (e) {
                        alert("Error calling hello " + e.message);
                    });
                Parse.User.logIn(this.username, this.password)
                    .then(() => {
                        // Used an arrow function here because I
                        // want to access 'this' which is overridden in
                        // a conventional function
                        this.$router.replace("/members");
                    })
                    .catch(function (e) {
                        alert("Error logging in! " + e.message);
                    });
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
                if (this.username.length === 0) {
                    alert("Please enter a username");
                }

                let user = new Parse.User();
                user.set('username', this.username);
                user.set('email', this.email);
                user.set('password', this.password);

                await user.signUp();
                this.$router.replace("/members");
            },
            logout() {
                Parse.User.logOut()
                    .finally(() => {
                        this.username = null;
                    });
            }
        }
    }
</script>

<style scoped>

</style>