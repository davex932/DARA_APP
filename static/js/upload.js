// upload.js — gère sélection de fichier, aperçu, validation et simulation d'upload
(function () {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    const fileInput = document.getElementById('file-input');
    const browseLabel = document.querySelector('.browse-label');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const fileNameSpan = document.getElementById('file-name');
    const fileSizeSpan = document.getElementById('file-size');
    const removeImageBtn = document.getElementById('remove-image');
    const uploadForm = document.getElementById('upload-form');
    const publishBtn = document.getElementById('publish-btn');

    const progressOverlay = document.getElementById('progress-overlay');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    if (!fileInput) return; // page n'est pas upload

    function humanFileSize(bytes) {
        const units = ['B','KB','MB','GB','TB'];
        let i = 0;
        while(bytes >= 1024 && i < units.length - 1){
            bytes /= 1024;
            i++;
        }
        return `${bytes.toFixed(1)} ${units[i]}`;
    }

    function resetPreview() {
        previewContainer.style.display = 'none';
        imagePreview.removeAttribute('src');
        fileInput.value = '';
        fileNameSpan.textContent = '';
        fileSizeSpan.textContent = '';
    }

    function showPreview(file) {
        // Libère l'URL précédent si besoin
        try { URL.revokeObjectURL(imagePreview.src); } catch(e){}

        const objectUrl = URL.createObjectURL(file);
        imagePreview.src = objectUrl;
        fileNameSpan.textContent = file.name;
        fileSizeSpan.textContent = humanFileSize(file.size);
        previewContainer.style.display = 'block';
    }

    function validateFile(file) {
        if (!ALLOWED_TYPES.includes(file.type)) {
            Utils.showNotification('Type de fichier non supporté — utilisez JPG, PNG, GIF ou WebP', 'error');
            return false;
        }
        if (file.size > MAX_SIZE) {
            Utils.showNotification('Fichier trop volumineux (max 5MB)', 'error');
            return false;
        }
        return true;
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return resetPreview();

        if (!validateFile(file)) {
            fileInput.value = '';
            return;
        }

        showPreview(file);
    });

    // Si vous voulez garder un bouton JS (browse-btn) actif, on peut déclencher fileInput.click()
    const browseBtn = document.getElementById('browse-btn');
    if (browseBtn) {
        browseBtn.addEventListener('click', () => fileInput.click());
    }

    removeImageBtn && removeImageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetPreview();
    });

    // Simulation d'upload et gestion du formulaire
    uploadForm && uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const file = fileInput.files && fileInput.files[0];
        if (!file) {
            Utils.showNotification('Sélectionnez d\'abord un fichier', 'error');
            return;
        }
        if (!validateFile(file)) return;

        // Préparer données (ici on simule)
        progressOverlay.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5; // incréments aléatoires
            if (progress >= 100) progress = 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = progress + '%';

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressOverlay.style.display = 'none';
                    Utils.showNotification('Publication simulée avec succès', 'success');
                    // Réinitialiser le formulaire après "upload"
                    resetPreview();
                    uploadForm.reset();
                }, 600);
            }
        }, 250);

        // Note: remplacer la simulation par un vrai fetch()/XMLHttpRequest pour upload réel côté serveur
    });

    // Drag & drop minimal (si upload-area présent)
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
        ['dragenter','dragover'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.add('drag-over');
            });
        });
        ['dragleave','drop'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                uploadArea.classList.remove('drag-over');
            });
        });
        uploadArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt && dt.files;
            if (files && files[0]) {
                const file = files[0];
                if (!validateFile(file)) return;
                // remplir fileInput programatiquement (certains navigateurs/contexts n'autorisent pas)
                // on affiche l'aperçu directement
                showPreview(file);
            }
        });
    }
})();
