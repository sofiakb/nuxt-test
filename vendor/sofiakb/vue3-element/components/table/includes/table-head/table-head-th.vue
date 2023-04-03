<template>
    <th :class="classes"
        class="position-relative"
        scope="col"
        @click.prevent="sort">

        {{ header.label }}

        <template v-if="header.isSortable()">

            <ssf-shape center class="right-absolute my-auto" size="20">

                <ssf-icon :icon="icon" thin/>

            </ssf-shape>

        </template>
    </th>
</template>

<script lang="ts">
    import { computed, defineComponent, watch } from "vue"
    import { TableHeader, TableSortDirection }  from "../../utils";

    export default defineComponent({
        name: "table-head-th",

        props: {
            header: { type: TableHeader, required: true },
            fixed : { type: Boolean, required: false, default: false },
        },

        emits: [ "sort" ],

        setup(props, { emit }) {
            ////////// init

            const icon = computed(() => props.header.isSorted() ? (props.header.isSortedUp() ? "circle-sort-down" : "circle-sort-up") : "circle-sort")
            const classes = computed(() => ({
                "text-center"   : props.header.isCenter(),
                "text-end"      : props.header.isRight(),
                "cursor-pointer": props.header.isSortable(),
                "fixed-cell"    : props.fixed
            }))

            const sort = () => {
                if (props.header.isSortable()) {
                    // eslint-disable-next-line vue/no-mutating-props
                    props.header.sort()
                }
            }

            watch(() => props.header.tableSort?.direction, (newValue) => emit("sort", newValue as TableSortDirection))

            return {
                icon,
                classes,
                sort
            }
        }
    })
</script>

<style lang="scss" scoped>

</style>
