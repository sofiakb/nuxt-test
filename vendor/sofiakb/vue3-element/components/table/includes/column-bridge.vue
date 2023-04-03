<template>
    <div class="ssf__table--column-bridge"></div>
</template>

<script lang="ts">
    import { TablePosition } from "../utils";
    import { PropType }      from "vue";

    export default {
        name: "table-column-bridge",

        /* eslint-disable */
        props: {
            prop    : { type: String, required: true },
            label   : { type: String, required: true },
            classes   : { type: String, required: false },
            sortable: { type: Boolean, required: false, default: false },
            position: {
                type    : [ Number, String ] as PropType<TablePosition>,
                required: false,
                default : TablePosition.LEFT
            },

            casts: {
                type    : Function,
                required: false,
            },
        },
        /* eslint-enable */
    }
</script>

<style scoped>

</style>
