import Image from 'next/image'
import logo from '@/assets/images/logo.svg'

import './Header.css'
import Search from './components/Search'
import Clock from './components/Clock'

export default function Header() {
    return (
        <header>
            <figure className="logo">
                <Image src={logo} alt='Simradar21 logo' priority={true} />
            </figure>

            <div className="header-item">
                <div className="header-time">
                    <Clock />
                </div>
            </div>
            <div className="header-item">
                <Search />
            </div>
        </header>
    )
}