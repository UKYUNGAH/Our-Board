import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { id, password } = req.body;
        const db = (await connectDB).db('Cluster0');
        let post = await db.collection('post').findOne({ _id: new ObjectId(id) });

        if (post) {
            if (post.password === password) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(401).json({ success: false, message: '비밀번호가 틀렸습니다.' });
            }
        } else {
            return res.status(404).json({ success: false, message: '포스트를 찾을 수 없습니다.' });
        }
    } else {
        return res.status(405).json({ success: false, message: '허용되지 않는 메서드입니다.' });
    }
}
