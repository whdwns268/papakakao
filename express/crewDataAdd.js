const connectDB = require('./connectDB');

async function crewDataAdd(crewData) {
    console.log(crewData)
    try {
        const database = await connectDB();
        const collection = database.collection("crewkakaodata");

        // MongoDB에 데이터 추가
        const result = await collection.insertOne(crewData);
        console.log(result);
        return result;
    } catch (e) {
        return e;
    }
}

module.exports = crewDataAdd;