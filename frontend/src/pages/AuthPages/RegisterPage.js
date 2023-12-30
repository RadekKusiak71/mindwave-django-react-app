import React from 'react'
import Card from '../../layout/Card'
import classes from './AuthPages.module.css'
import RegisterForm from '../../components/AuthForm/RegisterForm'

const RegisterPage = () => {
  return (
    <Card>
        <div className={classes['auth-page-container']} > 
            <RegisterForm/>
        </div>
    </Card>
  )
}

export default RegisterPage