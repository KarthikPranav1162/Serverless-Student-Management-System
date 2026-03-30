/* ==================== CONFIG ==================== */
const API      = "https://8we5f2dz4d.execute-api.us-east-1.amazonaws.com/students";
const AUTH_API = "https://8we5f2dz4d.execute-api.us-east-1.amazonaws.com/auth";

const COURSES = [
  { code: 101, name: "Full Stack Development" }, { code: 102, name: "Data Analytics" },
  { code: 103, name: "Data Science" }, { code: 104, name: "Python Programming" },
  { code: 105, name: "Java Programming" }, { code: 106, name: "C Programming" },
  { code: 107, name: "C++ Programming" }, { code: 108, name: ".NET" },
  { code: 109, name: "Artificial Intelligence" }, { code: 110, name: "Machine Learning" },
  { code: 111, name: "Deep Learning" }, { code: 112, name: "Android App Development" },
  { code: 113, name: "iOS App Development" }, { code: 114, name: "AWS DevOps" },
  { code: 115, name: "Azure DevOps" }, { code: 116, name: "Cybersecurity" },
  { code: 117, name: "Ethical Hacking" }, { code: 118, name: "Linux Administration" },
  { code: 119, name: "Database Management" }, { code: 120, name: "SQL" },
  { code: 121, name: "UI UX Design" }, { code: 122, name: "Software Testing" },
  { code: 123, name: "Generative AI" }, { code: 124, name: "Digital Marketing" },
  { code: 125, name: "Graphic Designing" }
];

/* Note: This array serves as the districts collection inside the modal based on State selection. */
const INDIA_DATA = {
  "Andhra Pradesh":    ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry","Kadapa","Tirupati","Kakinada","Eluru"],
  "Arunachal Pradesh": ["Itanagar","Naharlagun","Pasighat","Tawang","Ziro","Bomdila","Tezu","Aalo","Namsai","Changlang"],
  "Assam":             ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri","Diphu"],
  "Bihar":             ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Bihar Sharif","Arrah","Begusarai","Katihar"],
  "Chhattisgarh":      ["Raipur","Bhilai","Durg","Bilaspur","Korba","Rajnandgaon","Jagdalpur","Ambikapur","Raigarh","Dhamtari"],
  "Goa":               ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim","Valpoi","Canacona"],
  "Gujarat":           ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Anand","Bharuch"],
  "Haryana":           ["Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula"],
  "Himachal Pradesh":  ["Shimla","Dharamshala","Mandi","Solan","Nahan","Palampur","Baddi","Kullu","Hamirpur","Una"],
  "Jharkhand":         ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Phusro","Hazaribagh","Giridih","Ramgarh","Medininagar"],
  "Karnataka":         ["Bengaluru","Mysuru","Hubballi","Mangaluru","Belagavi","Kalaburagi","Ballari","Vijayapura","Shivamogga","Tumakuru"],
  "Kerala":            ["Thiruvananthapuram","Kochi","Kozhikode","Kollam","Thrissur","Kannur","Palakkad","Malappuram","Kottayam","Alappuzha"],
  "Madhya Pradesh":    ["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa"],
  "Maharashtra":       ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Kolhapur","Amravati","Nanded","Sangli"],
  "Manipur":           ["Imphal","Thoubal","Kakching","Churachandpur","Senapati","Ukhrul","Tamenglong","Bishnupur","Chandel","Jiribam"],
  "Meghalaya":         ["Shillong","Tura","Jowai","Nongstoin","Williamnagar","Baghmara","Cherrapunji","Mawkyrwat","Resubelpara","Ampati"],
  "Mizoram":           ["Aizawl","Lunglei","Saiha","Champhai","Kolasib","Serchhip","Mamit","Lawngtlai","Aibawk","Thenzawl"],
  "Nagaland":          ["Kohima","Dimapur","Mokokchung","Wokha","Zunheboto","Tuensang","Phek","Kiphire","Longleng","Peren"],
  "Odisha":            ["Bhubaneswar","Cuttack","Rourkela","Brahmapur","Sambalpur","Puri","Balasore","Bhadrak","Baripada","Jharsuguda"],
  "Punjab":            ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Pathankot","Hoshiarpur","Batala","Moga"],
  "Rajasthan":         ["Jaipur","Jodhpur","Kota","Bikaner","Ajmer","Udaipur","Bhilwara","Alwar","Bharatpur","Sikar"],
  "Sikkim":            ["Gangtok","Namchi","Mangan","Gyalshing","Rangpo","Jorethang","Nayabazar","Rongli","Singtam","Ravangla"],
  "Tamil Nadu":        ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Tiruppur","Vellore","Erode","Thoothukkudi"],
  "Telangana":         ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Ramagundam","Mahbubnagar","Nalgonda","Adilabad","Suryapet"],
  "Tripura":           ["Agartala","Dharmanagar","Udaipur","Kailasahar","Belonia","Khowai","Ambassa","Sabroom","Sonamura","Kumarghat"],
  "Uttar Pradesh":     ["Lucknow","Kanpur","Ghaziabad","Agra","Varanasi","Meerut","Prayagraj","Bareilly","Aligarh","Moradabad"],
  "Uttarakhand":       ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Kotdwar","Ramnagar","Pithoragarh"],
  "West Bengal":       ["Kolkata","Asansol","Siliguri","Durgapur","Bardhaman","Malda","Baharampur","Habra","Kharagpur","Shantipur"],
  "Delhi":             ["New Delhi","North Delhi","South Delhi","East Delhi","West Delhi","Central Delhi","Dwarka","Rohini","Janakpuri","Saket"],
  "Jammu & Kashmir":   ["Srinagar","Jammu","Anantnag","Baramulla","Sopore","Kathua","Udhampur","Punch","Rajouri","Leh"],
  "Ladakh":            ["Leh","Kargil","Diskit","Padum","Khalsi","Nyoma","Durbuk","Tangtse","Zanskar","Nubra"]
};

let students          = [];
let deleteId          = null;
let isEditMode        = false;
let currentAdminToken = null;
let currentAdminName  = null;

window.addEventListener('DOMContentLoaded', () => {
  checkResetToken();
  populateCourseDropdown();
  populateStateDropdown();
  setMaxDates();

  const storedToken = sessionStorage.getItem('adminToken');
  const storedName  = sessionStorage.getItem('adminName');
  if (storedToken) {
    currentAdminToken = storedToken;
    currentAdminName  = storedName || 'Admin';
    showDashboard();
  }

  document.getElementById("modal").addEventListener("click", function(e) { if (e.target === this) closeModal(); });
  document.getElementById("confirmBox").addEventListener("click", function(e) { if (e.target === this) confirmNo(); });
  document.getElementById("course").addEventListener("change", updateIdPreview);
  document.getElementById("joiningDate").addEventListener("change", updateIdPreview);
});

function authHeaders() {
  const h = { "Content-Type": "application/json" };
  if (currentAdminToken) h["Authorization"] = `Bearer ${currentAdminToken}`;
  return h;
}

function showToast(msg, type = "info") {
  const colours = { success:"#057a55", error:"#e02424", warn:"#c27803", info:"#1a56db" };
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.background = colours[type] || colours.info;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3500);
}

function showPage(id) {
  document.querySelectorAll('.auth-page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}



function checkResetToken() {
  const token = new URLSearchParams(window.location.search).get('reset');
  if (token) { showPage('resetPage'); document.getElementById('resetPage').dataset.token = token; }
}

/* ══════════════════════════════════════════
   AUTH FUNCTIONS
══════════════════════════════════════════ */

function handleLogin() {
  const emailOrUser = document.getElementById('loginEmail').value.trim();
  const password    = document.getElementById('loginPassword').value;
  const errEl       = document.getElementById('loginError');
  errEl.style.display = 'none';

  if (!emailOrUser || !password) {
    errEl.textContent = 'Please enter your email/username and password.';
    errEl.style.display = 'block';
    return;
  }

  fetch(AUTH_API + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: emailOrUser, password })
  })
  .then(r => r.json())
  .then(data => {
    if (data.token) {
      currentAdminToken = data.token;
      currentAdminName  = data.name || emailOrUser.split('@')[0];
      sessionStorage.setItem('adminToken', currentAdminToken);
      sessionStorage.setItem('adminName', currentAdminName);
      showDashboard();
    } else {
      errEl.textContent = data.message || 'Invalid credentials. Please try again.';
      errEl.style.display = 'block';
    }
  })
  .catch(() => {
    errEl.textContent = 'Unable to connect. Please check your internet connection.';
    errEl.style.display = 'block';
  });
}

function handleSignup() {
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm  = document.getElementById('signupConfirm').value;
  const errEl    = document.getElementById('signupError');
  const sucEl    = document.getElementById('signupSuccess');
  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (!name || !email || !username || !password) {
    errEl.textContent = 'All fields are required.';
    errEl.style.display = 'block';
    return;
  }
  if (password.length < 8) {
    errEl.textContent = 'Password must be at least 8 characters.';
    errEl.style.display = 'block';
    return;
  }
  if (password !== confirm) {
    errEl.textContent = 'Passwords do not match.';
    errEl.style.display = 'block';
    return;
  }

  fetch(AUTH_API + '/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, username, password })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      sucEl.textContent = 'Account created! Redirecting to sign in...';
      sucEl.style.display = 'block';
      setTimeout(() => showPage('loginPage'), 2000);
    } else {
      errEl.textContent = data.message || 'Registration failed. Please try again.';
      errEl.style.display = 'block';
    }
  })
  .catch(() => {
    errEl.textContent = 'Unable to connect. Please check your internet connection.';
    errEl.style.display = 'block';
  });
}

function handleForgot() {
  const email  = document.getElementById('forgotEmail').value.trim();
  const errEl  = document.getElementById('forgotError');
  const sucEl  = document.getElementById('forgotSuccess');
  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (!email) {
    errEl.textContent = 'Please enter your registered email address.';
    errEl.style.display = 'block';
    return;
  }

  fetch(AUTH_API + '/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(r => r.json())
  .then(data => {
    // Always show success (backend never reveals if email exists)
    sucEl.textContent = data.message || 'If this email is registered, a reset link has been sent.';
    sucEl.style.display = 'block';
  })
  .catch(() => {
    errEl.textContent = 'Unable to connect. Please check your internet connection.';
    errEl.style.display = 'block';
  });
}

function handleReset() {
  const newPassword = document.getElementById('resetPassword').value;
  const confirm     = document.getElementById('resetConfirm').value;
  const token       = document.getElementById('resetPage').dataset.token;
  const errEl       = document.getElementById('resetError');
  const sucEl       = document.getElementById('resetSuccess');
  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (!newPassword || !confirm) {
    errEl.textContent = 'Please fill in both password fields.';
    errEl.style.display = 'block';
    return;
  }
  if (newPassword.length < 8) {
    errEl.textContent = 'Password must be at least 8 characters.';
    errEl.style.display = 'block';
    return;
  }
  if (newPassword !== confirm) {
    errEl.textContent = 'Passwords do not match.';
    errEl.style.display = 'block';
    return;
  }
  if (!token) {
    errEl.textContent = 'Invalid reset link. Please request a new one.';
    errEl.style.display = 'block';
    return;
  }

  fetch(AUTH_API + '/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password: newPassword })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      sucEl.textContent = 'Password updated successfully! Redirecting to sign in...';
      sucEl.style.display = 'block';
      // Clear token from URL and redirect to login after 2s
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        showPage('loginPage');
      }, 2000);
    } else {
      errEl.textContent = data.message || 'Failed to reset password. The link may have expired.';
      errEl.style.display = 'block';
    }
  })
  .catch(() => {
    errEl.textContent = 'Unable to connect. Please check your internet connection.';
    errEl.style.display = 'block';
  });
}

function handleLogout() {
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminName');
  currentAdminToken = null;
  currentAdminName  = null;
  document.getElementById('dashboardWrapper').style.display = 'none';
  document.getElementById('viewWrapper').style.display = 'none';
  document.getElementById('authWrapper').style.display = 'flex';
  showPage('loginPage');
  showToast("Signed out successfully", "success");
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */

function showDashboard() {
  document.getElementById('authWrapper').style.display = 'none';
  document.getElementById('viewWrapper').style.display = 'none';
  document.getElementById('dashboardWrapper').style.display = 'block';
  document.getElementById('adminNameDisplay').textContent = '👤 ' + (currentAdminName || 'Admin');
  loadStudents();
}

function loadStudents() {
  fetch(API, { headers: authHeaders() })
    .then(res => {
      if (res.status === 401) { showToast("Session expired. Please sign in again.", "warn"); handleLogout(); return Promise.reject("Unauthorized"); }
      return res.json();
    })
    .then(data => { students = Array.isArray(data) ? data : []; displayStudents(students); })
    .catch(err => { if (err !== "Unauthorized") { students = []; displayStudents([]); } });
}

function displayStudents(data) {
  const body  = document.getElementById("tableBody");
  const empty = document.getElementById("emptyState");
  body.innerHTML = "";
  updateToolbarButtons();

  if (!data || data.length === 0) { empty.style.display = "block"; return; }
  empty.style.display = "none";

  data.forEach(s => {
    const row = document.createElement("tr");
    row.dataset.id = s.studentId;
    row.innerHTML = `
      <td><input type="checkbox" class="row-check" onchange="onRowCheckChange(this, event)" /></td>
      <td>${escHtml(s.studentId)}</td>
      <td>${escHtml(s.name)}</td>
      <td><span class="course-badge" title="${escHtml(s.course)}">${escHtml(s.course)}</span></td>
      <td>${escHtml(s.email || "—")}</td>
      <td>${escHtml(s.contact || "—")}</td>
      <td>${escHtml(s.joiningDate || "—")}</td>`;

    row.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT' && !e.target.closest('.row-check')) {
        openView(s.studentId);
      }
    });

    body.appendChild(row);
  });
}

function openView(id) {
  const s = students.find(x => x.studentId === id);
  if (!s) return;

  document.getElementById('viewStudentId').textContent = s.studentId;
  document.getElementById('viewName').textContent      = s.name || "—";
  document.getElementById('viewCourse').textContent    = s.course || "—";
  document.getElementById('viewEmail').textContent     = s.email || "—";
  document.getElementById('viewContact').textContent   = s.contact || "—";
  document.getElementById('viewDob').textContent       = s.dob || "—";
  document.getElementById('viewRegDate').textContent   = s.joiningDate || "—";
  document.getElementById('viewLocation').textContent  = `${s.city || "—"}, ${s.state || "—"}`;
  document.getElementById('viewAddress').textContent   = s.address || "—";

  document.getElementById('dashboardWrapper').style.display = 'none';
  document.getElementById('viewWrapper').style.display = 'block';
}

function closeView() {
  document.getElementById('viewWrapper').style.display = 'none';
  document.getElementById('dashboardWrapper').style.display = 'block';
}

function onRowCheckChange(checkbox, event) {
  if (event) event.stopPropagation();
  if (checkbox.checked) {
    document.querySelectorAll('.row-check').forEach(cb => {
      if (cb !== checkbox) { cb.checked = false; cb.closest('tr').classList.remove('selected'); }
    });
    checkbox.closest('tr').classList.add('selected');
  } else { checkbox.closest('tr').classList.remove('selected'); }
  document.getElementById('selectAll').checked = false;
  updateToolbarButtons();
}

function toggleSelectAll(masterCb) {
  document.querySelectorAll('.row-check').forEach(cb => { cb.checked = masterCb.checked; cb.closest('tr').classList.toggle('selected', masterCb.checked); });
  updateToolbarButtons();
}

function updateToolbarButtons() {
  const checkedCount = document.querySelectorAll('.row-check:checked').length;
  document.getElementById('btnEditMain').disabled = (checkedCount !== 1);
  document.getElementById('btnDelMain').disabled  = (checkedCount === 0);
}

function editSelectedRow() {
  const checked = document.querySelector('.row-check:checked');
  if (!checked) return;
  editStudent(checked.closest('tr').dataset.id);
}

function deleteSelectedRow() {
  const checkedAll = [...document.querySelectorAll('.row-check:checked')];
  if (checkedAll.length === 0) return;

  if (checkedAll.length === 1) {
    askDelete(checkedAll[0].closest('tr').dataset.id);
  } else {
    const ids = checkedAll.map(c => c.closest('tr').dataset.id);
    deleteId = ids;
    document.getElementById("confirmText").innerText = `Delete ${ids.length} selected students? This cannot be undone.`;
    document.getElementById("confirmBox").style.display = "flex";
  }
}

function openModal(editMode = false) {
  isEditMode = editMode;
  document.getElementById("modalTitle").innerText    = editMode ? "Edit Student" : "Add Student";
  document.getElementById("modalSubtitle").innerText = editMode ? "Update the student's information below" : "Fill in the student's details below";

  if (!editMode) document.getElementById("idPreviewWrap").style.display = "none";
  setMaxDates();
  document.getElementById("modal").style.display = "flex";
}

function closeModal() { document.getElementById("modal").style.display = "none"; clearForm(); }

function generateStudentId(courseName, regDate) {
  const course = COURSES.find(c => c.name === courseName);
  if (!course || !regDate) return null;
  const d = new Date(regDate);
  return `${course.code}${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getFullYear()).slice(-2)}`;
}

function updateIdPreview() {
  const courseName = document.getElementById("course").value;
  const regDate    = document.getElementById("joiningDate").value;
  const wrap       = document.getElementById("idPreviewWrap");
  const val        = document.getElementById("idPreviewVal");

  if (isEditMode) {
    const existingId = document.getElementById("studentId").value;
    if (existingId) { val.textContent = existingId; wrap.style.display = "flex"; }
    return;
  }
  const id = generateStudentId(courseName, regDate);
  if (id) { val.textContent = id; wrap.style.display = "flex"; } else { wrap.style.display = "none"; }
}

function saveStudent() {
  const payload = getFormData();

  if (!payload.name || !payload.course || !payload.joiningDate || !payload.dob || !payload.email || !payload.contact || !payload.state || !payload.city || !payload.address) {
    showToast("Please fill in the required fields", "error");
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(payload.email)) {
    showToast("Please enter a valid email address such as @gmail.com, @outlook.com, etc.", "error");
    return;
  }

  const contactRegex = /^\+91\d{10}$/;
  if (!contactRegex.test(payload.contact)) {
    showToast("Contact no. should be only 10 numbers with +91 country code of India.", "error");
    return;
  }

  isEditMode ? updateStudent(payload) : addStudent(payload);
}

function addStudent(payload) {
  payload.studentId = generateStudentId(payload.course, payload.joiningDate);
  if (!payload.studentId) { showToast("Could not generate ID. Check course and date.", "error"); return; }

  fetch(API, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) })
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(({ status, data }) => {
    if (status === 401) { handleLogout(); return; }
    if (status >= 400) { showToast("Error: Failed to add student", "error"); return; }
    showToast(`Student added! ID: ${payload.studentId}`, "success");
    closeModal(); loadStudents();
  }).catch(() => showToast("Network error", "error"));
}

function editStudent(id) {
  const s = students.find(x => x.studentId === id);
  if (!s) return;

  document.getElementById("studentId").value   = s.studentId;
  document.getElementById("name").value        = s.name || "";
  document.getElementById("dob").value         = s.dob || "";
  document.getElementById("course").value      = s.course || "";
  document.getElementById("email").value       = s.email || "";
  document.getElementById("contact").value     = s.contact || "";
  document.getElementById("joiningDate").value = s.joiningDate || "";
  document.getElementById("address").value     = s.address || "";

  if (s.state) {
    document.getElementById("stateSelect").value = s.state;
    populateCities();
    if (s.city) document.getElementById("citySelect").value = s.city;
  }
  document.getElementById("idPreviewVal").textContent = s.studentId;
  document.getElementById("idPreviewWrap").style.display = "flex";
  openModal(true);
}

function updateStudent(payload) {
  payload.studentId = document.getElementById("studentId").value;
  fetch(API, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) })
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(({ status, data }) => {
    if (status === 401) { handleLogout(); return; }
    if (status >= 400) { showToast("Error: Failed to update student", "error"); return; }
    showToast("Student updated successfully!", "success");
    closeModal(); loadStudents();
  }).catch(() => showToast("Network error", "error"));
}

function askDelete(id) {
  const s = students.find(x => x.studentId === id);
  deleteId = id;
  document.getElementById("confirmText").innerText = s ? `Are you sure you want to delete "${s.name}" (${s.studentId})?` : "Delete this student permanently?";
  document.getElementById("confirmBox").style.display = "flex";
}

function confirmYes() {
  const ids = Array.isArray(deleteId) ? deleteId : [deleteId];
  const promises = ids.map(id => fetch(API, { method: "DELETE", headers: authHeaders(), body: JSON.stringify({ studentId: id }) }));
  Promise.all(promises).then(() => {
    showToast(ids.length > 1 ? `${ids.length} students deleted` : "Student deleted", "info");
    document.getElementById("confirmBox").style.display = "none";
    loadStudents();
  }).catch(() => showToast("Failed to delete student(s)", "error"));
}

function confirmNo() { document.getElementById("confirmBox").style.display = "none"; }

function searchStudent() {
  const text = document.getElementById("search").value.toLowerCase();
  const filtered = students.filter(s => Object.values(s).join(" ").toLowerCase().includes(text));
  displayStudents(filtered);
}

function populateCourseDropdown() {
  const sel = document.getElementById("course");
  COURSES.forEach(c => { const opt = document.createElement("option"); opt.value = c.name; opt.textContent = c.name; sel.appendChild(opt); });
}

function populateStateDropdown() {
  const sel = document.getElementById("stateSelect");
  Object.keys(INDIA_DATA).sort().forEach(state => { const opt = document.createElement("option"); opt.value = state; opt.textContent = state; sel.appendChild(opt); });
}

function populateCities() {
  const state  = document.getElementById("stateSelect").value;
  const cityEl = document.getElementById("citySelect");
  cityEl.innerHTML = '<option value="" disabled selected>Select City</option>';
  if (state && INDIA_DATA[state]) {
    [...INDIA_DATA[state]].sort().forEach(city => { const opt = document.createElement("option"); opt.value = city; opt.textContent = city; cityEl.appendChild(opt); });
  }
}

function setMaxDates() {
  const today = new Date().toISOString().split('T')[0];
  const dobEl = document.getElementById('dob'), regEl = document.getElementById('joiningDate');
  if (dobEl) dobEl.max = today; if (regEl) regEl.max = today;
}

function getFormData() {
  return {
    name:        document.getElementById("name").value.trim(),
    dob:         document.getElementById("dob").value,
    course:      document.getElementById("course").value,
    email:       document.getElementById("email").value.trim(),
    contact:     document.getElementById("contact").value.trim(),
    state:       document.getElementById("stateSelect").value,
    city:        document.getElementById("citySelect").value,
    joiningDate: document.getElementById("joiningDate").value,
    address:     document.getElementById("address").value.trim()
  };
}

function clearForm() {
  ["studentId","name","dob","email","contact","joiningDate","address"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  document.getElementById("course").selectedIndex = 0;
  document.getElementById("stateSelect").selectedIndex = 0;
  document.getElementById("citySelect").innerHTML = '<option value="" disabled selected>Select City</option>';
  document.getElementById("idPreviewWrap").style.display = "none";
  isEditMode = false;
}

function escHtml(str) { return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function escAttr(str) { return String(str).replace(/'/g, "\\'"); }