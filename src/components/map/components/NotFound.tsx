import CloseButton from "@/components/common/panel/CloseButton"
import logo from '@/assets/images/logo.svg'
import Image from "next/image"

export default function NotFound({ path, close }: { path: string[], close: () => void }) {
    const type = path[1]
    const callsign = path[2]

    const renderInfo = () => {
        if (type === 'flight') {
            return (
                <div className="notfound-info">The flight with callsign <span>{callsign}</span> is currently not tracked by simradar21. It is either the wrong callsign or has already landed.</div>
            )
        }

        if (type === 'airport') {
            return (
                <div className="notfound-info">An airport with the ICAO designator <span>{callsign}</span> could not be found. It is either misspelled or does not exist.</div>
            )
        }
    }

    return (
        <div className="notfound">
            <div className="notfound-container">
                <CloseButton onButtonClick={close} />
                <Image src={logo} alt='Simradar21 logo' height={20} />
                <div className="notfound-title">{type === 'flight' ? 'Live flight not found' : 'Invalid airport code'}</div>
                <div className="notfound-info">{renderInfo()}</div>
            </div>
        </div>
    )
}