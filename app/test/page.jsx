'use client';
import Link from 'next/link';

export default function Test() {
    return (
        <div className="test content">
            <div className="all_title">
                <h2>OUR TEST</h2>
                <p>다양한 테스트를 즐겨보세요!</p>
            </div>
            <div className="test_wrap">
                <ul>
                    <li>
                        <Link href={'https://mbti-test-orpin.vercel.app/'} legacyBehavior>
                            <a target="_blank" rel="noopener noreferrer">
                                <div className="li_top">
                                    <img src="/test1.png" alt="" />
                                </div>
                                <div className="text">
                                    나와 비슷한 짱구
                                    <br /> 등장인물 찾기
                                </div>
                            </a>
                        </Link>
                    </li>
                    <li className="no_test">
                        <div className="li_top">
                            <div className="box">
                                <img src="/soon.png" alt="" />
                                <p>comming soon</p>
                            </div>
                        </div>
                        <div className="text">테스트를 준비중 입니다.</div>
                    </li>
                    <li className="no_test">
                        <div className="li_top">
                            <div className="box">
                                <img src="/soon.png" alt="" />
                                <p>comming soon</p>
                            </div>
                        </div>
                        <div className="text">테스트를 준비중 입니다.</div>
                    </li>
                    <li className="no_test">
                        <div className="li_top">
                            <div className="box">
                                <img src="/soon.png" alt="" />
                                <p>comming soon</p>
                            </div>
                        </div>
                        <div className="text">테스트를 준비중 입니다.</div>
                    </li>
                    <li className="no_test">
                        <div className="li_top">
                            <div className="box">
                                <img src="/soon.png" alt="" />
                                <p>comming soon</p>
                            </div>
                        </div>
                        <div className="text">테스트를 준비중 입니다.</div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
