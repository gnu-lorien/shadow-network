<template>
    <div class="container">
        <div class="row" v-if="hasCurrentMember">
            Name: {{ currentMember.name }} Id: {{ currentMember.id }}
        </div>
        <div class="row" v-else>
            No member selected
        </div>
    </div>
</template>

<script>
    export default {
        name: "HeaderView",
        computed: {
            hasCurrentMember() {
                return this.$store.state.member.id !== "";
            },
            currentMember() {
                return this.$store.state.member;
            }
        },
    }
</script>

<style scoped>

</style>