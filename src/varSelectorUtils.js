function vsEncodeByte(num) {
	if(num <= 15)
		return String.fromCodePoint(0xfe00 + num);
	else
		return String.fromCodePoint(0xe0100 + num - 16);
}

function vsDecodeByte(char) {
	if(char.codePointAt(0) < 0xe0100)
		return char.codePointAt(0) - 0xfe00;
	else
		return char.codePointAt(0) - 0xe0100 + 16;
}

//DO NOT ATTEMPT TO ENCODE MORE THAN 2^16 BYTES OF DATA AT ONCE
function dataToVariationSelectors(arr) {
	let retString = "";
	for(let i = 0; i < arr.length; i++) {
		retString += vsEncodeByte(arr[i]);
	}

	//create 2 byte size header
	let bigByte = arr.length >> 8
	let smallByte = arr.length - (bigByte*256);


	//add header (VS1, big-endian size, contents)
	byteHeader = vsEncodeByte(bigByte) + vsEncodeByte(smallByte);
	//variation select 8 (U+FE07) has no standardized use so should be safe for all languages
	retString = String.fromCodePoint(0xfe07) + byteHeader + retString;
	return retString;
}

function dataFromVariationSelectors(str) {
	let dataOffset = 1;

	let bigByte = vsDecodeByte(str.slice(dataOffset, dataOffset+2));
	dataOffset++;
	if(bigByte > 15)
		dataOffset++;
	let smallByte = vsDecodeByte(str.slice(dataOffset++, dataOffset+2))
	if(smallByte > 15)
		dataOffset++;

	let dataWidth = (bigByte << 8) + smallByte;

	let retData = [];
	let i = 0;
	for(i = 0; retData.length < dataWidth; i++) {
		let newData = vsDecodeByte(str.slice(dataOffset+i, dataOffset+i+2));
		retData.push(newData);
		if(newData > 15)
			dataOffset++;
	}

	return [retData, dataOffset+i];
}

function dataFromRawText(str) {
	readMode = false
	dataStrings = [];
	for(let i = 0; i < str.length; i++) {
		console.log(str.slice(i, i+2).codePointAt(0).toString(16));
		if(str.slice(i, i+2).codePointAt(0) == 0xfe07) {
			versionRet = dataFromVariationSelectors(str.slice(i));
			dataStrings.push(versionRet[0]);
			console.log("i=", versionRet[1]);
			console.log("str.length=", str.length);
			console.log("versionRet[1]=", versionRet[1]);
			i += versionRet[1];
		}
	}

	return dataStrings;
}

function appendData(text, data) {
	dataStr = dataToVariationSelectors(data);
	return text + dataStr;
}

function meshData(text, data) {
	if(text.length == 0)
		return dataToVariationSelectors(data)
	else if(text.length == 1)
		return dataToVariationSelectors(data)

	lastSafeIndex = text.length-1;

	retText = text.split(0, text.len/2) + dataToVariationSelectors(data) + text.split(text.len/2, text.length-1);
}