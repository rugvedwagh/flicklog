import { Button, Paper, Grid, Typography, Container, Alert, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, registerUser } from '../../redux/actions/auth.actions';
import { useTheme } from '../../context/themeContext';
import React, { useState, useEffect } from 'react';
import loginArt from '../../assets/loginart.PNG'
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import './auth.styles.css';

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const SignUp = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const darkMode = useTheme();

    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { errorMessage, isLoading } = useSelector((state) => state.authReducer);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const switchMode = () => {
        setForm(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        isSignup ? dispatch(registerUser(form, navigate)) : dispatch(logIn(form, navigate));
    };

    const isRelevantAuthError = errorMessage?.length && !errorMessage.includes("Refresh");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <Container component="main" maxWidth="md" style={{ marginTop: '5%', paddingTop: '7rem' }}>
            <Paper className={`paper-container ${darkMode ? 'dark' : ''}`} elevation={6}>
                <Grid container spacing={0} alignItems="center">

                    <Grid item xs={12} md={6} className="image-container">
                        <img src={loginArt} alt="Login Art" className="auth-art" />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper className={`paper ${darkMode ? 'dark' : ''}`} elevation={0} >

                            <form className={`form-auth ${darkMode ? 'dark' : ''}`} onSubmit={handleSubmit}>
                                <div className="auth-header">

                                    <LockOutlinedIcon />

                                    <Typography
                                        className={`typography ${darkMode ? 'dark' : ''}`}
                                        component="h1"
                                        variant="h5"
                                    >
                                        {isSignup ? 'Sign up' : 'Log in'}
                                    </Typography>

                                    {isRelevantAuthError ? (
                                        <Alert severity="error" sx={{ margin: '10px 0' }}>
                                            {errorMessage}
                                        </Alert>
                                    ) : (
                                        null
                                    )}
                                </div>

                                <Grid container spacing={2}>
                                    {isSignup && (
                                        <>
                                            <Input
                                                name="firstName"
                                                label="First Name"
                                                handleChange={handleChange}
                                                autoFocus
                                                half
                                            />
                                            <Input
                                                name="lastName"
                                                label="Last Name"
                                                handleChange={handleChange}
                                                half
                                            />
                                        </>
                                    )}
                                    <Input
                                        name="email"
                                        label="Email Address"
                                        handleChange={handleChange}
                                        type="email"
                                    />
                                    <Input
                                        name="password"
                                        label="Password"
                                        handleChange={handleChange}
                                        type={showPassword ? 'text' : 'password'}
                                        handleShowPassword={handleShowPassword}
                                    />
                                    {isSignup && (
                                        <Input
                                            name="confirmPassword"
                                            label="Repeat Password"
                                            handleChange={handleChange}
                                            type="password"
                                        />
                                    )}
                                </Grid>

                                <Typography variant="body2" className={`subtxt ${darkMode ? 'dark' : ''}`} style={{ marginTop: '8px' }}>
                                    By logIng up, you agree to our <strong>Terms of Service</strong> and{' '}
                                    <strong>Privacy Policy</strong>.
                                </Typography>

                                <Button
                                    type="submit"
                                    fullWidth
                                    className={`submit ${darkMode ? 'dark' : ''}`}
                                    variant="contained"
                                >
                                    {isSignup ? 'Sign Up' : 'Log In'}&nbsp;&nbsp; {isLoading && <CircularProgress size="1.6rem" />}
                                </Button>

                                <Grid style={{ margin: '16px 0' }} container justify="flex-end">
                                    <Grid item>
                                        <div
                                            onClick={switchMode}
                                            style={{ color: '#2f8ddf', cursor: 'pointer' }}
                                        >
                                            {isSignup
                                                ? 'Already have an account? Log in'
                                                : "Don't have an account? Sign Up"}
                                        </div>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Container >
    );
};

export default SignUp;