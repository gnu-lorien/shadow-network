<template>
    <div>
        <div id="nav">
          <router-link :to="{ name: 'memberResources', params: { memberId: this.$route.params.memberId } }">Resources</router-link> |
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "MemberLanding"
    }
</script>

<style scoped>

</style>