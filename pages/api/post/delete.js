import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function Handler(req, res) {
    if (req.method == 'DELETE') {
        const db = (await connectDB).db('Cluster0');
        let result = await db.collection('post').deleteOne({ _id: new ObjectId(req.query) });
        return res.status(200).json('삭제완료');
    }
}
