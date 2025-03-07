'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageWrapper from '../components/PageWrapper';
import Logo from '../components/Logo';

export default function CreateAccount() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    jobRole: '',
    email: '',
    contactNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    accountType: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    jobRole: '',
    email: '',
    contactNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    accountType: '',
  });

  const validateForm = () => {
    const errors = {
      fullName: '',
      jobRole: '',
      email: '',
      contactNumber: '',
      username: '',
      password: '',
      confirmPassword: '',
      accountType: '',
    };
    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.jobRole.trim()) {
      errors.jobRole = 'Job role is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required';
      isValid = false;
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: '',
    }));
    setError('');
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    const { confirmPassword, ...registrationData } = formData;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create account');
      }

      router.push('/login?success=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#328f90] to-[#000001] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#328f90] to-[#000001] p-8 text-center text-white">
            <Logo size="lg" className="mb-6" />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">
                Create Account
              </h2>
              <p className="mt-1 text-sm text-[#328f90]/80">
                Set up your account in three simple steps
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#328f90] focus:border-transparent transition-colors duration-200`}
                      placeholder="Enter your full name"
                    />
                    {validationErrors.fullName && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#328f90] focus:border-transparent transition-colors duration-200`}
                      placeholder="Enter your email"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        validationErrors.username ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#328f90] focus:border-transparent transition-colors duration-200`}
                      placeholder="Choose a username"
                    />
                    {validationErrors.username && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        validationErrors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#328f90] focus:border-transparent transition-colors duration-200`}
                      placeholder="Create a password"
                    />
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      id="accountType"
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleSelectChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#328f90] focus:border-transparent transition-colors duration-200"
                    >
                      <option value="user">User</option>
                      <option value="admin">Administrator</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Role
                    </label>
                    <input
                      id="jobRole"
                      name="jobRole"
                      type="text"
                      required
                      value={formData.jobRole}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        validationErrors.jobRole ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#328f90] focus:border-transparent transition-colors duration-200`}
                      placeholder="Enter your job role"
                    />
                    {validationErrors.jobRole && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.jobRole}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        validationErrors.contactNumber ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#328f90] focus:border-transparent transition-colors duration-200`}
                      placeholder="Enter your contact number"
                    />
                    {validationErrors.contactNumber && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.contactNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#328f90] focus:border-transparent transition-colors duration-200`}
                      placeholder="Confirm your password"
                    />
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#328f90] to-[#000001] hover:from-[#2a7a7b] hover:to-[#000001] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#328f90] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center px-4 py-3 border border-[#328f90] rounded-lg text-sm font-medium text-[#328f90] bg-white hover:bg-[#328f90]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#328f90] transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
} 