// Define monthNames globally for reuse
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

import { db } from './firebaseConfig.js';
import { collection, getDocs, doc, setDoc, getDoc, addDoc, orderBy, query } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded, checking Firebase db:", db ? "Available" : "Not available", "Type:", typeof db);
    let isFirestoreValid = false;
    if (db) {
        try {
            await getDocs(collection(db, 'gallery_likes'));
            isFirestoreValid = true;
            console.log("Firebase db is valid and ready");
        } catch (error) {
            console.warn("Firebase db validation failed (permissions or collection issue):", error);
            isFirestoreValid = true; // Allow local testing
        }
    } else {
        console.error("Firebase db is not available or undefined");
    }

    // Share function for share buttons
    window.shareSite = function() {
        if (navigator.share) {
            navigator.share({
                title: "Crom's Overtures",
                text: "Discover sword and sorcery artwork inspired by Conan at Crom's Overtures!",
                url: "https://cromsovertures.art"
            }).then(() => {
                console.log("Site shared successfully");
            }).catch(err => {
                console.error("Error sharing site:", err);
                alert("Error sharing site. Copy the URL: https://cromsovertures.art");
            });
        } else {
            navigator.clipboard.writeText("https://cromsovertures.art").then(() => {
                alert("Site URL copied to clipboard: https://cromsovertures.art");
                console.log("Site URL copied to clipboard");
            }).catch(err => {
                console.error("Error copying URL:", err);
                alert("Unable to copy URL. Please copy manually: https://cromsovertures.art");
            });
        }
    };

    // Cryptocurrency buttons
    document.querySelectorAll('.crypto-button').forEach(button => {
        button.addEventListener('click', () => {
            const address = button.dataset.address;
            navigator.clipboard.writeText(address).then(() => {
                alert(`Copied ${button.querySelector('img').alt} address: ${address}`);
                console.log(`Copied ${button.querySelector('img').alt} address: ${address}`);
            }).catch(err => {
                console.error("Error copying address:", err);
                alert(`Error copying address. Please copy manually: ${address}`);
            });
        });
    });

    // Debug for mobile
    console.log("Device width:", window.innerWidth);
    console.log("Device height:", window.innerHeight);
    console.log(`Logo event listener added for ${window.location.pathname}`);

    // Position banner below header
    function positionBanner() {
        const header = document.querySelector('header');
        const banner = document.querySelector('.banner');
        const main = document.querySelector('main');
        if (header && banner && main) {
            const headerHeight = header.offsetHeight;
            banner.style.top = `${headerHeight}px`;
            main.style.marginTop = `${headerHeight + banner.offsetHeight}px`;
            console.log(`Header height: ${headerHeight}px, Banner height: ${banner.offsetHeight}px`);
        } else {
            console.error("Header, banner, or main not found for positioning");
        }
    }
    positionBanner();
    window.addEventListener('resize', positionBanner);

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            console.log("Hamburger clicked");
            nav.classList.toggle('nav-open');
            hamburger.textContent = nav.classList.contains('nav-open') ? '✕' : '☰';
        });
        hamburger.addEventListener('touchstart', (e) => {
            e.preventDefault();
            console.log("Hamburger touched");
            nav.classList.toggle('nav-open');
            hamburger.textContent = nav.classList.contains('nav-open') ? '✕' : '☰';
        });
    } else {
        console.error("Hamburger or nav not found");
    }

    // Carousel functionality
    console.log("Initializing carousel");
    const carouselContainer = document.getElementById('carousel-container');
    if (carouselContainer) {
        console.log("Carousel container found");
        const carouselItemsCount = 44;
        let currentIndex = 0;

        for (let i = 1; i <= carouselItemsCount; i++) {
            const index = i.toString().padStart(3, '0');
            const div = document.createElement('div');
            div.className = 'carousel-item';
            const img = document.createElement('img');
            img.src = `img/cromsovertures_fantasy_artwork_202507_${index}-carousel.jpg`;
            img.alt = `Fantasy artwork ${index} by Crom's Overtures, July 2025`;
            img.loading = 'lazy';
            img.onerror = () => {
                console.error(`Failed to load carousel image: img/cromsovertures_fantasy_artwork_202507_${index}-carousel.jpg`);
                img.src = 'img/fallback-image.jpg';
                img.alt = 'Image not available';
            };
            div.appendChild(img);
            carouselContainer.appendChild(div);
        }

        const items = document.querySelectorAll('.carousel-item');

        function updateCarousel() {
            console.log(`Updating carousel to index ${currentIndex}`);
            const radius = window.innerWidth <= 768 ? 300 : 500;
            items.forEach((item, index) => {
                const offset = (index - currentIndex + carouselItemsCount) % carouselItemsCount;
                item.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
                if (offset === 0) {
                    item.style.transform = `translate(-50%, -50%) rotateY(0deg) translateZ(0px) scale(1.69)`;
                    item.style.opacity = 1;
                    item.style.zIndex = 1;
                } else {
                    const anglePerItem = 360 / carouselItemsCount;
                    const angle = (offset - 1) * anglePerItem;
                    const x = radius * Math.sin(angle * Math.PI / 180);
                    const z = radius * Math.cos(angle * Math.PI / 180) * -1;
                    const rotation = angle;
                    item.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotation}deg) scale(0.6)`;
                    item.style.opacity = 0.2;
                    item.style.zIndex = 0;
                }
            });
        }

        function handleCarouselMove(next) {
            console.log(`Carousel move: ${next ? 'next' : 'previous'}`);
            if (next) currentIndex = (currentIndex + 1) % carouselItemsCount;
            else currentIndex = (currentIndex - 1 + carouselItemsCount) % carouselItemsCount;
            updateCarousel();
        }

        carouselContainer.addEventListener('click', (e) => {
            const rect = carouselContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const centerX = rect.width / 2;
            console.log(`Carousel clicked at x: ${clickX}, center: ${centerX}`);
            if (clickX < centerX - 50) handleCarouselMove(false);
            else if (clickX > centerX + 50) handleCarouselMove(true);
            else handleCarouselMove(true);
        });

        carouselContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            console.log("Right-click on carousel");
            handleCarouselMove(false);
        });

        carouselContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = carouselContainer.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const centerX = rect.width / 2;
            console.log(`Carousel touched at x: ${touchX}, center: ${centerX}`);
            if (touchX < centerX - 50) handleCarouselMove(false);
            else if (touchX > centerX + 50) handleCarouselMove(true);
            else handleCarouselMove(true);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && document.querySelector('.carousel')) {
                console.log("Left arrow key pressed");
                handleCarouselMove(false);
            } else if (e.key === 'ArrowRight' && document.querySelector('.carousel')) {
                console.log("Right arrow key pressed");
                handleCarouselMove(true);
            }
        });

        updateCarousel();
    } else {
        console.warn("Carousel container not found, skipping initialization");
    }

    // Wallpapers functionality
const wallpapersContainer = document.getElementById('wallpapers-phone');
if (wallpapersContainer) {
    console.log("Wallpapers container found");
    const wallpapers = [
        { thumb: 'img/wallpapers/cromsovertures_wallpaper001_thumb.png', enlarged: 'img/wallpapers/cromsovertures_wallpaper001_enlarged.png' },
        { thumb: 'img/wallpapers/cromsovertures_wallpaper002_thumb.png', enlarged: 'img/wallpapers/cromsovertures_wallpaper002_enlarged.png' },
        { thumb: 'img/wallpapers/cromsovertures_wallpaper003_thumb.png', enlarged: 'img/wallpapers/cromsovertures_wallpaper003_enlarged.png' }
    ];

    wallpapersContainer.innerHTML = ''; // Clear the container

    wallpapers.forEach((wallpaper, index) => {
        const wallpaperDiv = document.createElement('div');
        wallpaperDiv.className = 'wallpaper-item';
        wallpaperDiv.innerHTML = `
            <div class="wallpaper-wrapper">
                <img src="${wallpaper.thumb}" alt="Wallpaper ${index + 1} by Crom's Overtures" class="wallpaper-thumb" loading="lazy" data-full-src="${wallpaper.enlarged}">
                <a href="${wallpaper.enlarged}" download class="wallpaper-download-button">Download</a>
                <button class="wallpaper-share-button" data-index="${index}">Share</button>
            </div>
        `;
        wallpapersContainer.appendChild(wallpaperDiv);
    });

    // Handle click on thumbnail to open lightbox
    wallpapersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('wallpaper-thumb') && e.target.dataset.fullSrc) {
            const lightbox = document.createElement('div');
            lightbox.className = 'wallpaper-lightbox';
            const index = Array.from(wallpapersContainer.querySelectorAll('.wallpaper-thumb')).indexOf(e.target);
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="close-button" aria-label="Close lightbox">&times;</button>
                    <img src="${e.target.dataset.fullSrc}" alt="${e.target.alt}" class="lightbox-image">
                    <a href="${e.target.dataset.fullSrc}" download class="wallpaper-download-button">Download</a>
                    <button class="wallpaper-share-button" data-index="${index}">Share</button>
                </div>
            `;
            // Handle lightbox closure
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('close-button')) {
                    lightbox.remove();
                    document.body.classList.remove('lightbox-open');
                }
            });
            // Handle zoom
            lightbox.addEventListener('click', (e) => {
                if (e.target.classList.contains('lightbox-image')) {
                    e.target.classList.toggle('zoomed');
                }
            });
            document.body.appendChild(lightbox);
            document.body.classList.add('lightbox-open');
        }
    });

    // Handle Share button
    wallpapersContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('wallpaper-share-button')) {
            const index = e.target.dataset.index;
            const wallpaper = wallpapers[index];
            const shareData = {
                title: `Wallpaper ${parseInt(index) + 1} by Crom's Overtures`,
                text: `Check out this awesome wallpaper by Crom's Overtures!`,
                url: `https://cromsovertures.art/${wallpaper.enlarged}`
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                    console.log('Shared successfully via Web Share API');
                } else {
                    const fallbackOptions = `
                        <div class="share-fallback">
                            <p>Share this wallpaper:</p>
                            <button onclick="copyToClipboard('https://cromsovertures.art/${wallpaper.enlarged}')">Copy Link</button>
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}" target="_blank">Share on Twitter</a>
                            <a href="https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareData.url)}" target="_blank">Share on Facebook</a>
                        </div>
                    `;
                    const lightbox = document.createElement('div');
                    lightbox.className = 'share-fallback-lightbox';
                    lightbox.innerHTML = fallbackOptions;
                    lightbox.addEventListener('click', (e) => {
                        if (e.target === lightbox) {
                            lightbox.remove();
                            document.body.classList.remove('lightbox-open');
                        }
                    });
                    document.body.appendChild(lightbox);
                    document.body.classList.add('lightbox-open');
                }
            } catch (err) {
                console.error('Error sharing:', err);
                alert('An error occurred while sharing. Try copying the link manually.');
            }
        }
    });

    // Function to copy link to clipboard
    window.copyToClipboard = async function(url) {
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
            console.log('Link copied:', url);
        } catch (err) {
            console.error('Error copying link:', err);
            alert('Unable to copy link. Please copy it manually: ' + url);
        }
    };
} else {
    console.warn("Wallpapers container not found, skipping initialization");
}
    // Portfolio functionality
    console.log("Initializing portfolio");
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGallery = document.getElementById('portfolio-gallery');

    if (portfolioItems.length && portfolioGallery) {
        console.log("Portfolio items and gallery found");
        // Ajouter un écouteur d'événements à chaque élément de portfolio
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const style = item.dataset.style; // Récupérer le style (oldschool, medieval, etc.)
                console.log(`Portfolio item clicked, loading style: ${style}`);
                loadPortfolioThumbnails(style);
            });
        });

// Ajouter un écouteur d'événements à chaque vignette
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        // Retirer la classe active-glow de toutes les vignettes
        portfolioItems.forEach(i => i.classList.remove('active-glow'));
        // Ajouter la classe active-glow à la vignette cliquée
        item.classList.add('active-glow');
        // Charger les miniatures correspondantes (ajustez selon votre code existant)
        const style = item.dataset.style;
        loadPortfolioThumbnails(style);
    });
});


        // Gérer le clic sur les miniatures pour afficher l'image agrandie
        portfolioGallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && e.target.dataset.enlarged) {
        console.log(`Thumbnail clicked, opening lightbox for: ${e.target.dataset.enlarged}`);
        const lightbox = document.createElement('div');
        lightbox.className = 'wallpaper-lightbox'; // Utiliser la même classe que wallpapers
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="close-button" aria-label="Close lightbox">&times;</button>
                <img src="${e.target.dataset.enlarged}" alt="${e.target.alt}" class="lightbox-image">
                <button class="wallpaper-share-button" data-img-id="${e.target.dataset.enlarged}">Share</button>
            </div>
        `;
        // Gérer la fermeture de la lightbox
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('close-button')) {
                lightbox.remove();
                document.body.classList.remove('lightbox-open');
            }
        });
        // Gérer le zoom sur l'image
        lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-image')) {
                e.target.classList.toggle('zoomed');
            }
        });
        // Gérer le clic sur le bouton de partage
        lightbox.addEventListener('click', async (e) => {
            if (e.target.classList.contains('wallpaper-share-button')) {
                const imgId = e.target.dataset.imgId;
                const shareData = {
                    title: `${e.target.previousElementSibling.alt}`,
                    text: `Check out this awesome artwork by Crom's Overtures!`,
                    url: `https://cromsovertures.art/${e.target.previousElementSibling.src}`
                };
                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                        console.log('Shared successfully via Web Share API');
                    } else {
                        const fallbackOptions = `
                            <div class="share-fallback">
                                <p>Share this artwork:</p>
                                <button onclick="copyToClipboard('https://cromsovertures.art/${e.target.previousElementSibling.src}')">Copy Link</button>
                                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}" target="_blank">Share on Twitter</a>
                                <a href="https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareData.url)}" target="_blank">Share on Facebook</a>
                            </div>
                        `;
                        const fallbackLightbox = document.createElement('div');
                        fallbackLightbox.className = 'share-fallback-lightbox';
                        fallbackLightbox.innerHTML = fallbackOptions;
                        fallbackLightbox.addEventListener('click', (e) => {
                            if (e.target === fallbackLightbox) {
                                fallbackLightbox.remove();
                                document.body.classList.remove('lightbox-open');
                            }
                        });
                        document.body.appendChild(fallbackLightbox);
                        document.body.classList.add('lightbox-open');
                    }
                } catch (err) {
                    console.error('Error sharing:', err);
                    alert('An error occurred while sharing. Try copying the link manually.');
                }
            }
        });
        document.body.appendChild(lightbox);
        document.body.classList.add('lightbox-open');
    }
});

        // Fonction pour charger les miniatures
function loadPortfolioThumbnails(style) {
    console.log(`Loading thumbnails for style: ${style}`);
    portfolioGallery.innerHTML = ''; // Vider le conteneur
    for (let i = 1; i <= 9; i++) {
        const thumbSrc = `img/portfolio/${style}/cromsovertures_${style}_${i}-thumb.jpg`;
        const enlargedSrc = `img/portfolio/${style}/cromsovertures_${style}_${i}-enlarged.jpg`;
        
        const img = document.createElement('img');
        img.src = thumbSrc;
        img.alt = `${style} artwork ${i}`;
        img.className = 'portfolio-thumb';
        img.dataset.enlarged = enlargedSrc;
        img.loading = 'lazy';
        img.onerror = () => {
            console.error(`Failed to load thumbnail: ${thumbSrc}`);
            img.src = 'img/fallback-image.jpg'; // Assurez-vous que ce fichier existe
            img.alt = 'Image not available';
        };
        portfolioGallery.appendChild(img);
        console.log(`Added thumbnail: ${thumbSrc}`);
    }
}
    } else {
        console.warn("Portfolio items or gallery container not found, skipping initialization");
    }

    // Initialize likes from Firestore for all images (for gallery.html)
    async function initializeLikes(maxImages, monthNumber, startIndex = 1, endIndex) {
        if (!isFirestoreValid) {
            console.warn("Firestore not available, skipping likes initialization");
            return;
        }
        try {
            const querySnapshot = await getDocs(collection(db, 'gallery_likes'));
            const likesData = {};
            querySnapshot.forEach((docSnap) => {
                likesData[docSnap.id] = docSnap.data().likes || 0;
            });

            for (let i = startIndex; i <= endIndex; i++) {
                const index = i.toString().padStart(3, '0');
                const imgId = `2025${monthNumber}_${index}`;
                const img = document.querySelector(`img[data-img-id="${imgId}"]`);
                if (img) {
                    const likeButton = img.nextElementSibling;
                    const likeCount = likeButton ? likeButton.nextElementSibling : null;
                    if (likeButton && likeCount) {
                        const likes = likesData[imgId] || 0;
                        likeCount.textContent = likes;
                        if (likes > 0) {
                            likeButton.classList.add('liked');
                            likeButton.innerHTML = '♥';
                        } else {
                            likeButton.classList.remove('liked');
                            likeButton.innerHTML = '♡';
                        }
                        console.log(`Initialized ${imgId} with ${likes} likes`);
                    }
                }
            }
        } catch (error) {
            console.error("Error initializing likes:", error);
        }
    }

    // Initialize guestbook messages from Firestore
    async function loadGuestbookMessages() {
        const messagesContainer = document.getElementById('guestbook-messages');
        if (!messagesContainer || !isFirestoreValid) {
            if (messagesContainer) {
                messagesContainer.innerHTML = '<p>Unable to load messages. Firebase is not available.</p>';
            }
            return;
        }

        try {
            const messagesQuery = query(collection(db, 'guestbook_messages'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(messagesQuery);
            messagesContainer.innerHTML = '';
            if (querySnapshot.empty) {
                messagesContainer.innerHTML = '<p>No messages yet. Be the first to leave a comment!</p>';
                return;
            }

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const messageDiv = document.createElement('div');
                messageDiv.className = 'guestbook-message';
                messageDiv.innerHTML = `
                    <p class="name">${data.name || 'Anonymous'}</p>
                    <p>${data.message}</p>
                    <p class="date">${new Date(data.timestamp.toDate()).toLocaleString('en-US')}</p>
                `;
                messagesContainer.appendChild(messageDiv);
            });
            console.log("Guestbook messages loaded successfully");
        } catch (error) {
            console.error("Error loading guestbook messages:", error);
            messagesContainer.innerHTML = '<p>Error loading messages. Please try again later.</p>';
        }
    }

    // Guestbook form submission
    const guestbookForm = document.getElementById('guestbook-form');
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('guestbook-name').value.trim();
            const message = document.getElementById('guestbook-message').value.trim();

            if (!name || !message) {
                alert("Please fill in all fields.");
                return;
            }

            if (!isFirestoreValid) {
                alert("Unable to send message. Firebase is not available.");
                return;
            }

            try {
                await addDoc(collection(db, 'guestbook_messages'), {
                    name,
                    message,
                    timestamp: new Date()
                });
                console.log("Guestbook message added successfully");
                guestbookForm.reset();
                alert("Message sent successfully!");
                await loadGuestbookMessages();
            } catch (error) {
                console.error("Error adding guestbook message:", error);
                alert("Error sending message. Please try again.");
            }
        });
    }

    // Gallery functionality
    console.log("Initializing gallery");
    const galleryImages = document.getElementById('gallery-images');
    const currentMonth = document.getElementById('current-month');
    let currentDate = new Date('2025-07-01');
    let loadedImages = 0;
    const imagesPerBatch = 10;
    let observer = null;
    let isLoadingBatch = false;

    function updateGallery() {
        console.log("updateGallery called");
        const month = monthNames[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        const monthNumber = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        currentMonth.textContent = `${month} ${year}`;
        console.log(`Updating gallery to ${month} ${year}`);

        loadedImages = 0;
        const sentinel = document.getElementById('gallery-sentinel');
        if (!sentinel) {
            galleryImages.innerHTML = '<div id="gallery-sentinel" class="gallery-sentinel"></div>';
        } else {
            galleryImages.innerHTML = '';
            galleryImages.appendChild(sentinel);
        }

        let maxImages = 0;
        if (month === 'May' && year === 2025) maxImages = 101;
        else if (month === 'June' && year === 2025) maxImages = 100;
        else if (month === 'July' && year === 2025) maxImages = 107;
        else maxImages = 0;

        if (maxImages === 0) {
            galleryImages.innerHTML = '<p>No images available for this month. Visit our Link Tree: <a href="https://linktr.ee/cromsovertures">cromsovertures</a></p>';
            return;
        }

        if (observer) {
            observer.disconnect();
            observer = null;
            console.log("Previous observer disconnected");
        }

        loadImageBatch(maxImages, month, year, monthNumber);
    }

    async function loadImageBatch(maxImages, month, year, monthNumber) {
        if (isLoadingBatch || loadedImages >= maxImages) {
            console.log(`Batch loading skipped: ${isLoadingBatch ? 'already loading' : 'all images loaded'}`);
            return;
        }

        isLoadingBatch = true;
        const sentinel = document.getElementById('gallery-sentinel');
        const endIndex = Math.min(loadedImages + imagesPerBatch, maxImages);
        console.log(`Loading batch: images ${loadedImages + 1} to ${endIndex} of ${maxImages}`);

        for (let i = loadedImages + 1; i <= endIndex; i++) {
            const index = i.toString().padStart(3, '0');
            const imgId = `2025${monthNumber}_${index}`;
            const div = document.createElement('div');
            div.className = 'like-container';
            const img = document.createElement('img');
            img.src = `img/gallery/${month.toLowerCase()}_${year}/cromsovertures_fantasy_artwork_2025${monthNumber}_${index}-thumb.jpg`;
            img.alt = `Fantasy artwork ${i} by Crom's Overtures, ${month} ${year}`;
            img.loading = 'lazy';
            img.dataset.fullSrc = `img/gallery/${month.toLowerCase()}_${year}/cromsovertures_fantasy_artwork_2025${monthNumber}_${index}-enlarged.jpg`;
            img.dataset.imgId = imgId;
            img.style.opacity = '0';
            img.onerror = () => {
                console.error(`Failed to load gallery image: img/gallery/${month.toLowerCase()}_${year}/cromsovertures_fantasy_artwork_2025${monthNumber}_${index}-thumb.jpg`);
                img.src = 'img/fallback-image.jpg';
                img.alt = 'Image not available';
            };
            div.appendChild(img);
            const likeButton = document.createElement('button');
            likeButton.className = 'like-button';
            likeButton.innerHTML = '♡';
            likeButton.setAttribute('aria-label', 'Like the artwork');
            const likeCount = document.createElement('span');
            likeCount.className = 'like-count';
            likeCount.textContent = '0';
            div.appendChild(likeButton);
            div.appendChild(likeCount);

            likeButton.addEventListener('click', async () => {
                console.log(`Like button clicked for image ${imgId}`);
                const isLiked = likeButton.classList.contains('liked');
                let currentLikes = parseInt(likeCount.textContent) || 0;

                likeButton.classList.toggle('liked');
                likeButton.innerHTML = isLiked ? '♡' : '♥';
                currentLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
                likeCount.textContent = currentLikes;

                if (isFirestoreValid) {
                    console.log("Attempting Firestore update with db:", db);
                    try {
                        const docRef = doc(db, 'gallery_likes', imgId);
                        const docSnap = await getDoc(docRef);
                        let firestoreLikes = docSnap.exists() ? docSnap.data().likes || 0 : 0;
                        firestoreLikes = isLiked ? Math.max(0, firestoreLikes - 1) : firestoreLikes + 1;

                        await setDoc(docRef, {
                            likes: firestoreLikes,
                            likedBy: isLiked ? [] : ['user'] // Simplified, adjust as needed
                        }, { merge: true });
                        console.log(`Like updated for ${imgId}: ${firestoreLikes} likes`);
                    } catch (error) {
                        console.error(`Failed to update like for ${imgId}:`, error);
                        likeButton.classList.toggle('liked');
                        likeButton.innerHTML = isLiked ? '♥' : '♡';
                        likeCount.textContent = currentLikes + (isLiked ? 1 : -1);
                    }
                } else {
                    console.warn("Firebase db not available or invalid, like updated locally only");
                }
            });

            galleryImages.insertBefore(div, sentinel);
            setTimeout(() => img.style.opacity = '1', (i - loadedImages) * 50);
        }

        loadedImages = endIndex;
        console.log(`Loaded ${loadedImages} of ${maxImages} images`);

        // Initialize likes for the current batch
        await initializeLikes(maxImages, monthNumber, loadedImages - imagesPerBatch + 1, endIndex);

        isLoadingBatch = false;

        if (loadedImages < maxImages && sentinel) {
            if (observer) {
                observer.disconnect();
                console.log("Previous observer disconnected before creating new one");
            }
            observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !isLoadingBatch) {
                    console.log("Sentinel intersected, loading next batch");
                    loadImageBatch(maxImages, month, year, monthNumber);
                }
            }, { rootMargin: '200px', threshold: 0.1 });
            observer.observe(sentinel);
            console.log("New observer created and observing sentinel");
        } else if (observer && loadedImages >= maxImages) {
            observer.disconnect();
            observer = null;
            console.log("All images loaded, observer disconnected");
        }
    }

    if (galleryImages) {
    galleryImages.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.dataset.fullSrc) {
            const lightbox = document.createElement('div');
            lightbox.className = 'wallpaper-lightbox'; // Utiliser la même classe que wallpapers
            const imgId = e.target.dataset.imgId || ''; // Récupérer l'ID de l'image
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="close-button" aria-label="Close lightbox">&times;</button>
                    <img src="${e.target.dataset.fullSrc}" alt="${e.target.alt}" class="lightbox-image">
                    <button class="wallpaper-share-button" data-img-id="${imgId}">Share</button>
                </div>
            `;
            // Gérer la fermeture de la lightbox
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('close-button')) {
                    lightbox.remove();
                    document.body.classList.remove('lightbox-open');
                }
            });
            // Gérer le zoom sur l'image
            lightbox.addEventListener('click', (e) => {
                if (e.target.classList.contains('lightbox-image')) {
                    e.target.classList.toggle('zoomed');
                }
            });
            // Gérer le clic sur le bouton de partage
            lightbox.addEventListener('click', async (e) => {
                if (e.target.classList.contains('wallpaper-share-button')) {
                    const imgId = e.target.dataset.imgId;
                    const shareData = {
                        title: `${e.target.previousElementSibling.alt}`,
                        text: `Check out this awesome artwork by Crom's Overtures!`,
                        url: `${e.target.previousElementSibling.src}`
                    };
                    try {
                        if (navigator.share) {
                            await navigator.share(shareData);
                            console.log('Shared successfully via Web Share API');
                        } else {
                            const fallbackOptions = `
                                <div class="share-fallback">
                                    <p>Share this artwork:</p>
                                    <button onclick="copyToClipboard('${e.target.previousElementSibling.src}')">Copy Link</button>
                                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}" target="_blank">Share on Twitter</a>
                                    <a href="https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareData.url)}" target="_blank">Share on Facebook</a>
                                </div>
                            `;
                            const fallbackLightbox = document.createElement('div');
                            fallbackLightbox.className = 'share-fallback-lightbox';
                            fallbackLightbox.innerHTML = fallbackOptions;
                            fallbackLightbox.addEventListener('click', (e) => {
                                if (e.target === fallbackLightbox) {
                                    fallbackLightbox.remove();
                                    document.body.classList.remove('lightbox-open');
                                }
                            });
                            document.body.appendChild(fallbackLightbox);
                            document.body.classList.add('lightbox-open');
                        }
                    } catch (err) {
                        console.error('Error sharing:', err);
                        alert('An error occurred while sharing. Try copying the link manually.');
                    }
                }
            });
            document.body.appendChild(lightbox);
            document.body.classList.add('lightbox-open');
        }
    });
    updateGallery();
}

    function changeMonth(direction) {
        console.log(`Change month: direction ${direction}`);
        const originalMonth = currentDate.getMonth();
        currentDate.setMonth(currentDate.getMonth() + direction);

        if (currentDate.getFullYear() !== 2025 || currentDate.getMonth() < 4) {
            currentDate = new Date('2025-05-01');
            console.log("Limited to May 2025");
        
        } else if (currentDate.getMonth() > 6) {
            currentDate = new Date('2025-07-01');
            console.log("Limited to July 2025");
        }

        if (originalMonth !== currentDate.getMonth()) {
            console.log(`Month changed from ${monthNames[originalMonth]} to ${monthNames[currentDate.getMonth()]}`);
            updateGallery();
        } else {
            console.log("No month change");
        }
    }

    const prevMonthButton = document.querySelector('.gallery-prev');
    const nextMonthButton = document.querySelector('.gallery-next');
    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', () => {
            console.log("Previous month button clicked");
            changeMonth(-1);
        });
        prevMonthButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            console.log("Previous month button touched");
            changeMonth(-1);
        });
        console.log("Previous month button event listeners added");
    } else {
        console.error("Previous month button not found");
    }
    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', () => {
            console.log("Next month button clicked");
            changeMonth(1);
        });
        nextMonthButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            console.log("Next month button touched");
            changeMonth(1);
        });
        console.log("Next month button event listeners added");
    } else {
        console.error("Next month button not found");
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && document.querySelector('.gallery')) {
            console.log("Left arrow key pressed for gallery");
            changeMonth(-1);
        } else if (e.key === 'ArrowRight' && document.querySelector('.gallery')) {
            console.log("Right arrow key pressed for gallery");
            changeMonth(1);
        }
    });

    // Load guestbook messages on startup
    if (document.getElementById('guestbook-messages')) {
        loadGuestbookMessages();
    }

    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('click', () => {
            console.log("Logo clicked, redirecting to index.html");
            window.location.href = 'index.html';
        });
        logo.addEventListener('touchstart', (e) => {
            e.preventDefault();
            console.log("Logo touched, redirecting to index.html");
            window.location.href = 'index.html';
        });
    });
});
