/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const API_KEY = "bb18fd6402d04c85a3a234856232408&q";

async function fetchData(location) {
	const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}=${location}&days=3`;

	try {
		const response = await fetch(apiUrl, { mode: "cors" });

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error.message);
		}

		return response.json();
	} catch (error) {
		return error.message;
	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchData);


/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "./src/api.js");


const DomManipulation = (() => {
	const currentWeatherElements = [
		{ class: ".weather-temp", dataKey: "temp_c" },
		{ class: ".weather-desc", dataKey: "condition" },
		{ class: ".weather-feels-like-anchor", dataKey: "feelslike_c" },

		{ class: ".wind", dataKey: "wind_kph" },
		{ class: ".humidity", dataKey: "humidity" },
		{ class: ".uvindex", dataKey: "uv" },
		{ class: ".visibility", dataKey: "vis_km" },
		{ class: ".cloudiness", dataKey: "cloud" },
		{ class: ".chanceofrain", dataKey: "chanceofrain" },
	];

	let forecastWeatherElements = [
		{ class: ".chance-or-rain", dataKey: "condition" },
		{ class: ".sunrise", dataKey: "temp_c" },
		{ class: ".sunset", dataKey: "condition" },
		{ class: ".moon-phase", dataKey: "condition" },
	];

	const farenheitTempBtn = document.getElementById("farenheit-btn");
	const celsiusTempBtn = document.getElementById("celsius-btn");

	farenheitTempBtn.addEventListener("click", async () => {
		await _updateTemperatureUnit("temp_f", "feelslike_f");
	});

	celsiusTempBtn.addEventListener("click", async () => {
		await _updateTemperatureUnit("temp_c", "feelslike_c");
	});

	const searchForm = document.getElementById("search-form");
	const searchInput = document.getElementById("search-input");

	const domWeatherElements = {};
	function _updateDom() {
		currentWeatherElements.forEach((element) => {
			domWeatherElements[element.dataKey] = document.querySelector(
				element.class
			);
		});
	}

	searchForm.addEventListener("submit", async function (event) {
		event.preventDefault();
		let searchInputValue = searchInput.value;
		await setData(searchInputValue);
		searchForm.reset();
	});

	let searchInputBuffer;
	const _updateTemperatureUnit = async (unit, feelslikeUnit) => {
		currentWeatherElements[0].dataKey = unit;
		currentWeatherElements[2].dataKey = feelslikeUnit;
		_updateDom();
		await setData(searchInputBuffer);
	};

	const locationName = document.querySelector(".location-data");
	const locationDateAndTime = document.querySelector(".date-and-time");

	let setData = async (inputCity) => {
		try {
			_updateDom();
			searchInputBuffer = inputCity;
			let data = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(inputCity);
			console.log(data);
			if (!data.current) throw new Error(data);
			locationName.textContent =
				data.location.name + ", " + data.location.country;
			locationDateAndTime.textContent = data.location.localtime;

			await Promise.all(
				currentWeatherElements.map(async (element) => {
					try {
						if (element.dataKey === "condition")
							domWeatherElements[element.dataKey].textContent =
								data.current.condition.text;
						else
							domWeatherElements[element.dataKey].textContent =
								Math.round(data.current[element.dataKey]);

						if (
							element.dataKey === "temp_c" ||
							element.dataKey === "feelslike_c"
						)
							domWeatherElements[element.dataKey].textContent +=
								"°C";
						else if (
							element.dataKey === "temp_f" ||
							element.dataKey === "feelslike_f"
						)
							domWeatherElements[element.dataKey].textContent +=
								"°F";
					} catch (error) {
						console.log("Error updating element:", error);
					}
				})
			);
			// await Promise.all(
			// 	forecastWeatherElements.map(async (element) => {
			// 		try {
			// 			domWeatherElements[element.dataKey].textContent =
			// 				Math.round(
			// 					data.forecast.forecastday[0].day[
			// 						element.dataKey
			// 					]
			// 				);
			// 		} catch (error) {
			// 			console.log("Error updating element:", error);
			// 		}
			// 	})
			// );
		} catch (error) {
			console.log(error);
		}
	};

	return { setData };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomManipulation);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");

_dom__WEBPACK_IMPORTED_MODULE_0__["default"].setData("Amsterdam");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0EsbUVBQW1FLFFBQVEsR0FBRyxTQUFTOztBQUV2RjtBQUNBLHlDQUF5QyxjQUFjOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJLOztBQUU5QjtBQUNBO0FBQ0EsSUFBSSwyQ0FBMkM7QUFDL0MsSUFBSSw4Q0FBOEM7QUFDbEQsSUFBSSw2REFBNkQ7O0FBRWpFLElBQUkscUNBQXFDO0FBQ3pDLElBQUkseUNBQXlDO0FBQzdDLElBQUksa0NBQWtDO0FBQ3RDLElBQUkseUNBQXlDO0FBQzdDLElBQUksd0NBQXdDO0FBQzVDLElBQUksaURBQWlEO0FBQ3JEOztBQUVBO0FBQ0EsSUFBSSxnREFBZ0Q7QUFDcEQsSUFBSSxzQ0FBc0M7QUFDMUMsSUFBSSx3Q0FBd0M7QUFDNUMsSUFBSSw0Q0FBNEM7QUFDaEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGdEQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVixDQUFDOztBQUVELGlFQUFlLGVBQWUsRUFBQzs7Ozs7OztVQzVIL0I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05vQztBQUNwQyw0Q0FBZSIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFQSV9LRVkgPSBcImJiMThmZDY0MDJkMDRjODVhM2EyMzQ4NTYyMzI0MDgmcVwiO1xuXG5hc3luYyBmdW5jdGlvbiBmZXRjaERhdGEobG9jYXRpb24pIHtcblx0Y29uc3QgYXBpVXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2ZvcmVjYXN0Lmpzb24/a2V5PSR7QVBJX0tFWX09JHtsb2NhdGlvbn0mZGF5cz0zYDtcblxuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuXG5cdFx0aWYgKCFyZXNwb25zZS5vaykge1xuXHRcdFx0Y29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yRGF0YS5lcnJvci5tZXNzYWdlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiBlcnJvci5tZXNzYWdlO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZldGNoRGF0YTtcbiIsImltcG9ydCBmZXRjaERhdGEgZnJvbSBcIi4vYXBpXCI7XG5cbmNvbnN0IERvbU1hbmlwdWxhdGlvbiA9ICgoKSA9PiB7XG5cdGNvbnN0IGN1cnJlbnRXZWF0aGVyRWxlbWVudHMgPSBbXG5cdFx0eyBjbGFzczogXCIud2VhdGhlci10ZW1wXCIsIGRhdGFLZXk6IFwidGVtcF9jXCIgfSxcblx0XHR7IGNsYXNzOiBcIi53ZWF0aGVyLWRlc2NcIiwgZGF0YUtleTogXCJjb25kaXRpb25cIiB9LFxuXHRcdHsgY2xhc3M6IFwiLndlYXRoZXItZmVlbHMtbGlrZS1hbmNob3JcIiwgZGF0YUtleTogXCJmZWVsc2xpa2VfY1wiIH0sXG5cblx0XHR7IGNsYXNzOiBcIi53aW5kXCIsIGRhdGFLZXk6IFwid2luZF9rcGhcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLmh1bWlkaXR5XCIsIGRhdGFLZXk6IFwiaHVtaWRpdHlcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLnV2aW5kZXhcIiwgZGF0YUtleTogXCJ1dlwiIH0sXG5cdFx0eyBjbGFzczogXCIudmlzaWJpbGl0eVwiLCBkYXRhS2V5OiBcInZpc19rbVwiIH0sXG5cdFx0eyBjbGFzczogXCIuY2xvdWRpbmVzc1wiLCBkYXRhS2V5OiBcImNsb3VkXCIgfSxcblx0XHR7IGNsYXNzOiBcIi5jaGFuY2VvZnJhaW5cIiwgZGF0YUtleTogXCJjaGFuY2VvZnJhaW5cIiB9LFxuXHRdO1xuXG5cdGxldCBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cyA9IFtcblx0XHR7IGNsYXNzOiBcIi5jaGFuY2Utb3ItcmFpblwiLCBkYXRhS2V5OiBcImNvbmRpdGlvblwiIH0sXG5cdFx0eyBjbGFzczogXCIuc3VucmlzZVwiLCBkYXRhS2V5OiBcInRlbXBfY1wiIH0sXG5cdFx0eyBjbGFzczogXCIuc3Vuc2V0XCIsIGRhdGFLZXk6IFwiY29uZGl0aW9uXCIgfSxcblx0XHR7IGNsYXNzOiBcIi5tb29uLXBoYXNlXCIsIGRhdGFLZXk6IFwiY29uZGl0aW9uXCIgfSxcblx0XTtcblxuXHRjb25zdCBmYXJlbmhlaXRUZW1wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmYXJlbmhlaXQtYnRuXCIpO1xuXHRjb25zdCBjZWxzaXVzVGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2Vsc2l1cy1idG5cIik7XG5cblx0ZmFyZW5oZWl0VGVtcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQoXCJ0ZW1wX2ZcIiwgXCJmZWVsc2xpa2VfZlwiKTtcblx0fSk7XG5cblx0Y2Vsc2l1c1RlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0KFwidGVtcF9jXCIsIFwiZmVlbHNsaWtlX2NcIik7XG5cdH0pO1xuXG5cdGNvbnN0IHNlYXJjaEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1mb3JtXCIpO1xuXHRjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWlucHV0XCIpO1xuXG5cdGNvbnN0IGRvbVdlYXRoZXJFbGVtZW50cyA9IHt9O1xuXHRmdW5jdGlvbiBfdXBkYXRlRG9tKCkge1xuXHRcdGN1cnJlbnRXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRlbGVtZW50LmNsYXNzXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2VhcmNoRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IHNlYXJjaElucHV0VmFsdWUgPSBzZWFyY2hJbnB1dC52YWx1ZTtcblx0XHRhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0VmFsdWUpO1xuXHRcdHNlYXJjaEZvcm0ucmVzZXQoKTtcblx0fSk7XG5cblx0bGV0IHNlYXJjaElucHV0QnVmZmVyO1xuXHRjb25zdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0ID0gYXN5bmMgKHVuaXQsIGZlZWxzbGlrZVVuaXQpID0+IHtcblx0XHRjdXJyZW50V2VhdGhlckVsZW1lbnRzWzBdLmRhdGFLZXkgPSB1bml0O1xuXHRcdGN1cnJlbnRXZWF0aGVyRWxlbWVudHNbMl0uZGF0YUtleSA9IGZlZWxzbGlrZVVuaXQ7XG5cdFx0X3VwZGF0ZURvbSgpO1xuXHRcdGF3YWl0IHNldERhdGEoc2VhcmNoSW5wdXRCdWZmZXIpO1xuXHR9O1xuXG5cdGNvbnN0IGxvY2F0aW9uTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jYXRpb24tZGF0YVwiKTtcblx0Y29uc3QgbG9jYXRpb25EYXRlQW5kVGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0ZS1hbmQtdGltZVwiKTtcblxuXHRsZXQgc2V0RGF0YSA9IGFzeW5jIChpbnB1dENpdHkpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0X3VwZGF0ZURvbSgpO1xuXHRcdFx0c2VhcmNoSW5wdXRCdWZmZXIgPSBpbnB1dENpdHk7XG5cdFx0XHRsZXQgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShpbnB1dENpdHkpO1xuXHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0XHRpZiAoIWRhdGEuY3VycmVudCkgdGhyb3cgbmV3IEVycm9yKGRhdGEpO1xuXHRcdFx0bG9jYXRpb25OYW1lLnRleHRDb250ZW50ID1cblx0XHRcdFx0ZGF0YS5sb2NhdGlvbi5uYW1lICsgXCIsIFwiICsgZGF0YS5sb2NhdGlvbi5jb3VudHJ5O1xuXHRcdFx0bG9jYXRpb25EYXRlQW5kVGltZS50ZXh0Q29udGVudCA9IGRhdGEubG9jYXRpb24ubG9jYWx0aW1lO1xuXG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdFx0Y3VycmVudFdlYXRoZXJFbGVtZW50cy5tYXAoYXN5bmMgKGVsZW1lbnQpID0+IHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJjb25kaXRpb25cIilcblx0XHRcdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxuXHRcdFx0XHRcdFx0XHRcdGRhdGEuY3VycmVudC5jb25kaXRpb24udGV4dDtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxuXHRcdFx0XHRcdFx0XHRcdE1hdGgucm91bmQoZGF0YS5jdXJyZW50W2VsZW1lbnQuZGF0YUtleV0pO1xuXG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ0ZW1wX2NcIiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LmRhdGFLZXkgPT09IFwiZmVlbHNsaWtlX2NcIlxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPVxuXHRcdFx0XHRcdFx0XHRcdFwiwrBDXCI7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5ID09PSBcInRlbXBfZlwiIHx8XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJmZWVsc2xpa2VfZlwiXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9XG5cdFx0XHRcdFx0XHRcdFx0XCLCsEZcIjtcblx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBlbGVtZW50OlwiLCBlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0KTtcblx0XHRcdC8vIGF3YWl0IFByb21pc2UuYWxsKFxuXHRcdFx0Ly8gXHRmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5tYXAoYXN5bmMgKGVsZW1lbnQpID0+IHtcblx0XHRcdC8vIFx0XHR0cnkge1xuXHRcdFx0Ly8gXHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxuXHRcdFx0Ly8gXHRcdFx0XHRNYXRoLnJvdW5kKFxuXHRcdFx0Ly8gXHRcdFx0XHRcdGRhdGEuZm9yZWNhc3QuZm9yZWNhc3RkYXlbMF0uZGF5W1xuXHRcdFx0Ly8gXHRcdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5XG5cdFx0XHQvLyBcdFx0XHRcdFx0XVxuXHRcdFx0Ly8gXHRcdFx0XHQpO1xuXHRcdFx0Ly8gXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHQvLyBcdFx0XHRjb25zb2xlLmxvZyhcIkVycm9yIHVwZGF0aW5nIGVsZW1lbnQ6XCIsIGVycm9yKTtcblx0XHRcdC8vIFx0XHR9XG5cdFx0XHQvLyBcdH0pXG5cdFx0XHQvLyApO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7IHNldERhdGEgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IERvbU1hbmlwdWxhdGlvbjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IERvbU1hbmlwdWxhdGlvbiBmcm9tIFwiLi9kb21cIjtcbkRvbU1hbmlwdWxhdGlvbi5zZXREYXRhKFwiQW1zdGVyZGFtXCIpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9