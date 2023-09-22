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
import UserIcon from '../../assets/images/user.png'
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useSignupMutation } from '../../app/auth/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../app/auth/authSlice';
import BackgroundImage from '../../assets/images/bg.jpg'
import { resetWorkspace } from '../../app/workspace/workspaceSlice';


// Creating schema
const schema = Yup.object().shape({
    username: Yup.string()
        .required("Username is a required field"),
    email: Yup.string()
        .required("Email is a required field")
        .email("Invalid email format"),
    password1: Yup.string()
        .required("Password is a required field")
        .min(8, "Password must be at least 8 characters"),
    password2: Yup
        .string()
        .oneOf([Yup.ref("password1")], "Mismatched passwords")
        .required("Please confirm your password")

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

export default function SignUpPage() {
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState(null);

    const [signup, { isLoading }] = useSignupMutation();
    const [login, { isLoginLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    const handleSignup = async (values) => {
        const username = values.username
        const email = values.email
        const password1 = values.password1
        const password2 = values.password2
        try {
            let userData = await signup({ username, email, password1, password2 }).unwrap();
            userData = await login({ email, password: password1 }).unwrap();
            dispatch(setCredentials({ user: userData.user }));
            dispatch(resetWorkspace())
            navigate("/");
        } catch (err) {
            if (!err?.status) {
                setErrMsg("No Server Response");
            } else if (err.status === 400) {
                setErrMsg("Email or Password is wrong");
            } else {
                setErrMsg("Sign Up Failed");
            }
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <img className='bg-image' src={BackgroundImage} alt="bg" />
                <CssBaseline />
                <div className='signup-container'>
                    <img src={UserIcon} />
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    {errMsg && <div className='signup-error'>{errMsg}</div>}
                    <Formik
                        validationSchema={schema}
                        initialValues={{ username: "", email: "", password1: "", password2: "" }}
                        onSubmit={(values) => {
                            handleSignup(values)
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
                            <div className="signup">
                                <div className="form">
                                    <form noValidate onSubmit={handleSubmit}>
                                        <input
                                            type="username"
                                            name="username"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            placeholder="Enter username"
                                            className="form-control inp_text"
                                            id="username"
                                        />
                                        <p className="error">
                                            {errors.username && touched.username && errors.username}
                                        </p>
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
                                        <p className="error">
                                            {errors.email && touched.email && errors.email}
                                        </p>
                                        <input
                                            type="password"
                                            name="password1"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password1}
                                            placeholder="Enter password"
                                            className="form-control"
                                        />
                                        <p className="error">
                                            {errors.password1 && touched.password1 && errors.password1}
                                        </p>
                                        <input
                                            type="password"
                                            name="password2"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password2}
                                            placeholder="Confirm password"
                                            className="form-control"
                                        />
                                        <p className="error">
                                            {errors.password2 && touched.password2 && errors.password2}
                                        </p>
                                        <button type="submit" className='signup-submit-button'>Sign Up</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Formik>
                    <div>
                        <Link href="/login" variant="body">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}