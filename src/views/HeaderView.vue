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
    import CurrentMember from '@/mixins/CurrentMember.js'
    export default {
        name: "HeaderView",
        mixins: [ CurrentMember ]
    }
</script>

<style scoped>

</style>