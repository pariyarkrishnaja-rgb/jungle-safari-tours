/* ==========================================================================
   CHITWAN JUNGLE SAFARI TOURS - INTERACTIVE LOGIC (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Dynamic Exchange Rate (USD to NPR)
  let exchangeRateNpr = 154.2; // Fallback default rate (1 USD = 154.2 NPR)

  async function fetchExchangeRate() {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates && data.rates.NPR) {
          exchangeRateNpr = parseFloat(data.rates.NPR);
          console.log('Dynamic USD to NPR exchange rate loaded:', exchangeRateNpr);
          
          // Update the rate text in the UI note
          const usdNote = document.getElementById('usd-rate-note');
          if (usdNote) {
            usdNote.textContent = `* 1 USD ≈ ${Math.round(exchangeRateNpr)} NPR. This calculator is a booking estimation. Direct payouts go to the local guides team on arrival.`;
          }
          
          // Recalculate prices if the form is initialized
          if (typeof calculatePrice === 'function') {
            calculatePrice();
          }
        }
      }
    } catch (error) {
      console.warn('Failed to fetch dynamic exchange rate, using fallback:', exchangeRateNpr, error);
    }
  }

  // Fetch exchange rate on load
  fetchExchangeRate();

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

  // Mobile Dropdown Menu Accordion Toggle
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownContent = document.querySelector('.dropdown-content');
  if (dropdownToggle && dropdownContent) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownContent.classList.toggle('active');
      }
    });
  }

  // Smooth Navigation Link Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a:not(.dropdown-toggle)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 180)) {
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

  // SAFARI CARD INTERACTIONS WITH PRICING CALCULATOR
  const selectLinks = document.querySelectorAll('[data-select-safari], [data-select-canoeing], [data-select-accommodation], [data-select-tharu]');
  selectLinks.forEach(link => {
    link.addEventListener('click', () => {
      // 1. Check for safari type select
      const safariVal = link.getAttribute('data-select-safari');
      if (safariVal) {
        const selectEl = document.getElementById('calc-safari-type');
        if (selectEl) {
          selectEl.value = safariVal;
          selectEl.dispatchEvent(new Event('change'));
        }
      }

      // 2. Check for canoeing type select
      const canoeingVal = link.getAttribute('data-select-canoeing');
      if (canoeingVal) {
        const selectEl = document.getElementById('calc-canoeing');
        if (selectEl) {
          selectEl.value = canoeingVal;
          selectEl.dispatchEvent(new Event('change'));
        }
      }

      // 3. Check for accommodation select
      const accomVal = link.getAttribute('data-select-accommodation');
      if (accomVal) {
        const selectEl = document.getElementById('calc-accommodation');
        if (selectEl) {
          selectEl.value = accomVal;
          selectEl.dispatchEvent(new Event('change'));
        }
      }

      // 4. Check for Tharu Village Tour checkbox
      const tharuVal = link.getAttribute('data-select-tharu');
      if (tharuVal === 'true') {
        const checkboxEl = document.getElementById('calc-tharu-tour');
        if (checkboxEl) {
          checkboxEl.checked = true;
          const card = checkboxEl.closest('.option-card');
          if (card) card.classList.add('selected');
          checkboxEl.dispatchEvent(new Event('change'));
        }
      }
    });
  });

  // Mobile menu close on click of any nav link or dropdown item
  const allMenuLinks = document.querySelectorAll('nav ul li a:not(.dropdown-toggle), .dropdown-content a');
  allMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', false);
        }
      }
      if (dropdownContent) {
        dropdownContent.classList.remove('active');
      }
    });
  });

  // BLOG EXPANDABLE CARDS
  const blogReadMoreBtns = document.querySelectorAll('.blog-read-more-btn');
  blogReadMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.toggle('active');
        btn.classList.toggle('active');
        if (targetContent.classList.contains('active')) {
          btn.textContent = 'Hide Article';
        } else {
          btn.textContent = 'Read Full Article';
        }
      }
    });
  });

  // GALLERY LIGHTBOX SYSTEM
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const caption = item.getAttribute('data-caption');
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightbox.style.display = 'flex';
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) {
        lightbox.style.display = 'none';
      }
    });
  }

  // PRICING CALCULATOR CONSTANTS & RULES
  const RATES = {
    permits: {
      international: 2000,
      saarc: 1000,
      domestic: 150
    },
    walking: {
      base_5: 10000,     // up to 5 people (includes 2 guides)
      base_6_7: 15000,   // 6-7 people (includes 3 guides)
      base_8_9: 20000,   // 8-9 people (includes 4 guides)
      base_10: 25000     // 10 people (includes 5 guides)
    },
    jeep: {
      shared_4h: 2000,    // per person
      half_private: 18500,
      full_private: 27500,
      tiger_private: 32500, // Mission Tiger Package (Full-Day Jeep + Permits + tracker guide, let's treat guide as included in this package)
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
      tower: 7000,        // per bed/person
      homestay: 9500,     // per room (holds up to 2 people)
      tower_guide: 2500   // mandatory safety guide fee
    },
    tharu_tour: 3000      // flat private guide fee
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

  // Booking Form Group Size Sync
  const bookingGroupSizeInput = document.getElementById('booking-groupsize');

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

  // Synchronization between calculator and booking form group size
  if (groupSizeInput && bookingGroupSizeInput) {
    groupSizeInput.addEventListener('input', () => {
      bookingGroupSizeInput.value = groupSizeInput.value;
      calculatePrice();
    });
    bookingGroupSizeInput.addEventListener('input', () => {
      groupSizeInput.value = bookingGroupSizeInput.value;
      calculatePrice();
    });
  }

  // Calculate pricing function
  function calculatePrice() {
    if (!groupSizeInput) return;

    const groupSize = Math.max(1, parseInt(groupSizeInput.value) || 1);
    const permitType = permitTypeSelect.value;
    const safariType = safariTypeSelect.value;
    const hasJeepGuide = jeepGuideCheckbox ? jeepGuideCheckbox.checked : false;
    const canoeingType = canoeingSelect.value;
    const hasCanoeGuide = canoeGuideCheckbox ? canoeGuideCheckbox.checked : false;
    const accommodationType = accommodationSelect.value;
    const hasTharuTour = tharuTourCheckbox ? tharuTourCheckbox.checked : false;

    // 1. Permit Cost (daily rate * group size)
    let permitCost = RATES.permits[permitType] * groupSize;
    let safariCost = 0;
    let canoeCost = 0;
    let accommodationCost = 0;
    let tharuCost = 0;
    let guideCost = 0;

    // 2. Safari Cost
    if (safariType === 'walking') {
      if (groupSize <= 5) {
        safariCost = RATES.walking.base_5;
      } else if (groupSize <= 7) {
        safariCost = RATES.walking.base_6_7;
      } else if (groupSize <= 9) {
        safariCost = RATES.walking.base_8_9;
      } else {
        safariCost = RATES.walking.base_10;
      }
    } else if (safariType === 'jeep-shared') {
      safariCost = RATES.jeep.shared_4h * groupSize; // Rs 2,000 per person
    } else if (safariType === 'jeep-half') {
      safariCost = RATES.jeep.half_private;
      if (hasJeepGuide) {
        guideCost += RATES.jeep.guide_4h;
      }
    } else if (safariType === 'jeep-full') {
      safariCost = RATES.jeep.full_private;
      if (hasJeepGuide) {
        guideCost += RATES.jeep.guide_1d;
      }
    } else if (safariType === 'jeep-tiger') {
      safariCost = RATES.jeep.tiger_private;
      // Note: Guide fee is included in the Mission Tiger package
    }

    // 3. Canoeing Cost
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

    // 4. Accommodation Cost
    if (accommodationType === 'tower') {
      accommodationCost = RATES.accommodation.tower * groupSize; // per bed
      accommodationCost += RATES.accommodation.tower_guide;     // safety guide fee
    } else if (accommodationType === 'homestay') {
      const roomsNeeded = Math.ceil(groupSize / 2);
      accommodationCost = RATES.accommodation.homestay * roomsNeeded; // per room
    }

    // 5. Tharu Village Tour flat fee
    if (hasTharuTour) {
      tharuCost = RATES.tharu_tour;
    }

    // Totals
    const totalNpr = permitCost + safariCost + canoeCost + accommodationCost + tharuCost + guideCost;
    const totalUsd = Math.round(totalNpr / exchangeRateNpr);

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
    if (data.safariType === 'walking') safariName = 'Guided Walking Safari (Group Pricing)';
    else if (data.safariType === 'jeep-shared') safariName = 'Shared Jeep Safari (4 Hours)';
    else if (data.safariType === 'jeep-half') safariName = `Half-Day Private Reserve Jeep (${data.hasJeepGuide ? 'with private guide' : 'no private guide'})`;
    else if (data.safariType === 'jeep-full') safariName = `Full-Day Private Reserve Jeep (${data.hasJeepGuide ? 'with private guide' : 'no private guide'})`;
    else if (data.safariType === 'jeep-tiger') safariName = 'One-Day "Mission Tiger" Private Expedition (includes tracking guide)';

    let canoeName = 'None';
    if (data.canoeingType === '30m') canoeName = `Canoeing 30 Mins (${data.hasCanoeGuide ? 'with guide & transport' : 'no guide'})`;
    else if (data.canoeingType === '1h') canoeName = `Canoeing 1 Hour (${data.hasCanoeGuide ? 'with guide & transport' : 'no guide'})`;
    else if (data.canoeingType === '3h') canoeName = `Canoeing 3 Hours (${data.hasCanoeGuide ? 'with guide & transport' : 'no guide'})`;

    let accomName = 'None';
    if (data.accommodationType === 'tower') accomName = 'Jungle Tower Night Stay (includes safety guide)';
    else if (data.accommodationType === 'homestay') accomName = 'Tharu Community Homestay (rooms & meals included)';

    const message = `Hello Krishna,

I would like to book a direct, ethical eco-safari in Chitwan.

My Chosen Package details:
- Group Size: ${data.groupSize} Traveler(s)
- Permit Category: ${data.permitType.toUpperCase()}
- Safari Activity: ${safariName}
- Canoeing Activity: ${canoeName}
- Accommodation: ${accomName}
- Tharu Village Walking Tour: ${data.hasTharuTour ? 'Yes' : 'No'}

Total Cost Estimate:
- Rs. ${data.totalNpr.toLocaleString()} NPR (approx. $${data.totalUsd} USD)

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

  // Dynamic show/hide of guide option based on safari selection
  if (safariTypeSelect && jeepGuideCheckbox) {
    const jeepGuideRow = document.getElementById('jeep-guide-row');
    safariTypeSelect.addEventListener('change', () => {
      const type = safariTypeSelect.value;
      if (type === 'jeep-half' || type === 'jeep-full') {
        if (jeepGuideRow) jeepGuideRow.style.display = 'block';
      } else {
        if (jeepGuideRow) jeepGuideRow.style.display = 'none';
        jeepGuideCheckbox.checked = false;
        // Trigger style updates if check card styling was active
        const card = jeepGuideCheckbox.closest('.option-card');
        if (card) card.classList.remove('selected');
      }
    });
  }

  // Dynamic show/hide of canoe guide option based on canoe selection
  if (canoeingSelect && canoeGuideCheckbox) {
    const canoeGuideRow = document.getElementById('canoe-guide-row');
    canoeingSelect.addEventListener('change', () => {
      const val = canoeingSelect.value;
      if (val !== 'none') {
        if (canoeGuideRow) canoeGuideRow.style.display = 'block';
      } else {
        if (canoeGuideRow) canoeGuideRow.style.display = 'none';
        canoeGuideCheckbox.checked = false;
        const card = canoeGuideCheckbox.closest('.option-card');
        if (card) card.classList.remove('selected');
      }
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

  // Booking Form Submission Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('booking-name').value;
      const clientPhone = document.getElementById('booking-phone').value;
      const clientEmail = document.getElementById('booking-email').value;
      const clientSize = document.getElementById('booking-groupsize').value;
      const clientDate = document.getElementById('booking-date').value;
      const customMsg = bookingMessage.value;

      // Construct a mailto link to Krishna's official email
      const subject = encodeURIComponent(`Booking Inquiry - Jungle Safari Tours Chitwan (${clientDate})`);
      const bodyText = encodeURIComponent(`Client Name: ${clientName}\nPhone: ${clientPhone}\nEmail: ${clientEmail}\nGroup Size: ${clientSize} Person(s)\nDate: ${clientDate}\n\n${customMsg}`);
      
      window.location.href = `mailto:Pariyarkrishnaja@gmail.com?subject=${subject}&body=${bodyText}`;

      // Open a confirmation popup
      alert("Thank you! Your email client will now open with your customized booking details. You can review and hit send to reach Krishna directly.");
    });
  }

  // Run initial calculation on page load
  calculatePrice();

  // ==========================================
  // FAQ ACCORDIONS LOGIC
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        faqItem.classList.add('active');
        const answer = faqItem.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // FAQ Search & View More Toggle Logic
  const faqSearch = document.getElementById('faq-search');
  const faqItems = document.querySelectorAll('.faq-item');
  const loadMoreBtn = document.getElementById('load-more-faqs-btn');
  let faqsExpanded = false;

  function updateFAQs() {
    const query = faqSearch ? faqSearch.value.toLowerCase().trim() : '';
    
    faqItems.forEach(item => {
      const isExtra = item.classList.contains('faq-extra-item');
      const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
      
      // Get answer paragraph or text elements
      const answerElement = item.querySelector('.faq-answer p');
      const answerText = answerElement ? answerElement.textContent.toLowerCase() : '';
      
      const keywordsAttr = item.getAttribute('data-keywords');
      const keywords = keywordsAttr ? keywordsAttr.toLowerCase() : '';

      const matchesSearch = query === '' || 
                            questionText.includes(query) || 
                            answerText.includes(query) || 
                            keywords.includes(query);

      if (matchesSearch) {
        if (query !== '') {
          // If searching, display matching items directly
          item.style.display = 'block';
        } else {
          // If not searching, display based on expansion state
          if (isExtra && !faqsExpanded) {
            item.style.display = 'none';
          } else {
            item.style.display = 'block';
          }
        }
      } else {
        item.style.display = 'none';
      }
    });

    // Control load-more button text and visibility
    if (loadMoreBtn) {
      if (query !== '') {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'inline-block';
        loadMoreBtn.textContent = faqsExpanded ? 'View Less FAQs' : 'View More FAQs';
      }
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      faqsExpanded = !faqsExpanded;
      updateFAQs();
      
      // If collapsed back, scroll smoothly to the top of FAQ section
      if (!faqsExpanded) {
        const faqSection = document.getElementById('faq');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  if (faqSearch) {
    faqSearch.addEventListener('input', updateFAQs);
  }

  // Initialize FAQ list state on page load
  updateFAQs();

  // ==========================================
  // INTERACTIVE CHATBOT LOGIC
  // ==========================================
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotPanel = document.getElementById('chatbot-panel');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatBadge = document.querySelector('.chat-badge');
  const chatbotBody = document.getElementById('chatbot-body');
  const replyButtons = document.querySelectorAll('.reply-btn');
  
  if (chatbotToggle && chatbotPanel && chatbotClose) {
    chatbotToggle.addEventListener('click', () => {
      chatbotPanel.classList.toggle('active');
      chatbotToggle.classList.toggle('open');
      if (chatBadge) {
        chatBadge.style.display = 'none';
      }
      scrollToBottom();
    });
    
    chatbotClose.addEventListener('click', () => {
      chatbotPanel.classList.remove('active');
      chatbotToggle.classList.remove('open');
    });
  }

  const responses = {
    pricing: "Our guided walking safaris start at Rs. 10,000 for private groups of 1-5 people (includes 2 licensed local guides). Private jeeps cost Rs. 18,500 for a half-day or Rs. 27,500 for a full-day. There are zero hidden commissions: direct payouts support the guides directly. You can use our online Cost Builder above to get a direct group price estimate!",
    elephant: "No. Jungle Safari Tours operates on a strict animal-friendly, ethical policy. We love animals and respect nature, so we do NOT offer elephant riding, elephant bathing, horse carts, or ox cart rides. We track animals in their natural habitats entirely on foot, by canoe, or via open-top 4x4 jeeps.",
    safety: "Jungle walking is very safe when led by professionals. Every walk requires a minimum of 2 licensed, veteran trackers. Our guides carry safety bamboo sticks, know animal psychology (rhino charges, tiger behaviors, sloth bear habitats) intimately, and monitor warning alarm calls. We have an unblemished safety record since 2007.",
    homestay: "Yes! You can stay in our Tharu Community Homestay run directly by our local guides' families. A room costs Rs. 9,500 per night all-inclusive (holds up to 2 people) and includes private room lodging, traditional home-cooked lunch, dinner, and breakfast. It's a wonderful, direct way to experience Tharu culture!"
  };
  
  if (replyButtons.length > 0) {
    replyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const questionKey = btn.getAttribute('data-question');
        const questionText = btn.textContent;
        const responseText = responses[questionKey];
        
        if (responseText) {
          // 1. Add User Message
          appendMessage(questionText, 'user-msg');
          scrollToBottom();
          
          // 2. Disable buttons during typing
          setRepliesDisabled(true);
          
          // 3. Show typing indicator
          showTypingIndicator();
          
          // 4. Delayed Bot Response
          setTimeout(() => {
            removeTypingIndicator();
            appendMessage(responseText, 'bot-msg');
            setRepliesDisabled(false);
            scrollToBottom();
          }, 1000);
        }
      });
    });
  }
  
  function appendMessage(text, className) {
    if (!chatbotBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${className}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatbotBody.appendChild(msgDiv);
  }
  
  function showTypingIndicator() {
    if (!chatbotBody) return;
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'chat-typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatbotBody.appendChild(indicator);
    scrollToBottom();
  }
  
  function removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  function setRepliesDisabled(disabled) {
    replyButtons.forEach(btn => {
      btn.disabled = disabled;
      btn.style.opacity = disabled ? '0.6' : '1';
      btn.style.pointerEvents = disabled ? 'none' : 'auto';
    });
  }
  
  function scrollToBottom() {
    if (chatbotBody) {
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }
  }

  // ==========================================
  // CUSTOM TRANSLATE DROPDOWN LOGIC WITH DYNAMIC SEARCH
  // ==========================================
  const translateTrigger = document.getElementById('translate-trigger');
  const translateMenu = document.getElementById('translate-menu');
  const linksContainer = document.getElementById('translate-links-container');
  const searchInput = document.getElementById('translate-search');

  const allLanguages = [
    { code: 'en', name: 'English', native: 'English', flag: 'us', isDefault: true },
    { code: 'es', name: 'Spanish', native: 'Español', flag: 'es', isDefault: true },
    { code: 'fr', name: 'French', native: 'Français', flag: 'fr', isDefault: true },
    { code: 'de', name: 'German', native: 'Deutsch', flag: 'de', isDefault: true },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: 'jp', isDefault: true },
    { code: 'zh-CN', name: 'Chinese', native: '简体中文', flag: 'cn', isDefault: true },
    { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: 'np', isDefault: true },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: 'nl', isDefault: true },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: 'it', isDefault: true },
    // Extra languages for search results
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: 'in', isDefault: false },
    { code: 'ko', name: 'Korean', native: '한국어', flag: 'kr', isDefault: false },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: 'pt', isDefault: false },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: 'ru', isDefault: false },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: 'sa', isDefault: false },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: 'tr', isDefault: false },
    { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: 'vn', isDefault: false },
    { code: 'th', name: 'Thai', native: 'ไทย', flag: 'th', isDefault: false },
    { code: 'pl', name: 'Polish', native: 'Polski', flag: 'pl', isDefault: false },
    { code: 'sv', name: 'Swedish', native: 'Svenska', flag: 'se', isDefault: false },
    { code: 'da', name: 'Danish', native: 'Dansk', flag: 'dk', isDefault: false },
    { code: 'no', name: 'Norwegian', native: 'Norsk', flag: 'no', isDefault: false },
    { code: 'fi', name: 'Finnish', native: 'Suomi', flag: 'fi', isDefault: false },
    { code: 'he', name: 'Hebrew', native: 'עברית', flag: 'il', isDefault: false },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: 'id', isDefault: false },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: 'my', isDefault: false },
    { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: 'gr', isDefault: false },
    { code: 'cs', name: 'Czech', native: 'Čeština', flag: 'cz', isDefault: false },
    { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: 'hu', isDefault: false },
    { code: 'ro', name: 'Romanian', native: 'Română', flag: 'ro', isDefault: false },
    { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: 'ua', isDefault: false }
  ];
  
  if (translateTrigger && translateMenu) {
    // Toggle dropdown visibility
    translateTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      translateMenu.classList.toggle('show');
      const arrow = translateTrigger.querySelector('.arrow');
      if (arrow) {
        arrow.style.transform = translateMenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
      }
      // Focus search input on open
      if (translateMenu.classList.contains('show') && searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        setTimeout(() => searchInput.focus(), 100);
      }
    });

    // Close dropdown on click outside
    document.addEventListener('click', () => {
      translateMenu.classList.remove('show');
      const arrow = translateTrigger.querySelector('.arrow');
      if (arrow) {
        arrow.style.transform = 'rotate(0)';
      }
    });

    // Delegated click handler for language links inside container
    if (linksContainer) {
      linksContainer.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-lang]');
        if (!link) return;
        e.preventDefault();
        
        const langCode = link.getAttribute('data-lang');
        const langHTML = link.innerHTML;

        // Set cookies
        document.cookie = "googtrans=/en/" + langCode + "; path=/; domain=" + window.location.hostname;
        document.cookie = "googtrans=/en/" + langCode + "; path=/";

        // Try triggering raw Google combo select
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          combo.value = langCode;
          combo.dispatchEvent(new Event('change'));
        } else {
          // If combo is not loaded yet, wait or reload
          setTimeout(() => {
            const retryCombo = document.querySelector('.goog-te-combo');
            if (retryCombo) {
              retryCombo.value = langCode;
              retryCombo.dispatchEvent(new Event('change'));
            } else {
              window.location.reload();
            }
          }, 150);
        }

        // Update trigger button text & flag
        translateTrigger.querySelector('span').innerHTML = langHTML;
        translateMenu.classList.remove('show');
        const arrow = translateTrigger.querySelector('.arrow');
        if (arrow) {
          arrow.style.transform = 'rotate(0)';
        }
      });
    }

    // Dynamic Search Filtering Logic
    if (searchInput && linksContainer) {
      searchInput.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent dropdown from closing when typing
      });

      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        let filtered = [];
        if (query === '') {
          filtered = allLanguages.filter(lang => lang.isDefault);
        } else {
          filtered = allLanguages.filter(lang => 
            lang.name.toLowerCase().includes(query) || 
            lang.native.toLowerCase().includes(query)
          );
        }

        // Re-render matching items
        linksContainer.innerHTML = '';
        if (filtered.length === 0) {
          linksContainer.innerHTML = '<div style="padding: 0.8rem; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.8rem;">No language found</div>';
        } else {
          filtered.forEach(lang => {
            const a = document.createElement('a');
            a.href = '#';
            a.setAttribute('data-lang', lang.code);
            a.innerHTML = `<img src="https://flagcdn.com/w20/${lang.flag}.png" alt="${lang.name} Flag" class="lang-flag-img"> ${lang.native}`;
            linksContainer.appendChild(a);
          });
        }
      });
    }

    // Check googtrans cookie on load and update trigger button active flag
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    if (cookieValue) {
      const activeLang = cookieValue.split('=')[1].split('/').pop();
      const activeLangObj = allLanguages.find(lang => lang.code === activeLang);
      if (activeLangObj) {
        translateTrigger.querySelector('span').innerHTML = `<img src="https://flagcdn.com/w20/${activeLangObj.flag}.png" alt="${activeLangObj.name} Flag" class="lang-flag-img"> ${activeLangObj.native}`;
      }
    }
  }

  // BIOGRAPHY STORY MODAL LOGIC
  const readStoryBtn = document.getElementById('read-story-btn');
  const storyModal = document.getElementById('story-modal');
  const storyModalClose = document.getElementById('story-modal-close');

  if (readStoryBtn && storyModal && storyModalClose) {
    readStoryBtn.addEventListener('click', () => {
      storyModal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Disable background scrolling
    });

    const closeStoryModal = () => {
      storyModal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Enable background scrolling
    };

    storyModalClose.addEventListener('click', closeStoryModal);

    // Close when clicking overlay background
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) {
        closeStoryModal();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && storyModal.style.display === 'flex') {
        closeStoryModal();
      }
    });
  }
});
