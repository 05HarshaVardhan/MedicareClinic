/* =================================================================
   MedCare Clinic - Doctors Module (Data & Directory Renderer)
   ================================================================ */

function createAvatarUrl(name) {
  const displayName = name.replace(/^Dr\.\s*/, '');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0284c7&color=fff&size=250&bold=true`;
}

var doctors = [
  { name: "Dr. Aarav Mehta", specialty: "Cardiology", experience: "14+ years experience", availableDays: ["Monday", "Wednesday", "Friday"], img: "aarav.webp" },
  { name: "Dr. Priya Nair", specialty: "Cardiology", experience: "11+ years experience", availableDays: ["Tuesday", "Thursday", "Saturday"], img: "priya.webp" },
  { name: "Dr. Ananya Rao", specialty: "Pediatrics", experience: "13+ years experience", availableDays: ["Monday", "Tuesday", "Thursday"], img: "rao.webp" },
  { name: "Dr. Rohan Gupta", specialty: "Pediatrics", experience: "14+ years experience", availableDays: ["Wednesday", "Friday", "Saturday"], img: "rohan.webp" },
  { name: "Dr. Vikram Iyer", specialty: "Neurology", experience: "20+ years experience", availableDays: ["Monday", "Wednesday", "Saturday"], img: "vikram.webp" },
  { name: "Dr. Neha Sharma", specialty: "Neurology", experience: "10+ years experience", availableDays: ["Tuesday", "Thursday", "Friday"], img: "neha.webp" },
  { name: "Dr. Kavya Menon", specialty: "Dermatology", experience: "9+ years experience", availableDays: ["Monday", "Thursday", "Saturday"], img: "kavya.webp" },
  { name: "Dr. Arjun Kapoor", specialty: "Dermatology", experience: "13+ years experience", availableDays: ["Tuesday", "Wednesday", "Friday"], img: "arjun.webp" },
  { name: "Dr. Suresh Reddy", specialty: "Orthopedics", experience: "20+ years experience", availableDays: ["Monday", "Wednesday", "Friday"], img: "suresh.webp" },
  { name: "Dr. Meera Joshi", specialty: "Orthopedics", experience: "11+ years experience", availableDays: ["Tuesday", "Thursday", "Saturday"], img: "meera.webp" },
  { name: "Dr. Karan Malhotra", specialty: "Ophthalmology", experience: "15+ years experience", availableDays: ["Monday", "Tuesday", "Friday"], img: "karan.webp" },
  { name: "Dr. Aisha Khan", specialty: "Ophthalmology", experience: "9+ years experience", availableDays: ["Wednesday", "Thursday", "Saturday"], img: "aisha.webp" }
];

function renderDoctors(docsToRender) {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return; 

  doctorsGrid.innerHTML = ''; 

  if (docsToRender.length === 0) {
    doctorsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: var(--color-text-muted);">No doctors found matching your criteria.</p>';
    return;
  }

  docsToRender.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    const avatarUrl = createAvatarUrl(doc.name);
    
    let imageSrc = avatarUrl;
    if (doc.img) {
      const isSubpage = window.location.pathname.includes('/pages/');
      const basePath = isSubpage ? '../assets/' : 'assets/';
      imageSrc = (doc.img.startsWith('http') || doc.img.startsWith('/') || doc.img.startsWith('../')) ? doc.img : `${basePath}${doc.img}`;
    }
    
    const availableDaysText = doc.availableDays.join(', ');
    
    card.innerHTML = `
      <img src="${imageSrc}" alt="${doc.name}" class="doctor-img" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='${avatarUrl}'">
      <div class="doctor-info">
        <span class="doctor-specialty">${doc.specialty}</span>
        <h3 class="type-2xl" style="margin-bottom: 0.5rem;">${doc.name}</h3>
        <p class="doctor-experience"><i class="fas fa-user-md" aria-hidden="true"></i> ${doc.experience}</p>
        <p class="doctor-availability"><i class="fas fa-calendar-days" aria-hidden="true"></i> Available: ${availableDaysText}</p>
        <a href="bookAppointment.html" class="btn btn-outline" style="width: 100%; margin-top: 1rem;">Book Session</a>
      </div>
    `;
    doctorsGrid.appendChild(card);
  });
}

function handleSearchAndFilter() {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return;

  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const activeChips = document.querySelectorAll('.chip.active');
  const activeSpecialties = Array.from(activeChips).map(chip => chip.getAttribute('data-specialty'));

  const filteredDoctors = doctors.filter(doc => {
    const availableDaysText = doc.availableDays.join(' ').toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm) || doc.specialty.toLowerCase().includes(searchTerm) || doc.experience.toLowerCase().includes(searchTerm) || availableDaysText.includes(searchTerm);
    const matchesSpecialty = activeSpecialties.includes('All') || activeSpecialties.length === 0 || activeSpecialties.includes(doc.specialty);
    
    return matchesSearch && matchesSpecialty;
  });

  renderDoctors(filteredDoctors);
}

function initDoctorsModule() {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return;

  renderDoctors(doctors);

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchAndFilter);
  }

  const specialtyChips = document.querySelectorAll('.chip');
  if (specialtyChips.length > 0) {
    specialtyChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const clickedSpecialty = e.target.getAttribute('data-specialty');
        
        if (clickedSpecialty === 'All') {
          specialtyChips.forEach(c => c.classList.remove('active'));
          e.target.classList.add('active');
        } else {
          e.target.classList.toggle('active');
          
          const allChip = document.querySelector('.chip[data-specialty="All"]');
          if (allChip) allChip.classList.remove('active');
          
          const currentlyActive = document.querySelectorAll('.chip.active');
          if (currentlyActive.length === 0 && allChip) {
            allChip.classList.add('active');
          }
        }
        
        handleSearchAndFilter();
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDoctorsModule);
} else {
  initDoctorsModule();
}
