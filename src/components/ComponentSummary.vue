<template>
    <div v-if="!editing">
        <p>A component with {{component.id}} and {{component.short}}</p>
        <p>
            <button v-on:click="edit">Edit</button>
        </p>
        <p>
            <button v-on:click="remove">Delete</button>
        </p>
    </div>
    <div v-else>
        <p>{{component.id}}</p>
        <button v-on:click="save">Save</button>
        <button v-on:click="revert">Revert</button>
        <!-- short long credit bonus reputation scope image order -->
        <form class="form-component-edit">
            <label for="inputShort">Short Description</label>
            <input v-model="short" id="inputShort"/>
            <label for="inputLong">Long information text</label>
            <textarea v-model="long" id="inputLong"></textarea>
            <label for="inputCredit">Credits/Cash</label>
            <input v-model="credit" id="inputCredit"/>
            <label for="inputBonus">Bonus Bid</label>
            <input v-model="bonus" id="inputBonus"/>
        </form>
    </div>
</template>

<script>
    export default {
        name: "ComponentSummary",
        props: [
            'memberId',
            'resourceId',
            'componentId'
        ],
        data: function () {
            return {
                editing: false,
                short: "",
                long: "",
                credit: 0,
                bonus: 0
            }
        },
        computed: {
            component() {
                return this.$store.state.components.components[this.$props.componentId] || {id: "", short: ""};
            }
        },
        mounted: function () {
            this.fetch();
        },
        methods: {
            fetch() {
                this.$store.dispatch('loadOrUseComponent', this.$props.componentId);
            },
            edit() {
                this.editing = true;
            },
            remove() {
                this.$store.dispatch('destroyComponent', this.$props.componentId)
                    .catch((e) => {
                        alert("Broke destroying component " + e.message);
                    })
            },
            save() {
                this.$store.dispatch('saveComponent', {...this.data()})
                    .then(() => {
                        this.editing = false;
                    })
            },
            revert() {
                this.editing = false;
            }
        }
    }
</script>

<style scoped>

</style>