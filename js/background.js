'use strict';
const DEFAULT_STORAGE = {
    app: {
        id: chrome.runtime.id,
        version: null,
        affiliate: null,
        tabsId: {
            platform: null,
            panel: null,
            panelTab: null
        },
        language: "ru"
    },
    platform: {
        serverTimeZoneOffset: 0,
        userTimeZoneOffset: 0,
        uid: 0,
        email: "",
        balances: {
            demo: "-",
            real: "-"
        }
    },
    "platform\u0421onnection": {
        "base-url": null,
        "cookie-domain": null,
        tabId: null,
        url: null,
        cookies: []
    },
    banningNotifications: [],
    events: [],
    system: {
        display: {
            workArea: {
                height: 600,
                left: 0,
                top: 0,
                width: 1200
            }
        }
    },
    configuration: void 0,
    languages: void 0,
    isDisableTradingPanell: !1,
    lastTimeNotification: 0,
    isReglink: !1,
    timestampUpdateStatistics: null,
    strategies: [],
    availableAssets: [],
    runningStrategies: [],
    recoveryExpertData: [],
    runningStrategiesSession: [],
    tronApp: {
        password: null,
        sumErrInpassword: 0,
        selectedAddress: null,
        address: [],
        addressBook: []
    }
};
let logsBook = [],
    historyQueue = [],
    eventsQueue = [],
    wsPlatformUrl, checkwsPlatformUrlPause = !1,
    servise = {
        history: {
            deals: {},
            curentPart: 0
        },
        logsBook: {
            curentPart: 0
        }
    },
    runningStrategies, runningStrategiesSession;
chrome.runtime.lasterror = a => {};
chrome.webRequest.onResponseStarted.addListener(async a => {
    !checkwsPlatformUrlPause && (await chrome.storage.local.get("configuration")).configuration.appData.wsPlatformHosts.filter(c => a.url.indexOf(c) + 1 && !(a.url.indexOf("secondary") + 1)).length && (wsPlatformUrl = a.url, checkwsPlatformUrlPause = !0, setTimeout(() => {
        checkwsPlatformUrlPause = !1
    }, 1E3))
}, {
    urls: ["wss://*:*/socket.io/*"]
}, ["responseHeaders"]);
chrome.runtime.onInstalled.addListener(async a => {
    let c = indexedDB.open("pocketOptionRobot", 1);
    c.onupgradeneeded = function() {
        var e = c.result,
            f = e.createObjectStore("logsbook", {
                autoIncrement: !0
            });
        f.createIndex("expertId_idx", "expertId");
        f.createIndex("session_idx", "session");
        f = e.createObjectStore("history", {
            keyPath: "requestId"
        });
        f.createIndex("openTimestamp_idx", "openTimestamp");
        f.createIndex("requestId_idx", "requestId");
        e = e.createObjectStore("notifications", {
            keyPath: "id"
        });
        e.createIndex("timestamp_idx",
            "timestamp");
        e.createIndex("requestId_idx", "id")
    };
    if (a.reason == "update" && a.previousVersion == "6.0.8") {
        try {
            a.lastAffiliate = +(await chrome.storage.local.get("plagin")).plagin.setting.service_setings.affiliate_id
        } catch {
            a.lastAffiliate = 0
        }
        a.reason = "install";
        await chrome.storage.local.clear()
    }
    await buildStorage();
    let b = await updateMainConfiguration(),
        d = (await chrome.storage.local.get("app")).app;
    try {
        let e = await chrome.windows.get(d.tabsId.panel);
        chrome.windows.remove(e.id)
    } catch {}
    switch (a.reason) {
        case "install":
            d.version =
                chrome.runtime.getManifest().version;
            d.affiliate = +await getAffId(a.lastAffiliate);
            await chrome.storage.local.set({
                app: d
            });
            await chrome.storage.local.set({
                availableAssets: b.availableAssets
            });
            await chrome.storage.local.set({
                strategies: b.shop.filter(e => e.category == "strategy").map(e => e.data)
            });
            break;
        case "update":
            d.version = chrome.runtime.getManifest().version, d.id = chrome.runtime.id
    }
    await chrome.storage.local.set({
        app: d
    })
});
chrome.runtime.onConnect.addListener(a => {
    a.onMessage.addListener(async c => {
        switch (c.event) {
            case "platformIsReady":
                await chrome.storage.local.set({
                    isDisableTradingPanell: !1
                })
        }
    });
    a.onDisconnect.addListener(async c => {
        await chrome.storage.local.set({
            isDisableTradingPanell: !1
        })
    })
});
chrome.runtime.onMessage.addListener((a, c, b) => {
    switch (a.event) {
        case "openPanel":
            openRobotPanel().then(() => {
                b(!0)
            }).catch(() => {
                b(!1)
            });
            break;
        case "connectionRequest":
            connectionRequest(c, a).then(d => {
                b(d)
            }).catch(d => {
                b(!1)
            });
            break;
        case "changeAppLanguage":
            changeAppLanguage(a).then(d => {
                b(d)
            }).catch(() => {
                b(!1)
            });
            break;
        case "changeStrategyStatus":
            changeStrategyStatus(a).then(d => {
                b(d)
            }).catch(() => {
                b(!1)
            });
            break;
        case "ledgerPair":
            (async () => {
                let d = {},
                    e = await chrome.tabs.create({
                        url: "../html/ledger/index.html"
                    });
                await chrome.windows.update(e.windowId, {
                    state: "maximized"
                });
                try {
                    await pause(500);
                    let f = await chrome.tabs.sendMessage(e.id, {
                        event: "initPAir"
                    });
                    await chrome.tabs.remove(e.id);
                    d.completed = !0;
                    d.address = f;
                    b(d)
                } catch (f) {
                    d.completed = !1, d.error = chrome.runtime.error, b(d), await chrome.tabs.remove(e.id)
                }
                try {
                    let f = (await chrome.storage.local.get("app")).app;
                    await chrome.windows.get(f.tabsId.panel);
                    await chrome.windows.update(f.tabsId.panel, {
                        focused: !0
                    })
                } catch (f) {}
            })().catch(() => {});
            break;
        case "addLogEntry":
            logsBook.push(a.data);
            b(!0);
            break;
        case "clearStrategyLogsbook":
            logsBook.push({
                clear: !0,
                expertId: a.data.strategyId
            });
            b(!0);
            break;
        case "makeHistory":
            c = a.data;
            historyQueue.push(c);
            c.is\u0421learHistory ? c.sendResponse = b : b(!0);
            break;
        case "openTab":
            (async () => {
                try {
                    let d = (await chrome.storage.local.get("app")).app,
                        e = new URL(a.url),
                        f = new URLSearchParams(e.search);
                    f.append("lang", d.language || "ru");
                    e.search = f.toString();
                    a.url = e.href;
                    a.isReglink && (await chrome.storage.local.set({
                        isReglink: !0
                    }), setTimeout(async () => {
                            await chrome.storage.local.set({
                                isReglink: !1
                            })
                        },
                        15E3), await clearDataPlatforms());
                    await chrome.tabs.create({
                        url: a.url
                    })
                } catch {}
                b(!0)
            })();
            break;
        case "getPlatformData":
            chrome.storage.local.get("platform").then(b).catch(b);
            break;
        case "updateCache":
            updateCache(a.path, a.data).then(b).catch(b);
            break;
        case "updateMainConfiguration":
            updateMainConfiguration().then(b).catch(b);
            break;
        case "addBanningNotifications":
            (async () => {
                try {
                    let d = a.id,
                        e = a.uid,
                        f = (await chrome.storage.local.get("banningNotifications")).banningNotifications,
                        g = f.find(h => h.id == d);
                    g || (g = {
                        id: d,
                        uidList: []
                    }, f.push(g));
                    e && !g.uidList.includes(e) && g.uidList.push(e);
                    await chrome.storage.local.set({
                        banningNotifications: f
                    });
                    b(!0)
                } catch (d) {
                    b(!1)
                }
            })();
            break;
        case "addEvents":
            eventsQueue.push(a.data);
            b(!0);
            break;
        case "cookiesRemove":
            (async () => {
                try {
                    await chrome.cookies.remove({
                        name: a.name,
                        url: a.url
                    }), b(!0)
                } catch (d) {
                    b(!1)
                }
            })();
            break;
        case "getWsServerPlatformPriority":
            b(wsPlatformUrl)
    }
    return !0
});
chrome.tabs.onRemoved.addListener(async a => {
    let c = (await chrome.storage.local.get("app")).app;
    switch (a) {
        case c.tabsId.platform:
            chrome.action.setIcon({
                path: "../img/logo_128_disbl.png"
            });
            c.tabsId.platform = null;
            break;
        case c.tabsId.panelTab:
            c.tabsId.panelTab = null
    }
    await chrome.storage.local.set({
        app: c
    })
});
chrome.action.onClicked.addListener(async a => {
    await openRobotPanel()
});
chrome.storage.onChanged.addListener(async (a, c) => {
    let b = a[Object.keys(a)[0]].newValue,
        d = a[Object.keys(a)[0]].oldValue;
    if (d) try {
        switch (Object.keys(a)[0]) {
            case "runningStrategiesSession":
                var e = b.filter(h => d.find(l => l.strategyId == h.strategyId) == void 0).map(h => ({
                    action: "runrunning",
                    strategyId: h.strategyId,
                    session: h.session
                })).concat(d.filter(h => b.find(l => l.strategyId == h.strategyId) == void 0).map(h => ({
                    action: "stopped",
                    strategyId: h.strategyId,
                    session: h.session
                })));
                for (var f = 0; f < e.length; f++) {
                    let h = e[f];
                    switch (h.action) {
                        case "runrunning":
                            await addLogEntry({
                                initiator: "expert",
                                data: {
                                    event: "launch",
                                    session: h.session,
                                    strategy: await strategySettings(h.strategyId)
                                }
                            });
                            break;
                        case "stopped":
                            a = [];
                            var g = (await chrome.storage.local.get("recoveryExpertData")).recoveryExpertData.filter(k => k.session == h.session);
                            c = {};
                            let l = [];
                            for (let k = 0; k < 2; k++) {
                                c[k] = "0.00";
                                let m = g.find(n => n.isDemo == k);
                                m != void 0 && (m = JSON.parse(m.iso), c[k] = m.tradingResult.toFixed(2), a = a.concat(m.tradeSeries.reduce((n, p) => n.concat(p.orders.filter(q =>
                                    !q.isClosed)), [])), l = l.concat(m.tradeSeries))
                            }
                            await addLogEntry({
                                initiator: "expert",
                                data: {
                                    tradeResult: c,
                                    event: "stopped",
                                    session: h.session,
                                    strategy: {
                                        id: h.strategyId
                                    }
                                }
                            });
                            a.forEach(async k => {
                                k.state = "undefined";
                                k.isClosed = !0;
                                k.comments.push({
                                    date: Math.round(Date.now() / 1E3),
                                    mark: ["comments.strategyStopped"],
                                    parms: {}
                                });
                                historyQueue.push(k);
                                try {
                                    await chrome.runtime.sendMessage({
                                        sender: "expert",
                                        event: "makeHistory",
                                        data: k
                                    })
                                } catch {}
                                logsBook.push({
                                    type: "expert:note",
                                    session: k.session,
                                    expertId: k.strategy,
                                    timestamp: Math.round(Date.now() /
                                        1E3),
                                    log: {
                                        mark: ["logsBook.tradeSeries", "logsBook.strategyStopped", "logsBook.dealEscortStopped"],
                                        parms: {
                                            tsid: k.tsID,
                                            id: k.id != void 0 ? k.id.slice(-12) : k.requestId,
                                            requestId: k.requestId
                                        }
                                    },
                                    anyData: {}
                                })
                            });
                            l.forEach(async k => {
                                logsBook.push({
                                    type: "expert:note",
                                    session: k.expertSession,
                                    expertId: k.expertID,
                                    timestamp: Math.round(Date.now() / 1E3),
                                    log: {
                                        mark: ["logsBook.tradeSeries", "logsBook.strategyStopped", "logsBook.tradeSeriesEscortStopped"],
                                        parms: {
                                            tsid: k.signalID
                                        }
                                    },
                                    anyData: {}
                                })
                            })
                    }
                }
                break;
            case "strategies":
                for (b =
                    await Promise.all(b.map(async h => await strategySettings(h))), d = await Promise.all(d.map(async h => await strategySettings(h))), e = ["assets", "indicatorsSetings", "regulationsSetings", "martingaleSetings"], runningStrategiesSession = (await chrome.storage.local.get("runningStrategiesSession")).runningStrategiesSession, g = 0; g < b.length; g++) {
                    let h = b[g];
                    f = runningStrategiesSession.find(m => m.strategyId == h.id);
                    let l = d.find(m => m.id == h.id);
                    if (!f || !l) continue;
                    let k = {};
                    e.forEach(m => {
                        JSON.stringify(h[m]) != JSON.stringify(l[m]) &&
                            (k[m] = h[m])
                    });
                    await addLogEntry({
                        initiator: "expert",
                        data: {
                            event: "changes",
                            session: f.session,
                            strategy: {
                                id: h.id
                            },
                            anyData: k
                        }
                    })
                }
        }
    } catch (h) {}
});
chrome.webRequest.onErrorOccurred.addListener(async a => {
    try {
        var c = (await chrome.storage.local.get("platform\u0421onnection")).platform\u0421onnection;
        if (c["base-url"] && a.type == "main_frame" && a.url.indexOf(c["base-url"]) + 1) {
            let b = new URL(c.url),
                d = new URL(await platformUrl());
            if (b.hostname != d.hostname) {
                let e = c.cookies.map(f => ({
                    domain: `.${d.hostname}`,
                    expirationDate: f.expirationDate,
                    httpOnly: f.httpOnly,
                    name: f.name,
                    path: f.path,
                    sameSite: f.sameSite,
                    secure: f.secure,
                    storeId: f.storeId,
                    url: d.origin,
                    value: f.value
                }));
                for (c = 0; c < e.length; c++) await chrome.cookies.set(e[c]);
                b.hostname = d.hostname;
                await chrome.tabs.update(a.tabId, {
                    url: b.href
                })
            }
        }
        return !0
    } catch (b) {
        return !1
    }
}, {
    urls: ["https://*/*"]
}, ["extraHeaders"]);
async function platformUrl() {
    try {
        let a = (await chrome.storage.local.get("configuration")).configuration,
            c = await fetch(a.affiliateData.regDomains);
        if (c.status != 200) throw !1;
        return c.url
    } catch {
        return !1
    }
}

function objectAssign(a, c) {
    var b = c;
    c = [];
    var d = [];
    for (let f = 0; f < 1E3; f++) {
        for (var e in b)
            if (e != "path")
                if (typeof b[e] == "object" && b[e] != null && b[e].length == void 0) d.push(Object.assign(b[e], {
                    path: `${b.path == void 0 ? "" : `${b.path}->`}${e}`
                }));
                else {
                    let g = [],
                        h = typeof b.path != "undefined" ? b.path.split("->") : [];
                    for (let l = 0; l < h.length; l++) g.push(h[l]);
                    g.push(e);
                    c.push({
                        path: g,
                        val: b[e]
                    })
                } if (d.length == 0) break;
        b = d.shift()
    }
    for (e = 0; e < c.length; e++) {
        b = 0;
        d = a;
        try {
            for (; b + 1 < c[e].path.length; b++) {
                if (typeof d[c[e].path[b]] ==
                    "undefined") throw "";
                d = d[c[e].path[b]]
            }
            typeof d[c[e].path[b]] != "undefined" && (d[c[e].path[b]] = c[e].val)
        } catch (f) {}
    }
}
async function updateCache(a, c) {
    try {
        let b = (await chrome.storage.local.get("cache")).cache;
        b[a] = c;
        await chrome.storage.local.set({
            cache: b
        });
        return !0
    } catch {
        return !1
    }
}
async function strategySettings(a) {
    return new Promise(async (c, b) => {
        let d;
        try {
            d = typeof a == "object" ? a : (await chrome.storage.local.get("strategies")).strategies.find(e => e.id == a);
            if (d == void 0) throw "strategies not exist";
            d.indicatorsSetings = d.indicators.map(e => ({
                id: e.id,
                indparms: e.settings.filter(f => f.id != "signalUp" && f.id != "signalDown").reduce((f, g) => ({
                    ...f,
                    [g.id]: isNaN(+g.value) ? g.value : +g.value
                }), {}),
                conditions: e.settings.filter(f => f.id == "signalUp" || f.id == "signalDown").reduce((f, g) => ({
                    ...f,
                    [g.id]: g.value
                }), {})
            }));
            d.martingaleSetings = d.martingale.map(e => e.reduce((f, g) => ({
                ...f,
                [g.id]: isNaN(+g.value) ? g.value : +g.value
            }), {}));
            d.regulationsSetings = d.regulations.reduce((e, f) => ({
                ...e,
                [f.id]: isNaN(+f.value) ? f.value : +f.value
            }), {});
            c(d)
        } catch (e) {
            b(e)
        }
    })
}
async function openRobotPanel() {
    let a = (await chrome.storage.local.get("system")).system,
        c = (await chrome.storage.local.get("app")).app;
    try {
        await chrome.windows.get(c.tabsId.panel);
        await chrome.windows.update(c.tabsId.panel, {
            focused: !0
        });
        return
    } catch (d) {}
    var b = await chrome.system.display.getInfo();
    b = b.find(d => d.activeState == "active");
    b != void 0 && Object.assign(a, {
        display: b
    });
    b = {
        url: "../html/panel.html",
        type: "popup"
    };
    b.width = 1E3 > a.display.workArea.width ? a.display.workArea.width : 1E3;
    b.height = 800 > a.display.workArea.height ?
        a.display.workArea.height : 800;
    b.top = Math.round(a.display.workArea.height / 2 - b.height / 2);
    b.left = Math.round(a.display.workArea.width / 2 - b.width / 2);
    b = await chrome.windows.create(b);
    c.tabsId.panel = b.id;
    c.tabsId.panelTab = b.tabs[0].id;
    await chrome.storage.local.set({
        system: a
    });
    await chrome.storage.local.set({
        app: c
    })
}
async function get(a) {
    a = await fetch(a);
    if (a.status != 200) throw Error("Incorrect server response");
    return await a.json()
}
async function post(a, c, b = {}) {
    a = await fetch(a, {
        method: "post",
        headers: Object.assign({
            Accept: "application/json",
            "Content-Type": "application/json"
        }, b),
        body: JSON.stringify(c)
    });
    if (a.status != 200) throw Error("Incorrect server response ");
    return await a.json()
}
async function updateMainConfiguration() {
    let a = (await chrome.storage.local.get("configuration")).configuration;
    a || await chrome.storage.local.set({
        configuration: a = await get("../json/configuration.json")
    });
    let c = (await chrome.storage.local.get("languages")).languages;
    if (!c) {
        c = {};
        for (var b = 0; b < a.availableLanguages.length; b++) {
            var d = a.availableLanguages[b];
            try {
                c[d.id] = await get(`../json/languages/${d.id}.json`)
            } catch {}
        }
        await chrome.storage.local.set({
            languages: c
        })
    }
    try {
        let f = await get(`../json/configuration.json?t=${Math.round(Date.now() /
            1E3)}`);
        f.version > a.version && (a = f, await chrome.storage.local.set({
            configuration: a
        }));
        b = !1;
        for (d = 0; d < a.availableLanguages.length; d++) {
            var e = await get(`../json/languages/${a.availableLanguages[d].id}.json`);
            if (!c[a.availableLanguages[d].id] || e.version > c[a.availableLanguages[d].id].version) b = !0, c[a.availableLanguages[d].id] = e
        }
        for (let g in c) a.availableLanguages.find(h => h.id == g) || (b = !0, delete c[g]);
        b && await chrome.storage.local.set({
            languages: c
        })
    } catch (f) {}
    try {
        let f = {
                type: "configurationVersion",
                uid: (await chrome.storage.local.get("platform")).platform.uid ||
                    void 0,
                lastTimeNotification: (await chrome.storage.local.get("lastTimeNotification")).lastTimeNotification
            },
            g = await post(a.appData.robotApiServer, f);
        g.v > a.version && (a = await get(`${a.appData.updateDomain}/extension/json/configuration.json?t=${Math.round(Date.now() / 1E3)}`), await chrome.storage.local.set({
            configuration: a
        }));
        e = !1;
        for (b = 0; b < g.languages.length; b++) {
            let h = g.languages[b];
            if (!c[h.id] || h.v > c[h.id].version) e = !0, c[h.id] = await get(`${a.appData.updateDomain}/extension/json/languages/${h.id}.json?t=${Math.round(Date.now() /
                1E3)}`)
        }
        for (let h in c) a.availableLanguages.find(l => l.id == h) || (e = !0, delete c[h]);
        g.notifications.length > 0 && await new Promise(async (h, l) => {
            try {
                let k = indexedDB.open("pocketOptionRobot", 1);
                k.onsuccess = async () => {
                    let m = k.result.transaction("notifications", "readwrite").objectStore("notifications");
                    for (let n = 0; n < g.notifications.length; n++) {
                        let p = g.notifications[n];
                        eventsQueue.push({
                            id: "notification",
                            data: p.id
                        });
                        await new Promise((q, r) => {
                            m.put(p).onsuccess = q
                        });
                        f.lastTimeNotification = Math.round(p.timestamp /
                            1E3)
                    }
                    h(!0)
                }
            } catch (k) {
                h(!1)
            }
        });
        e && await chrome.storage.local.set({
            languages: c
        });
        await chrome.storage.local.set({
            lastTimeNotification: f.lastTimeNotification
        })
    } catch (f) {
        console.log("updateMainConfiguration", f)
    }
    return a
}
async function connectionRequest(a, c) {
    var b = (await chrome.storage.local.get("app")).app;
    await chrome.scripting.insertCSS({
        target: {
            tabId: a.tab.id,
            allFrames: !0
        },
        css: `
        @charset "utf-8";
        @font-face{
            font-family:FontAwesomeMod;
            font-style:normal;
            font-weight:400;
            src:url('${chrome.runtime.getURL("font/fontawesome-webfont.eot")}');
            src:url('${chrome.runtime.getURL("font/fontawesome-webfont.eot?#iefix&v=4.7.0")}') format("embedded-opentype"),
            url('${chrome.runtime.getURL("font/fontawesome-webfont.woff2")}') format("woff2"),
            url('${chrome.runtime.getURL("font/fontawesome-webfont.woff")}') format("woff"),
            url('${chrome.runtime.getURL("font/fontawesome-webfont.ttf")}') format("truetype"),
            url('${chrome.runtime.getURL("font/fontawesome-webfont.svg#fontawesomeregular")}') format("svg")
        }
    `
    });
    await chrome.scripting.insertCSS({
        target: {
            tabId: a.tab.id,
            allFrames: !1
        },
        files: ["css/platform.css"]
    });
    await chrome.scripting.executeScript({
        target: {
            tabId: a.tab.id,
            allFrames: !1
        },
        files: ["js/libraries/jquery.js", "js/libraries/momentjs.js", "js/platform.js"]
    });
    if (b.tabsId.platform != a.tab.id) try {
        return await chrome.tabs.get(b.tabsId.platform), !1
    } catch (d) {
        b.tabsId.platform = a.tab.id, await chrome.storage.local.set({
            app: b
        })
    }
    await chrome.storage.local.set({
        isDisableTradingPanell: !0
    });
    try {
        if (!(a.url && a.url &&
                a.tab.id && c.userData["base-url"] && c.userData["cookie-domain"])) throw !0;
        b = {};
        b.url = a.url;
        b.tabId = a.tab.id;
        b["base-url"] = c.userData["base-url"];
        b["cookie-domain"] = c.userData["cookie-domain"];
        b.cookies = await chrome.cookies.getAll({
            domain: b["cookie-domain"]
        });
        await chrome.storage.local.set({
            ["platform\u0421onnection"]: b
        })
    } catch {}
    chrome.action.setIcon({
        path: "../img/logo_128.png"
    });
    await chrome.scripting.executeScript({
        target: {
            tabId: a.tab.id,
            allFrames: !1
        },
        files: ["js/libraries/socket.js", "js/expert.js"]
    });
    return !0
}
async function changeAppLanguage(a) {
    let c = (await chrome.storage.local.get("app")).app;
    c.language = a.value;
    await chrome.storage.local.set({
        app: c
    });
    return !0
}
async function changeStrategyStatus(a) {
    runningStrategies = (await chrome.storage.local.get("runningStrategies")).runningStrategies;
    runningStrategiesSession = (await chrome.storage.local.get("runningStrategiesSession")).runningStrategiesSession || [];
    let c = "";
    switch (a.data.strategyStatus) {
        case "on":
            if (runningStrategies.includes(a.data.strategyId)) return "trade";
            runningStrategies.push(a.data.strategyId);
            runningStrategiesSession.push({
                session: a.data.session,
                strategyId: a.data.strategyId
            });
            c = "trade";
            break;
        case "off":
            if (!runningStrategies.includes(a.data.strategyId)) return "stoped";
            runningStrategies = runningStrategies.filter(b => b != a.data.strategyId);
            runningStrategiesSession = runningStrategiesSession.filter(b => b.strategyId != a.data.strategyId);
            c = "stoped"
    }
    await chrome.storage.local.set({
        runningStrategies
    });
    await chrome.storage.local.set({
        runningStrategiesSession
    });
    runningStrategies.length == 0 && setTimeout(async () => {
        await chrome.storage.local.set({
            recoveryExpertData: []
        })
    }, 500);
    return c
}
async function buildStorage() {
    let a = JSON.parse(JSON.stringify(DEFAULT_STORAGE));
    objectAssign(a, await chrome.storage.local.get());
    for (let c in a) await chrome.storage.local.set({
        [c]: a[c]
    })
}
async function clearDataPlatforms() {
    try {
        let a = (await chrome.cookies.getAll({
            name: "ci_session"
        })).map(d => d.domain).concat((await chrome.cookies.getAll({
            name: "af_message"
        })).map(d => d.domain));
        a = [...(new Set(a))];
        let c = [];
        for (let d = 0; d < a.length; d++) {
            let e = await chrome.cookies.getAll({
                domain: a[d]
            });
            for (let f = 0; f < e.length; f++) {
                let g = e[f];
                c.includes(`https://${g.domain.replace(/^\./, "")}`) || c.push(`https://${g.domain.replace(/^\./, "")}`);
                await chrome.cookies.remove({
                    name: g.name,
                    url: `https://${g.domain.replace(/^\./,
                        "")}${g.path}`
                })
            }
        }
        let b = (await chrome.windows.getAll({
            populate: !0
        })).reduce((d, e) => [...d, ...e.tabs.filter(f => c.find(g => f.url.indexOf(g) + 1)).map(f => f.id)], []);
        await chrome.tabs.remove(b);
        return !0
    } catch {
        return !1
    }
}
async function getAffId(a) {
    async function c(b) {
        b = new URL(b);
        let d = {
            url: b.href
        };
        try {
            Object.assign(d, JSON.parse(`{"${decodeURI(b.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`))
        } catch (e) {}
        return d
    }
    if (a) return a;
    try {
        let b = await chrome.history.search({
            text: chrome.runtime.id
        });
        for (a = 0; a < b.length; a++) {
            let d = await c(b[a].url);
            if (typeof d.name != "undefined" && typeof d.affiliate != "undefined" && d.name == "pocketoptionrobot") return d.affiliate
        }
    } catch (b) {}
    return 0
}
async function pause(a) {
    return new Promise((c, b) => {
        setTimeout(() => {
            c(!0)
        }, a)
    })
}
async function addLogEntry(a) {
        let c = Math.round(Date.now() / 1E3);
        switch (a.initiator) {
            case "expert":
                switch (a.data.event) {
                    case "launch":
                        logsBook.push({
                            clear: !0,
                            expertId: a.data.strategy.id
                        });
                        logsBook.push({
                            type: "expert:launch",
                            session: a.data.session,
                            expertId: a.data.strategy.id,
                            timestamp: c,
                            log: {},
                            anyData: {
                                assets: a.data.strategy.assets,
                                indicatorsSetings: a.data.strategy.indicatorsSetings,
                                martingaleSetings: a.data.strategy.martingaleSetings,
                                regulationsSetings: a.data.strategy.regulationsSetings
                            }
                        });
                        break;
                    case "stopped":
                        logsBook.push({
                            type: "expert:stopped",
                            session: a.data.session,
                            expertId: a.data.strategy.id,
                            timestamp: c,
                            log: {
                                mark: ["logsBook.stoppedExpert"],
                                parms: a.data.tradeResult
                            },
                            anyData: {}
                        });
                        break;
                    case "changes":
                        logsBook.push({
                            type: "expert:changes",
                            session: a.data.session,
                            expertId: a.data.strategy.id,
                            timestamp: c,
                            log: {
                                mark: ["logsBook.changedAssetsList"],
                                parms: {}
                            },
                            anyData: a.data.anyData
                        })
                }
        }
    }
    (async () => {
        (async () => {
            for (;;) try {
                if (historyQueue.length == 0) {
                    await pause(100);
                    continue
                }
                let a = [];
                Date.now();
                let c = historyQueue.length,
                    b = historyQueue.splice(0, c);
                await new Promise(async (d, e) => {
                    let f = indexedDB.open("pocketOptionRobot", 1);
                    f.onsuccess = async () => {
                        let g = f.result.transaction("history", "readwrite").objectStore("history");
                        for (let h = 0; h < c; h++) {
                            let l = b[h];
                            l.is\u0421learHistory ? (await new Promise((k, m) => {
                                let n = g.index("openTimestamp_idx").getAllKeys(IDBKeyRange.bound(l.from, l.to, !0));
                                n.onsuccess =
                                    function() {
                                        n.result.forEach(p => {
                                            g.delete(p)
                                        });
                                        k(!0)
                                    }
                            }), a.push(l.sendResponse)) : await new Promise((k, m) => {
                                g.put(l).onsuccess = k
                            })
                        }
                        d(!0)
                    }
                });
                a.forEach(d => {
                    d(!0)
                });
                await pause(2E3)
            } catch (a) {}
        })();
        (async () => {
            for (;;) try {
                if (logsBook.length == 0) {
                    await pause(100);
                    continue
                }
                Date.now();
                let a = logsBook.length,
                    c = logsBook.splice(0, a);
                await new Promise(async (d, e) => {
                    let f = indexedDB.open("pocketOptionRobot", 1);
                    f.onsuccess = async () => {
                        let g = f.result.transaction("logsbook", "readwrite").objectStore("logsbook");
                        for (let h = 0; h <
                            a; h++) {
                            let l = c[h];
                            l.clear ? await new Promise((k, m) => {
                                let n = g.index("expertId_idx").getAllKeys(l.expertId);
                                n.onsuccess = function() {
                                    n.result.forEach(p => {
                                        g.delete(p)
                                    });
                                    k(!0)
                                }
                            }) : await new Promise((k, m) => {
                                g.add(l).onsuccess = k
                            })
                        }
                        d(!0)
                    };
                    f.onerror = function() {
                        e(f.error)
                    }
                });
                let b = (await chrome.storage.local.get("app")).app;
                try {
                    b.tabsId.panelTab && await chrome.runtime.sendMessage({
                        sender: "background",
                        event: "logsBookNewDate"
                    })
                } catch (d) {}
                await pause(1E3)
            } catch (a) {}
        })();
        (async () => {
            for (;;) try {
                if (eventsQueue.length ==
                    0) {
                    await pause(1E3);
                    continue
                }
                let a = (await chrome.storage.local.get("events")).events,
                    c = eventsQueue.splice(0, eventsQueue.length);
                for (let b = 0; b < c.length; b++) {
                    let d = c[b],
                        e = a.find(f => f.id == d.id);
                    e || (e = {
                        id: d.id,
                        data: []
                    }, a.push(e));
                    d.delete ? typeof d.delete == "object" ? d.delete.forEach(f => {
                        e.data = e.data.filter(g => g != f)
                    }) : e.data = e.data.filter(f => f != d.delete) : e.data.push(d.data)
                }
                await chrome.storage.local.set({
                    events: a
                })
            } catch (a) {}
        })()
    })();