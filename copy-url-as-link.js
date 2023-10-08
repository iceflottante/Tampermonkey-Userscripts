// ==UserScript==
// @name         Copy URL
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Copy URL of current browser tab as different markup such as orgmode, markdown ...
// @author       Ice Zero
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    provideSchemas().forEach(behavior);

    function behavior({ name, getLinkMarkup }) {
        GM_registerMenuCommand(`Copy URL as ${name} link`, () => {
            getPageMeta().then(({ title, url }) => {
                GM_setClipboard(getLinkMarkup({ title, url }));
            });
        });
    }

    async function getPageMeta() {
        const title = document.title;
        const url = window.location.href;
        return { title, url };
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
                getLinkMarkup: () => `waiting for implementation`
            }
        ];
    }
})();
