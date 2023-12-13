import fetchData from "./api";

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

	const forecastWeatherElements = [
		{ class: ".chance-of-rain", dataKey: "daily_chance_of_rain" },
		{ class: ".sunrise", dataKey: "sunrise" },
		{ class: ".sunset", dataKey: "sunset" },
		{ class: ".moon-phase", dataKey: "moon_phase" },
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
		forecastWeatherElements.forEach((element) => {
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

	async function _setCurrentWeather(data) {
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

	async function _setForecast(data, day) {
		forecastWeatherElements.map(async (element) => {
			try {
				if (element.dataKey === "daily_chance_of_rain")
					domWeatherElements[element.dataKey].textContent =
						data.forecast.forecastday[day].day[element.dataKey] +=
							"%";
				else
					domWeatherElements[element.dataKey].textContent =
						data.forecast.forecastday[day].astro[element.dataKey];
			} catch (error) {
				console.log("Error updating forecast element:", error);
			}
		});
	}

	async function setData(inputCity) {
		try {
			_updateDom();
			searchInputBuffer = inputCity;
			let data = await fetchData(inputCity);
			console.log(data);
			if (!data.current) throw new Error(data);
			locationName.textContent =
				data.location.name + ", " + data.location.country;
			locationDateAndTime.textContent = data.location.localtime;
			_setCurrentWeather(data);
			_setForecast(data, 0);
		} catch (error) {
			console.log(error);
		}
	}

	return { setData };
})();

export default DomManipulation;
