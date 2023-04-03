<template>
    <div class="ssf-input-container ssf-form-time">

        <input-label v-if="label"
                     key="time-label"
                     :focused="focused"
                     :icon="icon"
                     :label="label"
                     :placeholder="placeholder"
                     @label-click="onLabelClick"/>

        <div class="ssf-time-container" @click="toggleShowItems">

            <div :class="inputClass" class="ssf-form-control parent-form-control">

                <div ref="ssfTextContainer" class="ssf-text-container" style="width: 100%">

                    <!--                    <input v-if="modelValue && timeValue" -->
                    <!--                           v-model="timeValueString" -->
                    <!--                           class="h-100 w-100 bg-transparent ssf-form-control" -->
                    <!--                           @input="onSelected(timeValueString)" -->
                    <!--                           @keyup.enter="onSelected(timeValue, true)"/> -->

                    <span v-if="modelValue" :value="modelValue">{{ modelValue }}</span>
                </div>

                <div :class="{ open: show.items }"
                     :style="{ height: ssfContainerHeight }"
                     class="ssf-time-input-container">

                    <ssf-time-clock v-show="show.items"
                                    ref="clockContainer"
                                    :time-value="modelValue"
                                    time-separator=":"
                                    @selected="onSelected"
                                    @click.stop="removeEvent"/>

                </div>

            </div>

        </div>

    </div>
</template>

<script lang="ts">
    import SsfTimeClock                                                      from "./clock.vue";
    import InputLabel                                                    from "../../../input-label.vue";
    import { defineComponent, nextTick, PropType, reactive, ref, watch } from "vue";
    // import moment                                                        from "moment-timezone";
    import moment, { Moment }                                            from "moment";
    import Nullable                                                      from "../../../../../../types/nullable";

    export default defineComponent({
        name: "ssf-input-time",

        components: { SsfTimeClock, InputLabel },

        props: {

            label       : { type: String as PropType<string | undefined>, required: false },
            // name      : { type: String, required: true },
            inputClass  : { type: [ String, Object ], required: true },
            defaultValue: { required: false },

            modelValue: { type: [ Object, null, String ] as PropType<any>, required: true },

            // disabled: { type: Boolean, required: true },
            // required: { type: Boolean, required: true },

            placeholder: { type: String as PropType<string | undefined>, required: false },
            // autocomplete: { type: String as PropType<string | undefined>, required: false },

            icon: { required: true },

            format     : { type: String, default: "HH:mm:ss" },
            currentTime: { type: Boolean, required: false, default: false },
        },

        emits: [ "focus", "change", "input" ],

        setup(props, { emit }) {

            const $date = (dateValue: Nullable<string | Moment>, format: Nullable<string> = null): Nullable<Moment> => dateValue ? moment(dateValue, format ?? props.format ?? "HH:mm:ss") : (props.currentTime ? moment() : null)

            const clockContainer = ref<any>(null)
            const ssfContainerHeight = ref<string | number>(0)

            const show = reactive({ items: false })
            const focused = ref(false)

            const timeValue = ref<Nullable<Moment>>(null)
            const timeValueString = ref<Nullable<string>>(null)

            // const inputComponent = ref<Nullable<HTMLInputElement>>(null)

            const getSsfContainerHeight = () => {
                const element = clockContainer.value?.$el
                return element && element.offsetHeight > 0 ? `${element.offsetHeight}px` : "inherit";
            }
            const updateContainerHeight = () => ssfContainerHeight.value = getSsfContainerHeight()

            watch(() => timeValue.value, () => {
                timeValueString.value = timeValue.value?.format(props.format) ?? null
                focused.value = !!timeValueString.value && timeValueString.value !== ""
                emit("input", timeValueString.value);
            })

            watch(() => props.modelValue, () => {
                nextTick(() => updateContainerHeight())
                timeValue.value = $date(props.modelValue ?? props.defaultValue, props.format)
            }, { immediate: true })

            const removeEvent = (event: any) => event.preventDefault()

            const toggleShowItems = () => {
                show.items = !show.items
                nextTick(() => updateContainerHeight())
            }

            const onSelected = (time: any, toggle = false) => {
                if (toggle)
                    toggleShowItems()
                timeValue.value = time
                // emit("input", time)
            }

            return {
                clockContainer,
                show,
                focused,
                // timeValue,
                // timeValueString,
                ssfContainerHeight,

                toggleShowItems,
                removeEvent,
                onSelected,

                onLabelClick() {
                    nextTick(() => {
                        focused.value = true;
                        toggleShowItems();
                    })
                },

                // onInput() {
                //     nextTick(() => {
                //         emit("input", inputComponent.value?.value)
                //     })
                // }
            }
        },

    })
</script>

<style lang="scss" scoped>
    .ssf-time-container {
        position: relative;
        cursor: pointer;

        .ssf-time-input-container {
            &.open {
                position: absolute;
                top: calc(100% + 5px);
                left: 0;
                bottom: 0;
                background: #FFF;
                z-index: 1051;
                border-radius: var(--form-radius);

                box-shadow: rgba(149, 157, 165, 0.2) 0 1.75rem 2.5rem !important;;

                &:before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    height: 100%;
                    width: 100%;
                    z-index: -1;
                    background: transparent;
                    cursor: default;
                }
            }
        }

        .ssf-value-container {
            & > ul {
                padding: 0;
                margin: 0;
            }

            li {
                list-style-type: none;
                padding: 10px;
            }
        }

        .parent-form-control {
            display: flex;
            align-items: stretch;
        }

        .ssf-text-container {
            //position: absolute;
            //top: 0;
            //left: 0;
            //right: 0;
            //bottom: 0;
            //height: 100%;
            //width: 100%;


            input {
                color: inherit;
                padding: 0 !important;
                min-height: inherit !important;
                border: none !important;
            }

            &.open {
                height: 50px;
                line-height: 50px;
                padding-left: 10px;
                width: 100%;
            }
        }

        .ssf-value-item:hover {
            background: #000;
            color: #FFF;
        }

        .ssf-value-item.selected {
            background: #ddd;
        }

        .ssf-time-option-title {
            color: #ddd;
        }
    }
</style>
