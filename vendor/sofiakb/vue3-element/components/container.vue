<template>
    <div :class="cssClass" v-bind="attrs">
        <slot/>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from "vue";

    export default defineComponent({
        name: "ssf-container",

        props: {
            fluid         : { type: Boolean, required: false },
            container     : { type: Boolean, required: false },
            name          : { type: String, required: false },
            notFull       : { type: Boolean, required: false, default: false },
            noPadding     : { type: Boolean, required: false, default: false },
            expand        : { type: Boolean, required: false, default: false },
            center        : { type: Boolean, required: false, default: false },
            relative      : { type: Boolean, required: false, default: false },
            fullFlex      : { type: Boolean, required: false, default: false },
            fullAbsolute  : { type: Boolean, required: false, default: false },
            topAbsolute   : { type: Boolean, required: false, default: false },
            rightAbsolute : { type: Boolean, required: false, default: false },
            leftAbsolute  : { type: Boolean, required: false, default: false },
            bottomAbsolute: { type: Boolean, required: false, default: false },
            fitContent    : { type: Boolean, required: false, default: false },
            type          : {
                type     : String,
                required : false,
                default  : null,
                validator: (value: string) => [ "block", "inline", "inline-block", "flex" ].includes(value)
            }
        },

        setup(props, { attrs }) {
            return {
                attrs,
                cssClass: computed(() => {
                    const classes = {
                        "container-fluid"  : props.fluid,
                        container          : props.container,
                        "w-100"            : (!props.notFull || props.expand) && !props.fitContent,
                        "h-100"            : props.expand,
                        "mx-auto"          : props.center,
                        "px-0"             : props.noPadding,
                        "position-relative": props.relative,
                        "full-flex"        : props.fullFlex,

                        "full-absolute"  : props.fullAbsolute,
                        "top-absolute"   : props.topAbsolute,
                        "right-absolute" : props.rightAbsolute,
                        "left-absolute"  : props.leftAbsolute,
                        "bottom-absolute": props.bottomAbsolute,
                        "fit-content"    : props.fitContent,
                    }

                    if (props.name) {
                        // @ts-ignore
                        classes[`ssf__container--${props.name}`] = true
                        // @ts-ignore
                        classes[props.name] = true
                    }

                    /*if (props.notFull === false)
                     classes['w-100'] = true*/

                    if (props.type)
                        // @ts-ignore
                        classes[`d-${props.type}`] = true

                    return classes
                })
            }
        }
    })
</script>

<style lang="scss" scoped>
    .fit-content {
        width: fit-content;
    }
</style>
