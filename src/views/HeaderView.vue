<template>
    <div class="container">
        <div class="row" v-if="hasCurrentMember">
            Name: {{ currentMember.name }} Id: {{ currentMember.id }}
        </div>
        <div class="row" v-else-if="memberId">
            Id: {{ memberId }}
        </div>
        <div class="row" v-else>
            No member selected
            Id: {{ memberId }}
        </div>
    </div>
</template>

<script>
    import CurrentMember from '@/mixins/CurrentMember.js'
    export default {
        name: "HeaderView",
        props: ["memberId"],
        mixins: [ CurrentMember ]
    }
</script>

<style scoped>

</style>