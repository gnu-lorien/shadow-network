<template>
    <div>
        <header-view :memberId="$props.memberId"></header-view>
        <b-navbar id="nav" type="light" variant="light">
            <b-navbar-nav>
                <b-nav-item :to="{ name: 'memberResources', params: { memberId: this.$route.params.memberId } }">Resources</b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <router-view/>
    </div>
</template>

<script>
    import HeaderView from "./HeaderView";
    export default {
        name: "MemberLanding",
        props: ["memberId"],
        components: {HeaderView}
    }
</script>

<style scoped>

</style>