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
          domWeatherElements[element.dataKey].textContent = Math.round(
            data.current[element.dataKey]
          );

        if (element.dataKey === "temp_c" || element.dataKey === "feelslike_c")
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
          if (dayIndex === 0) {
            domWeatherElements[element.dataKey].textContent =
              data.forecast.forecastday[dayIndex].astro[
                element.dataKey.slice(0, -2)
              ];
            if (element.dataKey.slice(0, -2) === "daily_chance_of_rain") {
              domWeatherElements[element.dataKey].textContent =
                data.forecast.forecastday[dayIndex].day[
                  element.dataKey.slice(0, -2)
                ] += "%";
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZXItYXBwLy4vc3JjL2FwaS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBUElfS0VZID0gXCJiYjE4ZmQ2NDAyZDA0Yzg1YTNhMjM0ODU2MjMyNDA4JnFcIjtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZldGNoRGF0YShsb2NhdGlvbikge1xyXG5cdGNvbnN0IGFwaVVybCA9IGBodHRwczovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9mb3JlY2FzdC5qc29uP2tleT0ke0FQSV9LRVl9PSR7bG9jYXRpb259JmRheXM9M2A7XHJcblxyXG5cdHRyeSB7XHJcblx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGFwaVVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcclxuXHJcblx0XHRpZiAoIXJlc3BvbnNlLm9rKSB7XHJcblx0XHRcdGNvbnN0IGVycm9yRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yRGF0YS5lcnJvci5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG5cdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRyZXR1cm4gZXJyb3IubWVzc2FnZTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZldGNoRGF0YTtcclxuIiwiaW1wb3J0IGZldGNoRGF0YSBmcm9tIFwiLi9hcGlcIjtcclxuXHJcbmNvbnN0IERvbU1hbmlwdWxhdGlvbiA9ICgoKSA9PiB7XHJcbiAgY29uc3QgY3VycmVudFdlYXRoZXJFbGVtZW50cyA9IFtcclxuICAgIHsgc2VsZWN0b3I6IFwid2VhdGhlci10ZW1wXCIsIGRhdGFLZXk6IFwidGVtcF9jXCIgfSxcclxuICAgIHsgc2VsZWN0b3I6IFwid2VhdGhlci1kZXNjXCIsIGRhdGFLZXk6IFwiY29uZGl0aW9uXCIgfSxcclxuICAgIHsgc2VsZWN0b3I6IFwid2VhdGhlci1mZWVscy1saWtlLWFuY2hvclwiLCBkYXRhS2V5OiBcImZlZWxzbGlrZV9jXCIgfSxcclxuXHJcbiAgICB7IHNlbGVjdG9yOiBcIndpbmRcIiwgZGF0YUtleTogXCJ3aW5kX2twaFwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcImh1bWlkaXR5XCIsIGRhdGFLZXk6IFwiaHVtaWRpdHlcIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJ1dmluZGV4XCIsIGRhdGFLZXk6IFwidXZcIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJ2aXNpYmlsaXR5XCIsIGRhdGFLZXk6IFwidmlzX2ttXCIgfSxcclxuICAgIHsgc2VsZWN0b3I6IFwiY2xvdWRpbmVzc1wiLCBkYXRhS2V5OiBcImNsb3VkXCIgfSxcclxuICBdO1xyXG4gIC8v0L/QvtC/0YDQvtCx0YPQuSDRg9Cx0YDQsNGC0Ywgc2xpY2Ug0L/RgNC40LrQvtC70YssINGC0LXQsdC1INC90YPQttC10L0g0L7QtNC40L0g0Lgg0YLQvtGCINC20LUg0LDQtNGA0LXRgdGBXHJcbiAgY29uc3QgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMgPSBbXHJcbiAgICBbXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwiY2hhbmNlLW9mLXJhaW5cIiwgZGF0YUtleTogXCJkYWlseV9jaGFuY2Vfb2ZfcmFpbi0wXCIgfSxcclxuICAgICAgeyBzZWxlY3RvcjogXCJzdW5yaXNlXCIsIGRhdGFLZXk6IFwic3VucmlzZS0wXCIgfSxcclxuICAgICAgeyBzZWxlY3RvcjogXCJzdW5zZXRcIiwgZGF0YUtleTogXCJzdW5zZXQtMFwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwibW9vbi1waGFzZVwiLCBkYXRhS2V5OiBcIm1vb25fcGhhc2UtMFwiIH0sXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICB7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC10ZW1wLTFcIiwgZGF0YUtleTogXCJhdmd0ZW1wX2MtMVwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXdpbmQtMVwiLCBkYXRhS2V5OiBcIm1heHdpbmRfa3BoLTFcIiB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LWNoYW5jZS1vZi1yYWluLTFcIixcclxuICAgICAgICBkYXRhS2V5OiBcImRhaWx5X2NoYW5jZV9vZl9yYWluLTFcIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXRlbXAtMlwiLCBkYXRhS2V5OiBcImF2Z3RlbXBfYy0yXCIgfSxcclxuICAgICAgeyBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3Qtd2luZC0yXCIsIGRhdGFLZXk6IFwibWF4d2luZF9rcGgtMlwiIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3QtY2hhbmNlLW9mLXJhaW4tMlwiLFxyXG4gICAgICAgIGRhdGFLZXk6IFwiZGFpbHlfY2hhbmNlX29mX3JhaW4tMlwiLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICBdO1xyXG5cclxuICBjb25zdCBmYXJlbmhlaXRUZW1wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmYXJlbmhlaXQtYnRuXCIpO1xyXG4gIGNvbnN0IGNlbHNpdXNUZW1wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjZWxzaXVzLWJ0blwiKTtcclxuXHJcbiAgZmFyZW5oZWl0VGVtcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdChcInRlbXBfZlwiLCBcImZlZWxzbGlrZV9mXCIpO1xyXG4gIH0pO1xyXG5cclxuICBjZWxzaXVzVGVtcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdChcInRlbXBfY1wiLCBcImZlZWxzbGlrZV9jXCIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzZWFyY2hGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtZm9ybVwiKTtcclxuICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWlucHV0XCIpO1xyXG5cclxuICBjb25zdCBkb21XZWF0aGVyRWxlbWVudHMgPSB7fTtcclxuICBmdW5jdGlvbiBfdXBkYXRlRG9tKCkge1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgZWxlbWVudC5zZWxlY3RvclxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgICBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXkpID0+IHtcclxuICAgICAgZGF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgZWxlbWVudC5zZWxlY3RvclxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZWFyY2hGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IHNlYXJjaElucHV0VmFsdWUgPSBzZWFyY2hJbnB1dC52YWx1ZTtcclxuICAgIGF3YWl0IHNldERhdGEoc2VhcmNoSW5wdXRWYWx1ZSk7XHJcbiAgICBzZWFyY2hGb3JtLnJlc2V0KCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vINCU0L7Qv9C40YHQsNGC0Ywg0LTQu9GPIGZvcmVjYXN0IGF2Z3RlbXBfYy9mXHJcbiAgbGV0IHNlYXJjaElucHV0QnVmZmVyO1xyXG4gIGNvbnN0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQgPSBhc3luYyAodW5pdCwgZmVlbHNsaWtlVW5pdCkgPT4ge1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50c1swXS5kYXRhS2V5ID0gdW5pdDtcclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHNbMl0uZGF0YUtleSA9IGZlZWxzbGlrZVVuaXQ7XHJcblxyXG4gICAgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZGF5LCBkYXlJbmRleCkgPT4ge1xyXG4gICAgICBkYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9jXCIgfHxcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9mXCJcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9IGBhdmcke3VuaXR9LSR7ZGF5SW5kZXh9YDtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQuZGF0YUtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIF91cGRhdGVEb20oKTtcclxuICAgIGF3YWl0IHNldERhdGEoc2VhcmNoSW5wdXRCdWZmZXIpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGxvY2F0aW9uTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jYXRpb24tZGF0YVwiKTtcclxuICBjb25zdCBsb2NhdGlvbkRhdGVBbmRUaW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRlLWFuZC10aW1lXCIpO1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfc2V0Q3VycmVudFdlYXRoZXIoZGF0YSkge1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKGFzeW5jIChlbGVtZW50KSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJjb25kaXRpb25cIilcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgZGF0YS5jdXJyZW50LmNvbmRpdGlvbi50ZXh0O1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID0gTWF0aC5yb3VuZChcclxuICAgICAgICAgICAgZGF0YS5jdXJyZW50W2VsZW1lbnQuZGF0YUtleV1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwidGVtcF9jXCIgfHwgZWxlbWVudC5kYXRhS2V5ID09PSBcImZlZWxzbGlrZV9jXCIpXHJcbiAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwQ1wiO1xyXG4gICAgICAgIGVsc2UgaWYgKFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID09PSBcInRlbXBfZlwiIHx8XHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPT09IFwiZmVlbHNsaWtlX2ZcIlxyXG4gICAgICAgIClcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBGXCI7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBjdXJyZW50IHdlYXRoZXIgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZXRGb3JlY2FzdChkYXRhKSB7XHJcbiAgICBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXksIGRheUluZGV4KSA9PiB7XHJcbiAgICAgIGRheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmIChkYXlJbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgICAgICAgZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uYXN0cm9bXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiZGFpbHlfY2hhbmNlX29mX3JhaW5cIikge1xyXG4gICAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICAgIGRhdGEuZm9yZWNhc3QuZm9yZWNhc3RkYXlbZGF5SW5kZXhdLmRheVtcclxuICAgICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKVxyXG4gICAgICAgICAgICAgICAgXSArPSBcIiVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICBkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5W2RheUluZGV4XS5kYXlbXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJhdmd0ZW1wX2NcIilcclxuICAgICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCLCsENcIjtcclxuICAgICAgICAgIGVsc2UgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9mXCIpXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBGXCI7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgZm9yZWNhc3QgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIHNldERhdGEoaW5wdXRDaXR5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBfdXBkYXRlRG9tKCk7XHJcbiAgICAgIHNlYXJjaElucHV0QnVmZmVyID0gaW5wdXRDaXR5O1xyXG4gICAgICBsZXQgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShpbnB1dENpdHkpO1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgaWYgKCFkYXRhLmN1cnJlbnQpIHRocm93IG5ldyBFcnJvcihkYXRhKTtcclxuICAgICAgbG9jYXRpb25OYW1lLnRleHRDb250ZW50ID1cclxuICAgICAgICBkYXRhLmxvY2F0aW9uLm5hbWUgKyBcIiwgXCIgKyBkYXRhLmxvY2F0aW9uLmNvdW50cnk7XHJcbiAgICAgIGxvY2F0aW9uRGF0ZUFuZFRpbWUudGV4dENvbnRlbnQgPSBkYXRhLmxvY2F0aW9uLmxvY2FsdGltZTtcclxuICAgICAgX3NldEN1cnJlbnRXZWF0aGVyKGRhdGEpO1xyXG4gICAgICBfc2V0Rm9yZWNhc3QoZGF0YSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBzZXREYXRhIH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEb21NYW5pcHVsYXRpb247XHJcblxyXG4vL2FkZCBrbXBoIGFtZCBtcGYgZGlmZmVyZW5jZVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEb21NYW5pcHVsYXRpb24gZnJvbSBcIi4vZG9tXCI7XHJcbkRvbU1hbmlwdWxhdGlvbi5zZXREYXRhKFwiQW1zdGVyZGFtXCIpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=