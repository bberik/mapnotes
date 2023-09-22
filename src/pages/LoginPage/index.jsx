import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css'
import LockIcon from '../../assets/images/lock.png'
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from '../../app/auth/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../app/auth/authSlice';
import BackgroundImage from '../../assets/images/bg.jpg'
import { resetWorkspace } from '../../app/workspace/workspaceSlice';

// Creating schema
const schema = Yup.object().shape({
    email: Yup.string()
        .required("Email is a required field")
        .email("Invalid email format"),
    password: Yup.string()
        .required("Password is a required field")
        .min(8, "Password must be at least 8 characters")
});

function Copyright(props) {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="/">
                    RestFlow
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </ThemeProvider>
    );
}

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: "#000",
        },
        secondary: {
            main: "#222",
        },
    },
    typography: {
        fontFamily: [
            'Roboto Mono',
            'monospace',
        ].join(','),
    },
});

export default function LoginPage() {
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState(null);

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    const handleLogin = async (values) => {

        const email = values.email
        const password = values.password
        try {
            const userData = await login({ email, password }).unwrap();
            dispatch(setCredentials({ user: userData.user, access: userData.access, refresh: userData.refresh }));
            dispatch(resetWorkspace())
            navigate("/");
        } catch (err) {
            if (!err?.status) {
                // isLoading: true until timeout occurs
                setErrMsg("No Server Response");
            } else if (err.status === 400) {
                setErrMsg("Email or Password is wrong");
            } else {
                setErrMsg("Login Failed");
            }
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <img className='bg-image' src={BackgroundImage} alt="bg" />
                <CssBaseline />
                <div className='login-container'>
                    <img src={LockIcon} />
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    {errMsg && <div className='login-error'>{errMsg}</div>}
                    <Formik
                        validationSchema={schema}
                        initialValues={{ email: "", password: "" }}
                        onSubmit={(values) => {
                            handleLogin(values)
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit
                        }) => (
                            <div className="login">
                                <div className="form">
                                    {/* Passing handleSubmit parameter tohtml form onSubmit property */}
                                    <form noValidate onSubmit={handleSubmit}>
                                        {/* Our input html with passing formik parameters like handleChange, values, handleBlur to input properties */}
                                        <input
                                            type="email"
                                            name="email"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            placeholder="Enter email"
                                            className="form-control inp_text"
                                            id="email"
                                        />
                                        {/* If validation is not passed show errors */}
                                        <p className="error">
                                            {errors.email && touched.email && errors.email}
                                        </p>
                                        {/* Our input html with passing formik parameters like handleChange, values, handleBlur to input properties */}
                                        <input
                                            type="password"
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            placeholder="Enter password"
                                            className="form-control"
                                        />
                                        {/* If validation is not passed show errors */}
                                        <p className="error">
                                            {errors.password && touched.password && errors.password}
                                        </p>
                                        {/* Click on submit button to submit the form */}
                                        <button type="submit" className='login-submit-button'>Login</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Formik>
                    <div className='login-links'>
                        <Link href="#" variant="body">
                            Forgot password?
                        </Link>
                        <Link href="#" className='signup-link' variant="body">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </div>
                </div>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}