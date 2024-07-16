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

    // 댓글에 필요함
    const [commentText, setCommentText] = useState('');
    const [commentName, setCommentName] = useState('');
    const [commentPassword, setCommentPassword] = useState('');
    const [commentList, setCommentList] = useState([]);
    const date = new Date().toISOString();

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

    // 댓글 작성 버튼
    const commentBtn = async () => {
        try {
            const res = await fetch('/api/post/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: id,
                    name: commentName,
                    commentPassword: commentPassword,
                    content: commentText,
                    date: date,
                }),
            });
            if (res.ok) {
                const newComment = {
                    postId: id,
                    name: commentName,
                    content: commentText,
                    date: date,
                };
                setCommentList((prevComments) => [...prevComments, newComment]);
                setCommentText('');
                setCommentName('');
                setCommentPassword('');
                console.log('댓글 작성 완료!');
            } else {
                console.log('작성 실패');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 패스워드 확인
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

    useEffect(() => {
        const commentData = async () => {
            try {
                const res = await fetch(`/api/post/commentDetail?postId=${id}`, {
                    method: 'GET',
                });
                const data = await res.json();
                setCommentList(data);
            } catch (error) {
                console.log('에러남,', error);
            }
        };
        commentData();
    }, []);

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
            <Comment
                commentText={commentText}
                setCommentText={setCommentText}
                commentName={commentName}
                setCommentName={setCommentName}
                commentPassword={commentPassword}
                setCommentPassword={setCommentPassword}
                commentList={commentList}
                commentBtn={commentBtn}
                date={date}
            />
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

// 모달창
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

// 댓글
function Comment({
    commentText,
    setCommentText,
    commentName,
    setCommentName,
    commentPassword,
    setCommentPassword,
    commentList,
    commentBtn,
    date,
}) {
    return (
        <div className="comment">
            <div>
                <div className="c_write">
                    <h3>
                        <span>{commentList.length}</span>개의 댓글
                    </h3>
                    <div className="write_box">
                        <div className="input_box">
                            <input
                                type="text"
                                placeholder="닉네임"
                                defaultValue={commentName}
                                onChange={(e) => {
                                    setCommentName(e.currentTarget.value);
                                }}
                            />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                defaultValue={commentPassword}
                                onChange={(e) => {
                                    setCommentPassword(e.currentTarget.value);
                                }}
                            />
                        </div>
                        <textarea
                            name=""
                            id=""
                            placeholder="댓글을 작성하세요"
                            defaultValue={commentText}
                            onChange={(e) => {
                                setCommentText(e.currentTarget.value);
                            }}
                        ></textarea>
                    </div>

                    <div className="btn_box">
                        <button type="button" className="btn2" onClick={commentBtn}>
                            댓글 작성
                        </button>
                    </div>
                </div>
                {commentList.map((a, i) => {
                    return (
                        <div className="c_detail" key={i}>
                            <div className="top">
                                <div className="t_left">
                                    <h4>{a.name}</h4>
                                    <h5>{formatDate(a.date)}</h5>
                                </div>
                                <div className="t_right">
                                    <button type="button">수정</button>
                                    <button type="button">삭제</button>
                                </div>
                            </div>
                            <div className="bottom">
                                <p>{a.content}</p>
                            </div>
                            <button className="reply_btn">+ 답글달기</button>
                        </div>
                    );
                })}
            </div>
            {/* <Link href={'/'}>홈으로 돌아가기</Link> */}
        </div>
    );
}
