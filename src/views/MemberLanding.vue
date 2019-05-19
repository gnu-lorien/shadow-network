<template>
    <div>
        <div id="nav">
          <router-link :to="{ name: 'memberResources', params: { memberId: this.$route.params.memberId } }">Resources</router-link> |
        </div>
        <header-view :memberId="$props.memberId"></header-view>
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