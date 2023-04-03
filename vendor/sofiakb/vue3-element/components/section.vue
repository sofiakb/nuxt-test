<template>
    <section :class="classes">
        <slot/>
    </section>
</template>

<script lang="ts">
    import { computed, defineComponent } from "vue";

    export default defineComponent({
        name: "ssf-section",

        props: {
            name   : { type: String, required: false },
            notFull: { type: Boolean, required: false, default: false },
        },

        setup(props) {
            return {
                classes: computed(() => {
                    const classes: any = {
                        "w-100": !props.notFull,
                    }

                    if (props.name) {
                        classes[`ssf__section--${props.name}`] = true
                        classes[props.name] = true
                    }

                    return classes
                })
            }
        },
    })
</script>

<style scoped>

</style>
