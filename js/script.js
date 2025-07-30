// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Débogage pour mobile
    console.log("Device width: ", window.innerWidth);
    console.log("Device height: ", window.innerHeight);
    console.log(`Logo event listener added for ${window.location.pathname}`);

    // Positionner la bannière sous le header
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

    // Appeler au chargement et au redimensionnement
    positionBanner();
    window.addEventListener('resize', positionBanner);

    // Menu hamburger
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
    if (!carouselContainer) {
        console.error("Carousel container not found. Check index.html for <div id='carousel-container'>");
    } else {
        console.log("Carousel container found");
        const carouselItemsCount = 44;
        let currentIndex = 0;

        for (let i = 1; i <= carouselItemsCount; i++) {
            const index = i.toString().padStart(3, '0');
            const div = document.createElement('div');
            div.className = 'carousel-item';
            div.innerHTML = `<img src="img/cromsovertures_fantasy_artwork_202507_${index}-carousel.jpg" alt="Fantasy artwork ${index} by Crom's Overtures, July 2025" loading="lazy">`;
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
            if (next) {
                currentIndex = (currentIndex + 1) % carouselItemsCount;
            } else {
                currentIndex = (currentIndex - 1 + carouselItemsCount) % carouselItemsCount;
            }
            updateCarousel();
        }

        carouselContainer.addEventListener('click', (e) => {
            const rect = carouselContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const centerX = rect.width / 2;
            console.log(`Carousel clicked at x: ${clickX}, center: ${centerX}`);
            if (clickX < centerX - 50) {
                handleCarouselMove(false);
            } else if (clickX > centerX + 50) {
                handleCarouselMove(true);
            } else {
                handleCarouselMove(true);
            }
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
            if (touchX < centerX - 50) {
                handleCarouselMove(false);
            } else if (touchX > centerX + 50) {
                handleCarouselMove(true);
            } else {
                handleCarouselMove(true);
            }
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
    }

    // Gallery functionality
    console.log("Initializing gallery");
    const galleryImages = document.getElementById('gallery-images');
    const currentMonth = document.getElementById('current-month');
    let currentDate = new Date('2025-07-01');
    let loadedImages = 0;
    const imagesPerBatch = 10;

    function updateGallery() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = monthNames[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        const monthNumber = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        currentMonth.textContent = `${month} ${year}`;
        console.log(`Updating gallery to ${month} ${year}`);

        loadedImages = 0;
        galleryImages.innerHTML = '<div id="gallery-sentinel" class="gallery-sentinel"></div>';

        let maxImages = 0;
        if (month === 'June' && year === 2025) {
            maxImages = 100;
        } else if (month === 'July' && year === 2025) {
            maxImages = 107;
        } else {
            maxImages = 0;
        }

        if (maxImages === 0) {
            galleryImages.innerHTML = '<p>No images available for this month. Visit our Link Tree: <a href="https://linktr.ee/cromsovertures">cromsovertures</a></p>';
            return;
        }

        loadImageBatch(maxImages, month, year, monthNumber);
    }

    function loadImageBatch(maxImages, month, year, monthNumber) {
        const sentinel = document.getElementById('gallery-sentinel');
        const endIndex = Math.min(loadedImages + imagesPerBatch, maxImages);
        console.log(`Loading batch: images ${loadedImages + 1} to ${endIndex} of ${maxImages}`);
        for (let i = loadedImages + 1; i <= endIndex; i++) {
            const index = i.toString().padStart(3, '0');
            const img = document.createElement('img');
            img.src = `img/gallery/${month.toLowerCase()}_${year}/cromsovertures_fantasy_artwork_2025${monthNumber}_${index}-thumb.jpg`;
            img.alt = `Fantasy artwork ${i} by Crom's Overtures, ${month} ${year}`;
            img.loading = 'lazy';
            img.dataset.fullSrc = `img/gallery/${month.toLowerCase()}_${year}/cromsovertures_fantasy_artwork_2025${monthNumber}_${index}-enlarged.jpg`;
            img.style.opacity = '0';
            img.onerror = () => {
                img.src = 'img/fallback-image.jpg';
                img.alt = 'Image not available';
            };
            galleryImages.insertBefore(img, sentinel);
            setTimeout(() => {
                img.style.opacity = '1';
            }, (i - loadedImages) * 50);
        }

        loadedImages = endIndex;
        console.log(`Loaded ${loadedImages} of ${maxImages} images`);

        if (loadedImages < maxImages && sentinel) {
            const observer = new IntersectionObserver((entries, observer) => {
                if (entries[0].isIntersecting) {
                    console.log("Sentinel intersected, loading next batch");
                    loadImageBatch(maxImages, month, year, monthNumber);
                }
                if (loadedImages >= maxImages) {
                    observer.unobserve(sentinel);
                    console.log("All images loaded, observer stopped");
                }
            }, { rootMargin: '500px', threshold: 0.1 });

            observer.observe(sentinel);
        }
    }

    if (galleryImages) {
        galleryImages.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.dataset.fullSrc) {
                const lightbox = document.createElement('div');
                lightbox.style.position = 'fixed';
                lightbox.style.top = '0';
                lightbox.style.left = '0';
                lightbox.style.width = '100%';
                lightbox.style.height = '100%';
                lightbox.style.background = 'rgba(0, 0, 0, 0.8)';
                lightbox.style.display = 'flex';
                lightbox.style.alignItems = 'center';
                lightbox.style.justifyContent = 'center';
                lightbox.style.zIndex = '1000';
                lightbox.innerHTML = `<img src="${e.target.dataset.fullSrc}" alt="${e.target.alt}" style="max-width: 90%; max-height: 90%;">`;
                lightbox.addEventListener('click', () => lightbox.remove());
                lightbox.addEventListener('touchstart', () => lightbox.remove());
                document.body.appendChild(lightbox);
            }
        });
    }

    function changeMonth(direction) {
        console.log(`Change month: direction ${direction}`);
        const originalMonth = currentDate.getMonth();
        currentDate.setMonth(currentDate.getMonth() + direction);

        if (currentDate.getFullYear() !== 2025 || currentDate.getMonth() < 5) {
            currentDate = new Date('2025-06-01');
            console.log("Limited to June 2025");
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

    if (galleryImages) {
        updateGallery();
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

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];