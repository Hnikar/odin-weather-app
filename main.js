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
	const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}=${location}`;

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
	const weatherElementsArr = [
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
		weatherElementsArr.forEach((element) => {
			domWeatherElements[element.dataKey] = document.querySelector(
				element.class
			);
		});
	}

	searchForm.addEventListener("submit", async function (event) {
		event.preventDefault();
		let searchInputValue = searchInput.value;
		await setData(searchInputValue);
	});

	let searchInputBuffer;
	const _updateTemperatureUnit = async (unit, feelslikeUnit) => {
		weatherElementsArr[0].dataKey = unit;
		weatherElementsArr[2].dataKey = feelslikeUnit;
		_updateDom();
		await setData(searchInputBuffer);
	};

	const locationName = document.querySelector(".city-name");
	const locationDateAndTime = document.querySelector(".date-and-time");

	let setData = async (inputCity) => {
		try {
			_updateDom();
			searchInputBuffer = inputCity;
			let data = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(inputCity);
			console.log(data);
			if (!data.current) throw new Error(data);

			locationName.textContent = data.location.name;
			locationDateAndTime.textContent = data.location.localtime;

			await Promise.all(
				weatherElementsArr.map(async (element) => {
					try {
						if (element.dataKey === "condition")
							domWeatherElements[element.dataKey].textContent =
								data.current.condition.text;
						else
							domWeatherElements[element.dataKey].textContent =
								data.current[element.dataKey];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0Esa0VBQWtFLFFBQVEsR0FBRyxTQUFTOztBQUV0RjtBQUNBLHlDQUF5QyxjQUFjOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJLOztBQUU5QjtBQUNBO0FBQ0EsSUFBSSwyQ0FBMkM7QUFDL0MsSUFBSSw4Q0FBOEM7QUFDbEQsSUFBSSw2REFBNkQ7O0FBRWpFLElBQUkscUNBQXFDO0FBQ3pDLElBQUkseUNBQXlDO0FBQzdDLElBQUksa0NBQWtDO0FBQ3RDLElBQUkseUNBQXlDO0FBQzdDLElBQUksd0NBQXdDO0FBQzVDLElBQUksaURBQWlEO0FBQ3JEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsZ0RBQVM7QUFDN0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWLENBQUM7O0FBRUQsaUVBQWUsZUFBZSxFQUFDOzs7Ozs7O1VDdEcvQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQ3BDLDRDQUFlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVBJX0tFWSA9IFwiYmIxOGZkNjQwMmQwNGM4NWEzYTIzNDg1NjIzMjQwOCZxXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoRGF0YShsb2NhdGlvbikge1xuXHRjb25zdCBhcGlVcmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvY3VycmVudC5qc29uP2tleT0ke0FQSV9LRVl9PSR7bG9jYXRpb259YDtcblxuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xuXG5cdFx0aWYgKCFyZXNwb25zZS5vaykge1xuXHRcdFx0Y29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yRGF0YS5lcnJvci5tZXNzYWdlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiBlcnJvci5tZXNzYWdlO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZldGNoRGF0YTtcbiIsImltcG9ydCBmZXRjaERhdGEgZnJvbSBcIi4vYXBpXCI7XG5cbmNvbnN0IERvbU1hbmlwdWxhdGlvbiA9ICgoKSA9PiB7XG5cdGNvbnN0IHdlYXRoZXJFbGVtZW50c0FyciA9IFtcblx0XHR7IGNsYXNzOiBcIi53ZWF0aGVyLXRlbXBcIiwgZGF0YUtleTogXCJ0ZW1wX2NcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLndlYXRoZXItZGVzY1wiLCBkYXRhS2V5OiBcImNvbmRpdGlvblwiIH0sXG5cdFx0eyBjbGFzczogXCIud2VhdGhlci1mZWVscy1saWtlLWFuY2hvclwiLCBkYXRhS2V5OiBcImZlZWxzbGlrZV9jXCIgfSxcblxuXHRcdHsgY2xhc3M6IFwiLndpbmRcIiwgZGF0YUtleTogXCJ3aW5kX2twaFwiIH0sXG5cdFx0eyBjbGFzczogXCIuaHVtaWRpdHlcIiwgZGF0YUtleTogXCJodW1pZGl0eVwiIH0sXG5cdFx0eyBjbGFzczogXCIudXZpbmRleFwiLCBkYXRhS2V5OiBcInV2XCIgfSxcblx0XHR7IGNsYXNzOiBcIi52aXNpYmlsaXR5XCIsIGRhdGFLZXk6IFwidmlzX2ttXCIgfSxcblx0XHR7IGNsYXNzOiBcIi5jbG91ZGluZXNzXCIsIGRhdGFLZXk6IFwiY2xvdWRcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLmNoYW5jZW9mcmFpblwiLCBkYXRhS2V5OiBcImNoYW5jZW9mcmFpblwiIH0sXG5cdF07XG5cblx0Y29uc3QgZmFyZW5oZWl0VGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmFyZW5oZWl0LWJ0blwiKTtcblx0Y29uc3QgY2Vsc2l1c1RlbXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNlbHNpdXMtYnRuXCIpO1xuXG5cdGZhcmVuaGVpdFRlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0KFwidGVtcF9mXCIsIFwiZmVlbHNsaWtlX2ZcIik7XG5cdH0pO1xuXG5cdGNlbHNpdXNUZW1wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdChcInRlbXBfY1wiLCBcImZlZWxzbGlrZV9jXCIpO1xuXHR9KTtcblxuXHRjb25zdCBzZWFyY2hGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtZm9ybVwiKTtcblx0Y29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1pbnB1dFwiKTtcblxuXHRjb25zdCBkb21XZWF0aGVyRWxlbWVudHMgPSB7fTtcblx0ZnVuY3Rpb24gX3VwZGF0ZURvbSgpIHtcblx0XHR3ZWF0aGVyRWxlbWVudHNBcnIuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRlbGVtZW50LmNsYXNzXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2VhcmNoRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IHNlYXJjaElucHV0VmFsdWUgPSBzZWFyY2hJbnB1dC52YWx1ZTtcblx0XHRhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0VmFsdWUpO1xuXHR9KTtcblxuXHRsZXQgc2VhcmNoSW5wdXRCdWZmZXI7XG5cdGNvbnN0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQgPSBhc3luYyAodW5pdCwgZmVlbHNsaWtlVW5pdCkgPT4ge1xuXHRcdHdlYXRoZXJFbGVtZW50c0FyclswXS5kYXRhS2V5ID0gdW5pdDtcblx0XHR3ZWF0aGVyRWxlbWVudHNBcnJbMl0uZGF0YUtleSA9IGZlZWxzbGlrZVVuaXQ7XG5cdFx0X3VwZGF0ZURvbSgpO1xuXHRcdGF3YWl0IHNldERhdGEoc2VhcmNoSW5wdXRCdWZmZXIpO1xuXHR9O1xuXG5cdGNvbnN0IGxvY2F0aW9uTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2l0eS1uYW1lXCIpO1xuXHRjb25zdCBsb2NhdGlvbkRhdGVBbmRUaW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRlLWFuZC10aW1lXCIpO1xuXG5cdGxldCBzZXREYXRhID0gYXN5bmMgKGlucHV0Q2l0eSkgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRfdXBkYXRlRG9tKCk7XG5cdFx0XHRzZWFyY2hJbnB1dEJ1ZmZlciA9IGlucHV0Q2l0eTtcblx0XHRcdGxldCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKGlucHV0Q2l0eSk7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHRcdGlmICghZGF0YS5jdXJyZW50KSB0aHJvdyBuZXcgRXJyb3IoZGF0YSk7XG5cblx0XHRcdGxvY2F0aW9uTmFtZS50ZXh0Q29udGVudCA9IGRhdGEubG9jYXRpb24ubmFtZTtcblx0XHRcdGxvY2F0aW9uRGF0ZUFuZFRpbWUudGV4dENvbnRlbnQgPSBkYXRhLmxvY2F0aW9uLmxvY2FsdGltZTtcblxuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoXG5cdFx0XHRcdHdlYXRoZXJFbGVtZW50c0Fyci5tYXAoYXN5bmMgKGVsZW1lbnQpID0+IHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJjb25kaXRpb25cIilcblx0XHRcdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxuXHRcdFx0XHRcdFx0XHRcdGRhdGEuY3VycmVudC5jb25kaXRpb24udGV4dDtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxuXHRcdFx0XHRcdFx0XHRcdGRhdGEuY3VycmVudFtlbGVtZW50LmRhdGFLZXldO1xuXG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ0ZW1wX2NcIiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LmRhdGFLZXkgPT09IFwiZmVlbHNsaWtlX2NcIlxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPVxuXHRcdFx0XHRcdFx0XHRcdFwiwrBDXCI7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5ID09PSBcInRlbXBfZlwiIHx8XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJmZWVsc2xpa2VfZlwiXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9XG5cdFx0XHRcdFx0XHRcdFx0XCLCsEZcIjtcblx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBlbGVtZW50OlwiLCBlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0KTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4geyBzZXREYXRhIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBEb21NYW5pcHVsYXRpb247XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEb21NYW5pcHVsYXRpb24gZnJvbSBcIi4vZG9tXCI7XG5Eb21NYW5pcHVsYXRpb24uc2V0RGF0YShcIkFtc3RlcmRhbVwiKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==