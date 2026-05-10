import React, { useState } from 'react'
import zxcvbn from 'zxcvbn'
import imgRegister from '../assets/images/mascotaRegister.webp'
import { RegisterForm } from '../components/RegisterForm'
import { LoginForm } from '../components/LoginForm'
import '../style/LoginRegister.css'

export const LoginRegister = () => {

	const [currentForm, setCurrentForm] = useState('login');

	// Función para cambiar de formulario
	const toggleForm = (formName) => {
		setCurrentForm(formName);
	}

	return (
		<>
			{/* Si el estado es 'login', mostramos LoginForm. Si no, RegisterForm */}
			{currentForm === 'login' ? (
				<LoginForm onSwitchForm={() => toggleForm('register')} />
			) : (
				<RegisterForm onSwitchForm={() => toggleForm('login')} />
			)}

		</>
	)
}
