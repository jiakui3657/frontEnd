// @Author: outman_qiaopeng  Date: 2018-09-29 13:59:37
/**
 *  To generate a string of specified length
 */
export function randomstring(L) {
  var s = ''
  var randomchar = function() {
    var n = Math.floor(Math.random() * 62)
    if (n < 10) return n // 1-10
    if (n < 36) return String.fromCharCode(n + 55) // A-Z
    return String.fromCharCode(n + 61) // a-z
  }
  while (s.length < L) s += randomchar()
  return s
}
