<template>
    <div :class="classes" :data-initial="initial"
         :style="style"
         class="initial-item">
        {{ initialContent }}
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from "vue";

    import "./assets/css/ssf-initial.min.css"

    export default defineComponent({
        name: "ssf-initial",

        props: {
            content    : { type: String, required: false },
            fullContent: { type: String, required: false },
            expand     : { type: Boolean, required: false, default: false },
            size       : { type: [ String, Number ], required: false },
            width      : { type: [ String, Number ], required: false },
            circle     : { type: Boolean, required: false, default: false },
            center     : { type: Boolean, required: false, default: false },
            rounded    : { type: Boolean, required: false, default: false },
        },

        setup(props) {

            return {
                initial: computed(() => (props.content ?? props.fullContent ?? "")[0].toUpperCase()),
                classes: computed(() => ({
                    "h-100 w-100"   : props.expand,
                    "rounded-circle": props.circle,
                    "rounded"       : props.rounded,
                    "full-flex"     : props.center,
                })),

                style: computed(() => ({
                    height: props.size ? `${props.size}px` : undefined,
                    width : props.size || props.width ? `${props.size || props.width}px` : undefined,
                })),

                initialContent: computed(() => props.fullContent ? props.fullContent.split(" ").map((word) => word[0]).join("") : props.content)
            }
        }

    })
</script>
