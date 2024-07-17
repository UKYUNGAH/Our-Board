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
    const [editComment, setEditComment] = useState(null);
    const [deleteComment, setDeleteComment] = useState(null);

    // 댓글에 필요함
    const [commentText, setCommentText] = useState('');
    const [commentName, setCommentName] = useState('');
    const [commentPassword, setCommentPassword] = useState('');
    const [commentList, setCommentList] = useState([]);
    const date = new Date().toISOString();

    // 글 삭제
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

    // 모달창 열기
    const handleModalOpen = (type) => {
        setModalType(type);
    };
    // 모달창 닫기
    const handleModalClose = () => {
        setModalType('');
        setPassword('');
        setPasswordError(false);
        setEditComment(null);
        setDeleteComment(null);
        setCommentText('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setCommentPassword(e.target.value);
    };

    // 댓글 작성 버튼
    const commentBtn = async () => {
        if (commentText.trim() === '' || commentName.trim() === '' || commentPassword.trim() === '') {
            alert('빈칸을 모두 입력해주세요.');
        } else {
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
        }
    };

    // 댓글 불러오기
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
    }, [id]);

    // 댓글 수정
    const handleCommentEdit = (comment) => {
        setModalType('commentEdit');
        setEditComment(comment);
        setCommentText(comment.content);
    };

    const handleCommentDelete = (comment) => {
        setModalType('commentDelete');
        setDeleteComment(comment);
    };

    const commentEdit = async () => {
        try {
            const res = await fetch('/api/post/commentEdit', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editComment._id,
                    content: commentText,
                }),
            });
            if (res.ok) {
                setCommentList((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === editComment._id ? { ...comment, content: commentText } : comment
                    )
                );
                handleModalClose();
                console.log('댓글 수정 완료!');
            } else {
                console.log('수정 실패');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const commentDelete = async () => {
        try {
            const res = await fetch(`/api/post/commentDelete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: deleteComment._id,
                    password: password,
                }),
            });
            if (res.ok) {
                setCommentList((prevComments) => prevComments.filter((comment) => comment._id !== deleteComment._id));
                handleModalClose();
                console.log('댓글 삭제 완료!');
            } else {
                console.log('삭제 실패');
                setPasswordError(true);
            }
        } catch (error) {
            console.log(error);
            setPasswordError(true);
        }
    };

    // 패스워드 확인
    const passwordData = async () => {
        if (modalType === 'commentDelete' || modalType === 'commentEdit') {
            try {
                const res = await fetch('/api/post/commentPassword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: modalType === 'commentDelete' ? deleteComment._id : editComment._id,
                        password: password,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    setPasswordError(false); // 비밀번호가 맞으면 에러를 false로 설정
                    handleModalClose(); // 모달 닫기
                    if (modalType === 'commentEdit') {
                        commentEdit(); // 댓글 수정 함수 호출
                    } else if (modalType === 'commentDelete') {
                        commentDelete(); // 댓글 삭제 함수 호출
                    }
                } else {
                    setPasswordError(true); // 비밀번호가 틀리면 에러를 true로 설정
                }
            } catch (error) {
                console.log(error);
                setPasswordError(true);
            }
        } else {
            // 게시글 수정 또는 삭제
            try {
                const res = await fetch('/api/post/password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, password }),
                });
                const data = await res.json();
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
            <Comment
                commentText={commentText}
                setCommentText={setCommentText}
                commentName={commentName}
                setCommentName={setCommentName}
                commentPassword={commentPassword}
                setCommentPassword={setCommentPassword}
                commentList={commentList}
                commentBtn={commentBtn}
                handleCommentEdit={handleCommentEdit}
                handleCommentDelete={handleCommentDelete}
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
                    commentText={commentText}
                    setCommentText={setCommentText}
                    commentEdit={commentEdit}
                    commentDelete={commentDelete}
                />
            )}
        </div>
    );
}

// 모달창
function Modal({
    modalType,
    handleModalClose,
    password,
    handlePasswordChange,
    passwordData,
    passwordError,
    commentText,
    setCommentText,
    commentEdit,
    commentDelete,
}) {
    return (
        <div className="modal">
            <div className="m_wrap">
                <div className="m_box">
                    {(modalType === 'edit' ||
                        modalType === 'delete' ||
                        modalType === 'commentDelete' ||
                        modalType === 'commentEdit') && (
                        <>
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
                        </>
                    )}

                    {/* {modalType === 'commentEdit' && !passwordError && (
                        <div className="comment_edit">
                            <h1>댓글 수정</h1>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="댓글을 수정하세요"
                            />
                            <button type="submit" className="m_ok_btn" onClick={commentEdit}>
                                수정
                            </button>
                        </div>
                    )} */}

                    <button type="button" className="m_close_btn" onClick={handleModalClose}>
                        <img src="/close_i.png" alt="" />
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
    handleCommentEdit,
    handleCommentDelete,
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
                                maxLength={10}
                                value={commentName}
                                onChange={(e) => {
                                    setCommentName(e.currentTarget.value.replace(/\s/g, ''));
                                }}
                                required={true}
                            />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                maxLength={10}
                                value={commentPassword}
                                onChange={(e) => {
                                    setCommentPassword(e.currentTarget.value.replace(/\s/g, ''));
                                }}
                                required={true}
                            />
                        </div>
                        <textarea
                            name="commentTextarea"
                            id="commentTextarea"
                            placeholder="댓글을 작성하세요"
                            // value={commentText}
                            onChange={(e) => {
                                setCommentText(e.currentTarget.value);
                            }}
                            required={true}
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
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleCommentEdit(a);
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleCommentDelete(a);
                                        }}
                                    >
                                        삭제
                                    </button>
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
