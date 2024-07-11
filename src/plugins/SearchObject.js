const handleNestedArray = (arr) => {
	while (Array.isArray(arr)) arr = arr[0];
	return arr;
}

const searchObject = (obj, value) => {
	if (obj === undefined || value === undefined) {
		throw new Error(
			"First argument should be an object followed by a value you want to find"
		);
	}

	if (typeof value === "string") {
		value = value.toLowerCase();
	}

	if (obj.constructor !== Object) {
		throw new Error("First argument must be of type Object");
	}

	let valueExists = false;


    for (let key in obj) {
        if (obj[key].constructor === Object) {
			valueExists = searchObject(obj[key], value);
		}

		if (Array.isArray(obj[key])) {
			for (let index = 0; index < obj[key].length; index++) {
				if (obj[key][index].constructor === Object) {
					valueExists = searchObject(obj[key][index], value);
				}

				if (Array.isArray(obj[key][index])) {
					const item = handleNestedArray(obj[key][index]);
					if (item.constructor === Object) {
						valueExists = searchObject(item, value);
					}

					if (typeof item === "string") {
						valueExists = item.toLowerCase().indexOf(value) > -1;
					}

					if (typeof item === "number") {
						valueExists = item === value;
					}

					if (valueExists) {
						return valueExists;
					}
				}

				if (typeof obj[key][index] === "string") {
					valueExists = obj[key][index].toLowerCase().indexOf(value) > -1;
				}

				if (typeof obj[key][index] === "number") {
					valueExists = obj[key][index] === value;
				}

				if (valueExists) {
					return valueExists;
				}
			}
		}

		if (typeof obj[key] === "string") {
			valueExists = obj[key].toLowerCase().indexOf(value) > -1;
		}

		if (typeof obj[key] === "number") {
			valueExists = obj[key] === value;
		}

		if (valueExists) {
			return valueExists;
		}
    }


	// for (let i = 0; i < keys.length; i++) {
	// 	const key = keys[i];
	// 	if (obj[key].constructor === Object) {
	// 		valueExists = searchObject(obj[key], value);
	// 	}

	// 	if (Array.isArray(obj[key])) {
	// 		for (let index = 0; index < obj[key].length; index++) {
	// 			if (obj[key][index].constructor === Object) {
	// 				valueExists = searchObject(obj[key][index], value);
	// 			}

	// 			if (Array.isArray(obj[key][index])) {
	// 				const item = handleNestedArray(obj[key][index]);
	// 				if (item.constructor === Object) {
	// 					valueExists = searchObject(item, value);
	// 				}

	// 				if (typeof item === "string") {
	// 					valueExists = item.toLowerCase().indexOf(value) > -1;
	// 				}

	// 				if (typeof item === "number") {
	// 					valueExists = item === value;
	// 				}

	// 				if (valueExists) {
	// 					return valueExists;
	// 				}
	// 			}

	// 			if (typeof obj[key][index] === "string") {
	// 				valueExists = obj[key][index].toLowerCase().indexOf(value) > -1;
	// 			}

	// 			if (typeof obj[key][index] === "number") {
	// 				valueExists = obj[key][index] === value;
	// 			}

	// 			if (valueExists) {
	// 				return valueExists;
	// 			}
	// 		}
	// 	}

	// 	if (typeof obj[key] === "string") {
	// 		valueExists = obj[key].toLowerCase().indexOf(value) > -1;
	// 	}

	// 	if (typeof obj[key] === "number") {
	// 		valueExists = obj[key] === value;
	// 	}

	// 	if (valueExists) {
	// 		return valueExists;
	// 	}
	// }

	return valueExists;
}

export default searchObject;