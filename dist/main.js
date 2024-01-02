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
	//попробуй убрать slice приколы, тебе нужен один и тот же адресс
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

		forecastWeatherElements.forEach((day, dayIndex) => {
			day.forEach((element) => {
				if (
					element.dataKey.slice(0, -2) === "avgtemp_c" ||
					element.dataKey.slice(0, -2) === "avgtemp_f"
				) {
					element.dataKey = `avg${unit}-${dayIndex}`;
					console.log(element.dataKey);
				}
			});
		});

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
					if (dayIndex === 0) {
						domWeatherElements[element.dataKey].textContent =
							data.forecast.forecastday[dayIndex].astro[
								element.dataKey.slice(0, -2)
							];
					} else
						domWeatherElements[element.dataKey].textContent =
							data.forecast.forecastday[dayIndex].day[
								element.dataKey.slice(0, -2)
							];

					if (element.dataKey.slice(0, -2) === "avgtemp_c")
						domWeatherElements[element.dataKey].textContent += "°C";
					else if (element.dataKey.slice(0, -2) === "avgtemp_f")
						domWeatherElements[element.dataKey].textContent += "°F";
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

//add kmph amd mpf difference


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0EsbUVBQW1FLFFBQVEsR0FBRyxTQUFTOztBQUV2RjtBQUNBLHlDQUF5QyxjQUFjOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJLOztBQUU5QjtBQUNBO0FBQ0EsSUFBSSw2Q0FBNkM7QUFDakQsSUFBSSxnREFBZ0Q7QUFDcEQsSUFBSSwrREFBK0Q7O0FBRW5FLElBQUksdUNBQXVDO0FBQzNDLElBQUksMkNBQTJDO0FBQy9DLElBQUksb0NBQW9DO0FBQ3hDLElBQUksMkNBQTJDO0FBQy9DLElBQUksMENBQTBDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSywrREFBK0Q7QUFDcEUsS0FBSywyQ0FBMkM7QUFDaEQsS0FBSyx5Q0FBeUM7QUFDOUMsS0FBSyxpREFBaUQ7QUFDdEQ7QUFDQTtBQUNBLEtBQUssNERBQTREO0FBQ2pFLEtBQUssOERBQThEO0FBQ25FO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsS0FBSyw0REFBNEQ7QUFDakUsS0FBSyw4REFBOEQ7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixLQUFLLEdBQUcsU0FBUztBQUM5QztBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnREFBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWLENBQUM7O0FBRUQsaUVBQWUsZUFBZSxFQUFDOztBQUUvQjs7Ozs7OztVQ3JMQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQ3BDLDRDQUFlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVBJX0tFWSA9IFwiYmIxOGZkNjQwMmQwNGM4NWEzYTIzNDg1NjIzMjQwOCZxXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoRGF0YShsb2NhdGlvbikge1xuXHRjb25zdCBhcGlVcmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvZm9yZWNhc3QuanNvbj9rZXk9JHtBUElfS0VZfT0ke2xvY2F0aW9ufSZkYXlzPTNgO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhcGlVcmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XG5cblx0XHRpZiAoIXJlc3BvbnNlLm9rKSB7XG5cdFx0XHRjb25zdCBlcnJvckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3JEYXRhLmVycm9yLm1lc3NhZ2UpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIGVycm9yLm1lc3NhZ2U7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hEYXRhO1xuIiwiaW1wb3J0IGZldGNoRGF0YSBmcm9tIFwiLi9hcGlcIjtcblxuY29uc3QgRG9tTWFuaXB1bGF0aW9uID0gKCgpID0+IHtcblx0Y29uc3QgY3VycmVudFdlYXRoZXJFbGVtZW50cyA9IFtcblx0XHR7IHNlbGVjdG9yOiBcIndlYXRoZXItdGVtcFwiLCBkYXRhS2V5OiBcInRlbXBfY1wiIH0sXG5cdFx0eyBzZWxlY3RvcjogXCJ3ZWF0aGVyLWRlc2NcIiwgZGF0YUtleTogXCJjb25kaXRpb25cIiB9LFxuXHRcdHsgc2VsZWN0b3I6IFwid2VhdGhlci1mZWVscy1saWtlLWFuY2hvclwiLCBkYXRhS2V5OiBcImZlZWxzbGlrZV9jXCIgfSxcblxuXHRcdHsgc2VsZWN0b3I6IFwid2luZFwiLCBkYXRhS2V5OiBcIndpbmRfa3BoXCIgfSxcblx0XHR7IHNlbGVjdG9yOiBcImh1bWlkaXR5XCIsIGRhdGFLZXk6IFwiaHVtaWRpdHlcIiB9LFxuXHRcdHsgc2VsZWN0b3I6IFwidXZpbmRleFwiLCBkYXRhS2V5OiBcInV2XCIgfSxcblx0XHR7IHNlbGVjdG9yOiBcInZpc2liaWxpdHlcIiwgZGF0YUtleTogXCJ2aXNfa21cIiB9LFxuXHRcdHsgc2VsZWN0b3I6IFwiY2xvdWRpbmVzc1wiLCBkYXRhS2V5OiBcImNsb3VkXCIgfSxcblx0XTtcblx0Ly/Qv9C+0L/RgNC+0LHRg9C5INGD0LHRgNCw0YLRjCBzbGljZSDQv9GA0LjQutC+0LvRiywg0YLQtdCx0LUg0L3Rg9C20LXQvSDQvtC00LjQvSDQuCDRgtC+0YIg0LbQtSDQsNC00YDQtdGB0YFcblx0Y29uc3QgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMgPSBbXG5cdFx0W1xuXHRcdFx0eyBzZWxlY3RvcjogXCJjaGFuY2Utb2YtcmFpblwiLCBkYXRhS2V5OiBcImRhaWx5X2NoYW5jZV9vZl9yYWluLTBcIiB9LFxuXHRcdFx0eyBzZWxlY3RvcjogXCJzdW5yaXNlXCIsIGRhdGFLZXk6IFwic3VucmlzZS0wXCIgfSxcblx0XHRcdHsgc2VsZWN0b3I6IFwic3Vuc2V0XCIsIGRhdGFLZXk6IFwic3Vuc2V0LTBcIiB9LFxuXHRcdFx0eyBzZWxlY3RvcjogXCJtb29uLXBoYXNlXCIsIGRhdGFLZXk6IFwibW9vbl9waGFzZS0wXCIgfSxcblx0XHRdLFxuXHRcdFtcblx0XHRcdHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXRlbXAtMVwiLCBkYXRhS2V5OiBcImF2Z3RlbXBfYy0xXCIgfSxcblx0XHRcdHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXdpbmQtMVwiLCBkYXRhS2V5OiBcIm1heHdpbmRfa3BoLTFcIiB9LFxuXHRcdFx0e1xuXHRcdFx0XHRzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3QtY2hhbmNlLW9mLXJhaW4tMVwiLFxuXHRcdFx0XHRkYXRhS2V5OiBcImRhaWx5X2NoYW5jZV9vZl9yYWluLTFcIixcblx0XHRcdH0sXG5cdFx0XSxcblx0XHRbXG5cdFx0XHR7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC10ZW1wLTJcIiwgZGF0YUtleTogXCJhdmd0ZW1wX2MtMlwiIH0sXG5cdFx0XHR7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC13aW5kLTJcIiwgZGF0YUtleTogXCJtYXh3aW5kX2twaC0yXCIgfSxcblx0XHRcdHtcblx0XHRcdFx0c2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LWNoYW5jZS1vZi1yYWluLTJcIixcblx0XHRcdFx0ZGF0YUtleTogXCJkYWlseV9jaGFuY2Vfb2ZfcmFpbi0yXCIsXG5cdFx0XHR9LFxuXHRcdF0sXG5cdF07XG5cblx0Y29uc3QgZmFyZW5oZWl0VGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmFyZW5oZWl0LWJ0blwiKTtcblx0Y29uc3QgY2Vsc2l1c1RlbXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNlbHNpdXMtYnRuXCIpO1xuXG5cdGZhcmVuaGVpdFRlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0KFwidGVtcF9mXCIsIFwiZmVlbHNsaWtlX2ZcIik7XG5cdH0pO1xuXG5cdGNlbHNpdXNUZW1wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdChcInRlbXBfY1wiLCBcImZlZWxzbGlrZV9jXCIpO1xuXHR9KTtcblxuXHRjb25zdCBzZWFyY2hGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtZm9ybVwiKTtcblx0Y29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1pbnB1dFwiKTtcblxuXHRjb25zdCBkb21XZWF0aGVyRWxlbWVudHMgPSB7fTtcblx0ZnVuY3Rpb24gX3VwZGF0ZURvbSgpIHtcblx0XHRjdXJyZW50V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG5cdFx0XHRcdGVsZW1lbnQuc2VsZWN0b3Jcblx0XHRcdCk7XG5cdFx0fSk7XG5cdFx0Zm9yZWNhc3RXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZGF5KSA9PiB7XG5cdFx0XHRkYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuXHRcdFx0XHRcdGVsZW1lbnQuc2VsZWN0b3Jcblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0c2VhcmNoRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IHNlYXJjaElucHV0VmFsdWUgPSBzZWFyY2hJbnB1dC52YWx1ZTtcblx0XHRhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0VmFsdWUpO1xuXHRcdHNlYXJjaEZvcm0ucmVzZXQoKTtcblx0fSk7XG5cblx0Ly8g0JTQvtC/0LjRgdCw0YLRjCDQtNC70Y8gZm9yZWNhc3QgYXZndGVtcF9jL2Zcblx0bGV0IHNlYXJjaElucHV0QnVmZmVyO1xuXHRjb25zdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0ID0gYXN5bmMgKHVuaXQsIGZlZWxzbGlrZVVuaXQpID0+IHtcblx0XHRjdXJyZW50V2VhdGhlckVsZW1lbnRzWzBdLmRhdGFLZXkgPSB1bml0O1xuXHRcdGN1cnJlbnRXZWF0aGVyRWxlbWVudHNbMl0uZGF0YUtleSA9IGZlZWxzbGlrZVVuaXQ7XG5cblx0XHRmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXksIGRheUluZGV4KSA9PiB7XG5cdFx0XHRkYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJhdmd0ZW1wX2NcIiB8fFxuXHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9mXCJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5ID0gYGF2ZyR7dW5pdH0tJHtkYXlJbmRleH1gO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQuZGF0YUtleSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0X3VwZGF0ZURvbSgpO1xuXHRcdGF3YWl0IHNldERhdGEoc2VhcmNoSW5wdXRCdWZmZXIpO1xuXHR9O1xuXG5cdGNvbnN0IGxvY2F0aW9uTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jYXRpb24tZGF0YVwiKTtcblx0Y29uc3QgbG9jYXRpb25EYXRlQW5kVGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0ZS1hbmQtdGltZVwiKTtcblxuXHRhc3luYyBmdW5jdGlvbiBfc2V0Q3VycmVudFdlYXRoZXIoZGF0YSkge1xuXHRcdGN1cnJlbnRXZWF0aGVyRWxlbWVudHMuZm9yRWFjaChhc3luYyAoZWxlbWVudCkgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJjb25kaXRpb25cIilcblx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XG5cdFx0XHRcdFx0XHRkYXRhLmN1cnJlbnQuY29uZGl0aW9uLnRleHQ7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XG5cdFx0XHRcdFx0XHRNYXRoLnJvdW5kKGRhdGEuY3VycmVudFtlbGVtZW50LmRhdGFLZXldKTtcblxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5ID09PSBcInRlbXBfY1wiIHx8XG5cdFx0XHRcdFx0ZWxlbWVudC5kYXRhS2V5ID09PSBcImZlZWxzbGlrZV9jXCJcblx0XHRcdFx0KVxuXHRcdFx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBDXCI7XG5cdFx0XHRcdGVsc2UgaWYgKFxuXHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ0ZW1wX2ZcIiB8fFxuXHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleSA9PT0gXCJmZWVsc2xpa2VfZlwiXG5cdFx0XHRcdClcblx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwRlwiO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBjdXJyZW50IHdlYXRoZXIgZWxlbWVudDpcIiwgZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0YXN5bmMgZnVuY3Rpb24gX3NldEZvcmVjYXN0KGRhdGEpIHtcblx0XHRmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXksIGRheUluZGV4KSA9PiB7XG5cdFx0XHRkYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcImRhaWx5X2NoYW5jZV9vZl9yYWluXCIpXG5cdFx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XG5cdFx0XHRcdFx0XHRcdGRhdGEuZm9yZWNhc3QuZm9yZWNhc3RkYXlbZGF5SW5kZXhdLmRheVtcblx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXG5cdFx0XHRcdFx0XHRcdF0gKz0gXCIlXCI7XG5cdFx0XHRcdFx0aWYgKGRheUluZGV4ID09PSAwKSB7XG5cdFx0XHRcdFx0XHRkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XG5cdFx0XHRcdFx0XHRcdGRhdGEuZm9yZWNhc3QuZm9yZWNhc3RkYXlbZGF5SW5kZXhdLmFzdHJvW1xuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMilcblx0XHRcdFx0XHRcdFx0XTtcblx0XHRcdFx0XHR9IGVsc2Vcblx0XHRcdFx0XHRcdGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cblx0XHRcdFx0XHRcdFx0ZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uZGF5W1xuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMilcblx0XHRcdFx0XHRcdFx0XTtcblxuXHRcdFx0XHRcdGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcImF2Z3RlbXBfY1wiKVxuXHRcdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCLCsENcIjtcblx0XHRcdFx0XHRlbHNlIGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcImF2Z3RlbXBfZlwiKVxuXHRcdFx0XHRcdFx0ZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCLCsEZcIjtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkVycm9yIHVwZGF0aW5nIGZvcmVjYXN0IGVsZW1lbnQ6XCIsIGVycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBzZXREYXRhKGlucHV0Q2l0eSkge1xuXHRcdHRyeSB7XG5cdFx0XHRfdXBkYXRlRG9tKCk7XG5cdFx0XHRzZWFyY2hJbnB1dEJ1ZmZlciA9IGlucHV0Q2l0eTtcblx0XHRcdGxldCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKGlucHV0Q2l0eSk7XG5cdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHRcdGlmICghZGF0YS5jdXJyZW50KSB0aHJvdyBuZXcgRXJyb3IoZGF0YSk7XG5cdFx0XHRsb2NhdGlvbk5hbWUudGV4dENvbnRlbnQgPVxuXHRcdFx0XHRkYXRhLmxvY2F0aW9uLm5hbWUgKyBcIiwgXCIgKyBkYXRhLmxvY2F0aW9uLmNvdW50cnk7XG5cdFx0XHRsb2NhdGlvbkRhdGVBbmRUaW1lLnRleHRDb250ZW50ID0gZGF0YS5sb2NhdGlvbi5sb2NhbHRpbWU7XG5cdFx0XHRfc2V0Q3VycmVudFdlYXRoZXIoZGF0YSk7XG5cdFx0XHRfc2V0Rm9yZWNhc3QoZGF0YSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4geyBzZXREYXRhIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBEb21NYW5pcHVsYXRpb247XG5cbi8vYWRkIGttcGggYW1kIG1wZiBkaWZmZXJlbmNlXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEb21NYW5pcHVsYXRpb24gZnJvbSBcIi4vZG9tXCI7XG5Eb21NYW5pcHVsYXRpb24uc2V0RGF0YShcIkFtc3RlcmRhbVwiKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==