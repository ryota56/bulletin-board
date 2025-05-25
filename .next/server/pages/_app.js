/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/i18n.js":
/*!*********************!*\
  !*** ./lib/i18n.js ***!
  \*********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LanguageProvider: () => (/* binding */ LanguageProvider),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   useLanguage: () => (/* binding */ useLanguage)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! i18next */ \"i18next\");\n/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ \"react-i18next\");\n/* harmony import */ var _public_locales_ja_common_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../public/locales/ja/common.json */ \"./public/locales/ja/common.json\");\n/* harmony import */ var _public_locales_en_common_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../public/locales/en/common.json */ \"./public/locales/en/common.json\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([i18next__WEBPACK_IMPORTED_MODULE_2__, react_i18next__WEBPACK_IMPORTED_MODULE_3__]);\n([i18next__WEBPACK_IMPORTED_MODULE_2__, react_i18next__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n// ① 翻訳ファイルを静的インポート\n\n\n// ② i18next 本体を初期化\nif (!i18next__WEBPACK_IMPORTED_MODULE_2__[\"default\"].isInitialized) {\n    i18next__WEBPACK_IMPORTED_MODULE_2__[\"default\"].use(react_i18next__WEBPACK_IMPORTED_MODULE_3__.initReactI18next).init({\n        // ②-1 名前空間を正しく指定\n        ns: [\n            \"common\"\n        ],\n        defaultNS: \"common\",\n        // ②-2 翻訳リソースを実体で渡す\n        resources: {\n            ja: {\n                common: _public_locales_ja_common_json__WEBPACK_IMPORTED_MODULE_4__\n            },\n            en: {\n                common: _public_locales_en_common_json__WEBPACK_IMPORTED_MODULE_5__\n            }\n        },\n        // ②-3 言語まわり\n        fallbackLng: \"ja\",\n        // 最初はブラウザ設定を優先。無ければ ja\n        lng:  false ? 0 : \"ja\",\n        interpolation: {\n            escapeValue: false\n        }\n    });\n}\n// ③ React Context で言語切替をアプリに配信\nconst LangCtx = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    locale: i18next__WEBPACK_IMPORTED_MODULE_2__[\"default\"].language,\n    setLocale: ()=>{}\n});\nconst LanguageProvider = ({ children })=>{\n    const [locale, setLocale] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(i18next__WEBPACK_IMPORTED_MODULE_2__[\"default\"].language);\n    // 言語を切り替えたら i18next 側にも反映\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        i18next__WEBPACK_IMPORTED_MODULE_2__[\"default\"].changeLanguage(locale);\n    }, [\n        locale\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(LangCtx.Provider, {\n        value: {\n            locale,\n            setLocale\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\JHC0\\\\Desktop\\\\5ch\\\\lib\\\\i18n.js\",\n        lineNumber: 50,\n        columnNumber: 5\n    }, undefined);\n};\nconst useLanguage = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(LangCtx);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (i18next__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvaTE4bi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBOEU7QUFDbkQ7QUFDc0I7QUFFakQsbUJBQW1CO0FBQ3FDO0FBQ0E7QUFFeEQsbUJBQW1CO0FBQ25CLElBQUksQ0FBQ0ssNkRBQWtCLEVBQUU7SUFDdkJBLG1EQUNNLENBQUNDLDJEQUFnQkEsRUFDcEJLLElBQUksQ0FBQztRQUNKLGlCQUFpQjtRQUNqQkMsSUFBSTtZQUFDO1NBQVM7UUFDZEMsV0FBVztRQUVYLG1CQUFtQjtRQUNuQkMsV0FBVztZQUNUQyxJQUFJO2dCQUFFQyxRQUFRVCwyREFBUUE7WUFBQztZQUN2QlUsSUFBSTtnQkFBRUQsUUFBUVIsMkRBQVFBO1lBQUM7UUFDekI7UUFFQSxZQUFZO1FBQ1pVLGFBQWE7UUFDYix1QkFBdUI7UUFDdkJDLEtBQUssTUFBa0IsR0FDbkIsQ0FBMEMsR0FDMUM7UUFFSkksZUFBZTtZQUFFQyxhQUFhO1FBQU07SUFDdEM7QUFDSjtBQUVBLCtCQUErQjtBQUMvQixNQUFNQyx3QkFBVXhCLG9EQUFhQSxDQUFDO0lBQzVCeUIsUUFBUXJCLHdEQUFhO0lBQ3JCc0IsV0FBVyxLQUFPO0FBQ3BCO0FBRU8sTUFBTUMsbUJBQW1CLENBQUMsRUFBRUMsUUFBUSxFQUFFO0lBQzNDLE1BQU0sQ0FBQ0gsUUFBUUMsVUFBVSxHQUFHdkIsK0NBQVFBLENBQUNDLHdEQUFhO0lBRWxELDBCQUEwQjtJQUMxQkYsZ0RBQVNBLENBQUM7UUFDUkUsOERBQW1CLENBQUNxQjtJQUN0QixHQUFHO1FBQUNBO0tBQU87SUFFWCxxQkFDRSw4REFBQ0QsUUFBUU0sUUFBUTtRQUFDQyxPQUFPO1lBQUVOO1lBQVFDO1FBQVU7a0JBQzFDRTs7Ozs7O0FBR1AsRUFBRTtBQUVLLE1BQU1JLGNBQWMsSUFBTS9CLGlEQUFVQSxDQUFDdUIsU0FBUztBQUNyRCxpRUFBZXBCLCtDQUFJQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vNWNoLy4vbGliL2kxOG4uanM/NmFmOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGkxOG4gZnJvbSAnaTE4bmV4dCc7XHJcbmltcG9ydCB7IGluaXRSZWFjdEkxOG5leHQgfSBmcm9tICdyZWFjdC1pMThuZXh0JztcclxuXHJcbi8vIOKRoCDnv7voqLPjg5XjgqHjgqTjg6vjgpLpnZnnmoTjgqTjg7Pjg53jg7zjg4hcclxuaW1wb3J0IGphQ29tbW9uIGZyb20gJy4uL3B1YmxpYy9sb2NhbGVzL2phL2NvbW1vbi5qc29uJztcclxuaW1wb3J0IGVuQ29tbW9uIGZyb20gJy4uL3B1YmxpYy9sb2NhbGVzL2VuL2NvbW1vbi5qc29uJztcclxuXHJcbi8vIOKRoSBpMThuZXh0IOacrOS9k+OCkuWIneacn+WMllxyXG5pZiAoIWkxOG4uaXNJbml0aWFsaXplZCkge1xyXG4gIGkxOG5cclxuICAgIC51c2UoaW5pdFJlYWN0STE4bmV4dClcclxuICAgIC5pbml0KHtcclxuICAgICAgLy8g4pGhLTEg5ZCN5YmN56m66ZaT44KS5q2j44GX44GP5oyH5a6aXHJcbiAgICAgIG5zOiBbJ2NvbW1vbiddLFxyXG4gICAgICBkZWZhdWx0TlM6ICdjb21tb24nLFxyXG5cclxuICAgICAgLy8g4pGhLTIg57+76Kiz44Oq44K944O844K544KS5a6f5L2T44Gn5rih44GZXHJcbiAgICAgIHJlc291cmNlczoge1xyXG4gICAgICAgIGphOiB7IGNvbW1vbjogamFDb21tb24gfSxcclxuICAgICAgICBlbjogeyBjb21tb246IGVuQ29tbW9uIH0sXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyDikaEtMyDoqIDoqp7jgb7jgo/jgopcclxuICAgICAgZmFsbGJhY2tMbmc6ICdqYScsXHJcbiAgICAgIC8vIOacgOWIneOBr+ODluODqeOCpuOCtuioreWumuOCkuWEquWFiOOAgueEoeOBkeOCjOOBsCBqYVxyXG4gICAgICBsbmc6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXHJcbiAgICAgICAgPyAobmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdqYScpLnNwbGl0KCctJylbMF1cclxuICAgICAgICA6ICdqYScsXHJcblxyXG4gICAgICBpbnRlcnBvbGF0aW9uOiB7IGVzY2FwZVZhbHVlOiBmYWxzZSB9LFxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIOKRoiBSZWFjdCBDb250ZXh0IOOBp+iogOiqnuWIh+abv+OCkuOCouODl+ODquOBq+mFjeS/oVxyXG5jb25zdCBMYW5nQ3R4ID0gY3JlYXRlQ29udGV4dCh7XHJcbiAgbG9jYWxlOiBpMThuLmxhbmd1YWdlLFxyXG4gIHNldExvY2FsZTogKCkgPT4ge30sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IExhbmd1YWdlUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XHJcbiAgY29uc3QgW2xvY2FsZSwgc2V0TG9jYWxlXSA9IHVzZVN0YXRlKGkxOG4ubGFuZ3VhZ2UpO1xyXG5cclxuICAvLyDoqIDoqp7jgpLliIfjgormm7/jgYjjgZ/jgokgaTE4bmV4dCDlgbTjgavjgoLlj43mmKBcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaTE4bi5jaGFuZ2VMYW5ndWFnZShsb2NhbGUpO1xyXG4gIH0sIFtsb2NhbGVdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMYW5nQ3R4LlByb3ZpZGVyIHZhbHVlPXt7IGxvY2FsZSwgc2V0TG9jYWxlIH19PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0xhbmdDdHguUHJvdmlkZXI+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VMYW5ndWFnZSA9ICgpID0+IHVzZUNvbnRleHQoTGFuZ0N0eCk7XHJcbmV4cG9ydCBkZWZhdWx0IGkxOG47Il0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsImkxOG4iLCJpbml0UmVhY3RJMThuZXh0IiwiamFDb21tb24iLCJlbkNvbW1vbiIsImlzSW5pdGlhbGl6ZWQiLCJ1c2UiLCJpbml0IiwibnMiLCJkZWZhdWx0TlMiLCJyZXNvdXJjZXMiLCJqYSIsImNvbW1vbiIsImVuIiwiZmFsbGJhY2tMbmciLCJsbmciLCJuYXZpZ2F0b3IiLCJsYW5ndWFnZSIsInNwbGl0IiwiaW50ZXJwb2xhdGlvbiIsImVzY2FwZVZhbHVlIiwiTGFuZ0N0eCIsImxvY2FsZSIsInNldExvY2FsZSIsIkxhbmd1YWdlUHJvdmlkZXIiLCJjaGlsZHJlbiIsImNoYW5nZUxhbmd1YWdlIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZUxhbmd1YWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/i18n.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/i18n */ \"./lib/i18n.js\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/dynamic */ \"./node_modules/next/dynamic.js\");\n/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_dynamic__WEBPACK_IMPORTED_MODULE_4__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_i18n__WEBPACK_IMPORTED_MODULE_1__]);\n_lib_i18n__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/* __next_internal_client_entry_do_not_use__ default auto */ \n\n\n\n\n// NoSSRコンポーネント - SSRでレンダリングしないコンポーネントをラップ\nconst NoSSR = ({ children })=>{\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: children\n    }, void 0, false);\n};\n// LanguageProviderを動的インポートでSSRから除外\nconst ClientLanguageProvider = next_dynamic__WEBPACK_IMPORTED_MODULE_4___default()(()=>Promise.resolve(_lib_i18n__WEBPACK_IMPORTED_MODULE_1__.LanguageProvider), {\n    ssr: false\n});\nfunction MyApp({ Component, pageProps }) {\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        setMounted(true);\n    }, []);\n    // 注：コンポーネント自体は常にレンダリングします\n    return mounted ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ClientLanguageProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\JHC0\\\\Desktop\\\\5ch\\\\pages\\\\_app.js\",\n            lineNumber: 29,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\JHC0\\\\Desktop\\\\5ch\\\\pages\\\\_app.js\",\n        lineNumber: 28,\n        columnNumber: 5\n    }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(NoSSR, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\JHC0\\\\Desktop\\\\5ch\\\\pages\\\\_app.js\",\n            lineNumber: 33,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\JHC0\\\\Desktop\\\\5ch\\\\pages\\\\_app.js\",\n        lineNumber: 32,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRStDO0FBQ2hCO0FBQ2E7QUFDVDtBQUVuQywwQ0FBMEM7QUFDMUMsTUFBTUksUUFBUSxDQUFDLEVBQUVDLFFBQVEsRUFBRTtJQUN6QixxQkFBTztrQkFBR0E7O0FBQ1o7QUFFQSxtQ0FBbUM7QUFDbkMsTUFBTUMseUJBQXlCSCxtREFBT0EsQ0FDcEMsSUFBTUksUUFBUUMsT0FBTyxDQUFDUix1REFBZ0JBLEdBQ3RDO0lBQUVTLEtBQUs7QUFBTTtBQUdmLFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDckMsTUFBTSxDQUFDQyxTQUFTQyxXQUFXLEdBQUdiLCtDQUFRQSxDQUFDO0lBRXZDQyxnREFBU0EsQ0FBQztRQUNSWSxXQUFXO0lBQ2IsR0FBRyxFQUFFO0lBRUwsMEJBQTBCO0lBQzFCLE9BQU9ELHdCQUNMLDhEQUFDUDtrQkFDQyw0RUFBQ0s7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OzZCQUcxQiw4REFBQ1I7a0JBQ0MsNEVBQUNPO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUI7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovLzVjaC8uL3BhZ2VzL19hcHAuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCc7XHJcblxyXG5pbXBvcnQgeyBMYW5ndWFnZVByb3ZpZGVyIH0gZnJvbSAnLi4vbGliL2kxOG4nO1xyXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcyc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBkeW5hbWljIGZyb20gJ25leHQvZHluYW1pYyc7XHJcblxyXG4vLyBOb1NTUuOCs+ODs+ODneODvOODjeODs+ODiCAtIFNTUuOBp+ODrOODs+ODgOODquODs+OCsOOBl+OBquOBhOOCs+ODs+ODneODvOODjeODs+ODiOOCkuODqeODg+ODl1xyXG5jb25zdCBOb1NTUiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuICByZXR1cm4gPD57Y2hpbGRyZW59PC8+O1xyXG59O1xyXG5cclxuLy8gTGFuZ3VhZ2VQcm92aWRlcuOCkuWLleeahOOCpOODs+ODneODvOODiOOBp1NTUuOBi+OCiemZpOWkllxyXG5jb25zdCBDbGllbnRMYW5ndWFnZVByb3ZpZGVyID0gZHluYW1pYyhcclxuICAoKSA9PiBQcm9taXNlLnJlc29sdmUoTGFuZ3VhZ2VQcm92aWRlciksXHJcbiAgeyBzc3I6IGZhbHNlIH1cclxuKTtcclxuXHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xyXG4gIGNvbnN0IFttb3VudGVkLCBzZXRNb3VudGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldE1vdW50ZWQodHJ1ZSk7XHJcbiAgfSwgW10pO1xyXG5cclxuICAvLyDms6jvvJrjgrPjg7Pjg53jg7zjg43jg7Pjg4joh6rkvZPjga/luLjjgavjg6zjg7Pjg4Djg6rjg7PjgrDjgZfjgb7jgZlcclxuICByZXR1cm4gbW91bnRlZCA/IChcclxuICAgIDxDbGllbnRMYW5ndWFnZVByb3ZpZGVyPlxyXG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICA8L0NsaWVudExhbmd1YWdlUHJvdmlkZXI+XHJcbiAgKSA6IChcclxuICAgIDxOb1NTUj5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgPC9Ob1NTUj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNeUFwcDsgIl0sIm5hbWVzIjpbIkxhbmd1YWdlUHJvdmlkZXIiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsImR5bmFtaWMiLCJOb1NTUiIsImNoaWxkcmVuIiwiQ2xpZW50TGFuZ3VhZ2VQcm92aWRlciIsIlByb21pc2UiLCJyZXNvbHZlIiwic3NyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJtb3VudGVkIiwic2V0TW91bnRlZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "i18next":
/*!**************************!*\
  !*** external "i18next" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = import("i18next");;

/***/ }),

/***/ "react-i18next":
/*!********************************!*\
  !*** external "react-i18next" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = import("react-i18next");;

/***/ }),

/***/ "./public/locales/en/common.json":
/*!***************************************!*\
  !*** ./public/locales/en/common.json ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"site":{"title":"5ch Board","description":"A bulletin board where you can post anonymously"},"header":{"home":"Home","newThread":"Create New Thread","search":"Search","languageSelector":"Select Language"},"buttons":{"submit":"Submit","cancel":"Cancel","search":"Search","loadMore":"Load More"},"languages":{"ja":"Japanese","en":"English"},"thread":{"notFound":"Thread not found","returnHome":"Return Home","created":"Created","reply":"Post Reply","posterId":"Poster ID","enterContent":"Enter your content","posting":"Posting...","postFailure":"Failed to post. Please try again."},"newThread":{"title":"Thread Title","enterTitle":"Enter title","content":"Content","enterContent":"Enter your content","creating":"Creating..."},"errors":{"internal":"Internal server error"}}');

/***/ }),

/***/ "./public/locales/ja/common.json":
/*!***************************************!*\
  !*** ./public/locales/ja/common.json ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"site":{"title":"5ch掲示板","description":"匿名で自由に投稿できる掲示板です"},"header":{"home":"ホーム","newThread":"新規スレッド作成","search":"検索","languageSelector":"言語選択"},"buttons":{"submit":"送信","cancel":"キャンセル","search":"検索","loadMore":"もっと見る"},"languages":{"ja":"日本語","en":"English"},"thread":{"notFound":"スレッドが見つかりません","returnHome":"ホームに戻る","created":"作成日","reply":"返信を投稿","posterId":"投稿者ID","enterContent":"投稿内容を入力してください","posting":"投稿中...","postFailure":"投稿に失敗しました。再度お試しください。"},"newThread":{"title":"スレッドタイトル","enterTitle":"タイトルを入力してください","content":"本文","enterContent":"投稿内容を入力してください","creating":"作成中..."},"errors":{"internal":"内部エラーが発生しました"}}');

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();