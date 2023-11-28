import fetchData from "./api";

const DomManipulation = (() => {
	let inputCity = "London";
	let setData = async () => {
		try {
			let data = await fetchData(inputCity);
			return data.current.cloud;
		} catch (error) {
			return error;
		}
	};

	return { setData };
})();

export default DomManipulation;
