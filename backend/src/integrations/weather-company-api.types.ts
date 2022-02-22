export enum Languages {
    Amharic_Ethiopia = "am-ET",
    Arabic_United_Arab_Emirates = "ar-AE",
    Azerbaijani_Azerbaijan = "az-AZ",
    Bulgarian_Bulgaria = "bg-BG",
    Bengali_Bangla_Bangladesh = "bn-BD",
    Bengali_Bangla_India = "bn-IN",
    Bosnian_Bosnia_Herzegovina = "bs-BA",
    Catalan_Spain = "ca-ES",
    Czech_Czechia = "cs-CZ",
    Danish_Denmark = "da-DK",
    German_Germany = "de-DE",
    Greek_Greece = "el-GR",
    English = "en-GB",
    English_India = "en-IN",
    English_US = "en-US",
    Spanish_Argentina = "es-AR",
    Spanish_Spain = "es-ES",
    Spanish_Latin_America = "es-LA",
    Spanish_Mexico = "es-MX",
    Spanish_International = "es-UN",
    Spanish_US = "es-US",
    Estonian_Estonia = "et-EE",
    Persian_Farsi_Iran = "fa-IR",
    Finnish_Finland = "fi-FI",
    French_Canada = "fr-CA",
    French_France = "fr-FR",
    Gujarati_India = "gu-IN",
    Hebrew_Modern_Israel = "he-IL",
    Hindi_India = "hi-IN",
    Croatian_Croatia = "hr-HR",
    Hungarian_Hungary = "hu-HU",
    Indonesian_Indonesia = "in-ID",
    Icelandic_Iceland = "is-IS",
    Italian_Italy = "it-IT",
    Hebrew_Israel = "iw-IL",
    Japanese_Japan = "ja-JP",
    Javanese_Indonesia = "jv-ID",
    Georgian_Georgia = "ka-GE",
    Kazakh_Kazakhstan = "kk-KZ",
    Khmer_Cambodia = "km-KH",
    Kannada_India = "kn-IN",
    Korean_South_Korea = "ko-KR",
    Lao_Laos = "lo-LA",
    Lithuanian_Lithuania = "lt-LT",
    Latvian_Latvia = "lv-LV",
    Macedonian_Macedonia = "mk-MK",
    Mongolian_Mongolia = "mn-MN",
    Marathi_India = "mr-IN",
    Malay_Malaysia = "ms-MY",
    Burmese_Myanmar = "my-MM",
    Nepali_India = "ne-IN",
    Nepali_Nepal = "ne-NP",
    Dutch_Netherlands = "nl-NL",
    Norwegian_Norway = "no-NO",
    Oromo_Ethiopia = "om-ET",
    Punjabi_India = "pa-IN",
    Punjabi_Pakistan = "pa-PK",
    Polish_Poland = "pl-PL",
    Portuguese_Brazil = "pt-BR",
    Portuguese_Portugal = "pt-PT",
    Romanian_Romania = "ro-RO",
    Russian_Russia = "ru-RU",
    Sinhalese_Sri_Lanka = "si-LK",
    Slovak_Slovakia = "sk-SK",
    Slovenian_Slovenia = "sl-SI",
    Albanian_Albania = "sq-AL",
    Serbian_Bosnia_Herzegovina = "sr-BA",
    Serbian_Montenegro = "sr-ME",
    Serbian_Serbia = "sr-RS",
    Swedish_Sweden = "sv-SE",
    Swahili_Kenya = "sw-KE",
    Tamil_India = "ta-IN",
    Tamil_Sri_Lanka = "ta-LK",
    Telugu_India = "te-IN",
    Tigrinya_Eritrea = "ti-ER",
    Tigrinya_Ethiopia = "ti-ET",
    Tajik_Tajikistan = "tg-TJ",
    Thai_Thailand = "th-TH",
    Turkmen_Turkmenistan = "tk-TM",
    Tagalog_Philippines = "tl-PH",
    Turkish_Turkey = "tr-TR",
    Ukrainian_Ukraine = "uk-UA",
    Urdu_Pakistan = "ur-PK",
    Uzbek_Uzbekistan = "uz-UZ",
    Vietnamese_Viet_Nam = "vi-VN",
    Chinese_China = "zh-CN",
    Chinese_Hong_Kong = "zh-HK",
    Chinese_Taiwan = "zh-TW",
}

/**
 * Measurement units to return from the API
 */
export enum Units {
    imperial = "e",
    metric = "m",
    /**
     * Système Internationale (International System of Units)
     */
    SI = "s"
}

/**
 * LatLng representation for the Weather Company
 */
export interface GeoCode {
    latitude: number;
    longitude: number;
}

/**
 * Result format of the API Call
 * NOTE: Not every api call supports CSV.
 */
export enum Formats {
    JSON = "json",
    CSV = "csv"
}

export interface CommonOptions {
    format: Formats;
    language: Languages;
    units: Units
}

export type LatLng = GeoCode;

