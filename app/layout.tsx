import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '데이터 탐정단 | 리뷰 사건 파일', description: '가짜 리뷰를 조사하고 추천 순위의 변화를 실험하는 초등 데이터 수업' };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) { return <html lang="ko"><body>{children}</body></html>; }
