'use strict';
let connectionResult;
async function appPlatformStart() {
    async function e() {
        let a = {};
        try {
            let b = document.getElementsByTagName("script");
            for (let c = 0; c < b.length; c++) {
                let d = b[c].innerHTML;
                if (d.indexOf("AppData") + 1) {
                    a.userData = JSON.parse(d.match(/\{.*\}/)[0]);
                    break
                }
            }
            return a
        } catch (b) {
            return a
        }
    }
    try {
        let a = await e();
        return typeof a.userData != "undefined" && a.userData["is-chart"] && a.userData.uid ? (connectionResult = await chrome.runtime.sendMessage({
                sender: "injected",
                event: "connectionRequest",
                userData: a.userData
            })) ? "The poRobot extension is connected to the page" :
            "The poRobot extension is connected to the page(not the only tab)" : "The poRobot extension is not connected to the page"
    } catch (a) {
        throw {
            nameFunction: "appPlatformStart",
            error: a
        };
    }
}
appPlatformStart().then(console.log).catch(console.log);