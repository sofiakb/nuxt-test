/*
 * nuxt3-project-default
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 01/09/2022 at 10:45
 * File vendor/sofiakb/vue-element/types/string.extension
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
interface String {
    capitalize(): string;

    wordCapitalize(): string;

    format(): string;

    withoutAccent(): string;

    toInteger(): number;

    escape(): string;

    // replaceAll(find: string, replace: string): string;
}


String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
String.prototype.wordCapitalize = function () {
    return this.split(" ").map(item => item.capitalize()).join(" ");
};

String.prototype.format = function () {
    return this.replace(/\n/g, "<br/>")
};

String.prototype.withoutAccent = function () {
    return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
};

String.prototype.toInteger = function () {
    return parseInt(this.toString());
};

String.prototype.escape = function () {
    return this.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}; // $& means the whole matched string

// String.prototype.replaceAll = function (find: string, replace: string) {
//   return this.replace(new RegExp(escapeRegExp(find), 'g'), replace);
// };
