import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function InputForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        fathername: '',
        cnic: '',
        dob: '',
        address: '',
        photo: null,
        gender: '',
        religion: '',
        bloodGroup: '',
        profession: '',
        birthMark: '',
        maritalStatus: '',
        signature: null
    });

    useEffect(() => {
        if (id) {
            fetchCard();
        }
    }, [id]);

    // Replace axios calls with api
    const fetchCard = async () => {
        try {
            const response = await api.get(`/cards/${id}`);
            const card = response.data;
            setFormData({
                name: card.name || '',
                fathername: card.fathername || '',
                cnic: card.cnic || '',
                dob: card.dob ? card.dob.split('T')[0] : '',
                address: card.address || '',
                photo: card.photo || null,
                gender: card.gender || '',
                religion: card.religion || '',
                bloodGroup: card.bloodGroup || '',
                profession: card.profession || '',
                birthMark: card.birthMark || '',
                maritalStatus: card.maritalStatus || '',
                signature: card.signature || null
            });

        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 429) {
                alert('Too many requests. Please wait a moment and try again.');
            }
            navigate('/');
        }
    };

    const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes

    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > 600) {
                        height = Math.floor(height * (600 / width));
                        width = 600;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 string directly
                    const base64String = canvas.toDataURL('image/jpeg', 0.6);
                    resolve(base64String);
                };
            };
        });
    };

    const validateFileSize = (file, fieldName) => {
        if (file && file.size > MAX_FILE_SIZE) {
            throw new Error(`${fieldName} size must be less than 500KB`);
        }
    };

    // Add file size validation to file input handlers
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            validateFileSize(file, 'Photo');
            const base64Image = await compressImage(file);
            setFormData({ ...formData, photo: base64Image });
        } catch (error) {
            e.target.value = '';
            alert(error.message);
        }
    };

    const handleSignatureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            validateFileSize(file, 'Signature');
            const base64Image = await compressImage(file);
            setFormData({ ...formData, signature: base64Image });
        } catch (error) {
            e.target.value = '';
            alert(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dob') {
            const selectedDate = new Date(value);
            const today = new Date();
            const minDate = new Date();
            minDate.setFullYear(today.getFullYear() - 18);

            if (selectedDate > today) {
                alert('Date of birth cannot be in the future');
                return;
            }
            if (selectedDate > minDate) {
                alert('You must be at least 18 years old');
                return;
            }
        }

        if (name === 'cnic') {
            // Remove any non-digit characters
            const numericValue = value.replace(/\D/g, '');
            // Limit to 13 digits
            if (numericValue.length <= 13) {
                // Format as XXXXX-XXXXXXX-X
                const formattedCNIC = numericValue.replace(
                    /^(\d{5})(\d{7})(\d{1})?$/,
                    (_, p1, p2, p3) => {
                        if (p3) return `${p1}-${p2}-${p3}`;
                        if (p2) return `${p1}-${p2}`;
                        return p1;
                    }
                );
                setFormData({ ...formData, [name]: formattedCNIC });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate required fields first
            if (!formData.name || !formData.fathername || !formData.cnic || !formData.dob ||
                !formData.address || !formData.gender || !formData.religion || !formData.maritalStatus) {
                throw new Error('Please fill in all required fields');
            }

            // Validate CNIC format
            const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
            if (!cnicRegex.test(formData.cnic)) {
                throw new Error('Invalid CNIC format. Please use: XXXXX-XXXXXXX-X');
            }

            // Create FormData object
            const submitData = new FormData();

            // Validate photo for new cards
            if (!id && !formData.photo) {
                throw new Error('Photo is required for new cards');
            }

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    if (key === 'photo' || key === 'signature') {
                        if (formData[key] && formData[key].startsWith('data:image')) {
                            submitData.append(key, formData[key]);
                        }
                    } else {
                        submitData.append(key, formData[key]);
                    }
                }
            });

            let response;
            if (id) {
                response = await api.put(`/cards/${id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await api.post('/cards', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data) {
                alert(id ? 'Card updated successfully!' : 'Card created successfully!');
                navigate('/');
            }
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
            alert(errorMessage);
        }
    };

    return (
        <div className="container mt-4">
            {/* <h2>{id ? 'Edit Card' : 'Add New Card'}</h2> */}
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header text-white py-3"
                            style={{
                                background: 'linear-gradient(135deg, #006A4E, #00bf8f)',
                                borderRadius: '15px 15px 0 0'
                            }}>
                            <h4 className="text-center mb-0">
                                <i className="fas fa-id-card me-2"></i>
                                {id ? 'Update Identity Card' : 'Create New Identity Card'}
                            </h4>
                        </div>
                        <div className="card-body p-4" style={{
                            background: 'linear-gradient(to right bottom, #ffffff, #f8faf9)'
                        }}>
                            <form onSubmit={handleSubmit} className="row g-4">
                                {/* Form inputs */}
                                <style>{`
                                    .form-control, .form-select {
                                        border: 1px solid rgba(0, 106, 78, 0.2);
                                        transition: all 0.3s ease;
                                    }
                                    .form-control:focus, .form-select:focus {
                                        border-color: rgb(78, 194, 163);
                                        box-shadow: 0 0 0 0.2rem rgba(68, 170, 143, 0.25);
                                    }
                                    .form-floating label {
                                        color: #006A4E;
                                    }
                                     .form-floating > .form-control:focus ~ label,
                                    .form-floating > .form-control:not(:placeholder-shown) ~ label,
                                    .form-floating > .form-select ~ label {
                                        color: #6c757d;
                                        opacity: 0.8;
                                    }
                                    .form-floating input::placeholder,
                                    .form-floating textarea::placeholder {
                                        color: transparent;
                                    }
                                    .text-muted {
                                        color: #6c757d !important;
                                    }
                                    
                                `}</style>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter name"
                                            required
                                        />
                                        <label htmlFor="name">
                                            <i className="fas fa-user me-2 text-muted"></i>
                                            Full Name
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            id="fathername"
                                            name="fathername"
                                            value={formData.fathername}
                                            onChange={handleChange}
                                            placeholder="Enter father's name"
                                            required
                                        />
                                        <label htmlFor="fathername">
                                            <i className="fas fa-user-tie me-2 text-muted"></i>
                                            Father's Name
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            id="cnic"
                                            name="cnic"
                                            value={formData.cnic}
                                            onChange={handleChange}
                                            placeholder="Enter CNIC"
                                            maxLength="15"
                                            required
                                        />
                                        <label htmlFor="cnic">
                                            <i className="fas fa-fingerprint me-2 text-muted"></i>
                                            CNIC Number
                                        </label>
                                    </div>
                                    <small className="text-muted ms-2">Format: XXXXX-XXXXXXX-X</small>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control shadow-sm"
                                            id="dob"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                            required
                                        />
                                        <label htmlFor="dob">
                                            <i className="fas fa-calendar-alt me-2 text-muted"></i>
                                            Date of Birth
                                        </label>
                                    </div>
                                    <small className="text-muted ms-2">Must be 18+ years old</small>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <select
                                            className="form-select shadow-sm"
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <label htmlFor="gender">
                                            <i className="fas fa-venus-mars me-2 text-muted"></i>
                                            Gender
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control shadow-sm text-muted"
                                            id="religion"
                                            name="religion"
                                            value={formData.religion}
                                            onChange={handleChange}
                                            placeholder="Enter religion"
                                            required
                                        />
                                        <label htmlFor="religion">
                                            <i className="fas fa-pray me-2 text-muted"></i>
                                            Religion
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <select
                                            className="form-select shadow-sm"
                                            id="bloodGroup"
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Blood Group</option>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                                <option key={group} value={group}>{group}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="bloodGroup">
                                            <i className="fas fa-tint me-2 text-muted"></i>
                                            Blood Group
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            id="profession"
                                            name="profession"
                                            value={formData.profession}
                                            onChange={handleChange}
                                            placeholder="Enter profession"
                                        />
                                        <label htmlFor="profession">
                                            <i className="fas fa-briefcase me-2 text-muted"></i>
                                            Profession
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control shadow-sm"
                                            id="birthMark"
                                            name="birthMark"
                                            value={formData.birthMark}
                                            onChange={handleChange}
                                            placeholder="Enter birth mark"
                                        />
                                        <label htmlFor="birthMark">
                                            <i className="fas fa-fingerprint me-2 text-muted"></i>
                                            Birth Mark
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <select
                                            className="form-select shadow-sm"
                                            id="maritalStatus"
                                            name="maritalStatus"
                                            value={formData.maritalStatus}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="widowed">Widowed</option>
                                        </select>
                                        <label htmlFor="maritalStatus">
                                            <i className="fas fa-ring me-2 text-muted"></i>
                                            Marital Status
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="card shadow-sm">
                                        <div className="card-body py-2">
                                            <label htmlFor="signature" className="form-label mb-2">
                                                <i className="fas fa-signature me-2"></i>
                                                Upload Signature
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control form-control-sm"
                                                id="signature"
                                                name="signature"
                                                onChange={handleSignatureChange}
                                                accept="image/*"
                                            />
                                            <small className="text-muted d-block mt-1">
                                                Supported: JPG, PNG (Max: 2MB)
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating">
                                        <textarea
                                            className="form-control shadow-sm"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            style={{ height: '80px' }}
                                            placeholder="Enter address"
                                            required
                                        ></textarea>
                                        <label htmlFor="address">
                                            <i className="fas fa-home me-2 text-muted"></i>
                                            Address
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="card shadow-sm">
                                        <div className="card-body py-2">
                                            <label htmlFor="photo" className="form-label mb-2">
                                                <i className="fas fa-camera me-2"></i>
                                                Upload Photo
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control form-control-sm"
                                                id="photo"
                                                name="photo"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                required={!id}
                                            />
                                            <small className="text-muted d-block mt-1">
                                                Supported: JPG, PNG (Max: 2MB)
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 text-center mt-3">
                                    <button 
                                        type="submit" 
                                        className="btn px-4 py-2"
                                        style={{
                                            background: 'linear-gradient(135deg, #006A4E, #00bf8f)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(0, 106, 78, 0.2)',
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 106, 78, 0.3)';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 106, 78, 0.2)';
                                        }}
                                    >
                                        <i className="fas fa-save me-2"></i>
                                        {id ? 'Update Card' : 'Create Card'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InputForm;
