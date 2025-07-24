// Medical Health Care Management System
class MedicalApp {
    constructor() {
        this.patients = JSON.parse(localStorage.getItem('patients')) || [];
        this.doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.currentEditingId = null;
        this.currentSection = 'dashboard';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.updateDashboard();
        this.renderPatients();
        this.renderDoctors();
        this.renderAppointments();
        this.updateAppointmentSelects();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Modal controls
        document.querySelectorAll('.close').forEach(close => {
            close.addEventListener('click', () => this.closeModals());
        });

        // Patient management
        document.getElementById('add-patient-btn').addEventListener('click', () => {
            this.openPatientModal();
        });
        document.getElementById('patient-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePatient();
        });
        document.getElementById('cancel-patient').addEventListener('click', () => {
            this.closeModals();
        });

        // Doctor management
        document.getElementById('add-doctor-btn').addEventListener('click', () => {
            this.openDoctorModal();
        });
        document.getElementById('doctor-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDoctor();
        });
        document.getElementById('cancel-doctor').addEventListener('click', () => {
            this.closeModals();
        });

        // Appointment management
        document.getElementById('add-appointment-btn').addEventListener('click', () => {
            this.openAppointmentModal();
        });
        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAppointment();
        });
        document.getElementById('cancel-appointment').addEventListener('click', () => {
            this.closeModals();
        });

        // Search functionality
        document.getElementById('search-patients').addEventListener('input', (e) => {
            this.searchPatients(e.target.value);
        });

        // Appointment filter
        document.getElementById('appointment-filter').addEventListener('change', (e) => {
            this.filterAppointments(e.target.value);
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    loadSampleData() {
        if (this.doctors.length === 0) {
            this.doctors = [
                {
                    id: 1,
                    name: 'Dr. Sarah Johnson',
                    specialty: 'Cardiology',
                    phone: '+1 (555) 123-4567',
                    email: 'sarah.johnson@hospital.com',
                    experience: 12
                },
                {
                    id: 2,
                    name: 'Dr. Michael Chen',
                    specialty: 'Pediatrics',
                    phone: '+1 (555) 234-5678',
                    email: 'michael.chen@hospital.com',
                    experience: 8
                },
                {
                    id: 3,
                    name: 'Dr. Emily Rodriguez',
                    specialty: 'Dermatology',
                    phone: '+1 (555) 345-6789',
                    email: 'emily.rodriguez@hospital.com',
                    experience: 15
                }
            ];
            this.saveToStorage();
        }

        if (this.patients.length === 0) {
            this.patients = [
                {
                    id: 1,
                    name: 'John Smith',
                    age: 45,
                    phone: '+1 (555) 987-6543',
                    email: 'john.smith@email.com',
                    address: '123 Main St, City, State 12345',
                    lastVisit: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Maria Garcia',
                    age: 32,
                    phone: '+1 (555) 876-5432',
                    email: 'maria.garcia@email.com',
                    address: '456 Oak Ave, City, State 12345',
                    lastVisit: '2024-01-20'
                }
            ];
            this.saveToStorage();
        }

        if (this.appointments.length === 0) {
            const today = new Date().toISOString().split('T')[0];
            this.appointments = [
                {
                    id: 1,
                    patientId: 1,
                    doctorId: 1,
                    date: today,
                    time: '09:00',
                    status: 'scheduled',
                    notes: 'Regular checkup'
                },
                {
                    id: 2,
                    patientId: 2,
                    doctorId: 2,
                    date: today,
                    time: '14:30',
                    status: 'completed',
                    notes: 'Follow-up visit'
                }
            ];
            this.saveToStorage();
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        this.currentSection = sectionName;

        // Update data when switching sections
        if (sectionName === 'dashboard') {
            this.updateDashboard();
        }
    }

    updateDashboard() {
        const totalPatients = this.patients.length;
        const totalDoctors = this.doctors.length;
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = this.appointments.filter(apt => apt.date === today).length;
        const pendingAppointments = this.appointments.filter(apt => apt.status === 'scheduled').length;

        document.getElementById('total-patients').textContent = totalPatients;
        document.getElementById('total-doctors').textContent = totalDoctors;
        document.getElementById('total-appointments').textContent = todayAppointments;
        document.getElementById('pending-appointments').textContent = pendingAppointments;

        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const activities = [];
        
        // Recent appointments
        const recentAppointments = this.appointments
            .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`))
            .slice(0, 5);

        recentAppointments.forEach(apt => {
            const patient = this.patients.find(p => p.id === apt.patientId);
            const doctor = this.doctors.find(d => d.id === apt.doctorId);
            if (patient && doctor) {
                activities.push({
                    type: 'appointment',
                    message: `Appointment scheduled: ${patient.name} with ${doctor.name}`,
                    time: `${apt.date} at ${apt.time}`
                });
            }
        });

        const activityList = document.getElementById('activity-list');
        if (activities.length === 0) {
            activityList.innerHTML = '<p>No recent activity</p>';
        } else {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <p><strong>${activity.message}</strong></p>
                    <small>${activity.time}</small>
                </div>
            `).join('');
        }
    }

    // Patient Management
    renderPatients() {
        const tbody = document.getElementById('patients-tbody');
        tbody.innerHTML = this.patients.map(patient => `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.phone}</td>
                <td>${patient.email}</td>
                <td>${patient.lastVisit || 'Never'}</td>
                <td>
                    <button class="btn btn-secondary" onclick="app.editPatient(${patient.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="app.deletePatient(${patient.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    openPatientModal(patient = null) {
        this.currentEditingId = patient ? patient.id : null;
        const modal = document.getElementById('patient-modal');
        const title = document.getElementById('patient-modal-title');
        
        title.textContent = patient ? 'Edit Patient' : 'Add Patient';
        
        if (patient) {
            document.getElementById('patient-name').value = patient.name;
            document.getElementById('patient-age').value = patient.age;
            document.getElementById('patient-phone').value = patient.phone;
            document.getElementById('patient-email').value = patient.email;
            document.getElementById('patient-address').value = patient.address || '';
        } else {
            document.getElementById('patient-form').reset();
        }
        
        modal.classList.add('active');
    }

    savePatient() {
        const name = document.getElementById('patient-name').value;
        const age = parseInt(document.getElementById('patient-age').value);
        const phone = document.getElementById('patient-phone').value;
        const email = document.getElementById('patient-email').value;
        const address = document.getElementById('patient-address').value;

        const patientData = { name, age, phone, email, address };

        if (this.currentEditingId) {
            // Edit existing patient
            const index = this.patients.findIndex(p => p.id === this.currentEditingId);
            this.patients[index] = { ...this.patients[index], ...patientData };
        } else {
            // Add new patient
            const newId = Math.max(...this.patients.map(p => p.id), 0) + 1;
            this.patients.push({
                id: newId,
                ...patientData,
                lastVisit: null
            });
        }

        this.saveToStorage();
        this.renderPatients();
        this.updateAppointmentSelects();
        this.updateDashboard();
        this.closeModals();
    }

    editPatient(id) {
        const patient = this.patients.find(p => p.id === id);
        this.openPatientModal(patient);
    }

    deletePatient(id) {
        if (confirm('Are you sure you want to delete this patient?')) {
            this.patients = this.patients.filter(p => p.id !== id);
            this.saveToStorage();
            this.renderPatients();
            this.updateDashboard();
        }
    }

    searchPatients(query) {
        const tbody = document.getElementById('patients-tbody');
        const filteredPatients = this.patients.filter(patient => 
            patient.name.toLowerCase().includes(query.toLowerCase()) ||
            patient.email.toLowerCase().includes(query.toLowerCase()) ||
            patient.phone.includes(query)
        );

        tbody.innerHTML = filteredPatients.map(patient => `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.phone}</td>
                <td>${patient.email}</td>
                <td>${patient.lastVisit || 'Never'}</td>
                <td>
                    <button class="btn btn-secondary" onclick="app.editPatient(${patient.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="app.deletePatient(${patient.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Doctor Management
    renderDoctors() {
        const grid = document.getElementById('doctors-grid');
        grid.innerHTML = this.doctors.map(doctor => `
            <div class="doctor-card">
                <div class="doctor-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <h3>${doctor.name}</h3>
                <div class="doctor-specialty">${doctor.specialty}</div>
                <div class="doctor-info">
                    <p><i class="fas fa-phone"></i> ${doctor.phone}</p>
                    <p><i class="fas fa-envelope"></i> ${doctor.email}</p>
                    <p><i class="fas fa-clock"></i> ${doctor.experience} years experience</p>
                </div>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
                    <button class="btn btn-secondary" onclick="app.editDoctor(${doctor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteDoctor(${doctor.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    openDoctorModal(doctor = null) {
        this.currentEditingId = doctor ? doctor.id : null;
        const modal = document.getElementById('doctor-modal');
        const title = document.getElementById('doctor-modal-title');
        
        title.textContent = doctor ? 'Edit Doctor' : 'Add Doctor';
        
        if (doctor) {
            document.getElementById('doctor-name').value = doctor.name;
            document.getElementById('doctor-specialty').value = doctor.specialty;
            document.getElementById('doctor-phone').value = doctor.phone;
            document.getElementById('doctor-email').value = doctor.email;
            document.getElementById('doctor-experience').value = doctor.experience;
        } else {
            document.getElementById('doctor-form').reset();
        }
        
        modal.classList.add('active');
    }

    saveDoctor() {
        const name = document.getElementById('doctor-name').value;
        const specialty = document.getElementById('doctor-specialty').value;
        const phone = document.getElementById('doctor-phone').value;
        const email = document.getElementById('doctor-email').value;
        const experience = parseInt(document.getElementById('doctor-experience').value);

        const doctorData = { name, specialty, phone, email, experience };

        if (this.currentEditingId) {
            // Edit existing doctor
            const index = this.doctors.findIndex(d => d.id === this.currentEditingId);
            this.doctors[index] = { ...this.doctors[index], ...doctorData };
        } else {
            // Add new doctor
            const newId = Math.max(...this.doctors.map(d => d.id), 0) + 1;
            this.doctors.push({ id: newId, ...doctorData });
        }

        this.saveToStorage();
        this.renderDoctors();
        this.updateAppointmentSelects();
        this.updateDashboard();
        this.closeModals();
    }

    editDoctor(id) {
        const doctor = this.doctors.find(d => d.id === id);
        this.openDoctorModal(doctor);
    }

    deleteDoctor(id) {
        if (confirm('Are you sure you want to delete this doctor?')) {
            this.doctors = this.doctors.filter(d => d.id !== id);
            this.saveToStorage();
            this.renderDoctors();
            this.updateDashboard();
        }
    }

    // Appointment Management
    renderAppointments() {
        const tbody = document.getElementById('appointments-tbody');
        tbody.innerHTML = this.appointments.map(appointment => {
            const patient = this.patients.find(p => p.id === appointment.patientId);
            const doctor = this.doctors.find(d => d.id === appointment.doctorId);
            
            return `
                <tr>
                    <td>${appointment.id}</td>
                    <td>${patient ? patient.name : 'Unknown Patient'}</td>
                    <td>${doctor ? doctor.name : 'Unknown Doctor'}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
                    <td>
                        <button class="btn btn-secondary" onclick="app.editAppointment(${appointment.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="app.deleteAppointment(${appointment.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                        ${appointment.status === 'scheduled' ? 
                            `<button class="btn btn-success" onclick="app.completeAppointment(${appointment.id})">
                                <i class="fas fa-check"></i>
                            </button>` : ''
                        }
                    </td>
                </tr>
            `;
        }).join('');
    }

    openAppointmentModal(appointment = null) {
        this.currentEditingId = appointment ? appointment.id : null;
        const modal = document.getElementById('appointment-modal');
        const title = document.getElementById('appointment-modal-title');
        
        title.textContent = appointment ? 'Edit Appointment' : 'Schedule Appointment';
        
        if (appointment) {
            document.getElementById('appointment-patient').value = appointment.patientId;
            document.getElementById('appointment-doctor').value = appointment.doctorId;
            document.getElementById('appointment-date').value = appointment.date;
            document.getElementById('appointment-time').value = appointment.time;
            document.getElementById('appointment-notes').value = appointment.notes || '';
        } else {
            document.getElementById('appointment-form').reset();
            // Set default date to today
            document.getElementById('appointment-date').value = new Date().toISOString().split('T')[0];
        }
        
        modal.classList.add('active');
    }

    saveAppointment() {
        const patientId = parseInt(document.getElementById('appointment-patient').value);
        const doctorId = parseInt(document.getElementById('appointment-doctor').value);
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        const notes = document.getElementById('appointment-notes').value;

        const appointmentData = { patientId, doctorId, date, time, notes, status: 'scheduled' };

        if (this.currentEditingId) {
            // Edit existing appointment
            const index = this.appointments.findIndex(a => a.id === this.currentEditingId);
            this.appointments[index] = { ...this.appointments[index], ...appointmentData };
        } else {
            // Add new appointment
            const newId = Math.max(...this.appointments.map(a => a.id), 0) + 1;
            this.appointments.push({ id: newId, ...appointmentData });
        }

        this.saveToStorage();
        this.renderAppointments();
        this.updateDashboard();
        this.closeModals();
    }

    editAppointment(id) {
        const appointment = this.appointments.find(a => a.id === id);
        this.openAppointmentModal(appointment);
    }

    deleteAppointment(id) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            this.appointments = this.appointments.filter(a => a.id !== id);
            this.saveToStorage();
            this.renderAppointments();
            this.updateDashboard();
        }
    }

    completeAppointment(id) {
        const index = this.appointments.findIndex(a => a.id === id);
        this.appointments[index].status = 'completed';
        this.saveToStorage();
        this.renderAppointments();
        this.updateDashboard();
    }

    filterAppointments(filter) {
        const tbody = document.getElementById('appointments-tbody');
        let filteredAppointments = [...this.appointments];

        if (filter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            filteredAppointments = this.appointments.filter(apt => apt.date === today);
        } else if (filter === 'upcoming') {
            const today = new Date().toISOString().split('T')[0];
            filteredAppointments = this.appointments.filter(apt => apt.date >= today && apt.status === 'scheduled');
        } else if (filter !== 'all') {
            filteredAppointments = this.appointments.filter(apt => apt.status === filter);
        }

        tbody.innerHTML = filteredAppointments.map(appointment => {
            const patient = this.patients.find(p => p.id === appointment.patientId);
            const doctor = this.doctors.find(d => d.id === appointment.doctorId);
            
            return `
                <tr>
                    <td>${appointment.id}</td>
                    <td>${patient ? patient.name : 'Unknown Patient'}</td>
                    <td>${doctor ? doctor.name : 'Unknown Doctor'}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
                    <td>
                        <button class="btn btn-secondary" onclick="app.editAppointment(${appointment.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="app.deleteAppointment(${appointment.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                        ${appointment.status === 'scheduled' ? 
                            `<button class="btn btn-success" onclick="app.completeAppointment(${appointment.id})">
                                <i class="fas fa-check"></i>
                            </button>` : ''
                        }
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateAppointmentSelects() {
        const patientSelect = document.getElementById('appointment-patient');
        const doctorSelect = document.getElementById('appointment-doctor');

        // Update patient options
        patientSelect.innerHTML = '<option value="">Select Patient</option>' +
            this.patients.map(patient => 
                `<option value="${patient.id}">${patient.name}</option>`
            ).join('');

        // Update doctor options
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>' +
            this.doctors.map(doctor => 
                `<option value="${doctor.id}">${doctor.name} - ${doctor.specialty}</option>`
            ).join('');
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.currentEditingId = null;
    }

    saveToStorage() {
        localStorage.setItem('patients', JSON.stringify(this.patients));
        localStorage.setItem('doctors', JSON.stringify(this.doctors));
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
    }
}

// Initialize the application
const app = new MedicalApp();