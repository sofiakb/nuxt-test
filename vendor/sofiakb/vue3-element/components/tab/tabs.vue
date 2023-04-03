<template>
    <ssf-container name="tabs" not-full>

        <ssf-row class="ssf__tab-navs">

            <ssf-col v-for="(tab, index) in tabs"
                     :key="index"
                     :class="{'active': index === selectedIndex}"
                     class="cursor-pointer ssf__tab-item"
                     no-padding
                     @click="selectTab(index)">

                <ssf-container :class="tab.props['class']" class="py-3" fit-content name="ssf__tab-item-title">

                    <span class="d-inline-block">{{ tab.props.title }}</span>

                </ssf-container>

            </ssf-col>

        </ssf-row>

        <slot></slot>

    </ssf-container>
</template>

<script lang="ts">
    import { defineComponent, onBeforeMount, onMounted, provide, reactive, toRefs, VNode } from "vue";

    interface TabProps {
        title: string;
        class: string;
    }

    export default defineComponent({

        name: "ssf-tabs",

        props: {
            currentIndex: { type: Number, required: false, default: 0 }
        },

        emits: [ "tab-changed" ],

        setup(props, { slots, emit }) {
            const state = reactive({
                selectedIndex: props.currentIndex,
                tabs         : [] as VNode<TabProps>[],
                count        : 0
            });

            provide("TabsProvider", state);

            const selectTab = (i: number) => {
                state.selectedIndex = i;
                emit("tab-changed", i)
            };

            onBeforeMount(() => {
                if (slots.default) {
                    // @ts-ignore
                    state.tabs = slots.default().filter((child) => child.type.name === "ssf-tab");
                }
            });

            onMounted(() => {
                selectTab(0);
            });

            return { ...toRefs(state), selectTab };
        }
    });
</script>

<style lang="scss">
.ssf__tab-item {
        color: gray;

        &.active {
            color: var(--color-1);

            .ssf__tab-item-title {
                position: relative;

                &::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    width: 100%;
                    background: var(--color-1);
                }

            }

        }

        &:hover {
            .ssf__tab-item-title {
                color: var(--color-1);
            }
        }

    }
</style>
