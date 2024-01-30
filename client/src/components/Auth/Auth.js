import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { signin, signup } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Input from './Input';
import './styles.css';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const SignUp = () => {

    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = () => {
        setForm(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(form, navigate));

        } else {
            dispatch(signin(form, navigate));
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <Container component="main" maxWidth="xs">
            <Paper className='paper' elevation={6} style={{ borderRadius: '10px', backgroundColor:'#f3eff1' }}>
                <Avatar className='avatar'>
                    <LockRoundedIcon color="action" />
                </Avatar>
                <Typography className='typography' component="h1" variant="h5" style={{ margin: "0 0 16px 0", color: 'grey' }}>{isSignup ? 'Sign up' : 'Sign in'}</Typography>
                <form className='form' onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth className='submit' variant='contained' style={{ margin: "16px 0" }}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <Grid style={{ margin: '16px 0' }} container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default SignUp;