'use strict';
class pairLedger {
    constructor() {
        this.getThisData().then(async () => {}).catch(console.log)
    }
    async get(b) {
        b = await fetch(b);
        if (200 != b.status) throw Error("Incorrect server response");
        return await b.json()
    }
    translation(b, c = {}) {
        let d = b.split("."),
            e = 0,
            a = this.textTranslation;
        for (; e < d.length && (a = a[d[e]], "object" == typeof a); e++);
        if (void 0 == a) return b;
        void 0 == c && (c = {});
        for (let f in c) a = a.replace("${" + f + "}", c[f]);
        return a
    }
    async getThisData() {
        this.destruct = !0;
        this.app = (await chrome.storage.local.get("app")).app;
        this.configuration = (await chrome.storage.local.get("configuration")).configuration;
        this.languages = (await chrome.storage.local.get("languages")).languages;
        try {
            this.textTranslation = this.languages[this.app.language] || this.languages.ru
        } catch (b) {
            this.textTranslation = this.languages.ru
        }
        this.DOM = $("body");
        chrome.runtime.onMessage.addListener((b, c, d) => {
            (async () => {
                switch (b.event) {
                    case "initPAir":
                        this.destruct = !1, d(await this.viewPage())
                }
            })();
            return !0
        });
        setTimeout(() => {
            this.destruct && window.close()
        }, 1E3)
    }
    async viewPage() {
        return new Promise((b,
            c) => {
            c = $(`
                <div class="ledger-pair-case">
                    <div class="data-action-case">
                        <div class="action-text p">${this.translation("tether.addLedgerPair")}</div>
                        <div class="action-text">${this.translation("tether.ledgerBlueNotSupported")}</div>
                    </div>
                    <div class="img-action-case">
                        <div class="wrap-img">
                            <img src="../../img/ledgerConnect.gif" />
                            <div class="action-text">${this.translation("tether.connectLedger")}</div>
                        </div>
                    </div>
                    <div class="img-error-data-case">

                    </div>
                    <div class="buttons-action-case">
                        <div class="button-wrap next">
                            <div class="text-wrap">${this.translation("action.next")}</div>
                            <div class="loading-wrap">
                                <img src="../../img/svg/loading.svg" />
                            </div>
                        </div>
                    </div>
                </div>
            `);
            let d = c.find(".buttons-action-case .button-wrap.next"),
                e = c.find(".img-error-data-case");
            d.on("click", async () => {
                d.addClass("loading");
                e.html("");
                var a = new LedgerAdapter({
                    beforeConnect: async () => !0,
                    selectAccount: async f => !0
                });
                try {
                    await a.connect(), b(await a.ledgerUtils.getAddress(0, !1)), d.removeClass("loading")
                } catch (f) {
                    switch (a = f.toString(), d.removeClass("loading"), !0) {
                        case 0 < a.indexOf("0x5515"):
                            e.html(`
                                <div class="error-wrap ledgerUnlock">
                                    <div class="error-text">${this.translation("tether.ledgerUnlock")}</div>
                                </div>
                            `);
                            break;
                        case 0 < a.indexOf("0x6511"):
                            e.html(`
                                <div class="error-wrap ledgerTronIn">
                                    <div class="error-text">
                                        ${this.translation("tether.ledgerTronIn")}
                                    </div>
                                </div>
                            `)
                    }
                }
            });
            this.DOM.append(c)
        })
    }
}
$(document).ready(() => {
    new pairLedger
});