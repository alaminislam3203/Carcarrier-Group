document.addEventListener('DOMContentLoaded', () => {
      const menuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      const iconHamburger = document.getElementById('menu-icon-hamburger');
      const iconClose = document.getElementById('menu-icon-close');
      const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

      // Toggle Mobile Menu
      function toggleMenu(show) {
        const isExpanded = show !== undefined ? show : menuBtn.getAttribute('aria-expanded') !== 'true';
        menuBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

        if (isExpanded) {
          mobileMenu.classList.remove('hidden');
          iconHamburger.classList.add('hidden');
          iconClose.classList.remove('hidden');
        } else {
          mobileMenu.classList.add('hidden');
          iconHamburger.classList.remove('hidden');
          iconClose.classList.add('hidden');
        }
      }

      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      // Close mobile menu on clicking any link
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          toggleMenu(false);
        });
      });

      // Close on clicking outside
      document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
          toggleMenu(false);
        }
      });

      // Close on Escape key press
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
          toggleMenu(false);
          menuBtn.focus();
        }
      });

      // =========================================================================
      // HERO SLIDESHOW / CAROUSEL INTERACTIVE LOGIC (SAME AS STORIES.CARCARRIERGROUP.COM)
      // =========================================================================
      const carousel = document.getElementById('hero-carousel');
      if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const autoplayBtn = document.getElementById('carousel-autoplay-btn');
        const autoplayIndicator = document.getElementById('autoplay-indicator-dot');
        const autoplayText = document.getElementById('autoplay-status-text');

        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoplayEnabled = true;
        let autoplayTimer = null;
        const slideDuration = 3600; // 3.6 seconds per slide

        function updateSlide(targetIndex) {
          if (targetIndex === currentSlide && slides[currentSlide].classList.contains('opacity-100')) {
            return;
          }

          // Deactivate previous slide
          const prevSlide = slides[currentSlide];
          prevSlide.classList.remove('opacity-100', 'z-10', 'pointer-events-auto');
          prevSlide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
          prevSlide.setAttribute('aria-hidden', 'true');

          // Deactivate previous dot
          const prevDot = dots[currentSlide];
          prevDot.setAttribute('aria-current', 'false');
          const prevPill = prevDot.querySelector('.dot-pill');
          if (prevPill) {
            prevPill.classList.remove('w-6', 'bg-white', 'shadow-sm');
            prevPill.classList.add('w-2.5', 'bg-white/70');
          }

          // Update index
          currentSlide = (targetIndex + totalSlides) % totalSlides;

          // Activate new slide
          const nextSlide = slides[currentSlide];
          nextSlide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
          nextSlide.classList.add('opacity-100', 'z-10', 'pointer-events-auto');
          nextSlide.setAttribute('aria-hidden', 'false');

          // Activate new dot
          const nextDot = dots[currentSlide];
          nextDot.setAttribute('aria-current', 'true');
          const nextPill = nextDot.querySelector('.dot-pill');
          if (nextPill) {
            nextPill.classList.remove('w-2.5', 'bg-white/70');
            nextPill.classList.add('w-6', 'bg-white', 'shadow-sm');
          }
        }

        function nextSlide() {
          updateSlide(currentSlide + 1);
        }

        function prevSlide() {
          updateSlide(currentSlide - 1);
        }

        function startAutoplay() {
          stopAutoplay();
          if (autoplayEnabled) {
            autoplayTimer = setInterval(nextSlide, slideDuration);
          }
        }

        function stopAutoplay() {
          if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
          }
        }

        function toggleAutoplay() {
          autoplayEnabled = !autoplayEnabled;
          if (autoplayBtn) autoplayBtn.setAttribute('aria-pressed', autoplayEnabled ? 'true' : 'false');
          
          if (autoplayEnabled) {
            if (autoplayIndicator) autoplayIndicator.className = 'inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
            if (autoplayText) autoplayText.textContent = 'Autoplay on';
            startAutoplay();
          } else {
            if (autoplayIndicator) autoplayIndicator.className = 'inline-block w-2 h-2 rounded-full bg-slate-400';
            if (autoplayText) autoplayText.textContent = 'Autoplay off';
            stopAutoplay();
          }
        }

        // Dot click event
        dots.forEach((dot) => {
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
            updateSlide(targetIndex);
            if (autoplayEnabled) {
              startAutoplay(); // Reset timer on manual action
            }
          });
        });

        // Autoplay toggle button click
        if (autoplayBtn) {
          autoplayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleAutoplay();
          });
        }

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
          if (autoplayEnabled) stopAutoplay();
        });

        carousel.addEventListener('mouseleave', () => {
          if (autoplayEnabled) startAutoplay();
        });

        // Keyboard navigation (Arrow keys when carousel is focused)
        carousel.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') {
            nextSlide();
            if (autoplayEnabled) startAutoplay();
          } else if (e.key === 'ArrowLeft') {
            prevSlide();
            if (autoplayEnabled) startAutoplay();
          }
        });

        // Touch swipe support for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const swipeDiff = touchEndX - touchStartX;
          if (Math.abs(swipeDiff) > 40) {
            if (swipeDiff < 0) {
              nextSlide(); // swipe left -> next slide
            } else {
              prevSlide(); // swipe right -> previous slide
            }
            if (autoplayEnabled) startAutoplay();
          }
        }, { passive: true });

        // Start autoplay on page load
        startAutoplay();
      }

            // =========================================================================
      // DYNAMIC 1:1 REPLICA STORIES FILTERING & RENDERING SYSTEM
      // =========================================================================
      const allStoriesData = [
  {
    "_id": "6adbe2959c41e8a898fd9295",
    "title": "Georgia to California: A Car Delivered 4 Days Ahead of Schedule!",
    "slug": "georgia-to-california-a-car-delivered-4-days-ahead-of-schedule",
    "metaDescription": "Ship your car from Georgia to California with Car Carrier Group. Enjoy responsive communication and reliable cross-country auto transport. Get a quote today!",
    "pickupLocation": "Georgia",
    "destination": "California",
    "shipmentType": "Vehicle",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-23T22:41:25.396Z",
    "updatedAt": "2026-10-24T16:05:02.001Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/georgia-to-california-a-car-delivered-4-days-ahead-of-schedule.jpg",
    "imageAlt": "",
    "coverPosition": {
      "x": 2,
      "y": 7
    }
  },
  {
    "_id": "6adbe0ba9c41e8a898fd927a",
    "title": "Humvee Delivered on Time: Professional Military Vehicle Transport You Can Trust",
    "slug": "humvee-delivered-on-time-professional-military-vehicle-transport-you-can-trust",
    "metaDescription": "Ship your Humvee from Georgia to Florida with Car Carrier Group. Discover professional vehicle transport, clear communication, and dependable delivery.",
    "pickupLocation": "Albany, Georgia",
    "destination": "South Florida",
    "shipmentType": "Humvee",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-23T22:33:30.713Z",
    "updatedAt": "2026-10-24T16:16:30.846Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/humvee-delivered-on-time-professional-military-vehicle-transport-you-can-trust.jpg",
    "imageAlt": "",
    "coverPosition": {
      "x": 38,
      "y": 10
    }
  },
  {
    "_id": "6adbdde79c41e8a898fd9265",
    "title": "From the Bay Area to Southern California: A Smooth Car Shipping Experience.",
    "slug": "from-the-bay-area-to-southern-california-a-smooth-car-shipping-experience",
    "metaDescription": "Ship your car from the Bay Area to Southern California with Car Carrier Group. Enjoy clear communication and professional service. Request a quote today!",
    "pickupLocation": "Bay Area",
    "destination": "Southern California",
    "shipmentType": "Vehicle",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-23T22:21:27.938Z",
    "updatedAt": "2026-10-24T16:23:54.594Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/from-the-bay-area-to-southern-california-a-smooth-car-shipping-experience.jpg",
    "imageAlt": "",
    "coverPosition": {
      "x": 15,
      "y": 5
    }
  },
  {
    "_id": "6adbdb739c41e8a898fd9247",
    "title": "A Classic Car Dream Delivered: Shipping a 1965 Buick Skylark from Minnesota to California",
    "slug": "a-classic-car-dream-delivered-shipping-a-1965-buick-skylark-from-minnesota-to-california",
    "metaDescription": "Ship your classic car from Minnesota to California with Car Carrier Group. Discover reliable vintage car transport solutions and request a quote today.",
    "pickupLocation": "Minnesota",
    "destination": "California",
    "shipmentType": "1965 Buick Skylark",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-23T22:10:59.800Z",
    "updatedAt": "2026-10-24T16:38:02.356Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/a-classic-car-dream-delivered-shipping-a-1965-buick-skylark-from-minnesota-to-california.jpg",
    "imageAlt": "",
    "coverPosition": {
      "x": 50,
      "y": 20
    }
  },
  {
    "_id": "6ada80f19c41e8a898fd912e",
    "title": "From Houston to Fairfax: A College Student’s Car Shipping Experience with Car Carrier Group",
    "slug": "from-houston-to-fairfax-a-college-students-car-shipping-experience-with-car-carrier-group",
    "metaDescription": "Shipping your car to college? Car Carrier Group helps students arrange reliable auto transport from Houston to Fairfax and nationwide. Get a quote today.",
    "pickupLocation": "Texas",
    "destination": "Virginia",
    "shipmentType": "Jeep Compass",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-22T21:32:33.164Z",
    "updatedAt": "2026-10-24T15:45:16.745Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/from-houston-to-fairfax-a-college-students-car-shipping-experience-with-car-carrier-group.jpg",
    "imageAlt": "",
    "coverPosition": {
      "x": 33,
      "y": 20
    }
  },
  {
    "_id": "6ada51639c41e8a898fd9102",
    "title": "From Military HMMWV Transport to Kubota Tractor Shipping: A Customer’s Second Experience with Car Carrier Group",
    "slug": "from-military-hmmwv-transport-to-kubota-tractor-shipping-a-customers-second-experience-with-car-carrier-group",
    "metaDescription": "Ship military HMMWVs, trailers, and Kubota tractors with Car Carrier Group. Get reliable equipment transport solutions and request your shipping quote today.",
    "pickupLocation": "Hampshire",
    "destination": "Georgia",
    "shipmentType": "Military HMMWV",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-22T18:09:39.846Z",
    "updatedAt": "2026-10-24T16:13:33.686Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/from-military-hmmwv-transport-to-kubota-tractor-shipping-a-customers-second-experience-with-car-carrier-group.jpg",
    "imageAlt": "",
    "coverPosition": {
      "x": 2,
      "y": 9
    }
  },
  {
    "_id": "6ada4c8e9c41e8a898fd90d5",
    "title": "Shipping a Classic 1960 C1 Corvette from California to Florida: A Customer Success Story",
    "slug": "shipping-a-classic-1960-c1-corvette-from-california-to-florida-a-customer-success-story",
    "metaDescription": "Ship your Corvette from California to Florida with Car Carrier Group. Enjoy reliable service, clear communication, and personalized classic car shipping quotes.",
    "pickupLocation": "California",
    "destination": "Florida",
    "shipmentType": "1959 Corvette",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-22T17:49:02.507Z",
    "updatedAt": "2026-10-24T16:44:18.684Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/shipping-a-classic-1960-c1-corvette-from-california-to-florida-a-customer-success-story.jpg",
    "imageAlt": "Content of the embedded image:  A photograph of a classic blue 1959 Chevrolet Corvette C1 convertible.  The car is in motion on a coastal road at sunset.  Hills and the ocean are visible in the background, out of focus.  The car is the primary focus, shown from the front-quarter perspective.",
    "coverPosition": {
      "x": 9,
      "y": 3
    }
  },
  {
    "_id": "6ad10f1d0d3b61242e689587",
    "title": "Pallet Shipping Problem Solved: Moving a Wacker Neuson Vibratory Compactor",
    "slug": "pallet-shipping-problem-solved-moving-a-wacker-neuson-vibratory-compactor",
    "metaDescription": "Need pallet shipping? Car Carrier Group solves LTL freight challenges with reliable transport for palletized vibratory compactors. Get a quote today..",
    "pickupLocation": "Satillo,MS",
    "destination": "Brentwood,N.Y.",
    "shipmentType": "Wacker Neuson Vibratory Compactor",
    "shipmentStatus": "in_transit",
    "createdAt": "2026-10-15T17:36:29.333Z",
    "updatedAt": "2026-10-24T16:57:23.028Z",
    "serviceLine": "freight",
    "isPublished": true,
    "image": "public/stories/pallet-shipping-problem-solved-moving-a-wacker-neuson-vibratory-compactor.jpg",
    "imageAlt": "",
    "coverPosition": {
      "x": 50,
      "y": 50
    }
  },
  {
    "_id": "6ad0ee8c0d3b61242e689477",
    "title": "From California to Massachusetts: Personalized Car Shipping Service That Makes Customers Feel Like #1",
    "slug": "from-california-to-massachusetts-personalized-car-shipping-service-that-makes-customers-feel-like-1",
    "metaDescription": "Discover how Car Carrier Group helped Anissa ship her son’s car from California to Massachusetts with personal service, clear communication, and pickup support.",
    "pickupLocation": "California",
    "destination": "Massachusetts",
    "shipmentType": "Mazda CX-5 crossover SUV",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-15T15:17:32.918Z",
    "updatedAt": "2026-10-15T17:30:58.086Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/from-california-to-massachusetts-personalized-car-shipping-service-that-makes-customers-feel-like-1.jpg",
    "imageAlt": "Image Description:  A red SUV rests on a flatbed car trailer outdoors under a clear blue sky with mountains in the background. In the top right corner, the blue and white \"CAR CARRIER GROUP\" logo displays the text \"CAR CARRIER GROUP\" and \"YOUR RELIABLE SHIPPING PARTNER",
    "coverPosition": {
      "x": 50,
      "y": 50
    }
  },
  {
    "_id": "6ad0e7c80d3b61242e689463",
    "title": "From Texas to California: A Parent’s Peace of Mind with Car Carrier Group",
    "slug": "from-texas-to-california-a-parents-peace-of-mind-with-car-carrier-group",
    "metaDescription": "Discover Paul Wood’s experience shipping his daughter’s car from Texas to California with Car Carrier Group’s reliable service and professional drivers.",
    "pickupLocation": "Texas",
    "destination": "California",
    "shipmentType": "Volvo S90",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-15T14:48:40.729Z",
    "updatedAt": "2026-10-21T21:51:20.467Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/from-texas-to-california-a-parents-peace-of-mind-with-car-carrier-group.jpg",
    "imageAlt": "Image description: A silver Volvo S90 sedan loaded on a transport trailer at night. Header text reads \"CAR CARRIER GROUP - PREMIUM AUTO LOGISTICS. SAFE, SECURE, PROFESSIONAL.\" The central logo reads \"CAR CARRIER GROUP - YOUR RELIABLE SHIPPING PARTNER.\"",
    "coverPosition": {
      "x": 50,
      "y": 50
    }
  },
  {
    "_id": "6acd0f112683f5724c0d9105",
    "title": "LTL Shipment",
    "slug": "transport-tool-boxes-on-pallets",
    "metaDescription": "LTL Shipment.  Pallet transport Tool Box Shipping",
    "pickupLocation": "Red rock,AZ",
    "destination": "South River,N.J.",
    "shipmentType": "LTL",
    "shipmentStatus": "in_transit",
    "createdAt": "2026-10-12T16:47:13.923Z",
    "updatedAt": "2026-10-13T17:52:49.834Z",
    "serviceLine": "freight",
    "isPublished": true,
    "image": "public/stories/transport-tool-boxes-on-pallets.jpg",
    "imageAlt": "LTL car Shipping by car carrier group",
    "coverPosition": {
      "x": 50,
      "y": 50
    }
  },
  {
    "_id": "6ac7bff72683f5724c0d8c5b",
    "title": "Ship Humvee Limo",
    "slug": "ship-humvee-limo",
    "metaDescription": "Need to ship a Hummer limo or heavy vehicle? Car Carrier Group handled the nationwide transport of a 39-ft, 14-passenger Humvee limo, providing reliable freight, vehicle, and heavy equipment shipping from pickup to delivery.",
    "pickupLocation": "Washington",
    "destination": "Texas",
    "shipmentType": "Heavy equipment",
    "shipmentStatus": "delivered",
    "createdAt": "2026-10-08T16:08:23.757Z",
    "updatedAt": "2026-10-13T04:36:50.813Z",
    "serviceLine": "heavy-equipment",
    "isPublished": true,
    "image": "public/stories/ship-humvee-limo.jpg",
    "imageAlt": "Humvee Limo on trailer",
    "coverPosition": {
      "x": 50,
      "y": 50
    }
  },
  {
    "_id": "6abe7d497ad892f5bdf164e5",
    "title": "Vehicle Shipping, General Freight Shipping, Heavy Equipment Shipping",
    "slug": "vehicle-shipping-general-freight-shipping-heavy-equipment-shipping",
    "metaDescription": "We transported this Humvee to Aladdin,WY from Florida 6 months ago and now they are moving their warehouse to Dayton,NV.   Happy to help our clients when needed.  Car Carrier Group loves coming through for our clients.",
    "pickupLocation": "Aladdin,",
    "destination": "Dayton",
    "shipmentType": "Vehicle Transport",
    "shipmentStatus": "in_transit",
    "createdAt": "2026-10-01T15:33:29.767Z",
    "updatedAt": "2026-10-08T11:41:23.094Z",
    "serviceLine": "vehicle",
    "isPublished": true,
    "image": "public/stories/vehicle-shipping-general-freight-shipping-heavy-equipment-shipping.jpg",
    "imageAlt": "2000 Am General M9998",
    "coverPosition": {
      "x": 50,
      "y": 50
    }
  }
];

      const ef = [
        {
          label: "Vehicle Shipping",
          matches: e => {
            const t = (e.shipmentType || "").toLowerCase().trim();
            const r = (e.serviceLine || "").toLowerCase().trim();
            const l = (e.title || "").toLowerCase().trim();
            return r ? r === "vehicle" : !!(t === "vehicle shipping" || t.includes("vehicle") || /vehicle|car|auto|truck|suv|motorcycle|bike|van|sedan|coupe|transport/.test(t) || /\b(car|auto|truck|vehicle|suv|sedan|motorcycle)\b/.test(l));
          }
        },
        {
          label: "Freight",
          matches: e => {
            const t = (e.shipmentType || "").toLowerCase().trim();
            const r = (e.serviceLine || "").toLowerCase().trim();
            const l = (e.title || "").toLowerCase().trim();
            return r ? r === "freight" : !!(t === "freight" || t.includes("freight") || /freight|cargo|pallet|ltl|ftl|dry van|flatbed|box truck|commercial/.test(t) || /\b(freight|cargo|pallet|ltl|ftl)\b/.test(l));
          }
        },
        {
          label: "Heavy Equipment",
          matches: e => {
            const t = (e.shipmentType || "").toLowerCase().trim();
            const r = (e.serviceLine || "").toLowerCase().trim();
            const l = (e.title || "").toLowerCase().trim();
            return r ? r === "heavy-equipment" : !!(t === "heavy equipment" || t.includes("heavy") || t.includes("equipment") || /heavy|equipment|machin|tractor|excavat|industrial|oversize|crane|loader|dozer|forklift/.test(t) || /\b(heavy|equipment|machinery|tractor|excavator|crane|dozer|forklift)\b/.test(l));
          }
        },
        {
          label: "Classic & Exotic",
          matches: e => {
            const t = (e.shipmentType || "").toLowerCase().trim();
            const r = (e.title || "").toLowerCase().trim();
            return !!(t === "classic & exotic" || t.includes("classic") || t.includes("exotic") || /classic|exotic|vintage|antique|muscle|luxury|sport|collector/.test(t) || /\b(classic|exotic|vintage|antique|muscle|collector|camaro|corvette|mustang|ferrari|porsche)\b/.test(r));
          }
        }
      ];

      const filterTabs = document.querySelectorAll('#stories-tabs-bar .filter-tab');
      const featuredSlot = document.getElementById('featured-story-slot');
      const gridSlot = document.getElementById('grid-stories-slot');
      const noStoriesNotice = document.getElementById('no-stories-notice');
      const noStoriesText = document.getElementById('no-stories-text');
      const resetFilterBtn = document.getElementById('reset-filter-btn');

      function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      function renderFeaturedCard(story) {
        const posX = story.coverPosition?.x ?? 50;
        const posY = story.coverPosition?.y ?? 50;
        const locationMarkup = (story.pickupLocation || story.destination) ? `
          <div class="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0a192f] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-slate-500" aria-hidden="true">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${escapeHtml(story.pickupLocation)}</span>
            ${story.destination ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-slate-400" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
            <span>${escapeHtml(story.destination)}</span>` : ''}
          </div>` : '';

        return `
          <div class="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm hover:shadow-md group transition-all duration-300">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <a class="lg:col-span-6 relative w-full h-[260px] sm:h-[340px] md:h-[380px] rounded-xl overflow-hidden block bg-slate-100" href="/stories/${story.slug}">
                <img alt="${escapeHtml(story.imageAlt || story.title)}" loading="lazy" decoding="async" class="object-cover w-full h-full story-cover transition-transform duration-500 group-hover:scale-[1.02]" style="object-position: ${posX}% ${posY}%" src="${story.image}" />
              </a>
              <div class="lg:col-span-6 flex flex-col justify-center lg:pr-6">
                <div class="flex items-center gap-3 mb-4">
                  <span class="bg-slate-100 text-[#0a192f] text-[11px] font-bold font-exo2 tracking-wider px-2.5 py-1 rounded-sm uppercase">${escapeHtml(story.shipmentType || "Real Shipment")}</span>
                  <span class="text-xs text-slate-400 font-normal">Shipment story</span>
                </div>
                ${locationMarkup}
                <a href="/stories/${story.slug}">
                  <h3 class="text-2xl sm:text-3xl font-bold font-exo2 text-[#0a192f] leading-snug tracking-tight mb-4 hover:text-[#0d2861] transition-colors">${escapeHtml(story.title)}</h3>
                </a>
                <p class="text-sm sm:text-base text-slate-500 font-normal leading-relaxed mb-6 max-w-xl line-clamp-3">${escapeHtml(story.metaDescription || '')}</p>
                <a class="inline-flex items-center gap-1.5 text-sm font-bold font-exo2 text-[#0d2861] hover:text-[#091b42] transition-colors" href="/stories/${story.slug}">
                  Read Full Story
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>`;
      }

      function renderGridCard(story) {
        const posX = story.coverPosition?.x ?? 50;
        const posY = story.coverPosition?.y ?? 50;
        const locationMarkup = (story.pickupLocation || story.destination) ? `
          <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 flex-shrink-0 text-slate-400" aria-hidden="true">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="truncate">Pickup: ${escapeHtml(story.pickupLocation)} ${story.destination ? '→ Destination: ' + escapeHtml(story.destination) : ''}</span>
          </div>` : '';

        return `
          <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md group transition-all duration-300">
            <a class="relative w-full aspect-[16/10] block overflow-hidden bg-slate-100" href="/stories/${story.slug}">
              <img alt="${escapeHtml(story.imageAlt || story.title)}" loading="lazy" decoding="async" class="object-cover w-full h-full story-cover transition-transform duration-500 group-hover:scale-105" style="object-position: ${posX}% ${posY}%" src="${story.image}" />
            </a>
            <div class="p-6 flex flex-col flex-1">
              <span class="text-[11px] font-bold font-exo2 tracking-wider text-slate-700 uppercase mb-3">${escapeHtml(story.shipmentType || "Shipment")}</span>
              ${locationMarkup}
              <a href="/stories/${story.slug}">
                <h3 class="text-lg font-bold font-exo2 text-[#0a192f] tracking-tight mb-3 line-clamp-1 hover:text-[#0d2861] transition-colors">${escapeHtml(story.title)}</h3>
              </a>
              <p class="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6 flex-1 line-clamp-2">${escapeHtml(story.metaDescription || '')}</p>
              <a class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold font-exo2 text-[#0d2861] hover:text-[#091b42] transition-colors pt-2" href="/stories/${story.slug}">
                Read Story
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>`;
      }

      function filterCategory(categoryLabel, activeTab) {
        // Update tab styling
        filterTabs.forEach((tab) => {
          tab.setAttribute('aria-pressed', 'false');
          tab.className = 'filter-tab whitespace-nowrap px-4 py-2.5 rounded-lg text-xs sm:text-[13px] font-bold font-exo2 transition-colors cursor-pointer shrink-0 bg-white border border-slate-200/80 text-[#0a192f] hover:bg-slate-50 hover:border-slate-300';
        });

        if (activeTab) {
          activeTab.setAttribute('aria-pressed', 'true');
          activeTab.className = 'filter-tab whitespace-nowrap px-4 py-2.5 rounded-lg text-xs sm:text-[13px] font-bold font-exo2 transition-colors cursor-pointer shrink-0 bg-[#0d2861] text-white shadow-sm';
        }

        // Filter stories using identical live logic
        let filtered = allStoriesData;
        if (categoryLabel !== "All Stories" && categoryLabel !== "View All") {
          const filterRule = ef.find(f => f.label === categoryLabel);
          if (filterRule) {
            filtered = allStoriesData.filter(filterRule.matches);
          } else {
            const low = categoryLabel.toLowerCase().trim();
            filtered = allStoriesData.filter(item => {
              const st = (item.shipmentType || "").toLowerCase().trim();
              return st === low || st.includes(low) || low.includes(st);
            });
          }
        }

        // Render matching stories with micro-animation
        const container = document.getElementById('stories-content-container');
        if (container) {
          container.style.opacity = '0';
          container.style.transform = 'translateY(8px)';
          container.style.transition = 'opacity 200ms ease, transform 200ms ease';

          setTimeout(() => {
            if (filtered.length === 0) {
              if (featuredSlot) featuredSlot.innerHTML = '';
              if (gridSlot) gridSlot.innerHTML = '';
              if (noStoriesNotice) {
                noStoriesNotice.classList.remove('hidden');
                if (noStoriesText) noStoriesText.textContent = 'There are no published stories in "' + categoryLabel + '" right now.';
              }
            } else {
              if (noStoriesNotice) noStoriesNotice.classList.add('hidden');
              const featuredItem = filtered[0];
              const gridItems = filtered.slice(1);

              if (featuredSlot) featuredSlot.innerHTML = renderFeaturedCard(featuredItem);
              if (gridSlot) {
                gridSlot.innerHTML = gridItems.map(renderGridCard).join('');
              }
            }

            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
          }, 180);
        }
      }

      filterTabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const category = tab.getAttribute('data-category') || 'All Stories';
          filterCategory(category, tab);
        });
      });

      if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
          const allTab = document.querySelector('#stories-tabs-bar .filter-tab[data-category="All Stories"]');
          filterCategory('All Stories', allTab);
        });
      }
    });
