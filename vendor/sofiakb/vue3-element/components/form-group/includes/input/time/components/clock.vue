<template>
    <div id="clockContainer" class="clock-container" @click="$emit('click', $event)">

        <div class="clock-body">

            <div class="ssf-row ssf-clock-row">

                <div class="ssf-clock-grid time-container">
                    <div class="clock-controls">
                        <div class="clock-control clock-control-more" @click.stop="increase('hours')"></div>
                        <div class="clock-control clock-control-less" @click.stop="decrease('hours')"></div>
                    </div>
                    <transition enter-active-class="ssf-bounce-enter" leave-active-class="ssf-bounce-leave"
                                mode="out-in"
                                name="bounce">
                        <div :key="`hours-${selected.hours}`" class="time-cell">
                            {{ twoDigits(selected.hours) }}
                        </div>
                    </transition>
                </div>

                <div class="ssf-clock-grid time-container">
                    <div class="clock-controls">
                        <div class="clock-control clock-control-more" @click.stop="increase('minutes')"></div>
                        <div class="clock-control clock-control-less" @click.stop="decrease('minutes')"></div>
                    </div>
                    <transition enter-active-class="ssf-bounce-enter" leave-active-class="ssf-bounce-leave"
                                mode="out-in"
                                name="bounce">
                        <div :key="`minutes-${selected.minutes}`" class="time-cell">
                            {{ twoDigits(selected.minutes) }}
                        </div>
                    </transition>
                </div>

                <div class="ssf-clock-grid time-container">
                    <div class="clock-controls">
                        <div class="clock-control clock-control-more" @click.stop="increase('seconds')"></div>
                        <div class="clock-control clock-control-less" @click.stop="decrease('seconds')"></div>
                    </div>
                    <transition enter-active-class="ssf-bounce-enter" leave-active-class="ssf-bounce-leave"
                                mode="out-in"
                                name="bounce">
                        <div :key="`minutes-${selected.seconds}`" class="time-cell">
                            {{ twoDigits(selected.seconds) }}
                        </div>
                    </transition>
                </div>

            </div>

        </div>

    </div>
</template>

<script lang="ts">
    import { twoDigits }                                       from "../../../../utils";
    import { computed, defineComponent, reactive, ref, watch } from "vue";
    import Nullable                                            from "../../../../../../types/nullable";

    export default defineComponent({
        name: "ssf-time-clock",

        props: {
            timeValue    : { type: [ String, Number ], required: false, default: null },
            timeSeparator: { type: String, required: true, default: ":" },
        },

        emits: [ "selected", "click" ],

        setup(props, { emit }) {
            // const $date = (dateValue: Nullable<string | Moment>, format: Nullable<string> = null): Moment => dateValue ? (format ? moment(dateValue, format) : moment(dateValue)) : moment()

            const current = reactive({
                time   : null as Nullable<{ hours: Nullable<number>, minutes: Nullable<number>, seconds: Nullable<number> }>,
                hours  : null as Nullable<number>,
                minutes: null as Nullable<number>,
                seconds: null as Nullable<number>,
            })
            const selected = ref({
                hours  : null as Nullable<number>,
                minutes: null as Nullable<number>,
                seconds: null as Nullable<number>,
            })

            const time = computed(() => {
                let result
                if (props.timeValue) {
                    const timeArray = props.timeValue.toString().split(props.timeSeparator)
                    result = { hours: (timeArray[0] ?? 14).toString().toInteger(), minutes: (timeArray[1] ?? 0).toString().toInteger(), seconds: (timeArray[2] ?? 0).toString().toInteger() }
                } else result = { hours: 14, minutes: 0, seconds: 0 }
                return result
            })
            const formatted = computed(() => current.time ? Object.values(current.time).map(item => twoDigits(item ?? 0)).join(":") : null)
            // `${twoDigits(current.time?.hours.toString())}:${twoDigits(current.time?.minutes.toString())}:${twoDigits(current.time?.seconds.toString())}`)


            const fillCalendar = () => {
                selected.value = {
                    hours  : current.hours,
                    minutes: current.minutes,
                    seconds: current.seconds
                }
            }
            const run = () => {
                current.time = time.value ?? current.time
                current.hours = current.time?.hours ?? 0
                current.minutes = current.time?.minutes ?? 0
                current.seconds = current.time?.seconds ?? 0
                fillCalendar()
            }

            watch(() => props.timeValue, () => run(), { immediate: true })

            const increase = (type: "hours" | "minutes" | "seconds", direction = 1) => {
                const max = type === "hours" ? 24 : 60
                selected.value[type] = (parseInt((selected.value[type] ?? 0).toString()) + direction) % max
                if ((selected.value[type] ?? 0) < 0)
                    selected.value[type] = max + (selected.value[type] ?? 0)
                if (current.time && selected.value)
                    current.time[type] = selected.value[type]
                run()
                emit("selected", formatted.value)
            }

            const decrease = (type: "hours" | "minutes" | "seconds", direction = -1) => increase(type, direction)
            // const  selectCurrentYear = () => {
            //     const currentYear = document.getElementById("currentYear"),
            //         scrollYear = document.getElementById("scrollYear")
            //     scrollYear.scrollTop = currentYear.offsetTop - (scrollYear.offsetHeight / 2)
            // }
            //
            // const openSelector = () => {
            //     selected.value = { month: current.day.month() + 1, year: current.day.year() }
            //     show.selector = true
            //     this.$nextTick(() => {
            //         this.selectCurrentYear()
            //     })
            // }

            return {
                twoDigits,

                selected,

                // time,

                increase,
                decrease,
                // cancel() {
                //     selected.value = { hours: null, minutes: null, seconds: null }
                //     show.selector = false
                // },

            }
        },
    })
</script>

<style lang="scss">
    .clock-container {
        position: relative;
        height: 100px;
        width: 250px;
        max-width: 100vw;
        box-sizing: border-box;
        border: 1px solid var(--form-control-active, #dddddd);
        border-radius: var(--form-radius);
        user-select: none;

        .clock-body {
            height: 100%;

            .ssf-row.ssf-clock-row {
                height: 100%;
            }

            .ssf-clock-grid {
                position: relative;
                width: 100%;
                min-height: 1px;
                flex: 0 0 33.333333%;
                max-width: 33.333333%;
                display: inline-flex !important;
                justify-content: center;
                align-items: center;
                height: 100% !important;

                .clock-control {
                    position: absolute;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 50px;
                    cursor: pointer;
                    transition: all .5s;
                    z-index: 1;

                    &.clock-control-more {
                        top: 1px;

                        &:before {
                            border-top: 2px solid var(--form-control-active, #0f0f0f);
                            border-left: 2px solid var(--form-control-active, #0f0f0f);
                            top: 10px;
                        }

                    }

                    &.clock-control-less {
                        bottom: 1px;

                        &:after {
                            border-bottom: 2px solid var(--form-control-active, #0f0f0f);
                            border-right: 2px solid var(--form-control-active, #0f0f0f);
                            bottom: 10px;
                        }
                    }

                    &.clock-control-more:before,
                    &.clock-control-less:after {
                        content: '';
                        position: absolute;
                        left: 0;
                        right: 0;
                        margin: auto;
                        transform: rotate(45deg);
                        width: 10px;
                        height: 10px;
                    }

                }

                .time-cell {
                    font-size: 20px;
                }

            }

        }

        .ssf-bounce,
        .ssf-bounce-enter,
        .ssf-bounce-leave {
            animation-duration: .3s;
            margin: 0 auto 0 auto;
            transform-origin: bottom;
            animation-timing-function: ease;
        }

        .ssf-bounce-leave {
            animation-name: bounce-leave;
        }

        .ssf-bounce-enter {
            animation-name: bounce-enter;
        }

        @keyframes bounce-leave {
            0% {
                opacity: 1;
                transform: translateY(0);
            }
            30% {
                transform: translateY(-20px);
            }
            100% {
                opacity: 0;
                transform: translateY(0);
            }
        }

        @keyframes bounce-enter {
            0% {
                opacity: 0;
                transform: translateY(0);
            }
            70% {
                transform: translateY(-20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

    }
</style>
