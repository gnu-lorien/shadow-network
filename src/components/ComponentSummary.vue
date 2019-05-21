<template>
    <b-list-group-item href="#" type="secondary" class="flex-column align-items-start" v-if="!editing" v-on:click="editing = true">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{component.short}}</h5>
            <small>{{component.bonus}}</small>
            <small>{{component.id}}</small>
        </div>

        <p class="mb-1">
            {{component.long}}
        </p>

        <small>{{component.credit}}</small>
    </b-list-group-item>
    <div class="col" v-else>
        <div class="row">
            <p>{{component.id}}</p>
            <button v-on:click="save">Save</button>
            <button v-on:click="revert">Revert</button>
        </div>
        <form class="form-component-edit">
            <div class="row">
                <!-- short long credit bonus reputation scope image order -->
                <div class="col">
                    <label for="inputShort">Short Description</label>
                    <input v-model="short" id="inputShort"/>
                </div>
                <div class="col">
                    <label for="inputLong">Long information text</label>
                    <textarea v-model="long" id="inputLong"></textarea>
                </div>
                <div class="col">
                    <label for="inputCredit">Credits/Cash</label>
                    <input v-model="credit" id="inputCredit"/>
                </div>
                <div class="col">
                    <label for="inputBonus">Bonus Bid</label>
                    <input v-model="bonus" id="inputBonus"/>
                </div>
            </div>
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