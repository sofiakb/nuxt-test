<template>
    <hr v-if="isHex" :class="hrClass" :style="{'border-color': hexColor, ...hrStyle}"/>
    <hr v-else :class="`${color ? 'border-'+color : ''} ${hrClass}`" :style="hrStyle"/>
</template>

<script lang="ts">
    import { computed, defineComponent } from "vue"

    export default defineComponent({
        name: "ssf-line",

        props: {
            color    : { type: String, required: false, },
            noMargin : { type: Boolean, required: false },
            thickness: { type: [ Number, String ], required: false, default: 1 },
        },

        setup(props) {

            const hexColor = computed(() => props.color ? `#${props.color}`.replace("##", "#") : null)

            return {

                isHex: computed(() => props.color && hexColor.value && /^#([\dA-F]{3}){1,2}$/i.test(hexColor.value ?? "")),

                hrClass: computed(() => {
                    let classes = "";

                    if (props.noMargin) {
                        classes = `${classes} m-0`
                    }

                    return classes.split(" ").filter(item => item.trim() !== "").join(" ")
                }),

                hrStyle: computed(() => ({
                    "border-width": `${props.thickness}px`
                })),

                hexColor

            }
        }
    })
</script>

<style lang="scss" scoped>

</style>
