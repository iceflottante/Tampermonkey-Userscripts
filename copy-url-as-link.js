// ==UserScript==
// @name         Copy URL
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Copy URL of current browser tab as different markup such as orgmode, markdown, typst and even RTF (rich text format or WYSIWYG) ...
// @author       Ice Zero
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463105/Copy%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/463105/Copy%20URL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    provideSchemas().forEach(behavior);

    function behavior({ name, type = 'text', getLinkMarkup }) {
        GM_registerMenuCommand(`Copy URL as ${name} link`, () => {
            getPageMeta().then(({ title, url }) => {
                GM_setClipboard(getLinkMarkup({ title, url }), type);
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
                // @see https://www.tampermonkey.net/documentation.php#api:GM_setClipboard
                name: 'richtext',
                type: 'html',
                getLinkMarkup: ({title, url}) => `<a href="${url}">${title}</a>`
            },
            {
                name: 'markdown',
                getLinkMarkup: ({ title, url }) => `[${title}](${url})`
            },
            {
                name: 'html',
                getLinkMarkup: ({ title, url }) => `<a href="${url}">${title}</a>`
            },
            {
                name: 'orgmode',
                getLinkMarkup: ({ title, url }) => `[[${url}][${title}]]`
            },
            {
                name: 'typst',
                // @see https://typst.app/docs/reference/model/link/
                getLinkMarkup: ({ title, url }) => `#link("${url}")[${title}]`
            },
        ];
    }
})();
