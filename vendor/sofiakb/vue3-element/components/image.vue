<template>
    <img ref="lazyRef" v-bind="{ height, width, alt }"/>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, watch } from "vue";

    import { src } from "../utils";


    export default defineComponent({
        name: "ssf-image",

        props: {
            height   : { type: [ String, Number ], required: false },
            width    : { type: [ String, Number ], required: false },
            alt      : { type: String, required: true },
            src      : { type: String, required: true },
            strictSrc: { type: Boolean, required: false },
        },

        emits: [ "loaded", "error", "loading" ],

        setup(props, { emit }) {

            const refreshSrc = () => imageSrc.value = props.strictSrc ? props.src : src(props.src)
            const imageSrc = ref(props.strictSrc ? props.src : src(props.src))

            // const lazyRef = useLazyload(imageSrc, {
            //     lifecycle: {
            //         loading: (image: any) => emit("loading", { image }),
            //         error  : (image: any) => emit("error", { image }),
            //         loaded : (image: any) => emit("loaded", { image })
            //     }
            // })

            onMounted(async () => await refreshSrc())
            watch(() => props.src, async () => await refreshSrc())

            return {
                // lazyRef
            }
        }
    })
</script>

<style scoped>

</style>
