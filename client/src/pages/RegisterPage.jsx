import React, { useEffect, useState } from 'react';
import '../styles/Register.scss';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: null,
    });
    //console.log(formData);

    const [error, setError] = useState('');
    const [fileError, setFileError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // check profile image file format
        if (name === 'profileImage' && files.length > 0) {
            const file = files[0];
            const validFileTypes = ['image/jpeg', 'image/png'];

            // Check file type
            if (!validFileTypes.includes(file.type)) {
                setFileError('Only JPG and PNG files are allowed');
                setFormData({ ...formData, profileImage: null });
                return;
            } else {
                setFileError(''); // Clear error if valid
                setFormData({ ...formData, profileImage: file });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!formData.firstName.trim()) {
            validationErrors.firstName = 'First Name is required';
        }

        if (!formData.lastName.trim()) {
            validationErrors.lastName = 'Last Name is required';
        }

        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = 'Invalid email format';
        }

        if (!formData.password.trim()) {
            validationErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            validationErrors.password =
                'Password should be at least 6 characters';
        }

        if (formData.confirmPassword !== formData.password) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }

        setError(validationErrors);

        return Object.keys(validationErrors).length === 0; // Return true if no errors
    };

    // const [passwordMatch, setPasswordMatch] = useState(true);

    // // useEffect的条件是password和confirmPassword的值发生变化
    // useEffect(() => {
    //     setPasswordMatch(
    //         formData.password === formData.confirmPassword ||
    //             formData.confirmPassword === ''
    //     );
    // }, [formData.password, formData.confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        try {
            const register_form = new FormData();
            for (var key in formData) {
                register_form.append(key, formData[key]);
            }

            const response = await fetch(
                'http://localhost:3001/auth/register',
                {
                    method: 'POST',
                    body: register_form,
                }
            );
            if (response.ok) {
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error('Registration Failed', errorData.message);
            }
        } catch (err) {
            console.error('Error during registration:', err.message);
        }
    };

    const handleClearForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            profileImage: null,
        });
        setError('');
    };

    return (
        <div className='register'>
            <div className='register_content'>
                <form className='register_content_form' onSubmit={handleSubmit}>
                    <input
                        placeholder='First Name'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {error.firstName && (
                        <span className='error'>{error.firstName}</span>
                    )}
                    <input
                        placeholder='Last Name'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {error.lastName && (
                        <span className='error'>{error.lastName}</span>
                    )}
                    <input
                        placeholder='Email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {error.email && (
                        <span className='error'>{error.email}</span>
                    )}
                    <input
                        placeholder='Password'
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {error.password && (
                        <span className='error'>{error.password}</span>
                    )}
                    <input
                        placeholder='Confirm Password'
                        name='confirmPassword'
                        type='password'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {error.confirmPassword && (
                        <span className='error'>{error.confirmPassword}</span>
                    )}
                    <input
                        id='image'
                        type='file'
                        name='profileImage'
                        style={{ display: "none" }}
                        onChange={handleChange}
                    />
                    <label htmlFor='image'>
                        <img src='/assets/addImage.png' alt='Add Profile' />
                        <p>Upload Your Photo</p>
                    </label>
                    {fileError && <p className='error'>{fileError}</p>}{' '}
                    {/* Display file type error */}
                    {formData.profileImage && (
                        <img
                            src={URL.createObjectURL(formData.profileImage)}
                            alt='profile'
                            style={{ maxWidth: '80px' }}
                        />
                    )}
                    <button type='submit'>REGISTER</button>
                    <button type='button' onClick={handleClearForm}>
                        CLEAR FORM
                    </button>
                </form>
                <a href='/login'>Already have an account? Log In Here</a>
            </div>
        </div>
    );
};

export default RegisterPage;
