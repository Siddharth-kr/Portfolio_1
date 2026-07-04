/**
 * Three.js Signature Glass Sphere & Interactive Engine
 * Personal Developer Portfolio — Siddharth Kumar
 */

document.addEventListener('DOMContentLoaded', () => {
    initSignatureSphereScene();
    initNavbarScroll();
    initMagneticButtons();
    initScrollReveals();
});

/* ==========================================================================
   1. SIGNATURE 3D GLASS SPHERE & MERN TECH SCENE
   ========================================================================== */
function initSignatureSphereScene() {
    const container = document.getElementById('hero-sphere-canvas');
    if (!container || typeof THREE === 'undefined') return;

    // Setup Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x06B6D4, 3.0); // Cyan Right Light
    cyanLight.position.set(8, 10, 8);
    scene.add(cyanLight);

    const purpleLight = new THREE.DirectionalLight(0x7C3AED, 2.5); // Royal Purple Left Light
    purpleLight.position.set(-8, -8, -4);
    scene.add(purpleLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.0, 30);
    rimLight.position.set(0, 5, 5);
    scene.add(rimLight);

    // Main Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // A. Transparent Physical Glass Sphere
    const sphereGeo = new THREE.SphereGeometry(3.3, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0x111827,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.88, // Glass transparency
        transparent: true,
        opacity: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.8
    });
    const glassSphere = new THREE.Mesh(sphereGeo, sphereMat);
    masterGroup.add(glassSphere);

    // B. Inner Orbiting MERN Tech Symbols (Represented as Glowing Geometry Prisms)
    const innerGroup = new THREE.Group();
    masterGroup.add(innerGroup);

    // React (Cyan Dodecahedron)
    const reactMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.5, 0),
        new THREE.MeshStandardMaterial({ color: 0x06B6D4, metalness: 0.8, roughness: 0.2 })
    );
    reactMesh.position.set(1.4, 0.8, 0);
    innerGroup.add(reactMesh);

    // Node.js (Emerald Octahedron)
    const nodeMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.MeshStandardMaterial({ color: 0x10B981, metalness: 0.8, roughness: 0.2 })
    );
    nodeMesh.position.set(-1.4, -0.6, 0.5);
    innerGroup.add(nodeMesh);

    // MongoDB (Purple Icosahedron)
    const mongoMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.MeshStandardMaterial({ color: 0x7C3AED, metalness: 0.8, roughness: 0.2 })
    );
    mongoMesh.position.set(0.4, -1.3, -0.6);
    innerGroup.add(mongoMesh);

    // JavaScript (Amber Cube)
    const jsMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.65, 0.65),
        new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.8, roughness: 0.2 })
    );
    jsMesh.position.set(-0.6, 1.2, -0.4);
    innerGroup.add(jsMesh);

    // C. Concentric Orbiting Wireframe Rings
    const ringGeo1 = new THREE.TorusGeometry(4.3, 0.035, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06B6D4, transparent: true, opacity: 0.65 });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    ringMesh1.rotation.y = Math.PI / 8;
    masterGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(5.2, 0.025, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.5 });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 4;
    ringMesh2.rotation.y = Math.PI / 4;
    masterGroup.add(ringMesh2);

    // D. Tiny Orbiting Code Particles
    const partCount = 140;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);

    for (let i = 0; i < partCount * 3; i += 3) {
        partPos[i] = (Math.random() - 0.5) * 18;
        partPos[i + 1] = (Math.random() - 0.5) * 18;
        partPos[i + 2] = (Math.random() - 0.5) * 12;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
        color: 0x94A3B8,
        size: 0.1,
        transparent: true,
        opacity: 0.5
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // Calm Mouse Parallax Tracking
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        targetY = x * 0.45;
        targetX = y * 0.35;
    });

    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    // Elegant 60 FPS Render Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Slow, intentional sphere & ring rotation
        glassSphere.rotation.y = time * 0.1;
        innerGroup.rotation.y = time * 0.4;
        innerGroup.rotation.x = Math.sin(time * 0.3) * 0.3;

        reactMesh.rotation.x += 0.02;
        nodeMesh.rotation.y += 0.02;
        mongoMesh.rotation.z += 0.02;
        jsMesh.rotation.x -= 0.02;

        ringMesh1.rotation.z += 0.005;
        ringMesh2.rotation.z -= 0.004;

        particles.rotation.y = time * 0.03;

        // Spring lerp damping towards cursor
        masterGroup.rotation.y += (targetY - masterGroup.rotation.y) * 0.06;
        masterGroup.rotation.x += (targetX - masterGroup.rotation.x) * 0.06;

        renderer.render(scene, camera);
    }

    animate();
}

/* ==========================================================================
   2. NAVBAR BLUR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   3. MAGNETIC BUTTON INTERACTIONS
   ========================================================================== */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.project-window, .timeline-item, .cert-card, .contact-info, .contact-form-container');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px)';
        item.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(index % 3) * 0.15}s`;
        observer.observe(item);
    });
}

/* ==========================================================================
   5. EMAILJS CONFIGURATION & PRODUCTION CONTACT FORM HANDLER
   ========================================================================== */
// Configuration: Set your EmailJS IDs below or via environment variables (Vite / Vercel)
const EMAILJS_CONFIG = {
    SERVICE_ID: (typeof import_meta !== 'undefined' && import_meta.env?.VITE_EMAILJS_SERVICE_ID) || 'service_tkm505u',
    TEMPLATE_ID: (typeof import_meta !== 'undefined' && import_meta.env?.VITE_EMAILJS_TEMPLATE_ID) || 'template_aar2yr3',
    PUBLIC_KEY: (typeof import_meta !== 'undefined' && import_meta.env?.VITE_EMAILJS_PUBLIC_KEY) || 'TXpngKCRloCxUpE3v'
};

// Initialize EmailJS when loaded
if (typeof emailjs !== 'undefined') {
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    } catch (e) {
        console.warn('EmailJS SDK initialized.');
    }
}

async function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;

    // 1. Spam Protection (Honeypot check)
    const honeypot = form.querySelector('#_honeypot');
    if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission blocked.');
        return;
    }

    // Clear previous inline errors
    clearFieldErrors(form);

    // 2. Form Fields & Validation
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    let isValid = true;

    if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'Please enter your name.');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        showFieldError(emailInput, 'Please enter your email address.');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
    }

    if (!messageInput.value.trim()) {
        showFieldError(messageInput, 'Please enter a message.');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showFieldError(messageInput, 'Message must be at least 10 characters long.');
        isValid = false;
    }

    if (!isValid) return;

    // 3. Loading State
    const submitBtn = form.querySelector('#submit-btn') || form.querySelector('button[type="submit"]');
    const spinner = submitBtn.querySelector('.spinner');
    const btnText = submitBtn.querySelector('.btn-text') || submitBtn.querySelector('span:not(.spinner)');

    submitBtn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Transmitting Message...';

    try {
        // Check if EmailJS credentials are configured
        if (EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
            // Simulate transmission for testing before credentials are entered
            await new Promise(res => setTimeout(res, 1200));
            showToast('success', 'Message sent successfully.', 'Thank you for reaching out. I will get back to you shortly.');
            form.reset();
        } else if (typeof emailjs !== 'undefined') {
            // 4. Send Email via EmailJS
            await emailjs.sendForm(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                form,
                EMAILJS_CONFIG.PUBLIC_KEY
            );
            showToast('success', 'Message sent successfully.', 'Thank you for reaching out. I will get back to you shortly.');
            form.reset();
        } else {
            throw new Error('EmailJS SDK not loaded.');
        }
    } catch (error) {
        console.error('Email transmission failed:', error);
        showToast('error', 'Failed to send message.', 'Please try again.');
    } finally {
        // Restore Button State
        submitBtn.disabled = false;
        if (spinner) spinner.classList.add('hidden');
        if (btnText) btnText.textContent = 'Send Message';
    }
}

function showFieldError(inputEl, message) {
    inputEl.classList.add('input-error');
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    inputEl.parentNode.appendChild(errorEl);
}

function clearFieldErrors(form) {
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.error-message').forEach(el => el.remove());
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(type, title, desc) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconHtml = type === 'success' ? '✓' : '⚠';

    toast.innerHTML = `
        <div class="toast-icon">${iconHtml}</div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-desc">${desc}</div>
        </div>
    `;

    container.appendChild(toast);

    // Remove toast smoothly after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 400);
    }, 5000);
}
