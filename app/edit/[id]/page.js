'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Edit() {
    const [title, setTitle] = useState();
    const [text, setText] = useState();
    const [nickname, setNickName] = useState();
    const [password, setPassword] = useState();
    const [detail, setDetail] = useState();
    const date = new Date().toISOString();
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const editDetailData = async () => {
            try {
                const res = await fetch(`/api/post/detail?id=${id}`, {
                    method: 'GET',
                });
                const data = await res.json();
                setDetail(data);
            } catch (error) {
                console.log(error);
            }
        };
        editDetailData();
    }, [id]);

    const editData = async () => {
        try {
            const res = await fetch(`/api/post/edit?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text, nickname, password, date }),
            });
            if (res.ok) {
                console.log('수정완료');
                router.push('/');
            } else {
                console.log('수정실패');
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="content">
            <div className="write">
                <div className="all_title">
                    <h2>OUR STORY</h2>
                    <p>
                        다양한 사람을 만나고
                        <br /> 생각의 폭을 넓혀보세요.
                    </p>
                </div>
                <form className="write_form">
                    <div className="w_top">
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            onChange={(e) => {
                                setTitle(e.currentTarget.value);
                            }}
                            defaultValue={detail?.title}
                            required
                        />
                    </div>
                    <div className="w_mid">
                        <div className="wm_top">
                            <input
                                type="text"
                                maxLength={10}
                                placeholder="닉네임(최대 10자)"
                                onChange={(e) => {
                                    setNickname(e.currentTarget.value.trim());
                                }}
                                required
                                defaultValue={detail?.nickname}
                            />
                            <input
                                type="password"
                                maxLength={10}
                                placeholder="비밀번호(최대 10자)"
                                onChange={(e) => {
                                    setPassword(e.currentTarget.value.trim());
                                }}
                                required
                                defaultValue={detail?.password}
                            />
                        </div>
                        <div className="p_box">
                            <p>*쉬운 비밀번호를 입력하면 타인의 수정, 삭제가 쉽습니다.</p>
                            <p>
                                *음란물, 차별, 비하, 혐오 및 초상권, 저작권 침해 게시물은 민, 형사상의 책임을 질 수
                                있습니다.
                            </p>
                        </div>
                        <textarea
                            placeholder="내용을 입력하세요"
                            onChange={(e) => {
                                setText(e.currentTarget.value);
                            }}
                            defaultValue={detail?.text}
                        ></textarea>
                    </div>

                    <div className="save_box">
                        <button
                            type="button"
                            className="btn1"
                            onClick={() => {
                                router.back();
                            }}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            className="btn2"
                            onClick={() => {
                                editData();
                            }}
                        >
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
