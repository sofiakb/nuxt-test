<template>
    <tbody class="table-body">

        <template v-for="(item, $idx) in tableData" :key="`item-${$idx}-${item}`">

            <table-row :object="item" :selectable="selectable" @selected="() => $emit('selected', $idx)"/>

        </template>

    </tbody>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue"
    import TableRow                      from "./table-row.vue";
    import { TableColumn }               from "../../utils";

    export default defineComponent({
        name: "table-body",

        components: { TableRow },

        props: {
            tableData : { type: Array as PropType<TableColumn[][]>, required: true },
            selectable: { type: Boolean, required: false, default: false },
        },

        emits: [ "selected" ],

    })
</script>

<style lang="scss" scoped>

</style>

