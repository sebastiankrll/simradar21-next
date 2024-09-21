import Image from 'next/image'
import logo from '@/assets/images/logo.svg'

import './Header.css'
import dynamic from 'next/dynamic'
import Search from './components/Search'

const Clock = dynamic(() => import('./components/Clock'), {
    ssr: false
})

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