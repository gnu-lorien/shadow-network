<template>
    <div>
        <b-navbar id="nav" type="light" variant="light">
            <b-navbar-nav>
                <b-nav-item :to="{ name: 'gamemasterTransferMembers' }">Transfer</b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "GameMasterLanding"
    }
</script>

<style scoped>

</style>