import './Spinner.css'

export default function Spinner({ show }: { show: boolean }) {
    return <span className="loader" style={{ display: show ? '' : 'none' }}></span>
}