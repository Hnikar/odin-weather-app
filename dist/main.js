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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0EsbUVBQW1FLFFBQVEsR0FBRyxTQUFTOztBQUV2RjtBQUNBLHlDQUF5QyxjQUFjOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJLOztBQUU5QjtBQUNBO0FBQ0EsSUFBSSwyQ0FBMkM7QUFDL0MsSUFBSSw4Q0FBOEM7QUFDbEQsSUFBSSw2REFBNkQ7O0FBRWpFLElBQUkscUNBQXFDO0FBQ3pDLElBQUkseUNBQXlDO0FBQzdDLElBQUksa0NBQWtDO0FBQ3RDLElBQUkseUNBQXlDO0FBQzdDLElBQUksd0NBQXdDO0FBQzVDOztBQUVBO0FBQ0EsSUFBSSxnREFBZ0Q7QUFDcEQsSUFBSSxzQ0FBc0M7QUFDMUMsSUFBSSx3Q0FBd0M7QUFDNUMsSUFBSSw0Q0FBNEM7QUFDaEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGdEQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVixDQUFDOztBQUVELGlFQUFlLGVBQWUsRUFBQzs7Ozs7OztVQzNIL0I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05vQztBQUNwQyw0Q0FBZSIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFQSV9LRVkgPSBcImJiMThmZDY0MDJkMDRjODVhM2EyMzQ4NTYyMzI0MDgmcVwiO1xuXG5hc3luYyBmdW5jdGlvbiBmZXRjaERhdGEobG9jYXRpb24pIHtcblx0Y29uc3QgYXBpVXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2ZvcmVjYXN0Lmpzb24/a2V5PSR7QVBJX0tFWX09JHtsb2NhdGlvbn0mZGF5cz0zYDtcblxuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuXG5cdFx0aWYgKCFyZXNwb25zZS5vaykge1xuXHRcdFx0Y29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yRGF0YS5lcnJvci5tZXNzYWdlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiBlcnJvci5tZXNzYWdlO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZldGNoRGF0YTtcbiIsImltcG9ydCBmZXRjaERhdGEgZnJvbSBcIi4vYXBpXCI7XG5cbmNvbnN0IERvbU1hbmlwdWxhdGlvbiA9ICgoKSA9PiB7XG5cdGNvbnN0IGN1cnJlbnRXZWF0aGVyRWxlbWVudHMgPSBbXG5cdFx0eyBjbGFzczogXCIud2VhdGhlci10ZW1wXCIsIGRhdGFLZXk6IFwidGVtcF9jXCIgfSxcblx0XHR7IGNsYXNzOiBcIi53ZWF0aGVyLWRlc2NcIiwgZGF0YUtleTogXCJjb25kaXRpb25cIiB9LFxuXHRcdHsgY2xhc3M6IFwiLndlYXRoZXItZmVlbHMtbGlrZS1hbmNob3JcIiwgZGF0YUtleTogXCJmZWVsc2xpa2VfY1wiIH0sXG5cblx0XHR7IGNsYXNzOiBcIi53aW5kXCIsIGRhdGFLZXk6IFwid2luZF9rcGhcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLmh1bWlkaXR5XCIsIGRhdGFLZXk6IFwiaHVtaWRpdHlcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLnV2aW5kZXhcIiwgZGF0YUtleTogXCJ1dlwiIH0sXG5cdFx0eyBjbGFzczogXCIudmlzaWJpbGl0eVwiLCBkYXRhS2V5OiBcInZpc19rbVwiIH0sXG5cdFx0eyBjbGFzczogXCIuY2xvdWRpbmVzc1wiLCBkYXRhS2V5OiBcImNsb3VkXCIgfSxcblx0XTtcblxuXHRsZXQgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMgPSBbXG5cdFx0eyBjbGFzczogXCIuY2hhbmNlLW9yLXJhaW5cIiwgZGF0YUtleTogXCJjb25kaXRpb25cIiB9LFxuXHRcdHsgY2xhc3M6IFwiLnN1bnJpc2VcIiwgZGF0YUtleTogXCJ0ZW1wX2NcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLnN1bnNldFwiLCBkYXRhS2V5OiBcImNvbmRpdGlvblwiIH0sXG5cdFx0eyBjbGFzczogXCIubW9vbi1waGFzZVwiLCBkYXRhS2V5OiBcImNvbmRpdGlvblwiIH0sXG5cdF07XG5cblx0Y29uc3QgZmFyZW5oZWl0VGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmFyZW5oZWl0LWJ0blwiKTtcblx0Y29uc3QgY2Vsc2l1c1RlbXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNlbHNpdXMtYnRuXCIpO1xuXG5cdGZhcmVuaGVpdFRlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0KFwidGVtcF9mXCIsIFwiZmVlbHNsaWtlX2ZcIik7XG5cdH0pO1xuXG5cdGNlbHNpdXNUZW1wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdChcInRlbXBfY1wiLCBcImZlZWxzbGlrZV9jXCIpO1xuXHR9KTtcblxuXHRjb25zdCBzZWFyY2hGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtZm9ybVwiKTtcblx0Y29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1pbnB1dFwiKTtcblxuXHRjb25zdCBkb21XZWF0aGVyRWxlbWVudHMgPSB7fTtcblx0ZnVuY3Rpb24gX3VwZGF0ZURvbSgpIHtcblx0XHRjdXJyZW50V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0ZWxlbWVudC5jbGFzc1xuXHRcdFx0KTtcblx0XHR9KTtcblx0fVxuXG5cdHNlYXJjaEZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBzZWFyY2hJbnB1dFZhbHVlID0gc2VhcmNoSW5wdXQudmFsdWU7XG5cdFx0YXdhaXQgc2V0RGF0YShzZWFyY2hJbnB1dFZhbHVlKTtcblx0XHRzZWFyY2hGb3JtLnJlc2V0KCk7XG5cdH0pO1xuXG5cdGxldCBzZWFyY2hJbnB1dEJ1ZmZlcjtcblx0Y29uc3QgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdCA9IGFzeW5jICh1bml0LCBmZWVsc2xpa2VVbml0KSA9PiB7XG5cdFx0Y3VycmVudFdlYXRoZXJFbGVtZW50c1swXS5kYXRhS2V5ID0gdW5pdDtcblx0XHRjdXJyZW50V2VhdGhlckVsZW1lbnRzWzJdLmRhdGFLZXkgPSBmZWVsc2xpa2VVbml0O1xuXHRcdF91cGRhdGVEb20oKTtcblx0XHRhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0QnVmZmVyKTtcblx0fTtcblxuXHRjb25zdCBsb2NhdGlvbk5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLWRhdGFcIik7XG5cdGNvbnN0IGxvY2F0aW9uRGF0ZUFuZFRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRhdGUtYW5kLXRpbWVcIik7XG5cblx0bGV0IHNldERhdGEgPSBhc3luYyAoaW5wdXRDaXR5KSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdF91cGRhdGVEb20oKTtcblx0XHRcdHNlYXJjaElucHV0QnVmZmVyID0gaW5wdXRDaXR5O1xuXHRcdFx0bGV0IGRhdGEgPSBhd2FpdCBmZXRjaERhdGEoaW5wdXRDaXR5KTtcblx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFx0aWYgKCFkYXRhLmN1cnJlbnQpIHRocm93IG5ldyBFcnJvcihkYXRhKTtcblx0XHRcdGxvY2F0aW9uTmFtZS50ZXh0Q29udGVudCA9XG5cdFx0XHRcdGRhdGEubG9jYXRpb24ubmFtZSArIFwiLCBcIiArIGRhdGEubG9jYXRpb24uY291bnRyeTtcblx0XHRcdGxvY2F0aW9uRGF0ZUFuZFRpbWUudGV4dENvbnRlbnQgPSBkYXRhLmxvY2F0aW9uLmxvY2FsdGltZTtcblxuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoXG5cdFx0XHRcdGN1cnJlbnRXZWF0aGVyRWxlbWVudHMubWFwKGFzeW5jIChlbGVtZW50KSA9PiB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwiY29uZGl0aW9uXCIpXG5cdFx0XHRcdFx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cblx0XHRcdFx0XHRcdFx0XHRkYXRhLmN1cnJlbnQuY29uZGl0aW9uLnRleHQ7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cblx0XHRcdFx0XHRcdFx0XHRNYXRoLnJvdW5kKGRhdGEuY3VycmVudFtlbGVtZW50LmRhdGFLZXldKTtcblxuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LmRhdGFLZXkgPT09IFwidGVtcF9jXCIgfHxcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5ID09PSBcImZlZWxzbGlrZV9jXCJcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz1cblx0XHRcdFx0XHRcdFx0XHRcIsKwQ1wiO1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ0ZW1wX2ZcIiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LmRhdGFLZXkgPT09IFwiZmVlbHNsaWtlX2ZcIlxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPVxuXHRcdFx0XHRcdFx0XHRcdFwiwrBGXCI7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgZWxlbWVudDpcIiwgZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0XHQvLyBhd2FpdCBQcm9taXNlLmFsbChcblx0XHRcdC8vIFx0Zm9yZWNhc3RXZWF0aGVyRWxlbWVudHMubWFwKGFzeW5jIChlbGVtZW50KSA9PiB7XG5cdFx0XHQvLyBcdFx0dHJ5IHtcblx0XHRcdC8vIFx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cblx0XHRcdC8vIFx0XHRcdFx0TWF0aC5yb3VuZChcblx0XHRcdC8vIFx0XHRcdFx0XHRkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5WzBdLmRheVtcblx0XHRcdC8vIFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleVxuXHRcdFx0Ly8gXHRcdFx0XHRcdF1cblx0XHRcdC8vIFx0XHRcdFx0KTtcblx0XHRcdC8vIFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Ly8gXHRcdFx0Y29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBlbGVtZW50OlwiLCBlcnJvcik7XG5cdFx0XHQvLyBcdFx0fVxuXHRcdFx0Ly8gXHR9KVxuXHRcdFx0Ly8gKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4geyBzZXREYXRhIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBEb21NYW5pcHVsYXRpb247XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEb21NYW5pcHVsYXRpb24gZnJvbSBcIi4vZG9tXCI7XG5Eb21NYW5pcHVsYXRpb24uc2V0RGF0YShcIkFtc3RlcmRhbVwiKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==