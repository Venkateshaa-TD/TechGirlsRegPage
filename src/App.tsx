import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, GraduationCap, Share2, Upload, CheckCircle2, Heart, Sparkles, Star } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  college: string;
  screenshot: File | null;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    college: '',
    screenshot: null,
  });
  
  const [shareCount, setShareCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Check if user has already submitted
    const hasSubmitted = localStorage.getItem('techForGirlsSubmitted');
    if (hasSubmitted) {
      setIsSubmitted(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validation for name field - only letters and spaces
    if (name === 'name') {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!nameRegex.test(value)) {
        return; // Don't update if invalid characters
      }
    }
    
    // Validation for phone field - only numbers and max 10 digits
    if (name === 'phone') {
      const phoneRegex = /^\d*$/;
      if (!phoneRegex.test(value) || value.length > 10) {
        return; // Don't update if invalid or too long
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setFormData(prev => ({ ...prev, screenshot: file }));
      setErrors(prev => ({ ...prev, screenshot: null }));
    } else {
      setErrors(prev => ({ ...prev, screenshot: 'Please upload an image or PDF file' }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleWhatsAppShare = () => {
    if (shareCount < 5) {
      const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community");
      const whatsappUrl = `https://wa.me/?text=${message}`;
      window.open(whatsappUrl, '_blank');
      setShareCount(prev => prev + 1);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.college.trim()) newErrors.college = 'College/Department is required';
    if (!formData.screenshot) newErrors.screenshot = 'Screenshot upload is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shareCount < 5) {
      alert('Please complete the WhatsApp sharing (5/5) before submitting!');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    // Mark as submitted
    localStorage.setItem('techForGirlsSubmitted', 'true');
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-pink-200">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎉 Success!
          </h2>
          <p className="text-gray-600 mb-6">
            Your submission has been recorded. Thanks for being part of Tech for Girls!
          </p>
          <div className="flex justify-center space-x-2">
            <Heart className="w-6 h-6 text-pink-500 animate-bounce" />
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
            <Star className="w-6 h-6 text-rose-500 animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Floating Hearts */}
        <div className="absolute top-20 left-10 animate-float">
          <Heart className="w-8 h-8 text-pink-400 animate-heartbeat" fill="currentColor" />
        </div>
        <div className="absolute top-32 right-16 animate-float" style={{ animationDelay: '1s' }}>
          <Heart className="w-6 h-6 text-rose-400 animate-heartbeat" fill="currentColor" />
        </div>
        <div className="absolute top-60 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <Heart className="w-5 h-5 text-purple-400 animate-heartbeat" fill="currentColor" />
        </div>
        <div className="absolute bottom-40 right-1/3 animate-float" style={{ animationDelay: '0.5s' }}>
          <Heart className="w-7 h-7 text-pink-500 animate-heartbeat" fill="currentColor" />
        </div>
        <div className="absolute bottom-20 left-1/3 animate-float" style={{ animationDelay: '1.5s' }}>
          <Heart className="w-4 h-4 text-rose-500 animate-heartbeat" fill="currentColor" />
        </div>
        
        {/* Sparkle Elements */}
        <div className="absolute top-40 left-1/2 animate-sparkle">
          <Sparkles className="w-6 h-6 text-pink-400" />
        </div>
        <div className="absolute top-80 right-1/4 animate-sparkle" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div className="absolute bottom-60 left-1/5 animate-sparkle" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-4 h-4 text-rose-400" />
        </div>
        
        {/* Star Elements */}
        <div className="absolute top-24 right-1/3 animate-pulse">
          <Star className="w-5 h-5 text-pink-300" fill="currentColor" />
        </div>
        <div className="absolute top-96 left-1/6 animate-pulse" style={{ animationDelay: '1s' }}>
          <Star className="w-4 h-4 text-purple-300" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 right-1/5 animate-pulse" style={{ animationDelay: '2s' }}>
          <Star className="w-6 h-6 text-rose-300" fill="currentColor" />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-rose-300/25 to-pink-300/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-10 w-36 h-36 bg-gradient-to-br from-pink-300/25 to-rose-300/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Additional Decorative Elements */}
        <div className="absolute top-1/3 left-8 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-12 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-rose-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-full mb-6 shadow-2xl animate-gradient relative">
            <Users className="w-10 h-10 text-white" />
            <div className="absolute -top-2 -right-2">
              <Heart className="w-6 h-6 text-pink-300 animate-heartbeat" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-gradient">
            Tech for Girls
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Join our empowering community of women in technology. Register now to be part of something amazing!
          </p>
          <div className="flex justify-center items-center space-x-3 mt-4">
            <Heart className="w-5 h-5 text-pink-500 animate-heartbeat" fill="currentColor" />
            <Sparkles className="w-5 h-5 text-purple-500 animate-sparkle" />
            <Heart className="w-5 h-5 text-rose-500 animate-heartbeat" fill="currentColor" />
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl border-2 border-pink-200/50 relative overflow-hidden">
            {/* Form Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-100/50 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-100/50 to-transparent rounded-full blur-xl"></div>
            
            {/* Basic Details Section */}
            <div className="mb-10 relative z-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                <Heart className="w-7 h-7 text-pink-500 mr-3 animate-heartbeat" fill="currentColor" />
                Basic Details
                <Sparkles className="w-6 h-6 text-purple-500 ml-3 animate-sparkle" />
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 focus:ring-4 focus:ring-pink-200 focus:border-pink-400 bg-gradient-to-r from-gray-50 to-pink-50/30 ${
                      errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 focus:ring-4 focus:ring-pink-200 focus:border-pink-400 bg-gradient-to-r from-gray-50 to-purple-50/30 ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Enter your 10-digit phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 focus:ring-4 focus:ring-pink-200 focus:border-pink-400 bg-gradient-to-r from-gray-50 to-rose-50/30 ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    College/Department
                  </label>
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 focus:ring-4 focus:ring-pink-200 focus:border-pink-400 bg-gradient-to-r from-gray-50 to-pink-50/30 ${
                      errors.college ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <option value="">Select your college/department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics & Communication</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.college && <p className="text-red-500 text-sm mt-1">{errors.college}</p>}
                </div>
              </div>
            </div>

            {/* WhatsApp Sharing Section */}
            <div className="mb-10 relative z-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                <Heart className="w-7 h-7 text-rose-500 mr-3 animate-heartbeat" fill="currentColor" />
                Share & Connect
                <Share2 className="w-6 h-6 text-pink-500 ml-3" />
              </h2>
              
              <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 rounded-3xl p-8 border-2 border-pink-200/50 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Heart className="w-4 h-4 text-pink-400 animate-heartbeat" fill="currentColor" />
                </div>
                <p className="text-gray-700 mb-6 text-lg">
                  Help us grow our community! Share our message with your friends on WhatsApp.
                </p>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    disabled={shareCount >= 5}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center space-x-3 shadow-lg ${
                      shareCount >= 5
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 hover:shadow-xl transform hover:scale-105 animate-gradient'
                    }`}
                  >
                    <Heart className="w-5 h-5 animate-heartbeat" fill="currentColor" />
                    <span>Share on WhatsApp</span>
                    <Share2 className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-700 font-medium">Share count:</span>
                    <span className={`text-2xl font-bold ${shareCount >= 5 ? 'text-green-600' : 'text-pink-600'}`}>
                      {shareCount}/5
                    </span>
                    {shareCount >= 5 && <Heart className="w-5 h-5 text-green-500 animate-heartbeat" fill="currentColor" />}
                  </div>
                </div>
                
                {shareCount >= 5 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl">
                    <p className="text-green-800 font-bold text-center text-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 mr-2 animate-heartbeat" fill="currentColor" />
                      🎉 Sharing complete! Please continue with your registration.
                      <Sparkles className="w-5 h-5 ml-2 animate-sparkle" />
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mb-10 relative z-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                <Heart className="w-7 h-7 text-purple-500 mr-3 animate-heartbeat" fill="currentColor" />
                Upload Document
                <Upload className="w-6 h-6 text-pink-500 ml-3" />
              </h2>
              
              <div
                className={`border-3 border-dashed rounded-3xl p-10 text-center transition-all duration-300 relative overflow-hidden ${
                  dragActive 
                    ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50' 
                    : errors.screenshot 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-pink-300 bg-gradient-to-br from-gray-50 to-pink-50/30 hover:border-pink-400 hover:from-pink-50 hover:to-rose-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="absolute top-4 right-4">
                  <Heart className="w-5 h-5 text-pink-400 animate-heartbeat" fill="currentColor" />
                </div>
                <Upload className="w-16 h-16 text-pink-400 mx-auto mb-6" />
                <p className="text-gray-700 mb-3 text-lg font-medium">
                  Upload your resume, photo, or any relevant document
                </p>
                <p className="text-gray-500 mb-6">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white rounded-2xl font-bold text-lg cursor-pointer hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 transition-all duration-300 hover:shadow-xl transform hover:scale-105 animate-gradient"
                >
                  <Heart className="w-5 h-5 animate-heartbeat" fill="currentColor" />
                  <span>Choose File</span>
                  <Sparkles className="w-5 h-5 animate-sparkle" />
                </label>
                
                {formData.screenshot && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl">
                    <p className="text-green-800 font-bold flex items-center justify-center">
                      <Heart className="w-5 h-5 mr-2 animate-heartbeat" fill="currentColor" />
                      ✅ File uploaded: {formData.screenshot.name}
                      <Sparkles className="w-5 h-5 ml-2 animate-sparkle" />
                    </p>
                  </div>
                )}
                
                {errors.screenshot && <p className="text-red-500 text-sm mt-2">{errors.screenshot}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-2xl font-bold text-xl transition-all duration-300 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-gradient shadow-xl relative overflow-hidden"
              disabled={shareCount < 5}
            >
              <div className="flex items-center justify-center space-x-3">
                <Heart className="w-6 h-6 animate-heartbeat" fill="currentColor" />
                <span>{shareCount < 5 ? 'Complete WhatsApp Sharing First' : 'Submit Registration'}</span>
                <Sparkles className="w-6 h-6 animate-sparkle" />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;