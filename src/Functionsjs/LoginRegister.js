import React from 'react';
import './LoginRegister.css';

function LoginRegister() {
    return (
        <div classname="content justify-content-center align-items-center d-flex shadow-lg" id="content">
            {/*---------Formulario de Registro---------*/}
            <div className="col-md-6 d-flex justify-content-center">
                <form>
                    <div className="header-text mb-4">
                        <h1> Crear Cuenta</h1>
                    </div>
                    <div className="form-group mb-3">
                        <input type="text" placeholder="Nombre" className="form-control for-control-lg bg-lignt fs-6"></input>
                    </div>
                    <div className="form-group mb-3">
                        <input type="email" placeholder="Correo Electrónico" className="form-control for-control-lg bg-lignt fs-6"></input>
                    </div>
                    <div className="form-group mb-3">
                        <input type="password" placeholder="Contraseña" className="form-control for-control-lg bg-lignt fs-6"></input>
                    </div>
                    <div className="input-group mb-3 justify-content-center">
                        <button className="btn border-white text-white w-50 fs-6">Registrarse</button>
                    </div>
                </form>
            </div>

            {/*---------Formulario de Inicio de Sesión---------*/}
            <div className="col-md-6 right-box">
                <form>
                    <div className="header-text mb-4">
                        <h1> Iniciar Sesión</h1>
                    </div>
                    <div className="form-group mb-3">
                        <input type="email" placeholder="Correo Electrónico" className="form-control for-control-lg bg-lignt fs-6"></input>
                    </div>
                    <div className="form-group mb-3">
                        <input type="password" placeholder="Contraseña" className="form-control for-control-lg bg-lignt fs-6"></input>
                    </div>
                    <div className="input-group mb-3 justify-content-between">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input"></input>
                            <label htmlFor="formcheck" className="form-check-label text-secondary"><small>Recuerdame</small></label>
                        </div>
                        <div className="forgot">
                            <small><a href="#">¿Olvidaste tu contraseña?</a></small>
                        </div>
                        <button className="btn border-white text-white w-50 fs-6">Iniciar Sesión</button>
                    </div>
                </form>
            </div>

            {/*-----------------Panel de Swatch-----------------*/}
            <div className="switch-content">
                <div className="switch">
                    <div className="switch-panel switch-left"></div>
                    <h1>Hello, Again</h1>
                    <p>We are happy to see you back</p>
                    <button className="hidden btn text-white w-50 fs-6">Iniciar Sesión</button>
                </div>
                <div className="switch-panel switch-right">
                    <h1>Welcome</h1>
                    <p>Join Our Unique Platform, Explore a New Experience</p>
                    <button className="hidden btn border-white text-white w-50 fs-6">Registrarse</button>
                </div>
            </div>
        </div>
    );
}

export default LoginRegister;
