'use client';
import Link from 'next/link';
import React, { useState } from 'react';

const Header = () => {
    const [active, setActive] = useState('POST');
    const [mobileView, setMobileView] = useState(false);

    const toggleMobileMenu = () => {
        setMobileView(!mobileView);
    };

    return (
        <header className="header">
            <div className="desktop">
                <h1 className="logo">
                    <Link href={'/'}>Our Life</Link>
                </h1>

                <h2 className="sub_name">DASHBOARD</h2>
                <nav>
                    <h3>
                        <Link
                            href={'/'}
                            className={active === 'POST' ? 'active' : ''}
                            onClick={() => {
                                setActive('POST');
                            }}
                        >
                            POST
                        </Link>
                        <Link
                            href={'/test'}
                            className={active === 'TEST' ? 'active' : ''}
                            onClick={() => {
                                setActive('TEST');
                            }}
                        >
                            TEST
                        </Link>
                    </h3>
                </nav>
            </div>
            <div className="mobile">
                <button
                    className="ham_btn"
                    onClick={() => {
                        toggleMobileMenu();
                    }}
                >
                    <img src="/ham.png" alt="" />
                </button>
                {/* 햄버거 버튼 클릭시 뜨는거 */}
                {mobileView && (
                    <div className="mobile_nav">
                        <h1>Our Life</h1>
                        <button
                            className="close_btn"
                            onClick={() => {
                                toggleMobileMenu();
                            }}
                        >
                            <img src="/close_i.png" alt="닫기" />
                        </button>
                        <nav className="">
                            <h3>
                                <Link
                                    href={'/'}
                                    className="text"
                                    onClick={() => {
                                        toggleMobileMenu();
                                    }}
                                >
                                    POST
                                </Link>
                                <Link
                                    className="text"
                                    href={'/test'}
                                    onClick={() => {
                                        toggleMobileMenu();
                                    }}
                                >
                                    TEST
                                </Link>
                            </h3>
                            <Link className="my_profile" href={'https://my.surfit.io/w/989694903'}>
                                🔗 개발자의 서핏 이력서 보러가기
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
