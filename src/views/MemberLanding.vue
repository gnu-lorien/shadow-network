<template>
    <div id="nav">
      <router-link :to="{ name: 'memberResources', params: { memberId: this.$route.params } }">Resources</router-link> |
    </div>
</template>

<script>
    export default {
        name: "MemberLanding"
    }
</script>

<style scoped>

</style>