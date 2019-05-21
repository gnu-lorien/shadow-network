<template>
    <div v-if="hasCurrentMember">
        <ol class="breadcrumb">
            <li class="breadcrumb-item active">Name</li>
            <li class="breadcrumb-item ">{{ currentMember.name }}</li>
            <li class="breadcrumb-item active ">Handle</li>
            <li class="breadcrumb-item ">{{ currentMember.street_name}} </li>
        </ol>
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