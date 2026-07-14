/* ==========================================================================
   CHITWAN JUNGLE SAFARI TOURS - INTERACTIVE LOGIC (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navigation Header on Scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav-menu');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      const isExpanded = nav.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Smooth Navigation Link Highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul li a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // PRICING CALCULATOR CONSTANTS & RULES
  const RATES = {
    permits: {
      international: 2000,
      saarc: 1000,
      domestic: 150
    },
    walking: {
      base_5: 10000, // up to 5 people
      base_8_9: 20000, // 8-9 people
      extra_guide: 5000 // cost for extra guide tier
    },
    jeep: {
      shared_4h: 2000,
      half_private: 18500,
      full_private: 27500,
      guide_4h: 3000,
      guide_1d: 5000
    },
    canoeing: {
      m30: 1000,
      h1: 2000,
      h3: 5800,
      guide: 1500
    },
    accommodation: {
      tower: 7000, // per bed
      homestay: 9500, // per room (up to 2 people)
      tower_guide: 2500
    },
    tharu_tour: 3000 // flat guide fee
  };

  // Get Calculator Elements
  const groupSizeInput = document.getElementById('calc-group-size');
  const permitTypeSelect = document.getElementById('calc-permit-type');
  const safariTypeSelect = document.getElementById('calc-safari-type');
  const jeepGuideCheckbox = document.getElementById('calc-jeep-guide');
  const canoeingSelect = document.getElementById('calc-canoeing');
  const canoeGuideCheckbox = document.getElementById('calc-canoe-guide');
  const accommodationSelect = document.getElementById('calc-accommodation');
  const tharuTourCheckbox = document.getElementById('calc-tharu-tour');

  // Breakdown Output Elements
  const breakdownPermits = document.getElementById('bd-permits');
  const breakdownSafari = document.getElementById('bd-safari');
  const breakdownCanoe = document.getElementById('bd-canoe');
  const breakdownAccommodation = document.getElementById('bd-accommodation');
  const breakdownTharu = document.getElementById('bd-tharu');
  const breakdownGuides = document.getElementById('bd-guides');
  const breakdownTotalNpr = document.getElementById('bd-total-npr');
  const breakdownTotalUsd = document.getElementById('bd-total-usd');

  // Get Booking Form Elements
  const bookingMessage = document.getElementById('booking-message');

  // Calculate pricing function
  function calculatePrice() {
    if (!groupSizeInput) return;

    const groupSize = parseInt(groupSizeInput.value) || 1;
    const permitType = permitTypeSelect.value;
    const safariType = safariTypeSelect.value;
    const hasJeepGuide = jeepGuideCheckbox.checked;
    const canoeingType = canoeingSelect.value;
    const hasCanoeGuide = canoeGuideCheckbox.checked;
    const accommodationType = accommodationSelect.value;
    const hasTharuTour = tharuTourCheckbox.checked;

    let permitCost = RATES.permits[permitType] * groupSize;
    let safariCost = 0;
    let canoeCost = 0;
    let accommodationCost = 0;
    let tharuCost = 0;
    let guideCost = 0;

    // 1. Walking Safari pricing rules
    if (safariType === 'walking') {
      if (groupSize <= 5) {
        safariCost = RATES.walking.base_5; // Rs 10,000 (includes 2 guides)
      } else if (groupSize <= 7) {
        safariCost = RATES.walking.base_5 + RATES.walking.extra_guide; // Rs 15,000 (3 guides)
      } else if (groupSize <= 9) {
        safariCost = RATES.walking.base_8_9; // Rs 20,000 (includes 4 guides)
      } else {
        // 10 people
        safariCost = RATES.walking.base_8_9 + RATES.walking.extra_guide; // Rs 25,000 (5 guides)
      }
    } 
    // 2. Jeep Safari pricing rules
    else if (safariType === 'jeep-shared') {
      safariCost = RATES.jeep.shared_4h; // Rs 2,000 (no guide fee)
    } else if (safariType === 'jeep-half') {
      safariCost = RATES.jeep.half_private; // Rs 18,500
      if (hasJeepGuide) {
        guideCost += RATES.jeep.guide_4h; // Rs 3,000 guide fee
      }
    } else if (safariType === 'jeep-full') {
      safariCost = RATES.jeep.full_private; // Rs 27,500
      if (hasJeepGuide) {
        guideCost += RATES.jeep.guide_1d; // Rs 5,000 guide fee
      }
    }

    // 3. Canoeing pricing rules
    if (canoeingType === '30m') {
      canoeCost = RATES.canoeing.m30;
      if (hasCanoeGuide) guideCost += RATES.canoeing.guide;
    } else if (canoeingType === '1h') {
      canoeCost = RATES.canoeing.h1;
      if (hasCanoeGuide) guideCost += RATES.canoeing.guide;
    } else if (canoeingType === '3h') {
      canoeCost = RATES.canoeing.h3;
      if (hasCanoeGuide) guideCost += RATES.canoeing.guide;
    }

    // 4. Accommodation pricing rules
    if (accommodationType === 'tower') {
      accommodationCost = RATES.accommodation.tower * groupSize; // Rs 7,000 per bed
      accommodationCost += RATES.accommodation.tower_guide; // Rs 2,500 guide fee (mandatory for safety in the jungle tower night)
    } else if (accommodationType === 'homestay') {
      const roomsNeeded = Math.ceil(groupSize / 2);
      accommodationCost = RATES.accommodation.homestay * roomsNeeded; // Rs 9,500 per room
    }

    // 5. Tharu Village Tour flat guide fee
    if (hasTharuTour) {
      tharuCost = RATES.tharu_tour; // Rs 3,000
    }

    // Totals
    const totalNpr = permitCost + safariCost + canoeCost + accommodationCost + tharuCost + guideCost;
    const totalUsd = Math.round(totalNpr / 133); // 1 USD = 133 NPR approx.

    // Update UI elements
    if (breakdownPermits) breakdownPermits.textContent = `Rs ${permitCost.toLocaleString()}`;
    if (breakdownSafari) breakdownSafari.textContent = `Rs ${safariCost.toLocaleString()}`;
    if (breakdownCanoe) breakdownCanoe.textContent = `Rs ${canoeCost.toLocaleString()}`;
    if (breakdownAccommodation) breakdownAccommodation.textContent = `Rs ${accommodationCost.toLocaleString()}`;
    if (breakdownTharu) breakdownTharu.textContent = `Rs ${tharuCost.toLocaleString()}`;
    if (breakdownGuides) breakdownGuides.textContent = `Rs ${guideCost.toLocaleString()}`;
    if (breakdownTotalNpr) breakdownTotalNpr.textContent = `Rs ${totalNpr.toLocaleString()}`;
    if (breakdownTotalUsd) breakdownTotalUsd.textContent = `$${totalUsd.toLocaleString()}`;

    // Auto-populate booking form text message
    updateBookingTemplate({
      groupSize,
      permitType,
      safariType,
      hasJeepGuide,
      canoeingType,
      hasCanoeGuide,
      accommodationType,
      hasTharuTour,
      totalNpr,
      totalUsd
    });
  }

  // Pre-fill booking message based on selection
  function updateBookingTemplate(data) {
    if (!bookingMessage) return;

    let safariName = 'None';
    if (data.safariType === 'walking') safariName = 'Walking Safari (Guide Guided)';
    else if (data.safariType === 'jeep-shared') safariName = 'Shared Jeep Safari (4-hr)';
    else if (data.safariType === 'jeep-half') safariName = `Half-Day Private Jeep Safari (${data.hasJeepGuide ? 'with guide' : 'without guide'})`;
    else if (data.safariType === 'jeep-full') safariName = `Full-Day Private Jeep Safari (${data.hasJeepGuide ? 'with guide' : 'without guide'})`;

    let canoeName = 'None';
    if (data.canoeingType === '30m') canoeName = `Canoeing 30 Mins (${data.hasCanoeGuide ? 'with guide' : 'without guide'})`;
    else if (data.canoeingType === '1h') canoeName = `Canoeing 1 Hour (${data.hasCanoeGuide ? 'with guide' : 'without guide'})`;
    else if (data.canoeingType === '3h') canoeName = `Canoeing 3 Hours (${data.hasCanoeGuide ? 'with guide' : 'without guide'})`;

    let accomName = 'None';
    if (data.accommodationType === 'tower') accomName = 'Jungle Tower Night (including safety guide)';
    else if (data.accommodationType === 'homestay') accomName = 'Traditional Tharu Homestay';

    const message = `Hello Krishna,

I would like to book an ethical eco-tour with Jungle Safari Tours in Chitwan.

My Tour Details:
- Group Size: ${data.groupSize} Person(s)
- Nationality: ${data.permitType.toUpperCase()}
- Safari Activity: ${safariName}
- Canoeing Activity: ${canoeName}
- Accommodation: ${accomName}
- Tharu Village Walking Tour: ${data.hasTharuTour ? 'Yes' : 'No'}

Estimated Pricing:
- Total Cost: Rs ${data.totalNpr.toLocaleString()} (approx. $${data.totalUsd} USD)

Please let me know if these dates are open. We prefer to pay via [PayPal / Cash on Arrival].`;

    bookingMessage.value = message;
  }

  // Event Listeners for Real-time Calculation
  const inputs = [
    groupSizeInput,
    permitTypeSelect,
    safariTypeSelect,
    jeepGuideCheckbox,
    canoeingSelect,
    canoeGuideCheckbox,
    accommodationSelect,
    tharuTourCheckbox
  ];

  inputs.forEach(input => {
    if (input) {
      input.addEventListener('change', calculatePrice);
      input.addEventListener('input', calculatePrice);
    }
  });

  // Dynamic show/hide of guide option based on safari type selection
  if (safariTypeSelect && jeepGuideCheckbox) {
    const jeepGuideRow = document.getElementById('jeep-guide-row');
    safariTypeSelect.addEventListener('change', () => {
      const type = safariTypeSelect.value;
      if (type === 'jeep-half' || type === 'jeep-full') {
        if (jeepGuideRow) jeepGuideRow.style.display = 'flex';
      } else {
        if (jeepGuideRow) jeepGuideRow.style.display = 'none';
        jeepGuideCheckbox.checked = false;
      }
    });
  }

  // Dynamic show/hide of canoe guide option based on canoe selection
  if (canoeingSelect && canoeGuideCheckbox) {
    const canoeGuideRow = document.getElementById('canoe-guide-row');
    canoeingSelect.addEventListener('change', () => {
      const val = canoeingSelect.value;
      if (val !== 'none') {
        if (canoeGuideRow) canoeGuideRow.style.display = 'flex';
      } else {
        if (canoeGuideRow) canoeGuideRow.style.display = 'none';
        canoeGuideCheckbox.checked = false;
      }
    });
  }

  // Booking Form Submission Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('booking-name').value;
      const clientEmail = document.getElementById('booking-email').value;
      const clientDate = document.getElementById('booking-date').value;
      const customMsg = bookingMessage.value;

      // Construct a mailto link to Krishna's official paypal email or direct inbox
      const subject = encodeURIComponent(`Booking Inquiry - Jungle Safari Tours Chitwan (${clientDate})`);
      const bodyText = encodeURIComponent(`Client Name: ${clientName}\nEmail: ${clientEmail}\nDate: ${clientDate}\n\n${customMsg}`);
      
      window.location.href = `mailto:Pariyarkrishnaja@gmail.com?subject=${subject}&body=${bodyText}`;

      // Open a confirmation popup/modal
      alert("Thank you! Your email client will now open with your customized booking details. You can review and hit send to reach Krishna directly.");
    });
  }

  // Option Card Card Selections (Styling toggles for visual checkboxes)
  const optionCards = document.querySelectorAll('.option-card');
  optionCards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (checkbox) {
      // Set initial state
      if (checkbox.checked) card.classList.add('selected');
      
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          // Trigger change event manually
          checkbox.dispatchEvent(new Event('change'));
        }
        if (checkbox.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      });
    }
  });

  // Run initial calculation on page load
  calculatePrice();
});
