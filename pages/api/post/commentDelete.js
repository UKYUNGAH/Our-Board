import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function Handler(req, res) {
    if (req.method === 'DELETE') {
        const db = (await connectDB).db('Cluster0');
        const { id } = req.query;
        let result = await db.collection('comment').deleteOne({ _id: new ObjectId(id) });
        return res.status(200).json('삭제완료');
    }
}
