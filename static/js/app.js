/**
 * SafeViewShield Frontend Application
 * jQuery-based client for FastAPI backend
 */

class SafeViewShieldApp {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('access_token');
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        
        // Check if user is logged in
        if (this.token) {
            this.loadDashboard();
            this.showUserInterface();
        }
    }

    setupEventListeners() {
        // Authentication
        $('#loginBtn').on('click', () => this.showModal('loginModal'));
        $('#signupBtn').on('click', () => this.showModal('signupModal'));
        $('#getStartedBtn').on('click', () => this.showModal('signupModal'));
        $('#logoutBtn').on('click', () => this.logout());

        // Forms
        $('#loginForm').on('submit', (e) => this.handleLogin(e));
        $('#signupForm').on('submit', (e) => this.handleSignup(e));
        $('#addDeviceForm').on('submit', (e) => this.handleAddDevice(e));

        // Device management
        $('#addDeviceBtn').on('click', () => this.showModal('addDeviceModal'));

        // Plan selection
        $('[data-testid^="button-choose-"]').on('click', (e) => this.handlePlanSelection(e));

        // Navigation
        $('a[href^="#"]').on('click', (e) => this.handleNavigation(e));
    }

    setupNavigation() {
        // Smooth scrolling for anchor links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 800);
            }
        });

        // Update active navigation
        $(window).on('scroll', this.updateActiveNav);
    }

    updateActiveNav() {
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        $('section[id]').each(function() {
            const section = $(this);
            const sectionTop = section.offset().top - 100;
            const sectionHeight = section.outerHeight();
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                const id = section.attr('id');
                $('.navbar-nav a').removeClass('active');
                $(`.navbar-nav a[href="#${id}"]`).addClass('active');
            }
        });
    }

    async apiRequest(endpoint, options = {}) {
        const url = `${this.apiBase}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            this.showAlert('error', error.message);
            throw error;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = $(e.target);
        const submitBtn = form.find('button[type="submit"]');
        
        this.setLoading(submitBtn, true);

        try {
            const credentials = {
                email: $('#loginEmail').val(),
                password: $('#loginPassword').val()
            };

            const response = await this.apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            this.token = response.access_token;
            this.currentUser = response.user;
            localStorage.setItem('access_token', this.token);

            this.hideModal('loginModal');
            this.showUserInterface();
            this.loadDashboard();
            this.showAlert('success', 'Login successful!');

        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const form = $(e.target);
        const submitBtn = form.find('button[type="submit"]');
        
        this.setLoading(submitBtn, true);

        try {
            const userData = {
                email: $('#signupEmail').val(),
                password: $('#signupPassword').val(),
                subscription_tier: $('#subscriptionTier').val()
            };

            const response = await this.apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            this.token = response.access_token;
            this.currentUser = response.user;
            localStorage.setItem('access_token', this.token);

            this.hideModal('signupModal');
            this.showUserInterface();
            this.loadDashboard();
            this.showAlert('success', 'Account created successfully!');

        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    async handleAddDevice(e) {
        e.preventDefault();
        const form = $(e.target);
        const submitBtn = form.find('button[type="submit"]');
        
        this.setLoading(submitBtn, true);

        try {
            const deviceData = {
                name: $('#deviceName').val(),
                device_type: $('#deviceType').val(),
                protection_enabled: $('#protectionEnabled').is(':checked')
            };

            await this.apiRequest('/devices', {
                method: 'POST',
                body: JSON.stringify(deviceData)
            });

            this.hideModal('addDeviceModal');
            form[0].reset();
            this.loadDevices();
            this.loadDashboard();
            this.showAlert('success', 'Device added successfully!');

        } catch (error) {
            console.error('Add device failed:', error);
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    async loadDashboard() {
        try {
            const data = await this.apiRequest('/dashboard');
            
            // Update dashboard stats
            $('#totalDevices').text(data.total_devices);
            $('#protectedDevices').text(data.protected_devices);
            $('#threatsBlocked').text(data.threats_blocked_today);
            $('#subscriptionTier').text(this.formatTierName(data.subscription_tier));

            // Load recent threats
            this.displayRecentThreats(data.recent_threats);
            
            // Load devices
            this.displayDevices(data.recent_devices);

            // Show dashboard section
            this.showSection('dashboard');

        } catch (error) {
            console.error('Failed to load dashboard:', error);
        }
    }

    async loadDevices() {
        try {
            const devices = await this.apiRequest('/devices');
            this.displayDevices(devices);
        } catch (error) {
            console.error('Failed to load devices:', error);
        }
    }

    displayDevices(devices) {
        const container = $('#deviceList');
        
        if (!devices || devices.length === 0) {
            container.html('<p class="text-muted">No devices found. Add your first device!</p>');
            return;
        }

        const html = devices.map(device => `
            <div class="device-item" data-testid="device-item-${device.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="d-flex align-items-center">
                            <span class="device-status ${device.protection_enabled ? 'protected' : 'unprotected'}"></span>
                            <strong data-testid="text-device-name-${device.id}">${device.name}</strong>
                        </div>
                        <small class="text-muted" data-testid="text-device-type-${device.id}">
                            ${this.formatDeviceType(device.device_type)}
                        </small>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" 
                               ${device.protection_enabled ? 'checked' : ''} 
                               onchange="app.toggleDeviceProtection(${device.id})"
                               data-testid="switch-protection-${device.id}">
                    </div>
                </div>
            </div>
        `).join('');

        container.html(html);
    }

    displayRecentThreats(threats) {
        const container = $('#recentThreats');
        
        if (!threats || threats.length === 0) {
            container.html('<p class="text-muted">No recent threats detected. Your content is safe!</p>');
            return;
        }

        const html = threats.map(threat => `
            <div class="threat-item ${threat.risk_level}" data-testid="threat-item-${threat.id}">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <span class="badge risk-badge bg-${this.getRiskColor(threat.risk_level)} me-2" 
                                  data-testid="badge-risk-${threat.id}">
                                ${threat.risk_level.toUpperCase()}
                            </span>
                            <small class="text-muted" data-testid="text-threat-time-${threat.id}">
                                ${this.formatDate(threat.analyzed_at)}
                            </small>
                        </div>
                        <div class="mb-1">
                            <strong data-testid="text-threat-type-${threat.id}">
                                ${this.formatContentType(threat.content_type)}
                            </strong>
                        </div>
                        <small class="text-muted" data-testid="text-threat-url-${threat.id}">
                            ${this.truncateUrl(threat.content_url)}
                        </small>
                        ${threat.threat_types && threat.threat_types.length > 0 ? `
                            <div class="mt-2">
                                ${threat.threat_types.map(type => 
                                    `<span class="badge bg-secondary me-1" data-testid="badge-threat-type-${type}">${type}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="text-end">
                        <div class="badge ${threat.is_blocked ? 'bg-danger' : 'bg-success'}" 
                             data-testid="badge-blocked-status-${threat.id}">
                            ${threat.is_blocked ? 'Blocked' : 'Allowed'}
                        </div>
                        <div class="small text-muted mt-1" data-testid="text-confidence-${threat.id}">
                            ${Math.round(threat.confidence_score * 100)}% confidence
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.html(html);
    }

    async toggleDeviceProtection(deviceId) {
        try {
            const response = await this.apiRequest(`/devices/${deviceId}/protection`, {
                method: 'PUT'
            });

            this.showAlert('success', 
                `Device protection ${response.protection_enabled ? 'enabled' : 'disabled'}`);
            
            // Refresh dashboard data
            this.loadDashboard();

        } catch (error) {
            console.error('Failed to toggle device protection:', error);
            // Revert the switch state
            const switchElement = $(`[data-testid="switch-protection-${deviceId}"]`);
            switchElement.prop('checked', !switchElement.prop('checked'));
        }
    }

    handlePlanSelection(e) {
        const button = $(e.target);
        const planType = button.attr('data-testid').replace('button-choose-', '');
        
        // Set the plan in signup form
        $('#subscriptionTier').val(planType);
        
        // Show signup modal
        this.showModal('signupModal');
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = $(e.target).attr('href');
        
        if (target === '#dashboard') {
            if (!this.token) {
                this.showModal('loginModal');
                return;
            }
            this.showSection('dashboard');
        } else {
            this.showSection(target.replace('#', ''));
        }
    }

    showSection(sectionId) {
        // Hide all sections except navigation
        $('section').addClass('d-none');
        
        // Show target section
        $(`#${sectionId}`).removeClass('d-none');
        
        // Update navigation
        $('.navbar-nav a').removeClass('active');
        $(`.navbar-nav a[href="#${sectionId}"]`).addClass('active');
    }

    showUserInterface() {
        $('#loginBtn, #signupBtn').addClass('d-none');
        $('#userMenu').removeClass('d-none');
        $('#userEmail').text(this.currentUser?.email || 'User');
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('access_token');
        
        $('#userMenu').addClass('d-none');
        $('#loginBtn, #signupBtn').removeClass('d-none');
        
        this.showSection('home');
        this.showAlert('info', 'Logged out successfully');
    }

    showModal(modalId) {
        $(`#${modalId}`).modal('show');
    }

    hideModal(modalId) {
        $(`#${modalId}`).modal('hide');
    }

    setLoading(element, isLoading) {
        if (isLoading) {
            element.prop('disabled', true).addClass('loading');
            element.data('original-text', element.text());
            element.text('Loading...');
        } else {
            element.prop('disabled', false).removeClass('loading');
            element.text(element.data('original-text') || 'Submit');
        }
    }

    showAlert(type, message) {
        // Create alert element
        const alertHtml = `
            <div class="alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed" 
                 style="top: 80px; right: 20px; z-index: 9999; min-width: 300px;" 
                 data-testid="alert-${type}">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $('body').append(alertHtml);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            $('.alert').fadeOut(() => $('.alert').remove());
        }, 5000);
    }

    // Utility functions
    formatTierName(tier) {
        const names = {
            'family': 'Family',
            'school_basic': 'School Basic',
            'school_enterprise': 'School Enterprise'
        };
        return names[tier] || tier;
    }

    formatDeviceType(type) {
        const types = {
            'mobile': 'Mobile Phone',
            'tablet': 'Tablet',
            'desktop': 'Desktop/Laptop',
            'smart_tv': 'Smart TV'
        };
        return types[type] || type;
    }

    formatContentType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1) + ' Content';
    }

    getRiskColor(risk) {
        const colors = {
            'safe': 'success',
            'medium': 'warning',
            'high': 'danger'
        };
        return colors[risk] || 'secondary';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }

    truncateUrl(url, maxLength = 50) {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength - 3) + '...';
    }
}

// Initialize app when DOM is ready
$(document).ready(() => {
    window.app = new SafeViewShieldApp();
});