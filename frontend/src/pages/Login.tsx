import Header from '../components/Header'


type LoginProps = {
  sucursal: string
}


export default function Login({sucursal}:LoginProps) {
    return (          
        <>
            <Header sucursal={sucursal} />
            <main className="login">
                <div className="contenido-login">
                    <h2>Hola mundo</h2>
                    <hr/>
                    <p>susu</p>
                </div>
            </main>
        </>
    )
}
