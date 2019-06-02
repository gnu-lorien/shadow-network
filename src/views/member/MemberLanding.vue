<template>
    <div>
        <header-view :memberId="$props.memberId"></header-view>
        <b-navbar id="nav" type="light" variant="light" class="mb-2">
            <b-navbar-nav>
                <b-nav-item :to="{ name: 'memberResources', params: { memberId: this.$route.params.memberId } }">Resources</b-nav-item>
                <b-nav-item :to="{ name: 'memberTrading', params: { memberId: this.$route.params.memberId } }">Trading</b-nav-item>
                <b-nav-item :to="{ name: 'memberVault', params: { memberId: this.$route.params.memberId } }">Vault</b-nav-item>
                <b-nav-item :to="{ name: 'memberProfile', params: { memberId: this.$route.params.memberId } }">Profile</b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <router-view/>
    </div>
</template>

<script>
    import HeaderView from "../HeaderView";
    export default {
        name: "MemberLanding",
        props: ["memberId"],
        components: {HeaderView}
    }
</script>

<style scoped>

</style>