/* =================================================================
   MedCare Clinic - SVG Clinic Branch Locator Module
   ================================================================ */

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
      mapPaths.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      
      const branchKey = e.target.getAttribute('data-branch');
      const data = branchData[branchKey];
      
      if (data && branchTitle) {
        branchTitle.textContent = data.title;
        branchAddress.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.address}`;
        branchPhone.innerHTML = `<i class="fas fa-phone"></i> ${data.phone}`;
        branchHours.innerHTML = `<i class="fas fa-clock"></i> ${data.hours}`;
      }
    });
  });
}
