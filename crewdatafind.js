const connectDB = require('./connectDB');

async function crewdatafind({...userData}) {
    const crewname = userData.crewname;

    try {
        // 데이터베이스 컬렉션에 연결
        
        const database = await connectDB();
        const collection = database.collection("crewkakaodata");

        // 데이터 조회
        const cursor = await collection.find({"crewname": crewname});
        const result = await cursor.toArray();
        console.log(result);
        
        return result
    } catch (error) {
        console.error(error);
        throw new Error('데이터를 조회하는 동안 오류가 발생했습니다.');
        return error;
    }
}

module.exports = crewdatafind; // 함수 실행 예시