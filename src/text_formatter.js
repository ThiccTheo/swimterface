// url = "https://onlinetexttools.com/convert-text-to-nice-columns?"

// params = {
//     "input": data,
//     "input-element-separator": "|",
//     "input-row-separator": "$",
//     "output-element-separator": "|",
//     "output-row-separator": "\n",
//     "align-separator-by-columns": "true",
//     "separator-everywhere": "true",
//     "left-align": "true",
// }

// url += urlencode(params, encoding="UTF-8")


window.bridges["convert-nice-columns-to-text"] = function () {
    var i = function (t) {
        var r = this,
            s = r.options.get();
        if (t.length == 0) return "";
        var e = s["output-element-separator"] || "",
            u = s["output-row-separator"] || "\n",
            o = s["ignore-columns"];
        e == "\\n" && (e = "\n"), u == "\\n" && (u = "\n");
        var n = m(o);
        if (!n.success) return r.output.showNegativeBadge("Can't ignore columns.", n.error), "";
        var f = t.split("\n");
        if (d(f), t.indexOf("	") != -1) var a = h(f, n.columnNumbers);
        else var l = b(f),
            a = g(f, l, n.columnNumbers);
        for (var v = 0; v < a.length; v++) a[v] = a[v].join(e);
        return a.join(u)
    };

    function h(t, r) {
        for (var s = [], e = 0; e < t.length; e++) {
            var u = 0,
                o = t[e].trim();
            o = o.split(/(\t+)/), s[e] == null && (s[e] = []);
            for (var n = 0; n < o.length; n++)(/^\t+$/.test(o[n]) || n == o.length - 1) && r.indexOf((n + 1) / 2) == -1 && (n == o.length - 1 ? s[e].push(o.slice(u, n + 1).join("")) : (s[e].push(o.slice(u, n).join("")), u = n + 1))
        }
        return s
    }

    function g(t, r, s) {
        for (var e = [], u = 0, o = 0, n = 0; n < r.len; n++)
            if (!(t[r.number][n] != " " && n != r.len - 1)) {
                var f = c(!0, t, n, 0);
                if (f.columnStatus == !0 && (n = f.colNum), f.columnStatus == !0 || n == r.len - 1) {
                    if (o++, s.indexOf(o) != -1 && n != r.len - 1) continue;
                    for (var a = 0; a < t.length; a++) {
                        e[a] == null && (e[a] = []);
                        var l = t[a].substring(u, n + 1);
                        s.indexOf(0) != -1 && e[a].length == 0 ? l = p(l) : l = l.trim(), l.length != 0 && e[a].push(l)
                    }
                    u = n
                }
            } return e
    }

    function c(t, r, s, e) {
        if (t == !1) return e == 1 ? {
            columnStatus: !1
        } : {
            columnStatus: !0,
            colNum: s - 2
        };
        for (var u = 0; u < r.length; u++)
            if (r[u][s] != " " && r[u][s] != null) {
                t = !1;
                break
            } return c(t, r, s + 1, e + 1)
    }

    function p(t) {
        return t.replace(/\s+$/, "")
    }

    function m(t) {
        var r = [];
        if (t.length == 0) return {
            columnNumbers: r,
            success: !0
        };
        for (var s = t.split(","), e = 0; e < s.length; e++) {
            var u = s[e].trim().replace(/\s+/g, "");
            if (!/^\d+-\d+$/.test(u) && !/^\d+$/.test(u)) return {
                success: !1,
                error: "Column numbers must be comma separated."
            };
            if (/^\d+-\d+$/.test(u)) {
                var o = u.split("-"),
                    n = o[0],
                    f = o[1];
                if (n > f) return {
                    success: !1,
                    error: "The start of the interval is greater than the end."
                };
                for (var a = n; a <= f; a++) r.push(parseInt(a))
            } else r.push(parseInt(u))
        }
        return {
            columnNumbers: r,
            success: !0
        }
    }

    function d(t) {
        for (var r = 0; r < t.length; r++)
            if (t[r].length == 0) {
                t.splice(r, 1), r--;
                continue
            }
    }

    function b(t) {
        for (var r = 0, s = 0, e = 0; e < t.length; e++) {
            var u = t[e];
            u.length > r && (r = u.length, s = e)
        }
        return {
            len: r,
            number: s
        }
    }
    return {
        converter: i,
        config: {}
    }
};