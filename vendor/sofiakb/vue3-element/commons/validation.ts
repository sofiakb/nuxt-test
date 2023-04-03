"use strict";

/*
 * nuxt3-project-default
 *
 * (c) Sofiakb <contact.sofiakb@gmail.com>
 *
 * Created by WebStorm on 01/09/2022 at 10:45
 * File vendor/sofiakb/vue-element/commons/validation
 */

import { each, keys } from "lodash";

import "../types/string.extension"
import Nullable       from "../types/nullable"
import { jElement }   from "../commons/jquery";


const requiredMessage = (field: string) => `${fields[field].capitalize()} est obligatoire`
const formatMessage = (field: string) => `${fields[field].capitalize()} a un mauvais format`

const requestValidation = () => ({
    requestFields: {
        street_number: "le numéro de rue",
        address      : "la rue",
        address2     : "le complément d'adresse",
        zipcode      : "le code postal",
        city         : "la ville",
        agents_count : "le nombre d'agent(s)",
        agent_type   : "le type d'agent(s)",
        beginAt      : "la date de début",
        endAt        : "la date de fin",
        description  : "le message",
    }
})

const contactValidation = () => ({
    contactFields: {
        message: "le message",
        subject: "l'objet",
    }
})

const { requestFields } = requestValidation()
const { contactFields } = contactValidation()

const fields: any = {
    email    : "l'adresse e-mail",
    firstname: "le prénom",
    lastname : "le nom",
    phone    : "le numéro de téléphone",
    password : "le mot de passe",
    siret    : "le siret",

    ...requestFields,
    ...contactFields
}


export const messages = {
    "email.required"           : requiredMessage("email"),
    "email.format"             : formatMessage("email"),
    "firstname.required"       : requiredMessage("firstname"),
    "lastname.required"        : requiredMessage("lastname"),
    "phone.required"           : requiredMessage("phone"),
    "phone.format"             : formatMessage("phone"),
    "siret.format"             : formatMessage("siret"),
    "password.required"        : requiredMessage("password"),
    "confirmPassword.different": "Le mot de passe et la confirmation doivent être identiques",


    //// request
    "street_number.required": requiredMessage("street_number"),
    "address.required"      : requiredMessage("address"),
    "address2.required"     : requiredMessage("address2"),
    "zipcode.required"      : requiredMessage("zipcode"),
    "city.required"         : requiredMessage("city"),
    "agents_count.required" : requiredMessage("agents_count"),
    "agent_type.required"   : requiredMessage("agent_type"),
    "beginAt.required"      : requiredMessage("beginAt"),
    "endAt.required"        : requiredMessage("endAt"),
    "description.required"  : requiredMessage("description"),

    //// contact
    "message.required": requiredMessage("message"),
    "subject.required": requiredMessage("subject"),
}

const inputError = (key: string, clear = false) => clear ? jElement(`[name=${key}]`).removeClass("invalid") : jElement(`[name=${key}]`).addClass("invalid");

export class ValidatorResponse {
    valid: boolean
    error: Nullable<string>
    errors: string[]


    constructor(valid: boolean, error: Nullable<string>, errors: string[]) {
        this.valid = valid;
        this.error = error;
        this.errors = errors;
    }

    static create(properties: { valid: boolean, error: Nullable<string>, errors: string[] }) {
        return new ValidatorResponse(properties.valid, properties.error, properties.errors)
    }
}

export const validator = (data: any): ValidatorResponse => {
    if (!data) return ValidatorResponse.create({ valid: false, errors: [], error: null });

    let valid = true, error = null
    const errors: string[] = [];
    keys(data).forEach(key => {
        if (data[key] === null || typeof data[key] === "undefined" || (typeof data[key] === "string" && data[key].trim() === "")) {
            inputError(key);
            valid = false;
            error = "Merci de renseigner tous les champs marqués d'un *"
            errors.push(`${key}.required`)
        } else inputError(key, true);

    });

    return ValidatorResponse.create({ valid, error, errors })
}

export const validate = {
    email(email: string): boolean {
        if (email === null || email.trim() === "") {
            inputError("email")
            return false
        }

        return /^\w+([.\-+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    },

    phone(phone: string): boolean {
        return /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/.test(phone)
    },

    siret(siret: string) {

        siret = siret.trim();
        const siretArray = siret.toString().split("")
        if (siret === "" || siret.length !== 14) {
            return false;
        }

        let sum = 0, tmp;

        each(siretArray, (item, k) => {
            if (k % 2 == 0) {
                tmp = siretArray[k].toInteger() * 2;
                tmp = tmp > 9 ? tmp - 9 : tmp;
            } else {
                tmp = siretArray[k];
            }
            sum += tmp.toString().toInteger();
        })

        return sum % 10 === 0;
    },

    password(password: string, inputKey = "password") {
        if (/(?=.*[A-Z])/.test(password) && /(?=.*[a-z])/.test(password) && /(?=.*\d)/.test(password) && /(?=.*?[/+~"'{}()|#`_[\]=%§.,:;?!@$^&*-])/.test(password) && /.{8,}/.test(password))
            return true

        inputError(inputKey)
        return false
    },

    confirmPassword(password: Nullable<string>, confirmation: Nullable<string>) {
        if (password && password.trim() !== "" && validate.password(password) && password === confirmation)
            return true

        inputError("confirmPassword")
        return false
    }
}
