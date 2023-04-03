<template>
    <div class="card">

        <ssf-container v-if="hasSlot('header')"
                       :class="headerClass"
                       class="card-header"
                       name="card-header">
            <slot name="header"/>
        </ssf-container>

        <ssf-container v-if="hasSlot('body')"
                       :class="bodyClass"
                       class="card-body"
                       name="card-body">
            <slot name="body"/>
        </ssf-container>

        <ssf-container v-if="hasSlot('footer')"
                       :class="footerClass"
                       class="card-footer"
                       name="card-footer">
            <slot name="footer"/>
        </ssf-container>

    </div>
</template>

<script lang="ts">
    import { defineComponent, getCurrentInstance, PropType } from "vue";
    import { hasSlot as MainHasSlot }                        from "../utils";
    import Nullable                                          from "../types/nullable";

    export default defineComponent({
        name: "ssf-card",

        props: {
            headerClass: { type: [ String, null ] as PropType<Nullable<string>>, required: false, default: null },
            bodyClass  : { type: [ String, null ] as PropType<Nullable<string>>, required: false, default: null },
            footerClass: { type: [ String, null ] as PropType<Nullable<string>>, required: false, default: null },
        },

        setup() {
            return {
                hasSlot: (name = "default") => {
                    // @ts-ignore
                    const ctx = getCurrentInstance()
                    return ctx ? MainHasSlot(ctx, name) : null;
                }
            }
        },
    })
</script>

<style scoped>

</style>
