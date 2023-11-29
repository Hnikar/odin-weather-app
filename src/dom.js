import fetchData from "./api";

const DomManipulation = (() => {
	const weatherDetailsElements = [
		,
		{ class: ".wind", dataKey: "wind_kph" },
		{ class: ".humidity", dataKey: "humidity" },
		{ class: ".uvindex", dataKey: "uv" },
		{ class: ".visibility", dataKey: "vis_km" },
		{ class: ".cloudiness", dataKey: "cloud" },
		{ class: ".chanceofrain", dataKey: "chanceofrain" },
	];
	document
		.getElementById("search-form")
		.addEventListener("submit", function (event) {
			event.preventDefault();
			console.log("test");
			let searchInputValue = document.getElementById("searchInput").value;
			setData(searchInputValue);
		});

	let setData = async (inputCity) => {
		let data = await fetchData(inputCity);

		weatherDetailsElements.forEach(async (element) => {
			try {
				let domElement = document.querySelector(element.class);
				domElement.textContent = data.current[element.dataKey];
			} catch (error) {
				console.log("Error updating element:", error);
			}
		});
		console.log(data);
	};

	return {};
})();

export default DomManipulation;
