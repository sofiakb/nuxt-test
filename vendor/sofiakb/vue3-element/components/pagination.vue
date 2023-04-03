<template>
    <ul v-if="!noLiSurround" :class="containerClass">
        <li v-if="firstLastButton" :class="[ pageClass, firstPageSelected ? disabledClass : '' ]">
            <a :class="pageLinkClass" :tabindex="firstPageSelected ? -1 : 0" @click="selectFirstPage()"
               v-html="firstButtonText" @keyup.enter="selectFirstPage()"></a>
        </li>

        <li v-if="!(firstPageSelected && hidePrevNext)"
            :class="[ prevClass, firstPageSelected ? disabledClass : '' ]">
            <a :class="prevLinkClass" :tabindex="firstPageSelected ? -1 : 0" @click="prevPage()"
               v-html="prevText" @keyup.enter="prevPage()"></a>
        </li>

        <li v-for="page in pages" :key="`page-${page}`"
            :class="[ pageClass, page.selected ? activeClass : '', page.disabled ? disabledClass : '', page.breakView ? breakViewClass: '' ]">
            <a v-if="page.breakView" :class="[ pageLinkClass, breakViewLinkClass ]" tabindex="0">
                <slot name="breakViewContent">{{ breakViewText }}</slot>
            </a>
            <a v-else-if="page.disabled" :class="pageLinkClass" tabindex="0">{{ page.content }}</a>
            <a v-else :class="pageLinkClass" tabindex="0"
               @click="handlePageSelected(page.index + 1)"
               @keyup.enter="handlePageSelected(page.index + 1)">{{ page.content }}</a>
        </li>

        <li v-if="!(lastPageSelected && hidePrevNext)"
            :class="[ nextClass, lastPageSelected ? disabledClass : '' ]">
            <a :class="nextLinkClass" :tabindex="lastPageSelected ? -1 : 0" @click="nextPage()"
               v-html="nextText" @keyup.enter="nextPage()"></a>
        </li>

        <li v-if="firstLastButton" :class="[ pageClass, lastPageSelected ? disabledClass : '' ]">
            <a :class="pageLinkClass" :tabindex="lastPageSelected ? -1 : 0" @click="selectLastPage()"
               v-html="lastButtonText" @keyup.enter="selectLastPage()"></a>
        </li>
    </ul>

    <div v-else :class="containerClass">
        <a v-if="firstLastButton" :class="[ pageLinkClass, firstPageSelected ? disabledClass : '' ]" tabindex="0"
           @click="selectFirstPage()" v-html="firstButtonText"
           @keyup.enter="selectFirstPage()"></a>
        <a v-if="!(firstPageSelected && hidePrevNext)"
           :class="[ prevLinkClass, firstPageSelected ? disabledClass : '' ]" tabindex="0"
           @click="prevPage()" v-html="prevText" @keyup.enter="prevPage()"></a>
        <template v-for="page in pages" :key="`page-${page}`">
            <a v-if="page.breakView" :class="[ pageLinkClass, breakViewLinkClass, page.disabled ? disabledClass : '' ]"
               tabindex="0">
                <slot name="breakViewContent">{{ breakViewText }}</slot>
            </a>
            <a v-else-if="page.disabled" :class="[ pageLinkClass, page.selected ? activeClass : '', disabledClass ]"
               tabindex="0">{{ page.content }}</a>
            <a v-else :class="[ pageLinkClass, page.selected ? activeClass : '' ]" tabindex="0"
               @click="handlePageSelected(page.index + 1)"
               @keyup.enter="handlePageSelected(page.index + 1)">{{ page.content }}</a>
        </template>
        <a v-if="!(lastPageSelected && hidePrevNext)"
           :class="[ nextLinkClass, lastPageSelected ? disabledClass : '' ]" tabindex="0"
           @click="nextPage()" v-html="nextText" @keyup.enter="nextPage()"></a>
        <a v-if="firstLastButton" :class="[ pageLinkClass, lastPageSelected ? disabledClass : '' ]" tabindex="0"
           @click="selectLastPage()" v-html="lastButtonText" @keyup.enter="selectLastPage()"></a>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onBeforeUpdate, ref } from "vue";

    export default defineComponent({
        name: "ssf-pagination",

        props: {
            value: {
                type: Number
            },

            pageCount: {
                type    : Number,
                required: true
            },

            forcePage: {
                type: Number
            },

            clickHandler: {
                type   : Function,
                default: () => null
            },

            pageRange: {
                type   : Number,
                default: 3
            },

            marginPages: {
                type   : Number,
                default: 1
            },

            prevText: {
                type   : String,
                default: "Prev"
            },

            nextText: {
                type   : String,
                default: "Next"
            },

            breakViewText: {
                type   : String,
                default: "…"
            },

            containerClass: {
                type: String
            },

            pageClass: {
                type: String
            },

            pageLinkClass: {
                type: String
            },

            prevClass: {
                type: String
            },

            prevLinkClass: {
                type: String
            },

            nextClass: {
                type: String
            },

            nextLinkClass: {
                type: String
            },

            breakViewClass: {
                type: String
            },

            breakViewLinkClass: {
                type: String
            },

            activeClass: {
                type   : String,
                default: "active"
            },

            disabledClass: {
                type   : String,
                default: "disabled"
            },

            noLiSurround: {
                type   : Boolean,
                default: false
            },

            firstLastButton: {
                type   : Boolean,
                default: false
            },

            firstButtonText: {
                type   : String,
                default: "First"
            },

            lastButtonText: {
                type   : String,
                default: "Last"
            },

            hidePrevNext: {
                type   : Boolean,
                default: false
            }
        },

        emits: [ "input" ],

        setup(props, { emit }) {

            const innerValue = ref(1)
            const selected = computed({
                get: () => props.value ?? innerValue.value,
                set: (newValue: number) => innerValue.value = newValue
            })

            const handlePageSelected = (_selected: any) => {
                if (selected.value === _selected) return

                innerValue.value = _selected
                emit("input", _selected)
                if (props.clickHandler)
                    props.clickHandler(_selected)
            }

            onBeforeUpdate(() => {
                if (props.forcePage === undefined) return
                if (props.forcePage !== selected.value) {
                    selected.value = props.forcePage
                }
            })

            return {

                handlePageSelected,

                prevPage: () => {
                    if (selected.value <= 1) return
                    handlePageSelected(selected.value - 1)
                },

                nextPage: () => {
                    if (selected.value >= props.pageCount) return
                    handlePageSelected(selected.value + 1)
                },

                selectFirstPage: () => {
                    if (selected.value <= 1) return
                    handlePageSelected(1)
                },

                selectLastPage: () => {
                    if (selected.value >= props.pageCount) return
                    handlePageSelected(props.pageCount)
                },

                firstPageSelected: computed(() => selected.value === 1),
                lastPageSelected : computed(() => (selected.value === props.pageCount) || (props.pageCount === 0)),

                pages: computed(() => {
                    const items: any = {}
                    if (props.pageCount <= props.pageRange) {
                        for (let index = 0; index < props.pageCount; index++) {
                            items[index] = {
                                index   : index,
                                content : index + 1,
                                selected: index === (selected.value - 1)
                            }
                        }
                    } else {
                        const halfPageRange = Math.floor(props.pageRange / 2)

                        const setPageItem = (index: any) => {
                            items[index] = {
                                index   : index,
                                content : index + 1,
                                selected: index === (selected.value - 1)
                            }
                        }

                        const setBreakView = (index: any) => {
                            items[index] = {
                                disabled : true,
                                breakView: true
                            }
                        }

                        // 1st - loop through low end of margin pages
                        for (let i = 0; i < props.marginPages; i++) {
                            setPageItem(i);
                        }

                        // 2nd - loop through selected range
                        let selectedRangeLow = 0;
                        if (selected.value - halfPageRange > 0) {
                            selectedRangeLow = selected.value - 1 - halfPageRange;
                        }

                        let selectedRangeHigh = selectedRangeLow + props.pageRange - 1;
                        if (selectedRangeHigh >= props.pageCount) {
                            selectedRangeHigh = props.pageCount - 1;
                            selectedRangeLow = selectedRangeHigh - props.pageRange + 1;
                        }

                        for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= props.pageCount - 1; i++) {
                            setPageItem(i);
                        }

                        // Check if there is breakView in the left of selected range
                        if (selectedRangeLow > props.marginPages) {
                            setBreakView(selectedRangeLow - 1)
                        }

                        // Check if there is breakView in the right of selected range
                        if (selectedRangeHigh + 1 < props.pageCount - props.marginPages) {
                            setBreakView(selectedRangeHigh + 1)
                        }

                        // 3rd - loop thru high end of margin pages
                        for (let i = props.pageCount - 1; i >= props.pageCount - props.marginPages; i--) {
                            setPageItem(i);
                        }
                    }
                    return items
                })

            }
        },

    })
</script>

<style lang="css" scoped>
    a {
        cursor: pointer;
    }
</style>
