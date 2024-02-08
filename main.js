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
        }
      });
    });

    await setData(searchInputBuffer);
  };

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
        if (element.dataKey === "uv" || element.dataKey === "humidity")
          domWeatherElements[element.dataKey].textContent += "%";
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
        } catch (error) {
          console.log("Error updating forecast element:", error);
        }
      });
    });
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

  function reformatDateTime(dateTimeStr, dayOfWeekOnly = false) {
    // Split the date and time parts
    const [datePart, timePart] = dateTimeStr.split(" ");

    // Create a Date object with the date part
    const dateObj = new Date(datePart);

    // Extract individual date components
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

    // Reformat the time part
    const [hours, minutes] = timePart.split(":");

    // Construct the final formatted string
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQztBQUNEO0FBQ0EsaUVBQWUsZUFBZSxFQUFDO0FBQy9CO0FBQ0E7Ozs7Ozs7VUMxUEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05vQztBQUNwQyw0Q0FBZSIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFQSV9LRVkgPSBcImJiMThmZDY0MDJkMDRjODVhM2EyMzQ4NTYyMzI0MDgmcVwiO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hEYXRhKGxvY2F0aW9uKSB7XHJcblx0Y29uc3QgYXBpVXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2ZvcmVjYXN0Lmpzb24/a2V5PSR7QVBJX0tFWX09JHtsb2NhdGlvbn0mZGF5cz0zYDtcclxuXHJcblx0dHJ5IHtcclxuXHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYXBpVXJsLCB7IG1vZGU6IFwiY29yc1wiIH0pO1xyXG5cclxuXHRcdGlmICghcmVzcG9uc2Uub2spIHtcclxuXHRcdFx0Y29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3JEYXRhLmVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcblx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdHJldHVybiBlcnJvci5tZXNzYWdlO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hEYXRhO1xyXG4iLCJpbXBvcnQgZmV0Y2hEYXRhIGZyb20gXCIuL2FwaVwiO1xyXG5cclxuY29uc3QgRG9tTWFuaXB1bGF0aW9uID0gKCgpID0+IHtcclxuICBjb25zdCBjdXJyZW50V2VhdGhlckVsZW1lbnRzID0gW1xyXG4gICAgeyBzZWxlY3RvcjogXCJ3ZWF0aGVyLXRlbXBcIiwgZGF0YUtleTogXCJ0ZW1wX2NcIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJ3ZWF0aGVyLWRlc2NcIiwgZGF0YUtleTogXCJjb25kaXRpb25cIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJ3ZWF0aGVyLWZlZWxzLWxpa2UtYW5jaG9yXCIsIGRhdGFLZXk6IFwiZmVlbHNsaWtlX2NcIiB9LFxyXG5cclxuICAgIHsgc2VsZWN0b3I6IFwid2luZFwiLCBkYXRhS2V5OiBcIndpbmRfa3BoXCIgfSxcclxuICAgIHsgc2VsZWN0b3I6IFwiaHVtaWRpdHlcIiwgZGF0YUtleTogXCJodW1pZGl0eVwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcInV2aW5kZXhcIiwgZGF0YUtleTogXCJ1dlwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcInZpc2liaWxpdHlcIiwgZGF0YUtleTogXCJ2aXNfa21cIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJjbG91ZGluZXNzXCIsIGRhdGFLZXk6IFwiY2xvdWRcIiB9LFxyXG4gIF07XHJcblxyXG4gIGNvbnN0IGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzID0gW1xyXG4gICAgW1xyXG4gICAgICB7IHNlbGVjdG9yOiBcImNoYW5jZS1vZi1yYWluXCIsIGRhdGFLZXk6IFwiZGFpbHlfY2hhbmNlX29mX3JhaW4tMFwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwic3VucmlzZVwiLCBkYXRhS2V5OiBcInN1bnJpc2UtMFwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwic3Vuc2V0XCIsIGRhdGFLZXk6IFwic3Vuc2V0LTBcIiB9LFxyXG4gICAgICB7IHNlbGVjdG9yOiBcIm1vb24tcGhhc2VcIiwgZGF0YUtleTogXCJtb29uX3BoYXNlLTBcIiB9LFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgeyBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3QtdGVtcC0xXCIsIGRhdGFLZXk6IFwiYXZndGVtcF9jLTFcIiB9LFxyXG4gICAgICB7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC13aW5kLTFcIiwgZGF0YUtleTogXCJtYXh3aW5kX2twaC0xXCIgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC1jaGFuY2Utb2YtcmFpbi0xXCIsXHJcbiAgICAgICAgZGF0YUtleTogXCJkYWlseV9jaGFuY2Vfb2ZfcmFpbi0xXCIsXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICB7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC10ZW1wLTJcIiwgZGF0YUtleTogXCJhdmd0ZW1wX2MtMlwiIH0sXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXdpbmQtMlwiLCBkYXRhS2V5OiBcIm1heHdpbmRfa3BoLTJcIiB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LWNoYW5jZS1vZi1yYWluLTJcIixcclxuICAgICAgICBkYXRhS2V5OiBcImRhaWx5X2NoYW5jZV9vZl9yYWluLTJcIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgZmFyZW5oZWl0VGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmFyZW5oZWl0LWJ0blwiKTtcclxuICBjb25zdCBjZWxzaXVzVGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2Vsc2l1cy1idG5cIik7XHJcblxyXG4gIGZhcmVuaGVpdFRlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgIGF3YWl0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQoXCJ0ZW1wX2ZcIiwgXCJmZWVsc2xpa2VfZlwiKTtcclxuICB9KTtcclxuXHJcbiAgY2Vsc2l1c1RlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgIGF3YWl0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQoXCJ0ZW1wX2NcIiwgXCJmZWVsc2xpa2VfY1wiKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2VhcmNoRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWZvcm1cIik7XHJcbiAgY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1pbnB1dFwiKTtcclxuXHJcbiAgY29uc3QgZG9tV2VhdGhlckVsZW1lbnRzID0ge307XHJcbiAgZnVuY3Rpb24gX3VwZGF0ZURvbSgpIHtcclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIGVsZW1lbnQuc2VsZWN0b3JcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gICAgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZGF5KSA9PiB7XHJcbiAgICAgIGRheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgIGVsZW1lbnQuc2VsZWN0b3JcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VhcmNoRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCBzZWFyY2hJbnB1dFZhbHVlID0gc2VhcmNoSW5wdXQudmFsdWU7XHJcbiAgICBhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0VmFsdWUpO1xyXG4gICAgc2VhcmNoRm9ybS5yZXNldCgpO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgc2VhcmNoSW5wdXRCdWZmZXI7XHJcbiAgY29uc3QgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdCA9IGFzeW5jICh1bml0LCBmZWVsc2xpa2VVbml0KSA9PiB7XHJcbiAgICBjdXJyZW50V2VhdGhlckVsZW1lbnRzWzBdLmRhdGFLZXkgPSB1bml0O1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50c1syXS5kYXRhS2V5ID0gZmVlbHNsaWtlVW5pdDtcclxuXHJcbiAgICBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXksIGRheUluZGV4KSA9PiB7XHJcbiAgICAgIGRheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJhdmd0ZW1wX2NcIiB8fFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJhdmd0ZW1wX2ZcIlxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID0gYGF2ZyR7dW5pdH0tJHtkYXlJbmRleH1gO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0QnVmZmVyKTtcclxuICB9O1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfc2V0VW5pdHMoKSB7XHJcbiAgICBjdXJyZW50V2VhdGhlckVsZW1lbnRzLmZvckVhY2goYXN5bmMgKGVsZW1lbnQpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5ID09PSBcInRlbXBfY1wiIHx8IGVsZW1lbnQuZGF0YUtleSA9PT0gXCJmZWVsc2xpa2VfY1wiKVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCLCsENcIjtcclxuICAgICAgICBlbHNlIGlmIChcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ0ZW1wX2ZcIiB8fFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID09PSBcImZlZWxzbGlrZV9mXCJcclxuICAgICAgICApXHJcbiAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwRlwiO1xyXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwidXZcIiB8fCBlbGVtZW50LmRhdGFLZXkgPT09IFwiaHVtaWRpdHlcIilcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiJVwiO1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHVwZGF0aW5nIGN1cnJlbnQgd2VhdGhlciBlbGVtZW50OlwiLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGRheSwgZGF5SW5kZXgpID0+IHtcclxuICAgICAgZGF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9jXCIpXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBDXCI7XHJcbiAgICAgICAgICBlbHNlIGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcImF2Z3RlbXBfZlwiKVxyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwRlwiO1xyXG5cclxuICAgICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcImRhaWx5X2NoYW5jZV9vZl9yYWluXCIpIHtcclxuICAgICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCIlXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgZm9yZWNhc3QgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZXRDdXJyZW50V2VhdGhlcihkYXRhKSB7XHJcbiAgICBjdXJyZW50V2VhdGhlckVsZW1lbnRzLmZvckVhY2goYXN5bmMgKGVsZW1lbnQpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5ID09PSBcImNvbmRpdGlvblwiKVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPVxyXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnQuY29uZGl0aW9uLnRleHQ7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRbZWxlbWVudC5kYXRhS2V5XVxyXG4gICAgICAgICAgKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHVwZGF0aW5nIGN1cnJlbnQgd2VhdGhlciBlbGVtZW50OlwiLCBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gX3NldEZvcmVjYXN0KGRhdGEpIHtcclxuICAgIGZvcmVjYXN0V2VhdGhlckVsZW1lbnRzLmZvckVhY2goKGRheSwgZGF5SW5kZXgpID0+IHtcclxuICAgICAgZGF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKGRheUluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICBkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5W2RheUluZGV4XS5hc3Ryb1tcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMilcclxuICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICBkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5W2RheUluZGV4XS5kYXlbXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJkYWlseV9jaGFuY2Vfb2ZfcmFpblwiKSB7XHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgICBkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5W2RheUluZGV4XS5kYXlbXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBmb3JlY2FzdCBlbGVtZW50OlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVmb3JtYXREYXRlVGltZShkYXRlVGltZVN0ciwgZGF5T2ZXZWVrT25seSA9IGZhbHNlKSB7XHJcbiAgICAvLyBTcGxpdCB0aGUgZGF0ZSBhbmQgdGltZSBwYXJ0c1xyXG4gICAgY29uc3QgW2RhdGVQYXJ0LCB0aW1lUGFydF0gPSBkYXRlVGltZVN0ci5zcGxpdChcIiBcIik7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgRGF0ZSBvYmplY3Qgd2l0aCB0aGUgZGF0ZSBwYXJ0XHJcbiAgICBjb25zdCBkYXRlT2JqID0gbmV3IERhdGUoZGF0ZVBhcnQpO1xyXG5cclxuICAgIC8vIEV4dHJhY3QgaW5kaXZpZHVhbCBkYXRlIGNvbXBvbmVudHNcclxuICAgIGNvbnN0IGRheU9mV2VlayA9IFtcclxuICAgICAgXCJTdW5kYXlcIixcclxuICAgICAgXCJNb25kYXlcIixcclxuICAgICAgXCJUdWVzZGF5XCIsXHJcbiAgICAgIFwiV2VkbmVzZGF5XCIsXHJcbiAgICAgIFwiVGh1cnNkYXlcIixcclxuICAgICAgXCJGcmlkYXlcIixcclxuICAgICAgXCJTYXR1cmRheVwiLFxyXG4gICAgXVtkYXRlT2JqLmdldERheSgpXTtcclxuICAgIGNvbnN0IGRheU9mTW9udGggPSBkYXRlT2JqLmdldERhdGUoKTtcclxuICAgIGNvbnN0IG1vbnRoID0gW1xyXG4gICAgICBcIkphbnVhcnlcIixcclxuICAgICAgXCJGZWJydWFyeVwiLFxyXG4gICAgICBcIk1hcmNoXCIsXHJcbiAgICAgIFwiQXByaWxcIixcclxuICAgICAgXCJNYXlcIixcclxuICAgICAgXCJKdW5lXCIsXHJcbiAgICAgIFwiSnVseVwiLFxyXG4gICAgICBcIkF1Z3VzdFwiLFxyXG4gICAgICBcIlNlcHRlbWJlclwiLFxyXG4gICAgICBcIk9jdG9iZXJcIixcclxuICAgICAgXCJOb3ZlbWJlclwiLFxyXG4gICAgICBcIkRlY2VtYmVyXCIsXHJcbiAgICBdW2RhdGVPYmouZ2V0TW9udGgoKV07XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZU9iai5nZXRGdWxsWWVhcigpO1xyXG5cclxuICAgIC8vIFJlZm9ybWF0IHRoZSB0aW1lIHBhcnRcclxuICAgIGNvbnN0IFtob3VycywgbWludXRlc10gPSB0aW1lUGFydC5zcGxpdChcIjpcIik7XHJcblxyXG4gICAgLy8gQ29uc3RydWN0IHRoZSBmaW5hbCBmb3JtYXR0ZWQgc3RyaW5nXHJcbiAgICBpZiAoZGF5T2ZXZWVrT25seSkge1xyXG4gICAgICByZXR1cm4gZGF5T2ZXZWVrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZVRpbWUgPSBgJHtkYXlPZldlZWt9ICR7ZGF5T2ZNb250aH0gJHttb250aH0gJHt5ZWFyfSB8ICR7aG91cnN9OiR7bWludXRlc31gO1xyXG4gICAgICByZXR1cm4gZm9ybWF0dGVkRGF0ZVRpbWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBsb2NhdGlvbk5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLWRhdGFcIik7XHJcbiAgY29uc3QgbG9jYXRpb25EYXRlQW5kVGltZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0ZS1hbmQtdGltZVwiKTtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gc2V0RGF0YShpbnB1dENpdHkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIF91cGRhdGVEb20oKTtcclxuICAgICAgc2VhcmNoSW5wdXRCdWZmZXIgPSBpbnB1dENpdHk7XHJcbiAgICAgIGxldCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKGlucHV0Q2l0eSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICBpZiAoIWRhdGEuY3VycmVudCkgdGhyb3cgbmV3IEVycm9yKGRhdGEpO1xyXG4gICAgICBsb2NhdGlvbk5hbWUudGV4dENvbnRlbnQgPVxyXG4gICAgICAgIGRhdGEubG9jYXRpb24ubmFtZSArIFwiLCBcIiArIGRhdGEubG9jYXRpb24uY291bnRyeTtcclxuXHJcbiAgICAgIGxvY2F0aW9uRGF0ZUFuZFRpbWUudGV4dENvbnRlbnQgPSByZWZvcm1hdERhdGVUaW1lKFxyXG4gICAgICAgIGRhdGEubG9jYXRpb24ubG9jYWx0aW1lXHJcbiAgICAgICk7XHJcbiAgICAgIF9zZXRDdXJyZW50V2VhdGhlcihkYXRhKTtcclxuICAgICAgX3NldEZvcmVjYXN0KGRhdGEpO1xyXG4gICAgICBfc2V0VW5pdHMoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHNldERhdGEgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERvbU1hbmlwdWxhdGlvbjtcclxuXHJcbi8vYWRkIGttcGggYW1kIG1wZiBkaWZmZXJlbmNlXHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IERvbU1hbmlwdWxhdGlvbiBmcm9tIFwiLi9kb21cIjtcclxuRG9tTWFuaXB1bGF0aW9uLnNldERhdGEoXCJBbXN0ZXJkYW1cIik7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==