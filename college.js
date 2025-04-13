document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('Form');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.glyphicon-eye-open');
    
    document.addEventListener('DOMContentLoaded', function() {
        // Function to detect device type
        function detectDevice() {
            const userAgent = navigator.userAgent;
            const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            const isTablet = /iPad|Android|Tablet/i.test(userAgent) && !isMobile;
            
            if (isMobile) return 'mobile';
            if (isTablet) return 'tablet';
            return 'desktop';
        }
    
        // Function to adjust layout based on device
        function adjustLayout() {
            const device = detectDevice();
            const form = document.getElementById('Form');
            const container = document.querySelector('.login-container');
            const body = document.body;
    
            // Reset all styles first
            body.style.fontSize = '';
            form.style.width = '';
            container.style.padding = '';
    
            // Device-specific adjustments
            switch(device) {
                case 'mobile':
                    body.style.fontSize = '14px';
                    form.style.width = '90%';
                    container.style.padding = '10px';
                    break;
                    
                case 'tablet':
                    body.style.fontSize = '16px';
                    form.style.width = '70%';
                    container.style.padding = '20px';
                    break;
                    
                case 'desktop':
                    body.style.fontSize = '18px';
                    form.style.width = '50%';
                    container.style.padding = '30px';
                    break;
            }
    
            // Additional responsive elements
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                heading.style.textAlign = device === 'mobile' ? 'center' : 'left';
            });
    
            // Adjust input sizes
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.style.padding = device === 'mobile' ? '8px' : '10px';
                input.style.fontSize = device === 'mobile' ? '14px' : '16px';
            });
    
            // Adjust buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.padding = device === 'mobile' ? '8px 16px' : '10px 20px';
                button.style.fontSize = device === 'mobile' ? '14px' : '16px';
            });
        }
    
        // Initial adjustment
        adjustLayout();
    
        // Adjust on window resize
        window.addEventListener('resize', adjustLayout);
    });
    // Toggle password visibility
    if (eyeIcon) {
        eyeIcon.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('glyphicon-eye-open');
                this.classList.add('glyphicon-eye-close');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('glyphicon-eye-close');
                this.classList.add('glyphicon-eye-open');
            }
        });
    }
    
    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const number = document.getElementById('number').value;
            const rollno = document.getElementById('rollno').value;
            const password = passwordInput.value;
            const branch = document.querySelector('input[name="branch"]:checked');
            // Validate phone number (10 digits)
            if (number.length !== 10) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            // Validate roll number (alphanumeric)
            if (!/^[a-zA-Z0-9]+$/.test(rollno)) {
                alert('Roll number should be alphanumeric!');
                return;
            }
            
            // Validate password (at least 6 characters)
            if (password !="Kmit123$") {
               alert("Invalid Passwoed")
               return;
            }
            
            // Create student object
            const student = {
                name: name,
                phone: number,
                rollno: rollno,
                branch: branch.value,
                timestamp: new Date().toISOString()
            };
            
            // In a real application, you would send this data to a server
            console.log('Student data:', student);
            // Show success message console.log()
            alert(name+" Your Login is successful!\n"+"With Rollno "+rollno+"\nYour has been data sent");
            // Reset form
            form.reset();
        });
    }
    
    
    
});