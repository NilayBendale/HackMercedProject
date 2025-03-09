// decodeFile.js - Extracts hidden data from an encoded text file
const fs = require("fs");
const { dataFromRawText } = require("./utils");

const encodedFile = "encoded_output.txt";
const outputDataFile = "extracted_data.txt";

function decodeFile() {
    if (!fs.existsSync(encodedFile)) {
        console.log("❌ No encoded file found!");
        return;
    }

    // Read encoded text
    const encodedText = fs.readFileSync(encodedFile, "utf8");

    // Extract hidden data
    const extractedData = dataFromRawText(encodedText);
    
    // Save extracted data
    fs.writeFileSync(outputDataFile, extractedData.join(","), "utf8");
    console.log(`✅ Hidden data extracted and saved in ${outputDataFile}`);
}

decodeFile();
