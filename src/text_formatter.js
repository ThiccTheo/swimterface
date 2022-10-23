"use strict";
window.bridges = {}, window.primaryTool = null, window.addEventListener("load", function () {
    makeAutosizeTextareas(), makeColorpickers(), makeWrappingExamples(), makePrimaryTool(), chainPrimaryTool()
});

function getChainData(l) {
    for (var e = function (r) {
        var a = {},
            u = r.sides.getAttribute("data-override-options");
        u && (a = JSON.parse(u));
        var c = [],
            p = r.options.get(),
            m = Object.keys(p);
        if (m.length)
            for (var h = 0; h < m.length; h++) {
                var b = m[h];
                if (a[b] === void 0) {
                    var L = p[b];
                    c.push(encodeURIComponent(b) + "=" + encodeURIComponent(L))
                }
            }
        return c
    }, t = function (r) {
        var a = r.sides.getAttribute("data-tool-url") || "",
            u = e(r);
        return u.length == 0 ? a : a + encodeURIComponent("?" + u.join("&"))
    }, n = [], i = l; i.chainChild;) i = i.chainChild, n.push(t(i));
    return n
}

function chainPrimaryTool() {
    var l = getURLQuery("chain");
    l && chainToolWithArray(primaryTool, l.split(","), function (e) { })
}

function removeChainedTools(l) {
    for (var e = document.querySelector(".all-tools-container"), t = l.sides.querySelector(".side.output .side-widgets .widget-chain"), n = e.querySelector(".tool-chained:last-child"); n && n.tool != l;) n.tool.chainParent.removeChain(), n.tool.destroy(), n = e.querySelector(".tool-chained:last-child");
    t.classList.remove("is-disabled"), t.textContent = "Chain with...", l.sides.classList.remove("is-chained"), zenscroll.intoView(l.sides, 400)
}

function chainToolWithArray(l, e, t) {
    for (var n = document.querySelectorAll(".all-tools-container .tool"), i = l, r = null, a = 0, u = 0; a < e.length; a++, u++) {
        r = e[a];
        var c = r.split(encodeURIComponent("?")),
            p = c[0],
            m = {},
            h = c[1];
        if (h) {
            h = decodeURIComponent(h).split("&");
            for (var b = 0; b < h.length; b++) {
                var L = h[b].split("="),
                    T = decodeURIComponent(L[0]),
                    E = decodeURIComponent(L[1] || "");
                (E == "true" || E == "yes" || E == "false" || E == "no") && (E = E == "true" || E == "yes"), T && (m[T] = E)
            }
        }
        var x = n[u + 1];
        if (!x) {
            i.output.showNegativeBadge('No tool with URL "{0}" was found'.format(p), "Last URL in your query might be invalid."), zenscroll.intoView(i.sides, 400);
            break
        }
        if (p != x.getAttribute("data-tool-url")) {
            if (e[a + 1]) var I = '"' + e[a + 1].split(encodeURIComponent("?"))[0] + '"';
            else var I = "next tool";
            i.output.showNegativeBadge('No tool with URL "{0}" was found'.format(p), "Chaining with {0} instead.".format(I)), u--;
            continue
        }
        var v = x.getAttribute("data-tool-bridge") || x.getAttribute("data-tool-url"),
            f = createTool(v, {
                sides: x,
                examples: null,
                chained: !0
            });
        if (!f) {
            i.output.showNegativeBadge('Can\'t chain with "{0}"'.format(p), 'Bridge "{0}" is not available.'.format(v)), zenscroll.intoView(i.sides, 400);
            break
        }
        h && f.options.set(m), i.attachChain(f), i.output.showStatus("chained!"), i.sides.classList.add("is-chained"), zenscroll.intoView(f.sides, 400), makeAutosizeTextareas(), makeColorpickers(), i = f
    }
    t(i)
}

function chainToolWith(l, e, t) {
    var n = l.sides,
        i = l.output,
        r = l.sides.querySelector(".side.output .side-widgets .widget-chain"),
        a = document.querySelector(".all-tools-container");
    r.classList.remove("is-disabled"), n.classList.remove("is-chained"), r.classList.add("is-disabled"), r.textContent = "Chaining...", i.showStatus("chaining..."), i.hideBadge(), Site.GET("chain.json?tool=" + e, function (u) {
        var c = u.responseText;
        if (u.readyState == 4 && u.status == 200) try {
            var p = JSON.parse(c);
            i.showStatus("loading libraries...");
            var m = {
                js: p.js,
                css: p.css
            };
            Site.resources.importFrom(m, function () {
                var h = document.createElement("div");
                h.innerHTML = p.html;
                var b = h.firstChild;
                a.insertBefore(b, l.sides.nextSibling);
                var L = createTool(p.call, {
                    sides: b,
                    examples: null,
                    chained: !0
                });
                l.attachChain(L), i.showStatus("chained!"), r.textContent = "Chained!", n.classList.add("is-chained"), i.hideBadge(), zenscroll.intoView(L.sides, 400), makeAutosizeTextareas(), makeColorpickers(), typeof t == "function" && t(L)
            })
        } catch (h) {
            console.log(h), i.showNegativeBadge("Server error", "Something has gone wrong while chaining the tool.", -1), r.classList.remove("is-disabled"), r.textContent = "Retry chain?"
        } else u.readyState == 4 && (i.showNegativeBadge("Server error", "We can't chain this tool due to a server error.", -1), r.classList.remove("is-disabled"), r.textContent = "Retry chain?")
    })
}

function makePrimaryTool() {
    var l = document.querySelector(".all-tools-container .tool-primary"),
        e = l.getAttribute("data-tool-bridge") || l.getAttribute("data-tool-url");
    primaryTool = createTool(e, {
        sides: l,
        examples: document.querySelector(".examples-primary"),
        chained: !1
    })
}

function createTool(l, e) {
    var t = window.bridges[l] !== void 0 ? window.bridges[l]() : !1,
        n = null;
    if (!t) return window.raise('Fatal error: Bridge "{0}" is not available.'.format(l)), n;
    var i = t.config,
        r = Object.keys(i).length == 0;
    if (r ? n = new TextTool(t.converter, null, e) : i.type == "text" ? n = new TextTool(t.converter, i, e) : i.type == "image" ? n = new ImageTool(t.converter, i, e) : i.type == "file" && (n = new FileTool(t.converter, i, e)), !r) {
        var a = i.override;
        for (var u in a) n.override(u).with(a[u])
    }
    return n.start()
}

function TextTool(l, e, t) {
    var n = new Tool({
        converter: l,
        sides: t.sides,
        examples: t.examples,
        chained: t.chained
    });
    return n
}

function FileTool(l, e, t) {
    var n = new Tool({
        converter: l,
        sides: t.sides,
        examples: t.examples,
        chained: t.chained
    });

    function i(v, f) {
        v.indexOf("http:") !== 0 && v.indexOf("https:") !== 0 && v.indexOf("ftp:") !== 0 && v.indexOf("/") !== 0 && (v = "http://" + v);
        var S = new XMLHttpRequest;
        S.onreadystatechange = function () {
            this.readyState == 4 && this.status == 200 ? f(this.response) : this.readyState == 4 && this.status == 0 && i("/get-external-file?url=" + encodeURIComponent(v), f)
        }, S.open("GET", v, !0), S.responseType = "blob", S.send()
    }
    var r = null,
        a = null;

    function u(v) {
        r.dataset.multitypeMode = v, n.input.currentMode = v, m()
    }

    function c() {
        return r.dataset.multitypeAllowText == "true"
    }

    function p() {
        return r.dataset.multitypeMode
    }

    function m() {
        console.log("Updating file info...")
    }

    function h(v) {
        v instanceof Blob ? (this.input.blob = v, u("file")) : (a.value = v, u("text"))
    }

    function b() {
        var v = p();
        if (v == "text") return a.value;
        if (v == "file") return this.input.blob
    }

    function L(v) {
        var f = this;
        f.input.showStatus("importing...");
        var S = v.target.files[0];
        S ? (f.input.setValue(S), f.input.showStatus("imported"), f.convert(Trigger.IMPORT)) : f.input.showWarningBadge("Can't import", "No file was selected.", -1)
    }

    function T(v) {
        var f = this,
            S = f.input.getValue();
        if (!S) return v(null, "nothing to save");
        if (S instanceof Blob) return v([S, "input-" + f.siteName + ".bin"], null);
        var O = new Blob([S], {
            type: "text/plain;charset=utf-8"
        });
        return v([O, "input-" + f.siteName + ".txt"], null)
    }

    function E() {
        var v = this,
            f = p();
        if (f == "text") {
            a.select();
            var S = !1;
            try {
                S = document.execCommand("copy")
            } catch (O) { }
            S ? v.input.showStatus("copied") : v.input.showStatus("can't copy")
        } else v.input.showStatus("can't copy files (yet)")
    }

    function x(v) {
        var f = this,
            S = v.querySelector(".input-sample");
        if (zenscroll ? zenscroll.intoView(f.sides, 400) : window.scrollTo(0, f.sides), S.classList.contains("text-sample"))
            if (c()) {
                var O = S.querySelector("span").textContent;
                f.input.setValue(O), f.options.set(f.options.get(v)), f.convert(Trigger.EXAMPLE)
            } else f.input.showWarningBadge("Unsupported example", "This example uses text input, which is not supported by this tool.");
        else {
            var A = S.getAttribute("data-src");
            f.options.set(f.options.get(v)), f.input.showStatus("loading example..."), i(A, function (B) {
                f.input.setValue(B), f.input.showStatus("imported"), f.convert(Trigger.EXAMPLE)
            })
        }
    }

    function I(v) {
        var f = this,
            S = v.queryURL,
            O = v.queryInput || v.savedInput,
            A = v.then,
            B = function (N) {
                var R = document.createElement("a");
                R.href = N;
                var o = R.hostname.split("."),
                    s = o[o.length - 1],
                    d = o[o.length - 2];
                return !d || !s ? "url" : d + "." + s
            };
        if (S) {
            var V = B(S);
            f.input.showStatus("loading from {0}...".format(V)), i(S, function (N) {
                f.input.setValue(N), f.input.showStatus("loaded from {0}".format(V)), f.convert(Trigger.IMPORT), A(!0)
            })
        } else c() && O && (f.input.showStatus("loading from input..."), f.input.setValue(O), f.input.showStatus("loaded from input"), f.convert(Trigger.RESTORE), A(!0));
        A()
    }
    return e.input && (r = n.input.element.querySelector(".data-wrapper"), a = r.querySelector(".mode-text .data"), n.input.currentMode = "file", n.input.blob = null, n.input.setValue = h.bind(n), n.input.getValue = b.bind(n), n.input.importFromFile = L.bind(n), n.input.download = T.bind(n), n.input.toClipboard = E.bind(n), n.setExample = x.bind(n), n.restore.input = I.bind(n)), n
}

function ImageTool(l, e, t) {
    var n = new Tool({
        converter: l,
        sides: t.sides,
        examples: t.examples,
        chained: t.chained
    });

    function i(o, s) {
        if (o.indexOf("data:") === 0) {
            for (var d = o.slice(5).split(";"), g = window.atob(d[1].split(",")[1]), w = [], C = 0; C < g.length; C++) w.push(g.charCodeAt(C));
            s(new Blob([new Uint8Array(w)], {
                type: d[0]
            }))
        } else {
            o.indexOf("http:") !== 0 && o.indexOf("https:") !== 0 && o.indexOf("ftp:") !== 0 && o.indexOf("/") !== 0 && (o = "http://" + o);
            var y = new XMLHttpRequest;
            y.onreadystatechange = function () {
                this.readyState == 4 && this.status == 200 ? s(this.response) : this.readyState == 4 && this.status == 0 && i("/get-external-file?url=" + encodeURIComponent(o), s)
            }, y.open("GET", o, !0), y.responseType = "blob", y.send()
        }
    }

    function r(o) {
        var s = o.input.element.querySelector(".widget-load input[type=file]");
        s.value = "", s.type = "", s.type = "file"
    }

    function a(o) {
        var s = this;
        if (o === void 0) {
            var d = s.output.element.querySelector(".data");
            d.toBlob(function (g) {
                s.dispatchEvent("response", g)
            });
            return
        }
        s.dispatchEvent("response", o)
    }

    function u() {
        return this.input.blob
    }

    function c() {
        return this.output.blob
    }

    function p(o) {
        this.output.blob = o
    }

    function m(o, s) {
        var d = this;
        if (!o) {
            s && s();
            return
        }
        if (o instanceof Blob) try {
            d.input.blob = o;
            var g = document.createElement("img");
            g.onload = function () {
                var w = d.input.element.querySelector("canvas.data"),
                    C = d.input.element.querySelector(".side-box");
                C.classList.remove("empty"), w.width = g.naturalWidth, w.height = g.naturalHeight, b(d), w.getContext("2d").drawImage(g, 0, 0), URL.revokeObjectURL(g.src), r(d), s && s()
            }, g.src = URL.createObjectURL(o)
        } catch (w) { } else typeof o == "string" && i(o, function (w) {
            m.call(d, w, s)
        })
    }

    function h(o, s) {
        s || (s = Trigger.IMPORT);
        var d = this;
        d.input.setValue(o, function () {
            d.input.showStatus("imported"), R.classList.remove("importing"), d.convert(s)
        })
    }

    function b(o) {
        for (var s = [o.input.element.querySelector("canvas.data"), o.output.element ? o.output.element.querySelector("canvas.data") : null, o.input.element.querySelector("canvas.preview"), o.output.element ? o.output.element.querySelector("canvas.preview") : null], d = 0; d < s.length; d++) s[d] && (s[d].classList.add("not-empty"), s[d].style.transform = "", s[d].removeAttribute("data-scroll-x"), s[d].removeAttribute("data-scroll-y"))
    }

    function L(o) {
        var s = this,
            d = o.querySelector(".input-sample"),
            g = d.getAttribute("data-src");
        zenscroll ? zenscroll.intoView(s.sides, 400) : window.scrollTo(0, s.sides), s.options.set(s.options.get(o)), s.input.showStatus("loading example..."), i(g, function (w) {
            h.call(s, w, Trigger.EXAMPLE)
        })
    }

    function T(o) {
        return function (s) {
            var d = this;
            return !d.input.blob || !d.input.element ? s(null, "nothing to save") : (typeof o == "function" && (o = o.call(d)), s([d.input.blob, "input-" + d.siteName + "." + o], null))
        }
    }

    function E(o) {
        var s = {
            png: "image/png",
            jpg: "image/jpeg",
            bmp: "image/bmp",
            gif: "image/gif"
        };
        return function (d) {
            var g = this;
            if (!g.output.element) return d(null, "nothing to save");
            typeof o == "function" && (o = o.call(g));
            var w = s[o] || "image/png",
                C = g.output.element.querySelector(".data");
            C.toBlob(function (y) {
                d([y, "output-" + g.siteName + "." + o], null)
            }, w)
        }
    }

    function x(o) {
        try {
            navigator.permissions.query({
                name: "clipboard-write"
            }).then(function (s) {
                o(s || null)
            })
        } catch (s) {
            o(null)
        }
    }

    function I(o, s) {
        var d = function (y) {
            s(y, null)
        },
            g = function (y) {
                s(null, y)
            };
        try {
            var w = {};
            w[o.type] = o;
            var C = [new ClipboardItem(w)];
            navigator.clipboard.write(C).then(d, g)
        } catch (y) {
            s(null, y)
        }
    }

    function v(o) {
        var s = this,
            d = s[o];
        x(function (g) {
            if (g === null) return d.showStatus("clipboard not supported");
            if (g.state !== "granted") return d.showStatus("clipboard access denied");
            d.download(function (w, C) {
                if (C !== null) return d.showStatus("nothing to copy");
                I(w[0], function (y, q) {
                    if (q !== null) return d.showStatus(q.message || "clipboard error");
                    d.showStatus("copied to clipboard!")
                })
            })
        })
    }

    function f(o) {
        var s = this;
        o.preventDefault();
        var d = s.input.element.querySelector(".side-box");
        d.classList.remove("dragging"), s.input.showStatus("")
    }

    function S(o) {
        var s = this;
        o.preventDefault(), s.input.showStatus("drop file to import!");
        var d = s.input.element.querySelector(".side-box");
        return d.classList.contains("dragging") || d.classList.add("dragging"), !1
    }

    function O(o) {
        var s = this,
            d = s.input.element.querySelector(".side-box");
        d.classList.remove("dragging");
        var g = o.dataTransfer;
        if (g.items)
            for (var w = 0; w < g.items.length; w++) g.items.remove(w);
        else o.dataTransfer.clearData()
    }

    function A(o, s) {
        s.preventDefault();
        var d = this,
            g = d.input.element.querySelector(".side-box");
        g.classList.remove("dragging"), g.classList.add("importing"), d.input.showStatus("importing...");
        for (var w = s.dataTransfer.files, C = o == "*", y = 0; y < w.length; y++) {
            var q = w[y];
            if (C || q.type.indexOf(o) !== -1) h.call(d, q, Trigger.IMPORT);
            else {
                var U = q.type ? '"' + q.type + '"' : "This";
                d.input.showWarningBadge("Can't import", U + " format is not allowed.", -1)
            }
        }
        return g.classList.remove("importing"), g.classList.remove("dragging"), !1
    }

    function B(o, s) {
        var d = this;
        d.input.showStatus("importing...");
        var g = (s.clipboardData || s.originalEvent.clipboardData).items,
            w = o == "*";
        for (var C in g) {
            var y = g[C];
            if (y.kind === "file") {
                var q = y.getAsFile();
                if (w || q.type.indexOf(o) !== -1) h.call(d, q, Trigger.IMPORT);
                else {
                    var U = q.type ? '"' + q.type + '"' : "This";
                    d.input.showWarningBadge("Can't import", U + " format is not allowed.", -1)
                }
            }
        }
    }

    function V(o) {
        var s = o.then;
        if (o.hasInput) {
            var d = function (w) {
                var C = document.createElement("a");
                C.href = w;
                var y = C.hostname.split("."),
                    q = y[y.length - 1],
                    U = y[y.length - 2];
                return !U || !q ? "url" : U + "." + q
            },
                g = o.queryURL || o.queryInput || o.savedInput;
            o.showStatus("loading from url..."), n.input.setValue(g, s)
        } else s()
    }

    function N(o) {
        var s = this;
        s.input.showStatus("importing...");
        var d = o.target.files[0];
        d ? h.call(s, d, Trigger.IMPORT) : s.input.showWarningBadge("Can't import", "No file was selected.", -1)
    }
    if (e.input) {
        if (e.input.import == "base64" && (n.input.importFromFile = N.bind(n)), e.parseImage === !1 ? n.parseImage = !1 : n.parseImage = !0, e.input.image == !0) {
            n.setExample = L.bind(n), document.addEventListener("paste", B.bind(n, "image/"));
            var R = n.input.element.querySelector(".side-box");
            R.addEventListener("dragover", S.bind(n), !1), R.addEventListener("dragend", O.bind(n), !1), R.addEventListener("dragleave", f.bind(n), !1), R.addEventListener("drop", A.bind(n, "image/"), !1), R.querySelector(".preview").addEventListener("click", function () {
                var o = n.input.element.querySelector(".side-box").classList.contains("empty");
                o && n.input.element.querySelector(".widget-load").click()
            }), n.input.setValue = m.bind(n), n.input.getValue = u.bind(n), n.restore.input = V.bind(n)
        }
        e.input.download && (n.input.download = T(e.input.download).bind(n)), n.input.toClipboard = v.bind(n, "input")
    }
    return e.output && (e.output.download && (n.output.download = E(e.output.download).bind(n)), n.output.toClipboard = v.bind(n, "output"), n.output.setValue = p.bind(n), n.output.getValue = c.bind(n), n.respond = a.bind(n)), n
}

function Tool(l) {
    var e = this;
    e.sides = l.sides, e.input = {
        getValue: function () {
            if (!e.input.element) return "";
            var t = e.input.element.querySelector("textarea.data");
            return t ? t.value : ""
        },
        setValue: function (t) {
            if (!e.input.element) return "";
            var n = e.input.element.querySelector("textarea.data");
            if (n) return n.value = t, e.save(), n.value
        },
        showStatus: function (t) {
            var n = e.input.element;
            return e.showStatus(n, t)
        },
        showPositiveBadge: function (t, n) {
            var i = e.input.element;
            return e.showBadge(i, "positive", t, n)
        },
        showNegativeBadge: function (t, n) {
            var i = e.input.element;
            return e.showBadge(i, "negative", t, n)
        },
        showWarningBadge: function (t, n) {
            var i = e.input.element;
            return e.showBadge(i, "warning", t, n)
        },
        hideBadge: function () {
            var t = e.input.element;
            return e.hideAllBadges(t)
        },
        importFromFile: function (t) {
            e.input.showStatus("importing...");
            var n = t.target.files[0];
            if (n) {
                var i = new FileReader;
                i.onload = function (r) {
                    var a = i.result;
                    e.input.setValue(a), e.convert(Trigger.IMPORT), e.input.showPositiveBadge("Import successful!", n.name + " (" + sizeToString(n.size) + ") imported as plain text.", -1)
                }, i.readAsText(n)
            } else e.input.showWarningBadge("Can't import", "No file was selected.", -1)
        },
        download: function (t) {
            var n = new Blob([e.input.getValue()], {
                type: "text/plain;charset=utf-8"
            });
            t([n, "input-" + e.siteName + ".txt"], null)
        },
        toClipboard: function () {
            return e.toClipboard(e.input)
        },
        showWidgetToggle: function (t) {
            e.dispatchEvent("widgetshow", {
                side: "input",
                name: t,
                cause: "function"
            })
        },
        hideWidgetToggle: function () {
            e.dispatchEvent("widgethide", {
                side: "input",
                cause: "function"
            })
        },
        element: null
    }, e.output = {
        getValue: function () {
            if (!e.output.element) return "";
            var t = e.output.element.querySelector("textarea.data");
            return t ? t.value : ""
        },
        setValue: function (t) {
            if (!e.output.element) return "";
            var n = e.output.element.querySelector("textarea.data");
            return n ? n.value = t : ""
        },
        showError: function (t) {
            e.output.hideError(), e.output.hideBadge(), e.output.element.classList.add("error"), e.output.showNegativeBadge("Can't convert.", "An error has occurred."), e.output.showStatus("error"), e.output.setValue("Error: {0}".format(t || "(not specified)"))
        },
        hideError: function () {
            e.output.hideBadge(), e.output.element.classList.remove("error")
        },
        showPositiveBadge: function (t, n) {
            var i = e.output.element;
            e.showBadge(i, "positive", t, n)
        },
        showNegativeBadge: function (t, n) {
            var i = e.output.element;
            e.showBadge(i, "negative", t, n)
        },
        showWarningBadge: function (t, n) {
            var i = e.output.element;
            e.showBadge(i, "warning", t, n)
        },
        hideBadge: function () {
            var t = e.output.element;
            e.hideAllBadges(t)
        },
        download: function (t) {
            var n = new Blob([e.output.getValue()], {
                type: "text/plain;charset=utf-8"
            });
            t([n, "output-" + e.siteName + ".txt"], null)
        },
        toClipboard: function () {
            return e.toClipboard(e.output)
        },
        showStatus: function (t) {
            var n = e.output.element;
            return e.showStatus(n, t)
        },
        showWidgetToggle: function (t) {
            e.dispatchEvent("widgetshow", {
                side: "output",
                name: t,
                cause: "function"
            })
        },
        hideWidgetToggle: function () {
            e.dispatchEvent("widgethide", {
                side: "output",
                cause: "function"
            })
        },
        element: null
    }, e.save = function () {
        if (!!e.isPrimary) {
            if (typeof Storage == "undefined") return e.warn("error:save", "local storage not supported"), !1;
            var t = e.input.element ? e.input.element.querySelector(".data") : !1,
                n = e.options.element,
                i = window.localStorage || null;
            if (i && i.setItem("autosave_origin", window.location.pathname), t && t.getAttribute("data-autosave") !== null) {
                var r = i.autosave_input,
                    a = e.input.getValue();
                r !== a && (i && i.setItem("autosave_input", a), e.input.showStatus("saved"))
            }
            if (n && n.getAttribute("data-autosave") !== null) {
                var r = i.autosave_options || {},
                    a = JSON.stringify(e.options.get());
                isEquivalent(r, a) || i && i.setItem("autosave_options", a)
            }
        }
    }, e.restore = {
        input: function (t) {
            var n = t.then;
            if (t.hasInput) {
                var i = function (u) {
                    var c = document.createElement("a");
                    c.href = u;
                    var p = c.hostname.split("."),
                        m = p[p.length - 1],
                        h = p[p.length - 2];
                    return !h || !m ? "url" : h + "." + m
                },
                    r = function (u) {
                        var c = e.input.setValue;
                        c.length == 2 ? c(u, n.bind(null, !0)) : c.length == 1 && (c(u), n(!0))
                    },
                    a = function (u, c) {
                        u.indexOf("http:") !== 0 && u.indexOf("https:") !== 0 && u.indexOf("ftp:") !== 0 && u.indexOf("/") !== 0 && (u = "http://" + u);
                        var p = new XMLHttpRequest;
                        p.onreadystatechange = function () {
                            this.readyState == 4 && this.status == 200 ? c(this.responseText) : this.readyState == 4 && this.status == 0 && a("/get-external-file?url=" + encodeURIComponent(u), c)
                        }, p.open("GET", u, !0), p.responseType = "text", p.send()
                    };
                t.queryURL ? (t.showStatus("loading from {0}...".format(i(t.queryURL))), a(t.queryURL, r)) : (t.showStatus("loading from input..."), r(t.queryInput || t.savedInput))
            } else n()
        },
        options: function (t) {
            var n = t.then;
            if (t.hasOptions) {
                t.savedOptions && e.options.set(t.savedOptions);
                var i = e.options.get(),
                    r = {};
                for (var a in t.fullQuery) {
                    var u = t.fullQuery[a] !== void 0,
                        c = i[a] !== void 0;
                    u && c && (r[a] = t.fullQuery[a])
                }
                var p = Object.keys(r).length > 0;
                p && e.options.set(r), n(p)
            } else n(!1)
        },
        all: function () {
            if (!!e.isPrimary) {
                var t = window.localStorage || {},
                    n = t.autosave_origin && window.location.pathname !== t.autosave_origin;
                n && (t.autosave_input = "", t.autosave_options = "{}");
                var i = getURLQuery(),
                    r = t.autosave_input || "",
                    a = JSON.parse(t.autosave_options || "{}"),
                    u = i.input,
                    c = i["input-url"];
                e.restore.input({
                    savedInput: r,
                    queryInput: u,
                    showStatus: e.input.showStatus,
                    hasInput: !!e.input.element,
                    queryURL: c,
                    then: function () {
                        e.restore.options({
                            savedOptions: a,
                            hasOptions: !!e.options.element,
                            fullQuery: i,
                            then: function (p) {
                                e.convert(Trigger.RESTORE), u === null && e.input.showWarningBadge("Can't load input from query", "The ?input parameter is malformed."), c === null && e.input.showWarningBadge("Can't load input from URL", "The ?input-url parameter is malformed.")
                            }
                        })
                    }
                })
            }
        }
    }, e.swap = function (t) {
        if (e.input.element && e.output.element) {
            var n = e.input.getValue() || "",
                i = e.output.getValue() || "",
                r = e.input.element.querySelector("label"),
                a = e.output.element.querySelector("label");
            if (!r.style.left) {
                var u = Math.abs(a.getBoundingClientRect().left - r.getBoundingClientRect().left);
                if (r.style.left = u + "px", a.style.left = -1 * u + "px", e.input.setValue(i), e.output.setValue(n), typeof Storage != "undefined") {
                    var c = window.localStorage;
                    c.setItem("autosave_origin", "/" + t), c.setItem("autosave_input", i)
                }
                setTimeout(function () {
                    window.location.assign("/" + t)
                }, 100)
            }
        }
    }, e.trigger = null, e.resetErrorsOnConvert = !0, e.respond = function (t) {
        t === void 0 && (t = e.output.getValue()), e.dispatchEvent("response", t)
    }, e.events = {
        response: [],
        optionchange: [],
        widgetshow: [],
        widgethide: []
    }, e.dispatchEvent = function (t, n) {
        if (Object.keys(e.events).indexOf(t) === -1) throw 'Event "' + t + '" is not supported';
        for (var i = e.events[t], r = 0; r < i.length; r++) {
            var a = i[r].handler.call(e, n);
            if (i[r].once && e.events[t].splice(r, 1), a === !1) break
        }
    }, e.removeEventListener = function (t, n) {
        if (Object.keys(e.events).indexOf(t) === -1) throw 'Event "' + t + '" is not supported';
        if (typeof n == "undefined") throw "Listener note is not specified";
        for (var i = e.events[t], r = 0; r < i.length; r++) i[r].note == n && e.events[t].splice(r, 1)
    }, e.addEventListener = function (t) {
        typeof t != "object" && (t = {});
        var n = t.event || "undefined",
            i = t.handler || !1;
        if (!i) throw "Event handler is not specified";
        if (Object.keys(e.events).indexOf(n) === -1) throw 'Event "' + n + '" is not supported';
        e.events[n].push({
            handler: i,
            note: t.note || void 0,
            once: t.once || !1
        })
    }, e.isPrimary = !l.chained, e.chainParent = null, e.chainChild = null, e.getCompatibility = function () {
        var t = e.sides,
            n = t.getAttribute("data-accepts") || !1,
            i = t.getAttribute("data-returns") || !1;
        return {
            accepts: n,
            returns: i
        }
    }, e.attachChain = function (t) {
        e.chainChild = t, t.chainParent = e, e.addEventListener({
            event: "response",
            note: "chain",
            handler: function (r) {
                var a = t.input.setValue;
                e.log({
                    type: "chain propagate",
                    from: e,
                    to: t,
                    data: r
                }), a.length == 2 ? a(r, function () {
                    t.convert(Trigger.CHAIN)
                }) : a.length == 1 && (a(r), t.convert(Trigger.CHAIN))
            }
        });
        var n = e.output.getValue();
        if (n) {
            e.log({
                type: "chain connect",
                from: e,
                to: t,
                data: n
            });
            var i = t.input.setValue;
            i.length == 2 ? i(n, function () {
                t.convert(Trigger.CHAIN)
            }) : i.length == 1 && (i(n), t.convert(Trigger.CHAIN))
        }
    }, e.removeChain = function () {
        e.chainChild.chainParent = null, e.chainChild = null, e.removeEventListener("response", "chain")
    }, e.convert = function (t) {
        var n = !!e.input.element,
            i = !!e.output.element;
        if (e.trigger = null, t && (e.trigger = t), e.log({
            type: "conversion",
            trigger: t
        }), n && i) {
            e.resetErrorsOnConvert && (e.output.hideError(), e.input.hideBadge());
            var r = e.input.getValue();
            try {
                var a = e.converter(r);
                a !== void 0 && e.dispatchEvent("response", a)
            } catch (u) {
                window.raise("<b>Conversion error:</b> " + u.toString()), console.error(u), r ? (e.warn("error:converting", u.toString()), e.output.showError(u)) : e.output.setValue("")
            }
        } else if (n && !i) {
            e.resetErrorsOnConvert && e.input.hideBadge();
            try {
                var r = e.input.getValue();
                e.converter(r)
            } catch (u) {
                window.raise("<b>Conversion error:</b> " + u.toString()), console.error(u), r ? (e.warn("error:converting", u.toString()), e.input.showNegativeBadge("Error has occured", u, -1)) : e.output.setValue("")
            }
        } else if (!n && i) {
            e.resetErrorsOnConvert && e.output.hideError();
            try {
                var a = e.converter();
                a !== void 0 && e.dispatchEvent("response", a)
            } catch (u) {
                window.raise("<b>Conversion error:</b> " + u.toString()), console.error(u), e.warn("error:converting", u.toString()), e.output.showError(u)
            }
        }
        e.save()
    }, e.converter = function () { }, e.options = {
        default: null,
        get: function (t) {
            var n = e.sides.getAttribute("data-override-options");
            if (t || (t = e.options.element), !t) return n ? JSON.parse(n) : {};
            var i = t.getAttribute("data-resets-all-options") !== null;
            i && e.options.reset();
            for (var r = t.querySelectorAll(".input-option"), a = {}, u = 0; u < r.length; u++) {
                var c = r[u],
                    p = c.getAttribute("data-index"),
                    m = null,
                    h = c.tagName.toLowerCase();
                c.type == "checkbox" || c.type == "radio" ? m = c.checked : (c.type == "text" || h == "textarea" || h == "select") && (m = c.value), a[p] = m
            }
            if (n) {
                var b = JSON.parse(n);
                for (var L in b) a[L] = b[L]
            }
            return a
        },
        set: function (t) {
            var n = e.options.element;
            if (n)
                for (var i = n.querySelectorAll(".input-option"), r = 0; r < i.length; r++) {
                    var a = i[r],
                        u = a.getAttribute("data-index");
                    if (typeof t[u] != "undefined") {
                        var c = t[u],
                            p = a.tagName.toLowerCase();
                        a.type == "checkbox" || a.type == "radio" ? a.checked = c : (a.type == "text" || p == "textarea" || p == "select") && (a.value = c), a.type == "textarea" && autosize.update(a)
                    }
                }
            return e.options.get()
        },
        reset: function () {
            e.options.set(e.options.default)
        },
        describe: function (t, n) {
            var i = e.options.element;
            if (i) {
                var r = i.querySelector('.option-detail-key[data-detail-key="' + t + '"]');
                r && (r.innerText = n)
            }
            return e.options.get()
        },
        element: null
    }, e.accidents = [], e.warn = function (t, n) {
        var i = {
            event: t,
            data: n
        };
        e.accidents.push(i), window.raise("<b>Tool warning:</b> (" + t.toString() + ") " + n.toString(), "warning")
    }, e.log = function (t) {
        window.log(e, t)
    }, e.init = function () {
        var t = e.sides,
            n = l.examples;
        e.input.element = t.querySelector(".side.input"), e.output.element = t.querySelector(".side.output"), e.options.element = t.querySelector(".converter-options");
        var i = e.options.element ? e.options.element.querySelectorAll(".option-row .option-details") : null;
        if (i)
            for (var r = 0; r < i.length; r++) {
                var a = i[r];
                a.innerHTML = a.innerHTML.replace(/{([a-z0-9\-]+)}/ig, function (o, s) {
                    var d = document.createElement("span");
                    return d.className = "option-detail-key", d.setAttribute("data-detail-key", s), d.innerText = "<" + s + ">", d.outerHTML
                })
            }
        var u = t.querySelector(".tool-toggle-layout");
        u && u.addEventListener("click", function () {
            t.classList.toggle("expanded"), setTimeout(function () {
                e.convert(Trigger.RESIZE)
            }, 100)
        });
        var c = t.querySelector(".sides-primary-button button");
        c && c.addEventListener("click", function () {
            e.convert(Trigger.ACTION)
        });
        var p = t.querySelector(".tool-swap");
        p && p.addEventListener("click", function (o) {
            var s = p.getAttribute("data-swap-to");
            e.swap(s)
        });
        var m = t.querySelector(".tool-create-link"),
            h = t.querySelector(".sides-wrapper"),
            b = t.querySelector(".tweet-link-button");
        if (b && b.addEventListener("click", function () {
            var o = this.getAttribute("data-tweet-url");
            window.open(o)
        }), m) {
            var L = m.querySelector(".tool-link"),
                T = function (o) {
                    (!o || !L.contains(o.target)) && (!o || o.stopPropagation(), m.classList.remove("active"), h.classList.remove("muted"), document.removeEventListener("click", T))
                };
            m.addEventListener("click", function (o) {
                if (!L.contains(o.target))
                    if (m.classList.contains("active")) T();
                    else {
                        var s = L.querySelector("input"),
                            d = window.location.origin + window.location.pathname + "?",
                            g = [],
                            w = e.options.get(),
                            C = {},
                            y = e.sides.getAttribute("data-override-options");
                        y && (C = JSON.parse(y));
                        var q = getChainData(e);
                        if (q.length > 0 && g.push("chain=" + encodeURIComponent(q.join(","))), e.input.element) {
                            var U = typeof e.input.getValue() == "string",
                                z = getURLQuery("input"),
                                j = getURLQuery("input-url");
                            j ? g.push("input-url=" + encodeURIComponent(j)) : z ? g.push("input=" + encodeURIComponent(z)) : U && g.push("input=" + encodeURIComponent(e.input.getValue()))
                        }
                        var k = Object.keys(w);
                        if (k.length)
                            for (var M = 0; M < k.length; M++) {
                                var P = k[M];
                                if (C[P] === void 0) {
                                    var W = w[P];
                                    g.push(encodeURIComponent(P) + "=" + encodeURIComponent(W))
                                }
                            }
                        s.value = d + g.join("&"), o.stopPropagation(), m.classList.add("active"), h.classList.add("muted"), document.addEventListener("click", T), setTimeout(function () {
                            s.select(), s.focus(), s.select()
                        }, 201)
                    }
            })
        }
        if (e.input.element) {
            makeToggleableWidgets(e, "input"), e.input.element.addEventListener("keyup", function () {
                e.convert(Trigger.KEYPRESS)
            });
            var E = t.querySelector(".widget-load");
            E.addEventListener("click", function () {
                t.querySelector(".widget-load input").click()
            });
            var x = t.querySelector(".widget-load input");
            x.addEventListener("change", function (o) {
                e.input.importFromFile(o)
            }, !1);
            var I = t.querySelector(".input .widget-save-as");
            I.addEventListener("click", function () {
                e.input.showStatus("saving..."), e.input.download(function (o, s) {
                    if (s) return e.input.showStatus(s);
                    saveAs(o[0], o[1])
                })
            });
            var v = t.querySelector(".input .widget-copy");
            v.addEventListener("click", function () {
                e.input.toClipboard()
            })
        }
        if (e.output.element) {
            makeToggleableWidgets(e, "output"), e.addEventListener({
                event: "widgetshow",
                handler: function (o) {
                    if (o.name == "toggle-chain") {
                        var s = t.querySelector(".output");
                        populateChainCombinator(e, s)
                    }
                }
            }), e.addEventListener({
                event: "widgetshow",
                handler: function (o) {
                    if (o.name == "toggle-remove-chain") {
                        var s = getChainData(e).length;
                        s == 1 ? s += " tool" : s > 1 && (s += " tools");
                        var d = t.querySelector(".output .toggle-remove-chain .remove-how-many");
                        d.textContent = s
                    }
                }
            }), e.addEventListener({
                event: "widgethide",
                handler: function (o) {
                    var s = t.querySelector(".output"),
                        d = s.classList.contains("combinator-active");
                    o.side == "output" && d && s.classList.remove("combinator-active")
                }
            });
            var f = t.querySelector(".output .toggle-remove-chain .remove-chain-yes");
            f.addEventListener("click", function () {
                removeChainedTools(e), e.output.hideWidgetToggle()
            });
            var S = t.querySelector(".output .toggle-chain .chain-search");
            S.addEventListener("keyup", function () {
                chainSearch(t)
            });
            var O = t.querySelector(".output .widget-copy");
            O.addEventListener("click", function () {
                e.output.toClipboard()
            });
            var A = t.querySelector(".output .widget-save-as");
            A.addEventListener("click", function () {
                e.output.showStatus("saving..."), e.output.download(function (o, s) {
                    if (s) return e.input.showStatus(s);
                    saveAs(o[0], o[1])
                })
            })
        }
        if (e.globalHandlers.convertOnResize = e.globalHandlers.convertOnResize.bind(e), window.addEventListener("resize", e.globalHandlers.convertOnResize), n) {
            var B = n.querySelectorAll(".card");
            if (B)
                for (var r = 0; r < B.length; r++)(function (s) {
                    s.addEventListener("click", function (d) {
                        e.setExample.call(e, s)
                    })
                })(B[r])
        }
        e.addEventListener({
            event: "optionchange",
            handler: e.convert.bind(e, Trigger.OPTIONS)
        });
        var V = t.querySelectorAll(".converter-options .input-option");
        if (V)
            for (var r = 0; r < V.length; r++) {
                var N = V[r];
                N.addEventListener("change", e.dispatchEvent.bind(e, "optionchange")), N.addEventListener("keyup", e.dispatchEvent.bind(e, "optionchange"))
            }
        e.addEventListener({
            event: "response",
            handler: function (o) {
                e.log({
                    type: "response self",
                    data: o
                }), this.output.setValue(o)
            }
        }), e.addEventListener({
            event: "widgetshow",
            handler: function (o) {
                showWidgetToggle(e, o.side, o.name)
            }
        }), e.addEventListener({
            event: "widgethide",
            handler: function (o) {
                hideWidgetToggle(e, o.side)
            }
        }), t.tool = e, e.converter = l.converter, e.sides = t;
        var R = t.querySelector(".tool-favorite");
        R && (R.addEventListener("click", e.favorite.bind(e)), e.favorite()), e.options.default = e.options.get()
    }, e.override = function (t) {
        t = t.split(".");
        for (var n = e, i = null, r = 0; r < t.length; r++)
            if (i = t[r], n[i] !== void 0) r != t.length - 1 && (n = n[i]);
            else throw "tool." + t.splice(0, r).join(".") + " does not contain " + i;
        return {
            with: function (a) {
                n[i] = a.bind(e)
            }
        }
    }, e.destroy = function () {
        e.output.element = null, e.output.tool = null, e.input.element = null, e.input.tool = null, e.options.element = null, e.converter = null, e.sides.tool = null, e.sides.innerHTML = e.sides.innerHTML, e.sides.parentElement.removeChild(e.sides), e.sides = null;
        for (var t in e.events) e.events[t] = [];
        window.removeEventListener("resize", e.globalHandlers.convertOnResize), e = null
    }, e.input.tool = e, e.output.tool = e, e.init(), e.start = function () {
        return e.restore.all(), e
    }
}
var Trigger = Object.freeze({
    OPTIONS: 1,
    ACTION: 2,
    KEYPRESS: 3,
    RESIZE: 4,
    RESTORE: 5,
    EXAMPLE: 6,
    IMPORT: 7,
    CHAIN: 8
});
Tool.prototype.globalHandlers = {
    convertOnResize: function () {
        this.convert(Trigger.RESIZE)
    }
}, Tool.prototype.setExample = function (l) {
    var e = this,
        t = l.querySelector(".text-sample.input-sample span"),
        n = t ? t.textContent : "";
    e.input.setValue(n), e.options.set(e.options.get(l)), e.convert(Trigger.EXAMPLE), zenscroll ? zenscroll.intoView(e.sides, 400) : window.scrollTo(0, e.sides)
}, Tool.prototype.favorite = function (l) {
    var e = this;
    if (typeof Storage != "undefined") {
        var t = window.localStorage || null,
            n = JSON.parse(t && t.favorite_tools || "[]"),
            i = "/" + window.location.pathname.split("/")[1];
        if (l) {
            var r = n.indexOf(i);
            r !== -1 ? n.splice(r, 1) : n.push(i)
        }
        t && t.setItem("favorite_tools", JSON.stringify(n));
        var a = n.indexOf(i) !== -1,
            u = e.sides.querySelector(".tool-favorite");
        u.classList.remove("active"), a && u.classList.add("active"), Site.sortAllTools()
    }
}, Tool.prototype.showBadge = function (l, e, t, n) {
    if (this.hideAllBadges(l), l && (e == "negative" || e == "positive" || e == "warning")) {
        var i = 5,
            r = l.querySelector(".badge .badge-title"),
            a = l.querySelector(".badge .badge-message");
        r.textContent = t, a.textContent = n, l.classList.add("badge-" + e);
        var u = l.querySelector(".badge").offsetHeight,
            c = l.querySelector(".data-wrapper");
        c && (c.style.paddingTop = u + i + "px")
    }
}, Tool.prototype.siteName = function () {
    return /^local/.test(window.location.host) ? window.location.host.split(".")[1] : window.location.host.split(".")[0]
}(), Tool.prototype.hideAllBadges = function (l) {
    if (!!l) {
        var e = l.querySelector(".data-wrapper");
        e && (e.style.paddingTop = ""), l.classList.remove("badge-negative"), l.classList.remove("badge-positive"), l.classList.remove("badge-warning")
    }
}, Tool.prototype.showStatus = function (l, e) {
    if (!!l) {
        var t = 1e3,
            n = l.querySelector("label .status"),
            i = Math.random();
        n.textContent = e, n.className = "status active", n.setAttribute("animation-id", i), setTimeout(function () {
            i == n.getAttribute("animation-id") && (n.classList.remove("active"), setTimeout(function () {
                n.textContent = ""
            }, 200))
        }, t)
    }
}, Tool.prototype.toClipboard = function (l) {
    var e = l.element.querySelector(".data");
    e.select();
    try {
        var t = document.execCommand("copy");
        t ? l.showStatus("copied") : l.showStatus("can't copy")
    } catch (n) { }
};

function makeWrappingExamples() {
    window.addEventListener("resize", updateExamples), updateExamples()
}

function chainSearch(l) {
    for (var e = l.querySelector(".side.output"), t = e.querySelector(".tool-combinator .combinator-tools"), n = t.querySelectorAll(".combinator-tool"), i = e.querySelector(".side-widgets .toggle-chain .chain-search"), r = function (h) {
        return Site.removeStopWords(h.toLowerCase())
    }, a = r(i.value), u = 0; u < n.length; u++) {
        var c = n[u],
            p = r(c.querySelector(".combinator-title").textContent),
            m = r(c.querySelector(".combinator-description").textContent);
        c.classList.remove("hidden"), p.indexOf(a) === -1 && m.indexOf(a) === -1 && (c.classList.add("hidden"), t.appendChild(c))
    }
}

function makeColorpickers() {
    Site.applyToAllElements(".input-option.color.active.not-initialized", function (l) {
        l.classList.remove("not-initialized"), Colorpicker.create(l)
    })
}

function makeAutosizeTextareas() {
    Site.applyToAllElements("textarea.autosize.not-initialized", function (l) {
        l.classList.remove("not-initialized"), autosize(l)
    })
}

function populateChainCombinator(l, e) {
    var t = e.querySelector(".side-widgets-toggle .toggle-chain .widget-chain-search"),
        n = t.querySelector(".chain-search"),
        i = e.querySelector(".tool-combinator .combinator-list"),
        r = l.getCompatibility().returns || "nothing",
        a = 250;
    t.classList.remove("state-wait"), t.classList.remove("state-search"), t.classList.remove("state-error"), t.classList.add("state-wait"), n.disabled = !0, n.value = "", i.scrollTop = 0, n.placeholder = "Connecting to server...";
    var u = "all-tools.json?accepts={0}".format(r);
    Site.GET(u, function (c) {
        var p = c.responseText;
        if (c.readyState == 4 && c.status == 200) try {
            var m = JSON.parse(p);
            if (m.error || !m.json) t.classList.remove("state-wait"), t.classList.add("state-error"), n.placeholder = "Tools unavailable.";
            else {
                n.placeholder = "Loading all tools...";
                for (var h = i.querySelector(".combinator-tools"); h.firstChild;) h.removeChild(h.firstChild);
                for (var b in m.json)
                    for (var L = 0; L < m.json[b].length; L++) {
                        var T = m.json[b][L],
                            E = document.createElement("div");
                        E.className = "combinator-tool", E.setAttribute("data-url", T.url);
                        var x = document.createElement("span");
                        x.className = "combinator-title", x.textContent = T.title;
                        var I = document.createElement("span");
                        I.className = "combinator-description", I.textContent = T.desc, E.appendChild(x), E.appendChild(I),
                            function (v) {
                                v.addEventListener("click", function () {
                                    chainToolWith(l, this.getAttribute("data-url")), l.output.hideWidgetToggle()
                                })
                            }(E), h.appendChild(E)
                    }
                setTimeout(function () {
                    t.classList.remove("state-wait"), t.classList.add("state-search"), n.disabled = !1, n.placeholder = "Search all tools...", n.focus(), e.classList.remove("combinator-active"), e.classList.add("combinator-active")
                }, a)
            }
        } catch (v) {
            t.classList.remove("state-wait"), t.classList.add("state-error"), n.placeholder = "Can't load."
        } else c.readyState == 4 && (t.classList.remove("state-wait"), t.classList.add("state-error"), n.placeholder = "Unexpected response.")
    })
}

function makeToggleableWidgets(l, e) {
    for (var t = l[e].element.querySelector(".side-widgets"), n = t.querySelector(".side-widgets-wrapper"), i = t.querySelector(".side-widgets-toggle"), r = t.querySelectorAll(".widget"), a = 0; a < r.length; a++)(function (c) {
        c.addEventListener("click", function () {
            var p = c.getAttribute("data-toggle"),
                m = c.getAttribute("data-hides-toggle") !== null;
            p && l.dispatchEvent("widgetshow", {
                side: e,
                cause: "click",
                name: p
            }), m && l.dispatchEvent("widgethide", {
                side: e,
                cause: "click"
            })
        })
    })(r[a]);
    var u = i.querySelector(".toggle-hide");
    u.addEventListener("click", function () {
        l.dispatchEvent("widgethide", {
            cause: "close",
            side: e
        })
    }), window.addEventListener("keyup", function (c) {
        var p = c.key.toLowerCase(),
            m = p == "esc" || p == "escape",
            h = t.classList.contains("toggled");
        m && h && l.dispatchEvent("widgethide", {
            cause: "esc",
            side: e
        })
    })
}

function hideWidgetToggle(l, e) {
    var t = l[e].element;
    if (t) {
        var n = t.querySelector(".side-widgets"),
            i = n.querySelector(".side-widgets-wrapper"),
            r = n.querySelector(".side-widgets-toggle");
        i.style.transform = "rotateX(0deg) translateY(0px) translateZ(0px)", r.style.transform = "rotateX(90deg) translateY(-50%) translateZ({0}px)".format(n.offsetHeight / 2), n.classList.remove("toggled")
    }
}

function showWidgetToggle(l, e, t) {
    var n = l[e].element;
    if (n) {
        var i = n.querySelector(".side-widgets"),
            r = i.querySelector(".side-widgets-wrapper"),
            a = i.querySelector(".side-widgets-toggle");
        if (hideWidgetToggle(l, e), t) {
            var u = a.querySelector("." + t);
            if (u) {
                for (var c = i.querySelectorAll(".side-widgets-toggle .toggle-wrapper .widget-toggle"), p = 0; p < c.length; p++) c[p].classList.remove("toggle-active");
                u.classList.add("toggle-active"), a.style.transform = "rotateX(0deg) translateY(0px) translateZ(0px)", r.style.transform = "rotateX(-90deg) translateY(50%) translateZ({0}px)".format(i.offsetHeight / 2), i.classList.remove("toggled"), i.classList.add("toggled")
            } else window.raise("Widget tried to toggle section .{0}, but it does not exists.".format(t))
        }
    }
}

function updateExamples() {
    for (var l = document.querySelectorAll(".examples .wrapper"), e = 0; e < l.length; e++) {
        var t = l[e],
            n = t.querySelector(".sample");
        if (!n.querySelector(".file-sample")) {
            n.classList.remove("big");
            var i = 5,
                r = t.getBoundingClientRect().width,
                a = n.scrollWidth;
            a >= r - i && n.classList.add("big")
        }
    }
}

function buildURLQuery(l) {
    var e = [];
    for (var t in l) {
        var n = l[t];
        e.push(encodeURIComponent(t) + (n ? "=" + encodeURIComponent(n) : ""))
    }
    return "?" + e.join("&")
}

function getURLQuery(l) {
    for (var e = window.location.search.substring(1).split("&"), t = {}, n = 0; n < e.length; n++) {
        var i = e[n].split("=");
        try {
            var r = decodeURIComponent(i[0])
        } catch (u) {
            continue
        }
        try {
            var a = decodeURIComponent(i[1] || "")
        } catch (u) {
            var a = null
        } (a == "true" || a == "yes" || a == "false" || a == "no") && (a = a == "true" || a == "yes"), r && (t[r] = a)
    }
    return l ? t[l] : t
}

function isEquivalent(l, e) {
    if (typeof l != "object" || typeof e != "object") return !1;
    var t = Object.getOwnPropertyNames(l),
        n = Object.getOwnPropertyNames(e);
    if (t.length != n.length) return !1;
    for (var i = 0; i < t.length; i++) {
        var r = t[i];
        if (l[r] !== e[r]) return !1
    }
    return !0
}

function sizeToString(l, e) {
    if (l == 0) return "empty";
    var t = 1024,
        n = e || 2,
        i = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        r = Math.floor(Math.log(l) / Math.log(t));
    return parseFloat((l / Math.pow(t, r)).toFixed(n)) + i[r]
}