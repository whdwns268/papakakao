const connectDB = require('./connectDB');
const ObjectId = require('mongodb').ObjectId;

async function formDataDelete(formid) {
    console.log(formid.formnid);
    try {
        // 인자 검증
        if (!formid.formnid || !/^[0-9a-fA-F]{24}$/.test(formid.formnid)) {
            throw new Error("유효하지 않은 ID 형식");
        }

        const database = await connectDB();
        const collection = database.collection("selectform");
        const result = await collection.deleteOne({ _id: new ObjectId(formid.formnid) });
        
        console.log(result);
        return result;
    } catch (e) {
        console.error("데이터 삭제 중 오류 발생:", e);
        return e;
    }
}

module.exports = formDataDelete;