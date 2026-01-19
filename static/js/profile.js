// Variables globales
        let selectedAvatarFile = null;
        let tempAvatarURL = null;

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            setupEventListeners();
        });

        // Configuration des événements
        function setupEventListeners() {
            // Boutons changement avatar (hors modal)
            const changeAvatarBtn = document.getElementById('change-avatar-btn');
            const avatarEditBtn = document.getElementById('avatar-edit-btn');
            const avatarUpload = document.getElementById('avatar-upload');

            if (changeAvatarBtn && avatarUpload) {
                changeAvatarBtn.addEventListener('click', () => avatarUpload.click());
            }
            if (avatarEditBtn && avatarUpload) {
                avatarEditBtn.addEventListener('click', () => avatarUpload.click());
            }

            // Bouton modifier profil
            const editProfileBtn = document.getElementById('edit-profile-btn');
            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', openEditModal);
            }

            // Fermeture modal
            const closeBtn = document.getElementById('close-edit-modal');
            const cancelBtn = document.getElementById('cancel-edit');
            if (closeBtn) closeBtn.addEventListener('click', closeEditModal);
            if (cancelBtn) cancelBtn.addEventListener('click', closeEditModal);

            // Upload avatar dans modal
            const modalAvatarUpload = document.getElementById('modal-avatar-upload');
            if (modalAvatarUpload) {
                modalAvatarUpload.addEventListener('change', handleModalAvatarPreview);
            }

            // Compteur bio
            const bioTextarea = document.getElementById('edit-bio');
            if (bioTextarea) {
                bioTextarea.addEventListener('input', updateBioCount);
            }

            // Soumission formulaire
            const editForm = document.getElementById('edit-profile-form');
            if (editForm) {
                editForm.addEventListener('submit', handleFormSubmit);
            }

            // Navigation tabs
            setupTabNavigation();

            // Fermeture modal en cliquant dehors
            const modal = document.getElementById('edit-profile-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeEditModal();
                });
            }
        }

        // Prévisualisation avatar modal
        function handleModalAvatarPreview(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showNotification('Veuillez sélectionner une image valide', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showNotification('L\'image ne doit pas dépasser 5 Mo', 'error');
                return;
            }

            selectedAvatarFile = file;

            // Prévisualisation
            const reader = new FileReader();
            reader.onload = (e) => {
                tempAvatarURL = e.target.result;
                const preview = document.getElementById('modal-avatar-preview');
                if (preview) preview.src = tempAvatarURL;
            };
            reader.readAsDataURL(file);
        }

        // Ouvrir modal
        function openEditModal() {
            const modal = document.getElementById('edit-profile-modal');
            const profileUsername = document.getElementById('profile-username');
            const profileBio = document.getElementById('profile-bio');
            const editName = document.getElementById('edit-name');
            const editBio = document.getElementById('edit-bio');
            
            if (profileUsername && editName) {
                editName.value = profileUsername.textContent;
            }
            
            if (profileBio && editBio) {
                const bioText = profileBio.textContent;
                editBio.value = bioText === 'Aucune bio définie' ? '' : bioText;
            }
            
            updateBioCount();
            if (modal) modal.classList.add('active');
        }

        // Fermer modal
        function closeEditModal() {
            const modal = document.getElementById('edit-profile-modal');
            if (modal) modal.classList.remove('active');
            
            selectedAvatarFile = null;
            tempAvatarURL = null;
            
            // Réinitialiser prévisualisation
            const currentAvatar = document.getElementById('profile-avatar');
            const modalPreview = document.getElementById('modal-avatar-preview');
            if (currentAvatar && modalPreview) {
                modalPreview.src = currentAvatar.src;
            }

            // Réinitialiser input file
            const fileInput = document.getElementById('modal-avatar-upload');
            if (fileInput) fileInput.value = '';
        }

        // Compteur bio
        function updateBioCount() {
            const bioTextarea = document.getElementById('edit-bio');
            const charCount = document.getElementById('bio-count');
            
            if (bioTextarea && charCount) {
                charCount.textContent = bioTextarea.value.length;
            }
        }

        // Soumission formulaire - Le formulaire est envoyé normalement à Django
        function handleFormSubmit(event) {
            // Le formulaire sera envoyé normalement avec method="post" action="/profile/"
            // Django gérera la requête POST avec les données et le fichier
            
            // Si vous voulez ajouter une validation avant soumission :
            const username = document.getElementById('edit-name').value.trim();
            if (!username) {
                event.preventDefault();
                showNotification('Le nom d\'utilisateur est requis', 'error');
                return false;
            }
            
            // Le formulaire se soumettra normalement
            return true;
        }

        // Navigation tabs
        function setupTabNavigation() {
            const tabButtons = document.querySelectorAll('.profile-nav-btn');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabName = button.getAttribute('data-tab');
                    
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    
                    button.classList.add('active');
                    const targetTab = document.getElementById(tabName + '-tab');
                    if (targetTab) targetTab.classList.add('active');
                });
            });
        }

        // Notifications
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
            
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }