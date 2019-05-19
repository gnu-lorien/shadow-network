<template>
    <div class="container" v-if="username">
        <div class="row">
            <div class="col text-center">
                <p>Loggen in as {{ username }}</p>
                <button v-on:click="logout">Log Out</button>
            </div>
        </div>
    </div>
    <div class="container" v-else>
        <div class="row">
            <div class="col text-center">
                <form class="form-signin">
                    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
                    <label for="inputEmail" class="sr-only">Email address</label>
                    <input v-model="email" type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="">
                    <label for="inputPassword" class="sr-only">Password</label>
                    <input  v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required="">
                    <button v-on:click="login" class="btn btn-lg btn-primary btn-block" type="button">Sign in</button>
                    <p class="mt-5 mb-3 text-muted">© 2017-2018</p>
                </form>
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
        computedProperty: {
            hasCurrentUser: function() {
                return Parse.User.current() !== null;
            }
        },
        methods: {
            login() {
                if (this.email.length === 0) {
                    alert("Please enter an email");
                    return;
                }
                if (this.password.length === 0) {
                    alert("Please enter a password");
                    return;
                }

                Parse.Cloud.run('hello')
                    .then((response) => {
                        alert("Nothing?");
                        alert(JSON.stringify(response));
                    })
                    .catch(function (e) {
                        alert("Error calling hello " + e.message);
                    });
                Parse.User.logIn(this.email, this.password)
                    .then(() => {
                        // Used an arrow function here because I
                        // want to access 'this' which is overridden in
                        // a conventional function
                        this.$router.replace("/");
                    })
                    .catch(function (e) {
                        alert("Error logging in! " + e.message);
                    });
            },
            logout() {
                Parse.User.logOut()
                    .then(() => {
                        this.username = null;
                    })
                    .catch(function (e) {
                        alert("Error logging out! " + e.message);
                    })
            }
        }
    }
</script>

<style scoped>

</style>