'use client';
import Link from 'next/link';
import React, { useState } from 'react';

const Header = () => {
    const [active, setActive] = useState('POST');

    return (
        <header className="header">
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
        </header>
    );
};

export default Header;
