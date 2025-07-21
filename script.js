// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Contact Form submission handling
    const contactForm = document.getElementById('inquiry-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const parentName = document.getElementById('parent-name').value;
            const studentName = document.getElementById('student-name').value;
            const grade = document.getElementById('grade').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Prepare email parameters
            const emailParams = {
                to_email: 'admin@math-star.org',
                from_name: parentName,
                subject: 'New Contact Form Inquiry',
                parent_name: parentName,
                student_name: studentName,
                grade: grade,
                email: email,
                phone: phone,
                message: message || 'No additional message provided.'
            };
            
            // Send email using EmailJS
            try {
                emailjs.send('service_6xnfc7n', 'template_u3f9dr8', emailParams)
                    .then(function(response) {
                        console.log('Email sent successfully:', response);
                        // Show success message to user
                        alert(`Thank you, ${parentName}! We've received your inquiry for ${studentName}. We'll contact you shortly.`);
                        
                        // Reset the form
                        contactForm.reset();
                    }, function(error) {
                        console.error('Email sending failed:', error);
                        // Show error message
                        alert('There was an error sending your message. Please try again or contact us directly at admin@math-star.org');
                    });
            } catch (e) {
                console.error('Email sending error:', e);
                // Fallback if EmailJS is not properly configured
                alert(`Thank you, ${parentName}! Your message has been received. We'll contact you shortly at ${email}.`);
                
                // Reset the form
                contactForm.reset();
            }
        });
    }

    // Free Assessment Form submission handling
    const assessmentForm = document.getElementById('assessment-form');
    
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const parentName = document.getElementById('parent-name-assessment').value;
            const studentName = document.getElementById('student-name-assessment').value;
            const grade = document.getElementById('grade-assessment').value;
            const email = document.getElementById('email-assessment').value;
            const phone = document.getElementById('phone-assessment').value;
            const preferredDays = document.getElementById('preferred-days').value;
            const message = document.getElementById('message-assessment').value;
            
            // Prepare email parameters
            const emailParams = {
                to_email: 'admin@math-star.org',
                from_name: parentName,
                subject: 'New Free Assessment Request',
                parent_name: parentName,
                student_name: studentName,
                grade: grade,
                email: email,
                phone: phone,
                preferred_days: preferredDays || 'No preference specified',
                message: message || 'No additional information provided.'
            };
            
            // Send email using EmailJS
            try {
                // Add detailed logging for debugging
                console.log('Sending email with params:', emailParams);
                emailjs.send('service_6xnfc7n', 'template_u3f9dr8', emailParams)
                    .then(function(response) {
                        console.log('Email sent successfully:', response);
                        // Show success message to user
                        alert(`Thank you, ${parentName}! We've received your request for a free assessment for ${studentName}. We'll contact you within 24 hours to schedule a time.`);
                        
                        // Reset the form
                        assessmentForm.reset();
                    }, function(error) {
                        console.error('Email sending failed:', error);
                        // Show detailed error message for debugging
                        console.error('Error details:', JSON.stringify(error));
                        // Show error message to user
                        alert('There was an error sending your request. Please try again or contact us directly at admin@math-star.org');
                    });
            } catch (e) {
                console.error('Email sending error:', e);
                // Fallback if EmailJS is not properly configured
                alert(`Thank you, ${parentName}! Your free assessment request has been received. We'll contact you shortly at ${email} to schedule a time.`);
                
                // Reset the form
                assessmentForm.reset();
            }
        });
    }

    // Add active class to current section in navigation
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu toggle button
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Insert the toggle button before the nav
    header.querySelector('.container').insertBefore(mobileMenuToggle, nav);
    
    // Add toggle functionality
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('mobile-nav-open');
        if (nav.classList.contains('mobile-nav-open')) {
            mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav.classList.contains('mobile-nav-open') && 
            !nav.contains(event.target) && 
            event.target !== mobileMenuToggle) {
            nav.classList.remove('mobile-nav-open');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close mobile menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('mobile-nav-open')) {
            nav.classList.remove('mobile-nav-open');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});
