'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDate } from '@/util/formatDate';

export default function Detail() {
    const params = useParams();
    const id = params.id;
    const router = useRouter();

    // api에 필요한 상태
    const [detail, setDetail] = useState();

    // 모달에 필요함
    const [modalType, setModalType] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
        const detailData = async () => {
            try {
                const res = await fetch(`/api/post/detail?id=${id}`, {
                    method: 'GET',
                });
                const data = await res.json();
                setDetail(data);
            } catch (error) {
                console.log('에러남:', error);
            }
        };
        detailData();
    }, [id]);
    // 오픈
    const handleModalOpen = (type) => {
        setModalType(type);
        console.log('모달 오픈:', type);
    };
    // 닫기
    const handleModalClose = () => {
        setModalType('');
        setPassword('');
        setPasswordError(false);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const passwordData = async () => {
        try {
            const res = await fetch('/api/post/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, password }),
            });
            const data = await res.json(); // 여기서 await 추가

            if (data.success) {
                setPasswordError(false);
                handleModalClose();
                if (modalType === 'edit') {
                    router.push(`/edit/${id}`);
                } else if (modalType === 'delete') {
                    await fetch(`/api/post/delete?id=${id}`, {
                        method: 'DELETE',
                    });
                    router.push('/');
                }
            } else {
                setPasswordError(true);
            }
        } catch (error) {
            console.log('에러남:', error);
            setPasswordError(true);
        }
    };

    return (
        <div className="detail content">
            <div className="all_title">
                <h2>OUR STORY</h2>
                <p>
                    다양한 사람을 만나고 <br /> 생각의 폭을 넓혀보세요.
                </p>
            </div>
            <div className="detail_wrap">
                <div className="title">
                    <div className="title_l">
                        <h2>{detail?.title}</h2>
                    </div>
                    <div className="title_r">
                        <button
                            type="button"
                            onClick={() => {
                                handleModalOpen('edit');
                            }}
                        >
                            수정
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                handleModalOpen('delete');
                            }}
                        >
                            삭제
                        </button>
                    </div>
                </div>
                <div className="info">
                    <h3>{detail?.nickname}</h3>
                    <h4>{formatDate(detail?.date)}</h4>
                </div>
                <div className="contents">
                    <p>{detail?.text}</p>
                </div>
            </div>
            {modalType && (
                <Modal
                    modalType={modalType}
                    handleModalClose={handleModalClose}
                    password={password}
                    handlePasswordChange={handlePasswordChange}
                    passwordData={passwordData}
                    passwordError={passwordError}
                />
            )}
        </div>
    );
}

function Modal({ modalType, handleModalClose, password, handlePasswordChange, passwordData, passwordError }) {
    return (
        <div className="modal">
            <div className="m_wrap">
                <div className="m_box">
                    <h1>비밀번호 확인이 필요합니다.</h1>
                    <input
                        type="password"
                        name="modal_password"
                        id="modal_password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="비밀번호를 입력해주세요."
                    />
                    {passwordError && (
                        <label htmlFor="modal_password">* 비밀번호가 틀렸습니다. 다시 입력해주세요.</label>
                    )}
                    <button type="submit" className="m_ok_btn" onClick={passwordData}>
                        확인
                    </button>
                    <button type="button" className="m_close_btn" onClick={handleModalClose}>
                        X
                    </button>
                </div>
            </div>
        </div>
    );
}
