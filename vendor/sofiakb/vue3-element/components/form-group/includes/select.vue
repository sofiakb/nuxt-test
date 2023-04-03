<template>
    <div :class="{'ssf-form-select-multiple': multiple}"
         class="ssf-input-container ssf-form-select"
         @click="toggleShowItems">

        <ssf-input-label
            v-if="label"
            :key="`select-label-${label}`"
            :icon="icon"
            :focused="focused"
            @click="onLabelClick"
            :label="label"/>

        <ssf-container
            class="ssf-select-container"
            @dblclick="onDoubleClick">

            <ssf-container class="selector-triangle" not-full/>

            <ssf-container
                :id="name"
                :class="inputClass"
                class="ssf-form-control"
                name="form-control">

                <vue-custom-scrollbar
                    :class="{open: show.items}"
                    :options="{wheelPropagation: wheelPropagation, suppressScrollX: !scrollX}"
                    :style="{height: ssfContainerHeight}"
                    class="ssf-select-input-container">

                    <ssf-container
                        ref="ssfTextContainer"
                        :class="{open: show.items}"
                        class="ssf-text-container"
                        name="text-container">
                        <span :value="modelValue">{{ textValue }}</span>
                    </ssf-container>

                    <ssf-container
                        class="ssf-value-container"
                        name="value-container">

                        <ul v-show="show.items" id="ssfValueList" ref="ssfValueList">
                            <template v-for="(item, index) in optionItems" :key="`item-${index}`">

                                <li v-if="optionItems && optionField"
                                    :class="{selected: selectedValue(item)}"
                                    class="ssf-value-item"
                                    @click.stop="onSelectedOption(item[optionField])">
                                    {{ optionLabel ? item[optionLabel] : item[optionField] }}
                                </li>
                                <li
                                    v-else-if="optionItems"
                                    :class="{selected: selectedValue(item)}"
                                    class="ssf-value-item"
                                    @click.stop="onSelectedOption(item)">
                                    {{ item }}
                                </li>

                            </template>
                        </ul>
                    </ssf-container>
                </vue-custom-scrollbar>

            </ssf-container>

        </ssf-container>
    </div>
</template>


<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css"/>

<script lang="ts">
    import { PerfectScrollbar as VueCustomScrollbar } from "vue3-perfect-scrollbar"

    import SsfInputLabel                                                           from "./input-label.vue";
    import { computed, defineComponent, nextTick, PropType, reactive, ref, watch } from "vue";
    import IconProperties
                                                                                   from "../utils/icon-properties";
    import Nullable
                                                         from "../../../types/nullable";
    import { concat, filter, find, includes, min, size } from "lodash";

    export default defineComponent({
        name: "ssf-select",

        components: {
            SsfInputLabel,
            VueCustomScrollbar
        },

        props: {

            /* CONTAINERS */
            inputClass: { type: [ String, Object ], required: true, default: "" },

            /* COMMONS */
            name      : { type: [ String, Object ], required: true },
            label     : { type: [ String ], required: true },
            modelValue: { type: Object as PropType<any>, required: true, default: null },
            required  : { type: Boolean, required: true, default: false },

            /* SELECT */
            optionItems     : { type: [ Array, Object ], required: true },
            optionField     : { type: String as PropType<string | undefined>, required: false },
            optionLabel     : { type: String, required: true, default: "label" },
            // optionGroup     : { type: Boolean, required: true, default: false },
            multiple        : { type: Boolean, required: true, default: false },
            scrollX         : { type: Boolean, required: true, default: false },
            wheelPropagation: { type: Boolean, required: true, default: true },
            selectHeight    : { type: [ Number, String ], required: true, default: 350 },

            /* INPUT */
            // disabled    : { type: Boolean, required: false, default: false },
            // placeholder : { type: String as PropType<string | undefined>, required: false },
            // autocomplete: { type: String as PropType<string | undefined>, required: false },

            /* ICONS */
            icon: { type: [ String, Object ] as PropType<string | IconProperties>, required: false, default: null },
        },

        emits: [ "input" ],

        setup(props, { emit }) {

            const show = reactive({ items: false })
            const ssfContainerHeight = ref<string | number>(0)
            const focused = ref(false)
            const ssfValueList = ref<Nullable<HTMLUListElement>>(null)
            const ssfTextContainer = ref<Nullable<any>>(null)

            const textValue = computed(() => {
                if (props.modelValue && !props.multiple && !Array.isArray(props.modelValue)) {
                    if (props.optionLabel) {
                        const result = find(props.optionItems, (item: any) => (props.optionField ? item[props.optionField] : item) === props.modelValue)
                        return result[props.optionLabel] ?? result
                    } else {
                        return props.modelValue
                    }
                } else if (props.modelValue && props.multiple && Array.isArray(props.modelValue) && size(props.modelValue) > 0)
                    return (filter(props.optionItems, (item: any) => includes(props.modelValue, props.optionField ? item[props.optionField] : item)).map((item: any) => item[props.optionLabel]).join(", "))
                else if (show.items || !props.label)
                    return `Choisir une valeur... ${props.required ? "(*)" : ""}`
                return null
            })


            const getSsfContainerHeight = () => {
                const element = ssfValueList.value
                return element && element.clientHeight > 0 ? `${min([props.selectHeight, element.clientHeight + ssfTextContainer.value.$el.clientHeight])}px` : "inherit";
            }
            const updateContainerHeight = () => ssfContainerHeight.value = getSsfContainerHeight()

            const toggleShowItems = () => {
                show.items = !show.items
                nextTick(() => updateContainerHeight())
            }

            const selectedValue = (item: any) => {
                if (!props.multiple || !Array.isArray(props.modelValue)) {
                    if (props.optionField && props.optionLabel)
                        return item[props.optionField] === props.modelValue
                    else return item === props.modelValue
                } else {
                    if (props.optionField && props.optionLabel)
                        return props.optionField ? find(props.modelValue, (data :any) => props.optionField ?  item[props.optionField] === data : undefined) : null
                    else return find(props.modelValue, (data :any) => item === data)
                }
            }

            const onSelectedOption = (value: any) => {
                if (!props.multiple)
                    toggleShowItems()
                else {
                    if (Array.isArray(props.modelValue))
                        value = find(props.modelValue, (data: any) => data === value) ? filter(props.modelValue, (data: any) => data !== value) : concat(props.modelValue, [ value ])
                    else value = props.modelValue ? [ props.modelValue, value ] : [ value ]
                }
                emit("input", value)
            }

            const onDoubleClick = (event: any) => event.preventDefault()

            watch(() => props.optionItems, () => nextTick(() => updateContainerHeight()))
            watch(() => props.modelValue, () => focused.value = !!props.modelValue && props.modelValue.toString().trim() !== "")

            return {

                show,
                ssfContainerHeight,
                focused,

                ssfValueList,
                ssfTextContainer,

                textValue,

                onLabelClick() {
                    focused.value = true
                },

                toggleShowItems,
                selectedValue,
                onSelectedOption,
                onDoubleClick

            }
        },
    })
</script>

<style lang="scss" scoped>
    .ssf-form-select {
        &.ssf-form-select-multiple {
            .ssf-form-control {
                height: auto !important;
            }
        }

        .ssf-select-container {
            position: relative;
            cursor: pointer;

            .selector-triangle {
                position: absolute;
                top: 0;
                right: 10px;
                bottom: 0;
                margin-top: auto;
                margin-bottom: auto;
                width: 5px;
                height: 5px;
                border-right: 1px solid black;
                border-bottom: 1px solid black;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
            }

            .ssf-select-input-container {
                &.open {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    box-shadow: 0 2px 5px 0 rgba(255, 255, 255, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
                    background: #FFF;
                    -webkit-border-radius: var(--form-radius);
                    -moz-border-radius: var(--form-radius);
                    border-radius: var(--form-radius);
                    z-index: 1051;

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

            .ssf-text-container {
                &.open {
                    height: 50px;
                    line-height: 50px;
                    padding-left: 10px;
                    width: 100%;
                    color: #dddddd;
                }
            }

            .ssf-value-container {
                & > ul {
                    padding: 0;
                    margin: 0;
                }

                & li {
                    list-style-type: none;
                    padding: 10px;

                    &:last-of-type {
                        -webkit-border-bottom-left-radius: var(--form-radius);
                        -moz-border-radius-bottomleft: var(--form-radius);
                        border-bottom-left-radius: var(--form-radius);
                        -webkit-border-bottom-right-radius: var(--form-radius);
                        -moz-border-radius-bottomright: var(--form-radius);
                        border-bottom-right-radius: var(--form-radius);
                    }

                    &.ssf-value-item {
                        &:hover {
                            background: #000;
                            color: #FFF;
                        }

                        &.selected {
                            background: #ddd;
                        }
                    }
                }
            }

        }
    }
</style>
