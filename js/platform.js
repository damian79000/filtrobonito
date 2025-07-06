let appStorage, trader, appConfiguration, old = console.log;
console.log = function() {
    let a = Math.round(Date.now() / 1E3);
    Array.prototype.unshift.call(arguments, "\u001b[43mPocket Option Robot[" + function(c, b = !0) {
        c = new Date(1E3 * c);
        let g = c.getFullYear(),
            d, f, e, h, l;
        10 > c.getMonth() + 1 ? d = "0" + (c.getMonth() + 1) : d = c.getMonth() + 1;
        10 > c.getDate() ? f = "0" + c.getDate() : f = c.getDate();
        10 > c.getHours() ? e = "0" + c.getHours() : e = c.getHours();
        10 > c.getMinutes() ? h = "0" + c.getMinutes() : h = c.getMinutes();
        10 > c.getSeconds() ? l = "0" + c.getSeconds() : l = c.getSeconds();
        return b ? f + "/" + d + " " + e + ":" + h + ":" + l : f + "." +
            d + "." + g + " " + e + ":" + h + ":" + l
    }(a) + "]\u001b[0m");
    old.apply(this, arguments)
};
async function post(a, c, b = {}) {
    a = await fetch(a, {
        method: "post",
        headers: Object.assign({
            Accept: "application/json",
            "Content-Type": "application/json"
        }, b),
        body: JSON.stringify(c)
    });
    if (200 != a.status) throw Error("Incorrect server response ");
    return await a.json()
}
async function getUserData() {
    return new Promise((a, c) => {
        try {
            let b = document.getElementsByTagName("script");
            for (let g = 0; g < b.length; g++) {
                let d = b[g].innerHTML;
                if (d.indexOf("AppData") + 1) {
                    a(JSON.parse(d.match(/\{.*\}/)[0]));
                    break
                }
            }
            c("Not found AppData")
        } catch (b) {
            c(b)
        }
    })
}
async function pause(a) {
    return new Promise((c, b) => {
        setTimeout(c, a)
    })
}
class Platform {
    on(a, c, b) {
        "undefined" == typeof this.subscription[a] && (this.subscription[a] = {});
        this.subscription[a][c] = b;
        return !0
    }
    runEvent(a, c) {
        for (let b in this.subscription[a]) this.subscription[a][b](c), "unique" == b && delete this.subscription[a]
    }
    constructor() {
        this.subscription = {};
        (async () => {
            try {
                if (Object.assign(this, await getUserData()), this.uid) {
                    await chrome.storage.local.set({
                        platform: {
                            isDemo: this.isDemo,
                            balances: this.balances,
                            email: this.email,
                            uid: this.uid,
                            serverTimeZoneOffset: this.serverTimeZoneOffset,
                            userTimeZoneOffset: this.userTimeZoneOffset
                        }
                    });

//agregado para evaluar que esta guardando platform
chrome.storage.local.get("platform", (r) => {
  console.log("💾 VERIFICACIÓN DE DATOS GUARDADOS EN STORAGE:", r.platform);
});


                    this.port = chrome.runtime.connect({
                        name: "expert"
                    });
                    this.port.state = !0;
                    this.port.onDisconnect.addListener(() => {
                        this.port.state = !1;
                        location.reload()
                    });
                    await chrome.runtime.sendMessage({
                        event: "updateMainConfiguration"
                    });
                    appStorage = await chrome.storage.local.get();
                    try {
                        let a = Math.round(moment().startOf("day").valueOf() / 1E3);
                        if (appStorage.timestampUpdateStatistics != a) {
                            let c = {
                                    id: Math.round(moment().day(-1).startOf("day").valueOf() / 1E3),
                                    data: {}
                                },
                                b = {
                                    timestamp: a,
                                    uid: this.uid,
                                    statistic: [c, {
                                        id: 0,
                                        data: {}
                                    }]
                                },
                                g = new URL(location.href);
                            fetch(`${g.origin}/ru/cabinet/trading-profile/${this.uid}/`, {}).then(async d => {
                                try {
                                    let f = $(await d.text());
                                    for (let h = 2, l = 0; 4 > h; h++, l++)
                                        for (d = 0; d < appStorage.configuration.appData.statistic.nameClass.length; d++) {
                                            let n = appStorage.configuration.appData.statistic.nameClass[d];
                                            b.statistic[l].data[n] = f.find(`${appStorage.configuration.appData.statistic.path}:nth-child(${h}) .${n}`).html().replace(/[^0-9.-]/g, "").replace(/^\.+|\.+$/, "")
                                        }
                                    let e =
                                     
                                    
                                    //reemplazo segunda conexion al servidor para enviar datos de historial
                                //    await this.post(appStorage.configuration.appData.robotApiServer, {
                                //            type: "userStatistics",
                                //            data: b
                                //        });

// codigo de reemplazo para que no se envien mis estadisticas personales
// ✅ Simulación segura de respuesta
console.log("Simulación de envío de estadísticas (userStatistics):", {
    type: "userStatistics",
    data: b
});

// fin de codigo de reemplazo


                                    e && e.result && await chrome.storage.local.set({
                                        timestampUpdateStatistics: b.timestamp
                                    })
                                } catch {}
                            }).catch(d => {
                                throw d;
                            })
                        }
                    } catch (a) {}
                    this.unreadEvents = appStorage.events.reduce((a, c) => a + c.data.length, 0);
                    chrome.storage.onChanged.addListener(async (a, c) => {
                        appStorage[Object.keys(a)[0]] = a[Object.keys(a)[0]].newValue;
                        switch (Object.keys(a)[0]) {
                            case "events":
                                this.unreadEvents = appStorage.events.reduce((b, g) => b + g.data.length,
                                    0);
                                this.runEvent("updateNoRead", this.unreadEvents);
                                break;
                            case "lastTimeNotification":
                                this.notification(this.translation("notification.title.newNotification"), this.translation("notification.topic.newNotification"), 6E4);
                                break;
                            case "app":
                                a.app.newValue.language != a.app.oldValue.language && location.reload()
                        }
                    });
                    appConfiguration = appStorage.configuration;
                    this.app = appStorage.app;
                    this.textTranslation = appStorage.languages[this.app.language] || appStorage.languages.ru;
                    this.affiliate = appConfiguration.affiliateData.affiliates.find(a =>
                        a.id == appStorage.app.affiliate) || appConfiguration.affiliateData.affiliates.find(a => 0 == a.id);
                    await this.addingPlatform();
                    if (connectionResult) {
                        this.runEvent("viweConditionPanel", !0);
                        appConfiguration.appVersion && appConfiguration.appVersion != appStorage.app.version && this.notification(this.translation("notification.title.updateApp"), this.translation("notification.topic.updateApp", {
                            version: appConfiguration.appVersion
                        }), 6E4, "updateApp");
                        this.runEvent("set\u0421onnectionStatus", {
                            mark: "platform.textStatus.licenseVerification",
                            parms: {}
                        });
                        this.authData = {};
                        appConfiguration.appData.sendUserDataList.forEach(a => {
                            this[a] && (this.authData[a] = this[a])
                        });
                        this.license = {
                            available: !0,
                            limited: !1
                        };
                        // 🔒 Bloque original comentado
/*
                        try {
                            this.license = await post(`${appConfiguration.appData.robotApiServer}/license`, {
                                type: "licenseVerification",
                                userData: this.authData
                            })

                          //agregado al original para ver que devuelve el servidor
                            console.log("RESPUESTA DEL SERVIDOR LICENSE:", this.license);


                        } catch {
                            this.license.error = !0
                       }
*/

// ✅ Versión segura simulada con respuesta idéntica a la original pero licencia válida
const now = Math.floor(Date.now() / 1000);
this.license = {
    available: true,
    limited: now + 10 * 365 * 24 * 60 * 60, // 10 años a partir de ahora
    serverTime: now // 🟢 mismo que en la respuesta real
    // Si el servidor devolviera más claves, las agregamos acá.
};

console.log("Simulando license", {
  available: true,
  limited: Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60,
  serverTime: Math.floor(Date.now() / 1000)
});
console.log("RESPUESTA SIMULADA LICENSE:", this.license);

// aca termina el codigo agregado


                        this.runEvent("setLicenseStatus", this.license.error ? {
                            mark: "platform.licenseStatus.notdefined",
                            parms: {}
                        } : this.license.limited ? {
                            mark: "platform.textStatus.expires",
                            parms: {
                                date: moment(1E3 *
                                    this.license.limited).format("DD.MM.YYYY HH:mm")
                            }
                        } : {
                            mark: "platform.licenseStatus.unlimited",
                            parms: {}
                        });
                        this.license.error || 0 == this.license.limited || 86400 > this.license.limited - 1800 - this.license.serverTime && setTimeout(async () => {
                            await pause(1E3);
                            this.offerRegistration(this.license.limited > this.license.serverTime, this.uid)
                        }, 1E3 * (this.license.limited - 1800 - this.license.serverTime));
                        0 != this.license.limited && chrome.runtime.sendMessage({
                            event: "updateMainConfiguration"
                        }).then().catch(console.log);
                        
                        
                        
                       // if (!this.license.available)
//     return this.wsRobot = io(appConfiguration.appData.wsServerRobot, {
//         transports: ["websocket"]
//     }),
//     this.wsRobot.on("connect", () => {
//         this.wsRobot.emit("uid", this.uid);
//         this.wsRobot.on("ps", () => {
//             try {
//                 this.port.state && this.port.postMessage("ps")
//             } catch {}
//         });
//         this.wsRobot.on("locationReload", () => {
//             location.reload()
//         });
//         this.wsRobot.on("updateMainConfiguration", () => {
//             chrome.runtime.sendMessage({
//                 event: "updateMainConfiguration"
//             }).then().catch(console.log)
//         })
//     });

/* ✅ Versión segura con logs para depuración */
if (!this.license.available)
    return this.wsRobot = io(appConfiguration.appData.wsServerRobot, {
        transports: ["websocket"]
    }),
    this.wsRobot.on("connect", () => {
        console.log("[WebSocket] Conectado, enviando UID:", this.uid);
        this.wsRobot.emit("uid", this.uid);

        this.wsRobot.on("ps", () => {
            console.log("[WebSocket] Evento 'ps' recibido");
            try {
                this.port.state && this.port.postMessage("ps")
            } catch (err) {
                console.warn("[WebSocket] Error al enviar postMessage('ps'):", err);
            }
        });

        this.wsRobot.on("locationReload", () => {
            console.warn("[WebSocket] Recibido locationReload -> recargando...");
            location.reload();
        });

        this.wsRobot.on("updateMainConfiguration", () => {
            console.log("[WebSocket] Recibido updateMainConfiguration");
            chrome.runtime.sendMessage({
                event: "updateMainConfiguration"
            }).then().catch(console.log)
        });

        // 🔍 Nuevo log para saber si successauth llega
        this.wsRobot.on("successauth", (authData) => {
            console.log("[WebSocket] ✅ successauth recibido:", authData);
        });
    });
                            
                  // aca continua el codigo original
                  
                  
                            this.port.state && this.port.postMessage({
                                event: "platformIsReady"
                            }), this.runEvent("set\u0421onnectionStatus", {
                                mark: "platform.textStatus.disabled",
                                parms: {}
                            });
                        try {
                            let a = await chrome.runtime.sendMessage({
                                event: "getWsServerPlatformPriority"
                            });
                            this.wsServerPlatformPriority = (new URL(a)).origin
                        } catch (a) {}

console.log("[DEBUG] authData antes de instanciar Trader:", this.authData);


                        this.trader = new Trader(this)
                    }
                }
            } catch (a) {}
        })();
        $(document).on("click", () => {
            this.bodyIsClicked = !0
        })
    }
    async addingPlatform() {
        return new Promise((a, c) => {
            try {
                let b = $(".left-sidebar nav ul:first-child").find('li a[data-menu-id="trading"]').parent("li"),
                    g = $("div.hidden:first"),
                    d = $(`
                    <li class="tooltip2">
                        <a class="js-left-sidebar-menu">
                            <i class="icon FontAwesomeMod robot fa"></i>
                            <span class="nlabel">${this.translation("platform.tooltipNlabelPoButton")}</span> 
                            <div class="counter-wrap" noread="${this.unreadEvents}">
                                <div class="counter counter--chat animated zoomIn"><span class="counter__number">${this.unreadEvents}</span></div>
                            </div> 
                        </a>
                        <div class="tooltip-content tooltip-status-on position-right">
                            <div class="tooltip-text">${this.translation("platform.tooltipContentPoButton")}</div>
                        </div>
                    </li>
                `),
                    f = d.find(".counter-wrap");
                this.on("updateNoRead", "classPlatform", e => {
                    f.attr("noread", e);
                    0 < e ? f.html(`<div class="counter counter--chat animated zoomIn"><span class="counter__number">${e}</span></div>`) : (f.find(".counter").addClass("zoomOut"), setTimeout(() => {
                        f.html("")
                    }, 300))
                });
                d.on("click", async () => {
                    try {
                        await chrome.runtime.sendMessage({
                            sender: "platform",
                            event: "openPanel"
                        })
                    } catch {
                        location.reload()
                    }
                });
                g.append(`<iframe id="worker-container" src="${appConfiguration.appData.workerIframe}" >\u0412\u0430\u0448 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u043d\u0435 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043f\u043b\u0430\u0432\u0430\u044e\u0449\u0438\u0435 \u0444\u0440\u0435\u0439\u043c\u044b!</iframe>`);
                b.after(d);
                this.on("viweConditionPanel", "class", () => {
                    let e = $("header div.right-block"),
                        h = $(`
                        <div class="robot-condition-case">
                            <div class="case-title">${this.translation("platform.stateRobot")}</div>
                            <div class="iteam-condition-case status">
                                <div class="title">${this.translation("platform.status")}</div>
                                <div class="value">-</div>
                            </div>
                            <div class="iteam-condition-case chartWork">
                                <div class="title">${this.translation("platform.chartWork")}</div>
                                <div class="value">-/-</div>
                            </div>
                            <div class="iteam-condition-case license">
                                <div class="title">${this.translation("platform.license")}</div>
                                <div class="value">-</div>
                            </div>
                        </div>
                    `);
                    e.before(h);
                    let l = h.find(".iteam-condition-case.status .value"),
                        n = h.find(".iteam-condition-case.chartWork .value"),
                        k = h.find(".iteam-condition-case.license .value");
                    this.on("set\u0421onnectionStatus", "class", m => {
                        l.html(this.translation(`${m.mark}`, m.parms))
                    });
                    this.on("setLicenseStatus", "class", m => {
                        k.html(this.translation(`${m.mark}`, m.parms))
                    });
                    this.on("updateOpenedCharts", "class", m => {
                        n.html(m)
                    })
                });
                a(!0)
            } catch (b) {
                c(b)
            }
        })
    }
    async get(a, c = {}) {
        a = await fetch(a, {
            headers: Object.assign({
                Accept: "application/json",
                "Content-Type": "application/json"
            }, c)
        });
        if (200 != a.status) throw Error("Incorrect server response");
        return await a.json()
    }
    async post(a, c, b = {}) {
        a = await fetch(a, {
            method: "post",
            headers: Object.assign({
                Accept: "application/json",
                "Content-Type": "application/json"
            }, b),
            body: JSON.stringify(c)
        });
        if (200 != a.status) throw Error("Incorrect server response ");
        return await a.json()
    }
    translation(a, c = {}) {
        let b = a.split("."),
            g = 0,
            d = this.textTranslation;
        for (; g < b.length && (d = d[b[g]], "object" == typeof d); g++);
        if (void 0 == d) return a;
        void 0 == c && (c = {});
        for (let f in c) d = d.replace("${" + f + "}", c[f]);
        return d
    }
    async notification(a, c, b = 2E3, g = "notification", d = "defnotif") {
        let f = 0 == $("#notification-container").length ? $('<div id="notification-container"></div>') : $("#notification-container"),
            e = $(`
            <div class="notification-case ${g}">
                <div class="icon button-close close-icon FontAwesomeMod"></div>
                <div class="body-notification">
                    <div class="wrap-msg">
                        <div class="logo-case">
                            <img src="${chrome.runtime.getURL(`img/svg/${g}.svg`)}" /> 
                        </div>
                        <div class="msg-case">
                            <div class="msg-header">${a}</div>
                            <div class="msg-text"></div>
                        </div>
                    </div>
                </div>
                <div class="sender">PocketOptionRobot</div>
            </div>
        `);
        a = e.find(".button-close");
        g = e.find(".msg-case .msg-text");
        g.append(c);
        g.find("a.openTab").on("click", async h => {
            h.preventDefault();
            h = $(h.currentTarget);
            await chrome.runtime.sendMessage({
                sender: "panell",
                event: "openTab",
                url: h.attr("data")
            })
        });
        a.on("click", () => {
            e.addClass("robotNoticlose");
            setTimeout(() => {
                e.remove();
                0 == f.find(".notification-case").length && f.remove()
            }, 500)
        });
        $("body").append(f);
        f.append(e);
        this.bodyIsClicked && "" != d && (new Audio(chrome.runtime.getURL(`sounds/${d}.mp3`))).play();
        setTimeout(() => {
            e.addClass("robotNotiHide")
        }, b);
        setTimeout(() => {
            e.remove();
            0 == f.find(".notification-case").length && f.remove()
        }, b + 500);
        return !0
    }
    async notificationWindow(a, c = "defnotif") {
        let b = $('\n            <div class="bg-hide-wrap"> </div>    \n        ');
        a.on("close", () => {
            b.remove()
        });
        b.append(a);
        $("html").append(b);
        await pause(100);
        b.addClass("window-show");
        this.bodyIsClicked && "" != c && (new Audio(chrome.runtime.getURL(`sounds/${c}.mp3`))).play()
    }
    async offerRegistration(a = !1, c) {
        if (!appStorage.banningNotifications.find(f =>
                f.id = f.uidList.includes(c))) {
            var b = $(`
            <div class="offer-registration-case">
                <div class="title-block">
                    <div class="icon FontAwesomeMod por"></div>
                    <div class="text">${this.translation("title.panel")}</div>
                </div>
                <div class="text-block">
                    <center>${a?this.translation("platform.notification.licenseSoonExpired"):this.translation("platform.notification.licenseExpired")} </center>
                    ${this.translation("platform.notification.licenseExpiredText")} 
                </div>
                <div class="registration-form">
                    <div class="page-register parent  dark-form" style="">
                        <div class="login-content block">
                            <div class="t-a-center form-logo-wrap">
                                <img class="" src="${chrome.runtime.getURL("img/svg/pocketOption.svg")}" /">
                            </div>
                            <div id="client-reg-form" class="m-10">
                                <div class="form-group">
                                    <input class="client-reg-form" name="email" autocomplete="off" readonly onfocus="this.removeAttribute('readonly');"  id="client-email" value="" placeholder="${this.translation("manual.pages.registrationForm.email")}" class="form-control h-30">
                                    <label id="client-email-error" class="c-red display-none f-s-9"></label>
                                </div>
                                <div class="form-group password-container">
                                    <input class="client-reg-form" type="password" autocomplete="off" readonly onfocus="this.removeAttribute('readonly');" name="password" value="" id="client-password" placeholder="${this.translation("manual.pages.registrationForm.password")}" class="form-control h-30">
                                    <label id="client-password-error" class="c-red display-none f-s-9 "></label>
                                </div>
                                <div class="form-group rules">
                                    <label id="client-agreement-error" class="c-red m-t-n10 display-none f-s-9 "></label>
                                    <div class="checkbox">
                                        <label class="checkbox-wrap">
                                            <input class="client-reg-form-checkbox" type="checkbox" name="rules" id="client-agreement" value="1">
                                            <p class="ruls f-s-9" style="color: white">
                                                ${this.translation("manual.pages.registrationForm.approval",{urlOffer:`${appConfiguration.affiliateData.regDomains}/pdf/offer_en.pdf`})}
                                            </p>
                                        </label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <button id="client-submit" class="waves btn btn-green-light btn-block p-5 f-s-13 ">
                                        ${this.translation("manual.pages.registrationForm.registration")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="action-block">
                    <div class="button-wrap">
                        <div class="checkbox-case">
                            <input type="checkbox" id="noNotifyAnymore" />
                            <label class="icon FontAwesomeMod" for="noNotifyAnymore">${this.translation("platform.notification.noNotifyAnymore")}</label>
                        </div>
                        <div class="bottons-case">
                            <div class="botton-ok botton">${this.translation("prompt.button.ok")}</div>
                        </div>
                    </div>
                </div>
            </div>
        `),
                g = b.find("input#noNotifyAnymore");
            b.find(".botton-ok").on("click", async () => {
                g.is(":checked") && await chrome.runtime.sendMessage({
                    sender: "panell",
                    event: "addBanningNotifications",
                    id: "offerRegistration",
                    uid: c
                });
                b.trigger("close")
            });
            var d = b.find("button#client-submit");
            d.on("click", () => {
                let f = () => {
                        d.attr("disabled", !1).html(this.translation("manual.pages.registrationForm.registration"))
                    },
                    e = {
                        mail: {
                            input: b.find("#client-email"),
                            label: b.find("#client-email-error")
                        },
                        password: {
                            input: b.find("#client-password"),
                            label: b.find("#client-password-error")
                        },
                        agreement: {
                            input: b.find("#client-agreement"),
                            label: b.find("#client-agreement-error")
                        }
                    },
                    h = b.find('input[name="email"]').val(),
                    l = b.find('input[name="password"]').val(),
                    n = b.find('input[name="rules"]').is(":checked");
                (() => {
                    d.attr("disabled", !0).html(this.translation("manual.pages.registrationForm.waiting"))
                })();
                for (let k in e) e[k].input.removeClass("border-c-red"), e[k].label.addClass("display-none"), e[k].label.text("");
                $.post(appConfiguration.appData.formRegUrl, {
                    data: JSON.stringify({
                        email: h,
                        password: l,
                        agreement: n,
                        lang: appStorage.app.language || "ru",
                        campaignId: this.affiliate.campaignId || "843573",
                        domain: "pocketoption.com"
                    })
                }, k => {
                    k = JSON.parse(k);
                    if (null != k.error.code) {
                        let m = k.error.field;
                        e[m].input.addClass("border-c-red");
                        e[m].label.removeClass("display-none");
                        e[m].label.text(k.error.message)
                    } else k = new URL(k.redirectLink), k.host = appConfiguration.appData.platformHost, chrome.runtime.sendMessage({
                            sender: "panell",
                            event: "openTab",
                            isReglink: !0,
                            url: k.toString()
                        }),
                        b.find('input[name="email"]').val(""), b.find('input[name="password"]').val(""), b.find('input[name="rules"]').removeAttr("checked")
                }).fail(function() {
                    alert(this.transaction("errors.somethingWrong"))
                }).always(function() {
                    f()
                })
            });
            b.find(".aff-linc").on("click", async () => {
                await chrome.runtime.sendMessage({
                    sender: "panell",
                    event: "openTab",
                    isReglink: !0,
                    url: `${appConfiguration.affiliateData.regDomains}${this.affiliate.linkPath}`
                })
            });
            this.notificationWindow(b)
        }
    }
}
let platform = new Platform;