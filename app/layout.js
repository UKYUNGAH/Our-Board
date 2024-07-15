import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/app/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: '우리의 게시판',
    description: '익명의 사람들이 즐길수있는 게시판 입니다.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="wrap">
                    <Header></Header>
                    {children}
                </div>
            </body>
        </html>
    );
}
