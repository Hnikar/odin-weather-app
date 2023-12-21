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
		{ selector: "weather-temp", dataKey: "temp_c" },
		{ selector: "weather-desc", dataKey: "condition" },
		{ selector: "weather-feels-like-anchor", dataKey: "feelslike_c" },

		{ selector: "wind", dataKey: "wind_kph" },
		{ selector: "humidity", dataKey: "humidity" },
		{ selector: "uvindex", dataKey: "uv" },
		{ selector: "visibility", dataKey: "vis_km" },
		{ selector: "cloudiness", dataKey: "cloud" },
	];

	const forecastWeatherElements = [
		[
			{ selector: "chance-of-rain", dataKey: "daily_chance_of_rain-0" },
			{ selector: "sunrise", dataKey: "sunrise-0" },
			{ selector: "sunset", dataKey: "sunset-0" },
			{ selector: "moon-phase", dataKey: "moon_phase-0" },
		],
		[
			{ selector: "weekly-forecast-temp-1", dataKey: "avgtemp_c-1" },
			{ selector: "weekly-forecast-wind-1", dataKey: "maxwind_kph-1" },
			{
				selector: "weekly-forecast-chance-of-rain-1",
				dataKey: "daily_chance_of_rain-1",
			},
		],
		[
			{ selector: "weekly-forecast-temp-2", dataKey: "avgtemp_c-2" },
			{ selector: "weekly-forecast-wind-2", dataKey: "maxwind_kph-2" },
			{
				selector: "weekly-forecast-chance-of-rain-2",
				dataKey: "daily_chance_of_rain-2",
			},
		],
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
			domWeatherElements[element.dataKey] = document.getElementById(
				element.selector
			);
		});
		forecastWeatherElements.forEach((day) => {
			day.forEach((element) => {
				domWeatherElements[element.dataKey] = document.getElementById(
					element.selector
				);
			});
		});
	}

	searchForm.addEventListener("submit", async function (event) {
		event.preventDefault();
		let searchInputValue = searchInput.value;
		await setData(searchInputValue);
		searchForm.reset();
	});

	// Дописать для forecast avgtemp_c/f
	let searchInputBuffer;
	const _updateTemperatureUnit = async (unit, feelslikeUnit) => {
		currentWeatherElements[0].dataKey = unit;
		currentWeatherElements[2].dataKey = feelslikeUnit;
		_updateDom();
		await setData(searchInputBuffer);
	};

	const locationName = document.querySelector(".location-data");
	const locationDateAndTime = document.querySelector(".date-and-time");

	async function _setCurrentWeather(data) {
		currentWeatherElements.forEach(async (element) => {
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
					domWeatherElements[element.dataKey].textContent += "°C";
				else if (
					element.dataKey === "temp_f" ||
					element.dataKey === "feelslike_f"
				)
					domWeatherElements[element.dataKey].textContent += "°F";
			} catch (error) {
				console.log("Error updating current weather element:", error);
			}
		});
	}

	async function _setForecast(data) {
		forecastWeatherElements.forEach((day, dayIndex) => {
			day.forEach((element) => {
				try {
					if (element.dataKey.slice(0, -2) === "daily_chance_of_rain")
						domWeatherElements[element.dataKey].textContent =
							data.forecast.forecastday[dayIndex].day[
								element.dataKey.slice(0, -2)
							] += "%";
					else if (dayIndex === 0) {
						domWeatherElements[element.dataKey].textContent =
							data.forecast.forecastday[dayIndex].astro[
								element.dataKey.slice(0, -2)
							];
					} else
						domWeatherElements[element.dataKey].textContent =
							data.forecast.forecastday[dayIndex].day[
								element.dataKey.slice(0, -2)
							];
				} catch (error) {
					console.log("Error updating forecast element:", error);
				}
			});
		});
	}

	async function setData(inputCity) {
		try {
			_updateDom();
			searchInputBuffer = inputCity;
			let data = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(inputCity);
			console.log(data);
			if (!data.current) throw new Error(data);
			locationName.textContent =
				data.location.name + ", " + data.location.country;
			locationDateAndTime.textContent = data.location.localtime;
			_setCurrentWeather(data);
			_setForecast(data);
		} catch (error) {
			console.log(error);
		}
	}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0EsbUVBQW1FLFFBQVEsR0FBRyxTQUFTOztBQUV2RjtBQUNBLHlDQUF5QyxjQUFjOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJLOztBQUU5QjtBQUNBO0FBQ0EsSUFBSSw2Q0FBNkM7QUFDakQsSUFBSSxnREFBZ0Q7QUFDcEQsSUFBSSwrREFBK0Q7O0FBRW5FLElBQUksdUNBQXVDO0FBQzNDLElBQUksMkNBQTJDO0FBQy9DLElBQUksb0NBQW9DO0FBQ3hDLElBQUksMkNBQTJDO0FBQy9DLElBQUksMENBQTBDO0FBQzlDOztBQUVBO0FBQ0E7QUFDQSxLQUFLLCtEQUErRDtBQUNwRSxLQUFLLDJDQUEyQztBQUNoRCxLQUFLLHlDQUF5QztBQUM5QyxLQUFLLGlEQUFpRDtBQUN0RDtBQUNBO0FBQ0EsS0FBSyw0REFBNEQ7QUFDakUsS0FBSyw4REFBOEQ7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxLQUFLLDREQUE0RDtBQUNqRSxLQUFLLDhEQUE4RDtBQUNuRTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGdEQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1YsQ0FBQzs7QUFFRCxpRUFBZSxlQUFlLEVBQUM7Ozs7Ozs7VUNqSy9CO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOb0M7QUFDcEMsNENBQWUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2FwaS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBUElfS0VZID0gXCJiYjE4ZmQ2NDAyZDA0Yzg1YTNhMjM0ODU2MjMyNDA4JnFcIjtcblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hEYXRhKGxvY2F0aW9uKSB7XG5cdGNvbnN0IGFwaVVybCA9IGBodHRwczovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9mb3JlY2FzdC5qc29uP2tleT0ke0FQSV9LRVl9PSR7bG9jYXRpb259JmRheXM9M2A7XG5cblx0dHJ5IHtcblx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGFwaVVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcblxuXHRcdGlmICghcmVzcG9uc2Uub2spIHtcblx0XHRcdGNvbnN0IGVycm9yRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvckRhdGEuZXJyb3IubWVzc2FnZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gZXJyb3IubWVzc2FnZTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBmZXRjaERhdGE7XG4iLCJpbXBvcnQgZmV0Y2hEYXRhIGZyb20gXCIuL2FwaVwiO1xuXG5jb25zdCBEb21NYW5pcHVsYXRpb24gPSAoKCkgPT4ge1xuXHRjb25zdCBjdXJyZW50V2VhdGhlckVsZW1lbnRzID0gW1xuXHRcdHsgc2VsZWN0b3I6IFwid2VhdGhlci10ZW1wXCIsIGRhdGFLZXk6IFwidGVtcF9jXCIgfSxcblx0XHR7IHNlbGVjdG9yOiBcIndlYXRoZXItZGVzY1wiLCBkYXRhS2V5OiBcImNvbmRpdGlvblwiIH0sXG5cdFx0eyBzZWxlY3RvcjogXCJ3ZWF0aGVyLWZlZWxzLWxpa2UtYW5jaG9yXCIsIGRhdGFLZXk6IFwiZmVlbHNsaWtlX2NcIiB9LFxuXG5cdFx0eyBzZWxlY3RvcjogXCJ3aW5kXCIsIGRhdGFLZXk6IFwid2luZF9rcGhcIiB9LFxuXHRcdHsgc2VsZWN0b3I6IFwiaHVtaWRpdHlcIiwgZGF0YUtleTogXCJodW1pZGl0eVwiIH0sXG5cdFx0eyBzZWxlY3RvcjogXCJ1dmluZGV4XCIsIGRhdGFLZXk6IFwidXZcIiB9LFxuXHRcdHsgc2VsZWN0b3I6IFwidmlzaWJpbGl0eVwiLCBkYXRhS2V5OiBcInZpc19rbVwiIH0sXG5cdFx0eyBzZWxlY3RvcjogXCJjbG91ZGluZXNzXCIsIGRhdGFLZXk6IFwiY2xvdWRcIiB9LFxuXHRdO1xuXG5cdGNvbnN0IGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzID0gW1xuXHRcdFtcblx0XHRcdHsgc2VsZWN0b3I6IFwiY2hhbmNlLW9mLXJhaW5cIiwgZGF0YUtleTogXCJkYWlseV9jaGFuY2Vfb2ZfcmFpbi0wXCIgfSxcblx0XHRcdHsgc2VsZWN0b3I6IFwic3VucmlzZVwiLCBkYXRhS2V5OiBcInN1bnJpc2UtMFwiIH0sXG5cdFx0XHR7IHNlbGVjdG9yOiBcInN1bnNldFwiLCBkYXRhS2V5OiBcInN1bnNldC0wXCIgfSxcblx0XHRcdHsgc2VsZWN0b3I6IFwibW9vbi1waGFzZVwiLCBkYXRhS2V5OiBcIm1vb25fcGhhc2UtMFwiIH0sXG5cdFx0XSxcblx0XHRbXG5cdFx0XHR7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC10ZW1wLTFcIiwgZGF0YUtleTogXCJhdmd0ZW1wX2MtMVwiIH0sXG5cdFx0XHR7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC13aW5kLTFcIiwgZGF0YUtleTogXCJtYXh3aW5kX2twaC0xXCIgfSxcblx0XHRcdHtcblx0XHRcdFx0c2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LWNoYW5jZS1vZi1yYWluLTFcIixcblx0XHRcdFx0ZGF0YUtleTogXCJkYWlseV9jaGFuY2Vfb2ZfcmFpbi0xXCIsXG5cdFx0XHR9LFxuXHRcdF0sXG5cdFx0W1xuXHRcdFx0eyBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3QtdGVtcC0yXCIsIGRhdGFLZXk6IFwiYXZndGVtcF9jLTJcIiB9LFxuXHRcdFx0eyBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3Qtd2luZC0yXCIsIGRhdGFLZXk6IFwibWF4d2luZF9rcGgtMlwiIH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC1jaGFuY2Utb2YtcmFpbi0yXCIsXG5cdFx0XHRcdGRhdGFLZXk6IFwiZGFpbHlfY2hhbmNlX29mX3JhaW4tMlwiLFxuXHRcdFx0fSxcblx0XHRdLFxuXHRdO1xuXG5cdGNvbnN0IGZhcmVuaGVpdFRlbXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZhcmVuaGVpdC1idG5cIik7XG5cdGNvbnN0IGNlbHNpdXNUZW1wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjZWxzaXVzLWJ0blwiKTtcblxuXHRmYXJlbmhlaXRUZW1wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdChcInRlbXBfZlwiLCBcImZlZWxzbGlrZV9mXCIpO1xuXHR9KTtcblxuXHRjZWxzaXVzVGVtcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQoXCJ0ZW1wX2NcIiwgXCJmZWVsc2xpa2VfY1wiKTtcblx0fSk7XG5cblx0Y29uc3Qgc2VhcmNoRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWZvcm1cIik7XG5cdGNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtaW5wdXRcIik7XG5cblx0Y29uc3QgZG9tV2VhdGhlckVsZW1lbnRzID0ge307XG5cdGZ1bmN0aW9uIF91cGRhdGVEb20oKSB7XG5cdFx0Y3VycmVudFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRlbGVtZW50LnNlbGVjdG9yXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHRcdGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGRheSkgPT4ge1xuXHRcdFx0ZGF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcblx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcdFx0XHRlbGVtZW50LnNlbGVjdG9yXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHNlYXJjaEZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBzZWFyY2hJbnB1dFZhbHVlID0gc2VhcmNoSW5wdXQudmFsdWU7XG5cdFx0YXdhaXQgc2V0RGF0YShzZWFyY2hJbnB1dFZhbHVlKTtcblx0XHRzZWFyY2hGb3JtLnJlc2V0KCk7XG5cdH0pO1xuXG5cdC8vINCU0L7Qv9C40YHQsNGC0Ywg0LTQu9GPIGZvcmVjYXN0IGF2Z3RlbXBfYy9mXG5cdGxldCBzZWFyY2hJbnB1dEJ1ZmZlcjtcblx0Y29uc3QgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdCA9IGFzeW5jICh1bml0LCBmZWVsc2xpa2VVbml0KSA9PiB7XG5cdFx0Y3VycmVudFdlYXRoZXJFbGVtZW50c1swXS5kYXRhS2V5ID0gdW5pdDtcblx0XHRjdXJyZW50V2VhdGhlckVsZW1lbnRzWzJdLmRhdGFLZXkgPSBmZWVsc2xpa2VVbml0O1xuXHRcdF91cGRhdGVEb20oKTtcblx0XHRhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0QnVmZmVyKTtcblx0fTtcblxuXHRjb25zdCBsb2NhdGlvbk5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLWRhdGFcIik7XG5cdGNvbnN0IGxvY2F0aW9uRGF0ZUFuZFRpbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRhdGUtYW5kLXRpbWVcIik7XG5cblx0YXN5bmMgZnVuY3Rpb24gX3NldEN1cnJlbnRXZWF0aGVyKGRhdGEpIHtcblx0XHRjdXJyZW50V2VhdGhlckVsZW1lbnRzLmZvckVhY2goYXN5bmMgKGVsZW1lbnQpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwiY29uZGl0aW9uXCIpXG5cdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxuXHRcdFx0XHRcdFx0ZGF0YS5jdXJyZW50LmNvbmRpdGlvbi50ZXh0O1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxuXHRcdFx0XHRcdFx0TWF0aC5yb3VuZChkYXRhLmN1cnJlbnRbZWxlbWVudC5kYXRhS2V5XSk7XG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ0ZW1wX2NcIiB8fFxuXHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJmZWVsc2xpa2VfY1wiXG5cdFx0XHRcdClcblx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwQ1wiO1xuXHRcdFx0XHRlbHNlIGlmIChcblx0XHRcdFx0XHRlbGVtZW50LmRhdGFLZXkgPT09IFwidGVtcF9mXCIgfHxcblx0XHRcdFx0XHRlbGVtZW50LmRhdGFLZXkgPT09IFwiZmVlbHNsaWtlX2ZcIlxuXHRcdFx0XHQpXG5cdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCLCsEZcIjtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgY3VycmVudCB3ZWF0aGVyIGVsZW1lbnQ6XCIsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGFzeW5jIGZ1bmN0aW9uIF9zZXRGb3JlY2FzdChkYXRhKSB7XG5cdFx0Zm9yZWNhc3RXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZGF5LCBkYXlJbmRleCkgPT4ge1xuXHRcdFx0ZGF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJkYWlseV9jaGFuY2Vfb2ZfcmFpblwiKVxuXHRcdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxuXHRcdFx0XHRcdFx0XHRkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5W2RheUluZGV4XS5kYXlbXG5cdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKVxuXHRcdFx0XHRcdFx0XHRdICs9IFwiJVwiO1xuXHRcdFx0XHRcdGVsc2UgaWYgKGRheUluZGV4ID09PSAwKSB7XG5cdFx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XG5cdFx0XHRcdFx0XHRcdGRhdGEuZm9yZWNhc3QuZm9yZWNhc3RkYXlbZGF5SW5kZXhdLmFzdHJvW1xuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMilcblx0XHRcdFx0XHRcdFx0XTtcblx0XHRcdFx0XHR9IGVsc2Vcblx0XHRcdFx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cblx0XHRcdFx0XHRcdFx0ZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uZGF5W1xuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMilcblx0XHRcdFx0XHRcdFx0XTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkVycm9yIHVwZGF0aW5nIGZvcmVjYXN0IGVsZW1lbnQ6XCIsIGVycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBzZXREYXRhKGlucHV0Q2l0eSkge1xuXHRcdHRyeSB7XG5cdFx0XHRfdXBkYXRlRG9tKCk7XG5cdFx0XHRzZWFyY2hJbnB1dEJ1ZmZlciA9IGlucHV0Q2l0eTtcblx0XHRcdGxldCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKGlucHV0Q2l0eSk7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHRcdGlmICghZGF0YS5jdXJyZW50KSB0aHJvdyBuZXcgRXJyb3IoZGF0YSk7XG5cdFx0XHRsb2NhdGlvbk5hbWUudGV4dENvbnRlbnQgPVxuXHRcdFx0XHRkYXRhLmxvY2F0aW9uLm5hbWUgKyBcIiwgXCIgKyBkYXRhLmxvY2F0aW9uLmNvdW50cnk7XG5cdFx0XHRsb2NhdGlvbkRhdGVBbmRUaW1lLnRleHRDb250ZW50ID0gZGF0YS5sb2NhdGlvbi5sb2NhbHRpbWU7XG5cdFx0XHRfc2V0Q3VycmVudFdlYXRoZXIoZGF0YSk7XG5cdFx0XHRfc2V0Rm9yZWNhc3QoZGF0YSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4geyBzZXREYXRhIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBEb21NYW5pcHVsYXRpb247XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEb21NYW5pcHVsYXRpb24gZnJvbSBcIi4vZG9tXCI7XG5Eb21NYW5pcHVsYXRpb24uc2V0RGF0YShcIkFtc3RlcmRhbVwiKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==