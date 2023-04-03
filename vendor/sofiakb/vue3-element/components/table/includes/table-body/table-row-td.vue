<template>
    <td :class="[ classes, object.classes ]">

        <span v-html="object.casts ? object.casts(object.value) : object.value"/>

    </td>
</template>

<script lang="ts">
    import { computed, defineComponent } from "vue"
    import { TableColumn }               from "../../utils";

    export default defineComponent({

        name: "table-row-td",

        props: {
            object: { type: TableColumn, required: true },
        },


        setup(props) {


            return {
                classes: computed(() => ({
                    "text-center": props.object.isCenter(),
                    "text-end"   : props.object.isRight(),
                }))
            }
        }

    })
</script>

<style lang="scss" scoped>


</style>

