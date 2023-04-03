<template>
    <thead :class="headerClasses" class="table-head">

        <tr>

            <table-head-th v-for="(header, $idx) in headers"
                           :key="key(header, $idx)"
                           :fixed="fixed"
                           :header="header"
                           @sort="direction => $emit('sort', { direction, header })"/>

            <!--            <slot/> -->

        </tr>

    </thead>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue"
    import { TableHeader }               from "../../utils";

    import TableHeadTh from "./table-head-th.vue";
    import { key }     from "../../../../utils";

    export default defineComponent({
        name: "table-head",

        components: { TableHeadTh },

        props: {
            headers      : { type: Array as PropType<TableHeader[]>, required: true },
            fixed        : { type: Boolean, required: false, default: false },
            headerClasses: { type: [ String, Object ], required: false, default: "" },
        },

        emits: [ "sort" ],

        setup() {
            return {
                key: (header: TableHeader, index: number) => key({
                    name: header.label.replaceAll(" ", "-").toLowerCase(),
                    id  : `${header.prop}-${index}`
                })
            }
        }
    })
</script>

<style lang="scss" scoped>

</style>

