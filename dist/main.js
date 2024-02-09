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
    await _updateTemperatureUnit(true);
  });

  celsiusTempBtn.addEventListener("click", async () => {
    await _updateTemperatureUnit();
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

  let searchInputBuffer;
  async function _updateTemperatureUnit(americanUnits = false) {
    let tempUnit, feelsLikeTempUnit;
    let speedUnit;
    let visUnit;
    if (americanUnits) {
      tempUnit = "temp_f";
      feelsLikeTempUnit = "feelslike_f";
      speedUnit = "wind_mph";
      visUnit = "vis_miles";
    } else {
      tempUnit = "temp_c";
      feelsLikeTempUnit = "feelslike_c";
      speedUnit = "wind_kph";
      visUnit = "vis_km";
    }
    currentWeatherElements[0].dataKey = tempUnit;
    currentWeatherElements[2].dataKey = feelsLikeTempUnit;
    currentWeatherElements[3].dataKey = speedUnit;
    currentWeatherElements[6].dataKey = visUnit;

    forecastWeatherElements.forEach((day, dayIndex) => {
      day.forEach((element) => {
        if (
          element.dataKey.slice(0, -2) === "avgtemp_c" ||
          element.dataKey.slice(0, -2) === "avgtemp_f"
        ) {
          element.dataKey = `avg${tempUnit}-${dayIndex}`;
        }
        if (
          element.dataKey.slice(0, -2) === "maxwind_kph" ||
          element.dataKey.slice(0, -2) === "maxwind_mph"
        ) {
          element.dataKey = `max${speedUnit}-${dayIndex}`;
        }
      });
    });

    await setData(searchInputBuffer);
  }

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
          } else
            domWeatherElements[element.dataKey].textContent =
              data.forecast.forecastday[dayIndex].day[
                element.dataKey.slice(0, -2)
              ];

          if (element.dataKey.slice(0, -2) === "daily_chance_of_rain") {
            domWeatherElements[element.dataKey].textContent =
              data.forecast.forecastday[dayIndex].day[
                element.dataKey.slice(0, -2)
              ];
          }
        } catch (error) {
          console.log("Error updating forecast element:", error);
        }
      });
    });
  }

  async function _setUnits() {
    currentWeatherElements.forEach(async (element) => {
      try {
        if (element.dataKey === "temp_c" || element.dataKey === "feelslike_c")
          domWeatherElements[element.dataKey].textContent += "°C";
        else if (
          element.dataKey === "temp_f" ||
          element.dataKey === "feelslike_f"
        )
          domWeatherElements[element.dataKey].textContent += "°F";
        if (
          element.dataKey === "uv" ||
          element.dataKey === "humidity" ||
          element.dataKey === "cloud"
        )
          domWeatherElements[element.dataKey].textContent += "%";
        if (element.dataKey === "vis_km")
          domWeatherElements[element.dataKey].textContent += "km";
        else if (element.dataKey === "vis_miles")
          domWeatherElements[element.dataKey].textContent += "m";

        if (element.dataKey === "wind_kph")
          domWeatherElements[element.dataKey].textContent += "km/h";
        else if (element.dataKey === "wind_mph")
          domWeatherElements[element.dataKey].textContent += "m/h";
      } catch {
        console.log("Error updating current weather element:", error);
      }
    });

    forecastWeatherElements.forEach((day, dayIndex) => {
      day.forEach((element) => {
        try {
          if (element.dataKey.slice(0, -2) === "avgtemp_c")
            domWeatherElements[element.dataKey].textContent += "°C";
          else if (element.dataKey.slice(0, -2) === "avgtemp_f")
            domWeatherElements[element.dataKey].textContent += "°F";

          if (element.dataKey.slice(0, -2) === "daily_chance_of_rain") {
            domWeatherElements[element.dataKey].textContent += "%";
          }
          if (element.dataKey.slice(0, -2) === "maxwind_kph")
            domWeatherElements[element.dataKey].textContent += "km/h";
          else if (element.dataKey.slice(0, -2) === "maxwind_mph")
            domWeatherElements[element.dataKey].textContent += "m/h";
        } catch (error) {
          console.log("Error updating forecast element:", error);
        }
      });
    });
  }

  function reformatDateTime(dateTimeStr, dayOfWeekOnly = false) {
    const [datePart, timePart] = dateTimeStr.split(" ");

    const dateObj = new Date(datePart);

    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dateObj.getDay()];
    const dayOfMonth = dateObj.getDate();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][dateObj.getMonth()];
    const year = dateObj.getFullYear();

    let hours = "";
    let minutes = "";

    if (timePart) {
      [hours, minutes] = timePart.split(":");
    }

    if (dayOfWeekOnly) {
      return dayOfWeek;
    } else {
      const formattedDateTime = `${dayOfWeek} ${dayOfMonth} ${month} ${year} | ${hours}:${minutes}`;
      return formattedDateTime;
    }
  }

  async function _bruh(data) {
    const locationName = document.querySelector(".location-data");
    const locationDateAndTime = document.querySelector(".date-and-time");

    locationName.textContent =
      data.location.name + ", " + data.location.country;

    locationDateAndTime.textContent = reformatDateTime(data.location.localtime);

    const forecastDayList = [
      document.getElementById("weekly-forecast-day-1"),
      document.getElementById("weekly-forecast-day-2"),
    ];
    forecastDayList.forEach((day, index) => {
      day.textContent = reformatDateTime(
        data.forecast.forecastday[(index += 1)].date,
        true
      );
    });
  }
  async function setData(inputCity) {
    try {
      _updateDom();
      searchInputBuffer = inputCity;
      let data = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(inputCity);
      console.log(data);
      if (!data.current) throw new Error(data);
      _bruh(data);
      _setCurrentWeather(data);
      _setForecast(data);
      _setUnits();
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


_dom__WEBPACK_IMPORTED_MODULE_0__["default"].setData("Amsterdam").then(() => {
  document.getElementById("loading-screen").style.opacity = "0";
  setTimeout(function () {
    document.getElementById("loading-screen").style.display = "none";
  }, 500);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxRQUFRLEdBQUcsU0FBUztBQUN2RjtBQUNBO0FBQ0EseUNBQXlDLGNBQWM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxTQUFTLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQks7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsTUFBTSw2Q0FBNkM7QUFDbkQsTUFBTSxnREFBZ0Q7QUFDdEQsTUFBTSwrREFBK0Q7QUFDckU7QUFDQSxNQUFNLHVDQUF1QztBQUM3QyxNQUFNLDJDQUEyQztBQUNqRCxNQUFNLG9DQUFvQztBQUMxQyxNQUFNLDJDQUEyQztBQUNqRCxNQUFNLDBDQUEwQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsK0RBQStEO0FBQ3ZFLFFBQVEsMkNBQTJDO0FBQ25ELFFBQVEseUNBQXlDO0FBQ2pELFFBQVEsaURBQWlEO0FBQ3pEO0FBQ0E7QUFDQSxRQUFRLDREQUE0RDtBQUNwRSxRQUFRLDhEQUE4RDtBQUN0RTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFFBQVEsNERBQTREO0FBQ3BFLFFBQVEsOERBQThEO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLFNBQVMsR0FBRyxTQUFTO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsVUFBVSxHQUFHLFNBQVM7QUFDeEQ7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLG1DQUFtQyxXQUFXLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksTUFBTSxHQUFHLFFBQVE7QUFDbEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnREFBUztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQztBQUNEO0FBQ0EsaUVBQWUsZUFBZSxFQUFDOzs7Ozs7O1VDM1MvQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQ3BDO0FBQ0EsNENBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFQSV9LRVkgPSBcImJiMThmZDY0MDJkMDRjODVhM2EyMzQ4NTYyMzI0MDgmcVwiO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hEYXRhKGxvY2F0aW9uKSB7XHJcblx0Y29uc3QgYXBpVXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2ZvcmVjYXN0Lmpzb24/a2V5PSR7QVBJX0tFWX09JHtsb2NhdGlvbn0mZGF5cz0zYDtcclxuXHJcblx0dHJ5IHtcclxuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG5cclxuXHRcdGlmICghcmVzcG9uc2Uub2spIHtcclxuXHRcdFx0Y29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3JEYXRhLmVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcblx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdHJldHVybiBlcnJvci5tZXNzYWdlO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hEYXRhO1xyXG4iLCJpbXBvcnQgZmV0Y2hEYXRhIGZyb20gXCIuL2FwaVwiO1xyXG5cclxuY29uc3QgRG9tTWFuaXB1bGF0aW9uID0gKCgpID0+IHtcclxuICBjb25zdCBjdXJyZW50V2VhdGhlckVsZW1lbnRzID0gW1xyXG4gICAgeyBzZWxlY3RvcjogXCJ3ZWF0aGVyLXRlbXBcIiwgZGF0YUtleTogXCJ0ZW1wX2NcIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJ3ZWF0aGVyLWRlc2NcIiwgZGF0YUtleTogXCJjb25kaXRpb25cIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJ3ZWF0aGVyLWZlZWxzLWxpa2UtYW5jaG9yXCIsIGRhdGFLZXk6IFwiZmVlbHNsaWtlX2NcIiB9LFxyXG5cclxuICAgIHsgc2VsZWN0b3I6IFwid2luZFwiLCBkYXRhS2V5OiBcIndpbmRfa3BoXCIgfSxcclxuICAgIHsgc2VsZWN0b3I6IFwiaHVtaWRpdHlcIiwgZGF0YUtleTogXCJodW1pZGl0eVwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcInV2aW5kZXhcIiwgZGF0YUtleTogXCJ1dlwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcInZpc2liaWxpdHlcIiwgZGF0YUtleTogXCJ2aXNfa21cIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJjbG91ZGluZXNzXCIsIGRhdGFLZXk6IFwiY2xvdWRcIiB9LFxyXG4gIF07XHJcblxyXG4gIGNvbnN0IGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzID0gW1xyXG4gICAgW1xyXG4gICAgICB7IHNlbGVjdG9yOiBcImNoYW5jZS1vZi1yYWluXCIsIGRhdGFLZXk6IFwiZGFpbHlfY2hhbmNlX29mX3JhaW4tMFwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwic3VucmlzZVwiLCBkYXRhS2V5OiBcInN1bnJpc2UtMFwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwic3Vuc2V0XCIsIGRhdGFLZXk6IFwic3Vuc2V0LTBcIiB9LFxyXG4gICAgICB7IHNlbGVjdG9yOiBcIm1vb24tcGhhc2VcIiwgZGF0YUtleTogXCJtb29uX3BoYXNlLTBcIiB9LFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgeyBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3QtdGVtcC0xXCIsIGRhdGFLZXk6IFwiYXZndGVtcF9jLTFcIiB9LFxyXG4gICAgICB7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC13aW5kLTFcIiwgZGF0YUtleTogXCJtYXh3aW5kX2twaC0xXCIgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC1jaGFuY2Utb2YtcmFpbi0xXCIsXHJcbiAgICAgICAgZGF0YUtleTogXCJkYWlseV9jaGFuY2Vfb2ZfcmFpbi0xXCIsXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICB7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC10ZW1wLTJcIiwgZGF0YUtleTogXCJhdmd0ZW1wX2MtMlwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXdpbmQtMlwiLCBkYXRhS2V5OiBcIm1heHdpbmRfa3BoLTJcIiB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LWNoYW5jZS1vZi1yYWluLTJcIixcclxuICAgICAgICBkYXRhS2V5OiBcImRhaWx5X2NoYW5jZV9vZl9yYWluLTJcIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgZmFyZW5oZWl0VGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmFyZW5oZWl0LWJ0blwiKTtcclxuICBjb25zdCBjZWxzaXVzVGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2Vsc2l1cy1idG5cIik7XHJcblxyXG4gIGZhcmVuaGVpdFRlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgIGF3YWl0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQodHJ1ZSk7XHJcbiAgfSk7XHJcblxyXG4gIGNlbHNpdXNUZW1wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0KCk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNlYXJjaEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1mb3JtXCIpO1xyXG4gIGNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtaW5wdXRcIik7XHJcblxyXG4gIGNvbnN0IGRvbVdlYXRoZXJFbGVtZW50cyA9IHt9O1xyXG4gIGZ1bmN0aW9uIF91cGRhdGVEb20oKSB7XHJcbiAgICBjdXJyZW50V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBlbGVtZW50LnNlbGVjdG9yXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICAgIGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGRheSkgPT4ge1xyXG4gICAgICBkYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICBlbGVtZW50LnNlbGVjdG9yXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaEZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgc2VhcmNoSW5wdXRWYWx1ZSA9IHNlYXJjaElucHV0LnZhbHVlO1xyXG4gICAgYXdhaXQgc2V0RGF0YShzZWFyY2hJbnB1dFZhbHVlKTtcclxuICAgIHNlYXJjaEZvcm0ucmVzZXQoKTtcclxuICB9KTtcclxuXHJcbiAgbGV0IHNlYXJjaElucHV0QnVmZmVyO1xyXG4gIGFzeW5jIGZ1bmN0aW9uIF91cGRhdGVUZW1wZXJhdHVyZVVuaXQoYW1lcmljYW5Vbml0cyA9IGZhbHNlKSB7XHJcbiAgICBsZXQgdGVtcFVuaXQsIGZlZWxzTGlrZVRlbXBVbml0O1xyXG4gICAgbGV0IHNwZWVkVW5pdDtcclxuICAgIGxldCB2aXNVbml0O1xyXG4gICAgaWYgKGFtZXJpY2FuVW5pdHMpIHtcclxuICAgICAgdGVtcFVuaXQgPSBcInRlbXBfZlwiO1xyXG4gICAgICBmZWVsc0xpa2VUZW1wVW5pdCA9IFwiZmVlbHNsaWtlX2ZcIjtcclxuICAgICAgc3BlZWRVbml0ID0gXCJ3aW5kX21waFwiO1xyXG4gICAgICB2aXNVbml0ID0gXCJ2aXNfbWlsZXNcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXBVbml0ID0gXCJ0ZW1wX2NcIjtcclxuICAgICAgZmVlbHNMaWtlVGVtcFVuaXQgPSBcImZlZWxzbGlrZV9jXCI7XHJcbiAgICAgIHNwZWVkVW5pdCA9IFwid2luZF9rcGhcIjtcclxuICAgICAgdmlzVW5pdCA9IFwidmlzX2ttXCI7XHJcbiAgICB9XHJcbiAgICBjdXJyZW50V2VhdGhlckVsZW1lbnRzWzBdLmRhdGFLZXkgPSB0ZW1wVW5pdDtcclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHNbMl0uZGF0YUtleSA9IGZlZWxzTGlrZVRlbXBVbml0O1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50c1szXS5kYXRhS2V5ID0gc3BlZWRVbml0O1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50c1s2XS5kYXRhS2V5ID0gdmlzVW5pdDtcclxuXHJcbiAgICBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXksIGRheUluZGV4KSA9PiB7XHJcbiAgICAgIGRheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJhdmd0ZW1wX2NcIiB8fFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJhdmd0ZW1wX2ZcIlxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID0gYGF2ZyR7dGVtcFVuaXR9LSR7ZGF5SW5kZXh9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJtYXh3aW5kX2twaFwiIHx8XHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcIm1heHdpbmRfbXBoXCJcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9IGBtYXgke3NwZWVkVW5pdH0tJHtkYXlJbmRleH1gO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0QnVmZmVyKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZXRDdXJyZW50V2VhdGhlcihkYXRhKSB7XHJcbiAgICBjdXJyZW50V2VhdGhlckVsZW1lbnRzLmZvckVhY2goYXN5bmMgKGVsZW1lbnQpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5ID09PSBcImNvbmRpdGlvblwiKVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxyXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnQuY29uZGl0aW9uLnRleHQ7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRbZWxlbWVudC5kYXRhS2V5XVxyXG4gICAgICAgICAgKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHVwZGF0aW5nIGN1cnJlbnQgd2VhdGhlciBlbGVtZW50OlwiLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX3NldEZvcmVjYXN0KGRhdGEpIHtcclxuICAgIGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGRheSwgZGF5SW5kZXgpID0+IHtcclxuICAgICAgZGF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKGRheUluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICBkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5W2RheUluZGV4XS5hc3Ryb1tcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMilcclxuICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICBkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5W2RheUluZGV4XS5kYXlbXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJkYWlseV9jaGFuY2Vfb2ZfcmFpblwiKSB7XHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICBkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5W2RheUluZGV4XS5kYXlbXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBmb3JlY2FzdCBlbGVtZW50OlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX3NldFVuaXRzKCkge1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKGFzeW5jIChlbGVtZW50KSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ0ZW1wX2NcIiB8fCBlbGVtZW50LmRhdGFLZXkgPT09IFwiZmVlbHNsaWtlX2NcIilcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBDXCI7XHJcbiAgICAgICAgZWxzZSBpZiAoXHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPT09IFwidGVtcF9mXCIgfHxcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9PT0gXCJmZWVsc2xpa2VfZlwiXHJcbiAgICAgICAgKVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCLCsEZcIjtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPT09IFwidXZcIiB8fFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID09PSBcImh1bWlkaXR5XCIgfHxcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9PT0gXCJjbG91ZFwiXHJcbiAgICAgICAgKVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCIlXCI7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ2aXNfa21cIilcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwia21cIjtcclxuICAgICAgICBlbHNlIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwidmlzX21pbGVzXCIpXHJcbiAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIm1cIjtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ3aW5kX2twaFwiKVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCJrbS9oXCI7XHJcbiAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5kYXRhS2V5ID09PSBcIndpbmRfbXBoXCIpXHJcbiAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIm0vaFwiO1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHVwZGF0aW5nIGN1cnJlbnQgd2VhdGhlciBlbGVtZW50OlwiLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGRheSwgZGF5SW5kZXgpID0+IHtcclxuICAgICAgZGF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9jXCIpXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBDXCI7XHJcbiAgICAgICAgICBlbHNlIGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcImF2Z3RlbXBfZlwiKVxyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwRlwiO1xyXG5cclxuICAgICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcImRhaWx5X2NoYW5jZV9vZl9yYWluXCIpIHtcclxuICAgICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCIlXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJtYXh3aW5kX2twaFwiKVxyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcImttL2hcIjtcclxuICAgICAgICAgIGVsc2UgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwibWF4d2luZF9tcGhcIilcclxuICAgICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCJtL2hcIjtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBmb3JlY2FzdCBlbGVtZW50OlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVmb3JtYXREYXRlVGltZShkYXRlVGltZVN0ciwgZGF5T2ZXZWVrT25seSA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBbZGF0ZVBhcnQsIHRpbWVQYXJ0XSA9IGRhdGVUaW1lU3RyLnNwbGl0KFwiIFwiKTtcclxuXHJcbiAgICBjb25zdCBkYXRlT2JqID0gbmV3IERhdGUoZGF0ZVBhcnQpO1xyXG5cclxuICAgIGNvbnN0IGRheU9mV2VlayA9IFtcclxuICAgICAgXCJTdW5kYXlcIixcclxuICAgICAgXCJNb25kYXlcIixcclxuICAgICAgXCJUdWVzZGF5XCIsXHJcbiAgICAgIFwiV2VkbmVzZGF5XCIsXHJcbiAgICAgIFwiVGh1cnNkYXlcIixcclxuICAgICAgXCJGcmlkYXlcIixcclxuICAgICAgXCJTYXR1cmRheVwiLFxyXG4gICAgXVtkYXRlT2JqLmdldERheSgpXTtcclxuICAgIGNvbnN0IGRheU9mTW9udGggPSBkYXRlT2JqLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1vbnRoID0gW1xyXG4gICAgICBcIkphbnVhcnlcIixcclxuICAgICAgXCJGZWJydWFyeVwiLFxyXG4gICAgICBcIk1hcmNoXCIsXHJcbiAgICAgIFwiQXByaWxcIixcclxuICAgICAgXCJNYXlcIixcclxuICAgICAgXCJKdW5lXCIsXHJcbiAgICAgIFwiSnVseVwiLFxyXG4gICAgICBcIkF1Z3VzdFwiLFxyXG4gICAgICBcIlNlcHRlbWJlclwiLFxyXG4gICAgICBcIk9jdG9iZXJcIixcclxuICAgICAgXCJOb3ZlbWJlclwiLFxyXG4gICAgICBcIkRlY2VtYmVyXCIsXHJcbiAgICBdW2RhdGVPYmouZ2V0TW9udGgoKV07XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZU9iai5nZXRGdWxsWWVhcigpO1xyXG5cclxuICAgIGxldCBob3VycyA9IFwiXCI7XHJcbiAgICBsZXQgbWludXRlcyA9IFwiXCI7XHJcblxyXG4gICAgaWYgKHRpbWVQYXJ0KSB7XHJcbiAgICAgIFtob3VycywgbWludXRlc10gPSB0aW1lUGFydC5zcGxpdChcIjpcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRheU9mV2Vla09ubHkpIHtcclxuICAgICAgcmV0dXJuIGRheU9mV2VlaztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGVUaW1lID0gYCR7ZGF5T2ZXZWVrfSAke2RheU9mTW9udGh9ICR7bW9udGh9ICR7eWVhcn0gfCAke2hvdXJzfToke21pbnV0ZXN9YDtcclxuICAgICAgcmV0dXJuIGZvcm1hdHRlZERhdGVUaW1lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX2JydWgoZGF0YSkge1xyXG4gICAgY29uc3QgbG9jYXRpb25OYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2NhdGlvbi1kYXRhXCIpO1xyXG4gICAgY29uc3QgbG9jYXRpb25EYXRlQW5kVGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0ZS1hbmQtdGltZVwiKTtcclxuXHJcbiAgICBsb2NhdGlvbk5hbWUudGV4dENvbnRlbnQgPVxyXG4gICAgICBkYXRhLmxvY2F0aW9uLm5hbWUgKyBcIiwgXCIgKyBkYXRhLmxvY2F0aW9uLmNvdW50cnk7XHJcblxyXG4gICAgbG9jYXRpb25EYXRlQW5kVGltZS50ZXh0Q29udGVudCA9IHJlZm9ybWF0RGF0ZVRpbWUoZGF0YS5sb2NhdGlvbi5sb2NhbHRpbWUpO1xyXG5cclxuICAgIGNvbnN0IGZvcmVjYXN0RGF5TGlzdCA9IFtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWVrbHktZm9yZWNhc3QtZGF5LTFcIiksXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2Vla2x5LWZvcmVjYXN0LWRheS0yXCIpLFxyXG4gICAgXTtcclxuICAgIGZvcmVjYXN0RGF5TGlzdC5mb3JFYWNoKChkYXksIGluZGV4KSA9PiB7XHJcbiAgICAgIGRheS50ZXh0Q29udGVudCA9IHJlZm9ybWF0RGF0ZVRpbWUoXHJcbiAgICAgICAgZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVsoaW5kZXggKz0gMSldLmRhdGUsXHJcbiAgICAgICAgdHJ1ZVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGFzeW5jIGZ1bmN0aW9uIHNldERhdGEoaW5wdXRDaXR5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBfdXBkYXRlRG9tKCk7XHJcbiAgICAgIHNlYXJjaElucHV0QnVmZmVyID0gaW5wdXRDaXR5O1xyXG4gICAgICBsZXQgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShpbnB1dENpdHkpO1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgaWYgKCFkYXRhLmN1cnJlbnQpIHRocm93IG5ldyBFcnJvcihkYXRhKTtcclxuICAgICAgX2JydWgoZGF0YSk7XHJcbiAgICAgIF9zZXRDdXJyZW50V2VhdGhlcihkYXRhKTtcclxuICAgICAgX3NldEZvcmVjYXN0KGRhdGEpO1xyXG4gICAgICBfc2V0VW5pdHMoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHNldERhdGEgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERvbU1hbmlwdWxhdGlvbjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgRG9tTWFuaXB1bGF0aW9uIGZyb20gXCIuL2RvbVwiO1xyXG5cclxuRG9tTWFuaXB1bGF0aW9uLnNldERhdGEoXCJBbXN0ZXJkYW1cIikudGhlbigoKSA9PiB7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXNjcmVlblwiKS5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XHJcbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmctc2NyZWVuXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICB9LCA1MDApO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9