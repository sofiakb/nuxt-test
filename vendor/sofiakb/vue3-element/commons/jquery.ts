"use strict";

/*
 * nuxt3-project-default
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 01/09/2022 at 10:51
 * File vendor/sofiakb/vue-element/commons/jquery
 */

import $ from "jquery"

export const jElement = (selector: string): JQuery => $(selector)
export const jIdElement = (selector: string): JQuery => jElement(`#${selector}`)
export const jClassElement = (selector: string): JQuery => jElement(`.${selector}`)
