<template>
    <div :class="colClass" :style="colStyle">
        <slot/>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from "vue";
    import { toNumberStyle }             from "../utils";

    export default defineComponent({
        name: "ssf-col",

        props: {
            size: { type: [ Number, String ], required: false },
            xs  : { type: [ Number, String ], required: false },
            sm  : { type: [ Number, String ], required: false },
            md  : { type: [ Number, String ], required: false },
            lg  : { type: [ Number, String ], required: false },
            xl  : { type: [ Number, String ], required: false },

            maxWidth: { type: [ Number, String ], required: false },

            noPadding     : { type: Boolean, default: false },
            withPadding   : { type: Boolean, default: false },
            center        : { type: Boolean, default: false },
            verticalCenter: { type: Boolean, default: false }
        },

        setup(props) {

            return {
                colClass: computed(() => {
                    let classes = "";
                    if (props.xs || props.size) classes = classes.trim() + ` col-${props.xs || props.size}`;
                    if (props.sm) classes = classes.trim() + ` col-sm-${props.sm}`;
                    if (props.md) classes = classes.trim() + ` col-md-${props.md}`;
                    if (props.lg) classes = classes.trim() + ` col-lg-${props.lg}`;
                    if (props.xl) classes = classes.trim() + ` col-xl-${props.xl}`;

                    if (props.noPadding) classes = classes.trim() + " px-0";
                    if (props.withPadding && !props.noPadding) classes = classes.trim() + " with-padding";
                    if (props.verticalCenter) classes = classes.trim() + " align-flex";

                    if (!classes.includes("col")) {
                        classes = `col ${classes}`
                    }

                    if (props.center) {
                        classes = `${classes} mx-auto`
                    }

                    classes += " ssf__col"

                    return classes.split(" ").filter(item => item.trim() !== "").join(" ")
                }),

                colStyle: computed(() => {
                    const maxWidth = toNumberStyle(props.maxWidth)

                    return maxWidth ? { "max-width": maxWidth, "flex": `0 0 ${maxWidth}` } : null
                })
            }
        },

    })
</script>

<style lang="scss" scoped>
    .ssf__col {

        &.with-padding {
            --col-padding: 15px;
            padding-left: var(--col-padding);
            padding-right: var(--col-padding);
        }

    }
</style>
