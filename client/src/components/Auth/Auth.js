import { Button, Paper, Grid, Typography, Container, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signIn, signUp } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import loginArt from '../../assets/loginart.PNG'
import Input from './Input';
import './styles.css';

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
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);
    const { errorMessage } = useSelector((state) => state.userReducer);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    const switchMode = () => {
        setForm(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signUp(form, navigate));
        } else {
            dispatch(signIn(form, navigate));
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <Container component="main" maxWidth="md" style={{ marginTop: '5%', paddingTop:'7rem' }}>
            <Paper className="paper-container" elevation={6} style={{ borderRadius: '5px', backgroundColor: 'white' }}>
                <Grid container spacing={0} alignItems="center">

                    <Grid item xs={12} md={6} className="image-container">
                        <img src={loginArt} alt="Login Art" className="auth-art" />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper className="paper" elevation={0} style={{ padding: '20px', backgroundColor: 'transparent' }}>

                            <form className="form" onSubmit={handleSubmit}>
                                <div className="auth-header">
                                    <LockOutlinedIcon />
                                    <Typography
                                        className="typography"
                                        component="h1"
                                        variant="h5"
                                        style={{ margin: '16px 0 16px 0', color: 'black' }}
                                    >
                                        {isSignup ? 'Sign up' : 'Log in'}
                                    </Typography>
                                {errorMessage?.length && (
                                    <Alert severity="error" style={{ margin: '10px 0' }}>
                                        {errorMessage}
                                    </Alert>
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

                                <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                                    By signing up, you agree to our <strong>Terms of Service</strong> and{' '}
                                    <strong>Privacy Policy</strong>.
                                </Typography>

                                <Button
                                    type="submit"
                                    fullWidth
                                    className="submit"
                                    variant="contained"
                                    style={{ margin: '16px 0', backgroundColor: 'black' }}
                                >
                                    {isSignup ? 'Sign Up' : 'Log In'}
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
        </Container>
    );
};

export default SignUp;
