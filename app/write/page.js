'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Write() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const date = new Date().toISOString();
    const router = useRouter();

    const writeData = async () => {
        try {
            if (title.trim() === '' || nickname.trim() === '' || password.trim() === '' || text.trim() === '') {
                alert('빈칸을 모두 입력해주세요!');
            } else {
                const res = await fetch('/api/post/write', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, nickname, password, text, date }),
                });
                if (res.ok) {
                    router.push('/');
                    console.log('작성 성공');
                } else {
                    console.log('전송 실패');
                }
            }
        } catch (error) {
            console.log('오류남:', error);
        }
    };
    return (
        <div className="content">
            <div className="write">
                <div className="all_title">
                    <h2>OUR STORY</h2>
                    <p>다양한 사람을 만나고 생각의 폭을 넓혀보세요.</p>
                </div>
                <form className="write_form">
                    <div className="w_top">
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            onChange={(e) => {
                                setTitle(e.currentTarget.value);
                            }}
                            required={true}
                        />
                    </div>
                    <div className="w_mid">
                        <div className="wm_top">
                            <input
                                type="text"
                                placeholder="닉네임(최대 10자)"
                                maxLength={10}
                                onChange={(e) => {
                                    setNickname(e.currentTarget.value.trim());
                                }}
                                required={true}
                            />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                maxLength={10}
                                onChange={(e) => {
                                    setPassword(e.currentTarget.value.trim());
                                }}
                                required={true}
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
                            required={true}
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
                                writeData();
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
