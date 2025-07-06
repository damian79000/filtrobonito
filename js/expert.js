function MA(b, a, c, g) {
    98 <= c && (c = 90);
    let h = [],
        e;
    var f;
    let d, k;
    switch (a) {
        case "simple":
            e = 0;
            a = b.length - 1;
            a < c && (a = c);
            for (d = 1; d < c; d++, a--) e += b[a][g];
            for (; 0 <= a;) e += b[a][g], h[a] = e / c, e -= b[a + c - 1][g], a--;
            for (d = 1; d < c; d++) h[b.length - d] = 0;
            break;
        case "exponential":
            c = 2 / (c + 1);
            for (a = b.length - 2; 0 <= a;) a == b.length - 2 && (h[a + 1] = b[a + 1][g]), h[a] = b[a][g] * c + h[a + 1] * (1 - c), a--;
            break;
        case "smoothed":
            e = 0;
            a = b.length - c;
            a > b.length && (a = b.length);
            for (; 0 <= a;) {
                if (a == b.length - c)
                    for (d = 0, f = a; d < c; d++, f++) e += b[f][g], h[f] = 0;
                else e = h[a + 1] * (c -
                    1) + b[a][g];
                h[a] = e / c;
                a--
            }
            break;
        case "lweighted":
            let l = f = e = 0;
            a = b.length - 1;
            a < c && (a = c);
            for (d = 1; d <= c; d++, a--) k = b[a][g], e += k * d, f += k, l += d;
            a++;
            for (d = a + c; 0 <= a;) {
                h[a] = e / l;
                if (0 == a) break;
                a--;
                d--;
                k = b[a][g];
                e = e - f + k * c;
                f -= b[d][g];
                f += k
            }
    }
    return h
}

function AverageTrueRange(b, a) {
    let c = [];
    for (let g = 0; g < b.length - 1; g++) c.push({
        close: Math.max(b[g].high - b[g].low, b[g].high - b[g + 1].close, b[g + 1].close - b[g].low)
    });
    return MA(c, "simple", a, "close")
}

function stdDev(b, a, c, g) {
    let h = 0;
    if (b >= g) {
        for (let e = 0; e < g; e++) h += Math.pow(a[b - e] - c[b], 2);
        h = Math.sqrt(h / g)
    }
    return h
}
let Indicators = {
    rsi: (b, a, c) => {
        try {
            let g = [{
                "valRsi<btl": () => n < q
            }, {
                "valRsi>tpl": () => n > r
            }, {
                "valRsi<tpl && valRsi>btl": () => n < r && n > q
            }, {
                "false": () => !1
            }];
            for (let p in c)
                if (void 0 == g.find(t => Object.keys(t)[0] == c[p])) return {
                    signal: !1
                };
            a.checkBar *= -1;
            if (a.periodRsi + 1 + a.checkBar > b.bars.length) return {
                signal: !1
            };
            let h = b.bars.slice().reverse(),
                e, f;
            b = [];
            let d = [],
                k = [];
            b[0] = 0;
            d[0] = 0;
            let l = k[0] = 0,
                m = 0;
            for (e = 1; e <= a.periodRsi; e++) b[e] = 0, d[e] = 0, k[e] = 0, f = h[e][a.priceType] - h[e - 1][a.priceType], 0 < f ? l += f : m -= f;
            d[a.periodRsi] =
                l / a.periodRsi;
            k[a.periodRsi] = m / a.periodRsi;
            b[a.periodRsi] = 0 != k[a.periodRsi] ? 100 - 100 / (1 + d[a.periodRsi] / k[a.periodRsi]) : 0 != d[a.periodRsi] ? 100 : 50;
            for (e = a.periodRsi + 1; e < h.length; e++) f = h[e][a.priceType] - h[e - 1][a.priceType], d[e] = (d[e - 1] * (a.periodRsi - 1) + (0 < f ? f : 0)) / a.periodRsi, k[e] = (k[e - 1] * (a.periodRsi - 1) + (0 > f ? -f : 0)) / a.periodRsi, b[e] = 0 != k[e] ? 100 - 100 / (1 + d[e] / k[e]) : 0 != d[e] ? 100 : 50;
            let n, q, r;
            n = b.slice().reverse()[a.checkBar];
            q = a.btl;
            r = a.tpl;
            a = {
                signal: !1
            };
            for (let p in c) try {
                g.find(t => Object.keys(t)[0] == c[p])[c[p]]() &&
                    (a.signal = !0, a[p] = !0)
            } catch (t) {
                throw t;
            }
            return a
        } catch (g) {
            return {
                signal: !1
            }
        }
    },
    candle: (b, a, c) => {
        try {
            let g = (p, t) => {
                    p = p.open - p.close;
                    if (0 > p) return {
                        dir: "up",
                        size: Math.round(p / -t)
                    };
                    if (0 < p) return {
                        dir: "down",
                        size: Math.round(p / t)
                    };
                    if (0 == p) return {
                        dir: "neutral",
                        size: 0
                    }
                },
                h = [{
                    "lastdir=='up'": () => "up" == n
                }, {
                    "lastdir=='down'": () => "down" == n
                }, {
                    candleFalse: () => !1
                }];
            for (let p in c)
                if (void 0 == h.find(t => Object.keys(t)[0] == c[p])) return {
                    signal: !1
                };
            let e = b.bars.slice();
            if (0 == e.length) return {
                signal: !1
            };
            let f = b.symbolPoint;
            0 > a.bar && (a.bar *= -1);
            let d = a.num\u0421andles,
                k = a.minSizeBar,
                l = a.maxSizeBar,
                m = a.bar,
                n, q, r;
            switch (a.typeCandle) {
                case "repeat":
                    n = null;
                    for (b = m; b < e.length && b < m + d; b++) {
                        q = g(e[b], f);
                        if (q.size < k || q.size > l) return {
                            signal: !1
                        };
                        if (null == n) n = q.dir;
                        else if (n != q.dir) return {
                            signal: !1
                        }
                    }
                    r = {
                        signal: !1
                    };
                    for (let p in c) try {
                        h.find(t => Object.keys(t)[0] == c[p])[c[p]]() && (r.signal = !0, r[p] = !0)
                    } catch (t) {
                        throw t;
                    }
                    return r;
                case "alternate":
                    b = n = null;
                    for (a = m; a < e.length && a < m + d; a++) {
                        q = g(e[a], f);
                        if (q.size < k || q.size > l) return {
                            signal: !1
                        };
                        if (null == n) b = n = q.dir;
                        else {
                            if (n == q.dir) return {
                                signal: !1
                            };
                            n = q.dir
                        }
                    }
                    n = b;
                    r = {
                        signal: !1
                    };
                    for (let p in c) try {
                        h.find(t => Object.keys(t)[0] == c[p])[c[p]]() && (r.signal = !0, r[p] = !0)
                    } catch (t) {
                        throw t;
                    }
                    return r;
                default:
                    return {
                        signal: !1
                    }
            }
        } catch (g) {
            return {
                signal: !1
            }
        }
    },
    bb: (b, a, c) => {
        try {
            let g = [{
                "checkPrice<downLineBb": () => r < q
            }, {
                "checkPrice>upLineBb": () => r > n
            }, {
                "checkPrice>downLineBb && checkPrice<upLineBb": () => r > q && r < n
            }, {
                "false": () => !1
            }];
            for (let p in c)
                if (void 0 == g.find(t => Object.keys(t)[0] == c[p])) return {
                    signal: !1
                };
            let h =
                b.bars;
            0 > a.checkBar && (a.checkBar *= -1);
            let e;
            b = [];
            let f = [],
                d = [],
                k = [];
            if (h.length <= a.bbPeriod || 0 >= a.bbPeriod) return {
                signal: !1
            };
            let l = [];
            for (e = 0; e < h.length; e++) l.unshift(h[e][a.priceType]);
            for (e = 0; e < a.bbPeriod; e++) b[e] = 0, f[e] = 0, d[e] = 0;
            let m = MA(h, "simple", a.bbPeriod, a.priceType).reverse();
            for (; e < h.length; e++) {
                if ("undefined" == typeof m[e]) return {
                    signal: !1
                };
                b[e] = m[e];
                k[e] = stdDev(e, l, b, a.bbPeriod);
                f[e] = b[e] + a.inpDeviation * k[e];
                d[e] = b[e] - a.inpDeviation * k[e]
            }
            f.reverse();
            d.reverse();
            let n = f[a.checkBar],
                q = d[a.checkBar],
                r = h[a.checkBar][a.priceTypeAsset];
            a = {
                signal: !1
            };
            for (let p in c) try {
                g.find(t => Object.keys(t)[0] == c[p])[c[p]]() && (a.signal = !0, a[p] = !0)
            } catch (t) {
                throw t;
            }
            return a
        } catch (g) {
            return {
                signal: !1
            }
        }
    },
    level: (b, a, c) => {
        try {
            let g = [{
                "prise<min_level": () => k < d
            }, {
                "prise>max_level": () => k > f
            }, {
                "prise<max_level": () => k < f
            }, {
                "prise>min_level": () => k > d
            }, {
                "ticks[1]<max_level && ticks[0]>max_level": () => e[1] < f && e[0] > f && 0 == a.checkBar
            }, {
                "ticks[1]>max_level && ticks[0]<max_level": () => e[1] > f && e[0] < f && 0 == a.checkBar
            }, {
                "ticks[1]<min_level && ticks[0]>min_level": () =>
                    e[1] < d && e[0] > d && 0 == a.checkBar
            }, {
                "ticks[1]>min_level && ticks[0]<min_level": () => e[1] > d && e[0] < d && 0 == a.checkBar
            }, {
                levelFalse: () => !1
            }];
            for (let l in c)
                if (void 0 == g.find(m => Object.keys(m)[0] == c[l])) return {
                    signal: !1
                };
            let h = b.bars,
                e = b.ticks.slice(-5).reverse().map(l => l.price);
            0 > a.checkBar && (a.checkBar *= -1);
            94 < a.periodLevel && (a.periodLevel = 94);
            let f = -Infinity,
                d = Infinity,
                k = h[a.checkBar].close;
            a.initCalcBar = a.initCalcBar ? 0 > a.initCalcBar ? -1 * a.initCalcBar : a.initCalcBar : 1;
            for (let l = a.initCalcBar, m = 0; m < a.periodLevel; l++,
                m++) h[l][a.priceTypeMaxLevel] > f && (f = h[l][a.priceTypeMaxLevel]), h[l][a.priceTypeMinLevel] < d && (d = h[l][a.priceTypeMinLevel]);
            b = {
                signal: !1
            };
            for (let l in c) try {
                g.find(m => Object.keys(m)[0] == c[l])[c[l]]() && (b.signal = !0, b[l] = !0)
            } catch (m) {
                throw m;
            }
            return b
        } catch (g) {
            return {
                signal: !1
            }
        }
    },
    kchannel: (b, a, c) => {
        try {
            let g = [{
                "check_price<down_line": () => l < k
            }, {
                "check_price>up_line": () => l > d
            }, {
                "check_price>down_line && check_price<up_line": () => l > k && l < d
            }, {
                "false": () => !1
            }];
            for (let m in c)
                if (void 0 == g.find(n => Object.keys(n)[0] ==
                        c[m])) return {
                    signal: !1
                };
            let h = b.bars.slice();
            0 > a.checkBar && (a.checkBar *= -1);
            let e = MA(h, "exponential", a.periodEma, "close"),
                f = AverageTrueRange(h, a.periodAtr),
                d = e[a.checkBar] + f[a.checkBar] * a.multiplier,
                k = e[a.checkBar] - f[a.checkBar] * a.multiplier,
                l = h[a.checkBar][a.priceTypeAsset];
            b = {
                signal: !1
            };
            for (let m in c) try {
                g.find(n => Object.keys(n)[0] == c[m])[c[m]]() && (b.signal = !0, b[m] = !0)
            } catch (n) {
                throw n;
            }
            return b
        } catch (g) {
            return {
                signal: !1
            }
        }
    },
    stochastic: (b, a, c) => {
        try {
            let e = [{
                "_d<_b && _k<_b && _k>_d": () => r < w && p <
                    w && p > r
            }, {
                "_d>_t && _k>_t && _k>_d": () => r > t && p > t && p > r
            }, {
                "_d>_t && _k>_t && _k<_d": () => r > t && p > t && p < r
            }, {
                "_d > _b && _d < _t && _k > _b && _k < _t && _k > _d": () => r > w && r < t && p > w && p < t && p > r
            }, {
                "_d > _b && _d < _t && _k > _b && _k < _t && _k < _d": () => r > w && r < t && p > w && p < t && p < r
            }, {
                "_d<_b && _k<_b && _k<_d": () => r < w && p < w && p < r
            }, {
                "_k>_t": () => p > t
            }, {
                "_k<_t && _k>_b": () => p < t && p > w
            }, {
                "_k<_b": () => p < w
            }, {
                "_d>_t": () => r > t
            }, {
                "_d<_t && _d>_b": () => r < t && r > w
            }, {
                "_d<_b": () => r < w
            }, {
                stohFalse: () => !1
            }];
            for (let x in c)
                if (void 0 == e.find(y =>
                        Object.keys(y)[0] == c[x])) return {
                    signal: !1
                };
            let f = b.bars.slice().reverse();
            0 > a.checkBar && (a.checkBar *= -1);
            let d, k, l;
            b = [];
            let m = [],
                n = [],
                q = [];
            if (f.length <= a.periodK + a.periodD + a.slowdown) return {
                signal: !1
            };
            l = a.periodK - 1;
            for (d = 0; d < l; d++) b[d] = 0, m[d] = 0;
            for (d = l; d < f.length; d++) {
                var g = Infinity,
                    h = -Infinity;
                for (k = d - a.periodK + 1; k <= d; k++) g > f[k].low && (g = f[k].low), h < f[k].high && (h = f[k].high);
                b[d] = g;
                m[d] = h
            }
            l = a.periodK - 1 + a.slowdown - 1;
            for (d = 0; d < l; d++) n[d] = 0;
            for (d = l; d < f.length; d++) {
                h = g = 0;
                for (k = d - a.slowdown + 1; k <= d; k++) g +=
                    f[k].close - b[k], h += m[k] - b[k];
                n[d] = 0 == h ? 100 : Math.round(g / h * 100)
            }
            l = a.periodD - 1;
            for (d = 0; d < l; d++) q[d] = 0;
            n.reverse();
            q = MA(n.map(x => ({
                close: x
            })), {
                sma: "simple",
                ema: "exponential",
                wma: "lweighted",
                smma: "smoothed"
            } [a.ma], a.periodD, "close");
            let r = q[a.checkBar],
                p = n[a.checkBar],
                t = a.tpl,
                w = a.btl;
            a = {
                signal: !1
            };
            for (let x in c) try {
                e.find(y => Object.keys(y)[0] == c[x])[c[x]]() && (a.signal = !0, a[x] = !0)
            } catch (y) {
                throw y;
            }
            return a
        } catch (e) {
            return {
                signal: !1
            }
        }
    },
    twoMa: (b, a, c) => {
        try {
            let g = [{
                "onema>toma": () => e > f
            }, {
                "onema<toma": () =>
                    e < f
            }, {
                twoMaFalse: () => !1
            }];
            for (let d in c)
                if (void 0 == g.find(k => Object.keys(k)[0] == c[d])) return {
                    signal: !1
                };
            let h = b.bars.slice();
            b = {
                sma: "simple",
                ema: "exponential",
                wma: "lweighted",
                smma: "smoothed"
            };
            0 > a.checkBar && (a.checkBar *= -1);
            let e = MA(h, b[a.oneMaMetod], a.oneMaPeriod, a.oneMaPriceType)[a.checkBar],
                f = MA(h, b[a.toMaMetod], a.toMaPeriod, a.toMaPriceType)[a.checkBar];
            a = {
                signal: !1
            };
            for (let d in c) try {
                g.find(k => Object.keys(k)[0] == c[d])[c[d]]() && (a.signal = !0, a[d] = !0)
            } catch (k) {
                throw k;
            }
            return a
        } catch (g) {
            return {
                signal: !1
            }
        }
    },
    cci: (b, a, c) => {
        try {
            let g = [{
                "valCci>tpl": () => k > m
            }, {
                "valCci<btl": () => k < l
            }, {
                "valCci<tpl && valCci>btl": () => k < m && k > l
            }, {
                "false": () => !1
            }];
            for (let n in c)
                if (void 0 == g.find(q => Object.keys(q)[0] == c[n])) return {
                    signal: !1
                };
            let h = b.bars.slice().map(n => ({
                    val: (n.high + n.low + n.close) / 3
                })),
                e = MA(h, "simple", a.periodCci, "val"),
                f = [];
            h.forEach((n, q) => f.push({
                val: Math.abs(n.val - e[q])
            }));
            let d = [];
            MA(f, "simple", a.periodCci, "val").forEach((n, q) => {
                d.push((h[q].val - e[q]) / (.015 * n))
            });
            0 > a.checkBar && (a.checkBar *= -1);
            let k, l, m;
            k =
                d[a.checkBar];
            l = a.btl;
            m = a.tpl;
            b = {
                signal: !1
            };
            for (let n in c) try {
                g.find(q => Object.keys(q)[0] == c[n])[c[n]]() && (b.signal = !0, b[n] = !0)
            } catch (q) {
                throw q;
            }
            return b
        } catch (g) {
            return {
                signal: !1
            }
        }
    },
    macdLine: (b, a, c) => {
        try {
            let h = [{
                    "valueMacdLine[0]>valueSignalLine[0]": () => f[0] > d[0]
                }, {
                    "valueMacdLine[0]>valueSignalLine[0]&&valueMacdLine[0]>0&&valueSignalLine[0]>0": () => f[0] > d[0] && 0 < f[0] && 0 < d[0]
                }, {
                    "valueMacdLine[0]>valueSignalLine[0]&&valueMacdLine[0]<0&&valueSignalLine[0]<0": () => f[0] > d[0] && 0 > f[0] && 0 > d[0]
                }, {
                    "valueMacdLine[0]<valueSignalLine[0]": () =>
                        f[0] < d[0]
                }, {
                    "valueMacdLine[0]<valueSignalLine[0]&&valueMacdLine[0]>0&&valueSignalLine[0]>0": () => f[0] < d[0] && 0 < f[0] && 0 < d[0]
                }, {
                    "valueMacdLine[0]<valueSignalLine[0]&&valueMacdLine[0]<0&&valueSignalLine[0]<0": () => f[0] < d[0] && 0 > f[0] && 0 > d[0]
                }, {
                    "valueMacdLine[0]>0": () => 0 < f[0]
                }, {
                    "valueMacdLine[0]<0": () => 0 > f[0]
                }, {
                    "valueSignalLine[0]>0": () => 0 < d[0]
                }, {
                    "valueSignalLine[0]<0": () => 0 > d[0]
                }, {
                    "valueMacdLine[1]>valueSignalLine[1]&&valueMacdLine[0]<valueSignalLine[0]": () => 0 == a.checkBar && f[2] > d[2] && f[1] > d[1] && f[0] < d[0]
                },
                {
                    "valueMacdLine[1]>valueSignalLine[1]&&valueMacdLine[0]<valueSignalLine[0]&&valueMacdLine[1]>0&&valueMacdLine[0]>0&&valueSignalLine[1]>0&&valueSignalLine[0]>0": () => 0 == a.checkBar && f[2] > d[2] && f[1] > d[1] && f[0] < d[0] && 0 < f[1] && 0 < f[0] && 0 < d[1] && 0 < d[0]
                }, {
                    "valueMacdLine[1]>valueSignalLine[1]&&valueMacdLine[0]<valueSignalLine[0]&&valueMacdLine[1]<0&&valueMacdLine[0]<0&&valueSignalLine[1]<0&&valueSignalLine[0]<0": () => 0 == a.checkBar && f[2] > d[2] && f[1] > d[1] && f[0] < d[0] && 0 > f[1] && 0 > f[0] && 0 > d[1] && 0 > d[0]
                }, {
                    "valueMacdLine[1]<valueSignalLine[1]&&valueMacdLine[0]>valueSignalLine[0]": () =>
                        0 == a.checkBar && f[2] < d[2] && f[1] < d[1] && f[0] > d[0]
                }, {
                    "valueMacdLine[1]<valueSignalLine[1]&&valueMacdLine[0]>valueSignalLine[0]&&valueMacdLine[1]>0&&valueMacdLine[0]>0&&valueSignalLine[1]>0&&valueSignalLine[0]>0": () => 0 == a.checkBar && f[2] < d[2] && f[1] < d[1] && f[0] > d[0] && 0 < f[1] && 0 < f[0] && 0 < d[1] && 0 < d[0]
                }, {
                    "valueMacdLine[1]<valueSignalLine[1]&&valueMacdLine[0]>valueSignalLine[0]&&valueMacdLine[1]<0&&valueMacdLine[0]<0&&valueSignalLine[1]<0&&valueSignalLine[0]<0": () => 0 == a.checkBar && f[2] < d[2] && f[1] < d[1] && f[0] > d[0] &&
                        0 > f[1] && 0 > f[0] && 0 > d[1] && 0 > d[0]
                }, {
                    macdfalse: () => !1
                }
            ];
            for (let k in c)
                if (void 0 == h.find(l => Object.keys(l)[0] == c[k])) return {
                    signal: !1
                };
            0 > a.checkBar && (a.checkBar *= -1);
            var g = JSON.parse(JSON.stringify(b.bars));
            let e = b.ticks.slice(-5).reverse().map(k => k.price),
                f = [],
                d = [];
            for (b = 0; 3 > b; b++) {
                b && (g[0].close = e[1]);
                let k = MA(g, "exponential", a.periodEmasShort, 2 == b ? "open" : "close"),
                    l = MA(g, "exponential", a.periodEmasLong, 2 == b ? "open" : "close"),
                    m = k.map((q, r) => ({
                        value: q - l[r]
                    })),
                    n = MA(m, "exponential", a.periodSignalLine, "value");
                f.push(b ? m[0].value : m[a.checkBar].value);
                d.push(b ? n[0] : n[a.checkBar])
            }
            g = {
                signal: !1
            };
            for (let k in c) try {
                h.find(l => Object.keys(l)[0] == c[k])[c[k]]() && (g.signal = !0, g[k] = !0)
            } catch (l) {
                throw l;
            }
            return g
        } catch (h) {
            return {
                signal: !1
            }
        }
    },
    macdHistogram: (b, a, c) => {
        try {
            let g = [{
                "macdHistogramm[indparms['checkBar']]['line']=='up'": () => "up" == l[a.checkBar].line
            }, {
                "macdHistogramm[indparms['checkBar']]['line']=='up'&&macdHistogramm[indparms['checkBar']]['value']>0": () => "up" == l[a.checkBar].line && 0 < l[a.checkBar].value
            }, {
                "macdHistogramm[indparms['checkBar']]['line']=='up'&&macdHistogramm[indparms['checkBar']]['value']<0": () =>
                    "up" == l[a.checkBar].line && 0 > l[a.checkBar].value
            }, {
                "macdHistogramm[indparms['checkBar']]['line']=='down'": () => "down" == l[a.checkBar].line
            }, {
                "macdHistogramm[indparms['checkBar']]['line']=='down'&&macdHistogramm[indparms['checkBar']]['value']>0": () => "down" == l[a.checkBar].line && 0 < l[a.checkBar].value
            }, {
                "macdHistogramm[indparms['checkBar']]['line']=='down'&&macdHistogramm[indparms['checkBar']]['value']<0": () => "down" == l[a.checkBar].line && 0 > l[a.checkBar].value
            }, {
                "macdHistogramm[indparms['checkBar']]['value']>macdHistogramm[indparms['checkBar']+1]['value']": () =>
                    l[a.checkBar].value > l[a.checkBar + 1].value
            }, {
                "macdHistogramm[indparms['checkBar']]['value']<macdHistogramm[indparms['checkBar']+1]['value']": () => l[a.checkBar].value < l[a.checkBar + 1].value
            }, {
                macdHistogramFalse: () => !1
            }];
            for (let m in c)
                if (void 0 == g.find(n => Object.keys(n)[0] == c[m])) return {
                    signal: !1
                };
            0 > a.checkBar && (a.checkBar *= -1);
            let h = b.bars.slice(),
                e = MA(h, "exponential", a.periodEmasShort, "close"),
                f = MA(h, "exponential", a.periodEmasLong, "close"),
                d = e.map((m, n) => ({
                    value: m - f[n]
                })),
                k = MA(d, "exponential", a.periodSignalLine,
                    "value");
            d = d.map(m => m.value);
            let l = d.map((m, n, q) => ({
                line: n < q.length ? m - k[n] > q[n + 1] - k[n + 1] ? "up" : "down" : "undefined",
                value: m - k[n]
            }));
            b = {
                signal: !1
            };
            for (let m in c) try {
                g.find(n => Object.keys(n)[0] == c[m])[c[m]]() && (b.signal = !0, b[m] = !0)
            } catch (n) {
                throw n;
            }
            return b
        } catch (g) {
            return {
                signal: !1
            }
        }
    },
    parabolicSar: (b, a, c) => {
        try {
            let f = [{
                positionSarUp: () => y.filter(u => "up" == u).length == y.length
            }, {
                positionSarDown: () => y.filter(u => "down" == u).length == y.length
            }, {
                sarFalse: () => !1
            }];
            for (let u in c)
                if (void 0 == f.find(v => Object.keys(v)[0] ==
                        c[u])) return {
                    signal: !1
                };
            0 > a.checkBar && (a.checkBar *= -1);
            let d = u => u.reduce(function(v, z) {
                return v + z
            }, 0) / u.length;
            var g = [],
                h = [];
            let k = [],
                l = [];
            var e = 1;
            let m = 1,
                n = 0,
                q = 0,
                r = 0,
                p = k[e - 1],
                t = b.bars.slice().reverse();
            b = void 0;
            for (let u = 0; u < t.length; u++) h.push(t[u].high - t[u].low), k.push(t[u].high), l.push(t[u].low);
            let w = (u => {
                let v = d(u);
                u = u.map(function(z) {
                    z -= v;
                    return z * z
                });
                return Math.sqrt(d(u))
            })(h);
            for (h = 0; h < t.length && (0 === t[h].high || 0 === t[h].low); h++) g[h] = 0, e++;
            0 < t.length && (g[e - 1] = l[e - 1] - w);
            for (e = 0; e < t.length; e++) {
                n =
                    m;
                q = p;
                r = b;
                let u = l[e - 1] > l[e] ? l[e] : l[e - 1],
                    v = k[e - 1] > k[e] ? k[e - 1] : k[e];
                1 === n ? (m = l[e] > g[e - 1] ? 1 : -1, p = v > q ? v : q) : (m = k[e] < g[e - 1] ? -1 : 1, p = u > q ? q : u);
                m === n ? (g[e] = g[e - 1] + (q - g[e - 1]) * r, b = r === a.maxBoost ? a.maxBoost : a.boost + r, 1 === m ? (b = p > q ? b : r, g[e] = g[e] > u ? u : g[e]) : (b = p < q ? b : r, g[e] = g[e] > v ? g[e] : v)) : (b = a.boost, g[e] = p)
            }
            let x = g.map((u, v) => u >= k[v] ? "up" : "down");
            x.reverse();
            g = {
                signal: !1
            };
            let y = x.slice(a.checkBar, a.checkBar + a.countSarBars);
            for (let u in c) try {
                f.find(v => Object.keys(v)[0] == c[u])[c[u]]() && (g.signal = !0, g[u] = !0)
            } catch (v) {
                throw v;
            }
            return g
        } catch (f) {
            return {
                signal: !1
            }
        }
    },
    canmodel: (b, a, c) => {
        let g = (h, e) => {
            h = h.open - h.close;
            if (0 > h) return {
                dir: "up",
                size: Math.round(h / -e)
            };
            if (0 < h) return {
                dir: "down",
                size: Math.round(h / e)
            };
            if (0 == h) return {
                dir: "neutral",
                size: 0
            }
        };
        try {
            let h = [{
                "canUp&highLast": () => "up" == f.dir && f.size > d.size && f.size >= a.minSizeBar && f.size <= a.maxSizeBar
            }, {
                "canUp&lowLast": () => "up" == f.dir && f.size < d.size && f.size >= a.minSizeBar && f.size <= a.maxSizeBar
            }, {
                "canDown&highLast": () => "down" == f.dir && f.size > d.size && f.size >= a.minSizeBar && f.size <=
                    a.maxSizeBar
            }, {
                "canDown&lowLast": () => "down" == f.dir && f.size < d.size && f.size >= a.minSizeBar && f.size <= a.maxSizeBar
            }, {
                canmodelFalse: () => !1
            }];
            for (let k in c)
                if (void 0 == h.find(l => Object.keys(l)[0] == c[k])) return {
                    signal: !1
                };
            0 > a.checkBar && (a.checkBar *= -1);
            let e = b.bars.slice(),
                f = g(e[a.checkBar], b.symbolPoint),
                d = g(e[a.checkBar + 1], b.symbolPoint);
            b = {
                signal: !1
            };
            for (let k in c) try {
                h.find(l => Object.keys(l)[0] == c[k])[c[k]]() && (b.signal = !0, b[k] = !0)
            } catch (l) {
                throw l;
            }
            return b
        } catch (h) {
            return {
                signal: !1
            }
        }
    }
};

function checkWorkingHours(b) {
    var a = b.split("-");
    b = a[0];
    a = a[1];
    if (b == a) return !0;
    var c = new Date,
        g = c.getHours();
    c = c.getMinutes();
    g = 60 * g + c;
    let [h, e] = b.split(":").map(Number), [f, d] = a.split(":").map(Number);
    b = 60 * h + e;
    a = 60 * f + d;
    return b <= a ? g >= b && g <= a : g >= b || g <= a
}

function genDealId() {
    let b = ("" + (Date.now() + Math.random())).split(".");
    return b[0] * b[1] || 1
}

function readmes(b) {
    b = new Uint8Array(b);
    b = (new TextDecoder("utf-8")).decode(b);
    try {
        return JSON.parse(b)
    } catch (a) {
        return b
    }
}

function getCookie(b) {
    return (b = document.cookie.match(new RegExp("(?:^|; )" + b.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"))) ? decodeURIComponent(b[1]) : void 0
}
class Trader {
    on(b, a, c) {
        "undefined" == typeof this.subscription[b] && (this.subscription[b] = {});
        this.subscription[b][a] = c;
        return !0
    }
    runEvent(b, a) {
        for (let c in this.subscription[b]) this.subscription[b][c](a), "unique" == c && delete this.subscription[b]
    }
    constructor(b) {
        this.subscription = {};
        this.setInterval = {};
        this.setTimeout = {};
        this.openedCharts = [];
        this.availableAssets = [];
        this.queueRequestBars = [];
        this.uid = b.uid;
        this.isDemo = b["is-demo"];
        this.email = b.email;
        this.balances = {
            demo: b["user-demo-balance"],
            real: +b["user-balance"]
        };
        this.balance = void 0;
        this.platform = b.platform;
        this.apiServers = b["servers-list"];
        this.demoSessionId = b.demoSessionId;
        this.serverTimeZoneOffset = b.serverTimeZoneOffset;
        this.userTimeZoneOffset = b.userTimeZoneOffset;
        this.wsServerPlatformPriority = b.wsServerPlatformPriority;
        this.session = getCookie("ci_session");
        this.experts = [];
        this.expertsUsedMtApi = [];
        this.ordersClass = [];
        this.authData = b.authData;
        this.port = b.port;
        this.financeUserLevel = b.financeUserLevel;
        this.depositsSum = b.depositsSum;
        this.setUserLevel();
        $("html").on("click",
            () => {
                this.runEvent("documentClick", !0)
            });
        pause(500).then(async () => {
            try {
                this.mtServer = {
                    localhost: io(appConfiguration.appData.mtServerLocal, {
                        transports: ["websocket"],
                        autoConnect: !1
                    }),
                    robotServer: io(appConfiguration.appData.mtServerRobot, {
                        transports: ["websocket"],
                        autoConnect: !1,
                        path: "/mtserver"
                    })
                };
                await this.updateOpenedCharts();
                platform.runEvent("set\u0421onnectionStatus", {
                    mark: "platform.textStatus.farmStrategy",
                    parms: {}
                });
                try {
                    await this.updateRunningExpertClasses(!0)
                } catch (a) {
                    throw {
                        catch: !0,
                        "set\u0421onnectionStatus": {
                            mark: "platform.textStatus.errorFarmStrategy",
                            parms: {}
                        }
                    };
                }
                for (let a in this.mtServer) {
                    let c = this.mtServer[a];
                    c.on("connect", async () => {
                        await this.updateMtApi();
                        platform.notification(platform.translation("platform.api.networkBridge"), platform.translation("platform.api.connectNetworkBridge", {
                            bridge: platform.translation(`platform.api.${a}`)
                        }), 7E3, "complete", "completed");
                        this.expertsUsedMtApi.filter(g => g.indicatorsSetings[0].indparms.server == a).forEach(g => {
                            g.runEvent("addLogEntry", {
                                mark: ["platform.api.connectNetworkBridge"],
                                parms: {
                                    bridge: a
                                }
                            })
                        })
                    });
                    c.on("connect_error", () => {
                        platform.notification(platform.translation("platform.api.networkBridge"), platform.translation("platform.api.errorConnectNetworkBridge", {
                            bridge: platform.translation(`platform.api.${a}`)
                        }), 7E3, "error", "error");
                        this.expertsUsedMtApi.filter(g => g.indicatorsSetings[0].indparms.server == a).forEach(g => {
                            g.runEvent("addLogEntry", {
                                mark: ["platform.api.errorConnectNetworkBridge"],
                                parms: {
                                    bridge: a
                                }
                            })
                        })
                    });
                    c.on("reconnect", async g => {
                        await this.updateMtApi()
                    });
                    c.on("signalApi", async g => {
                        let h =
                            this.expertsUsedMtApi.find(e => e.indicatorsSetings[0].indparms.indId == g.iid);
                        void 0 != h && (h.runEvent("signalApi", {
                            asset: g.asset,
                            signal: g.signal
                        }), h.runEvent("addLogEntry", {
                            mark: ["logsBook.anExternalSignal", 1 < h.indicatorsSetings.length ? "logsBook.\u0441heckingFollowingIndicators" : ""],
                            parms: {
                                asset: g.asset,
                                signal: g.signal.signalUp ? platform.translation("logsBook.command.0") : platform.translation("logsBook.command.1")
                            }
                        }))
                    })
                }
                platform.runEvent("set\u0421onnectionStatus", {
                    mark: "platform.textStatus.connectingBroker",
                    parms: {}
                });
                await new Promise(async (a, c) => {
                    let g = void 0 == localStorage.indexApiServers ? 0 : +localStorage.indexApiServers < this.apiServers.length ? +localStorage.indexApiServers : 0;
                    localStorage.indexApiServers = g;
                    this.wsPlatform = io(this.wsServerPlatformPriority || this.apiServers[g].server, {
                        transports: ["websocket"],
                        query: {
                            secondary: 1
                        }
                    });
                    this.wsPlatform.on("connect", async () => {
                        await pause(500);
                        this.wsPlatform.emit("auth", {
                            session: this.isDemo ? this.demoSessionId : this.session,
                            isDemo: this.isDemo,
                            uid: this.uid,
                            platform: this.platform,
                            isFastHistory: !0,
                            isOptimized: !0
                        });
                        this.setTimeout.auth = setTimeout(async () => {
                            c({
                                catch: !0,
                                "set\u0421onnectionStatus": {
                                    mark: "platform.textStatus.errorConnectingBroker",
                                    parms: {}
                                },
                                runFunction: async () => {
                                    localStorage.indexApiServers = g + 1;
                                    await pause(5E3);
                                    location.reload()
                                }
                            })
                        }, 5E3)
                    });
                    this.wsPlatform.on("disconnect", async h => {
                        "io client disconnect" != h ? this.experts.forEach(e => {
                            e.runEvent("addLogEntry", {
                                mark: ["logsBook.disconnectPlatform"],
                                parms: {
                                    reason: h
                                }
                            })
                        }) : this.wsPlatform.connect()
                    });
                    this.wsPlatform.on("connect_error",
                        async h => {
                            c({
                                catch: !0,
                                "set\u0421onnectionStatus": {
                                    mark: "platform.textStatus.errorConnectingBroker",
                                    parms: {}
                                },
                                runFunction: async () => {
                                    localStorage.indexApiServers = g + 1;
                                    location.reload()
                                }
                            })
                        });
                    this.wsPlatform.on("successauth", async () => {
                        clearTimeout(this.setTimeout.auth);
                        this.experts.forEach(h => {
                            h.runEvent("addLogEntry", {
                                mark: ["logsBook.connectPlatform", this.isDemo ? "logsBook.demoAccaunt" : "logsBook.realAccaunt"],
                                parms: {}
                            })
                        });
                        a(!0)
                    });
                    this.wsPlatform.on("updateAssets", async h => {
                        try {
                            h = readmes(h);
                            h = h.map(k =>
                                ({
                                    id: k[1],
                                    title: k[2],
                                    timeUpdate: Math.round(Date.now() / 1E3),
                                    group: k[3],
                                    available: k[14],
                                    profit: 92 < k[5] + this.userLevel.payout ? 92 : k[5] + this.userLevel.payout,
                                    minExp: k[17]
                                }));
                            let e = 0 == this.availableAssets.length,
                                f = this.availableAssets.reduce((k, l) => ({
                                    ...k,
                                    [l.id]: {
                                        available: l.available,
                                        profit: l.profit,
                                        minExp: l.minExp
                                    }
                                }), {});
                            this.availableAssets = h;
                            let d = this.availableAssets.reduce((k, l) => ({
                                ...k,
                                [l.id]: {
                                    available: l.available,
                                    profit: l.profit,
                                    minExp: l.minExp
                                }
                            }), {});
                            for (let k in d) e || JSON.stringify(d[k]) == JSON.stringify(f[k]) ||
                                (d[k].isChange = !0);
                            this.experts.forEach(k => {
                                let l = k.assets.filter(m => void 0 != d[m]).reduce((m, n) => ({
                                    ...m,
                                    [n]: d[n]
                                }), {});
                                k.runEvent("logsUpdateAssets", {
                                    newAvailableAssets: l
                                })
                            });
                            h.forEach(k => {
                                if (!k.available) {
                                    let l = this.openedCharts.filter(m => m.asset == k.id);
                                    0 != l.length && l.forEach(m => {
                                        m.bars = [];
                                        m.ticks = []
                                    })
                                }
                            });
                            this.sendPlatformInformationOpenedCharts();
                            h = h.concat((await chrome.storage.local.get("availableAssets")).availableAssets);
                            h = h.filter((k, l, m) => l === m.findIndex(n => n.id === k.id));
                            await chrome.storage.local.set({
                                availableAssets: h
                            });
                            await this.updateOpenedCharts();
                            this.wsPlatform.emit("ps")
                        } catch (e) {}
                    });
                    this.wsPlatform.on("loadHistoryPeriodFast", h => {
                        h = readmes(h);
                        this.runEvent(`loadHistoryPeriod_${h.asset}_${h.index}`, h)
                    });
                    this.wsPlatform.on("loadHistoryPeriod", h => {
                        h = readmes(h);
                        this.runEvent(`loadHistoryPeriod_${h.asset}_${h.index}`, h)
                    });
                    this.wsPlatform.on("successupdateBalance", h => {
                        try {
                            h = readmes(h), h.isDemo == this.isDemo && (this.balance != h.balance && this.experts.forEach(e => {
                                e.runEvent("addLogEntry", {
                                    mark: ["logsBook.accautBalance"],
                                    parms: {
                                        balance: h.balance
                                    }
                                })
                            }), this.balance = h.balance), this.balances[h.isDemo ? "demo" : "real"] = this.balance, chrome.storage.local.set({
                                platform: {
                                    isDemo: this.isDemo,
                                    balances: this.balances,
                                    email: this.email,
                                    uid: this.uid,
                                    serverTimeZoneOffset: this.serverTimeZoneOffset,
                                    userTimeZoneOffset: this.userTimeZoneOffset
                                }
                            })
                        } catch (e) {}
                    });
                    this.wsPlatform.on("failopenOrder", h => {
                        h = readmes(h);
                        let e = this.ordersClass.find(f => f.requestId == h.requestId);
                        void 0 != e && e.runEvent("failopenOrder", h)
                    });
                    this.wsPlatform.on("successopenOrder",
                        h => {
                            h = readmes(h);
                            let e = this.ordersClass.find(f => f.requestId == h.requestId);
                            void 0 != e && e.runEvent("successopen", h)
                        });
                    this.wsPlatform.on("updateOpenedDeals", async h => {
                        try {
                            h = readmes(h).reverse(), h.forEach(e => {
                                let f = this.ordersClass.find(d => void 0 == d.id && e.closeTimestamp - e.openTimestamp == d.time && e.asset == d.asset && e.amount == d.amount && e.command == ("put" == d.action ? 1 : 0) && -5 < e.openTimestamp - d.openTimestamp && 5 > e.openTimestamp - d.openTimestamp);
                                void 0 != f && "waitingOpening" == f.state && f.runEvent("successopen", e)
                            })
                        } catch (e) {}
                    });
                    this.wsPlatform.on("successcloseOrder", h => {
                        h = readmes(h);
                        h.deals.forEach(e => {
                            let f = this.ordersClass.find(d => d.id == e.id);
                            void 0 != f && (f.isClosed || f.runEvent("successclose", e), this.ordersClass = this.ordersClass.filter(d => !d.isClosed))
                        })
                    });
                    this.wsPlatform.on("updateClosedDeals", async h => {
                        try {
                            h = readmes(h).reverse(), h.forEach(e => {
                                let f = this.ordersClass.find(d => d.id == e.id || void 0 == d.id && e.closeTimestamp - e.openTimestamp == d.time && e.asset == d.asset && e.amount == d.amount && e.command == ("put" == d.action ? 1 : 0) && -5 < e.openTimestamp -
                                    d.openTimestamp && 5 > e.openTimestamp - d.openTimestamp);
                                void 0 != f && (f.isClosed || f.runEvent("successclose", e), this.ordersClass = this.ordersClass.filter(d => !d.isClosed))
                            })
                        } catch (e) {}
                    })
                });
                chrome.storage.onChanged.addListener(async (a, c) => {
                    switch (Object.keys(a)[0]) {
                        case "runningStrategies":
                            await this.updateOpenedCharts();
                            await this.updateRunningExpertClasses();
                            await this.saveExpertsClasses();
                            break;
                        case "strategies":
                            await this.updateOpenedCharts();
                            for (c = 0; c < a.strategies.newValue.length; c++) {
                                let g = a.strategies.newValue[c],
                                    h = this.experts.find(e => e.id == g.id);
                                void 0 != h && await h.updateSettings()
                            }
                            await this.updateMtApi()
                    }
                });
                platform.runEvent("set\u0421onnectionStatus", {
                    mark: "platform.textStatus.connectRobotServer",
                    parms: {}
                });


                this.serverPing().then(async a => {

  console.log("[Robot Ping] Resultado de latencia:", a); // 👈 log agregado

                    a ? (
                        
     console.log("[Robot Ping] Conexión OK, iniciando wsRobot..."), // 👈 log agregado                 
                        
                        this.wsRobot = io(appConfiguration.appData.wsServerRobot, {
                        transports: ["websocket"]
                    }), 


                  
                    //este es el punto que no estamos pudiendo sortear, por las dudas aca esta la papa 
                   // 🔒 Versión original comentada:
 this.wsRobot.on("connect", () => {
   console.log("[Robot Ping] WebSocket conectado, enviando auth...");
   console.log("📦 authData:", this.authData);

    this.wsRobot.emit("auth", this.authData);
 }),
                    

// ✅ Versión segura sin conexión real al servidor del autor:

// ✅ Versión segura y funcional sin conexión real:



// aca sigue el original
                    
                    this.wsRobot.on("connect_error", () => {

console.warn("[Robot Ping] ❌ Error al conectar con wsRobot"); // 👈 log agregado

                        this.experts.forEach(c => {
                            c.runEvent("addLogEntry", {
                                mark: ["platform.textStatus.no\u0421onnectServerRobot"],
                                parms: {
                                    type: "socket"
                                }
                            })
                        })


                    }), this.wsRobot.on("locationReload", () => {
                        location.reload()
                    }), this.wsRobot.on("updateMainConfiguration", () => {
                        chrome.runtime.sendMessage({
                            event: "updateMainConfiguration"
                        }).then().catch(console.log)
                    }), this.wsRobot.on("disconnect", () => {
                        platform.runEvent("set\u0421onnectionStatus", {
                            mark: "platform.textStatus.disconnectServerRobot",
                            parms: {}
                        });
                        this.experts.forEach(c => {
                            c.runEvent("addLogEntry", {
                                mark: ["logsBook.disconnectRobot"],
                                parms: {}
                            })
                        })
                    }), this.wsRobot.on("updateFullStream", c => {
                        c = readmes(c);
                        this.updateFullStream(c)
                    }), this.wsRobot.on("ps", c => {
                        this.serverTimeZoneOffset = (c - Math.round(Date.now() / 1E3)) / 60;
                        this.wsPlatform.emit("ps");
                        try {
                            this.port.state && this.port.postMessage("ps")
                        } catch {}
                    }), this.wsRobot.on("successauth", c => {

console.log("[✅ successauth] Recibido:", c); // LOG CRÍTICO

                        c && platform.runEvent("set\u0421onnectionStatus", {
                         
                            mark: this.isDemo ? "platform.textStatus.connectDemo" : "platform.textStatus.connectReal",
                            parms: {}
                        })
                    })) : (this.experts.forEach(c => {
                        c.runEvent("addLogEntry", {
                            mark: ["platform.textStatus.no\u0421onnectServerRobot"],
                            parms: {
                                type: "api"
                            }
                        })
                    }), platform.runEvent("set\u0421onnectionStatus", {
                        mark: "platform.textStatus.no\u0421onnectServerRobot",
                        parms: {
                            type: "api"
                        }
                    }), await pause(15E3), location.reload())
                });
                this.port.state && this.port.postMessage({
                    event: "platformIsReady"
                });
                (async () => {
                    for (;;)
                        if (0 == this.queueRequestBars.length) await pause(1E3);
                        else try {
                            await this.loadBarChart(this.queueRequestBars.shift())
                        } catch (a) {}
                })()
            } catch (a) {
                "object" == typeof a && "undefined" != typeof a["catch"] && ("undefined" != typeof a["set\u0421onnectionStatus"] &&
                    platform.runEvent("set\u0421onnectionStatus", a["set\u0421onnectionStatus"]), "undefined" != typeof a.runFunction && a.runFunction()), this.port.state && this.port.postMessage({
                    event: "platformIsReady"
                })
            }
        })
    }
   // ✅ Original comentado:
//
// async serverPing() {
//     for (let b = 0; 5 > b; b++) try {
//         let a = Date.now();
//         if ("pong" == (await this.post(appConfiguration.appData.robotApiServer, {
//                 type: "ping"
//             })).data) return Date.now() - a + 1;
//         throw "respon no 'pong'";
//     } catch (a) {
//         await new Promise((c, g) => {
//             setTimeout(c, 1E3)
//         })
//     }
//     return !1
// }

// ✅ Versión con logs simulados para debug
async serverPing() {
    for (let b = 0; 5 > b; b++) try {
        let a = Date.now();
        const respuesta = await this.post(appConfiguration.appData.robotApiServer, {
            type: "ping"
        });

        console.log(`[Robot Ping] Intento #${b + 1}`, respuesta);

        if ("pong" == respuesta.data) return Date.now() - a + 1;
        throw "respon no 'pong'";
    } catch (a) {
        console.warn("[Robot Ping] Fallo intento", b + 1, a);
        await new Promise((c, g) => {
            setTimeout(c, 1E3)
        })
    }
    return !1
}

/// termina aca la modificacion



    sendPlatformInformationOpenedCharts() {
        platform.runEvent("updateOpenedCharts",
            `${this.openedCharts.filter(b => 0 < b.bars.length).length}/${this.openedCharts.filter(b => void 0 != this.availableAssets.find(a => a.id == b.asset && a.available)).length}`)
    }
    async updateRunningExpertClasses(b = !1) {
        return new Promise(async (a, c) => {
            try {
                let g = (await chrome.storage.local.get("strategies")).strategies,
                    h = (await chrome.storage.local.get("runningStrategiesSession")).runningStrategiesSession,
                    e = (await chrome.storage.local.get("runningStrategies")).runningStrategies;
                this.experts.forEach(f => {
                    e.includes(f.id) ||
                        f.runEvent("setExpertStatus", "stoped")
                });
                this.experts = e.map(f => this.experts.find(d => d.id == f) || new Expert(Object.assign(g.find(d => d.id == f), {
                    session: h.find(d => d.strategyId == f).session
                }), this));
                if (1 == b)
                    for (let f = 0; 5 > f; f++)
                        if (void 0 != this.experts.find(d => !d.ready)) await pause(1E3);
                        else break;
                await this.updateMtApi();
                a(!0)
            } catch (g) {
                c(g)
            }
        })
    }
    async updateMtApi() {
        this.expertsUsedMtApi = this.experts.filter(a => 0 < a.indicatorsSetings.length && "api" == a.indicatorsSetings[0].id);
        let b = {
            localhost: this.expertsUsedMtApi.filter(a =>
                "localhost" == a.indicatorsSetings[0].indparms.server).map(a => a.indicatorsSetings[0].indparms.indId),
            robotServer: this.expertsUsedMtApi.filter(a => "robotServer" == a.indicatorsSetings[0].indparms.server).map(a => a.indicatorsSetings[0].indparms.indId)
        };
        for (let a in b) 0 == b[a].length ? this.mtServer[a].disconnect() : this.mtServer[a].connected ? this.mtServer[a].emit("subscription", {
            uid: this.uid,
            indicatorIds: b[a]
        }) : this.mtServer[a].connect();
        return !0
    }
    async updateOpenedCharts() {
        let b = await this.getUsedAssets();
        this.openedCharts =
            this.openedCharts.filter(h => b.includes(`${h.asset}:${h.period}`));
        let a = (await chrome.storage.local.get("strategies")).strategies,
            c = (await chrome.storage.local.get("runningStrategies")).runningStrategies;
        for (let h = 0; h < b.length; h++) {
            var g = b[h].split(":");
            let e = g[0],
                f = +g[1];
            g = this.openedCharts.find(k => k.asset == e && k.period == f);
            let d = a.filter(k => c.includes(k.id) && "api" != k.indicators[0].id && k.assets.includes(e) && void 0 != k.regulations.find(l => "timeFrom" == l.id && checkWorkingHours(l.value)) && void 0 != k.indicators[0].settings.find(l =>
                "tf" == l.id && +l.value == f)).map(k => ({
                id: k.id,
                timeInspection: k.indicators[0].settings.find(l => "timeInspection" == l.id).value
            }));
            void 0 != g ? g.experts = d : this.openedCharts.push({
                asset: e,
                period: f,
                bars: [],
                ticks: [],
                experts: d
            })
        }
        this.sendPlatformInformationOpenedCharts();
        this.reportUsedAssets();
        return !0
    }
    updateFullStream(b) {
        let a = (c, g) => c - c % g;

//agregado para ver si llegan datos de pocket option

console.log("✅ updateFullStream() recibió:", b);
    console.log("📊 Total activos:", b.length, " | Ejemplo activo:", b[0]);

// a partir de aca sigue original

        b.forEach(c => {
            if (void 0 == this.availableAssets.find(h => h.id == c.asset && h.available)) return !1;
            let g = this.openedCharts.filter(h => h.asset == c.asset && "undefined" == typeof h.unavailable);
            c.prices.forEach(h => {
                let e = [];
                g.forEach(f => {
                    f;
                    let d = {
                        price: h.price,
                        time: h.time
                    };
                    try {
                        if (0 != f.ticks.length && "undefined" == typeof f.ticks[f.ticks.length - 1].asset && 3 < d.time - f.ticks[f.ticks.length - 1].time) {
                            f.bars = [];
                            f.ticks = [];
                            this.experts.filter(m => m.assets.includes(f.asset) && void 0 != m.indicatorsSetings.find(n => n.indparms.tf == f.period)).forEach(m => {
                                m.runEvent("addLogEntry", {
                                    mark: ["logsBook.gapFlowQuotes"],
                                    parms: {
                                        asset: f.asset,
                                        period: f.period
                                    }
                                })
                            });
                            return
                        }
                    } catch (m) {}
                    f.ticks.push(d);
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//agregado para evaluacion con filtrobonito
//agregado para evaluacion con filtrobonito
// === Evaluación visual del gráfico por activo ===
// === Evaluación visual avanzada por activo ===
// === Evaluación visual en ventana flotante por activo ===
(function evaluarContextoVentana(ticks, asset) {
    if (!Array.isArray(ticks) || ticks.length < 20 || typeof asset !== "string") return;

    // === Configuración global persistente ===
    if (!window._filtrosBonitoConfig) {
        window._filtrosBonitoConfig = {
            oscilaciones: true,
            suave: true,
            rangoOk: true,
            limpiasOk: true,
            tendenciaClara: true,
            direccionDominante: true,
            distanciaOk: true,
            mechasOk: true,
            tickVsCuerpo: true,
            adxFuerte: true,
            ticksPorSegundoOk: true, // ✅ agregado
            adxLength: 2,
            diLength: 3,
            umbralADX: 35,
            ticksPerSec_umbral_ok: 2,     // ✅ agregado
            ticksPerSec_umbral_bueno: 1,   // ✅ agregado
            minCuerpoVsRango: 0.6,       // ← agregado
            minVelasLimpias: 3           // ← agregado
        };
    }
    const filtrosBonitoConfig = window._filtrosBonitoConfig;

    // Abrir la ventana si no existe
    if (!window._filtroBonitoWin || window._filtroBonitoWin.closed) {
        window._filtroBonitoWin = window.open("", "PanelFiltroBonito", "width=400,height=800");
        const doc = window._filtroBonitoWin.document;
        doc.title = "Filtro Bonito";
        doc.body.style.background = "#111";
        doc.body.style.color = "#eee";
        doc.body.style.fontFamily = "monospace";
        doc.body.style.fontSize = "13px";
        doc.body.style.margin = "10px";
        doc.body.innerHTML = "<h3 style='color:#0f0'>Filtro Bonito - Contexto</h3><div id='contenedorBonito'></div>";
    }

    // === Interfaz visual de configuración ===
    const winDoc = window._filtroBonitoWin.document;
    const configId = "configBonitoGlobal";
    if (!winDoc.getElementById(configId)) {
        const configBox = winDoc.createElement("div");
        configBox.id = configId;
        configBox.style.marginBottom = "12px";
        configBox.style.padding = "8px";
        configBox.style.border = "1px solid #333";
        configBox.style.borderRadius = "6px";
        configBox.style.background = "#222";

        const checkboxList = Object.entries(filtrosBonitoConfig)
            .filter(([k]) => typeof filtrosBonitoConfig[k] === "boolean")
            .map(([key, val]) => {
                return `<label style="display:block;margin-bottom:4px;">
                    <input type="checkbox" data-filtro="${key}" ${val ? "checked" : ""} style="margin-right:6px"/>
                    ${key}
                </label>`;
            }).join("");

        configBox.innerHTML = ` 
<b style="color:#0ff">Filtros activos:</b><br><br>
${checkboxList}
<br>
<b style="color:#0ff">Parámetros ADX:</b><br>
<label>adxLength: <input type="number" id="adxLengthInput" value="${filtrosBonitoConfig.adxLength}" style="width:40px"/></label><br>
<label>diLength: <input type="number" id="diLengthInput" value="${filtrosBonitoConfig.diLength}" style="width:40px"/></label><br>
<label>umbralADX: <input type="number" id="umbralADXInput" value="${filtrosBonitoConfig.umbralADX}" style="width:50px"/></label>
<br><br>
<b style="color:#0ff">Parámetros Ticks/s:</b><br>
<label>Umbral OK: <input type="number" id="ticksOkInput" value="${filtrosBonitoConfig.ticksPerSec_umbral_ok}" style="width:40px"/></label><br>
<label>Muy Bueno: <input type="number" id="ticksBuenoInput" value="${filtrosBonitoConfig.ticksPerSec_umbral_bueno}" style="width:40px"/></label>
<br><br>
<b style="color:#0ff">Velas Limpias:</b><br>
<label>✔️ Mínimas limpias: <input type="number" id="minVelasLimpiasInput" value="${filtrosBonitoConfig.minVelasLimpias}" style="width:40px"/></label><br>
<label>✔️ Cuerpo / Rango ≥ <input type="number" step="0.01" id="minCuerpoVsRangoInput" value="${filtrosBonitoConfig.minCuerpoVsRango}" style="width:40px"/></label>
`;

        winDoc.body.insertBefore(configBox, winDoc.getElementById("contenedorBonito"));

        // Eventos para checkboxes
        const inputs = configBox.querySelectorAll("input[type=checkbox]");
        inputs.forEach(input => {
            input.addEventListener("change", () => {
                const key = input.dataset.filtro;
                filtrosBonitoConfig[key] = input.checked;
            });
        });

        // Eventos para inputs ADX
        winDoc.getElementById("adxLengthInput").addEventListener("input", e => {
            filtrosBonitoConfig.adxLength = parseInt(e.target.value);
        });
        winDoc.getElementById("diLengthInput").addEventListener("input", e => {
            filtrosBonitoConfig.diLength = parseInt(e.target.value);
        });
        winDoc.getElementById("umbralADXInput").addEventListener("input", e => {
            filtrosBonitoConfig.umbralADX = parseFloat(e.target.value);
        });
        winDoc.getElementById("ticksOkInput").addEventListener("input", e => {
            filtrosBonitoConfig.ticksPerSec_umbral_ok = parseFloat(e.target.value);
        });
        winDoc.getElementById("ticksBuenoInput").addEventListener("input", e => {
            filtrosBonitoConfig.ticksPerSec_umbral_bueno = parseFloat(e.target.value);
        });
        winDoc.getElementById("minVelasLimpiasInput").addEventListener("input", e => {
            filtrosBonitoConfig.minVelasLimpias = parseInt(e.target.value);
        });
        winDoc.getElementById("minCuerpoVsRangoInput").addEventListener("input", e => {
            filtrosBonitoConfig.minCuerpoVsRango = parseFloat(e.target.value);
        });
    }

    const precios = ticks.map(t => t.price);
    const difs = precios.slice(1).map((p, i) => p - precios[i]);
    const cambios = difs.map(x => (x > 0 ? 1 : x < 0 ? -1 : 0));
    let oscilaciones = 0;
    for (let i = 1; i < cambios.length; i++) {
        if (cambios[i] !== 0 && cambios[i] !== cambios[i - 1]) oscilaciones++;
    }

    const maxJump = Math.max(...difs.map(Math.abs));
    const suave = maxJump < 0.02;

    const rangos = ticks.map((t, i) => t.high && t.low ? t.high - t.low : 0).filter(x => x);
    const avgRango = rangos.reduce((a, b) => a + b, 0) / rangos.length || 0;
    const rangoOk = avgRango > 0.0008;

    // --- Repara los ticks si faltan datos de OHLC ---
    for (let i = 0; i < ticks.length; i++) {
        const t = ticks[i];
        if (typeof t.open !== "number") t.open = t.price;
        if (typeof t.close !== "number") t.close = t.price;
        if (typeof t.high !== "number") t.high = t.price;
        if (typeof t.low !== "number") t.low = t.price;
    }
    console.log("Ticks disponibles:", ticks.length);

    // === FILTRO MEJORADO: Velas limpias con cuerpo claro ===
    const minCuerpoVsRango = filtrosBonitoConfig.minCuerpoVsRango || 0.6;
    const minVelasLimpias = filtrosBonitoConfig.minVelasLimpias || 3;

    // Filtramos velas válidas (con datos OHLC completos y que no sean planas)
    const ultimasVelas = ticks.slice(-5).filter(v => 
        typeof v.open === 'number' && 
        typeof v.close === 'number' && 
        typeof v.high === 'number' && 
        typeof v.low === 'number' &&
        v.high !== v.low // Descartamos velas planas
    );

    // Identificamos velas limpias (con cuerpo significativo)
    const velasLimpias = ultimasVelas.filter(v => {
        const cuerpo = Math.abs(v.close - v.open);
        const rangoTotal = v.high - v.low;
        return rangoTotal > 0 && (cuerpo / rangoTotal) >= minCuerpoVsRango;
    });

    const limpiasOk = velasLimpias.length >= minVelasLimpias;

    // Información adicional para diagnóstico (se muestra en el panel)
    const detallesVelas = ultimasVelas.map(v => {
        const cuerpo = Math.abs(v.close - v.open);
        const rango = v.high - v.low;
        const proporcion = rango > 0 ? (cuerpo / rango).toFixed(2) : 'N/A';
        return {
            proporcion: proporcion,
            esLimpiar: rango > 0 && (cuerpo / rango) >= minCuerpoVsRango,
            direccion: v.close > v.open ? '↑' : v.close < v.open ? '↓' : '='
        };
    });

    const direccionesVelas = ultimasVelas.map(v => v.close > v.open ? 1 : v.close < v.open ? -1 : 0);
    const sumaDirecciones = direccionesVelas.reduce((a, b) => a + b, 0);
    const tendenciaClara = Math.abs(sumaDirecciones) >= 4;

    const suben = cambios.filter(x => x === 1).length;
    const bajan = cambios.filter(x => x === -1).length;
    const direccionDominante = suben >= cambios.length * 0.6 || bajan >= cambios.length * 0.6;

    const distancia = Math.abs(precios[precios.length - 1] - precios[0]);
    const distanciaOk = distancia > 0.02;

    const mechasChicas = ultimasVelas.filter(v => {
        const cuerpo = Math.abs(v.close - v.open);
        const mechaTotal = (v.high - v.low);
        return cuerpo > 0 && mechaTotal > 0 && cuerpo / mechaTotal > 0.6;
    });
    const mechasOk = mechasChicas.length >= 3;

    const ultimoTick = ticks[ticks.length - 1];
    const ultimaVela = ultimasVelas[ultimasVelas.length - 1];
    const tickVsCuerpo = ultimoTick && ultimaVela
        ? (ultimoTick.price > precios[precios.length - 2] && ultimaVela.close > ultimaVela.open) ||
          (ultimoTick.price < precios[precios.length - 2] && ultimaVela.close < ultimaVela.open)
        : false;

    // === Cálculo ADX realista con smoothing estilo Wilder ===
    let adxFuerte = false;
    let adx = NaN;

    if (filtrosBonitoConfig.adxFuerte) {
        const { adxLength, diLength, umbralADX } = filtrosBonitoConfig;

        if (ticks.length >= diLength + adxLength + 1) {
            let trs = [], plusDMs = [], minusDMs = [];

            for (let i = 1; i < ticks.length; i++) {
                const prev = ticks[i - 1];
                const curr = ticks[i];
                const upMove = curr.high - prev.high;
                const downMove = prev.low - curr.low;
                const plusDM = (upMove > downMove && upMove > 0) ? upMove : 0;
                const minusDM = (downMove > upMove && downMove > 0) ? downMove : 0;
                const tr = Math.max(
                    curr.high - curr.low,
                    Math.abs(curr.high - prev.close),
                    Math.abs(curr.low - prev.close)
                );
                trs.push(tr);
                plusDMs.push(plusDM);
                minusDMs.push(minusDM);
            }

            let smoothedTR = trs.slice(0, diLength).reduce((a, b) => a + b, 0);
            let smoothedPlusDM = plusDMs.slice(0, diLength).reduce((a, b) => a + b, 0);
            let smoothedMinusDM = minusDMs.slice(0, diLength).reduce((a, b) => a + b, 0);

            let dxs = [];

            for (let i = diLength; i < trs.length; i++) {
                smoothedTR = smoothedTR - (smoothedTR / diLength) + trs[i];
                smoothedPlusDM = smoothedPlusDM - (smoothedPlusDM / diLength) + plusDMs[i];
                smoothedMinusDM = smoothedMinusDM - (smoothedMinusDM / diLength) + minusDMs[i];

                const plusDI = 100 * (smoothedPlusDM / smoothedTR);
                const minusDI = 100 * (smoothedMinusDM / smoothedTR);
                const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;

                if (isFinite(dx)) dxs.push(dx);
            }

            function suavizar(array, alpha = 0.5) {
                const resultado = [];
                resultado[0] = array[0];
                for (let i = 1; i < array.length; i++) {
                    resultado[i] = alpha * array[i] + (1 - alpha) * resultado[i - 1];
                }
                return resultado;
            }

            if (dxs.length >= adxLength) {
                const suavizados = suavizar(dxs, 0.5);
                adx = suavizados[suavizados.length - 1];
                adxFuerte = adx > umbralADX;
            }
        }
    }

    // === Filtro de cantidad de ticks por segundo (liquidez del par) ===
    let ticksPorSegundo = 0;
    let ticksSaludables = false;
    let ticksMuyBuenos = false;

    if (ticks.length >= 2) {
        const t0 = ticks[0].time;
        const t1 = ticks[ticks.length - 1].time;
        let delta = t1 - t0;

        if (delta > 1000) delta = delta / 1000;

        const segundosTotales = delta > 0 ? delta : 1;
        ticksPorSegundo = ticks.length / segundosTotales;
        ticksSaludables = ticksPorSegundo >= filtrosBonitoConfig.ticksPerSec_umbral_ok;
        ticksMuyBuenos = ticksPorSegundo >= filtrosBonitoConfig.ticksPerSec_umbral_bueno;
    }

    const filtrosEvaluados = [
        filtrosBonitoConfig.ticksPorSegundoOk ? ticksSaludables : null,
        filtrosBonitoConfig.oscilaciones ? oscilaciones >= 3 : null,
        filtrosBonitoConfig.suave ? suave : null,
        filtrosBonitoConfig.rangoOk ? rangoOk : null,
        filtrosBonitoConfig.limpiasOk ? limpiasOk : null,
        filtrosBonitoConfig.tendenciaClara ? tendenciaClara : null,
        filtrosBonitoConfig.direccionDominante ? direccionDominante : null,
        filtrosBonitoConfig.distanciaOk ? distanciaOk : null,
        filtrosBonitoConfig.mechasOk ? mechasOk : null,
        filtrosBonitoConfig.tickVsCuerpo ? tickVsCuerpo : null,
        filtrosBonitoConfig.adxFuerte ? adxFuerte : null
    ].filter(v => v !== null);

    const scoreCumplidos = filtrosEvaluados.filter(Boolean).length;
    const scoreTotal = filtrosEvaluados.length;
    const porcentajeScore = scoreTotal > 0 ? scoreCumplidos / scoreTotal : 0;
    const bonito = porcentajeScore >= 0.66;

    const panelId = "bonito-" + asset;
    let panel = winDoc.getElementById(panelId);

    if (!panel) {
        panel = winDoc.createElement("div");
        panel.id = panelId;
        panel.style.border = "1px solid #333";
        panel.style.marginBottom = "10px";
        panel.style.padding = "6px 10px";
        panel.style.borderRadius = "6px";
        panel.style.background = "#222";
        panel.style.color = "#eee";
        panel.style.fontSize = "12px";
        winDoc.getElementById("contenedorBonito").appendChild(panel);
    }

    panel.innerHTML = `
<b style="color:${bonito ? '#0f0' : '#f33'}">${bonito ? "🟢 Contexto Apto" : "🔴 Contexto Débil"} (${asset})</b><br>
Ondas: ${oscilaciones} | Jump máx: ${maxJump.toFixed(5)} | Distancia: ${distancia.toFixed(5)}<br>
Score: ${(porcentajeScore * 100).toFixed(0)}% (${scoreCumplidos}/${scoreTotal})<br><br>

${filtrosBonitoConfig.oscilaciones ? `✔️ Ondas ≥ 3: ${oscilaciones >= 3 ? '✔️' : '❌'} (${oscilaciones})<br>` : ''}
${filtrosBonitoConfig.suave ? `✔️ Suave (<0.02): ${suave ? '✔️' : '❌'} (${maxJump.toFixed(5)})<br>` : ''}
${filtrosBonitoConfig.rangoOk ? `✔️ Rango OK: ${rangoOk ? '✔️' : '❌'} (${avgRango.toFixed(5)})<br>` : ''}
${filtrosBonitoConfig.limpiasOk ? `
✔️ Velas limpias: ${limpiasOk ? '✔️' : '❌'} (${velasLimpias.length}/${ultimasVelas.length})
<details style="margin-left:10px;cursor:pointer">
<summary>Detalles</summary>
${ultimasVelas.map((v, i) => 
    `Vela ${i+1}: ${detallesVelas[i].proporcion} ${detallesVelas[i].esLimpiar ? '✔' : '✖'} ${detallesVelas[i].direccion}`
).join('<br>')}
</details>
<br>` : ''}
${filtrosBonitoConfig.tendenciaClara ? `✔️ Tendencia clara: ${tendenciaClara ? '✔️' : '❌'} (suma: ${sumaDirecciones})<br>` : ''}
${filtrosBonitoConfig.direccionDominante ? `✔️ Dirección dominante: ${direccionDominante ? '✔️' : '❌'} (↑${suben} ↓${bajan})<br>` : ''}
${filtrosBonitoConfig.distanciaOk ? `✔️ Distancia suficiente: ${distanciaOk ? '✔️' : '❌'} (${distancia.toFixed(5)})<br>` : ''}
${filtrosBonitoConfig.mechasOk ? `✔️ Mechas chicas: ${mechasOk ? '✔️' : '❌'} (${mechasChicas.length} de 5)<br>` : ''}
${filtrosBonitoConfig.tickVsCuerpo ? `✔️ Tick coincide con cuerpo: ${tickVsCuerpo ? '✔️' : '❌'}<br>` : ''}
${filtrosBonitoConfig.adxFuerte ? `✔️ ADX > ${filtrosBonitoConfig.umbralADX}: ${adxFuerte ? '✔️' : '❌'} (ADX = ${isNaN(adx) ? 'n/a' : adx.toFixed(2)})<br>` : ''}
${filtrosBonitoConfig.ticksPorSegundoOk ? `✔️ Ticks/s: ${ticksMuyBuenos ? '🟢' : ticksSaludables ? '🟡' : '🔴'} (${ticksPorSegundo.toFixed(1)} t/s)<br>` : ''}
`;

})(f.ticks, f.asset);

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//fin de codigo agregado
                    f.ticks = f.ticks.filter(m =>
                        m.time > c.time - 100);
                    if (0 == f.bars.length) f.unavailable || (f.unavailable = !0, this.queueRequestBars.push(f));
                    else {
                        var k = f.bars[0],
                            l = a(d.time, f.period);
                        l > k.time && (k = {
                            time: l,
                            open: d.price,
                            close: d.price,
                            high: d.price,
                            low: d.price
                        }, f.bars.unshift(k), f.bars = f.bars.slice(0, appConfiguration.appData.barsInHistory), e.push({
                            event: "newBar",
                            openedChart: f
                        }));
                        d.price > k.high && (k.high = d.price);
                        d.price < k.low && (k.low = d.price);
                        k.close = d.price;
                        e.push({
                            event: "currentBar",
                            openedChart: f
                        })
                    }
                });
                e.forEach(f => {
                    let d = f.openedChart;
                    switch (f.event) {
                        case "newBar":
                            d.experts.filter(k =>
                                "newBar" == k.timeInspection).forEach(k => {
                                try {
                                    this.experts.find(l => l.id == k.id).checking\u0421onditions(d.asset)
                                } catch (l) {}
                            });
                            break;
                        case "currentBar":
                            d.experts.filter(k => "currentBar" == k.timeInspection).forEach(k => {
                                try {
                                    this.experts.find(l => l.id == k.id).checking\u0421onditions(d.asset)
                                } catch (l) {}
                            })
                    }
                })
            })
        })
    }
    serverTime() {
        return Math.round(Math.round(Date.now() / 1E3) + 60 * this.serverTimeZoneOffset)
    }
    triggerDealsList() {
        clearTimeout(this.setTimeout.triggerDealsList);
        this.setTimeout.triggerDealsList = setTimeout(() => {
            this.wsPlatform.connected && this.wsPlatform.disconnect()
        }, 500)
    }
    setUserLevel() {
        let b = [{
            name: "0",
            payout: 0,
            maxOpenAmount: 1E3,
            depositsSum: 0
        }, {
            name: "1",
            payout: 0,
            maxOpenAmount: 1E3,
            depositsSum: 100
        }, {
            name: "2",
            payout: 2,
            maxOpenAmount: 2E3,
            depositsSum: 1E3
        }, {
            name: "3",
            payout: 4,
            maxOpenAmount: 3E3,
            depositsSum: 1E4
        }, {
            name: "4",
            payout: 6,
            maxOpenAmount: 5E3,
            depositsSum: 9999999
        }, {
            name: "5",
            payout: 8,
            maxOpenAmount: 2E4,
            depositsSum: 9999999
        }];
        this.userLevel = this.isDemo ? b.find(a => "5" == a.name) : "undefined" != typeof this.financeUserLevel ?
            b.find(a => a.name == this.financeUserLevel) || b[0] : b.find(a => a.depositsSum >= this.depositsSum)
    }
    maxBet() {
        return 1E3 > this.depositsSum ? 1E3 : 1E3 <= this.depositsSum && 1E4 > this.depositsSum ? 2E3 : 1E4 <= this.depositsSum && 1E5 > this.depositsSum ? 3E3 : 2E4
    }
    async post(b, a, c = {}) {
        b = await fetch(b, {
            method: "post",
            headers: Object.assign({
                Accept: "application/json",
                "Content-Type": "application/json"
            }, c),
            body: JSON.stringify(a)
        });
        if (200 != b.status) throw Error("Incorrect server response ");
        return await b.json()
    }
    async loadBarChart(b) {
        if (void 0 ==
            this.openedCharts.find(a => a.asset == b.asset && a.period == b.period)) return !0;
        await pause(500);
        try {
            try {
                let a = await this.getHistoryBars(b.asset, b.period);
                b.bars = a.bars;
                b.ticks = a.ticks;
                b.symbolPoint = a.symbolPoint
            } catch (a) {
                throw `Error receiving bars ${a.error} ${a.function}`;
            }
            try {
                let a = b.bars[0];
                b.ticks.filter(c => c.time > a.time).forEach(c => {
                    var g = c.time;
                    g -= g % b.period;
                    g > a.time ? (a = {
                        time: g,
                        open: c.price,
                        close: c.price,
                        high: c.price,
                        low: c.price
                    }, b.bars.unshift(a)) : (c.price > a.high && (a.high = c.price), c.price < a.low &&
                        (a.low = c.price), a.close = c.price)
                });
                delete b.unavailable
            } catch (a) {
                throw a;
            }
            this.sendPlatformInformationOpenedCharts();
            this.experts.filter(a => a.assets.includes(b.asset) && void 0 != a.indicatorsSetings.find(c => c.indparms.tf == b.period)).forEach(a => {
                a.runEvent("addLogEntry", {
                    mark: ["logsBook.loadAsset"],
                    parms: {
                        asset: b.asset,
                        period: b.period
                    }
                })
            });
            return !0
        } catch (a) {
            throw b.bars = [], delete b.unavailable, this.experts.filter(c => c.assets.includes(b.asset) && void 0 != c.indicatorsSetings.find(g => g.indparms.tf == b.period)).forEach(c => {
                c.runEvent("addLogEntry", {
                    mark: ["logsBook.errorLoadAsset"],
                    parms: {
                        asset: b.asset,
                        period: b.period
                    }
                })
            }), `loadBarChart error ${a}`;
        }
    }
    async getUsedAssets() {
        return new Promise(async (b, a) => {
            try {
                let c = [],
                    g = (await chrome.storage.local.get("strategies")).strategies,
                    h = (await chrome.storage.local.get("runningStrategies")).runningStrategies;
                for (let e = 0; e < h.length; e++) {
                    let f = g.find(d => d.id == h[e]);
                    if (void 0 != f.regulations.find(d => "timeFrom" == d.id && checkWorkingHours(d.value)))
                        for (let d = 0; d < f.assets.length; d++) {
                            let k =
                                f.assets[d],
                                l = f.indicators.map(m => void 0 == m.settings.find(n => "tf" == n.id) ? 0 : m.settings.find(n => "tf" == n.id).value).filter(m => 0 != m);
                            for (let m = 0; m < l.length; m++) c.push(`${k}:${l[m]}`)
                        }
                }
                b(c.filter((e, f) => c.indexOf(e) === f))
            } catch (c) {
                a(c)
            }
        })
    }
    async reportUsedAssets() {
        this.authData.usedAssets = [...(new Set((await this.getUsedAssets()).map(b => b.split(":")[0])))].filter(b => appStorage.availableAssets.find(a => a.id == b && a.available));
        "undefined" != typeof this.wsRobot && this.wsRobot.connected && this.wsRobot.emit("usedAssets",
            this.authData.usedAssets);
        return !0
    }
    async getHistoryBars_last(b, a) {
        var c = async (l, m = null) => {
            null == m && (m = 60 > l ? (Date.now() + 6E4 * (this.serverTimeZoneOffset + 3)) / 1E3 : Math.round((Date.now() + 6E4 * this.serverTimeZoneOffset) / 1E3));
            let n = appConfiguration.appData.barsInHistory * l;
            return new Promise((q, r) => {
                this.wsPlatform.emit("loadHistoryPeriod", {
                    asset: b,
                    index: l,
                    time: m,
                    offset: n,
                    period: l
                });
                this.on(`loadHistoryPeriod_${b}_${l}`, "unique", p => {
                    0 == p.data.length && r(`getHistory (${b} ${l}).Empty array of quotes`);
                    q(p)
                });
                setTimeout(() => {
                    r(`getHistory (${b} ${l}).No response to the request for quotations`)
                }, 5E3)
            })
        }, g = (l, m) => l + m - (l + m) % m;
        let h = (l, m) => l - l % m,
            e = [],
            f, d = 0;
        try {
            f = (await c(60 > a ? a : 5)).data, JSON.stringify(f)
        } catch (l) {
            throw {
                error: l,
                function: "getHistoryBars"
            };
        }
        if (60 > a) {
            for (var k = 0; 5 > k && !((g(f[f.length - 1].time, a) - g(f[0].time, a)) / a > appConfiguration.appData.barsInHistory); k++) f = (await c(60 > a ? a : 5, f[0].time)).data.concat(f);
            c = {
                time: g(f[0].time, a),
                open: null,
                close: null,
                high: -Infinity,
                low: Infinity
            };
            for (g = 0; g < f.length; g++) {
                k =
                    f[g];
                k.price.toString().match(/\.(\d+)/)?.[1].length > d && (d = k.price.toString().match(/\.(\d+)/)?.[1].length);
                if (k.time < c.time) continue;
                let l = h(k.time, a);
                l > c.time ? (c = {
                    time: l,
                    open: k.price,
                    close: k.price,
                    high: k.price,
                    low: k.price
                }, e.push(c)) : (k.price > c.high && (c.high = k.price), k.price < c.low && (c.low = k.price), c.close = k.price)
            }
        } else {
            try {
                e = (await c(a)).data.map(m => ({
                    time: m.time,
                    open: m.open,
                    close: m.close,
                    high: m.high,
                    low: m.low
                }))
            } catch (m) {
                throw {
                    error: m,
                    function: "getHistoryBars"
                };
            }
            let l = e[e.length - 1];
            f = f.filter(m =>
                m.time > l.time);
            for (c = 0; c < f.length; c++) g = f[c], g.price.toString().match(/\.(\d+)/)?.[1].length > d && (d = g.price.toString().match(/\.(\d+)/)?.[1].length), k = h(g.time, a), k > l.time ? (l = {
                time: k,
                open: g.price,
                close: g.price,
                high: g.price,
                low: g.price,
                farm: !0
            }, e.push(l)) : (g.price > l.high && (l.high = g.price), g.price < l.low && (l.low = g.price), l.close = g.price)
        }
        return {
            bars: e.splice(-appConfiguration.appData.barsInHistory).reverse(),
            ticks: f,
            symbolPoint: 0 < d ? 1 / +`1${(0).toPrecision(d).replace(/\./g, "")}` : 1
        }
    }
    async getHistoryBars(b,
        a) {
        var c = async (k, l = null) => {
            null == l && (l = 1 == k ? (Date.now() + 6E4 * (this.serverTimeZoneOffset + 3)) / 1E3 : Math.round((Date.now() + 6E4 * this.serverTimeZoneOffset) / 1E3));
            let m = 1 == k ? appConfiguration.appData.barsInHistory * a : appConfiguration.appData.barsInHistory * k;
            return new Promise((n, q) => {
                this.wsPlatform.emit("loadHistoryPeriod", {
                    asset: b,
                    index: k,
                    time: l,
                    offset: m,
                    period: k
                });
                this.on(`loadHistoryPeriod_${b}_${k}`, "unique", r => {
                    0 == r.data.length && q(`getHistory (${b} ${k}).Empty array of quotes`);
                    n(r)
                });
                setTimeout(() => {
                    q(`getHistory (${b} ${k}).No response to the request for quotations`)
                }, 5E3)
            })
        };
        let g = (k, l) => k - k % l,
            h = [],
            e, f = 0;
        try {
            h = (await c(a)).data.map(k => ({
                time: k.time,
                open: k.open,
                close: k.close,
                high: k.high,
                low: k.low
            }))
        } catch (k) {
            throw {
                error: k,
                function: "getHistoryBars"
            };
        }
        let d = h[h.length - 1];
        await pause(500);
        try {
            for (e = (await c(1)).data; e[0].time > d.time;) await pause(500), e = (await c(1, e[0].time)).data.concat(e);
            e = e.filter(k => k.time > d.time)
        } catch (k) {
            throw {
                error: k,
                function: "getHistoryBars"
            };
        }
        for (c = 0; c < e.length; c++) {
            let k =
                e[c];
            k.price.toString().match(/\.(\d+)/)?.[1].length > f && (f = k.price.toString().match(/\.(\d+)/)?.[1].length);
            let l = g(k.time, a);
            l > d.time ? (d = {
                time: l,
                open: k.price,
                close: k.price,
                high: k.price,
                low: k.price,
                farm: !0
            }, h.push(d)) : (k.price > d.high && (d.high = k.price), k.price < d.low && (d.low = k.price), d.close = k.price)
        }
        return {
            bars: h.splice(-appConfiguration.appData.barsInHistory).reverse(),
            ticks: e,
            symbolPoint: 0 < f ? 1 / +`1${(0).toPrecision(f).replace(/\./g, "")}` : 1
        }
    }
    async saveExpertsClasses() {
        let b = "TradeSeries Expert Trader subscription assets data indicators martingale regulations type indicatorsSetings martingaleSetings regulationsSetings ready experts trader isNosound setInterval setTimeout".split(" "),
            a = (await chrome.storage.local.get("recoveryExpertData")).recoveryExpertData;
        a = "object" != typeof a ? [] : a;
        this.experts.forEach(c => {
            let g = a.find(h => h.uid == this.uid && h.isDemo == this.isDemo && h.session == c.session);
            void 0 == g && (g = {
                id: c.id,
                uid: this.uid,
                isDemo: this.isDemo,
                session: c.session
            }, a.push(g));
            g.iso = JSON.stringify(c, (h, e) => {
                if (!b.includes(h)) return e
            })
        });
        await chrome.storage.local.set({
            recoveryExpertData: a
        });
        return !0
    }
}
class Expert {
    constructor(b, a) {
        this.subscription = {};
        this.Trader = a;
        this.status = "trade";
        this.ready = !1;
        this.tradingResult = 0;
        this.queueSendTradeSeries = [];
        this.tradeSeries = [];
        this.signals = [];
        this.stopListAssets = {};
        this.isNosound = !1;
        Object.assign(this, b);
        this.indicatorsSetings = this.indicators.map(c => ({
            id: c.id,
            indparms: c.settings.filter(g => "signalUp" != g.id && "signalDown" != g.id).reduce((g, h) => ({
                ...g,
                [h.id]: isNaN(+h.value) ? h.value : +h.value
            }), {}),
            conditions: c.settings.filter(g => "signalUp" == g.id || "signalDown" ==
                g.id).reduce((g, h) => ({
                ...g,
                [h.id]: h.value
            }), {})
        }));
        this.martingaleSetings = this.martingale.map(c => c.reduce((g, h) => ({
            ...g,
            [h.id]: isNaN(+h.value) ? h.value : +h.value
        }), {}));
        this.regulationsSetings = this.regulations.reduce((c, g) => ({
            ...c,
            [g.id]: isNaN(+g.value) ? g.value : +g.value
        }), {});
        this.recoveryExpertData().then(c => {
            this.ready = c
        }).catch(() => {
            this.ready = !1
        });
        this.on("setExpertStatus", "classExpert", async c => {
            this.status = c;
            "stoped" == this.status && (platform.notification(platform.translation("platform.notification.stopStrategyTitle"),
                platform.translation("platform.notification.stopStrategyText", {
                    startegyName: "undefined" == typeof this.data.userTitle ? platform.translation(this.data.title) : this.data.userTitle
                }), 7E3, "changingSettings", "klik"), this.Trader.ordersClass.filter(g => g.Expert.id == this.id).forEach(g => {
                g.runEvent("strategyStopped")
            }), this.Trader.ordersClass = this.Trader.ordersClass.filter(g => g.Expert.id != this.id), this.tradeSeries = [], this.runEvent("queueStart", () => {}))
        });
        this.on("signalApi", "constructor", c => {
            this.checking\u0421onditions(c.asset,
                c.signal)
        });
        this.on("addLogEntry", "constructor", async c => {
            await this.addIteamLogsBook("note", {
                log: c
            })
        });
        this.on("logsUpdateAssets", "constructor", async c => {
            await this.addIteamLogsBook("updateAssets", {
                anyData: {
                    updateAssets: c.newAvailableAssets
                },
                isFirst: c.isFirst
            })
        });
        (async () => {
            for (;
                "stoped" != this.status;) {
                if (0 == this.queueSendTradeSeries.length) {
                    await new Promise((g, h) => {
                        this.on("queueStart", "unique", g)
                    });
                    continue
                }
                let c = this.queueSendTradeSeries.shift();
                await this.sendTradeSeries(c[0], c[1], c[2], c[3])
            }
        })()
    }
    on(b,
        a, c) {
        "undefined" == typeof this.subscription[b] && (this.subscription[b] = {});
        this.subscription[b][a] = c;
        return !0
    }
    runEvent(b, a) {
        for (let c in this.subscription[b]) this.subscription[b][c](a), "unique" == c && delete this.subscription[b]
    }
    async addIteamLogsBook(b, a = null) {
        let c = Math.round(Date.now() / 1E3);
        try {
            switch (b) {
                case "note":
                    await chrome.runtime.sendMessage({
                        sender: "expert",
                        event: "addLogEntry",
                        data: {
                            type: "expert:note",
                            session: this.session,
                            expertId: this.id,
                            timestamp: c,
                            log: a.log,
                            anyData: "undefined" == typeof a.anyData ? {} : a.anyData
                        }
                    });
                    break;
                case "updateAssets":
                    await chrome.runtime.sendMessage({
                        sender: "expert",
                        event: "addLogEntry",
                        data: {
                            type: "expert:updateAssets",
                            session: this.session,
                            expertId: this.id,
                            timestamp: c,
                            log: {},
                            anyData: "undefined" == typeof a.anyData ? {} : a.anyData
                        }
                    })
            }
        } catch {}
    }
    async recoveryExpertData() {
        try {
            var b = (await chrome.storage.local.get("recoveryExpertData")).recoveryExpertData;
            let a = b.find(c => c.id == this.id && c.isDemo == this.Trader.isDemo && c.uid == this.Trader.uid && c.session == this.session);
            if (void 0 == a) return void 0 ==
                b.find(c => c.session == this.session) && (platform.notification(platform.translation("platform.notification.runStrategyTitle"), platform.translation("platform.notification.runStrategyText", {
                    startegyName: "undefined" == typeof this.data.userTitle ? platform.translation(this.data.title) : this.data.userTitle
                }), 7E3, "changingSettings", "klik"), await this.Trader.saveExpertsClasses()), !0;
            a = JSON.parse(a.iso);
            Object.assign(this, a);
            this.tradeSeries = this.tradeSeries.filter(c => "completed" != c.state);
            for (b = 0; b < this.tradeSeries.length; b++) this.tradeSeries[b] =
                new TradeSeries(this, void 0, this.tradeSeries[b]);
            return !0
        } catch (a) {}
    }
    async updateSettings() {
        try {
            let b = [],
                a = (await chrome.storage.local.get("strategies")).strategies.find(e => e.id == this.id);
            JSON.stringify(a.assets) != JSON.stringify(this.assets) && b.push("changesStrategyAssets");
            Object.assign(this, a);
            let c = this.indicators.map(e => ({
                id: e.id,
                indparms: e.settings.filter(f => "signalUp" != f.id && "signalDown" != f.id).reduce((f, d) => ({
                    ...f,
                    [d.id]: isNaN(+d.value) ? d.value : +d.value
                }), {}),
                conditions: e.settings.filter(f =>
                    "signalUp" == f.id || "signalDown" == f.id).reduce((f, d) => ({
                    ...f,
                    [d.id]: d.value
                }), {})
            }));
            JSON.stringify(this.indicatorsSetings) != JSON.stringify(c) && (b.push("changesStrategyIndicators"), this.stopListAssets = {});
            this.indicatorsSetings = c;
            let g = this.martingale.map(e => e.reduce((f, d) => ({
                ...f,
                [d.id]: isNaN(+d.value) ? d.value : +d.value
            }), {}));
            JSON.stringify(this.martingaleSetings) != JSON.stringify(g) && b.push("changesStrategyMartingale");
            this.martingaleSetings = g;
            let h = this.regulations.reduce((e, f) => ({
                ...e,
                [f.id]: isNaN(+f.value) ?
                    f.value : +f.value
            }), {});
            JSON.stringify(this.regulationsSetings) != JSON.stringify(h) && b.push("changesStrategyRegulations");
            this.regulationsSetings = h;
            this.status = this.regulationsSetings.mode;
            if (0 < b.length) {
                let e = platform.translation("platform.notification.inStrategy", {
                    startegyName: "undefined" == typeof this.data.userTitle ? platform.translation(this.data.title) : this.data.userTitle
                });
                b.forEach(async f => {
                    e += platform.translation(`platform.notification.${f}`)
                });
                platform.notification(platform.translation("platform.notification.changesRunStrategy"),
                    e, 1E4, "changingSettings", "klik")
            }
            return !0
        } catch (b) {
            return this.ready = !1
        }
    }
    async "checking\u0421onditions"(b, a) {
        if (!this.ready) return !1;
        let c = b;
        try {
            b = this.Trader.availableAssets.find(d => d.id == b);
            if (void 0 == b) {
                if (a) throw {
                    error: `\u0410\u043a\u0442\u0438\u0432 ${c} \u043d\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`,
                    func: async () => {
                        await this.addIteamLogsBook("note", {
                            log: {
                                mark: ["logsBook.assetNotExist"],
                                parms: {
                                    asset: c
                                }
                            }
                        })
                    }
                };
                throw {
                    error: `\u0410\u043a\u0442\u0438\u0432 ${c} \u043d\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442`
                };
            }
            if (!this.assets.includes(b.id)) {
                if (a) throw {
                    error: `\u0410\u043a\u0442\u0438\u0432 ${b.id} \u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d \u0432 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438`,
                    func: async () => {
                        await this.addIteamLogsBook("note", {
                            log: {
                                mark: ["logsBook.assetNotSelected"],
                                parms: {
                                    asset: b.id
                                }
                            }
                        })
                    }
                };
                throw {
                    error: `\u0410\u043a\u0442\u0438\u0432 ${b.id} \u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d \u0432 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438`
                };
            }
        } catch (d) {
            return "undefined" !=
                typeof d.func && d.func(), !1
        }
        let g = this.indicatorsSetings.length,
            h = [],
            e = `${b.id}_`;
        try {
            for (let d = 0; d < g; d++) {
                if ("api" == this.indicatorsSetings[d].id) {
                    if (!a || 0 != d) return !1;
                    e += "signals" == this.regulationsSetings.mode ? Math.round(Date.now() / 1E3) : genDealId();
                    h.push(a);
                    continue
                }
                var f = this.Trader.openedCharts.find(l => l.asset == b.id && l.period == this.indicatorsSetings[d].indparms.tf);
                if (void 0 == f) {
                    if (checkWorkingHours(this.regulationsSetings.timeFrom)) throw {
                        error: "openedCharts \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d"
                    };
                    throw {
                        error: "\u041d\u0435\u0440\u0430\u0431\u043e\u0447\u0438\u0439 \u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d \u0432\u0440\u0435\u043c\u0435\u043d\u0438",
                        func: async () => {
                            await this.addIteamLogsBook("note", {
                                log: {
                                    mark: ["logsBook.ErrorCheckConditionsAsset", "logsBook.noWorkingTime"],
                                    parms: {
                                        asset: b.id
                                    }
                                }
                            })
                        }
                    };
                }
                if (f.bars.length < appConfiguration.appData.barsInHistory) throw {
                    error: "\u0411\u0430\u0440\u043e\u0432 \u0432 \u0438\u0441\u0442\u043e\u0440\u0438\u0438 \u043d\u0435\u0434\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e",
                    func: async () => {
                        await this.addIteamLogsBook("note", {
                            log: {
                                mark: ["logsBook.ErrorCheckConditionsAsset", "logsBook.insufficientBars"],
                                parms: {
                                    asset: b.id
                                }
                            }
                        })
                    }
                };
                0 == d && (e += "signals" == this.regulationsSetings.mode ? f.bars[0].time : genDealId());
                if ("undefined" == typeof Indicators[this.indicatorsSetings[d].id]) throw {
                    error: "\u0418\u043d\u0434\u0438\u043a\u0430\u0442\u043e\u0440 \u043d\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442"
                };
                let k = Indicators[this.indicatorsSetings[d].id](f, JSON.parse(JSON.stringify(this.indicatorsSetings[d].indparms)),
                    this.indicatorsSetings[d].conditions);
                if (!k.signal) break;
                h.push(k)
            }
        } catch (d) {
            return "undefined" != typeof d.func && d.func(), !1
        }
        a = !1;
        f = {
            signalUp: "call",
            signalDown: "put"
        };
        for (let d in f)
            if (h.filter(k => k[d]).length == g) {
                a = f[d];
                break
            } if (!a) return delete this.stopListAssets[b.id], !1;
        try {
            if (!checkWorkingHours(this.regulationsSetings.timeFrom)) throw {
                error: "\u041d\u0435\u0440\u0430\u0431\u043e\u0447\u0438\u0439 \u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d \u0432\u0440\u0435\u043c\u0435\u043d\u0438",
                func: async () => {
                    await this.addIteamLogsBook("note", {
                        log: {
                            mark: ["logsBook.conditionsAssetRefusal", "logsBook.noWorkingTime"],
                            parms: {
                                asset: b.id
                            }
                        }
                    })
                }
            };
            if ("signals" != this.regulationsSetings.mode && this.regulationsSetings.bet > this.Trader.balance) throw {
                error: "\u041d\u0435\u0434\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043d\u0430 \u0441\u0447\u0435\u0442\u0435",
                func: async () => {
                    await this.addIteamLogsBook("note", {
                        log: {
                            mark: ["logsBook.conditionsAssetRefusal", "logsBook.insufficientFunds"],
                            parms: {
                                asset: b.id
                            }
                        }
                    })
                }
            };
            if (!b.available) throw {
                error: "\u0410\u043a\u0442\u0438\u0432 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d",
                func: async () => {
                    await this.addIteamLogsBook("note", {
                        log: {
                            mark: ["logsBook.conditionsAssetRefusal", "logsBook.assetUnavailable"],
                            parms: {
                                asset: b.id
                            }
                        }
                    })
                }
            };
            if (b.profit < this.regulationsSetings.minProfit) throw {
                error: "\u041d\u0438\u0437\u043a\u0430\u044f \u0434\u043e\u0445\u043e\u0434\u043d\u043e\u0441\u0442\u044c",
                func: async () => {
                    await this.addIteamLogsBook("note", {
                        log: {
                            mark: ["logsBook.conditionsAssetRefusal", "logsBook.yieldAssetNotMatch"],
                            parms: {
                                asset: b.id,
                                yield: b.profit
                            }
                        }
                    })
                }
            };
            if ("undefined" != typeof this.stopListAssets[b.id] && this.stopListAssets[b.id] == a) throw {
                error: `\u041f\u043e \u043f\u043e \u044d\u0442\u043e\u043c\u0443 \u0441\u0438\u0433\u043d\u0430\u043b\u0443 \u043d\u0430 \u0430\u043a\u0442\u0438\u0432\u0435 ${b.id} \u0443\u0436\u0435 \u0431\u044b\u043b\u0430 \u0441\u0434\u0435\u043b\u043a\u0430.`,
                func: async () => {
                    await this.addIteamLogsBook("note", {
                        log: {
                            mark: ["logsBook.conditionsAssetRefusal",
                                "logsBook.byUsingSignalAsset"
                            ],
                            parms: {
                                asset: b.id
                            }
                        }
                    })
                }
            };
        } catch (d) {
            return "undefined" != typeof d.func && d.func(), !1
        }
        this.queueSendTradeSeries.push([b.id, a, e, b.minExp]);
        return this.runEvent("queueStart", () => {})
    }
    async sendTradeSeries(b, a, c, g) {
        if ("signals" == this.regulationsSetings.mode) void 0 == this.signals.find(e => e.signalID == c) && (this.signals.push({
            time: Date.now(),
            asset: b,
            action: a,
            signalID: c
        }), this.Trader.saveExpertsClasses(), "api" != this.indicatorsSetings[0].id && (this.stopListAssets[b] = a), platform.notification(platform.translation("platform.notification.tradeSignalTitle", {
            strategy: "undefined" == typeof this.data.userTitle ? platform.translation(this.data.title) : this.data.userTitle
        }), platform.translation("platform.notification.tradeSsignal", {
            asset: b,
            action: platform.translation(`platform.notification.${a}`)
        }), 15E3, "changingSettings", this.isNosound ? "" : "tradeSignals"), this.isNosound = !0, setTimeout(() => {
            this.isNosound = !1
        }, 2E3));
        else {
            var h = this.tradeSeries.filter(e => "atwork" == e.state).length >= this.regulationsSetings.maxBets ? void 0 : this.tradeSeries.find(e => {
                if ("atwork" == e.state) return !1;
                var f = e.state.split(":");
                if (f[1] == b && f[2] >= g) return !0;
                if (f = "all" == f[1] && f[2] >= g) a: {
                    try {
                        let d = e.martingaleInstructions();
                        if (!d) {
                            f = !0;
                            break a
                        }
                        if (b == d.lastLooseOrder.asset && "yes" == d.instructions.excludePreviousAsset) {
                            f = !1;
                            break a
                        }
                    } catch {}
                    f = !0
                }
                return f ? !0 : !1
            });
            if (void 0 == h) {
                try {
                    if (void 0 != this.tradeSeries.find(e => e.involvedAssets.includes(b))) throw {
                        error: "\u0418\u043c\u0435\u044e\u0442\u0441\u044f \u0441\u0435\u0440\u0438\u0438 \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043b\u0438/\u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442 \u0430\u043a\u0442\u0438\u0432.",
                        func: async () => {
                            await this.addIteamLogsBook("note", {
                                log: {
                                    mark: ["logsBook.conditionsAssetRefusal", "logsBook.isSeriesUsedAsset"],
                                    parms: {
                                        asset: b
                                    }
                                }
                            })
                        }
                    };
                    if (this.tradeSeries.length >= this.regulationsSetings.maxBets) throw {
                        error: "\u0412 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438 \u0441\u043e\u0433\u043b\u0430\u0441\u043d\u043e \u0440\u0435\u0433\u043b\u0430\u043c\u0435\u043d\u0442\u0430, \u0443\u0436\u0435 \u0432 \u0440\u0430\u0431\u043e\u0442\u0435 \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0441\u0435\u0440\u0438\u0439",
                        func: async () => {
                            await this.addIteamLogsBook("note", {
                                log: {
                                    mark: ["logsBook.conditionsAssetRefusal", "logsBook.maximumOperation"],
                                    parms: {
                                        asset: b
                                    }
                                }
                            })
                        }
                    };
                    if (this.regulationsSetings.expiration < g) throw {
                        error: "\u042d\u043a\u0441\u043f\u0438\u0440\u0430\u0446\u0438\u044f \u043d\u0438\u0436\u0435 \u043c\u0438\u043d\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0439",
                        func: async () => {
                            await this.addIteamLogsBook("note", {
                                log: {
                                    mark: ["logsBook.conditionsAssetRefusal", "logsBook.expirationBelowMinimum"],
                                    parms: {
                                        asset: b,
                                        rexp: this.regulationsSetings.expiration,
                                        aexp: g
                                    }
                                }
                            })
                        }
                    };
                } catch (e) {
                    return "undefined" != typeof e.func && e.func(), !1
                }
                h = new TradeSeries(this, c);
                "api" != this.indicatorsSetings[0].id && (this.stopListAssets[b] = a);
                this.tradeSeries.push(h);
                await this.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.assetSignal", "logsBook.openTradingSeries"],
                        parms: {
                            asset: b,
                            tsid: c
                        }
                    }
                })
            } else await this.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.assetSignal", "logsBook.continueTradingSeries"],
                    parms: {
                        asset: b,
                        tsid: h.signalID
                    }
                }
            });
            await new Promise((e, f) => {
                h.signalExpert(b, a).then(d => {
                    d && this.Trader.saveExpertsClasses();
                    e(!0)
                }).catch(e)
            });
            return !0
        }
    }
    async checkTradingResult() {
        "stoped" != this.status && (0 != this.regulationsSetings.tp && this.tradingResult >= this.regulationsSetings.tp && (this.status = "stoped", await this.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.tpReached"],
                    parms: {}
                }
            }), await chrome.runtime.sendMessage({
                sender: "expert",
                event: "changeStrategyStatus",
                data: {
                    strategyId: this.id,
                    strategyStatus: "off"
                }
            }), await this.Trader.saveExpertsClasses()), 0 != this.regulationsSetings.sl && this.tradingResult <=
            -1 * this.regulationsSetings.sl && (this.status = "stoped", await this.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.slReached"],
                    parms: {}
                }
            }), await chrome.runtime.sendMessage({
                sender: "expert",
                event: "changeStrategyStatus",
                data: {
                    strategyId: this.id,
                    strategyStatus: "off"
                }
            }), await this.Trader.saveExpertsClasses()))
    }
}
class TradeSeries {
    on(b, a, c) {
        "undefined" == typeof this.subscription[b] && (this.subscription[b] = {});
        this.subscription[b][a] = c;
        return !0
    }
    runEvent(b, a) {
        for (let c in this.subscription[b]) this.subscription[b][c](a), "unique" == c && delete this.subscription[b]
    }
    constructor(b, a, c = {}) {
        this.subscription = {};
        this.Expert = b;
        this.id = a + genDealId();
        this.signalID = a;
        this.orders = [];
        this.state = "new";
        this.involvedAssets = [];
        this.lastSignalAction = void 0;
        this.expiration = this.Expert.regulationsSetings.expiration;
        this.amount = this.Expert.regulationsSetings.bet;
        this.expertSession = this.Expert.session;
        this.expertID = this.Expert.id;
        Object.assign(this, c);
        this.on("tradeSeriesclose", "unique", () => {
            this.state = "completed";
            this.Expert.tradeSeries = this.Expert.tradeSeries.filter(g => "completed" != g.state);
            this.Expert.Trader.saveExpertsClasses()
        });
        for (b = 0; b < this.orders.length; b++) this.orders[b] = this.newClassOrder(this.orders[b])
    }
    newClassOrder(b) {
        let a = new Order(this, b);
        a.on("waitingOpeningOrder", "TradeSeries", async c => {
            this.Expert.Trader.saveExpertsClasses()
        });
        a.on("openOrder",
            "TradeSeries", async c => {
                "atwork" != b.lastSeriesState && (this.lastSignalAction = b.action);
                this.Expert.Trader.saveExpertsClasses();
                await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.openOrder", `logsBook.command.${c.command}`, "logsBook.orderData", "undefined" != typeof c.martingalData ? "logsBook.openedStepMartingale" : ""],
                        parms: {
                            tsid: this.signalID,
                            id: c.id.slice(-12),
                            requestId: c.requestId,
                            exp: c.closeTimestamp - c.openTimestamp,
                            asset: c.asset,
                            amount: c.amount,
                            step: "undefined" !=
                                typeof c.martingalData ? c.martingalData.step : void 0
                        }
                    }
                })
            });
        a.on("closeOrder", "TradeSeries", async c => {
            await this.Expert.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.tradeSeries", "logsBook.closeOrder", `logsBook.command.${c.command}`, "logsBook.closeOrderData", "undefined" != typeof c.martingalData ? "logsBook.stepMartingale" : ""],
                    parms: {
                        tsid: this.signalID,
                        profit: c.profit,
                        id: c.id.slice(-12),
                        requestId: c.requestId,
                        exp: c.closeTimestamp - c.openTimestamp,
                        asset: c.asset,
                        amount: c.amount,
                        step: "undefined" != typeof c.martingalData ?
                            c.martingalData.step : void 0
                    }
                }
            });
            0 < c.profit ? await this.actionWin() : await this.actionMartingale(c);
            this.Expert.Trader.saveExpertsClasses()
        });
        a.on("failopenOrderOthers", "TradeSeries", async c => {
            "undefined" == typeof c.martingalData ? (this.runEvent("tradeSeriesclose", !0), await this.Expert.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.tradeSeries", "logsBook.failopenOrder", "logsBook.descriptionFirstFailopenOrder"],
                    parms: {
                        id: c.requestId,
                        tsid: this.signalID,
                        reason: platform.translation(`logsBook.errors.${c.errorData.error}`,
                            c.errorData)
                    }
                }
            })) : (this.state = c.lastSeriesState, "atwork" == this.state ? (await this.Expert.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.tradeSeries", "logsBook.failopenOrder", "logsBook.seriesSwitchedAnotherSignal"],
                    parms: {
                        id: c.requestId,
                        tsid: this.signalID,
                        reason: platform.translation(`logsBook.errors.${c.errorData.error}`, c.errorData)
                    }
                }
            }), this.state = `waitingSignal:all:${expiration}`) : await this.Expert.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.tradeSeries", "logsBook.failopenOrder", "logsBook.seriesWaitAnotherSignal"],
                    parms: {
                        id: c.requestId,
                        tsid: this.signalID,
                        reason: platform.translation(`logsBook.errors.${c.errorData.error}`, c.errorData)
                    }
                }
            }));
            this.Expert.Trader.saveExpertsClasses();
            return !0
        });
        a.on("failCloseOrderOthers", "TradeSeries", async c => {
            this.runEvent("tradeSeriesclose", !0);
            await this.Expert.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.tradeSeries", "logsBook.failCloseOrder", "logsBook.stopSeries"],
                    parms: {
                        tsid: this.signalID,
                        reason: platform.translation(`logsBook.errors.${c.error}`),
                        id: c.id.slice(-12),
                        requestId: c.requestId
                    }
                }
            });
            this.Expert.Trader.saveExpertsClasses()
        });
        return a
    }
    async signalExpert(b, a) {
        if ("trade" != this.Expert.status) return this.runEvent("tradeSeriesclose", !0), !1;
        switch (this.state) {
            case "new":
                this.state = "atwork";
                var c = this.newClassOrder({
                    asset: b,
                    amount: this.amount,
                    action: a,
                    time: this.expiration
                });
                c.comments.unshift({
                    date: Math.round(Date.now() / 1E3),
                    mark: ["comments.receivedSignal"],
                    parms: {}
                });
                break;
            default:
                let g = this.state;
                this.state = "atwork";
                c = this.martingaleInstructions();
                let h = this.Expert.Trader.availableAssets.find(d =>
                    d.id == b);
                if (void 0 == c.instructions) return this.runEvent("tradeSeriesclose", !0), await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.noInstructionsMartingale"],
                        parms: {
                            tsid: this.signalID,
                            step: c.step
                        }
                    }
                }), !1;
                let e = c.instructions.expiration;
                if (void 0 == h) return this.state = g, "atwork" == this.state ? (await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.noAssetInformationPlatform", "logsBook.seriesSwitchedAnotherSignal"],
                        parms: {
                            tsid: this.signalID,
                            asset: b
                        }
                    }
                }), this.state = `waitingSignal:all:${e}`) : await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.noAssetInformationPlatform", "logsBook.seriesWaitAnotherSignal"],
                        parms: {
                            tsid: this.signalID,
                            asset: b
                        }
                    }
                }), !0;
                let f;
                switch (c.instructions.autoRatio) {
                    case "on":
                        f = Math.ceil((this.Expert.regulationsSetings.bet - c.allLoose) / h.profit * 100);
                        break;
                    case "off":
                        f = c.lastLooseOrder.amount * c.instructions.ratio
                }
                f > this.Expert.Trader.balance && (f = this.Expert.Trader.balance, await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.notEnoughFundsBetBalance"],
                        parms: {
                            tsid: this.signalID,
                            balance: f
                        }
                    }
                }));
                if (1 > f) return this.runEvent("tradeSeriesclose", !0), await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.remainderLessMinimum"],
                        parms: {
                            tsid: this.signalID
                        }
                    }
                }), !1;
                if (e < h.minExp) switch (c.instructions.disabledExpiration) {
                    case "newAsset":
                        return "atwork" == g ? this.state = `waitingSignal:all:${e}` : (a = g.split(":"), a[1] = "all", a[2] = e, this.state = a.join(":")), await this.Expert.addIteamLogsBook("note", {
                            log: {
                                mark: ["logsBook.tradeSeries", "logsBook.specifiedExpirationMartingaleNotAvailable", `logsBook.${c.instructions.disabledExpiration}`],
                                parms: {
                                    tsid: this.signalID,
                                    expiration: e,
                                    step: c.step
                                }
                            }
                        }), !0;
                    case "awaitAvailablExpiration":
                        return "atwork" == g ? this.state = `waitingSignal:${b}:${e}` : (a = g.split(":"), a[2] = e, this.state = a.join(":")), await this.Expert.addIteamLogsBook("note", {
                            log: {
                                mark: ["logsBook.tradeSeries", "logsBook.specifiedExpirationMartingaleNotAvailable", `logsBook.${c.instructions.disabledExpiration}`],
                                parms: {
                                    tsid: this.signalID,
                                    expiration: e,
                                    step: c.step,
                                    asset: b
                                }
                            }
                        }), !0;
                    case "minAvailabl":
                        await this.Expert.addIteamLogsBook("note", {
                            log: {
                                mark: ["logsBook.tradeSeries", "logsBook.specifiedExpirationMartingaleNotAvailable", `logsBook.${c.instructions.disabledExpiration}`],
                                parms: {
                                    tsid: this.signalID,
                                    expiration: e,
                                    step: c.step
                                }
                            }
                        });
                        e = h.minExp;
                        break;
                    case "stop":
                        return this.runEvent("tradeSeriesclose", !0), await this.Expert.addIteamLogsBook("note", {
                            log: {
                                mark: ["logsBook.tradeSeries", "logsBook.specifiedExpirationMartingaleNotAvailable",
                                    `logsBook.${c.instructions.disabledExpiration}`
                                ],
                                parms: {
                                    tsid: this.signalID,
                                    expiration: e,
                                    step: c.step
                                }
                            }
                        }), !1
                }
                c = this.newClassOrder({
                    asset: b,
                    amount: f,
                    action: a,
                    time: e,
                    martingalData: c,
                    lastSeriesState: g
                })
        }
        this.orders.unshift(c);
        return !0
    }
    martingaleInstructions() {
        let b = this.orders.filter(c => 0 != c.closePrice && 0 > c.profit),
            a = b.length;
        return 0 == a ? {
            step: a,
            instructions: void 0,
            lastLooseOrder: void 0
        } : {
            step: a,
            instructions: this.Expert.martingaleSetings[a - 1],
            lastLooseOrder: b[0],
            allLoose: b.reduce((c, g) => c + (void 0 == g.profit ?
                0 : g.profit), 0)
        }
    }
    async actionMartingale(b) {
        let a = this.martingaleInstructions();
        if (0 == a.step) return this.runEvent("tradeSeriesclose", !0);
        if (void 0 == a.instructions) this.runEvent("tradeSeriesclose", !0), await this.Expert.addIteamLogsBook("note", {
            log: {
                mark: ["logsBook.tradeSeries", "logsBook.noInstructionsMartingale"],
                parms: {
                    tsid: this.signalID,
                    step: a.step,
                    requestId: b.requestId
                }
            }
        });
        else {
            var c = this.Expert.Trader.serverTime() - b.closeTimestamp;
            if (5 < c && "newSignals" != a.instructions.direction) this.state = `waitingSignal:all:${a.instructions.expiration}`,
                await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.delayReceivingDataClosing", "logsBook.seriesSwitchedAnotherSignal"],
                        parms: {
                            tsid: this.signalID,
                            step: a.step,
                            asset: a.lastLooseOrder.asset,
                            requestId: b.requestId,
                            s: c
                        }
                    }
                });
            else if (b = this.Expert.Trader.availableAssets.find(h => h.id == a.lastLooseOrder.asset && h.available), void 0 == b) {
                switch (a.instructions.disabledAsset) {
                    case "newAsset":
                        this.state = `waitingSignal:all:${a.instructions.expiration}`;
                        break;
                    case "awaitAvailabl":
                        this.state =
                            `waitingSignal:${a.lastLooseOrder.asset}:${a.instructions.expiration}`;
                        break;
                    case "stop":
                        this.runEvent("tradeSeriesclose", !0)
                }
                await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.applyMartingaleAssetUnavailable", `logsBook.${a.instructions.disabledAsset}`],
                        parms: {
                            tsid: this.signalID,
                            step: a.step,
                            asset: a.lastLooseOrder.asset
                        }
                    }
                })
            } else if (b.profit < a.instructions.minProfit) {
                switch (a.instructions.actionDecreaseProfit) {
                    case "newAsset":
                        this.state = `waitingSignal:all:${a.instructions.expiration}`;
                        break;
                    case "awaitProfit":
                        this.state = `waitingSignal:${a.lastLooseOrder.asset}:${a.instructions.expiration}`;
                        break;
                    case "stop":
                        this.runEvent("tradeSeriesclose", !0)
                }
                await this.Expert.addIteamLogsBook("note", {
                    log: {
                        mark: ["logsBook.tradeSeries", "logsBook.applyMartingalProfitDecreased", `logsBook.${a.instructions.actionDecreaseProfit}`],
                        parms: {
                            tsid: this.signalID,
                            step: a.step,
                            asset: a.lastLooseOrder.asset
                        }
                    }
                })
            } else {
                switch (a.instructions.direction) {
                    case "previous":
                        var g = this.lastSignalAction;
                        break;
                    case "contrPrevious":
                        g =
                            "call" == this.lastSignalAction ? "put" : "call";
                        break;
                    case "newSignals":
                        this.state = `waitingSignal:all:${a.instructions.expiration}`;
                        return
                }
                await this.signalExpert(a.lastLooseOrder.asset, g) && this.Expert.Trader.saveExpertsClasses();
                return !0
            }
        }
    }
    async actionWin() {
        this.runEvent("tradeSeriesclose", !0)
    }
}
class Order {
    on(b, a, c) {
        "undefined" == typeof this.subscription[b] && (this.subscription[b] = {});
        this.subscription[b][a] = c;
        return !0
    }
    runEvent(b, a) {
        for (let c in this.subscription[b]) this.subscription[b][c](a), "unique" == c && delete this.subscription[b]
    }
    constructor(b, a) {
        this.subscription = {};
        this.TradeSeries = b;
        this.Expert = this.TradeSeries.Expert;
        this.trader = this.Expert.Trader;
        this.requestId = a.requestId || genDealId();
        this.state = "created";
        this.isClosed = !1;
        this.comments = [];
        this.session = this.Expert.session;
        this.tsID =
            this.TradeSeries.signalID;
        this.openTimestamp = this.trader.serverTime();
        this.isDemo = this.trader.isDemo;
        this.account\u0421urrency = "$";
        this.strategy = this.Expert.id;
        this.altStrategyName = "undefined" != typeof this.Expert.data.userTitle ? this.Expert.data.userTitle : platform.translation(this.Expert.data.title);
        this.profit = 0;
        this.setInterval = {};
        this.setTimeout = {};
        Object.assign(this, a);
        this.trader.ordersClass.push(this);
        this.TradeSeries.involvedAssets.includes(this.asset) || this.TradeSeries.involvedAssets.push(this.asset);
        "undefined" != typeof this.martingalData && (this.mstep = this.martingalData.step, this.setComent(["comments.openedMartingaleSettings"], {
            step: this.martingalData.step
        }));
        this.makeHistory();
        this.on("successopen", "unique", (c, g) => {
            this.isClosed || (this.clearDeal\u0421heckInterval(), this.state = "open", c.profit = 0, Object.assign(this, c), this.setComent(["comments.successopen"]), this.makeHistory(), this.runEvent("openOrder", this), this.stateAction())
        });
        this.on("successclose", "unique", async c => {
            this.isClosed = !0;
            this.state =
                "close";
            this.clearDeal\u0421heckInterval();
            this.TradeSeries.Expert.tradingResult += void 0 == c.profit ? 0 : c.profit;
            Object.assign(this, c);
            this.TradeSeries.Expert.checkTradingResult();
            this.setComent(["comments.successclose"], {
                profit: this.profit,
                "account\u0421urrency": this.account\u0421urrency
            });
            this.makeHistory();
            this.runEvent("closeOrder", this)
        });
        this.on("failopenOrder", "unique", c => {
            this.state = "error";
            this.isClosed = !0;
            this.clearDeal\u0421heckInterval();
            this.trader.ordersClass = this.trader.ordersClass.filter(g =>
                g.requestId != this.requestId);
            Object.assign(this, {
                errorData: c
            });
            this.TradeSeries.involvedAssets.filter(g => g != this.asset);
            this.setComent(["comments.failopenOrder"], {
                reason: platform.translation(`logsBook.errors.${c.error}`, c)
            });
            this.makeHistory();
            this.runEvent("failopenOrderOthers", this)
        });
        this.on("failCloseOrder", "unique", c => {
            this.state = "error";
            this.isClosed = !0;
            this.clearDeal\u0421heckInterval();
            this.trader.ordersClass = this.trader.ordersClass.filter(g => g.requestId != this.requestId);
            this.setComent(["comments.failCloseOrder"], {
                reason: platform.translation(`logsBook.errors.${c.error}`)
            });
            this.makeHistory();
            this.runEvent("failCloseOrderOthers", c)
        });
        this.on("strategyStopped", "unique", async () => {
            this.state = "undefined";
            this.isClosed = !0;
            this.clearDeal\u0421heckInterval()
        });
        this.stateAction()
    }
    stateAction() {
        try {
            switch (this.state) {
                case "created":
                    let b = this.trader.userLevel.maxOpenAmount;
                    this.amount > b && (this.Expert.addIteamLogsBook("note", {
                        log: {
                            mark: ["logsBook.tradeSeries", "logsBook.amountExceedsMaximumAllowed"],
                            parms: {
                                tsid: this.TradeSeries.signalID,
                                requestId: this.requestId,
                                amount: this.amount,
                                maxBet: b
                            }
                        }
                    }), this.amount = b);
                    this.trader.wsPlatform.emit("openOrder", {
                        asset: this.asset,
                        amount: this.amount,
                        action: this.action,
                        isDemo: this.isDemo,
                        requestId: this.requestId,
                        optionType: 100,
                        time: this.time
                    });
                    this.state = "waitingOpening";
                    this.timeExpected = this.trader.serverTime() + this.time;
                    this.setComent(["comments.requestOpenOrder"]);
                    this.makeHistory();
                    this.setInterval.dealControl = {
                        i: 0,
                        t: 0,
                        interval: null,
                        pause: !1
                    };
                    this.setInterval.dealControl.interval = setInterval(async () => {
                        this.setInterval.dealControl.t++;
                        if (!this.setInterval.dealControl.pause) {
                            this.setInterval.dealControl.i++;
                            if (3 < this.setInterval.dealControl.i) return this.runEvent("failopenOrder", {
                                error: "noInformationOpeningOrder"
                            });
                            this.setInterval.dealControl.pause = !0;
                            this.trader.triggerDealsList();
                            await this.Expert.addIteamLogsBook("note", {
                                log: {
                                    mark: ["logsBook.tradeSeries", "logsBook.noInformationOpenOrder"],
                                    parms: {
                                        tsid: this.TradeSeries.signalID,
                                        id: this.requestId,
                                        s: 3 * this.setInterval.dealControl.t
                                    }
                                }
                            });
                            this.setComent(["comments.noInformationOpenOrder"], {
                                s: 3 * this.setInterval.dealControl.t
                            });
                            this.makeHistory();
                            this.setInterval.dealControl.pause = await new Promise((a, c) => {
                                this.trader.wsPlatform.once("updateOpenedDeals", () => {
                                    a(!1)
                                })
                            })
                        }
                    }, 3E3);
                    this.runEvent("waitingOpeningOrder", this);
                    break;
                case "open":
                    this.setTimeout.waitClose = setTimeout(() => {
                        this.isClosed || (this.setInterval.dealControl = {
                            i: 0,
                            t: 0,
                            interval: null,
                            pause: !1
                        }, this.setInterval.dealControl.interval = setInterval(async () => {
                            if (this.isClosed) return clearInterval(this.setInterval.dealControl.interval);
                            this.setInterval.dealControl.t = this.trader.serverTime() - (this.openTimestamp + this.time);
                            if (!this.setInterval.dealControl.pause) {
                                this.setInterval.dealControl.i++;
                                if (3 < this.setInterval.dealControl.i && 60 < this.setInterval.dealControl.t) return this.runEvent("failCloseOrder", {
                                    id: this.id,
                                    requestId: this.requestId,
                                    error: "noInformationCloseOrder"
                                });
                                this.setInterval.dealControl.pause = !0;
                                this.trader.triggerDealsList();
                                await this.Expert.addIteamLogsBook("note", {
                                    log: {
                                        mark: ["logsBook.tradeSeries", "logsBook.noInformationCloseOrder"],
                                        parms: {
                                            tsid: this.TradeSeries.signalID,
                                            id: this.id.slice(-12),
                                            requestId: this.requestId,
                                            s: this.setInterval.dealControl.t
                                        }
                                    }
                                });
                                this.setComent(["comments.noInformationCloseOrder"], {
                                    s: this.setInterval.dealControl.t
                                });
                                this.makeHistory();
                                this.setInterval.dealControl.pause = await new Promise((a, c) => {
                                    this.trader.wsPlatform.once("updateClosedDeals", () => {
                                        a(!1)
                                    })
                                })
                            }
                        }, 3E3))
                    }, 1E3 * (this.openTimestamp + this.time - this.trader.serverTime()))
            }
        } catch (b) {}
    }
    async makeHistory() {
        try {
            let b = ["TradeSeries", "Expert", "trader", "subscription"],
                a = JSON.stringify(this, (c, g) => {
                    if (!b.includes(c)) return g
                });
            a = JSON.parse(a);
            await chrome.runtime.sendMessage({
                sender: "expert",
                event: "makeHistory",
                data: a
            })
        } catch (b) {
            await this.Expert.addIteamLogsBook("note", {
                log: {
                    mark: ["logsBook.errorMakeHistory"],
                    parms: {
                        reason: b,
                        id: this.id || this.requestId
                    }
                }
            })
        }
    }
    setComent(b, a = {}) {
        this.comments.push({
            date: Math.round(Date.now() / 1E3),
            mark: b,
            parms: a
        })
    }
    "clearDeal\u0421heckInterval"() {
        clearTimeout(this.setTimeout.waitClose);
        this.setInterval.dealControl && (clearInterval(this.setInterval.dealControl.interval),
            this.setInterval.dealControl.i = 0)
    }
};