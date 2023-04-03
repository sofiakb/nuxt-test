<template>
    <div v-show="isActive" class="tab">
        <slot/>
    </div>
</template>


<script lang="ts">
    import { defineComponent, inject, onBeforeMount, ref, watch } from "vue";

    export default defineComponent({
        name: "ssf-tab",

        /* eslint-disable */
        props: {
            title  : { type: String, required: true },
            "class": { type: String, required: false },
        },
        /* eslint-enable */

        setup() {
            const index = ref(0);
            const isActive = ref(false);

            const tabs: any = inject("TabsProvider");

            watch(
                () => tabs.selectedIndex,
                () => {
                    isActive.value = index.value === tabs.selectedIndex;
                }
            );

            onBeforeMount(() => {
                index.value = tabs.count;
                tabs.count++;
                isActive.value = index.value === tabs.selectedIndex;
            });
            return { isActive };
        }
    });
</script>
