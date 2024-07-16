import { connectDB } from '@/util/database';

export default async function Handler(req, res) {
    const { postId } = req.query;
    if (req.method == 'GET') {
        const db = (await connectDB).db('Cluster0');
        let result = await db
            .collection('comment')
            .find({ postId: String(postId) })
            .toArray();
        return res.status(200).json(result);
    }
}
