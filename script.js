// Form data and state
let formData = {
    name: '',
    phone: '',
    email: '',
    college: '',
    screenshot: null
};

let shareCount = 0;
let isSubmitted = false;

// DOM elements
const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const shareButton = document.getElementById('shareButton');
const shareCountElement = document.getElementById('shareCount');
const shareComplete = document.getElementById('shareComplete');
const submitButton = document.getElementById('submitButton');
const submitText = document.getElementById('submitText');
const fileUpload = document.getElementById('fileUpload');
const uploadContainer = document.getElementById('uploadContainer');
const fileSuccess = document.getElementById('fileSuccess');
const fileName = document.getElementById('fileName');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already submitted
    const hasSubmitted = localStorage.getItem('techForGirlsSubmitted');
    const savedShareCount = localStorage.getItem('techForGirlsShareCount');
    
    if (hasSubmitted === 'true') {
        showSuccessMessage();
        disableAllInputs();
        return;
    }
    
    // Restore share count if exists
    if (savedShareCount) {
        shareCount = parseInt(savedShareCount);
        updateShareCount();
        if (shareCount >= 5) {
            shareButton.disabled = true;
            shareButton.innerHTML = `
                <span class="heart">♥</span>
                <span>Sharing Complete</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                </svg>
            `;
            shareComplete.classList.remove('hidden');
            updateSubmitButton();
        }
    }
    
    // Add event listeners
    addEventListeners();
});

function addEventListeners() {
    // Form input validation
    document.getElementById('name').addEventListener('input', handleNameInput);
    document.getElementById('phone').addEventListener('input', handlePhoneInput);
    document.getElementById('email').addEventListener('input', handleEmailInput);
    document.getElementById('college').addEventListener('change', handleCollegeChange);
    
    // WhatsApp sharing
    shareButton.addEventListener('click', handleWhatsAppShare);
    
    // File upload
    fileUpload.addEventListener('change', handleFileUpload);
    uploadContainer.addEventListener('dragenter', handleDrag);
    uploadContainer.addEventListener('dragover', handleDrag);
    uploadContainer.addEventListener('dragleave', handleDragLeave);
    uploadContainer.addEventListener('drop', handleDrop);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
}

// Input validation functions
function handleNameInput(e) {
    const value = e.target.value;
    const nameRegex = /^[a-zA-Z\s]*$/;
    
    if (!nameRegex.test(value)) {
        e.target.value = formData.name; // Revert to previous valid value
        showError('nameError', 'Only letters and spaces are allowed');
        return;
    }
    
    formData.name = value;
    clearError('nameError');
}

function handlePhoneInput(e) {
    const value = e.target.value;
    const phoneRegex = /^\d*$/;
    
    if (!phoneRegex.test(value) || value.length > 10) {
        e.target.value = formData.phone; // Revert to previous valid value
        if (value.length > 10) {
            showError('phoneError', 'Phone number cannot exceed 10 digits');
        } else {
            showError('phoneError', 'Only numbers are allowed');
        }
        return;
    }
    
    formData.phone = value;
    clearError('phoneError');
}

function handleEmailInput(e) {
    formData.email = e.target.value;
    clearError('emailError');
}

function handleCollegeChange(e) {
    formData.college = e.target.value;
    clearError('collegeError');
}

// WhatsApp sharing
function handleWhatsAppShare() {
    if (shareCount < 5 && !isSubmitted) {
        const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community");
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        shareCount++;
        updateShareCount();
        
        // Save share count to localStorage
        localStorage.setItem('techForGirlsShareCount', shareCount.toString());
        
        if (shareCount >= 5) {
            shareButton.disabled = true;
            shareButton.innerHTML = `
                <span class="heart">♥</span>
                <span>Sharing Complete</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                </svg>
            `;
            shareComplete.classList.remove('hidden');
            updateSubmitButton();
        }
    }
}

function updateShareCount() {
    shareCountElement.textContent = `${shareCount}/5`;
    if (shareCount >= 5) {
        shareCountElement.classList.add('complete');
    }
}

// File upload handling
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file && !isSubmitted) {
        processFile(file);
    }
}

function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmitted) {
        uploadContainer.classList.add('drag-active');
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadContainer.classList.remove('drag-active');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadContainer.classList.remove('drag-active');
    
    if (!isSubmitted) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }
}

function processFile(file) {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
        formData.screenshot = file;
        fileName.textContent = file.name;
        fileSuccess.classList.remove('hidden');
        clearError('fileError');
    } else {
        showError('fileError', 'Please upload an image or PDF file');
    }
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
        showError('nameError', 'Name is required');
        isValid = false;
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
        showError('phoneError', 'Phone number is required');
        isValid = false;
    } else if (formData.phone.length !== 10) {
        showError('phoneError', 'Please enter a valid 10-digit phone number');
        isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // College validation
    if (!formData.college.trim()) {
        showError('collegeError', 'College/Department is required');
        isValid = false;
    }
    
    // File validation
    if (!formData.screenshot) {
        showError('fileError', 'Screenshot upload is required');
        isValid = false;
    }
    
    return isValid;
}

// Form submission
function handleSubmit(e) {
    e.preventDefault();
    
    // Check if already submitted
    if (isSubmitted || localStorage.getItem('techForGirlsSubmitted') === 'true') {
        alert('You have already submitted your registration!');
        return;
    }
    
    if (shareCount < 5) {
        alert('Please complete the WhatsApp sharing (5/5) before submitting!');
        return;
    }
    
    // Update form data from inputs
    formData.name = document.getElementById('name').value;
    formData.phone = document.getElementById('phone').value;
    formData.email = document.getElementById('email').value;
    formData.college = document.getElementById('college').value;
    
    if (!validateForm()) {
        return;
    }
    
    // Mark as submitted in localStorage
    localStorage.setItem('techForGirlsSubmitted', 'true');
    localStorage.setItem('techForGirlsSubmissionData', JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        college: formData.college,
        fileName: formData.screenshot ? formData.screenshot.name : '',
        submissionDate: new Date().toISOString()
    }));
    
    // Disable all inputs and show success
    disableAllInputs();
    showSuccessMessage();
}

function disableAllInputs() {
    // Disable all form inputs
    const inputs = form.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.6';
        input.style.cursor = 'not-allowed';
    });
    
    // Disable file upload
    fileUpload.disabled = true;
    uploadContainer.style.opacity = '0.6';
    uploadContainer.style.pointerEvents = 'none';
    
    // Disable share button
    shareButton.disabled = true;
    shareButton.style.opacity = '0.6';
    shareButton.style.cursor = 'not-allowed';
    
    // Update submit button
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    submitText.textContent = 'Registration Already Submitted';
    
    isSubmitted = true;
}

function updateSubmitButton() {
    if (shareCount >= 5 && !isSubmitted) {
        submitButton.disabled = false;
        submitText.textContent = 'Submit Registration';
        submitButton.style.background = 'linear-gradient(135deg, #ec4899, #8b5cf6)';
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    }
}

function showSuccessMessage() {
    form.classList.add('hidden');
    successMessage.classList.remove('hidden');
    isSubmitted = true;
    
    // Add additional success styling
    document.body.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))';
}

// Utility functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
}

// Prevent form resubmission on page refresh
window.addEventListener('beforeunload', function() {
    if (isSubmitted) {
        localStorage.setItem('techForGirlsSubmitted', 'true');
    }
});

// Add some interactive animations
document.addEventListener('mousemove', function(e) {
    if (isSubmitted) return; // Disable animations after submission
    
    const hearts = document.querySelectorAll('.decorative-elements .heart');
    const sparkles = document.querySelectorAll('.decorative-elements .sparkle');
    
    hearts.forEach((heart, index) => {
        const speed = (index + 1) * 0.0001;
        const x = (e.clientX * speed) % 10;
        const y = (e.clientY * speed) % 10;
        heart.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    sparkles.forEach((sparkle, index) => {
        const speed = (index + 1) * 0.0002;
        const x = (e.clientX * speed) % 15;
        const y = (e.clientY * speed) % 15;
        sparkle.style.transform = `translate(${x}px, ${y}px) rotate(${x * 2}deg)`;
    });
});

// Add scroll animations
window.addEventListener('scroll', function() {
    if (isSubmitted) return; // Disable animations after submission
    
    const scrolled = window.pageYOffset;
    const techShapes = document.querySelectorAll('.tech-shape');
    
    techShapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Clear localStorage function (for testing purposes - can be removed in production)
function clearSubmissionData() {
    localStorage.removeItem('techForGirlsSubmitted');
    localStorage.removeItem('techForGirlsShareCount');
    localStorage.removeItem('techForGirlsSubmissionData');
    location.reload();
}

// Console message for developers
console.log('Tech for Girls Registration System');
console.log('Single submission protection active');
console.log('To reset for testing, call: clearSubmissionData()');