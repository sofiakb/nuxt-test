<template>
    <div class="ssf-input-container ssf-form-date">

        <input-label key="date-label" :icon="icon" :label="parent.label" :placeholder="placeholder"
                     @label-click="onLabelClick"/>

        <!-- TYPE : DATE -->
        <div class="ssf-date-container" @click="toggleShowItems" @dblclick="onDoubleClick">
            <div :class="parent.inputClass" class="ssf-form-control">
                <div ref="ssfTextContainer" class="ssf-text-container">
                    <input v-if="parent.modelValue && value" v-model="value"
                           class="h-100 w-100 bg-transparent ssf-form-control"/>
                    <!--          <span v-if="parent.modelValue" :value="parent.modelValue">{{ parent.modelValue }}</span> -->

                </div>
                <div :class="{open: show.items}" :style="{height: ssfContainerHeight}" class="ssf-date-input-container">
                    <ssf-calendar v-show="show.items"
                                  ref="calendarContainer"
                                  :value="parent.modelValue"
                                  @selected="onSelected"
                                  @click.stop="removeEvent"/>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    /* eslint-disable */
    // @ts-nocheck
import { defineComponent } from "vue";

    import SsfCalendar from "./calendar.vue";
    import InputLabel  from "../../../input-label.vue";

    import { moment } from "../../../../utils"

    export default defineComponent({
        name: "ssf-input-date",

        components: { SsfCalendar, InputLabel },

        props: {},

        emits: [ "focus", "change", "input" ],

        data: () => ({
            focused           : false,
            show              : { items: false },
            ssfContainerHeight: 0,
            moment,
            dateValue: null
        }),

        computed: {

            icon() {
                return this.parent.$data.options.icon
            },

            parent() {
                return this.$parent
            },

            format() {
                return this.parent.dateFormat
            },

            placeholder() {
                let placeholder = this.parent.placeholder, label = this.parent.label;
                return (placeholder === true) ? label : (typeof placeholder).toLowerCase() === "string" ? placeholder : ""
            },

            autocomplete() {
                let autocomplete = this.parent.autocomplete;
                return `${autocomplete ? autocomplete === true ? this.parent.name : autocomplete : ""}`
            },
        },

        watch: {
            dateValue() {
                if (this.value.length === this.format.length) {
                    this.value = this.$date.moment(this.value, this.format).format(this.format);
                    this.$emit("input", this.value.format(this.parent.format));
                }
            }
        },


        mounted() {
            this.$nextTick(() => {
                this.ssfContainerHeight = this.getSsfContainerHeight()
            })
            this.value = this.$date.moment(this.parent.modelValue, this.format).format(this.format)
        },

        methods: {

            removeEvent(event) {
                event.preventDefault()
            },

            getSsfContainerHeight() {
                let element = this.$refs.calendarContainer.$el
                return element && element.offsetHeight > 0 ? `${element.offsetHeight}px` : "inherit";
            },

            toggleShowItems() {
                this.show.items = !this.show.items
                this.$nextTick(() => {
                    this.ssfContainerHeight = this.getSsfContainerHeight()
                })
            },

            onLabelClick() {
                this.$nextTick(() => {
                    this.focused = true
                    this.toggleShowItems()
                    this.$forceUpdate()
                })
            },

            onSelected(date: any, index?: any) {
                this.toggleShowItems()
                this.$emit("input", (this.value = index ? index.format(this.parent.format) : null))
            },

            onDoubleClick(event) {
                event.preventDefault()
            },

            onInput() {
                this.$nextTick(() => {
                    this.$emit("input", this.$refs.inputComponent.value)
                })
            }
        }
    })
</script>

<style lang="scss" scoped>
.ssf-date-container {
        position: relative;
        cursor: pointer;

        .ssf-date-input-container {
            &.open {
                position: absolute;
                top: 44px;
                left: 0;
                bottom: 0;
                background: #FFF;
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

        .ssf-text-container {
            input {
                color: inherit;
                padding: 0 !important;
                min-height: inherit !important;
                border: none !important;
            }
        }

        .ssf-text-container.open {
            height: 50px;
            line-height: 50px;
            padding-left: 10px;
            width: 100%;
        }

        .ssf-value-item:hover {
            background: #000;
            color: #FFF;
        }

        .ssf-value-item.selected {
            background: #ddd;
        }

        .ssf-date-option-title {
            color: #ddd;
        }
    }
</style>
