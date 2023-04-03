/**
 * File app/helpers.js
 *
 * Ce fichier contient les outils utiles
 * au bon fonctionnement de l'app
 *
 * @author sofianeakbly
 **/


// import moment from 'moment'
// import date   from 'moment-timezone'

import {moment, twoDigits} from "./index"

export default {
    twoDigits: (number: string | number) => twoDigits(number),
    moment   : (date = null, format = null) => moment(date, format),
    clone    : (object: any) => JSON.parse(JSON.stringify(object)),
}

