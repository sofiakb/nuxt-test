<template>
    <tr :class="{'cursor-pointer': selectable}" class="table-row" @click="onRowClick">

        <table-row-td v-for="(item, $idx) in object" :key="key(item, $idx)" :object="item"/>

        <slot/>

    </tr>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue"
    import { TableColumn }               from "../../utils";

    import TableRowTd from "./table-row-td.vue";
    import { key }    from "../../../../utils";

    export default defineComponent({

        name: "table-row",

        components: { TableRowTd },

        props: {
            object    : { type: Array as PropType<TableColumn[]>, required: true },
            selectable: { type: Boolean, required: false, default: false },
        },

        emits: [ "selected" ],

        setup(props, { emit }) {


            return {
                key: (column: TableColumn, index: number) => key({
                    name: column.prop,
                    id  : `${column.prop}-${index}`
                }),

                onRowClick: () => props.selectable ? emit("selected") : null
            }
        }

    })
</script>

<style lang="scss" scoped>


</style>

