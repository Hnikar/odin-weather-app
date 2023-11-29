import fetchData from "./api";

const DomManipulation = (() => {
	const weatherDetailsElements = [
		{ class: ".wind", dataKey: "wind_kph" },
		{ class: ".humidity", dataKey: "humidity" },
		{ class: ".uvindex", dataKey: "uv" },
		{ class: ".visibility", dataKey: "vis_km" },
		{ class: ".cloudiness", dataKey: "cloud" },
		{ class: ".chanceofrain", dataKey: "chanceofrain" },
	];

	const searchForm = document.getElementById("search-form");
	const searchInput = document.getElementById("searchInput");

	const domElements = {};
	weatherDetailsElements.forEach((element) => {
		domElements[element.dataKey] = document.querySelector(element.class);
	});

	searchForm.addEventListener("submit", async function (event) {
		event.preventDefault();
		let searchInputValue = searchInput.value;
		await setData(searchInputValue);
	});

	let setData = async (inputCity) => {
		try {
			let data = await fetchData(inputCity);
			if (!data.current) throw new Error(data);
			await Promise.all(
				weatherDetailsElements.map(async (element) => {
					try {
						domElements[element.dataKey].textContent =
							data.current[element.dataKey];
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

export default DomManipulation;
