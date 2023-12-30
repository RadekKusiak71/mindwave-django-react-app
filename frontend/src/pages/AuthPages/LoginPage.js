import React from 'react'
import Card from '../../layout/Card'
import classes from './AuthPages.module.css'
import LoginForm from '../../components/AuthForm/LoginForm'

const LoginPage = () => {
  return (
    <Card>
        <div className={classes['auth-page-container']}>
            <LoginForm/>
        </div>
    </Card>
  )
}

export default LoginPage