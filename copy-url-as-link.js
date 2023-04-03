// ==UserScript==
// @name         Copy URL
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  copy URL of current browser tab as different markup such as orgmode, markdown ...
// @author       Ice Zero
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    connect(providePageMeta(), provideSchemas()).forEach(behavior)

    function behavior({ getMenuTip, getText }) {
        GM_registerMenuCommand(getMenuTip(), () => GM_setClipboard(getText()))
    }

    function connect(meta, schemas) {
        return schemas.map(({ name, getLinkMarkup }) => ({ getMenuTip() { return `as ${name} link` }, getText() { return getLinkMarkup(meta) } }))
    }

    function providePageMeta() {
        const title = document.title;
        const url = window.location.href;

        return {
            title,
            url
        }
    }

    function provideSchemas() {
        return [
            {
                name: 'markdown',
                getLinkMarkup: ({ title, url }) => `[${title}](${url})`
            },
            {
                name: 'orgmode',
                getLinkMarkup: ({ title, url }) => `[[${url}][${title}]]`
            },
            {
                name: 'html',
                getLinkMarkup: ({ title, url }) => `<a href="${url}">${title}</a>`
            },
            {
                name: 'richtext',
                getLinkMarkup: ({ title, url }) => `waiting for implementation`
            }
        ]
    }
})();
