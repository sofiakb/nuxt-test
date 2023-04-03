<template>
    <ssf-container :class="{'ssf__table-border': !noBorder}" :style="`--table-body-height: ${height}`"
                   class="ssf__table" name="x-table"
                   not-full>
        <slot/>

        <!--        <vue-custom-scrollbar -->
        <!--            style="width: 500px" -->
        <!--            :settings="{wheelPropagation: false, suppressScrollY: true}"> -->

        <vue-custom-scrollbar class="ssf-table-container">

            <ssf-container :class="{'table-responsive': responsive}">

                <table v-if="data" :class="classes" class="table">

                    <caption v-if="caption">
                        {{ caption }}
                    </caption>

                    <table-head :fixed="fixedHead" :header-classes="headerClasses" :headers="headers" @sort="sortData">

                        <template #default>

                            <slot name="head"/>

                        </template>

                    </table-head>

                    <table-body :selectable="selectable"
                                :table-data="rows"
                                @selected="(tableIndex) => $emit('selected', tableData[tableIndex])">

                        <template>

                            <slot name="body"/>

                        </template>

                    </table-body>

                </table>


            </ssf-container>

        </vue-custom-scrollbar>


    </ssf-container>
</template>

<script lang="ts">
    import { each, filter, map, orderBy }                         from "lodash"
    import { computed, defineComponent, reactive, toRefs, watch } from "vue";

    import TableHead                                                       from "./includes/table-head/table-head.vue";
    import TableBody                                                       from "./includes/table-body/table-body.vue";
    import { TableColumn, TableHeader, TablePosition, TableSortDirection } from "./utils";

    import { PerfectScrollbar as VueCustomScrollbar } from "vue3-perfect-scrollbar"
    import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css"

    import { defined } from "../../utils";

    export default defineComponent({
        name: "ssf-table",

        components: { TableHead, TableBody, VueCustomScrollbar },

        props: {
            data      : { type: [ Array, Object ], required: true },
            noBorder  : { type: [ Boolean, String ], required: false, default: false },
            selectable: { type: Boolean, required: false, default: false },

            responsive: { type: Boolean, required: false, default: false },
            striped   : { type: Boolean, required: false, default: false },
            hoverable : { type: Boolean, required: false, default: false },
            bordered  : { type: Boolean, required: false, default: false },
            fixedHead : { type: Boolean, required: false, default: false },
            borderless: { type: Boolean, required: false, default: false },
            small     : { type: Boolean, required: false, default: false },

            tableClasses : { type: [ String, Object ], required: false, default: "" },
            headerClasses: { type: [ String, Object ], required: false, default: "" },

            height: { type: [ String, Number ], required: false, default: "auto" },

            caption: { type: String, required: false },
        },

        emits: [ "sort", "selected" ],

        setup(props, { slots, emit }) {

            const state = reactive({
                headers  : [] as TableHeader[],
                rows     : [] as TableColumn[][],
                tableData: [] as any[],
                slots    : null as any
            })

            const initTable = () => {
                initHeader();
                initRows();
            }
            const initHeader = () => {
                state.headers = map({ ...state.slots }, (item): TableHeader => TableHeader.create({
                    label   : item.props.label,
                    prop    : item.props.prop,
                    sortable: defined(item.props.sortable) ? item.props.sortable === "" : item.type.props.sortable?.default ?? false,
                    position: item.props.position ?? item.type.props.position?.default ?? TablePosition.LEFT,
                }))
            }
            const initRows = () => {
                state.rows = []
                each(state.tableData, (row) => {

                    state.rows.push(
                        map({ ...state.slots }, (item): TableColumn => {
                            let dataValue: any = row[item.props.prop];
                            if (item.props.prop?.includes(".")) {
                                const splat: string[] = item.props.prop.split(".");

                                dataValue = row[splat[0].replace("?", "")];

                                if (dataValue)
                                    splat.slice(1).forEach((element) => {
                                        if (dataValue) dataValue = dataValue[element.replace("?", "")] ?? null;
                                    });
                            }

                            return TableColumn.create({
                                prop     : item.props.prop,
                                value    : dataValue,
                                position : item.props.position ?? item.type.props.position?.default ?? TablePosition.LEFT,
                                clickable: props.selectable,
                                casts    : item.props.casts,
                                classes  : item.props.classes
                            });
                        })
                    )

                })
            }

            const render = (refreshData = true) => {
                if (refreshData)
                    state.tableData = props.data as any[]

                // @ts-ignore
                const $slots = filter(slots.default ? slots.default() ?? null : null, (slot) => slot.type.name === "table-column-bridge")
                if (!$slots)
                    return null
                state.slots = $slots
                initTable()
            }

            watch(() => props.data, () => render(), { immediate: true })

            const sortData = ({ header, direction }: { header: TableHeader, direction: TableSortDirection }) => {
                // @ts-ignore
                state.tableData = orderBy(state.tableData, header.prop, `${header.isSortedUp() || !header.isSorted() ? "asc" : "desc"}`)
                initRows()
                emit("sort", { header, direction }, state.tableData)
            }

            return {
                ...toRefs(state),

                sortData,

                classes: computed(() => {
                    let propsTableClasses = props.tableClasses
                    if (typeof props.tableClasses === "string") {
                        const classes = props.tableClasses.split(" ")
                        const fillTrue = Array(classes.length).fill(true)
                        propsTableClasses = fillTrue.reduce(function (result, field, index) {
                            result[classes[index]] = field;
                            return result;
                        }, {})
                    }

                    return ({
                        ...propsTableClasses as Record<string, unknown>,
                        "table-striped"   : props.striped,
                        "table-bordered"  : props.bordered,
                        "table-borderless": props.borderless,
                        "table-hoverable" : props.hoverable,
                        "table-sm"        : props.small,
                        "table-fixed-head": props.fixedHead,
                    });
                })
            }

        },
    })
</script>

<style lang="scss" scoped>
    .ssf__container--x-table {

        /*thead .fixed-cell {
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            z-index: 3;
            box-shadow: var(--datatable-border-color) 0 1px;
            background-color: #fff;
        }*/

        /*.table-fixed-head tbody {
            //height: var(--table-body-height, 250px);
            //overflow-y: auto;
            //width: 100%;
        }

        .table-fixed-head {
            overflow-y: auto;
            height: var(--table-body-height, 250px) !important;
        }

        .table-fixed-head thead th {
            position: sticky;
            top: 0;
            z-index: 1;
        }
        */

        .ssf-table-container {
            height: var(--table-body-height);

            .table-fixed-head {
                thead {
                    position: sticky;
                    top: 0;
                }
            }
        }


    }
</style>
