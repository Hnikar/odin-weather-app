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
	const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}=${location}`;

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
	const weatherDetailsElements = [
		{ class: ".temp", dataKey: "temp_c" },
		{ class: ".wind", dataKey: "wind_kph" },
		{ class: ".humidity", dataKey: "humidity" },
		{ class: ".uvindex", dataKey: "uv" },
		{ class: ".visibility", dataKey: "vis_km" },
		{ class: ".cloudiness", dataKey: "cloud" },
		{ class: ".chanceofrain", dataKey: "chanceofrain" },
	];

	const farenheitTempBtn = document.getElementById("farenheit-btn");
	const celsiusTempBtn = document.getElementById("celsius-btn");

	farenheitTempBtn.addEventListener("click", async () => {
		await _updateTemperatureUnit("temp_f");
	});

	celsiusTempBtn.addEventListener("click", async () => {
		await _updateTemperatureUnit("temp_c");
	});

	const searchForm = document.getElementById("search-form");
	const searchInput = document.getElementById("searchInput");

	const domElements = {};
	function _updateDom() {
		weatherDetailsElements.forEach((element) => {
			domElements[element.dataKey] = document.querySelector(
				element.class
			);
		});
	}

	searchForm.addEventListener("submit", async function (event) {
		event.preventDefault();
		let searchInputValue = searchInput.value;
		await setData(searchInputValue);
	});

	let searchInputBuffer;
	const _updateTemperatureUnit = async (unit) => {
		weatherDetailsElements[0].dataKey = unit;
		_updateDom();
		await setData(searchInputBuffer);
		console.log("test");
	};

	let setData = async (inputCity) => {
		try {
			_updateDom();
			searchInputBuffer = inputCity;
			let data = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(inputCity);
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomManipulation);


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0Esa0VBQWtFLFFBQVEsR0FBRyxTQUFTOztBQUV0RjtBQUNBLHlDQUF5QyxjQUFjOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJLOztBQUU5QjtBQUNBO0FBQ0EsSUFBSSxtQ0FBbUM7QUFDdkMsSUFBSSxxQ0FBcUM7QUFDekMsSUFBSSx5Q0FBeUM7QUFDN0MsSUFBSSxrQ0FBa0M7QUFDdEMsSUFBSSx5Q0FBeUM7QUFDN0MsSUFBSSx3Q0FBd0M7QUFDNUMsSUFBSSxpREFBaUQ7QUFDckQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsZ0RBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVixDQUFDOztBQUVELGlFQUFlLGVBQWUsRUFBQzs7Ozs7OztVQzFFL0I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05vQztBQUNwQyw0Q0FBZSIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFQSV9LRVkgPSBcImJiMThmZDY0MDJkMDRjODVhM2EyMzQ4NTYyMzI0MDgmcVwiO1xuXG5hc3luYyBmdW5jdGlvbiBmZXRjaERhdGEobG9jYXRpb24pIHtcblx0Y29uc3QgYXBpVXJsID0gYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL2N1cnJlbnQuanNvbj9rZXk9JHtBUElfS0VZfT0ke2xvY2F0aW9ufWA7XG5cblx0dHJ5IHtcblx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGFwaVVybCwgeyBtb2RlOiBcImNvcnNcIiB9KTtcblxuXHRcdGlmICghcmVzcG9uc2Uub2spIHtcblx0XHRcdGNvbnN0IGVycm9yRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvckRhdGEuZXJyb3IubWVzc2FnZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gZXJyb3IubWVzc2FnZTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBmZXRjaERhdGE7XG4iLCJpbXBvcnQgZmV0Y2hEYXRhIGZyb20gXCIuL2FwaVwiO1xuXG5jb25zdCBEb21NYW5pcHVsYXRpb24gPSAoKCkgPT4ge1xuXHRjb25zdCB3ZWF0aGVyRGV0YWlsc0VsZW1lbnRzID0gW1xuXHRcdHsgY2xhc3M6IFwiLnRlbXBcIiwgZGF0YUtleTogXCJ0ZW1wX2NcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLndpbmRcIiwgZGF0YUtleTogXCJ3aW5kX2twaFwiIH0sXG5cdFx0eyBjbGFzczogXCIuaHVtaWRpdHlcIiwgZGF0YUtleTogXCJodW1pZGl0eVwiIH0sXG5cdFx0eyBjbGFzczogXCIudXZpbmRleFwiLCBkYXRhS2V5OiBcInV2XCIgfSxcblx0XHR7IGNsYXNzOiBcIi52aXNpYmlsaXR5XCIsIGRhdGFLZXk6IFwidmlzX2ttXCIgfSxcblx0XHR7IGNsYXNzOiBcIi5jbG91ZGluZXNzXCIsIGRhdGFLZXk6IFwiY2xvdWRcIiB9LFxuXHRcdHsgY2xhc3M6IFwiLmNoYW5jZW9mcmFpblwiLCBkYXRhS2V5OiBcImNoYW5jZW9mcmFpblwiIH0sXG5cdF07XG5cblx0Y29uc3QgZmFyZW5oZWl0VGVtcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmFyZW5oZWl0LWJ0blwiKTtcblx0Y29uc3QgY2Vsc2l1c1RlbXBCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNlbHNpdXMtYnRuXCIpO1xuXG5cdGZhcmVuaGVpdFRlbXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCBfdXBkYXRlVGVtcGVyYXR1cmVVbml0KFwidGVtcF9mXCIpO1xuXHR9KTtcblxuXHRjZWxzaXVzVGVtcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQoXCJ0ZW1wX2NcIik7XG5cdH0pO1xuXG5cdGNvbnN0IHNlYXJjaEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1mb3JtXCIpO1xuXHRjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoSW5wdXRcIik7XG5cblx0Y29uc3QgZG9tRWxlbWVudHMgPSB7fTtcblx0ZnVuY3Rpb24gX3VwZGF0ZURvbSgpIHtcblx0XHR3ZWF0aGVyRGV0YWlsc0VsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblx0XHRcdGRvbUVsZW1lbnRzW2VsZW1lbnQuZGF0YUtleV0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRlbGVtZW50LmNsYXNzXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2VhcmNoRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IHNlYXJjaElucHV0VmFsdWUgPSBzZWFyY2hJbnB1dC52YWx1ZTtcblx0XHRhd2FpdCBzZXREYXRhKHNlYXJjaElucHV0VmFsdWUpO1xuXHR9KTtcblxuXHRsZXQgc2VhcmNoSW5wdXRCdWZmZXI7XG5cdGNvbnN0IF91cGRhdGVUZW1wZXJhdHVyZVVuaXQgPSBhc3luYyAodW5pdCkgPT4ge1xuXHRcdHdlYXRoZXJEZXRhaWxzRWxlbWVudHNbMF0uZGF0YUtleSA9IHVuaXQ7XG5cdFx0X3VwZGF0ZURvbSgpO1xuXHRcdGF3YWl0IHNldERhdGEoc2VhcmNoSW5wdXRCdWZmZXIpO1xuXHRcdGNvbnNvbGUubG9nKFwidGVzdFwiKTtcblx0fTtcblxuXHRsZXQgc2V0RGF0YSA9IGFzeW5jIChpbnB1dENpdHkpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0X3VwZGF0ZURvbSgpO1xuXHRcdFx0c2VhcmNoSW5wdXRCdWZmZXIgPSBpbnB1dENpdHk7XG5cdFx0XHRsZXQgZGF0YSA9IGF3YWl0IGZldGNoRGF0YShpbnB1dENpdHkpO1xuXHRcdFx0aWYgKCFkYXRhLmN1cnJlbnQpIHRocm93IG5ldyBFcnJvcihkYXRhKTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFxuXHRcdFx0XHR3ZWF0aGVyRGV0YWlsc0VsZW1lbnRzLm1hcChhc3luYyAoZWxlbWVudCkgPT4ge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRkb21FbGVtZW50c1tlbGVtZW50LmRhdGFLZXldLnRleHRDb250ZW50ID1cblx0XHRcdFx0XHRcdFx0ZGF0YS5jdXJyZW50W2VsZW1lbnQuZGF0YUtleV07XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRXJyb3IgdXBkYXRpbmcgZWxlbWVudDpcIiwgZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHsgc2V0RGF0YSB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgRG9tTWFuaXB1bGF0aW9uO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgRG9tTWFuaXB1bGF0aW9uIGZyb20gXCIuL2RvbVwiO1xuRG9tTWFuaXB1bGF0aW9uLnNldERhdGEoXCJBbXN0ZXJkYW1cIik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=