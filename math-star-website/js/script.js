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

    // Form submission handling
    const contactForm = document.getElementById('inquiry-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const parentName = document.getElementById('parent-name').value;
            const studentName = document.getElementById('student-name').value;
            const grade = document.getElementById('grade').value;
            
            // Show success message
            alert(`Thank you, ${parentName}! We've received your inquiry for ${studentName} (Grade ${grade}). We'll contact you shortly to schedule a free assessment, or you can schedule one now in our calendar section below.`);
            
            // Scroll to the schedule section
            const scheduleSection = document.getElementById('schedule');
            if (scheduleSection) {
                window.scrollTo({
                    top: scheduleSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Don't reset the form so the user can use the same information for scheduling
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

    // Calendar functionality
    initCalendar();
});

// Calendar functionality
function initCalendar() {
    // Elements
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const availableTimesContainer = document.getElementById('available-times');
    const selectedDateElement = document.getElementById('selected-date');
    const confirmDateElement = document.getElementById('confirm-date');
    const confirmTimeElement = document.getElementById('confirm-time');
    const confirmBookingBtn = document.getElementById('confirm-booking');
    
    // Current date
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    // Selected date and time
    let selectedDate = null;
    let selectedTime = null;
    
    // Available time slots (in a real application, these would come from a database)
    const availableTimes = {
        // Format: 'YYYY-MM-DD': ['time1', 'time2', ...]
        // Example for the next 30 days
    };
    
    // Generate available times for the next 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        
        // Skip Sundays (0) and Saturdays (6)
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        const dateString = formatDate(date);
        
        // Generate random available times
        availableTimes[dateString] = [];
        
        // Weekday times: 3PM-7PM
        const startHour = 15; // 3PM
        const endHour = 19;   // 7PM
        
        for (let hour = startHour; hour <= endHour; hour++) {
            // Add times at the hour and half hour
            if (Math.random() > 0.3) { // 70% chance of availability
                availableTimes[dateString].push(`${hour}:00`);
            }
            if (Math.random() > 0.3) { // 70% chance of availability
                availableTimes[dateString].push(`${hour}:30`);
            }
        }
    }
    
    // Format date as YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Format date for display
    function formatDateForDisplay(dateString) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
    
    // Format time for display
    function formatTimeForDisplay(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }
    
    // Generate calendar
    function generateCalendar(month, year) {
        // Clear previous calendar
        calendarDays.innerHTML = '';
        
        // Update month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('empty');
            calendarDays.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            
            // Check if this date is in the past
            const currentDate = new Date(year, month, day);
            const dateString = formatDate(currentDate);
            
            if (currentDate < today) {
                // Past date
                dayElement.classList.add('disabled');
            } else if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                // Weekend
                dayElement.classList.add('disabled');
            } else if (!availableTimes[dateString] || availableTimes[dateString].length === 0) {
                // No available times
                dayElement.classList.add('disabled');
            } else {
                // Available date
                dayElement.addEventListener('click', () => selectDate(dateString, dayElement));
            }
            
            // Highlight today
            if (currentDate.getDate() === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // Highlight selected date
            if (selectedDate === dateString) {
                dayElement.classList.add('selected');
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    // Select a date
    function selectDate(dateString, dayElement) {
        // Remove selected class from previously selected date
        const previouslySelected = document.querySelector('.days .selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        
        // Add selected class to new selected date
        dayElement.classList.add('selected');
        
        // Update selected date
        selectedDate = dateString;
        selectedDateElement.textContent = formatDateForDisplay(dateString);
        confirmDateElement.textContent = formatDateForDisplay(dateString);
        
        // Reset selected time
        selectedTime = null;
        confirmTimeElement.textContent = 'Not selected';
        confirmBookingBtn.disabled = true;
        
        // Show available times for selected date
        showAvailableTimes(dateString);
    }
    
    // Show available times for selected date
    function showAvailableTimes(dateString) {
        // Clear previous times
        availableTimesContainer.innerHTML = '';
        
        // Get available times for selected date
        const times = availableTimes[dateString] || [];
        
        if (times.length === 0) {
            const noTimes = document.createElement('p');
            noTimes.textContent = 'No available times for this date.';
            noTimes.classList.add('no-times');
            availableTimesContainer.appendChild(noTimes);
            return;
        }
        
        // Sort times
        times.sort();
        
        // Add time slots
        times.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            timeSlot.textContent = formatTimeForDisplay(time);
            
            timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
            
            availableTimesContainer.appendChild(timeSlot);
        });
    }
    
    // Select a time
    function selectTime(time, timeSlot) {
        // Remove selected class from previously selected time
        const previouslySelected = document.querySelector('.time-slot.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        
        // Add selected class to new selected time
        timeSlot.classList.add('selected');
        
        // Update selected time
        selectedTime = time;
        confirmTimeElement.textContent = formatTimeForDisplay(time);
        
        // Enable confirm button
        confirmBookingBtn.disabled = false;
    }
    
    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
    
    // Previous month button
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Next month button
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Confirm booking button
    confirmBookingBtn.addEventListener('click', () => {
        if (selectedDate && selectedTime) {
            // Get user information from the contact form if available
            let parentName = "A parent";
            let studentName = "a student";
            let grade = "";
            let email = "";
            let phone = "";
            
            const parentNameInput = document.getElementById('parent-name');
            const studentNameInput = document.getElementById('student-name');
            const gradeInput = document.getElementById('grade');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            
            if (parentNameInput && parentNameInput.value) {
                parentName = parentNameInput.value;
            }
            
            if (studentNameInput && studentNameInput.value) {
                studentName = studentNameInput.value;
            }
            
            if (gradeInput && gradeInput.value) {
                grade = `Grade ${gradeInput.value}`;
            }
            
            if (emailInput && emailInput.value) {
                email = emailInput.value;
            }
            
            if (phoneInput && phoneInput.value) {
                phone = phoneInput.value;
            }
            
            // Format the date and time for display
            const formattedDate = formatDateForDisplay(selectedDate);
            const formattedTime = formatTimeForDisplay(selectedTime);
            
            // Prepare email parameters
            const emailParams = {
                to_email: 'admin@math-star.org',
                subject: 'New Assessment Booking',
                parent_name: parentName,
                student_name: studentName,
                grade: grade,
                email: email,
                phone: phone,
                appointment_date: formattedDate,
                appointment_time: formattedTime,
                message: `A new assessment has been scheduled for ${studentName} (${grade}) on ${formattedDate} at ${formattedTime}.`
            };
            
            // Send email using EmailJS
            try {
                emailjs.send('default_service', 'template_booking', emailParams)
                    .then(function(response) {
                        console.log('Email sent successfully:', response);
                        // Show success message to user
                        alert(`Your free assessment has been scheduled for ${formattedDate} at ${formattedTime}. We look forward to meeting you!`);
                        
                        // Reset selection
                        resetBookingForm();
                    }, function(error) {
                        console.error('Email sending failed:', error);
                        // Still show confirmation to user even if email fails
                        alert(`Your free assessment has been scheduled for ${formattedDate} at ${formattedTime}. We look forward to meeting you!`);
                        
                        // Reset selection
                        resetBookingForm();
                    });
            } catch (e) {
                console.error('Email sending error:', e);
                // Fallback if EmailJS is not properly configured
                alert(`Your free assessment has been scheduled for ${formattedDate} at ${formattedTime}. We look forward to meeting you!`);
                
                // Reset selection
                resetBookingForm();
            }
        }
    });
    
    // Function to reset the booking form
    function resetBookingForm() {
        // Reset selection
        selectedDate = null;
        selectedTime = null;
        
        // Reset UI
        const selectedDateElement = document.querySelector('.days .selected');
        if (selectedDateElement) {
            selectedDateElement.classList.remove('selected');
        }
        
        const selectedTimeElement = document.querySelector('.time-slot.selected');
        if (selectedTimeElement) {
            selectedTimeElement.classList.remove('selected');
        }
        
        document.getElementById('selected-date').textContent = 'Select a date';
        confirmDateElement.textContent = 'Not selected';
        confirmTimeElement.textContent = 'Not selected';
        confirmBookingBtn.disabled = true;
        
        // Clear available times
        availableTimesContainer.innerHTML = '<p class="no-date-selected">Please select a date on the calendar to see available times.</p>';
    }
}
