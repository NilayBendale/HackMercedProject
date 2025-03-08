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
function dataToVersionSelectors(arr) {
	let retString = "";
	for(i = 0; i < arr.length; i++) {
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

function dataFromVersionSelectors(str) {
	let dataOffset = 1;

	let bigByte = vsDecodeByte(str.slice(dataOffset, dataOffset+2));
	dataOffset++;
	if(bigByte > 15)
		dataOffset++;
	let smallByte = vsDecodeByte(str.slice(dataOffset++, dataOffset+2))
	if(smallByte > 15)
		dataOffset++;
	console.log(bigByte);
	console.log(smallByte);

	let dataWidth = (bigByte << 8) + smallByte;
	console.log(dataWidth);

	let retData = [];
	for(i = 0; retData.length < dataWidth; i++) {
		let newData = vsDecodeByte(str.slice(dataOffset+i, dataOffset+i+2));
		retData.push(newData);
		if(newData > 15)
			dataOffset++;
	}

	return retData;
}

function appendData(text, data) {
	dataStr = dataToVersionSelectors(data);
	return text + dataStr;
}
