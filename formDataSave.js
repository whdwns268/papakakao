const connectDB = require('./connectDB');

async function formDataSave(userData) {
    console.log(userData)
    try {
        // 데이터베이스 컬렉션에 연결
        const database = await connectDB();
        const collection = database.collection("selectform");
        
        const result = await collection.insertOne(userData);

        console.log("데이터 저장 성공:", result);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('데이터를 저장하는 동안 오류가 발생했습니다.');
    }
}

module.exports = formDataSave; // 함수 실행 예시