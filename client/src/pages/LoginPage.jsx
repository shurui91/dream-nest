import React, { useState } from 'react';
import '../styles/Login.scss';
import { setLogin } from '../redux/state';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    //console.log(formData);
    const [fieldErrors, setFieldErrors] = useState({}); // State to track field-specific errors
    const [generalError, setGeneralError] = useState(''); // State for general error message

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop submission if validation fails
        }
        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // get the data after fetching
            if (response.status === 200) {
                const loggedIn = await response.json();
                if (loggedIn) {
                    dispatch(
                        setLogin({
                            user: loggedIn.user,
                            token: loggedIn.token,
                        })
                    );
                    navigate('/');
                }
            } else {
                const { message } = await response.json();
                setGeneralError('Login failed. Please try again.');
            }
        } catch (err) {
            setGeneralError('An error occurred. Please try again.');
            console.log('Login Failed', err.message);
        }
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!formData.email) {
            validationErrors.email = 'Email is required';
        }

        if (!formData.password) {
            validationErrors.password = 'Password is required';
        }

        setFieldErrors(validationErrors); // Set field-specific errors
        return Object.keys(validationErrors).length === 0; // Return true if no errors
    };

    const handleClearForm = () => {
        setFormData({
            email: '',
            password: '',
        });
        setFieldErrors({}); // Clear field-specific errors
        setGeneralError(''); // Clear general error
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value, // correctly update form data by field name
        });
    };

    return (
        <div className='login'>
            <div className='login_content'>
                <form className='login_content_form' onSubmit={handleSubmit}>
                    <input
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {fieldErrors.email && (
                        <p style={{ color: 'red' }}>{fieldErrors.email}</p>
                    )}
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {fieldErrors.password && (
                        <p style={{ color: 'red' }}>{fieldErrors.password}</p>
                    )}
                    <button type='submit'>LOG IN</button>
                    <button type='button' onClick={handleClearForm}>
                        CLEAR FORM
                    </button>
                </form>
                {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
                <a href='/register'>Don't have an account? Sign up here.</a>
            </div>
        </div>
    );
};

export default LoginPage;
