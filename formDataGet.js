const connectDB = require('./connectDB');

async function formDataGet() {
    console.log()
    try {
        // 데이터베이스 컬렉션에 연결
        const database = await connectDB();
        const collection = database.collection("selectform");
        
        // 데이터베이스에서 모든 데이터를 가져옴
        const result = await collection.find({}).toArray();

        return result;
    } catch (error) {
        console.error(error);
        throw new Error('데이터를 가져오는 동안 오류가 발생했습니다.');
    }
}
module.exports = formDataGet;