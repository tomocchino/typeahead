export default function flattenString(string: string) {
  return string
    .toLocaleLowerCase() // this speeds execution up dramatically, wtf!?
    .replace(/[^a-z0-9 ]/g, (character) => {
      if (removeChars.has(character)) {
        return "";
      } else if (retainChars.has(character)) {
        return ` ${character} `;
      } else if (character in replaceChars) {
        return replaceChars[character] || " ";
      } else {
        return " ";
      }
    })
    .trim();
}

// strip out apostrophes (contractions) and other special characters that "hug" words
const removeChars = new Set(['"', "'"]);

// turn each of these into a space plus itself plus a space to retain it as a token
const retainChars = new Set(["+", "&"]);

// flatten each of these characters with diacritics
// pulled from https://github.com/dundalek/latinize
const replaceChars: { [char: string]: string } = {
  À: "a",
  Á: "a",
  Â: "a",
  Ã: "a",
  Ä: "a",
  Å: "a",
  Æ: "ae",
  Ç: "c",
  È: "e",
  É: "e",
  Ê: "e",
  Ë: "e",
  Ì: "i",
  Í: "i",
  Î: "i",
  Ï: "i",
  Ð: "d",
  Ñ: "n",
  Ò: "o",
  Ó: "o",
  Ô: "o",
  Õ: "o",
  Ö: "o",
  Ø: "o",
  Ù: "u",
  Ú: "u",
  Û: "u",
  Ü: "u",
  Ý: "y",
  Þ: "th",
  ß: "ss",
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  ä: "a",
  å: "a",
  æ: "ae",
  ç: "c",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  ð: "d",
  ñ: "n",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  ö: "o",
  ø: "o",
  ù: "u",
  ú: "u",
  û: "u",
  ü: "u",
  ý: "y",
  þ: "th",
  ÿ: "y",
  Ā: "a",
  ā: "a",
  Ă: "a",
  ă: "a",
  Ą: "a",
  ą: "a",
  Ć: "c",
  ć: "c",
  Ĉ: "c",
  ĉ: "c",
  Ċ: "c",
  ċ: "c",
  Č: "c",
  č: "c",
  Ď: "d",
  ď: "d",
  Đ: "d",
  đ: "d",
  Ē: "e",
  ē: "e",
  Ĕ: "e",
  ĕ: "e",
  Ė: "e",
  ė: "e",
  Ę: "e",
  ę: "e",
  Ě: "e",
  ě: "e",
  Ĝ: "g",
  ĝ: "g",
  Ğ: "g",
  ğ: "g",
  Ġ: "g",
  ġ: "g",
  Ģ: "g",
  ģ: "g",
  Ĥ: "h",
  ĥ: "h",
  Ħ: "h",
  ħ: "h",
  Ĩ: "i",
  ĩ: "i",
  Ī: "i",
  ī: "i",
  Ĭ: "i",
  ĭ: "i",
  Į: "i",
  į: "i",
  İ: "i",
  ı: "i",
  Ĳ: "ij",
  ĳ: "ij",
  Ĵ: "j",
  ĵ: "j",
  Ķ: "k",
  ķ: "k",
  Ĺ: "l",
  ĺ: "l",
  Ļ: "l",
  ļ: "l",
  Ľ: "l",
  ľ: "l",
  Ŀ: "l",
  ŀ: "l",
  Ł: "l",
  ł: "l",
  Ń: "n",
  ń: "n",
  Ņ: "n",
  ņ: "n",
  Ň: "n",
  ň: "n",
  Ō: "o",
  ō: "o",
  Ŏ: "o",
  ŏ: "o",
  Ő: "o",
  ő: "o",
  Œ: "oe",
  œ: "oe",
  Ŕ: "r",
  ŕ: "r",
  Ŗ: "r",
  ŗ: "r",
  Ř: "r",
  ř: "r",
  Ś: "s",
  ś: "s",
  Ŝ: "s",
  ŝ: "s",
  Ş: "s",
  ş: "s",
  Š: "s",
  š: "s",
  Ţ: "t",
  ţ: "t",
  Ť: "t",
  ť: "t",
  Ŧ: "t",
  ŧ: "t",
  Ũ: "u",
  ũ: "u",
  Ū: "u",
  ū: "u",
  Ŭ: "u",
  ŭ: "u",
  Ů: "u",
  ů: "u",
  Ű: "u",
  ű: "u",
  Ų: "u",
  ų: "u",
  Ŵ: "w",
  ŵ: "w",
  Ŷ: "y",
  ŷ: "y",
  Ÿ: "y",
  Ź: "z",
  ź: "z",
  Ż: "z",
  ż: "z",
  Ž: "z",
  ž: "z",
  ſ: "s",
  ƀ: "b",
  Ɓ: "b",
  Ƃ: "b",
  ƃ: "b",
  Ɔ: "o",
  Ƈ: "c",
  ƈ: "c",
  Ɗ: "d",
  Ƌ: "d",
  ƌ: "d",
  Ǝ: "e",
  Ɛ: "e",
  Ƒ: "f",
  ƒ: "f",
  Ɠ: "g",
  ƕ: "hv",
  Ɨ: "i",
  Ƙ: "k",
  ƙ: "k",
  ƚ: "l",
  Ɯ: "m",
  Ɲ: "n",
  ƞ: "n",
  Ɵ: "o",
  Ơ: "o",
  ơ: "o",
  Ƣ: "oi",
  ƣ: "oi",
  Ƥ: "p",
  ƥ: "p",
  ƫ: "t",
  Ƭ: "t",
  ƭ: "t",
  Ʈ: "t",
  Ư: "u",
  ư: "u",
  Ʋ: "v",
  Ƴ: "y",
  ƴ: "y",
  Ƶ: "z",
  ƶ: "z",
  Ǆ: "dz",
  ǅ: "d",
  ǆ: "dz",
  Ǉ: "lj",
  ǈ: "l",
  ǉ: "lj",
  Ǌ: "nj",
  ǋ: "n",
  ǌ: "nj",
  Ǎ: "a",
  ǎ: "a",
  Ǐ: "i",
  ǐ: "i",
  Ǒ: "o",
  ǒ: "o",
  Ǔ: "u",
  ǔ: "u",
  Ǖ: "u",
  ǖ: "u",
  Ǘ: "u",
  ǘ: "u",
  Ǚ: "u",
  ǚ: "u",
  Ǜ: "u",
  ǜ: "u",
  ǝ: "e",
  Ǟ: "a",
  ǟ: "a",
  Ǡ: "a",
  ǡ: "a",
  Ǣ: "ae",
  ǣ: "ae",
  Ǥ: "g",
  ǥ: "g",
  Ǧ: "g",
  ǧ: "g",
  Ǩ: "k",
  ǩ: "k",
  Ǫ: "o",
  ǫ: "o",
  Ǭ: "o",
  ǭ: "o",
  ǰ: "j",
  Ǳ: "dz",
  ǲ: "d",
  ǳ: "dz",
  Ǵ: "g",
  ǵ: "g",
  Ǹ: "n",
  ǹ: "n",
  Ǻ: "a",
  ǻ: "a",
  Ǽ: "ae",
  ǽ: "ae",
  Ǿ: "o",
  ǿ: "o",
  Ȁ: "a",
  ȁ: "a",
  Ȃ: "a",
  ȃ: "a",
  Ȅ: "e",
  ȅ: "e",
  Ȇ: "e",
  ȇ: "e",
  Ȉ: "i",
  ȉ: "i",
  Ȋ: "i",
  ȋ: "i",
  Ȍ: "o",
  ȍ: "o",
  Ȏ: "o",
  ȏ: "o",
  Ȑ: "r",
  ȑ: "r",
  Ȓ: "r",
  ȓ: "r",
  Ȕ: "u",
  ȕ: "u",
  Ȗ: "u",
  ȗ: "u",
  Ș: "s",
  ș: "s",
  Ț: "t",
  ț: "t",
  Ȟ: "h",
  ȟ: "h",
  Ƞ: "n",
  ȡ: "d",
  Ȣ: "ou",
  ȣ: "ou",
  Ȥ: "z",
  ȥ: "z",
  Ȧ: "a",
  ȧ: "a",
  Ȩ: "e",
  ȩ: "e",
  Ȫ: "o",
  ȫ: "o",
  Ȭ: "o",
  ȭ: "o",
  Ȯ: "o",
  ȯ: "o",
  Ȱ: "o",
  ȱ: "o",
  Ȳ: "y",
  ȳ: "y",
  ȴ: "l",
  ȵ: "n",
  ȶ: "t",
  ȷ: "j",
  Ⱥ: "a",
  Ȼ: "c",
  ȼ: "c",
  Ƚ: "l",
  Ⱦ: "t",
  ȿ: "s",
  ɀ: "z",
  Ƀ: "b",
  Ʌ: "v",
  Ɇ: "e",
  ɇ: "e",
  Ɉ: "j",
  ɉ: "j",
  ɋ: "q",
  Ɍ: "r",
  ɍ: "r",
  Ɏ: "y",
  ɏ: "y",
  ɐ: "a",
  ɓ: "b",
  ɔ: "o",
  ɕ: "c",
  ɖ: "d",
  ɗ: "d",
  ɘ: "e",
  ɛ: "e",
  ɟ: "j",
  ɠ: "g",
  ɡ: "g",
  ɢ: "g",
  ɥ: "h",
  ɦ: "h",
  ɨ: "i",
  ɪ: "i",
  ɫ: "l",
  ɬ: "l",
  ɭ: "l",
  ɯ: "m",
  ɰ: "m",
  ɱ: "m",
  ɲ: "n",
  ɳ: "n",
  ɴ: "n",
  ɵ: "o",
  ɶ: "oe",
  ɹ: "r",
  ɺ: "r",
  ɻ: "r",
  ɼ: "r",
  ɽ: "r",
  ɾ: "r",
  ɿ: "r",
  ʀ: "r",
  ʁ: "r",
  ʂ: "s",
  ʄ: "j",
  ʇ: "t",
  ʈ: "t",
  ʋ: "v",
  ʌ: "v",
  ʍ: "w",
  ʎ: "y",
  ʏ: "y",
  ʐ: "z",
  ʑ: "z",
  ʙ: "b",
  ʛ: "g",
  ʜ: "h",
  ʝ: "j",
  ʞ: "k",
  ʟ: "l",
  ʠ: "q",
  ʮ: "h",
  ʯ: "h",
  Ё: "yo",
  І: "i",
  Ї: "yi",
  А: "a",
  Б: "b",
  В: "v",
  Г: "g",
  Д: "d",
  Е: "e",
  Ж: "zh",
  З: "z",
  И: "i",
  Й: "i",
  К: "k",
  Л: "l",
  М: "m",
  Н: "n",
  О: "o",
  П: "p",
  Р: "r",
  С: "s",
  Т: "t",
  У: "u",
  Ф: "f",
  Х: "h",
  Ц: "ts",
  Ч: "ch",
  Ш: "sh",
  Щ: "sch",
  Ъ: "'",
  Ы: "i",
  Ь: "'",
  Э: "e",
  Ю: "yu",
  Я: "ya",
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "'",
  ы: "i",
  ь: "'",
  э: "e",
  ю: "yu",
  я: "ya",
  ё: "yo",
  і: "i",
  ї: "yi",
  Ґ: "g",
  ґ: "g",
  ᴀ: "a",
  ᴁ: "ae",
  ᴂ: "ae",
  ᴃ: "b",
  ᴄ: "c",
  ᴅ: "d",
  ᴇ: "e",
  ᴉ: "i",
  ᴊ: "j",
  ᴋ: "k",
  ᴌ: "l",
  ᴍ: "m",
  ᴎ: "n",
  ᴏ: "o",
  ᴐ: "o",
  ᴑ: "o",
  ᴓ: "o",
  ᴔ: "oe",
  ᴕ: "ou",
  ᴘ: "p",
  ᴙ: "r",
  ᴚ: "r",
  ᴛ: "t",
  ᴜ: "u",
  ᴝ: "u",
  ᴠ: "v",
  ᴡ: "w",
  ᴢ: "z",
  ᵢ: "i",
  ᵣ: "r",
  ᵤ: "u",
  ᵥ: "v",
  ᵫ: "ue",
  ᵬ: "b",
  ᵭ: "d",
  ᵮ: "f",
  ᵯ: "m",
  ᵰ: "n",
  ᵱ: "p",
  ᵲ: "r",
  ᵳ: "r",
  ᵴ: "s",
  ᵵ: "t",
  ᵶ: "z",
  ᵷ: "g",
  ᵹ: "g",
  ᵺ: "th",
  ᵽ: "p",
  ᶀ: "b",
  ᶁ: "d",
  ᶂ: "f",
  ᶃ: "g",
  ᶄ: "k",
  ᶅ: "l",
  ᶆ: "m",
  ᶇ: "n",
  ᶈ: "p",
  ᶉ: "r",
  ᶊ: "s",
  ᶌ: "v",
  ᶍ: "x",
  ᶎ: "z",
  ᶏ: "a",
  ᶑ: "d",
  ᶒ: "e",
  ᶓ: "e",
  ᶖ: "i",
  ᶗ: "o",
  ᶙ: "u",
  Ḁ: "a",
  ḁ: "a",
  Ḃ: "b",
  ḃ: "b",
  Ḅ: "b",
  ḅ: "b",
  Ḇ: "b",
  ḇ: "b",
  Ḉ: "c",
  ḉ: "c",
  Ḋ: "d",
  ḋ: "d",
  Ḍ: "d",
  ḍ: "d",
  Ḏ: "d",
  ḏ: "d",
  Ḑ: "d",
  ḑ: "d",
  Ḓ: "d",
  ḓ: "d",
  Ḕ: "e",
  ḕ: "e",
  Ḗ: "e",
  ḗ: "e",
  Ḙ: "e",
  ḙ: "e",
  Ḛ: "e",
  ḛ: "e",
  Ḝ: "e",
  ḝ: "e",
  Ḟ: "f",
  ḟ: "f",
  Ḡ: "g",
  ḡ: "g",
  Ḣ: "h",
  ḣ: "h",
  Ḥ: "h",
  ḥ: "h",
  Ḧ: "h",
  ḧ: "h",
  Ḩ: "h",
  ḩ: "h",
  Ḫ: "h",
  ḫ: "h",
  Ḭ: "i",
  ḭ: "i",
  Ḯ: "i",
  ḯ: "i",
  Ḱ: "k",
  ḱ: "k",
  Ḳ: "k",
  ḳ: "k",
  Ḵ: "k",
  ḵ: "k",
  Ḷ: "l",
  ḷ: "l",
  Ḹ: "l",
  ḹ: "l",
  Ḻ: "l",
  ḻ: "l",
  Ḽ: "l",
  ḽ: "l",
  Ḿ: "m",
  ḿ: "m",
  Ṁ: "m",
  ṁ: "m",
  Ṃ: "m",
  ṃ: "m",
  Ṅ: "n",
  ṅ: "n",
  Ṇ: "n",
  ṇ: "n",
  Ṉ: "n",
  ṉ: "n",
  Ṋ: "n",
  ṋ: "n",
  Ṍ: "o",
  ṍ: "o",
  Ṏ: "o",
  ṏ: "o",
  Ṑ: "o",
  ṑ: "o",
  Ṓ: "o",
  ṓ: "o",
  Ṕ: "p",
  ṕ: "p",
  Ṗ: "p",
  ṗ: "p",
  Ṙ: "r",
  ṙ: "r",
  Ṛ: "r",
  ṛ: "r",
  Ṝ: "r",
  ṝ: "r",
  Ṟ: "r",
  ṟ: "r",
  Ṡ: "s",
  ṡ: "s",
  Ṣ: "s",
  ṣ: "s",
  Ṥ: "s",
  ṥ: "s",
  Ṧ: "s",
  ṧ: "s",
  Ṩ: "s",
  ṩ: "s",
  Ṫ: "t",
  ṫ: "t",
  Ṭ: "t",
  ṭ: "t",
  Ṯ: "t",
  ṯ: "t",
  Ṱ: "t",
  ṱ: "t",
  Ṳ: "u",
  ṳ: "u",
  Ṵ: "u",
  ṵ: "u",
  Ṷ: "u",
  ṷ: "u",
  Ṹ: "u",
  ṹ: "u",
  Ṻ: "u",
  ṻ: "u",
  Ṽ: "v",
  ṽ: "v",
  Ṿ: "v",
  ṿ: "v",
  Ẁ: "w",
  ẁ: "w",
  Ẃ: "w",
  ẃ: "w",
  Ẅ: "w",
  ẅ: "w",
  Ẇ: "w",
  ẇ: "w",
  Ẉ: "w",
  ẉ: "w",
  Ẋ: "x",
  ẋ: "x",
  Ẍ: "x",
  ẍ: "x",
  Ẏ: "y",
  ẏ: "y",
  Ẑ: "z",
  ẑ: "z",
  Ẓ: "z",
  ẓ: "z",
  Ẕ: "z",
  ẕ: "z",
  ẖ: "h",
  ẗ: "t",
  ẘ: "w",
  ẙ: "y",
  ẚ: "a",
  ẛ: "s",
  ẜ: "s",
  ẝ: "s",
  Ạ: "a",
  ạ: "a",
  Ả: "a",
  ả: "a",
  Ấ: "a",
  ấ: "a",
  Ầ: "a",
  ầ: "a",
  Ẩ: "a",
  ẩ: "a",
  Ẫ: "a",
  ẫ: "a",
  Ậ: "a",
  ậ: "a",
  Ắ: "a",
  ắ: "a",
  Ằ: "a",
  ằ: "a",
  Ẳ: "a",
  ẳ: "a",
  Ẵ: "a",
  ẵ: "a",
  Ặ: "a",
  ặ: "a",
  Ẹ: "e",
  ẹ: "e",
  Ẻ: "e",
  ẻ: "e",
  Ẽ: "e",
  ẽ: "e",
  Ế: "e",
  ế: "e",
  Ề: "e",
  ề: "e",
  Ể: "e",
  ể: "e",
  Ễ: "e",
  ễ: "e",
  Ệ: "e",
  ệ: "e",
  Ỉ: "i",
  ỉ: "i",
  Ị: "i",
  ị: "i",
  Ọ: "o",
  ọ: "o",
  Ỏ: "o",
  ỏ: "o",
  Ố: "o",
  ố: "o",
  Ồ: "o",
  ồ: "o",
  Ổ: "o",
  ổ: "o",
  Ỗ: "o",
  ỗ: "o",
  Ộ: "o",
  ộ: "o",
  Ớ: "o",
  ớ: "o",
  Ờ: "o",
  ờ: "o",
  Ở: "o",
  ở: "o",
  Ỡ: "o",
  ỡ: "o",
  Ợ: "o",
  ợ: "o",
  Ụ: "u",
  ụ: "u",
  Ủ: "u",
  ủ: "u",
  Ứ: "u",
  ứ: "u",
  Ừ: "u",
  ừ: "u",
  Ử: "u",
  ử: "u",
  Ữ: "u",
  ữ: "u",
  Ự: "u",
  ự: "u",
  Ỳ: "y",
  ỳ: "y",
  Ỵ: "y",
  ỵ: "y",
  Ỷ: "y",
  ỷ: "y",
  Ỹ: "y",
  ỹ: "y",
  Ỿ: "y",
  ỿ: "y",
  ₐ: "a",
  ₑ: "e",
  ₒ: "o",
  ₓ: "x",
  ↄ: "c",
  Ⱡ: "l",
  ⱡ: "l",
  Ɫ: "l",
  Ᵽ: "p",
  Ɽ: "r",
  ⱥ: "a",
  ⱦ: "t",
  Ⱨ: "h",
  ⱨ: "h",
  Ⱪ: "k",
  ⱪ: "k",
  Ⱬ: "z",
  ⱬ: "z",
  Ɱ: "m",
  Ɐ: "a",
  ⱱ: "v",
  Ⱳ: "w",
  ⱳ: "w",
  ⱴ: "v",
  ⱸ: "e",
  ⱹ: "r",
  ⱺ: "o",
  ⱻ: "e",
  ⱼ: "j",
  Ꜩ: "tz",
  ꜩ: "tz",
  ꜰ: "f",
  ꜱ: "s",
  Ꜳ: "aa",
  ꜳ: "aa",
  Ꜵ: "ao",
  ꜵ: "ao",
  Ꜷ: "au",
  ꜷ: "au",
  Ꜹ: "av",
  ꜹ: "av",
  Ꜻ: "av",
  ꜻ: "av",
  Ꜽ: "ay",
  ꜽ: "ay",
  Ꜿ: "c",
  ꜿ: "c",
  Ꝁ: "k",
  ꝁ: "k",
  Ꝃ: "k",
  ꝃ: "k",
  Ꝅ: "k",
  ꝅ: "k",
  Ꝉ: "l",
  ꝉ: "l",
  Ꝋ: "o",
  ꝋ: "o",
  Ꝍ: "o",
  ꝍ: "o",
  Ꝏ: "oo",
  ꝏ: "oo",
  Ꝑ: "p",
  ꝑ: "p",
  Ꝓ: "p",
  ꝓ: "p",
  Ꝕ: "p",
  ꝕ: "p",
  Ꝗ: "q",
  ꝗ: "q",
  Ꝙ: "q",
  ꝙ: "q",
  Ꝟ: "v",
  ꝟ: "v",
  Ꝡ: "vy",
  ꝡ: "vy",
  Ꝫ: "et",
  ꝫ: "et",
  Ꝭ: "is",
  ꝭ: "is",
  ꝸ: "um",
  Ꝺ: "d",
  ꝺ: "d",
  Ꝼ: "f",
  ꝼ: "f",
  Ᵹ: "g",
  Ꞁ: "l",
  ꞁ: "l",
  Ꞃ: "r",
  ꞃ: "r",
  Ꞅ: "s",
  ꞅ: "s",
  Ꞇ: "t",
  ꞇ: "t",
  ﬀ: "ff",
  ﬁ: "fi",
  ﬂ: "fl",
  ﬃ: "ffi",
  ﬄ: "ffl",
  ﬆ: "st",
};
