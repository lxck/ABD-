function rubik(pk) {
    var b = document.getElementById(pk).value,
		b = gaes(b);
    document.getElementById(pk).value = b;
}
function gaes(b) {
    var a = gs(),
		c = CryptoJS.enc.Latin1.parse(a.substr(0, 16)),
		a = CryptoJS.enc.Latin1.parse(a.substr(a.length - 16));
    return CryptoJS.AES.encrypt(b, c, {
        iv: a,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).toString()
}
function gdaes(b) {
    var a = gs();
    b = CryptoJS.enc.Latin1.parse(a.substr(0, 16));
    a = CryptoJS.enc.Latin1.parse(a.substr(a.length - 16));
    return CryptoJS.AES.decrypt(encrypted, b, {
        iv: a,
        padding: CryptoJS.pad.ZeroPadding
    }).toString(CryptoJS.enc.Utf8)
}
function gs() {
    if (0 < document.cookie.length && (c_start = document.cookie.indexOf("ASP.NET_SessionId="), -1 != c_start)) return c_start = c_start + 17 + 1, c_end = document.cookie.indexOf(";", c_start), -1 == c_end && (c_end = document.cookie.length), unescape(document.cookie.substring(c_start, c_end))
};