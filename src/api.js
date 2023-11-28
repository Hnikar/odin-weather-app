const API_KEY = "bb18fd6402d04c85a3a234856232408&q";
async function fetchData(location) {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/current.json?key=${API_KEY}=${location}`,
			{ mode: "cors" }
		);
		return await response.json();
	} catch (error) {
		return error;
	}
}

export default fetchData;
