function splitEvenOddIndices(arr) {
	let evenArr = [];
	let oddArr = [];
	for(let i = 0; i < arr.length; i++) {
		if(i % 2)
			evenArr.push(arr[i]);
		else
			oddArr.push(arr[i]);
	}
    return { evenArr, oddArr };
}

function getNthBit(data, n) {
	return ((data[Math.floor(n/8)] >> n%8) % 2)
}

function getBitLength(data) {
	return (8 * (data.length-1)) + Math.floor(Math.log2(data[data.length-1])+1) ;
}

function parseWordSubstitutions(srcText, datastream) {
	let wording = /(<o .* o\/>)/g;
	wordSplit = srcText.split(wording);
	console.log("WordSplit: ", wordSplit);

	let {evenArr: optionalsText, oddArr: srcArr} = splitEvenOddIndices(wordSplit);
	console.log(srcArr);
	console.log(optionalsText);

	let optionalsArrs = [];
	for(let i = 0; i < optionalsText.length; i++) {
		let options = optionalsText[i].slice(3, optionalsText.length-3).split(" | ");
		console.log(options);
		optionalsArrs.push(options);
		optionalsArrs[i].length = 2 ** Math.floor(Math.log2(optionalsArrs[i].length));
	}

	//enmesh data
	let bitTracker = 0;
	let outputStr = "";

	let i = 0;
	for(; i < optionalsArrs.length && bitTracker < getBitLength(datastream); i++) {
		let bitCount = Math.min(
			Math.log2(optionalsArrs[i].length),
			getBitLength(datastream) - bitTracker
		);

		//get proper array index
		let index = 0;
		let j = 0;
		for(j = 0; j < bitCount; j++) {
			index = index << 1;
			index += getNthBit(datastream, bitTracker++);
		}
		console.log("index=", index);

		outputStr += (srcArr[i] + optionalsArrs[i][index]);
	}
	if(i < srcArr.length) {
		console.log("i=", i);
		outputStr += srcArr[i]
	}


	let success = true;
	if(bitTracker < getBitLength(datastream)) {
		console.log("Insufficient binary storage");
		success = false;
	}

	//just push through any unused data slots
	for(let j = i; j < optionalsArrs.length; j++) {
		outputStr += optionalsArrs[j][0];
	}

	return {outputStr, success}
}