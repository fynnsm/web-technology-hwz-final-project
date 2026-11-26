import { Link } from 'react-router'
import { Header } from './Header.tsx'

export function NotFound() {
    return (
        <>
            <Header />
            <main className="container">
                <h1>Seite nicht gefunden</h1>
                <Link to="/">Zurück zur Startseite</Link>
            </main>
        </>
    )
}