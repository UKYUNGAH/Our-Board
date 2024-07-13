import { connectDB } from '@/util/database';

export default async function Handler(req, res) {
    if (req.method == 'POST') {
        const db = (await connectDB).db('Cluster0');
        let result = await db.collection('post').insertOne(req.body);
        return res.status(200).json('작성완료');
    }
}
