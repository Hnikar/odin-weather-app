/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/api.js
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

/* harmony default export */ const api = (fetchData);

;// CONCATENATED MODULE: ./src/dom.js


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

  async function _setDateTime(data) {
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
      let data = await api(inputCity);
      console.log(data);
      if (!data.current) throw new Error(data);
      _setDateTime(data);
      _setCurrentWeather(data);
      _setForecast(data);
      _setUnits();
    } catch (error) {
      console.log(error);
    }
  }

  return { setData };
})();

/* harmony default export */ const dom = (DomManipulation);

;// CONCATENATED MODULE: ./src/index.js


dom.setData("Amsterdam").then(() => {
  document.getElementById("loading-screen").style.opacity = "0";
  setTimeout(function () {
    document.getElementById("loading-screen").style.display = "none";
  }, 500);
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxRQUFRLEdBQUcsU0FBUztBQUN2RjtBQUNBO0FBQ0EseUNBQXlDLGNBQWM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBZSxTQUFTLEVBQUM7OztBQ25CSztBQUM5QjtBQUNBO0FBQ0E7QUFDQSxNQUFNLDZDQUE2QztBQUNuRCxNQUFNLGdEQUFnRDtBQUN0RCxNQUFNLCtEQUErRDtBQUNyRSxNQUFNLHVDQUF1QztBQUM3QyxNQUFNLDJDQUEyQztBQUNqRCxNQUFNLG9DQUFvQztBQUMxQyxNQUFNLDJDQUEyQztBQUNqRCxNQUFNLDBDQUEwQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsK0RBQStEO0FBQ3ZFLFFBQVEsMkNBQTJDO0FBQ25ELFFBQVEseUNBQXlDO0FBQ2pELFFBQVEsaURBQWlEO0FBQ3pEO0FBQ0E7QUFDQSxRQUFRLDREQUE0RDtBQUNwRSxRQUFRLDhEQUE4RDtBQUN0RTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFFBQVEsNERBQTREO0FBQ3BFLFFBQVEsOERBQThEO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLFNBQVMsR0FBRyxTQUFTO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsVUFBVSxHQUFHLFNBQVM7QUFDeEQ7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLG1DQUFtQyxXQUFXLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksTUFBTSxHQUFHLFFBQVE7QUFDbEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixHQUFTO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxDQUFDO0FBQ0Q7QUFDQSwwQ0FBZSxlQUFlLEVBQUM7OztBQzFTSztBQUNwQztBQUNBLEdBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVBJX0tFWSA9IFwiYmIxOGZkNjQwMmQwNGM4NWEzYTIzNDg1NjIzMjQwOCZxXCI7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmZXRjaERhdGEobG9jYXRpb24pIHtcclxuXHRjb25zdCBhcGlVcmwgPSBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvZm9yZWNhc3QuanNvbj9rZXk9JHtBUElfS0VZfT0ke2xvY2F0aW9ufSZkYXlzPTNgO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhcGlVcmwsIHsgbW9kZTogXCJjb3JzXCIgfSk7XHJcblxyXG5cdFx0aWYgKCFyZXNwb25zZS5vaykge1xyXG5cdFx0XHRjb25zdCBlcnJvckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvckRhdGEuZXJyb3IubWVzc2FnZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0cmV0dXJuIGVycm9yLm1lc3NhZ2U7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmZXRjaERhdGE7XHJcbiIsImltcG9ydCBmZXRjaERhdGEgZnJvbSBcIi4vYXBpXCI7XHJcblxyXG5jb25zdCBEb21NYW5pcHVsYXRpb24gPSAoKCkgPT4ge1xyXG4gIGNvbnN0IGN1cnJlbnRXZWF0aGVyRWxlbWVudHMgPSBbXHJcbiAgICB7IHNlbGVjdG9yOiBcIndlYXRoZXItdGVtcFwiLCBkYXRhS2V5OiBcInRlbXBfY1wiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcIndlYXRoZXItZGVzY1wiLCBkYXRhS2V5OiBcImNvbmRpdGlvblwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcIndlYXRoZXItZmVlbHMtbGlrZS1hbmNob3JcIiwgZGF0YUtleTogXCJmZWVsc2xpa2VfY1wiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcIndpbmRcIiwgZGF0YUtleTogXCJ3aW5kX2twaFwiIH0sXHJcbiAgICB7IHNlbGVjdG9yOiBcImh1bWlkaXR5XCIsIGRhdGFLZXk6IFwiaHVtaWRpdHlcIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJ1dmluZGV4XCIsIGRhdGFLZXk6IFwidXZcIiB9LFxyXG4gICAgeyBzZWxlY3RvcjogXCJ2aXNpYmlsaXR5XCIsIGRhdGFLZXk6IFwidmlzX2ttXCIgfSxcclxuICAgIHsgc2VsZWN0b3I6IFwiY2xvdWRpbmVzc1wiLCBkYXRhS2V5OiBcImNsb3VkXCIgfSxcclxuICBdO1xyXG5cclxuICBjb25zdCBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cyA9IFtcclxuICAgIFtcclxuICAgICAgeyBzZWxlY3RvcjogXCJjaGFuY2Utb2YtcmFpblwiLCBkYXRhS2V5OiBcImRhaWx5X2NoYW5jZV9vZl9yYWluLTBcIiB9LFxyXG4gICAgICB7IHNlbGVjdG9yOiBcInN1bnJpc2VcIiwgZGF0YUtleTogXCJzdW5yaXNlLTBcIiB9LFxyXG4gICAgICB7IHNlbGVjdG9yOiBcInN1bnNldFwiLCBkYXRhS2V5OiBcInN1bnNldC0wXCIgfSxcclxuICAgICAgeyBzZWxlY3RvcjogXCJtb29uLXBoYXNlXCIsIGRhdGFLZXk6IFwibW9vbl9waGFzZS0wXCIgfSxcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIHsgc2VsZWN0b3I6IFwid2Vla2x5LWZvcmVjYXN0LXRlbXAtMVwiLCBkYXRhS2V5OiBcImF2Z3RlbXBfYy0xXCIgfSxcclxuICAgICAgeyBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3Qtd2luZC0xXCIsIGRhdGFLZXk6IFwibWF4d2luZF9rcGgtMVwiIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3QtY2hhbmNlLW9mLXJhaW4tMVwiLFxyXG4gICAgICAgIGRhdGFLZXk6IFwiZGFpbHlfY2hhbmNlX29mX3JhaW4tMVwiLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgeyBzZWxlY3RvcjogXCJ3ZWVrbHktZm9yZWNhc3QtdGVtcC0yXCIsIGRhdGFLZXk6IFwiYXZndGVtcF9jLTJcIiB9LFxyXG4gICAgICB7IHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC13aW5kLTJcIiwgZGF0YUtleTogXCJtYXh3aW5kX2twaC0yXCIgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNlbGVjdG9yOiBcIndlZWtseS1mb3JlY2FzdC1jaGFuY2Utb2YtcmFpbi0yXCIsXHJcbiAgICAgICAgZGF0YUtleTogXCJkYWlseV9jaGFuY2Vfb2ZfcmFpbi0yXCIsXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gIF07XHJcblxyXG4gIGNvbnN0IGZhcmVuaGVpdFRlbXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZhcmVuaGVpdC1idG5cIik7XHJcbiAgY29uc3QgY2Vsc2l1c1RlbXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNlbHNpdXMtYnRuXCIpO1xyXG5cclxuICBmYXJlbmhlaXRUZW1wQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0KHRydWUpO1xyXG4gIH0pO1xyXG5cclxuICBjZWxzaXVzVGVtcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgYXdhaXQgX3VwZGF0ZVRlbXBlcmF0dXJlVW5pdCgpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzZWFyY2hGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtZm9ybVwiKTtcclxuICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWlucHV0XCIpO1xyXG5cclxuICBjb25zdCBkb21XZWF0aGVyRWxlbWVudHMgPSB7fTtcclxuICBmdW5jdGlvbiBfdXBkYXRlRG9tKCkge1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgZWxlbWVudC5zZWxlY3RvclxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgICBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXkpID0+IHtcclxuICAgICAgZGF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgZWxlbWVudC5zZWxlY3RvclxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZWFyY2hGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IHNlYXJjaElucHV0VmFsdWUgPSBzZWFyY2hJbnB1dC52YWx1ZTtcclxuICAgIGF3YWl0IHNldERhdGEoc2VhcmNoSW5wdXRWYWx1ZSk7XHJcbiAgICBzZWFyY2hGb3JtLnJlc2V0KCk7XHJcbiAgfSk7XHJcblxyXG4gIGxldCBzZWFyY2hJbnB1dEJ1ZmZlcjtcclxuICBhc3luYyBmdW5jdGlvbiBfdXBkYXRlVGVtcGVyYXR1cmVVbml0KGFtZXJpY2FuVW5pdHMgPSBmYWxzZSkge1xyXG4gICAgbGV0IHRlbXBVbml0LCBmZWVsc0xpa2VUZW1wVW5pdDtcclxuICAgIGxldCBzcGVlZFVuaXQ7XHJcbiAgICBsZXQgdmlzVW5pdDtcclxuICAgIGlmIChhbWVyaWNhblVuaXRzKSB7XHJcbiAgICAgIHRlbXBVbml0ID0gXCJ0ZW1wX2ZcIjtcclxuICAgICAgZmVlbHNMaWtlVGVtcFVuaXQgPSBcImZlZWxzbGlrZV9mXCI7XHJcbiAgICAgIHNwZWVkVW5pdCA9IFwid2luZF9tcGhcIjtcclxuICAgICAgdmlzVW5pdCA9IFwidmlzX21pbGVzXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0ZW1wVW5pdCA9IFwidGVtcF9jXCI7XHJcbiAgICAgIGZlZWxzTGlrZVRlbXBVbml0ID0gXCJmZWVsc2xpa2VfY1wiO1xyXG4gICAgICBzcGVlZFVuaXQgPSBcIndpbmRfa3BoXCI7XHJcbiAgICAgIHZpc1VuaXQgPSBcInZpc19rbVwiO1xyXG4gICAgfVxyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50c1swXS5kYXRhS2V5ID0gdGVtcFVuaXQ7XHJcbiAgICBjdXJyZW50V2VhdGhlckVsZW1lbnRzWzJdLmRhdGFLZXkgPSBmZWVsc0xpa2VUZW1wVW5pdDtcclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHNbM10uZGF0YUtleSA9IHNwZWVkVW5pdDtcclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHNbNl0uZGF0YUtleSA9IHZpc1VuaXQ7XHJcblxyXG4gICAgZm9yZWNhc3RXZWF0aGVyRWxlbWVudHMuZm9yRWFjaCgoZGF5LCBkYXlJbmRleCkgPT4ge1xyXG4gICAgICBkYXkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9jXCIgfHxcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiYXZndGVtcF9mXCJcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9IGBhdmcke3RlbXBVbml0fS0ke2RheUluZGV4fWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwibWF4d2luZF9rcGhcIiB8fFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJtYXh3aW5kX21waFwiXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPSBgbWF4JHtzcGVlZFVuaXR9LSR7ZGF5SW5kZXh9YDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYXdhaXQgc2V0RGF0YShzZWFyY2hJbnB1dEJ1ZmZlcik7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBfc2V0Q3VycmVudFdlYXRoZXIoZGF0YSkge1xyXG4gICAgY3VycmVudFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKGFzeW5jIChlbGVtZW50KSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJjb25kaXRpb25cIilcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgZGF0YS5jdXJyZW50LmNvbmRpdGlvbi50ZXh0O1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID0gTWF0aC5yb3VuZChcclxuICAgICAgICAgICAgZGF0YS5jdXJyZW50W2VsZW1lbnQuZGF0YUtleV1cclxuICAgICAgICAgICk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBjdXJyZW50IHdlYXRoZXIgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZXRGb3JlY2FzdChkYXRhKSB7XHJcbiAgICBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXksIGRheUluZGV4KSA9PiB7XHJcbiAgICAgIGRheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmIChkYXlJbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgICAgICAgZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uYXN0cm9bXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpXHJcbiAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgICAgICAgZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uZGF5W1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKVxyXG4gICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwiZGFpbHlfY2hhbmNlX29mX3JhaW5cIikge1xyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgICAgICAgZGF0YS5mb3JlY2FzdC5mb3JlY2FzdGRheVtkYXlJbmRleF0uZGF5W1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKVxyXG4gICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgZm9yZWNhc3QgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZXRVbml0cygpIHtcclxuICAgIGN1cnJlbnRXZWF0aGVyRWxlbWVudHMuZm9yRWFjaChhc3luYyAoZWxlbWVudCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwidGVtcF9jXCIgfHwgZWxlbWVudC5kYXRhS2V5ID09PSBcImZlZWxzbGlrZV9jXCIpXHJcbiAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwQ1wiO1xyXG4gICAgICAgIGVsc2UgaWYgKFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID09PSBcInRlbXBfZlwiIHx8XHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPT09IFwiZmVlbHNsaWtlX2ZcIlxyXG4gICAgICAgIClcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiwrBGXCI7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgZWxlbWVudC5kYXRhS2V5ID09PSBcInV2XCIgfHxcclxuICAgICAgICAgIGVsZW1lbnQuZGF0YUtleSA9PT0gXCJodW1pZGl0eVwiIHx8XHJcbiAgICAgICAgICBlbGVtZW50LmRhdGFLZXkgPT09IFwiY2xvdWRcIlxyXG4gICAgICAgIClcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiJVwiO1xyXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwidmlzX2ttXCIpXHJcbiAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcImttXCI7XHJcbiAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5kYXRhS2V5ID09PSBcInZpc19taWxlc1wiKVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCJtXCI7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkgPT09IFwid2luZF9rcGhcIilcclxuICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwia20vaFwiO1xyXG4gICAgICAgIGVsc2UgaWYgKGVsZW1lbnQuZGF0YUtleSA9PT0gXCJ3aW5kX21waFwiKVxyXG4gICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCJtL2hcIjtcclxuICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB1cGRhdGluZyBjdXJyZW50IHdlYXRoZXIgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3JlY2FzdFdlYXRoZXJFbGVtZW50cy5mb3JFYWNoKChkYXksIGRheUluZGV4KSA9PiB7XHJcbiAgICAgIGRheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcImF2Z3RlbXBfY1wiKVxyXG4gICAgICAgICAgICBkb21XZWF0aGVyRWxlbWVudHNbZWxlbWVudC5kYXRhS2V5XS50ZXh0Q29udGVudCArPSBcIsKwQ1wiO1xyXG4gICAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJhdmd0ZW1wX2ZcIilcclxuICAgICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCLCsEZcIjtcclxuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5kYXRhS2V5LnNsaWNlKDAsIC0yKSA9PT0gXCJkYWlseV9jaGFuY2Vfb2ZfcmFpblwiKSB7XHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwiJVwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZGF0YUtleS5zbGljZSgwLCAtMikgPT09IFwibWF4d2luZF9rcGhcIilcclxuICAgICAgICAgICAgZG9tV2VhdGhlckVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0udGV4dENvbnRlbnQgKz0gXCJrbS9oXCI7XHJcbiAgICAgICAgICBlbHNlIGlmIChlbGVtZW50LmRhdGFLZXkuc2xpY2UoMCwgLTIpID09PSBcIm1heHdpbmRfbXBoXCIpXHJcbiAgICAgICAgICAgIGRvbVdlYXRoZXJFbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ICs9IFwibS9oXCI7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgZm9yZWNhc3QgZWxlbWVudDpcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlZm9ybWF0RGF0ZVRpbWUoZGF0ZVRpbWVTdHIsIGRheU9mV2Vla09ubHkgPSBmYWxzZSkge1xyXG4gICAgY29uc3QgW2RhdGVQYXJ0LCB0aW1lUGFydF0gPSBkYXRlVGltZVN0ci5zcGxpdChcIiBcIik7XHJcblxyXG4gICAgY29uc3QgZGF0ZU9iaiA9IG5ldyBEYXRlKGRhdGVQYXJ0KTtcclxuXHJcbiAgICBjb25zdCBkYXlPZldlZWsgPSBbXHJcbiAgICAgIFwiU3VuZGF5XCIsXHJcbiAgICAgIFwiTW9uZGF5XCIsXHJcbiAgICAgIFwiVHVlc2RheVwiLFxyXG4gICAgICBcIldlZG5lc2RheVwiLFxyXG4gICAgICBcIlRodXJzZGF5XCIsXHJcbiAgICAgIFwiRnJpZGF5XCIsXHJcbiAgICAgIFwiU2F0dXJkYXlcIixcclxuICAgIF1bZGF0ZU9iai5nZXREYXkoKV07XHJcbiAgICBjb25zdCBkYXlPZk1vbnRoID0gZGF0ZU9iai5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtb250aCA9IFtcclxuICAgICAgXCJKYW51YXJ5XCIsXHJcbiAgICAgIFwiRmVicnVhcnlcIixcclxuICAgICAgXCJNYXJjaFwiLFxyXG4gICAgICBcIkFwcmlsXCIsXHJcbiAgICAgIFwiTWF5XCIsXHJcbiAgICAgIFwiSnVuZVwiLFxyXG4gICAgICBcIkp1bHlcIixcclxuICAgICAgXCJBdWd1c3RcIixcclxuICAgICAgXCJTZXB0ZW1iZXJcIixcclxuICAgICAgXCJPY3RvYmVyXCIsXHJcbiAgICAgIFwiTm92ZW1iZXJcIixcclxuICAgICAgXCJEZWNlbWJlclwiLFxyXG4gICAgXVtkYXRlT2JqLmdldE1vbnRoKCldO1xyXG4gICAgY29uc3QgeWVhciA9IGRhdGVPYmouZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgICBsZXQgaG91cnMgPSBcIlwiO1xyXG4gICAgbGV0IG1pbnV0ZXMgPSBcIlwiO1xyXG5cclxuICAgIGlmICh0aW1lUGFydCkge1xyXG4gICAgICBbaG91cnMsIG1pbnV0ZXNdID0gdGltZVBhcnQuc3BsaXQoXCI6XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXlPZldlZWtPbmx5KSB7XHJcbiAgICAgIHJldHVybiBkYXlPZldlZWs7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBmb3JtYXR0ZWREYXRlVGltZSA9IGAke2RheU9mV2Vla30gJHtkYXlPZk1vbnRofSAke21vbnRofSAke3llYXJ9IHwgJHtob3Vyc306JHttaW51dGVzfWA7XHJcbiAgICAgIHJldHVybiBmb3JtYXR0ZWREYXRlVGltZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIF9zZXREYXRlVGltZShkYXRhKSB7XHJcbiAgICBjb25zdCBsb2NhdGlvbk5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvY2F0aW9uLWRhdGFcIik7XHJcbiAgICBjb25zdCBsb2NhdGlvbkRhdGVBbmRUaW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXRlLWFuZC10aW1lXCIpO1xyXG5cclxuICAgIGxvY2F0aW9uTmFtZS50ZXh0Q29udGVudCA9XHJcbiAgICAgIGRhdGEubG9jYXRpb24ubmFtZSArIFwiLCBcIiArIGRhdGEubG9jYXRpb24uY291bnRyeTtcclxuXHJcbiAgICBsb2NhdGlvbkRhdGVBbmRUaW1lLnRleHRDb250ZW50ID0gcmVmb3JtYXREYXRlVGltZShkYXRhLmxvY2F0aW9uLmxvY2FsdGltZSk7XHJcblxyXG4gICAgY29uc3QgZm9yZWNhc3REYXlMaXN0ID0gW1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndlZWtseS1mb3JlY2FzdC1kYXktMVwiKSxcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWVrbHktZm9yZWNhc3QtZGF5LTJcIiksXHJcbiAgICBdO1xyXG4gICAgZm9yZWNhc3REYXlMaXN0LmZvckVhY2goKGRheSwgaW5kZXgpID0+IHtcclxuICAgICAgZGF5LnRleHRDb250ZW50ID0gcmVmb3JtYXREYXRlVGltZShcclxuICAgICAgICBkYXRhLmZvcmVjYXN0LmZvcmVjYXN0ZGF5WyhpbmRleCArPSAxKV0uZGF0ZSxcclxuICAgICAgICB0cnVlXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgYXN5bmMgZnVuY3Rpb24gc2V0RGF0YShpbnB1dENpdHkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIF91cGRhdGVEb20oKTtcclxuICAgICAgc2VhcmNoSW5wdXRCdWZmZXIgPSBpbnB1dENpdHk7XHJcbiAgICAgIGxldCBkYXRhID0gYXdhaXQgZmV0Y2hEYXRhKGlucHV0Q2l0eSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICBpZiAoIWRhdGEuY3VycmVudCkgdGhyb3cgbmV3IEVycm9yKGRhdGEpO1xyXG4gICAgICBfc2V0RGF0ZVRpbWUoZGF0YSk7XHJcbiAgICAgIF9zZXRDdXJyZW50V2VhdGhlcihkYXRhKTtcclxuICAgICAgX3NldEZvcmVjYXN0KGRhdGEpO1xyXG4gICAgICBfc2V0VW5pdHMoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHNldERhdGEgfTtcclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERvbU1hbmlwdWxhdGlvbjtcclxuIiwiaW1wb3J0IERvbU1hbmlwdWxhdGlvbiBmcm9tIFwiLi9kb21cIjtcclxuXHJcbkRvbU1hbmlwdWxhdGlvbi5zZXREYXRhKFwiQW1zdGVyZGFtXCIpLnRoZW4oKCkgPT4ge1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1zY3JlZW5cIikuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xyXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXNjcmVlblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfSwgNTAwKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==