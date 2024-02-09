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
    let speedUnit, forecastSpeedUnit;
    if (americanUnits) {
      tempUnit = "temp_f";
      feelsLikeTempUnit = "feelslike_f";
      speedUnit = "wind_mph";
    } else {
      tempUnit = "temp_c";
      feelsLikeTempUnit = "feelslike_c";
      speedUnit = "wind_kph";
    }
    currentWeatherElements[0].dataKey = tempUnit;
    currentWeatherElements[2].dataKey = feelsLikeTempUnit;
    currentWeatherElements[3].dataKey = speedUnit;

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
        if (element.dataKey === "wind_kph" || element.dataKey === "vis_km")
          domWeatherElements[element.dataKey].textContent += "km/h";
        else if (element.dataKey === "wind_mph" || element.dataKey === "vis_m")
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

    const [hours, minutes] = timePart.split(":");

    if (dayOfWeekOnly) {
      return dayOfWeek;
    } else {
      const formattedDateTime = `${dayOfWeek} ${dayOfMonth} ${month} ${year} | ${hours}:${minutes}`;
      return formattedDateTime;
    }
  }

  const locationName = document.querySelector(".location-data");
  const locationDateAndTime = document.querySelector(".date-and-time");

  async function setData(inputCity) {
    try {
      _updateDom();
      searchInputBuffer = inputCity;
      let data = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(inputCity);
      console.log(data);
      if (!data.current) throw new Error(data);
      locationName.textContent =
        data.location.name + ", " + data.location.country;

      locationDateAndTime.textContent = reformatDateTime(
        data.location.localtime
      );
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

//add kmph amd mpf difference
// поменять ан nighly temp


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNO0FBQ04sbUNBQW1DLFdBQVcsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSxNQUFNLEdBQUcsUUFBUTtBQUNsRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGdEQUFTO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQztBQUNEO0FBQ0EsaUVBQWUsZUFBZSxFQUFDO0FBQy9CO0FBQ0E7QUFDQTs7Ozs7OztVQ3BSQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQ3BDLDRDQUFlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVBJX0tFWSA9IFwiYmIxOGZkNjQwMmQwNGM4NWEzYTIzNDg1NjIzMjQwOCZxXCI7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmZXRjaERhdGEobG9jYXRpb24pIHtcclxuXHRjb25zdCBhcGlVcmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvZm9yZWNhc3QuanNvbj9rZXk9JHtBUElfS0VZfT0ke2xvY2F0aW9ufSZkYXlzPTNgO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhcGlVcmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XHJcblxyXG5cdFx0aWYgKCFyZXNwb25zZS5vaykge1xyXG5cdFx0XHRjb25zdCBlcnJvckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvckRhdGEuZXJyb3IubWVzc2FnZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0cmV0dXJuIGVycm9yLm1lc3NhZ2U7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmZXRjaERhdGE7XHJcbiIsImltcG9ydCBmZXRjaERhdGEgZnJvbSBcIi4vYXBpXCI7XHJcblxyXG5jb25zdCBEb21NYW5pcHVsYXRpb24gPSAoKCkgPT4ge1xyXG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVyRWxlbWVudHMgPSBbXHJcbiAgICB7IHNlbGVjdG9yOiBcIndlYXRoZXItdGVtcFwiLCBkYXRhS2V5OiBcInRlbXBfY1wiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcIndlYXRoZXItZGVzY1wiLCBkYXRhS2V5OiBcImNvbmRpdGlvblwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcIndlYXRoZXItZmVlbHMtbGlrZS1hbmNob3JcIiwgZGF0YUtleTogXCJmZWVsc2xpa2VfY1wiIH0sXHJcblxyXG4gICAgeyBzZWxlY3RvcjogXCJ3aW5kXCIsIGRhdGFLZXk6IFwid2luZF9rcGhcIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJodW1pZGl0eVwiLCBkYXRhS2V5OiBcImh1bWlkaXR5XCIgfSxcclxuICAgIHsgc2VsZWN0b3I6IFwidXZpbmRleFwiLCBkYXRhS2V5OiBcInV2XCIgfSxcclxuICAgIHsgc2VsZWN0b3I6IFwidmlzaWJpbGl0eVwiLCBkYXRhS2V5OiBcInZpc19rbVwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcImNsb3VkaW5lc3NcIiwgZGF0YUtleTogXCJjbG91ZFwiIH0sXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMgPSBbXHJcbiAgICBbXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwiY2hhbmNlLW9mLXJhaW5cIiwgZGF0YUtleTogXCJkYWlseV9jaGFuY2Vfb2ZfcmFpbi0wXCIgfSxcclxuICAgICAgeyBzZWxlY3RvcjogXCJzdW5yaXNlXCIsIGRhdGFLZXk6IFwic3VucmlzZS0wXCIgfSxcclxuICAgICAgeyBzZWxlY3RvcjogXCJzdW5zZXRcIiwgZGF0YUtleTogXCJzdW5zZXQtMFwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwibW9vbi1waGFzZVwiLCBkYXRhS2V5OiBcIm1vb25fcGhhc2UtMFwiIH0sXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICB7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC10ZW1wLTFcIiwgZGF0YUtleTogXCJhdmd0ZW1wX2MtMVwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXdpbmQtMVwiLCBkYXRhS2V5OiBcIm1heHdpbmRfa3BoLTFcIiB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LWNoYW5jZS1vZi1yYWluLTFcIixcclxuICAgICAgICBkYXRhS2V5OiBcImRhaWx5X2NoYW5jZV9vZl9yYWluLTFcIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXRlbXAtMlwiLCBkYXRhS2V5OiBcImF2Z3RlbXBfYy0yXCIgfSxcclxuICAgICAgeyBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3Qtd2luZC0yXCIsIGRhdGFLZXk6IFwibWF4d2luZF9rcGgtMlwiIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3QtY2hhbmNlLW9mLXJhaW4tMlwiLFxyXG4gICAgICAgIGRhdGFLZXk6IFwiZGFpbHlfY2hhbmNlX29mX3JhaW4tMlwiLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICBdO1xyXG5cclxuICBjb25zdCBmYXJlbmhlaXRUZW1wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmYXJlbmhlaXQtYnRuXCIpO1xyXG4gIGNvbnN0IGNlbHNpdXNUZW1wQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjZWxzaXVzLWJ0blwiKTtcclxuXHJcbiAgZmFyZW5oZWl0VGVtcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdCh0cnVlKTtcclxuICB9KTtcclxuXHJcbiAgY2Vsc2l1c1RlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgIGF3YWl0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQoKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2VhcmNoRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWZvcm1cIik7XHJcbiAgY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1pbnB1dFwiKTtcclxuXHJcbiAgY29uc3QgZG9tV2VhdGhlckVsZW1lbnRzID0ge307XHJcbiAgZnVuY3Rpb24gX3VwZGF0ZURvbSgpIHtcclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIGVsZW1lbnQuc2VsZWN0b3JcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gICAgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZGF5KSA9PiB7XHJcbiAgICAgIGRheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgIGVsZW1lbnQuc2VsZWN0b3JcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VhcmNoRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCBzZWFyY2hJbnB1dFZhbHVlID0gc2VhcmNoSW5wdXQudmFsdWU7XHJcbiAgICBhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0VmFsdWUpO1xyXG4gICAgc2VhcmNoRm9ybS5yZXNldCgpO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgc2VhcmNoSW5wdXRCdWZmZXI7XHJcbiAgYXN5bmMgZnVuY3Rpb24gX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdChhbWVyaWNhblVuaXRzID0gZmFsc2UpIHtcclxuICAgIGxldCB0ZW1wVW5pdCwgZmVlbHNMaWtlVGVtcFVuaXQ7XHJcbiAgICBsZXQgc3BlZWRVbml0LCBmb3JlY2FzdFNwZWVkVW5pdDtcclxuICAgIGlmIChhbWVyaWNhblVuaXRzKSB7XHJcbiAgICAgIHRlbXBVbml0ID0gXCJ0ZW1wX2ZcIjtcclxuICAgICAgZmVlbHNMaWtlVGVtcFVuaXQgPSBcImZlZWxzbGlrZV9mXCI7XHJcbiAgICAgIHNwZWVkVW5pdCA9IFwid2luZF9tcGhcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXBVbml0ID0gXCJ0ZW1wX2NcIjtcclxuICAgICAgZmVlbHNMaWtlVGVtcFVuaXQgPSBcImZlZWxzbGlrZV9jXCI7XHJcbiAgICAgIHNwZWVkVW5pdCA9IFwid2luZF9rcGhcIjtcclxuICAgIH1cclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHNbMF0uZGF0YUtleSA9IHRlbXBVbml0O1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50c1syXS5kYXRhS2V5ID0gZmVlbHNMaWtlVGVtcFVuaXQ7XHJcbiAgICBjdXJyZW50V2VhdGhlckVsZW1lbnRzWzNdLmRhdGFLZXkgPSBzcGVlZFVuaXQ7XHJcblxyXG4gICAgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZGF5LCBkYXlJbmRleCkgPT4ge1xyXG4gICAgICBkYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9jXCIgfHxcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9mXCJcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9IGBhdmcke3RlbXBVbml0fS0ke2RheUluZGV4fWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwibWF4d2luZF9rcGhcIiB8fFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJtYXh3aW5kX21waFwiXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPSBgbWF4JHtzcGVlZFVuaXR9LSR7ZGF5SW5kZXh9YDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYXdhaXQgc2V0RGF0YShzZWFyY2hJbnB1dEJ1ZmZlcik7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfc2V0Q3VycmVudFdlYXRoZXIoZGF0YSkge1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKGFzeW5jIChlbGVtZW50KSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJjb25kaXRpb25cIilcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgZGF0YS5jdXJyZW50LmNvbmRpdGlvbi50ZXh0O1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID0gTWF0aC5yb3VuZChcclxuICAgICAgICAgICAgZGF0YS5jdXJyZW50W2VsZW1lbnQuZGF0YUtleV1cclxuICAgICAgICAgICk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBjdXJyZW50IHdlYXRoZXIgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZXRGb3JlY2FzdChkYXRhKSB7XHJcbiAgICBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXksIGRheUluZGV4KSA9PiB7XHJcbiAgICAgIGRheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmIChkYXlJbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgICAgICAgZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uYXN0cm9bXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgICAgICAgZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uZGF5W1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKVxyXG4gICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiZGFpbHlfY2hhbmNlX29mX3JhaW5cIikge1xyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgICAgICAgZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uZGF5W1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKVxyXG4gICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgZm9yZWNhc3QgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZXRVbml0cygpIHtcclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHMuZm9yRWFjaChhc3luYyAoZWxlbWVudCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwidGVtcF9jXCIgfHwgZWxlbWVudC5kYXRhS2V5ID09PSBcImZlZWxzbGlrZV9jXCIpXHJcbiAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwQ1wiO1xyXG4gICAgICAgIGVsc2UgaWYgKFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID09PSBcInRlbXBfZlwiIHx8XHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPT09IFwiZmVlbHNsaWtlX2ZcIlxyXG4gICAgICAgIClcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBGXCI7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID09PSBcInV2XCIgfHxcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9PT0gXCJodW1pZGl0eVwiIHx8XHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPT09IFwiY2xvdWRcIlxyXG4gICAgICAgIClcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiJVwiO1xyXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwid2luZF9rcGhcIiB8fCBlbGVtZW50LmRhdGFLZXkgPT09IFwidmlzX2ttXCIpXHJcbiAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcImttL2hcIjtcclxuICAgICAgICBlbHNlIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwid2luZF9tcGhcIiB8fCBlbGVtZW50LmRhdGFLZXkgPT09IFwidmlzX21cIilcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwibS9oXCI7XHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgY3VycmVudCB3ZWF0aGVyIGVsZW1lbnQ6XCIsIGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZGF5LCBkYXlJbmRleCkgPT4ge1xyXG4gICAgICBkYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJhdmd0ZW1wX2NcIilcclxuICAgICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCLCsENcIjtcclxuICAgICAgICAgIGVsc2UgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9mXCIpXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBGXCI7XHJcblxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiZGFpbHlfY2hhbmNlX29mX3JhaW5cIikge1xyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIiVcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcIm1heHdpbmRfa3BoXCIpXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwia20vaFwiO1xyXG4gICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJtYXh3aW5kX21waFwiKVxyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIm0vaFwiO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHVwZGF0aW5nIGZvcmVjYXN0IGVsZW1lbnQ6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZWZvcm1hdERhdGVUaW1lKGRhdGVUaW1lU3RyLCBkYXlPZldlZWtPbmx5ID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IFtkYXRlUGFydCwgdGltZVBhcnRdID0gZGF0ZVRpbWVTdHIuc3BsaXQoXCIgXCIpO1xyXG5cclxuICAgIGNvbnN0IGRhdGVPYmogPSBuZXcgRGF0ZShkYXRlUGFydCk7XHJcblxyXG4gICAgY29uc3QgZGF5T2ZXZWVrID0gW1xyXG4gICAgICBcIlN1bmRheVwiLFxyXG4gICAgICBcIk1vbmRheVwiLFxyXG4gICAgICBcIlR1ZXNkYXlcIixcclxuICAgICAgXCJXZWRuZXNkYXlcIixcclxuICAgICAgXCJUaHVyc2RheVwiLFxyXG4gICAgICBcIkZyaWRheVwiLFxyXG4gICAgICBcIlNhdHVyZGF5XCIsXHJcbiAgICBdW2RhdGVPYmouZ2V0RGF5KCldO1xyXG4gICAgY29uc3QgZGF5T2ZNb250aCA9IGRhdGVPYmouZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbW9udGggPSBbXHJcbiAgICAgIFwiSmFudWFyeVwiLFxyXG4gICAgICBcIkZlYnJ1YXJ5XCIsXHJcbiAgICAgIFwiTWFyY2hcIixcclxuICAgICAgXCJBcHJpbFwiLFxyXG4gICAgICBcIk1heVwiLFxyXG4gICAgICBcIkp1bmVcIixcclxuICAgICAgXCJKdWx5XCIsXHJcbiAgICAgIFwiQXVndXN0XCIsXHJcbiAgICAgIFwiU2VwdGVtYmVyXCIsXHJcbiAgICAgIFwiT2N0b2JlclwiLFxyXG4gICAgICBcIk5vdmVtYmVyXCIsXHJcbiAgICAgIFwiRGVjZW1iZXJcIixcclxuICAgIF1bZGF0ZU9iai5nZXRNb250aCgpXTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlT2JqLmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gICAgY29uc3QgW2hvdXJzLCBtaW51dGVzXSA9IHRpbWVQYXJ0LnNwbGl0KFwiOlwiKTtcclxuXHJcbiAgICBpZiAoZGF5T2ZXZWVrT25seSkge1xyXG4gICAgICByZXR1cm4gZGF5T2ZXZWVrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZVRpbWUgPSBgJHtkYXlPZldlZWt9ICR7ZGF5T2ZNb250aH0gJHttb250aH0gJHt5ZWFyfSB8ICR7aG91cnN9OiR7bWludXRlc31gO1xyXG4gICAgICByZXR1cm4gZm9ybWF0dGVkRGF0ZVRpbWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBsb2NhdGlvbk5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLWRhdGFcIik7XHJcbiAgY29uc3QgbG9jYXRpb25EYXRlQW5kVGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0ZS1hbmQtdGltZVwiKTtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gc2V0RGF0YShpbnB1dENpdHkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIF91cGRhdGVEb20oKTtcclxuICAgICAgc2VhcmNoSW5wdXRCdWZmZXIgPSBpbnB1dENpdHk7XHJcbiAgICAgIGxldCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKGlucHV0Q2l0eSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICBpZiAoIWRhdGEuY3VycmVudCkgdGhyb3cgbmV3IEVycm9yKGRhdGEpO1xyXG4gICAgICBsb2NhdGlvbk5hbWUudGV4dENvbnRlbnQgPVxyXG4gICAgICAgIGRhdGEubG9jYXRpb24ubmFtZSArIFwiLCBcIiArIGRhdGEubG9jYXRpb24uY291bnRyeTtcclxuXHJcbiAgICAgIGxvY2F0aW9uRGF0ZUFuZFRpbWUudGV4dENvbnRlbnQgPSByZWZvcm1hdERhdGVUaW1lKFxyXG4gICAgICAgIGRhdGEubG9jYXRpb24ubG9jYWx0aW1lXHJcbiAgICAgICk7XHJcbiAgICAgIF9zZXRDdXJyZW50V2VhdGhlcihkYXRhKTtcclxuICAgICAgX3NldEZvcmVjYXN0KGRhdGEpO1xyXG4gICAgICBfc2V0VW5pdHMoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHNldERhdGEgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERvbU1hbmlwdWxhdGlvbjtcclxuXHJcbi8vYWRkIGttcGggYW1kIG1wZiBkaWZmZXJlbmNlXHJcbi8vINC/0L7QvNC10L3Rj9GC0Ywg0LDQvSBuaWdobHkgdGVtcFxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEb21NYW5pcHVsYXRpb24gZnJvbSBcIi4vZG9tXCI7XHJcbkRvbU1hbmlwdWxhdGlvbi5zZXREYXRhKFwiQW1zdGVyZGFtXCIpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=