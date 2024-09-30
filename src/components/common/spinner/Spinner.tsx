import './Spinner.css'

export default function Spinner({ show }: { show: boolean }) {
    return (
        <div className='loader-wrapper' style={{ display: show ? '' : 'none' }}>
            <span className="loader"></span>
        </div>
    )
}