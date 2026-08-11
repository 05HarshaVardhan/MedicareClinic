/* =================================================================
   MedCare Clinic - Main JavaScript (Part 1: Doctors Directory)
   ================================================================ */

// 1. DOCTORS DATA (Our local "Database")
const doctors = [
  { name: "Dr. Elena Rostova", specialty: "Cardiology", img: "../assets/elena.png" },
  { name: "Dr. Marcus Chen", specialty: "Cardiology", img: "../assets/chen.png" },
  { name: "Dr. Sarah Jenkins", specialty: "Pediatrics", img: "../assets/jenkins.png" },
  { name: "Dr. Michael Chang", specialty: "Pediatrics", img: "../assets/chang.png" },
  { name: "Dr. David Reynolds", specialty: "Neurology", img: "../assets/david.png" },
  { name: "Dr. Anita Patel", specialty: "Neurology", img: "../assets/patel.png" },
  { name: "Dr. James Wilson", specialty: "Dermatology", img: "../assets/james.png" },
  { name: "Dr. Linda Smith", specialty: "Dermatology", img: "../assets/smith.png" },
  { name: "Dr. Robert Taylor", specialty: "Orthopedics", img: "../assets/taylor.png" },
  { name: "Dr. William Brown", specialty: "Orthopedics", img: "../assets/brown.png" },
  { name: "Dr. Richard Davis", specialty: "Ophthalmology", img: "../assets/davis.png" },
  { name: "Dr. Susan Miller", specialty: "Ophthalmology", img: "../assets/miller.png" }
];

// 2. RENDER DOCTORS TO THE GRID
const doctorsGrid = document.getElementById('doctorsGrid');

function renderDoctors(docsToRender) {
  // Check if we are actually on the Doctors page before running
  if (!doctorsGrid) return; 

  // Clear out the grid first
  doctorsGrid.innerHTML = ''; 

  // If no doctors match the search/filter
  if (docsToRender.length === 0) {
    doctorsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: var(--color-text-muted);">No doctors found matching your criteria.</p>';
    return;
  }

  // Loop through the data and build the HTML cards
  docsToRender.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    
    // We use a neat trick here: if your local image fails to load, it falls back to a generated initial avatar!
    card.innerHTML = `
      <img src="${doc.img}" alt="${doc.name}" class="doctor-img" onerror="this.src='https://ui-avatars.com/api/?name=${doc.name.replace(' ', '+')}&background=0284c7&color=fff&size=250'">
      <div class="doctor-info">
        <span class="doctor-specialty">${doc.specialty}</span>
        <h3 class="type-2xl" style="margin-bottom: 0.5rem;">${doc.name}</h3>
        <a href="book-appointment.html" class="btn btn-outline" style="width: 100%; margin-top: 1rem;">Book Session</a>
      </div>
    `;
    doctorsGrid.appendChild(card);
  });
}

// 3. SEARCH AND FILTER LOGIC
// 3. SEARCH AND FILTER LOGIC (Updated for Multi-Select)
const searchInput = document.getElementById('searchInput');
const specialtyChips = document.querySelectorAll('.chip');

function handleSearchAndFilter() {
  if (!doctorsGrid) return;

  const searchTerm = searchInput.value.toLowerCase();
  
  // Find ALL chips that currently have the "active" class
  const activeChips = document.querySelectorAll('.chip.active');
  
  // Create an array of their data-specialty text (e.g., ['Cardiology', 'Neurology'])
  const activeSpecialties = Array.from(activeChips).map(chip => chip.getAttribute('data-specialty'));

  // Filter the array based on search text AND the array of active chips
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm) || doc.specialty.toLowerCase().includes(searchTerm);
    
    // It matches if 'All' is active, if NO chips are active, or if the doctor's specialty is in our active list
    const matchesSpecialty = activeSpecialties.includes('All') || activeSpecialties.length === 0 || activeSpecialties.includes(doc.specialty);
    
    return matchesSearch && matchesSpecialty;
  });

  renderDoctors(filteredDoctors);
}

// Attach Event Listeners
if (searchInput) {
  searchInput.addEventListener('input', handleSearchAndFilter);
}

if (specialtyChips.length > 0) {
  specialtyChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const clickedSpecialty = e.target.getAttribute('data-specialty');
      
      if (clickedSpecialty === 'All') {
        // If they clicked "All", clear everything else and just make "All" active
        specialtyChips.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
      } else {
        // If they clicked a specific specialty, toggle it on/off
        e.target.classList.toggle('active');
        
        // Turn off the "All" chip because they are now filtering specifically
        const allChip = document.querySelector('.chip[data-specialty="All"]');
        if (allChip) allChip.classList.remove('active');
        
        // If they un-toggled every single specific chip, turn "All" back on automatically
        const currentlyActive = document.querySelectorAll('.chip.active');
        if (currentlyActive.length === 0 && allChip) {
          allChip.classList.add('active');
        }
      }
      
      // Re-run the filter
      handleSearchAndFilter();
    });
  });
}
// Attach Event Listeners (Only if the elements exist on the page)


// Initialize the grid when the page first loads
document.addEventListener('DOMContentLoaded', () => {
  renderDoctors(doctors);
});


/* =================================================================
   MedCare Clinic - Main JavaScript (Part 2: Interactions)
   ================================================================ */

// 4. MOBILE NAVIGATION (Hamburger Menu)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    // Toggles the dropdown menu on small screens
    navMenu.classList.toggle('show');
    
    // Accessibility: updates screen reader state
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
  });
}

// 5. INTERACTIVE SVG MAP (Contact Page)
// A mini local database of our branch details
const branchData = {
  downtown: {
    title: "Downtown Flagship Clinic",
    address: "123 Healthcare Avenue, Medical District",
    phone: "+1 (555) 234-5678",
    hours: "Mon-Sun: 8:00 AM - 8:00 PM"
  },
  north: {
    title: "North Medical Hub",
    address: "890 Innovation Drive, Tech Park",
    phone: "+1 (555) 345-6789",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM"
  },
  west: {
    title: "Westside Care Center",
    address: "445 Sunset Boulevard, West End",
    phone: "+1 (555) 456-7890",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM"
  }
};

const mapPaths = document.querySelectorAll('.svg-map path');
const branchTitle = document.getElementById('branchTitle');
const branchAddress = document.getElementById('branchAddress');
const branchPhone = document.getElementById('branchPhone');
const branchHours = document.getElementById('branchHours');

if (mapPaths.length > 0) {
  mapPaths.forEach(path => {
    path.addEventListener('click', (e) => {
      // 1. Remove orange highlight from all paths
      mapPaths.forEach(p => p.classList.remove('active'));
      
      // 2. Add orange highlight to the one we just clicked
      e.target.classList.add('active');
      
      // 3. Get the data-branch attribute (e.g., "north")
      const branchKey = e.target.getAttribute('data-branch');
      const data = branchData[branchKey];
      
      // 4. Update the DOM with the new text
      if (data && branchTitle) {
        branchTitle.textContent = data.title;
        branchAddress.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.address}`;
        branchPhone.innerHTML = `<i class="fas fa-phone"></i> ${data.phone}`;
        branchHours.innerHTML = `<i class="fas fa-clock"></i> ${data.hours}`;
      }
    });
  });
}

// 6. FORM VALIDATION & SUCCESS MODAL (Booking Page)
const appointmentForm = document.getElementById('appointmentForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const doctorSelect = document.getElementById('doctorSelect');

// First, auto-fill the Doctor dropdown menu using our doctors array from Part 1!
if (doctorSelect && typeof doctors !== 'undefined') {
  doctors.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc.name;
    option.textContent = `${doc.name} - ${doc.specialty}`;
    doctorSelect.appendChild(option);
  });
}

if (appointmentForm) {
  appointmentForm.addEventListener('submit', (e) => {
    // Prevent the default browser refresh!
    e.preventDefault();
    
    let isValid = true;
    
    // Grab all inputs inside this specific form
    const formControls = appointmentForm.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
      // Check if it violates our HTML rules (required, minlength, pattern)
      if (!control.checkValidity()) {
        control.classList.add('invalid'); // Adds red border and shows error text via CSS
        isValid = false;
      } else {
        control.classList.remove('invalid');
      }
      
      // Listen for typing: as soon as they fix the error, remove the red styling
      control.addEventListener('input', () => {
        if (control.checkValidity()) {
          control.classList.remove('invalid');
        }
      });
    });
    
    // If every single input is perfect, show the success pop-up
    if (isValid && successModal) {
      successModal.classList.add('active');
      appointmentForm.reset(); // Clear the form fields completely
    }
  });
}

// Close the success pop-up when "Done" is clicked
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
  });
}

/* =================================================================
   MedCare Clinic - Main JavaScript (Part 3: Dark Mode)
   ================================================================ */

// 7. DARK MODE TOGGLE & LOCAL STORAGE
const themeToggleBtn = document.querySelector('.theme-toggle');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

// Step A: Check if the user already has a saved preference when the page loads
const savedTheme = localStorage.getItem('clinic-theme');

if (savedTheme === 'dark') {
  // If they saved dark mode previously, apply it immediately
  document.documentElement.setAttribute('data-theme', 'dark');
  
  // Swap the icon to a sun
  if (themeIcon) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
}

// Step B: Listen for the user clicking the toggle button
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    // Check what the CURRENT theme is
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
      // Switch back to Light Mode
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('clinic-theme', 'light'); // Save preference
      
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    } else {
      // Switch to Dark Mode
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('clinic-theme', 'dark'); // Save preference
      
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    }
  });
}

/* =================================================================
   MedCare Clinic - Main JavaScript (Part 4: Carousel)
   ================================================================ */

// 8. TESTIMONIAL CAROUSEL
const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.testimonial-card');
// Using querySelector to find the left and right buttons based on their order
const prevBtn = document.querySelector('.carousel-controls .carousel-btn:first-child');
const nextBtn = document.querySelector('.carousel-controls .carousel-btn:last-child');

// Only run this code if the carousel actually exists on the current page
if (track && cards.length > 0 && prevBtn && nextBtn) {
  let currentIndex = 0;

  function updateCarousel() {
    // Multiply the index by 100 to shift the track by full card widths
    // Example: index 1 * 100 = slide left 100%
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    // If we are NOT on the very last card, allow moving forward
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCarousel();
    } else {
      // Optional: Loop back to the beginning if they click next on the last card
      currentIndex = 0;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    // If we are NOT on the very first card, allow moving backward
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    } else {
      // Optional: Loop to the end if they click prev on the first card
      currentIndex = cards.length - 1;
      updateCarousel();
    }
  });
}