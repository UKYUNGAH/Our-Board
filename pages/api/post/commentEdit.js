import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function Handler(req, res) {
    if (req.method === 'PATCH') {
        const db = (await connectDB).db('Cluster0');
        const { id } = req.query;
        let result = await db.collection('comment').updateOne({ _id: new ObjectId(id) }, { $set: req.body });
        return res.status(200).json('수정완료');
    }
}
