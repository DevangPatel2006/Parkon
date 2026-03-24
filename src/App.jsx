import { useState, useEffect, useRef } from 'react'

function App() {
  const [spots, setSpots] = useState(42);
  const [payout, setPayout] = useState(2840);
  const statsRef = useRef(null);
  
  // Dynamic metrics simulation
  useEffect(() => {
    const spotsInterval = setInterval(() => {
      setSpots(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next > 48 || next < 32 ? prev : next;
      });
    }, 1200); /* Sped up spots updates */

    const payoutInterval = setInterval(() => {
      setPayout(prev => prev + Math.floor(Math.random() * 12) + 3);
    }, 600); /* Sped up payout updates significantly */

    return () => {
      clearInterval(spotsInterval);
      clearInterval(payoutInterval);
    };
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (el) => {
      const target = +el.getAttribute('data-target');
      const start = +el.getAttribute('data-start') || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 4500;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out expo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        const current = start + (target - start) * easeProgress;
        el.innerText = Math.floor(current) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            const rowCounters = entry.target.querySelectorAll('.counter');
            rowCounters.forEach(animateCounter);
            observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (statsRef.current) {
        observer.observe(statsRef.current);
    }

    return () => {
        if (statsRef.current) observer.disconnect();
    }
  }, []);

  const [activeProblem, setActiveProblem] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Intersection Observer for the sticky scroll features
  useEffect(() => {
    const problemObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveProblem(Number(entry.target.getAttribute('data-index')));
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    const steps = document.querySelectorAll('.problem-scroll-step');
    steps.forEach(step => problemObserver.observe(step));
    
    return () => problemObserver.disconnect();
  }, []);

  const [activeSteps, setActiveSteps] = useState([false, false, false]);

  // Intersection Observer for How it Works steps on mobile
  useEffect(() => {
    const stepObserver = new IntersectionObserver((entries) => {
      setActiveSteps(prev => {
        const next = [...prev];
        entries.forEach(entry => {
          const index = Number(entry.target.getAttribute('data-step-index'));
          if (entry.isIntersecting) {
            next[index] = true;
          } else if (entry.boundingClientRect.top > 0) {
            next[index] = false;
          }
        });
        return next;
      });
    }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });

    const stepCards = document.querySelectorAll('.how-it-works-step');
    stepCards.forEach(card => stepObserver.observe(card));
    
    return () => stepObserver.disconnect();
  }, []);

  const problemsList = [
    {
      badge: "PROBLEM 01",
      title: "Dead Assets",
      desc: "Malls and offices lose millions in potential revenue as prime parking sits empty for 12+ hours daily.",
      img: "/parking_dead_assets_real_1773570804592.png",
      solType: "PARKON FIX →",
      solText: "100% Asset Utility."
    },
    {
      badge: "PROBLEM 02",
      title: "Wasted Productivity",
      desc: "Drivers lose 15 mins per day circling city blocks, causing 30% of all urban traffic congestion.",
      img: "/city_traffic_real_night_1773570820475.png",
      solType: "PARKON FIX →",
      solText: "Rapid Driver Routing."
    },
    {
      badge: "MISSION 2026",
      title: "EV Infrastructure Gap",
      desc: "We are planning universal EV charging networks at every Parkon spot, solving the charging crisis at the source.",
      img: "/ev_charger_spot_real_1773570837985.png",
      solType: "VISION →",
      solText: "Charging for Every Citizen."
    },
    {
      badge: "PROBLEM 03",
      title: "Security Blindspots",
      desc: "Buildings struggle with unauthorized access and insecure cash handling. It's pure guesswork.",
      img: "/parking_security_gate_real_1773570856314.png",
      solType: "PARKON FIX →",
      solText: "Total Network Visibility."
    },
    {
      badge: "PROBLEM 04",
      title: "Revenue Leakage",
      desc: "Manual systems lead to massive payout delays and unaccounted transactions. Your money is at risk.",
      img: "/revenue_leakage_real_1773570985510.png",
      solType: "PARKON FIX →",
      solText: "Automated Instant Settlements."
    },
    {
      badge: "PROBLEM 05",
      title: "Wasted Urban Space",
      desc: "Valuable land is locked behind \"Staff Only\" signs while the city starves for parking infrastructure.",
      img: "/urban_space_vision_1773570415985.png",
      solType: "PARKON FIX →",
      solText: "Smart Inventory Management."
    }
  ];

  return (
    <>
      <header className="navbar-wrapper">
        <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}></div>
        <nav className="navbar" ref={navRef}>
          <a href="#" className="logo">
            <img src="/ParkOn_BGRemoved.png" alt="Parkon Logo" className="logo-img" />
          </a>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
            <li><a href="#mission" onClick={() => setIsMenuOpen(false)}>Mission</a></li>
            <li><a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</a></li>
            <li><a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a></li>
            <li><a href="#cities" onClick={() => setIsMenuOpen(false)}>Cities</a></li>
            <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
          </ul>
          <div className="nav-actions">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSc4bQjvi5ot23Hb9Rhu2fyHy63nLYRKVPT36jGSoPiErMFncQ/viewform?usp=publish-editor" target="_blank" className="btn-primary nav-cta desktop-only-cta" rel="noreferrer">Join Waitlist</a>
            <button className="mobile-toggle" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-bg-gradient"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">The Operating System for <br/><span className="text-gradient">Urban Parking.</span></h1>
            <p className="hero-subtitle-small">
              Intelligent parking for drivers. Institutional income for owners.
            </p>
            
            <div className="trust-badges">
               <div className="badge">
                 <span className="badge-icon" style={{color: 'var(--accent-green)'}}>
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                 </span>
                 <div className="badge-text">
                   <strong>Time Saved</strong>
                   <span>Zero circling</span>
                 </div>
               </div>
               <div className="badge">
                 <span className="badge-icon" style={{color: 'var(--accent-green)'}}>
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 </span>
                 <div className="badge-text">
                   <strong>Verified</strong>
                   <span>Premium network</span>
                 </div>
               </div>
               <div className="badge">
                 <span className="badge-icon" style={{color: 'var(--accent-green)'}}>
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                 </span>
                 <div className="badge-text">
                   <strong>Earn Money</strong>
                   <span>Passive income</span>
                 </div>
               </div>
               <div className="badge">
                 <span className="badge-icon" style={{color: 'var(--accent-green)'}}>
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8a2 2 0 1 0 0 4 2 2 0 1 0 0-4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                 </span>
                 <div className="badge-text">
                   <strong>Traffic Free</strong>
                   <span>Reduce emissions</span>
                 </div>
               </div>
            </div>

            <div className="hero-ctas">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSc4bQjvi5ot23Hb9Rhu2fyHy63nLYRKVPT36jGSoPiErMFncQ/viewform?usp=publish-editor" target="_blank" className="btn-primary btn-large" rel="noreferrer">
                Join waitlist
                <span className="arrow-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </a>
              <a href="#features" className="btn-secondary btn-large">
                Explore infrastructure
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="dynamic-island"></div>
              <div className="hardware-btn volume-up"></div>
              <div className="hardware-btn volume-down"></div>
              <div className="hardware-btn power-btn"></div>
              
              <div className="phone-screen">
                <div className="phone-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mockup-logo"><path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8z" fill="#00ff66"/></svg>
                  <h3>Parkon Control</h3>
                </div>
                
                <div className="phone-widgets">
                <div className="widget-card">
                  <div className="widget-top">
                    <span className="widget-title">ACTIVE SESSIONS</span>
                    <span className="widget-live">LIVE</span>
                  </div>
                  <h2 style={{fontSize: '2rem'}}>{spots} Spots</h2>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '64%'}}></div>
                  </div>
                  <p style={{fontSize: '0.7rem', color: 'var(--accent-green)', marginTop: '8px'}}>Real-time traffic monitoring</p>
                </div>

                <div className="widget-card" style={{background: 'rgba(0, 186, 74, 0.05)', border: '1px solid rgba(0, 186, 74, 0.2)'}}>
                  <div className="widget-top">
                    <span className="widget-title">DAILY PAYOUT</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>₹{payout.toLocaleString('en-IN')}</h2>
                    <div className="chart-bars" style={{height: '30px', width: '100px'}}>
                      <div className="bar" style={{height: '40%'}}></div>
                      <div className="bar" style={{height: '60%'}}></div>
                      <div className="bar" style={{height: '90%', background: 'var(--accent-green)'}}></div>
                    </div>
                  </div>
                </div>

                <div className="widget-card">
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span className="widget-title">DRIVER HUB</span>
                     <span style={{fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)'}}>NAV ACTIVE</span>
                   </div>
                   <div style={{marginTop: '12px', display: 'flex', gap: '8px', overflow: 'hidden'}}>
                      <div style={{padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.7rem'}}>Route 4A</div>
                      <div style={{padding: '6px 10px', background: 'var(--accent-green)', borderRadius: '12px', fontSize: '0.7rem', color: '#000', fontWeight: 'bold'}}>Arriving</div>
                   </div>
                </div>

                <div className="widget-card" style={{padding: '16px'}}>
                  <div className="widget-top" style={{marginBottom: '8px'}}>
                    <span className="widget-title">NETWORK SCAN</span>
                  </div>
                  <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    <div style={{width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="22" x2="15" y2="15"></line></svg>
                    </div>
                    <div>
                      <h4 style={{fontSize: '0.85rem', color: '#fff'}}>Optimizing Yield</h4>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              
              {/* Refined Insight Labels (Dark/Green Theme) */}
              <div className="insight-label label-top-left">
                <div className="label-icon" style={{background: 'rgba(0, 186, 74, 0.1)'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8l-8 8M8 8l8 8"></path></svg>
                </div>
                <div className="label-text">
                  <span className="label-title">MUMBAI CENTRAL</span>
                  <span className="label-value">VERIFIED</span>
                </div>
              </div>
              <div className="connector-line" style={{top: '12%', left: '-120px', width: '120px', transform: 'rotate(0deg)'}}></div>

              <div className="insight-label label-top-right">
                <div className="label-icon" style={{background: 'rgba(0, 186, 74, 0.1)'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                </div>
                <div className="label-text">
                  <span className="label-title">DRIVER ROUTING</span>
                  <span className="label-value">ZERO CIRCLE</span>
                </div>
              </div>
              <div className="connector-line" style={{top: '22%', right: '-140px', width: '140px', transform: 'rotate(180deg)'}}></div>

              <div className="insight-label label-mid-left">
                <div className="label-icon" style={{background: 'rgba(0, 186, 74, 0.1)'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <div className="label-text">
                  <span className="label-title">PROPERTY LINK</span>
                  <span className="label-value">LIVE INVENTORY</span>
                </div>
              </div>
              <div className="connector-line" style={{top: '42%', left: '-160px', width: '160px', transform: 'rotate(0deg)'}}></div>

              <div className="insight-label label-bottom-right">
                <div className="label-icon" style={{background: 'rgba(0, 186, 74, 0.1)'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="10" x2="12" y2="10"></line></svg>
                </div>
                <div className="label-text">
                  <span className="label-title">FAST PAYOUT</span>
                  <span className="label-value">INSTANT</span>
                </div>
              </div>
              <div className="connector-line" style={{bottom: '18%', right: '-120px', width: '120px', transform: 'rotate(180deg)'}}></div>

              <div className="insight-label label-bottom-left">
                <div className="label-icon" style={{background: 'rgba(0, 186, 74, 0.1)'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                </div>
                <div className="label-text">
                  <span className="label-title">SMART NETWORK</span>
                  <span className="label-value">FUTURE READY</span>
                </div>
              </div>
              <div className="connector-line" style={{bottom: '5%', left: '-140px', width: '140px', transform: 'rotate(0deg)'}}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="container" style={{marginBottom: '48px'}}>
          <div className="problem-intro">
            <span className="problem-label">THE INFRASTRUCTURE GAP</span>
            <h2 className="section-title">Urban Parking is Broken.<br/><span className="text-gradient">We're Building the Fix.</span></h2>
            <p className="section-subtitle">
              <span className="desktop-text">Traditional parking is manual, fragmented, and inefficient. We are transforming city space into intelligent, revenue-generating assets.</span>
              <span className="mobile-text">Transforming inefficient parking into intelligent, revenue-generating assets.</span>
            </p>
          </div>
        </div>
        <div className="problem-sticky-container container">
          <div className="problem-scroll-texts">
            {problemsList.map((prob, i) => (
              <div key={i} className={`problem-scroll-step ${activeProblem === i ? 'active' : ''}`} data-index={i}>
                <div className="problem-badge">{prob.badge}</div>
                <h3>{prob.title}</h3>
                <p>{prob.desc}</p>
                
                {/* Mobile visual logic (hidden on desktop, visible on mobile) */}
                <div className="problem-card mobile-visual-card">
                  <div className="feature-visual">
                    <img src={prob.img} alt={prob.title} />
                  </div>
                  <div className="solution-strip"><span className="sol-label">{prob.solType}</span> {prob.solText}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="problem-sticky-visuals">
             <div className="problem-card sticky-card">
                <div className="feature-visual">
                  <img src={problemsList[activeProblem]?.img} alt={problemsList[activeProblem]?.title} />
                </div>
                <div className="solution-strip"><span className="sol-label">{problemsList[activeProblem]?.solType}</span> {problemsList[activeProblem]?.solText}</div>
             </div>
          </div>
        </div>
        <p className="section-legal">Built to scale — from a single parking lot to city-wide infrastructure.</p>

        <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-premium-grid">
            <div className="stat-item">
              <div className="stat-visual">
                <h2 className="counter" data-target="100" data-suffix="%">0%</h2>
                <div className="stat-glow"></div>
              </div>
              <p>Revenue control for owners</p>
            </div>
            <div className="stat-item">
              <div className="stat-visual">
                <h2 className="counter" data-target="0" data-start="60" data-suffix=" min">60 min</h2>
                <div className="stat-glow"></div>
              </div>
              <p>Wait time for drivers</p>
            </div>
            <div className="stat-item">
              <div className="stat-visual">
                <h2 className="counter counter-247" data-target="24" data-suffix="/7">0/7</h2>
                <div className="stat-glow"></div>
              </div>
              <p>Live Dashboard Access</p>
            </div>
          </div>
        </div>
      </section>
      </section>

      <section className="comparison-section container">
         <h2 className="section-title">Stop the Guesswork. <br/><span className="text-gradient">Start the Growth.</span></h2>
         <p className="section-subtitle">
           <span className="desktop-text">Why settle for empty spaces and frustrated drivers when you can have intelligent, revenue-generating infrastructure?</span>
           <span className="mobile-text">Turn empty spaces and frustrated drivers into revenue-generating infrastructure.</span>
         </p>
         
         <div className="comparison-container">
           <div className="compare-column broken-way">
              <h3 className="col-title">Broken Traditional Way</h3>
              <ul className="compare-list">
                 <li>
                   <span className="icon-fail">✕</span>
                   <div className="list-txt">
                     <strong>Dead Inventory</strong>
                     <p>Spots sit unused for 12-18 hours a day with zero utility.</p>
                   </div>
                 </li>
                 <li>
                   <span className="icon-fail">✕</span>
                   <div className="list-txt">
                     <strong>Blind Management</strong>
                     <p>No data on who is parked or for how long. Just guessing.</p>
                   </div>
                 </li>
                 <li>
                   <span className="icon-fail">✕</span>
                   <div className="list-txt">
                     <strong>Frustrated Drivers</strong>
                     <p>Circling blocks, burning fuel, and causing congestion.</p>
                   </div>
                 </li>
                 <li>
                   <span className="icon-fail">✕</span>
                   <div className="list-txt">
                     <strong>Manual Payments</strong>
                     <p>Insecure cash handling or complex validation processes.</p>
                   </div>
                 </li>
              </ul>
           </div>

           <div className="compare-column parkon-way">
              <h3 className="col-title">The Parkon Infrastructure</h3>
              <ul className="compare-list">
                 <li>
                   <span className="icon-success">✓</span>
                   <div className="list-txt">
                     <strong>100% Asset Utility</strong>
                     <p>Every single hour of every spot is monetized automatically.</p>
                   </div>
                 </li>
                 <li>
                   <span className="icon-success">✓</span>
                   <div className="list-txt">
                     <strong>Total Visibility</strong>
                     <p>Real-time dashboard tracking occupancy and revenue 24/7.</p>
                   </div>
                 </li>
                 <li>
                   <span className="icon-success">✓</span>
                   <div className="list-txt">
                     <strong>Happy Neighborhoods</strong>
                     <p>No more circling. Pre-booked spots reduce local traffic by 30%.</p>
                   </div>
                 </li>
                 <li>
                   <span className="icon-success">✓</span>
                   <div className="list-txt">
                     <strong>Automated Payouts</strong>
                     <p>Digital payments, instant settlements, and zero leaks.</p>
                   </div>
                 </li>
              </ul>
           </div>
         </div>
      </section>

      <section className="how-it-works-section container">
        <h2 className="section-title">From problem to <span className="text-gradient">profit in 3 steps</span>.</h2>
        
        <div className="steps-grid">
          <div className={`step-card how-it-works-step ${activeSteps[0] ? 'active' : ''}`} data-step-index={0}>
            <div className="step-num">01</div>
            <div className="step-content">
              <h3>List your unused spots</h3>
              <p>Building owners list idle parking on Parkon in minutes — no hardware needed to start.</p>
            </div>
          </div>
          <div className={`step-card how-it-works-step ${activeSteps[1] ? 'active' : ''}`} data-step-index={1}>
            <div className="step-num">02</div>
            <div className="step-content">
              <h3>Driver books instantly</h3>
              <p>Nearby drivers find, book and navigate to a guaranteed spot — no circling, no guessing.</p>
            </div>
          </div>
          <div className={`step-card how-it-works-step ${activeSteps[2] ? 'active' : ''}`} data-step-index={2}>
            <div className="step-num">03</div>
            <div className="step-content">
              <h3>Money hits your wallet</h3>
              <p>Revenue is automatically collected and settled. You watch earnings grow in real time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="marquee-section">
        <div className="container">
          <h2 className="section-title">The scale of the <span className="text-gradient">parking crisis</span>.</h2>
          <p className="section-subtitle">
            <span className="desktop-text">Parking congestion causes 30% of all urban traffic. Every city. Every day. Parkon is the fix.</span>
            <span className="mobile-text">Parking causes 30% of urban traffic. Parkon is the fix.</span>
          </p>
        </div>
        
        <div className="marquee-container">
          <div className="marquee-track">
            <div className="marquee-item"><span>•</span> 40 Min Daily Wasted</div>
            <div className="marquee-item"><span>•</span> 30% Traffic Is Parking Searches</div>
            <div className="marquee-item"><span>•</span> ₹Trillions In Dead Assets</div>
            <div className="marquee-item"><span>•</span> Carbon Emissions Ramping Up</div>
            <div className="marquee-item"><span>•</span> Urban Congestion Crisis</div>
            <div className="marquee-item"><span>•</span> 60% Spots Sit Idle</div>
            
            <div className="marquee-item"><span>•</span> 40 Min Daily Wasted</div>
            <div className="marquee-item"><span>•</span> 30% Traffic Is Parking Searches</div>
            <div className="marquee-item"><span>•</span> ₹Trillions In Dead Assets</div>
            <div className="marquee-item"><span>•</span> Carbon Emissions Ramping Up</div>
            <div className="marquee-item"><span>•</span> Urban Congestion Crisis</div>
            <div className="marquee-item"><span>•</span> 60% Spots Sit Idle</div>
          </div>
        </div>
        
        <div className="marquee-cta-container">
           <p>Ready to transform your parking?</p>
           <a href="https://docs.google.com/forms/d/e/1FAIpQLSc4bQjvi5ot23Hb9Rhu2fyHy63nLYRKVPT36jGSoPiErMFncQ/viewform?usp=publish-editor" target="_blank" className="btn-primary btn-large" rel="noreferrer">Join the Waitlist</a>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-content">
            <div className="footer-col brand-col">
               <img src="/ParkOn_BGRemoved.png" alt="Parkon Logo" className="footer-logo-img-small" />
               <p className="footer-subtitle">The future of parking</p>
            </div>
            <div className="footer-col">
               <h3>Solutions</h3>
               <ul>
                  <li><a href="#">Smart Enforcement</a></li>
                  <li><a href="#">Vision Analytics</a></li>
                  <li><a href="#">Payout Gateway</a></li>
                  <li><a href="#">EV Integration</a></li>
               </ul>
            </div>
            <div className="footer-col">
               <h3>Platform</h3>
               <ul>
                  <li><a href="#">For Buildings</a></li>
                  <li><a href="#">For Drivers</a></li>
                  <li><a href="#">Mission 2026</a></li>
                  <li><a href="#">Live Maps</a></li>
               </ul>
            </div>
            <div className="footer-col">
               <h3>Company</h3>
               <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Contact</a></li>
               </ul>
            </div>
            <div className="footer-col">
               <h3>Legal</h3>
               <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms</a></li>
               </ul>
            </div>
        </div>
        <div className="footer-bottom">
           <p>&copy; 2026 Parkon Technologies. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default App
