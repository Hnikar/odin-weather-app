import fetchData from "./api";

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
      let data = await fetchData(inputCity);
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

export default DomManipulation;
