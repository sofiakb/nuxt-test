<template>
    <vue-final-modal
        :attach="attach"
        :classes="options.classes.modal"
        :clickToClose="clickToClose"
        :contentClass="contentClass"
        :contentStyle="contentStyle"
        :drag="drag"
        :dragSelector="dragSelector"
        :escToClose="escToClose"
        :fitParent="fitParent"
        :focusRetain="focusRetain"
        :focusTrap="focusTrap"
        :hideOverlay="hideOverlay"
        :keepChangedStyle="keepChangedStyle"
        :keepOverlay="keepOverlay"
        :lockScroll="lockScroll"
        :maxHeight="maxHeight"
        :maxWidth="maxWidth"
        :minHeight="minHeight"
        :minWidth="minWidth"
        :modelValue="modelValue"
        :name="name"
        :overlayClass="overlayClass"
        :overlayStyle="overlayStyle"
        :overlayTransition="overlayTransition"
        :preventClick="preventClick"
        :resize="resize"
        :resizeDirections="resizeDirections"
        :ssr="ssr"
        :style="`--modal-content-width: ${options.width}`"
        :styles="styles"
        :transition="transition"
        :zIndex="zIndex"
        :zIndexAuto="zIndexAuto"
        :zIndexBase="zIndexBase"
        @_closed="event => $emit('_closed', event)"
        @_opened="event => $emit('_opened', event)"
        @closed="event => $emit('closed', event)"
        @opened="event => $emit('opened', event)"
        @update:model-value="event => $emit('update:modelValue', event)"
        @click-outside="event => $emit('click-outside', event)"
        @before-open="event => $emit('before-open', event)"
        @before-close="event => $emit('before-close', event)"
        @_before-open="event => $emit('_before-open', event)"
        @drag:start="event => $emit('drag:start', event)"
        @drag:move="event => $emit('drag:move', event)"
        @drag:end="event => $emit('drag:end', event)"
        @resize:start="event => $emit('resize:start', event)"
        @resize:move="event => $emit('resize:move', event)"
        @resize:end="event => $emit('resize:end', event)">

        <ssf-container v-if="hasSlot('header') || withClose"
                       :class="[ options.classes.header, {'with-close': withClose} ]" name="modal-header"
                       :relative="withClose">
            <slot name="header"/>

            <ssf-shape circle
                       class="color-1 mx-auto full-flex cursor-pointer right-absolute modal-close"
                       size="25"
                       style="right: 15px; top: 15px"
                       @click="$emit('before-close')"
                       v-if="withClose">
                <ssf-icon icon="xmark" light size="lg"/>
            </ssf-shape>

        </ssf-container>

        <ssf-container v-if="hasSlot('body')" :class="options.classes.body" name="modal-body">
            <slot name="body"/>
        </ssf-container>

        <ssf-container v-if="hasSlot('footer') || footerAction" :class="options.classes.footer" name="modal-footer">

            <ssf-row v-if="footerAction">

                <ssf-col class="border-end border-white" no-padding xs="6">
                    <button class="btn btn-block text-danger bg-transparent" type="button" @click="$emit('cancel')">
                        <ssf-icon :icon="cancelIcon" la size="2x"/>
                    </button>
                </ssf-col>
                <ssf-col class="border-start border-white" no-padding xs="6">
                    <button class="btn btn-block text-success bg-transparent" type="button" @click="$emit('save')">
                        <ssf-icon :icon="saveIcon" la size="2x"/>
                    </button>
                </ssf-col>

            </ssf-row>

            <slot v-else name="footer"/>

        </ssf-container>

        <slot/>

    </vue-final-modal>
</template>

<script lang="ts">
    // import VueFinalModal from "vue-final-modal"

    import { hasSlot as MainHasSlot, toNumberStyle }                from "../utils";
    import { defineComponent, getCurrentInstance, reactive, watch } from "vue";
    import Nullable                                                 from "../types/nullable";
    import { replace }                                              from "lodash";

    const classes = {
        modal : "v--modal",
        header: "v--modal-header",
        body  : "v--modal-body",
        footer: "v--modal-footer",
    }


    export default defineComponent({
        name: "ssf-modal",

        // components: { VueFinalModal },

        props: {
            name        : { type: String, default: null },
            withClose   : { type: Boolean, default: false },
            modelValue  : { type: Boolean, default: false },
            ssr         : { type: Boolean, default: true },
            classes     : { type: [ String, Object, Array ], default: "" },
            overlayClass: { type: [ String, Object, Array ], default: "" },
            contentClass: { type: [ String, Object, Array ], default: "" },
            styles      : { type: [ Object, Array ], default: () => ({}) },
            overlayStyle: { type: [ Object, Array ], default: () => ({}) },
            contentStyle: { type: [ Object, Array ], default: () => ({}) },
            lockScroll  : { type: Boolean, default: true },
            hideOverlay : { type: Boolean, default: false },
            clickToClose: { type: Boolean, default: true },
            escToClose  : { type: Boolean, default: false },
            preventClick: { type: Boolean, default: false },
            scrollable  : { type: Boolean, default: false },
            attach      : {
                type   : null,
                default: false,
                validator(val: any) {
                    const type = typeof val

                    if (type === "boolean" || type === "string") return true

                    return val.nodeType === Node.ELEMENT_NODE
                }
            },

            transition       : { type: [ String, Object ], default: "vfm" },
            overlayTransition: { type: [ String, Object ], default: "vfm" },
            keepOverlay      : { type: Boolean, default: false },
            zIndexAuto       : { type: Boolean, default: true },
            zIndexBase       : { type: [ String, Number ], default: 1000 },
            zIndex           : { type: [ Boolean, String, Number ], default: false },
            focusRetain      : { type: Boolean, default: true },
            focusTrap        : { type: Boolean, default: false },
            fitParent        : { type: Boolean, default: true },
            drag             : { type: Boolean, default: false },
            dragSelector     : { type: String, default: "" },
            keepChangedStyle : { type: Boolean, default: false },
            resize           : {
                type   : Boolean,
                default: false
            },

            resizeDirections: {
                type     : Array,
                default  : () => [ "t", "tr", "r", "br", "b", "bl", "l", "tl" ],
                validator: (val: string) =>
                    [ "t", "tr", "r", "br", "b", "bl", "l", "tl" ].filter(value => val.indexOf(value) !== -1).length === val.length
            },

            width    : { type: [ Number, String ], default: 600 },
            minWidth : { type: Number, default: 0 },
            minHeight: { type: Number, default: 0 },
            maxWidth : { type: Number, default: Infinity },
            maxHeight: { type: Number, default: Infinity },

            footerAction: { type: [ Boolean, String ], required: false, default: false },
            cancelIcon  : { type: String, required: false, default: "times" },
            saveIcon    : { type: String, required: false, default: "save" },

            headerClasses: { type: String, required: false, default: "v--modal-header border-bottom" },
            bodyClasses  : { type: String, required: false, default: "v--modal-body py-4" },
            footerClasses: { type: String, required: false, default: "v--modal-footer py-3" },
        },

        emits: [
            "update:modelValue",
            "click-outside",
            "before-open",
            "opened",
            "before-close",
            "closed",
            "_before-open",
            "_opened",
            "_closed",
            "drag:start",
            "drag:move",
            "drag:end",
            "resize:start",
            "resize:move",
            "resize:end", "cancel", "save"
        ],

        setup(props) {
            const options = reactive({
                width  : "0" as Nullable<string | undefined>,
                classes: {
                    header: null,
                    body  : null,
                    footer: null,
                    modal : null as Nullable<string>
                }
            })

            watch(() => props.width, () => options.width = toNumberStyle(props.width), { immediate: true })
            watch(() => props.classes, () => {
                options.classes.modal = `${props.classes} ${replace(classes.modal, "")}`
                if (props.scrollable) {
                    options.classes.modal += " modal-scrollable"
                }
            }, { immediate: true })


            // @ts-ignore
            const editClass = (type) => options.classes[type] = `${classes[type]} ${props[`${type}Classes`].replaceAll(classes[type], "")}`

            watch(() => props.headerClasses, () => editClass("header"), { immediate: true })
            watch(() => props.bodyClasses, () => editClass("body"), { immediate: true })
            watch(() => props.footerClasses, () => editClass("footer"), { immediate: true })

            return {
                options,

                hasSlot: (name = "default") => {
                    // @ts-ignore
                    const ctx = getCurrentInstance()
                    return ctx ? MainHasSlot(ctx, name) : null;
                }
            }
        },
    })
</script>

<style lang="scss">
    /* Hide scrollbar for Chrome, Safari and Opera */
    .v--modal-overlay.scrollable::-webkit-scrollbar {
        display: none;
    }

    .vfm.vfm--inset {
        position: fixed;
    }

    .modal-scrollable {
        overflow-y: auto;
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        border: none !important;
        background: #fff;

        position: absolute;
        height: auto;
        margin: 0;
        overflow-y: auto;
        width: var(--modal-content-width, 600px);
    }

    .modal-header.with-close {
        min-height: 50px !important;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .v--modal-overlay.scrollable {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
</style>
