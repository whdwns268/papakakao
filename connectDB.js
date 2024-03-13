// MongoDB 클라이언트와 관련 설정을 불러옵니다.
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://munjongjun:WWLUdTjrWVyo6gOX@clusterpapa.ivhg8sf.mongodb.net/?retryWrites=true&w=majority&appName=Clusterpapa';
const client = new MongoClient(url);

async function connectDB() {
      
    try {
        // 데이터베이스 연결
        await client.connect();
        console.log('데이터베이스에 성공적으로 연결되었습니다.');

        // 데이터베이스와 컬렉션 선택
        const database = client.db("papa");

        // 컬렉션 객체 반환
        return database;
    } catch (error) {
        console.error('데이터베이스 연결 중 오류 발생:', error);
        throw error; // 오류를 다시 던져 호출자가 처리할 수 있도록 함
    }
}

module.exports = connectDB;
