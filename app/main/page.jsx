'use client';

import Link from 'next/link';
import { formatDate } from '@/util/formatDate';
import { useEffect, useState } from 'react';
import Loading from '../loading/page';

export default function Main() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isFirst = sessionStorage.getItem('firstVisit');
        if (!isFirst) {
            const timer = setTimeout(() => {
                setLoading(false);
                sessionStorage.setItem('firstVisit', 'true');
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const listFetchData = async () => {
            try {
                const res = await fetch('/api/post/list', {
                    method: 'GET',
                });
                const data = await res.json();
                console.log('dd:', data);
                setList(data);
            } catch (error) {
                console.log('에러남:', error);
            }
        };

        listFetchData();
    }, []);

    return (
        <div className="">
            {loading ? (
                <Loading />
            ) : (
                <div className="list_wrap">
                    <div className="all_title">
                        <h2>OUR STORY</h2>
                        <p>다양한 사람을 만나고 생각의 폭을 넓혀보세요.</p>
                    </div>
                    <div className="btn_wrap">
                        <Link href={'/write'} className="write_btn">
                            글작성
                        </Link>
                    </div>
                    {list.length === 0 ? (
                        <div className="list_line">
                            <p>작성된 글이 없습니다.</p>
                        </div>
                    ) : (
                        <ul>
                            {list.map((a, i) => {
                                return (
                                    <Link href={`/detail/${a._id}`} className="list_link">
                                        <div className="lw_top">
                                            <div className="nick">{a.nickname}</div>
                                            <div className="date">{formatDate(a.date)}</div>
                                        </div>
                                        <div className="lw_bottom">
                                            <div className="title">{a.title}</div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
