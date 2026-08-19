function createAvatarUrl(name) {
  const displayName = name.replace(/^Dr\.\s*/, '');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0369a1&color=fff&size=250&bold=true`;
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

function createLqipUrl(name) {
  const initials = name.replace(/^Dr\.\s*/, '').split(' ').map(n => n[0]).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="#0369a1"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function renderDoctors(docsToRender) {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return; 

  doctorsGrid.innerHTML = ''; 

  if (docsToRender.length === 0) {
    doctorsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem; color: var(--color-text-muted);">No doctors found matching your criteria.</p>';
    return;
  }

  docsToRender.forEach((doc, index) => {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    const avatarUrl = createAvatarUrl(doc.name);
    const lqipUrl = createLqipUrl(doc.name);
    
    let imageSrc = avatarUrl;
    if (doc.img) {
      const isSubpage = window.location.pathname.includes('/pages/');
      const basePath = isSubpage ? '../assets/' : 'assets/';
      imageSrc = (doc.img.startsWith('http') || doc.img.startsWith('/') || doc.img.startsWith('../')) ? doc.img : `${basePath}${doc.img}`;
    }
    
    const availableDaysText = doc.availableDays.join(', ');
    
    const imgHtml = index < 3 ? 
      `<img src="${imageSrc}" width="300" height="250" alt="${doc.name}" class="doctor-img" decoding="async" loading="eager" ${index === 0 ? 'fetchpriority="high"' : ''} onerror="this.onerror=null; this.src='${avatarUrl}';">` :
      `<img src="${lqipUrl}" data-src="${imageSrc}" width="300" height="250" alt="${doc.name}" class="doctor-img lazy-img" decoding="async" onerror="this.onerror=null; this.src='${avatarUrl}'; this.classList.add('loaded');">`;

    card.innerHTML = `
      ${imgHtml}
      <div class="doctor-info">
        <span class="doctor-specialty">${doc.specialty}</span>
        <h3 class="type-2xl" style="margin-bottom: 0.5rem;">${doc.name}</h3>
        <p class="doctor-experience"><i class="fas fa-user-md" aria-hidden="true"></i> ${doc.experience}</p>
        <p class="doctor-availability"><i class="fas fa-calendar-days" aria-hidden="true"></i> Available: ${availableDaysText}</p>
        <a href="/pages/bookAppointment.html" class="btn btn-outline" style="width: 100%; margin-top: 1rem;">Book Session</a>
      </div>
    `;
    doctorsGrid.appendChild(card);
  });

  if (typeof window.initLazyLoading === 'function') {
    window.initLazyLoading();
  }
}

function handleSearchAndFilter() {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return;

  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  
  const activeSpecialtyChips = document.querySelectorAll('#specialtyChips .chip.active');
  const activeSpecialties = Array.from(activeSpecialtyChips).map(chip => chip.getAttribute('data-specialty')).filter(Boolean);

  const activeDayChips = document.querySelectorAll('#dayChips .chip.active');
  const activeDays = Array.from(activeDayChips).map(chip => chip.getAttribute('data-day')).filter(Boolean);

  const filteredDoctors = doctors.filter(doc => {
    const availableDaysText = doc.availableDays.join(' ').toLowerCase();
    
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm) || 
                          doc.specialty.toLowerCase().includes(searchTerm) || 
                          doc.experience.toLowerCase().includes(searchTerm) || 
                          availableDaysText.includes(searchTerm);
                          
    const matchesSpecialty = activeSpecialties.includes('All') || 
                             activeSpecialties.length === 0 || 
                             activeSpecialties.includes(doc.specialty);

    const matchesDay = activeDays.includes('All') || 
                       activeDays.length === 0 || 
                       doc.availableDays.some(day => activeDays.includes(day));
    
    return matchesSearch && matchesSpecialty && matchesDay;
  });

  renderDoctors(filteredDoctors);
}

function bindChipGroup(containerSelector, attributeName) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const chips = container.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const clickedVal = e.target.getAttribute(attributeName);
      
      if (clickedVal === 'All') {
        chips.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
      } else {
        e.target.classList.toggle('active');
        
        const allChip = container.querySelector(`.chip[${attributeName}="All"]`);
        if (allChip) allChip.classList.remove('active');
        
        const currentlyActive = container.querySelectorAll('.chip.active');
        if (currentlyActive.length === 0 && allChip) {
          allChip.classList.add('active');
        }
      }
      
      chips.forEach(c => {
        c.setAttribute('aria-pressed', c.classList.contains('active') ? 'true' : 'false');
      });

      handleSearchAndFilter();
    });
  });
}

function initDoctorsModule() {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return;

  renderDoctors(doctors);

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchAndFilter);
  }

  bindChipGroup('#specialtyChips', 'data-specialty');
  bindChipGroup('#dayChips', 'data-day');
}

window.initDoctorsModule = initDoctorsModule;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDoctorsModule);
} else {
  initDoctorsModule();
}
