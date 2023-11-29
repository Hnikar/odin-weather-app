import fetchData from "./api";

const DomManipulation = (() => {
	const elements = [
		,
		{ class: ".wind", dataKey: "wind_kph" },
		{ class: ".humidity", dataKey: "humidity" },
		{ class: ".uvindex", dataKey: "uv" },
		{ class: ".visibility", dataKey: "vis_km" },
		{ class: ".cloudiness", dataKey: "cloud" },
		{ class: ".chanceofrain", dataKey: "chanceofrain" },
		{ class: ".sunrise", dataKey: "sunrise" },
		{ class: ".sunset", dataKey: "sunset" },
		{ class: ".moon", dataKey: "moon" },
	];

	let inputCity = "London";
	let setData = async () => {
		let data = await fetchData(inputCity);

		elements.forEach(async (element) => {
			try {
				let domElement = document.querySelector(element.class);
				domElement.textContent = data.current[element.dataKey];
			} catch (error) {
				console.log("Error updating element:", error);
			}
		});
		console.log(data);
	};

	return { setData };
})();

export default DomManipulation;
