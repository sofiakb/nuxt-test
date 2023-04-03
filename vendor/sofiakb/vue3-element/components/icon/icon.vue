<template>
    <ssf-font-awesome-icon
        v-if="isFontAwesome"
        :key="`font-awesome-key-${componentKey}`"
        :animated="animated"
        :brand="options.brand"
        :duotone="options.duotone"
        :fw="fw"
        :icon="icon"
        :light="options.light"
        :normal="options.normal"
        :pull="pull"
        :regular="options.regular"
        :rotate="rotate"
        :size="size"
        :solid="options.solid"
        :thin="options.thin"/>

    <ssf-line-awesome-icon
        v-else-if="isLineAwesome"
        :key="`font-awesome-key-${componentKey}`"
        :animated="animated"
        :brand="options.brand"
        :fw="fw"
        :icon="icon"
        :light="options.light"
        :normal="options.normal"
        :pull="pull"
        :regular="options.regular"
        :rotate="rotate"
        :size="size"
        :solid="options.solid"/>
</template>

<script lang="ts">
    import SsfFontAwesomeIcon                                             from "./font-awesome-icon.vue";
    import SsfLineAwesomeIcon                                             from "./line-awesome-icon.vue";
    import * as Icons                                                     from "./utils/icons";
    import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";

    export default defineComponent({
        name: "ssf-icon",

        components: { SsfLineAwesomeIcon, SsfFontAwesomeIcon },

        props: {

            /* ICON TYPE */
            type    : { type: String, required: false, default: "fa" },
            fa      : { type: Boolean, required: false, default: false },
            la      : { type: Boolean, required: false, default: false },
            material: { type: Boolean, required: false, default: false },

            /* STRONG */
            // FONT AND LINE AWESOME
            solid  : { type: Boolean, required: false, default: false },
            regular: { type: Boolean, required: false, default: false },
            light  : { type: Boolean, required: false, default: false },
            thin   : { type: Boolean, required: false, default: false },
            duotone: { type: Boolean, required: false, default: false },
            normal : { type: Boolean, required: false, default: false },
            brand  : { type: Boolean, required: false, default: false },

            // MATERIAL
            outlined: { type: Boolean, required: false, default: true },
            rounded : { type: Boolean, required: false, default: false },
            filled  : { type: Boolean, required: false, default: false },
            twoTone : { type: Boolean, required: false, default: false },
            sharp   : { type: Boolean, required: false, default: false },

            // COMPATIBILITY OLD VERSION
            weight: { type: String, required: false },

            /* ICON */
            icon: {
                type     : String,
                required : true,
                validator: (value: string) => Icons.fontAwesome.includes(value) || true
            },

            size: { type: String, required: false, default: "" },

            /* FONT AWESOME */
            fw      : { type: Boolean, required: false, default: false },
            animated: { type: Boolean, required: false, default: false },
            rotate  : { type: String, required: false, default: "" },
            pull    : { required: false, default: false }
        },

        setup(props) {

            const options = reactive({
                regular : false,
                solid   : false,
                light   : false,
                thin    : false,
                duotone : false,
                normal  : false,
                brand   : false,
                outlined: false,
                rounded : false,
                filled  : false,
                twoTone : false,
                sharp   : false,
            })

            const isLineAwesome = computed(() => props.type === "la" || props.la)
            const isMaterial = computed(() => props.type === "material" || props.material)
            const isFontAwesome = computed(() => !isLineAwesome.value && !isMaterial.value && props.type === "fa" || props.fa)

            const componentKey = ref(0)
            const forceUpdate = () => componentKey.value++
            watch(() => props.icon, () => forceUpdate())
            watch(() => props.weight, () => initWeight())

            const initWeight = () => {
                const weights: string[] = [
                    "regular",
                    "solid",
                    "light",
                    "thin",
                    "duotone",
                    "normal",
                    "brand",
                    "outline",
                    "rounded",
                    "filled",
                    "twoTone",
                    "sharp",
                ]

                if (props.weight)
                    // @ts-ignore
                    options[props.weight] = true
                else
                    for (const weight of weights)
                        // @ts-ignore
                        options[weight] = props[weight]
                forceUpdate()
            }

            onMounted(() => initWeight())

            return {
                options,

                isLineAwesome,
                isFontAwesome,

                componentKey
            }
        },

    })
</script>

<style lang="scss">
    .fa-1x5,
    .la-1x5 {
        font-size: 1.5em !important;
    }
</style>
