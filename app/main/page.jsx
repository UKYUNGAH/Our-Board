'use client';

import Link from 'next/link';
import { formatDate } from '@/util/formatDate';
import { useEffect, useState } from 'react';
import Loading from '../loading/page';

export default function Main() {
    const [list, setList] = useState([]); // 전체 게시글 목록 저장
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(''); // 검색어 저장
    const [filter, setFilter] = useState([]); // 필터링된 게시 글 목록 저장

    useEffect(() => {
        // 처음 방문 확인 후 3초동안 보여주기
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
                setList(data);
                setFilter(data);
            } catch (error) {
                console.log('에러남:', error);
            }
        };

        listFetchData();
    }, []);

    console.log('글목록', list);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if (search.trim() === '') {
                setFilter(list);
            } else {
                const filtered = list.filter(
                    (item) =>
                        item.title.toLowerCase().includes(search.toLocaleLowerCase()) ||
                        item.title.toLowerCase().includes(search.toLocaleLowerCase())
                );
                setFilter(filtered);
            }
        }
    };

    return (
        <div className="">
            {loading ? (
                <Loading />
            ) : (
                <div className="list_wrap">
                    <div className="all_title">
                        <h2>OUR STORY</h2>
                        <p>
                            다양한 사람을 만나고
                            <br /> 생각의 폭을 넓혀보세요.
                        </p>
                    </div>
                    <div className="search_wrap">
                        <input
                            type="text"
                            onChange={(e) => {
                                setSearch(e.currentTarget.value);
                            }}
                            onKeyDown={handleSearch}
                            placeholder="게시글의 제목을 입력해주세요."
                        />
                        <button
                            onClick={() => {
                                handleSearch();
                            }}
                        >
                            <img src="/s_btn5.png" alt="검색 아이콘" />
                        </button>
                    </div>

                    <div className="btn_wrap">
                        <Link href={'/write'} className="write_btn">
                            글작성
                        </Link>
                    </div>
                    {filter.length === 0 ? (
                        <div className="list_line">
                            <p>작성된 글이 없습니다.</p>
                        </div>
                    ) : (
                        <ul>
                            {filter.map((a, i) => {
                                return (
                                    <li key={i}>
                                        <Link href={`/detail/${a._id}`} className="list_link">
                                            <div className="lw_top">
                                                <div className="nick">{a.nickname}</div>
                                                <div className="date">{formatDate(a.date)}</div>
                                            </div>
                                            <div className="lw_bottom">
                                                <div className="title">{a.title}</div>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
