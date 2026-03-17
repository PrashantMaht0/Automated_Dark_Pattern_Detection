import React from 'react';
import { Link } from 'react-router-dom';

export default function Regulations() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner — same style as HowItWorks */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
            <i className="fas fa-gavel mr-2"></i>GDPR &amp; Regulations Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            What Are <span className="gradient-text">Dark Patterns</span> &amp; How to Identify Them
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A comprehensive guide to understanding deceptive design practices, their impact on users, and the regulatory frameworks created to protect you.
          </p>
          <div className="flex items-center justify-center mt-8 text-sm text-gray-400 space-x-6">
            <span><i className="far fa-clock mr-1"></i>12 min read</span>
            <span><i className="far fa-calendar mr-1"></i>March 2026</span>
            <span><i className="fas fa-tag mr-1"></i>Regulations</span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Table of Contents */}
        <nav className="bg-gray-50 rounded-2xl p-6 mb-12 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            <i className="fas fa-list mr-2"></i>Table of Contents
          </h2>
          <ol className="space-y-2 text-sm">
            <li>
              <a href="#introduction" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">1</span>
                Introduction — What Are Dark Patterns?
              </a>
            </li>
            <li>
              <a href="#categories" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</span>
                Categories of Dark Patterns &amp; Where They Hide
              </a>
            </li>
            <li>
              <a href="#why-it-matters" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</span>
                Why Dark Patterns Matter — How They Affect Us
              </a>
            </li>
            <li>
              <a href="#common-patterns" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">4</span>
                Most Common Dark Patterns We Detect
              </a>
            </li>
            <li>
              <a href="#regulatory-frameworks" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">5</span>
                Regulatory Frameworks — GDPR, EU DSA &amp; Beyond
              </a>
            </li>
            <li>
              <a href="#rules-regulations" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">6</span>
                Rules &amp; Regulations by Regulatory Boards
              </a>
            </li>
            <li>
              <a href="#avoiding-dark-patterns" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">7</span>
                How UI/UX Developers Can Avoid Dark Patterns
              </a>
            </li>
            <li>
              <a href="#conclusion" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">8</span>
                Conclusion
              </a>
            </li>
          </ol>
        </nav>

        {/* ─── Section 1: Introduction ─── */}
        <section id="introduction" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">1</span>
            Introduction — What Are Dark Patterns?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Imagine you are trying to unsubscribe from an email list and the "Unsubscribe" link is hidden in tiny, gray text at the very bottom of the page. Or you are buying something online and right before checkout, an extra "protection plan" has been quietly added to your cart. These are not accidents — they are <strong>dark patterns</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The term <strong>"dark pattern"</strong> was coined by UX researcher <strong>Harry Brignull</strong> in 2010 to describe user interface designs that are intentionally crafted to trick users into doing things they did not intend to do — like signing up for services, sharing more personal data than they wanted, or spending more money than they planned.
          </p>

          {/* Visual: Dark Pattern Concept */}
          <figure className="my-8">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 overflow-hidden">
              <img
                src="/dark_patterns_overview.png"
                alt="Overview of dark patterns in website interfaces"
                className="w-full rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-12 items-center justify-center" style={{ minHeight: '280px' }}>
                <div className="text-center">
                  <div className="flex justify-center space-x-6 mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                      <i className="fas fa-eye-slash text-red-500 text-2xl"></i>
                    </div>
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <i className="fas fa-mouse-pointer text-orange-500 text-2xl"></i>
                    </div>
                    <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                      <i className="fas fa-shopping-cart text-yellow-600 text-2xl"></i>
                    </div>
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <i className="fas fa-clock text-purple-500 text-2xl"></i>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium text-lg">Dark Patterns in Website Interfaces</p>
                  <p className="text-gray-400 text-sm mt-1">Deceptive UI tricks that manipulate user decisions</p>
                </div>
              </div>
            </div>
            <figcaption className="text-center text-sm text-gray-500 mt-3">
              <i className="fas fa-image mr-1"></i> Fig 1. Common dark pattern techniques found across websites
            </figcaption>
          </figure>

          <p className="text-gray-700 leading-relaxed mb-4">
            Dark patterns exploit human psychology — our tendency to take the path of least resistance, our fear of missing out, and our trust in default settings. They exist in cookie consent banners, e-commerce checkout flows, subscription cancellation pages, mobile apps, and nearly every corner of the modern web.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5 my-8">
            <div className="flex items-start">
              <i className="fas fa-exclamation-triangle text-red-600 mt-1 mr-3 text-lg"></i>
              <div>
                <h4 className="font-semibold text-red-900 mb-1">The Scale of the Problem</h4>
                <p className="text-red-800 text-sm leading-relaxed">
                  A 2019 study by Princeton University found dark patterns on <strong>over 11% of 11,000+ shopping websites</strong> analyzed. The European Commission reported in 2022 that <strong>97% of the most popular websites and apps</strong> used in the EU deployed at least one dark pattern. This is not a fringe issue — it is the norm.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 2: Categories of Dark Patterns ─── */}
        <section id="categories" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">2</span>
            Categories of Dark Patterns &amp; Where They Hide
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Dark patterns are not random — they follow well-documented categories, and they tend to appear in specific parts of a webpage. Understanding these categories helps you spot them before they trick you.
          </p>

          {/* Category Cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                  <i className="fas fa-clock text-red-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Urgency
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">High Impact</span>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">Creates a false sense of time pressure to rush users into making decisions without thinking. Think of fake countdown timers, "Only 2 left!" warnings, or "Sale ends in 5 minutes!" banners.</p>
                  <p className="text-gray-400 text-xs"><i className="fas fa-map-marker-alt mr-1"></i><strong>Where it hides:</strong> Product pages, checkout flows, booking sites, banner notifications</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                  <i className="fas fa-exchange-alt text-orange-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Misdirection
                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Deceptive</span>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">Uses visual hierarchy, color, and sizing to draw attention towards one option and away from another. A giant green "Accept All" button paired with a tiny gray "Manage Preferences" link is a classic example.</p>
                  <p className="text-gray-400 text-xs"><i className="fas fa-map-marker-alt mr-1"></i><strong>Where it hides:</strong> Cookie consent banners, permission dialogs, subscription pages, settings panels</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                  <i className="fas fa-users text-yellow-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Social Proof
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Manipulative</span>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">Fabricates or exaggerates social signals to pressure users. Fake activity notifications ("23 people are viewing this right now"), inflated review counts, or fabricated testimonials create an illusion of popularity.</p>
                  <p className="text-gray-400 text-xs"><i className="fas fa-map-marker-alt mr-1"></i><strong>Where it hides:</strong> Product pages, hotel/flight bookings, SaaS pricing pages, pop-up notifications</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                  <i className="fas fa-lock text-purple-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Forced Action
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Coercive</span>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">Requires users to perform an unrelated action to access the functionality they actually want. Being forced to create an account just to view a price, or being required to share contacts to use an app feature.</p>
                  <p className="text-gray-400 text-xs"><i className="fas fa-map-marker-alt mr-1"></i><strong>Where it hides:</strong> Registration walls, paywalls, app permission screens, onboarding flows</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                  <i className="fas fa-door-closed text-pink-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Obstruction
                    <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">Frustrating</span>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">Makes it deliberately difficult to perform an action the user wants — like cancelling a subscription. Sign up in one click, but cancel only by calling a phone number during business hours, navigating through 15 screens, or writing a letter.</p>
                  <p className="text-gray-400 text-xs"><i className="fas fa-map-marker-alt mr-1"></i><strong>Where it hides:</strong> Account settings, subscription management, data deletion pages, unsubscribe flows</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                  <i className="fas fa-eye-slash text-blue-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Sneaking
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Hidden</span>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">Hides, disguises, or delays the disclosure of information relevant to the user. Hidden fees that appear only at checkout, pre-selected add-ons in your cart, or quietly changing terms of service.</p>
                  <p className="text-gray-400 text-xs"><i className="fas fa-map-marker-alt mr-1"></i><strong>Where it hides:</strong> Checkout pages, cart summaries, pricing pages, terms &amp; conditions</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                  <i className="fas fa-bell text-green-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Nagging
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Persistent</span>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">Repeatedly interrupts the user with requests, prompts, or notifications to push them into a desired action. Constant pop-ups asking you to enable notifications, rate the app, or upgrade to premium.</p>
                  <p className="text-gray-400 text-xs"><i className="fas fa-map-marker-alt mr-1"></i><strong>Where it hides:</strong> Pop-ups, notification prompts, in-app banners, email opt-in modals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Where Dark Patterns Hide - Visual */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">
              <i className="fas fa-map text-blue-600 mr-2"></i>Common Spots on a Webpage
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-cookie-bite text-red-500"></i>
                </div>
                <p className="text-xs font-medium text-gray-700">Cookie Banners</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-shopping-cart text-orange-500"></i>
                </div>
                <p className="text-xs font-medium text-gray-700">Checkout Pages</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-user-plus text-purple-500"></i>
                </div>
                <p className="text-xs font-medium text-gray-700">Sign-up Forms</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-cog text-blue-500"></i>
                </div>
                <p className="text-xs font-medium text-gray-700">Account Settings</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-tags text-green-500"></i>
                </div>
                <p className="text-xs font-medium text-gray-700">Pricing Pages</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-window-restore text-yellow-500"></i>
                </div>
                <p className="text-xs font-medium text-gray-700">Pop-ups &amp; Modals</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-times-circle text-pink-500"></i>
                </div>
                <p className="text-xs font-medium text-gray-700">Cancel Flows</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-envelope text-indigo-500"></i>
                </div>
                <p className="text-xs font-medium text-gray-700">Email Opt-ins</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 3: Why Dark Patterns Matter ─── */}
        <section id="why-it-matters" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">3</span>
            Why Dark Patterns Matter — How They Affect Us
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            You might think — "So what? A few extra clicks or a sneaky add-on, big deal." But dark patterns have real consequences that affect millions of people daily. Here is why you should care:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                <i className="fas fa-wallet text-sm"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Financial Loss</h4>
                <p className="text-gray-600 text-sm mt-1">Hidden charges, sneak-into-basket tactics, and auto-renewals you never agreed to can drain your wallet. A study by the FTC found that dark patterns contributed to <strong>billions of dollars</strong> in unwanted purchases and subscriptions globally each year.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                <i className="fas fa-user-secret text-sm"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Privacy Erosion</h4>
                <p className="text-gray-600 text-sm mt-1">Pre-checked data sharing boxes, confusing consent banners, and privacy zuckering trick you into giving away far more personal data than you intended. Your browsing habits, location data, and personal information end up with advertisers and data brokers.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                <i className="fas fa-brain text-sm"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Psychological Manipulation</h4>
                <p className="text-gray-600 text-sm mt-1">Confirmshaming ("No thanks, I don't want to save money") and urgency tactics exploit emotions like guilt, fear of missing out, and anxiety to override your rational decision-making. This is especially harmful to vulnerable users — children, the elderly, and those with cognitive disabilities.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                <i className="fas fa-handshake-slash text-sm"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Erosion of Trust</h4>
                <p className="text-gray-600 text-sm mt-1">When users realize they have been tricked, they lose trust — not just in that website, but in online services in general. This damages the entire digital ecosystem and makes people hesitant to engage with legitimate online services.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                <i className="fas fa-balance-scale text-sm"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Undermining Free Choice</h4>
                <p className="text-gray-600 text-sm mt-1">At their core, dark patterns undermine your ability to make free, informed decisions online. They take away your autonomy as a user and turn every interaction into a potential trap. In a democratic society, the right to make informed choices should not be compromised by deceptive design.</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-5 my-8">
            <div className="flex items-start">
              <i className="fas fa-lightbulb text-orange-600 mt-1 mr-3 text-lg"></i>
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">Think About It</h4>
                <p className="text-orange-800 text-sm leading-relaxed">
                  If a physical store hid the exit door and forced you to walk past every product before leaving, you would call it unacceptable. But websites do the digital equivalent of this every single day. Dark patterns are the invisible architecture of manipulation on the web — and awareness is the first step to fighting back.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 4: Common Dark Patterns We Detect ─── */}
        <section id="common-patterns" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">4</span>
            Most Common Dark Patterns We Detect
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Our AI-powered detection system is trained to identify the following dark patterns. These are the most prevalent deceptive practices found across the web today, and our model can flag them with high accuracy.
          </p>

          {/* Dark Pattern Examples — Visual Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-16 bg-red-500 flex items-center justify-center py-3 md:py-0">
                  <i className="fas fa-frown text-white text-xl md:text-lg"></i>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-gray-900">Confirmshaming</h4>
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Emotional Manipulation</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Uses guilt-tripping or shaming language to steer users away from declining an offer.</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Example:</p>
                    <p className="text-sm text-gray-700 italic">"No thanks, I prefer paying full price" &nbsp;|&nbsp; "I don't want to save money"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-16 bg-orange-500 flex items-center justify-center py-3 md:py-0">
                  <i className="fas fa-hourglass-half text-white text-xl md:text-lg"></i>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-gray-900">False Urgency</h4>
                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Pressure Tactic</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Creates artificial time pressure with countdown timers, limited stock warnings, or expiring deals that reset.</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Example:</p>
                    <p className="text-sm text-gray-700 italic">"Sale ends in 02:34:15!" &nbsp;|&nbsp; "Only 1 room left at this price!"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-16 bg-yellow-500 flex items-center justify-center py-3 md:py-0">
                  <i className="fas fa-cart-plus text-white text-xl md:text-lg"></i>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-gray-900">Sneak into Basket</h4>
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Hidden Addition</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Adds items, services, or insurance to the user's cart without explicit consent, hoping they will not notice before checkout.</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Example:</p>
                    <p className="text-sm text-gray-700 italic">"Protection plan added (+$5.99)" &nbsp;|&nbsp; "Travel insurance included"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-16 bg-purple-500 flex items-center justify-center py-3 md:py-0">
                  <i className="fas fa-eye-slash text-white text-xl md:text-lg"></i>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-gray-900">Hidden Costs</h4>
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Price Deception</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Reveals additional charges (service fees, processing fees, taxes) only at the final step of checkout, after the user is already committed.</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Example:</p>
                    <p className="text-sm text-gray-700 italic">"Service fee: $12.99" appearing at checkout &nbsp;|&nbsp; "Convenience charge applied"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-16 bg-blue-500 flex items-center justify-center py-3 md:py-0">
                  <i className="fas fa-user-shield text-white text-xl md:text-lg"></i>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-gray-900">Privacy Zuckering</h4>
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Data Exploitation</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Tricks users into sharing more personal data than intended through confusing settings, pre-checked consent boxes, or misleading privacy controls.</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Example:</p>
                    <p className="text-sm text-gray-700 italic">"Share data with partners [pre-checked]" &nbsp;|&nbsp; "Public by default" privacy settings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-16 bg-pink-500 flex items-center justify-center py-3 md:py-0">
                  <i className="fas fa-sign-in-alt text-white text-xl md:text-lg"></i>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-gray-900">Roach Motel</h4>
                    <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">Obstruction</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Makes it very easy to get into a situation (like a subscription) but deliberately difficult to get out. Named after the classic trap — easy to check in, nearly impossible to check out.</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Example:</p>
                    <p className="text-sm text-gray-700 italic">"Subscribe in 1 click, cancel via phone only" &nbsp;|&nbsp; "Delete account" buried 5 levels deep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 my-8">
            <div className="flex items-start">
              <i className="fas fa-robot text-blue-600 mt-1 mr-3 text-lg"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Our Detection Capability</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Our fine-tuned LayoutLM model detects these patterns with an <strong>F1 score of 90.09%</strong>, analyzing text content, visual layout, and spatial positioning simultaneously. <Link to="/how-it-works" className="text-blue-600 underline hover:text-blue-800 font-semibold">Learn how our AI works &rarr;</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 5: Regulatory Frameworks ─── */}
        <section id="regulatory-frameworks" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">5</span>
            Regulatory Frameworks — GDPR, EU DSA &amp; Beyond
          </h2>

          {/* GDPR & DSA Visual */}
          <figure className="my-8">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 overflow-hidden">
              <img
                src="/gdpr_eu_dsa.png"
                alt="GDPR and EU Digital Services Act regulatory frameworks"
                className="w-full rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-10 items-center justify-center" style={{ minHeight: '240px' }}>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30 overflow-hidden">
                      <img src="/gdpr_logo.png" alt="GDPR Official Logo" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-gray-900 text-lg">GDPR</p>
                    <p className="text-gray-500 text-xs">Since 2018</p>
                  </div>
                  <div className="text-4xl text-gray-300 hidden md:block">&amp;</div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
                      <i className="fas fa-landmark text-white text-3xl"></i>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">EU DSA</p>
                    <p className="text-gray-500 text-xs">Since 2024</p>
                  </div>
                  <div className="text-4xl text-gray-300 hidden md:block">&amp;</div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/30">
                      <i className="fas fa-globe-asia text-white text-3xl"></i>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">Others</p>
                    <p className="text-gray-500 text-xs">CCPA, DPDPA, etc.</p>
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="text-center text-sm text-gray-500 mt-3">
              <i className="fas fa-image mr-1"></i> Fig 2. Major regulatory frameworks addressing dark patterns worldwide
            </figcaption>
          </figure>

          <p className="text-gray-700 leading-relaxed mb-4">
            As dark patterns have become more widespread, governments and regulatory bodies around the world have stepped in to protect consumers. Several major legal frameworks now explicitly address or prohibit deceptive design practices:
          </p>

          {/* Framework Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                  <img src="/gdpr_logo.png" alt="GDPR" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">GDPR</h4>
                  <p className="text-xs text-gray-500">European Union, 2018</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The <strong>General Data Protection Regulation</strong> is the world's strictest data privacy law. While it does not use the term "dark patterns" directly, its requirements for <strong>freely given, specific, informed, and unambiguous consent</strong> (Articles 4, 5, 7, and 25) effectively prohibit most dark patterns related to data collection. The principle of "Data Protection by Design and by Default" (Article 25) mandates that privacy-friendly settings must be the default.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-landmark text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">EU Digital Services Act (DSA)</h4>
                  <p className="text-xs text-gray-500">European Union, 2024</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The <strong>Digital Services Act</strong> is the first major regulation to <strong>explicitly ban dark patterns by name</strong>. Article 25 prohibits online platforms from designing their interfaces in ways that deceive, manipulate, or materially distort the ability of users to make free and informed decisions.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-flag-usa text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">CCPA / CPRA</h4>
                  <p className="text-xs text-gray-500">California, USA</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The <strong>California Consumer Privacy Act</strong> and its amendment (CPRA) require businesses to provide a clear "Do Not Sell My Personal Information" link. The CPRA explicitly prohibits the use of dark patterns to obtain consumer consent, defining them as interfaces that "subvert or impair user autonomy."
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-globe-asia text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">India DPDPA</h4>
                  <p className="text-xs text-gray-500">India, 2023</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The <strong>Digital Personal Data Protection Act</strong> of India requires consent to be "free, specific, informed, unconditional and unambiguous" with a clear affirmative action. Section 6 makes it clear that consent obtained through deceptive dark pattern interfaces is not valid consent.
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-5 my-8">
            <div className="flex items-start">
              <i className="fas fa-globe text-purple-600 mt-1 mr-3 text-lg"></i>
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">Global Trend</h4>
                <p className="text-purple-800 text-sm leading-relaxed">
                  Beyond these, frameworks like <strong>Brazil's LGPD</strong>, <strong>South Korea's PIPA</strong>, <strong>Japan's APPI</strong>, and the <strong>UK's Data Protection Act</strong> also contain provisions that can be applied against dark patterns. The FTC in the United States has been actively taking enforcement actions against companies using dark patterns under its mandate to prevent "unfair or deceptive acts or practices."
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 6: Rules & Regulations ─── */}
        <section id="rules-regulations" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">6</span>
            Rules &amp; Regulations by Regulatory Boards
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Regulatory boards have laid down specific rules that directly target dark pattern practices. Here are the key provisions and what they mean in practice:
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-5 py-3 text-sm font-semibold">Regulation</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold">Key Article</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold">What It Prohibits</th>
                  <th className="text-center px-5 py-3 text-sm font-semibold">Penalty</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900 font-medium">GDPR</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Art. 5, 7, 25</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Invalid consent through pre-checked boxes, confusing opt-outs, non-transparent data processing</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-semibold">Up to 4% of global revenue</span></td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900 font-medium">EU DSA</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Art. 25</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Deceptive interface design, visual manipulation, making cancellation harder than sign-up</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-semibold">Up to 6% of global revenue</span></td>
                </tr>
                <tr className="bg-white border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900 font-medium">CCPA/CPRA</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Sec. 1798.140(l)</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Dark patterns to obtain consent, blocking "Do Not Sell" opt-outs</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-semibold">$7,500 per violation</span></td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900 font-medium">FTC Act</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Sec. 5</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Unfair or deceptive acts or practices in commerce</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-semibold">Case-by-case fines</span></td>
                </tr>
                <tr className="bg-white">
                  <td className="px-5 py-3 text-sm text-gray-900 font-medium">India DPDPA</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Sec. 6</td>
                  <td className="px-5 py-3 text-sm text-gray-600">Consent obtained through deceptive design not considered valid</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-semibold">Up to &#8377;250 crore</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Key Principles Across All Frameworks</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-start bg-white rounded-lg p-4 border border-gray-100">
              <i className="fas fa-check-circle text-green-500 mt-0.5 mr-3"></i>
              <div>
                <span className="font-semibold text-gray-900">Informed Consent:</span>
                <span className="text-gray-600 text-sm ml-1">Users must be given clear, understandable information before making choices. No burying critical information in walls of legalese.</span>
              </div>
            </div>
            <div className="flex items-start bg-white rounded-lg p-4 border border-gray-100">
              <i className="fas fa-check-circle text-green-500 mt-0.5 mr-3"></i>
              <div>
                <span className="font-semibold text-gray-900">Equal Choice Architecture:</span>
                <span className="text-gray-600 text-sm ml-1">Accepting and rejecting an option must be equally easy. A big green "Accept" button next to a tiny gray "Decline" link violates this principle.</span>
              </div>
            </div>
            <div className="flex items-start bg-white rounded-lg p-4 border border-gray-100">
              <i className="fas fa-check-circle text-green-500 mt-0.5 mr-3"></i>
              <div>
                <span className="font-semibold text-gray-900">Easy Withdrawal:</span>
                <span className="text-gray-600 text-sm ml-1">Cancelling a service or withdrawing consent must be as easy as signing up. No phone calls, no 15-step processes.</span>
              </div>
            </div>
            <div className="flex items-start bg-white rounded-lg p-4 border border-gray-100">
              <i className="fas fa-check-circle text-green-500 mt-0.5 mr-3"></i>
              <div>
                <span className="font-semibold text-gray-900">Privacy by Default:</span>
                <span className="text-gray-600 text-sm ml-1">The default settings must be the most privacy-protective option. No pre-checked data sharing or "public by default" profiles.</span>
              </div>
            </div>
            <div className="flex items-start bg-white rounded-lg p-4 border border-gray-100">
              <i className="fas fa-check-circle text-green-500 mt-0.5 mr-3"></i>
              <div>
                <span className="font-semibold text-gray-900">Transparency in Pricing:</span>
                <span className="text-gray-600 text-sm ml-1">All costs must be disclosed upfront. No hidden fees, surprise charges, or costs that only appear at the final checkout step.</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 7: Avoiding Dark Patterns ─── */}
        <section id="avoiding-dark-patterns" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">7</span>
            How UI/UX Developers Can Avoid Dark Patterns
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            As a UI/UX designer or developer, you play a crucial role in creating ethical digital experiences. Here are practical guidelines to ensure your designs respect users rather than manipulate them:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200 hover-lift">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-equals text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Make Choices Equal</h4>
              <p className="text-gray-600 text-sm">Give "Accept" and "Reject" buttons the same size, color prominence, and placement. Never make one option visually dominant over the other to steer decisions.</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 hover-lift">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-comment-dots text-blue-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Use Neutral Language</h4>
              <p className="text-gray-600 text-sm">Replace guilt-tripping copy like "No, I hate saving money" with neutral alternatives like "No, thanks" or "Decline offer." Let users make decisions without emotional pressure.</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 hover-lift">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-eye text-purple-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Be Transparent with Pricing</h4>
              <p className="text-gray-600 text-sm">Show the full price (including all fees and taxes) from the beginning. Never add items to the cart automatically or reveal hidden costs at the last step.</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 hover-lift">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-toggle-off text-orange-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Default to Privacy</h4>
              <p className="text-gray-600 text-sm">Never pre-check consent boxes or opt-in toggles. Start with the most privacy-friendly settings and let users actively choose to share more data if they wish.</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 hover-lift">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-door-open text-red-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Make Cancellation Easy</h4>
              <p className="text-gray-600 text-sm">If users can sign up in 2 clicks, they should be able to cancel in 2 clicks. Put the cancel/unsubscribe option in obvious, accessible locations — never hide it.</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 hover-lift">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-stopwatch text-yellow-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Avoid Fake Urgency</h4>
              <p className="text-gray-600 text-sm">Only show countdown timers and stock warnings when they reflect genuine scarcity. If a "limited time" deal resets every day, it is not limited — it is a lie.</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 hover-lift">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-universal-access text-indigo-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Design for Accessibility</h4>
              <p className="text-gray-600 text-sm">Consider vulnerable users — the elderly, children, and people with disabilities. Ensure critical choices are clear, readable, and understandable for everyone, not just tech-savvy users.</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 hover-lift">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-vial text-teal-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Test with Real Users</h4>
              <p className="text-gray-600 text-sm">Conduct usability testing to verify that users understand their choices and are not confused by the interface. If testers frequently make unintended choices, your design needs fixing.</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5 my-8">
            <div className="flex items-start">
              <i className="fas fa-heart text-green-600 mt-1 mr-3 text-lg"></i>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">The Business Case for Ethical Design</h4>
                <p className="text-green-800 text-sm leading-relaxed">
                  Ethical design is not just the right thing to do — it is also good business. Studies show that transparent, user-respecting interfaces lead to <strong>higher customer trust, better retention rates, and stronger brand loyalty</strong>. Companies that avoid dark patterns also avoid the risk of massive regulatory fines (up to 6% of global revenue under the EU DSA) and reputational damage from public backlash.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 8: Conclusion ─── */}
        <section id="conclusion" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">8</span>
            Conclusion
          </h2>

          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-flag-checkered text-blue-400 mr-3"></i>
              The Fight for a Fair Web
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dark patterns are not just a design flaw — they are a <strong className="text-white">systematic erosion of user autonomy</strong> on the web. From false urgency on booking sites to privacy-eroding consent banners, these deceptive practices affect billions of users every day, costing them money, privacy, and trust.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The good news is that the world is waking up. Regulations like the <strong className="text-white">GDPR</strong>, <strong className="text-white">EU Digital Services Act</strong>, <strong className="text-white">CCPA</strong>, and <strong className="text-white">India's DPDPA</strong> are creating legal accountability for deceptive design. Penalties are real and growing — companies can face fines up to 6% of their global revenue for violations.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              But regulation alone is not enough. We need <strong className="text-white">tools that can detect and expose dark patterns at scale</strong> — which is exactly what our platform does. By combining multi-modal AI with regulatory mapping, we empower users, researchers, and regulators to hold websites accountable.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Whether you are a <strong className="text-white">consumer</strong> wanting to protect yourself, a <strong className="text-white">developer</strong> striving to build ethical interfaces, or a <strong className="text-white">regulator</strong> enforcing compliance — understanding dark patterns is the first step. The second step is taking action.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <i className="fas fa-search mr-2"></i>
                Scan a Website Now
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                <i className="fas fa-book-open mr-2"></i>
                Learn How Our AI Works
              </Link>
            </div>
          </div>
        </section>

      </article>
    </div>
  );
}
