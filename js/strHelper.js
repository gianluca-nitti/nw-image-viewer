exports.startsWith = function (str, prefix) {
    return str.indexOf(prefix)===0;
};

exports.endsWith = function (str, suffix) {
    return str.match(suffix+"$")==suffix;
};
