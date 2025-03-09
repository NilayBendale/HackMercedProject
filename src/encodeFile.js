// encodeFile.js - Encodes hidden data into a text file
const fs = require("fs");
const { appendData } = require("./utils");
const trackerData = require("./trackerData");

const inputFile = "input.txt";
const outputFile = "encoded_output.txt";

function encodeFile() {
    // Read input text (if file exists)
    const text = fs.existsSync(inputFile) ? fs.readFileSync(inputFile, "utf8") : "";

    // Encode tracker data into the text
    const finalContent = appendData(text, trackerData.userID.concat(trackerData.division));

    // Save the encoded content
    fs.writeFileSync(outputFile, finalContent, "utf8");
    console.log(`✅ Data successfully encoded and saved in ${outputFile}`);
}

encodeFile();
