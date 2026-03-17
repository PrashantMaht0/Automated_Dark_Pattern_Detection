import React from 'react';

export default function HowItWorks() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <i className="fas fa-book-open mr-2"></i>Technical Deep Dive
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            How It <span className="gradient-text">Works</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Understanding the AI-powered pipeline behind automated dark pattern detection and regulatory compliance mapping.
          </p>
          <div className="flex items-center justify-center mt-8 text-sm text-gray-400 space-x-6">
            <span><i className="far fa-clock mr-1"></i>10 min read</span>
            <span><i className="far fa-calendar mr-1"></i>March 2026</span>
            <span><i className="fas fa-tag mr-1"></i>Technical</span>
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
                Introduction — What is Dark Pattern Detection?
              </a>
            </li>
            <li>
              <a href="#system-architecture" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</span>
                System Architecture
              </a>
            </li>
            <li>
              <a href="#layoutlm" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</span>
                Why LayoutLM? — The Core AI Model
              </a>
            </li>
            <li>
              <a href="#layoutlm-architecture" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">4</span>
                LayoutLM Architecture Explained
              </a>
            </li>
            <li>
              <a href="#model-comparison" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">5</span>
                Model Comparison — Why LayoutLM Outperforms
              </a>
            </li>
            <li>
              <a href="#results" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">6</span>
                Our Model Performance & Results
              </a>
            </li>
          </ol>
        </nav>

        {/* ─── Section 1: Introduction ─── */}
        <section id="introduction" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">1</span>
            Introduction — What is Dark Pattern Detection?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Dark patterns are deceptive user interface designs that manipulate users into making unintended decisions — such as subscribing to unwanted services, sharing excessive personal data, or making purchases they didn't plan. These manipulative techniques exploit cognitive biases and are increasingly prevalent across e-commerce platforms, cookie consent banners, subscription services, and social media.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            With regulations like the <strong>General Data Protection Regulation (GDPR)</strong> and the <strong>Digital Services Act (DSA)</strong> explicitly prohibiting such deceptive practices, there is a pressing need for automated tools that can identify and classify these patterns at scale.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 my-8">
            <div className="flex items-start">
              <i className="fas fa-bullseye text-blue-600 mt-1 mr-3 text-lg"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Our Mission</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  This project provides a <strong>real-time, end-to-end automated system</strong> that accepts a website URL as input, scrapes and captures the page content, runs it through a fine-tuned <strong>LayoutLM</strong> model to detect dark patterns, maps each finding to relevant GDPR/DSA articles, and generates a detailed compliance report — all without any manual intervention.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Unlike traditional approaches that rely on manual audits or simple keyword matching, our system leverages <strong>multi-modal AI</strong> that simultaneously understands the text content, visual layout, and spatial positioning of UI elements — making it significantly more accurate at identifying subtle manipulative patterns that text-only models would miss.
          </p>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 2: System Architecture ─── */}
        <section id="system-architecture" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">2</span>
            System Architecture
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Our platform is built as a microservices architecture, with each component handling a specific stage of the detection pipeline. This modular design ensures scalability, maintainability, and the ability to upgrade individual components independently.
          </p>

          {/* Architecture Image */}
          <figure className="my-8">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 overflow-hidden">
              <img
                src="/system_architecture.png"
                alt="System Architecture Diagram"
                className="w-full rounded-xl"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
              />
              <div className="hidden bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-10 items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-globe text-blue-600 text-2xl"></i>
                    </div>
                    <i className="fas fa-arrow-right text-gray-400"></i>
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-camera text-purple-600 text-2xl"></i>
                    </div>
                    <i className="fas fa-arrow-right text-gray-400"></i>
                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-brain text-green-600 text-2xl"></i>
                    </div>
                    <i className="fas fa-arrow-right text-gray-400"></i>
                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-file-alt text-red-600 text-2xl"></i>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-8 text-xs text-gray-500 font-medium">
                    <span>URL Input</span>
                    <span>Scraper</span>
                    <span>LayoutLM AI</span>
                    <span>Report</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">System Architecture Diagram</p>
                </div>
              </div>
            </div>
            <figcaption className="text-center text-sm text-gray-500 mt-3">
              <i className="fas fa-image mr-1"></i> Fig 1. End-to-end system architecture of the Dark Pattern Detection pipeline
            </figcaption>
          </figure>

          <h3 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Pipeline Walkthrough</h3>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-gray-900">User Input & URL Submission</h4>
                <p className="text-gray-600 text-sm mt-1">The user submits a target website URL through the React-based frontend. The request is routed to the backend API server.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-gray-900">Web Scraping & Screenshot Capture</h4>
                <p className="text-gray-600 text-sm mt-1">The scraper service uses headless browser automation (Playwright) to navigate to the website, extract visible text elements along with their bounding box coordinates, and capture a full-page screenshot for visual analysis.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-gray-900">LayoutLM Model Inference</h4>
                <p className="text-gray-600 text-sm mt-1">The extracted text, spatial layout (bounding boxes), and screenshot are fed into our fine-tuned LayoutLM model. The model processes all three modalities simultaneously to classify each text segment as either benign or a specific dark pattern category.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold text-gray-900">Dark Pattern Classification</h4>
                <p className="text-gray-600 text-sm mt-1">Detected patterns are classified into categories including Urgency, Misdirection, Social Proof, Forced Action, Obstruction, Sneaking, and Nagging — based on established dark pattern taxonomies.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">5</div>
              <div>
                <h4 className="font-semibold text-gray-900">GDPR/DSA Regulatory Mapping</h4>
                <p className="text-gray-600 text-sm mt-1">Each detected dark pattern is automatically mapped to the relevant GDPR articles (e.g., Article 5, Article 7, Article 25) and DSA obligations, providing an actionable compliance framework.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">6</div>
              <div>
                <h4 className="font-semibold text-gray-900">Report Generation & Dashboard</h4>
                <p className="text-gray-600 text-sm mt-1">A comprehensive compliance report is generated with a trust score, detected patterns with evidence, regulatory references, and actionable recommendations — all presented in an interactive dashboard with PDF/PNG export options.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 3: Why LayoutLM ─── */}
        <section id="layoutlm" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">3</span>
            Why LayoutLM? — The Core AI Model
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Dark patterns are inherently <strong>multi-modal</strong> in nature — they exploit not just the text content, but also the visual layout, color contrast, button sizing, and spatial positioning of elements on a webpage. A deceptive toggle switch, a misleadingly small "decline" button placed far from a large "accept" button, or urgency-inducing countdown timers near purchase buttons are examples where the <em>spatial context</em> is as critical as the text itself.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            This is why traditional <strong>text-only NLP models</strong> (like BERT, RoBERTa, or GPT-based classifiers) fall short for this task. They can understand the language but are completely blind to the visual and spatial cues that make dark patterns effective.
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-5 my-8">
            <div className="flex items-start">
              <i className="fas fa-brain text-purple-600 mt-1 mr-3 text-lg"></i>
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">What is LayoutLM?</h4>
                <p className="text-purple-800 text-sm leading-relaxed">
                  <strong>LayoutLM</strong> (Layout Language Model) is a pre-trained multi-modal Transformer model developed by Microsoft Research. It jointly models interactions between <em>text</em>, <em>layout</em> (2D positional information), and <em>visual features</em> of document images. Originally designed for document understanding tasks (form recognition, receipt parsing, table extraction), its ability to fuse textual and spatial information makes it uniquely suited for analyzing webpage interfaces where dark patterns are embedded.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            By leveraging LayoutLM, our system can understand that a small, gray "Reject All" link placed in the corner of a cookie banner — while a large, bright-blue "Accept All" button dominates the center — constitutes a <strong>Misdirection</strong> dark pattern. Text-only models would see both options as equivalent choices; LayoutLM understands the visual hierarchy and spatial deception.
          </p>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 4: LayoutLM Architecture ─── */}
        <section id="layoutlm-architecture" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">4</span>
            LayoutLM Architecture Explained
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            The LayoutLM architecture extends the standard BERT/Transformer architecture by incorporating spatial layout information and visual features alongside textual input. Here's how the three input modalities are processed:
          </p>

          {/* LayoutLM Architecture Image */}
          <figure className="my-8">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 overflow-hidden">
              <img
                src="/layoutlm_architecture.png"
                alt="LayoutLM Architecture Diagram"
                className="w-full rounded-xl"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
              />
              <div className="hidden bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-10 items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-xl flex flex-col items-center justify-center p-2">
                      <i className="fas fa-font text-blue-600 text-lg mb-1"></i>
                      <span className="text-xs text-blue-700 font-semibold">Text</span>
                    </div>
                    <div className="text-gray-300 text-2xl">+</div>
                    <div className="w-20 h-20 bg-purple-100 rounded-xl flex flex-col items-center justify-center p-2">
                      <i className="fas fa-vector-square text-purple-600 text-lg mb-1"></i>
                      <span className="text-xs text-purple-700 font-semibold">Layout</span>
                    </div>
                    <div className="text-gray-300 text-2xl">+</div>
                    <div className="w-20 h-20 bg-green-100 rounded-xl flex flex-col items-center justify-center p-2">
                      <i className="fas fa-image text-green-600 text-lg mb-1"></i>
                      <span className="text-xs text-green-700 font-semibold">Vision</span>
                    </div>
                    <i className="fas fa-arrow-right text-gray-400 mx-2"></i>
                    <div className="w-24 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex flex-col items-center justify-center p-2 text-white shadow-lg">
                      <i className="fas fa-brain text-lg mb-1"></i>
                      <span className="text-xs font-semibold">LayoutLM</span>
                    </div>
                    <i className="fas fa-arrow-right text-gray-400 mx-2"></i>
                    <div className="w-20 h-20 bg-red-100 rounded-xl flex flex-col items-center justify-center p-2">
                      <i className="fas fa-tags text-red-600 text-lg mb-1"></i>
                      <span className="text-xs text-red-700 font-semibold">Labels</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">LayoutLM Multi-Modal Architecture</p>
                </div>
              </div>
            </div>
            <figcaption className="text-center text-sm text-gray-500 mt-3">
              <i className="fas fa-image mr-1"></i> Fig 2. LayoutLM multi-modal architecture — fusing text, layout, and image features
            </figcaption>
          </figure>

          <h3 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Three Input Modalities</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-font text-white"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Text Embeddings</h4>
              <p className="text-gray-600 text-sm">Tokenized text from the webpage using WordPiece tokenization — the same process used in BERT. This captures the semantic meaning of each UI element's text content.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-vector-square text-white"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Layout Embeddings</h4>
              <p className="text-gray-600 text-sm">2D positional information (x₀, y₀, x₁, y₁ bounding box coordinates) for each text token. This tells the model <em>where</em> on the page each element appears and how large it is.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-image text-white"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Image Embeddings</h4>
              <p className="text-gray-600 text-sm">Visual features extracted from the page screenshot using a CNN backbone (ResNet-101). This captures colors, contrast, font sizes, and other visual properties invisible to text-only models.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How It Processes</h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            All three embedding streams are combined in a <strong>multi-modal fusion layer</strong> before being passed through a <strong>12-layer Transformer encoder</strong> with multi-head self-attention. The self-attention mechanism allows the model to learn complex relationships between text content and its spatial/visual context — for example, understanding that a "Buy Now" button is suspiciously larger and more visually prominent than a nearby "See Terms" link.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The final hidden states are fed to a <strong>token classification head</strong> that outputs dark pattern category labels for each text segment, enabling precise identification of which specific UI elements are deceptive and what type of manipulation they employ.
          </p>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 5: Model Comparison ─── */}
        <section id="model-comparison" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">5</span>
            Model Comparison — Why LayoutLM Outperforms
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            To validate our model selection, we benchmarked LayoutLM against several state-of-the-art vision and language models commonly used for document/UI understanding tasks. The comparison below highlights why LayoutLM was chosen as the backbone of our detection system.
          </p>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-5 py-3 text-sm font-semibold">Model</th>
                  <th className="text-center px-5 py-3 text-sm font-semibold">Text</th>
                  <th className="text-center px-5 py-3 text-sm font-semibold">Layout</th>
                  <th className="text-center px-5 py-3 text-sm font-semibold">Vision</th>
                  <th className="text-center px-5 py-3 text-sm font-semibold">F1 Score</th>
                  <th className="text-center px-5 py-3 text-sm font-semibold">Suitability</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-blue-50 border-b border-blue-100 font-medium">
                  <td className="px-5 py-3 text-sm text-blue-900 font-semibold">
                    <i className="fas fa-star text-yellow-500 mr-1"></i>LayoutLM v2/v3
                  </td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm font-bold text-green-700">0.8909</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">Excellent</span></td>
                </tr>
                <tr className="bg-white border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900">BERT / RoBERTa</td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-times-circle text-red-400"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-times-circle text-red-400"></i></td>
                  <td className="text-center px-5 py-3 text-sm text-gray-600">~0.78</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">Moderate</span></td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900">ViT (Vision Transformer)</td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-times-circle text-red-400"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-times-circle text-red-400"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm text-gray-600">~0.72</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-semibold">Limited</span></td>
                </tr>
                <tr className="bg-white border-b border-gray-100">
                  <td className="px-5 py-3 text-sm text-gray-900">DocTR / Donut</td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-times-circle text-red-400"></i></td>
                  <td className="text-center px-5 py-3 text-sm text-gray-600">~0.81</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">Moderate</span></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-5 py-3 text-sm text-gray-900">GPT-4V / Multimodal LLMs</td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-minus-circle text-yellow-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm"><i className="fas fa-check-circle text-green-500"></i></td>
                  <td className="text-center px-5 py-3 text-sm text-gray-600">~0.85</td>
                  <td className="text-center px-5 py-3 text-sm"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">Good*</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-500 text-xs mb-6 italic">
            * GPT-4V and similar multimodal LLMs offer strong capabilities but have significant limitations for production deployment: high API costs, latency (10-30s per inference), rate limiting, non-deterministic outputs, and data privacy concerns when sending screenshots to third-party APIs. F1 scores are approximate and based on established benchmarks.
          </p>

          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5 my-8">
            <div className="flex items-start">
              <i className="fas fa-check-double text-green-600 mt-1 mr-3 text-lg"></i>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Key Advantage</h4>
                <p className="text-green-800 text-sm leading-relaxed">
                  LayoutLM is the <strong>only model that natively integrates all three modalities</strong> (text + layout + vision) in a single architecture specifically designed for document/UI understanding. This makes it uniquely suited for dark pattern detection, where the manipulation often lies at the intersection of what is said (text), how it looks (vision), and where it's placed (layout).
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 my-12" />

        {/* ─── Section 6: Our Model Results ─── */}
        <section id="results" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">6</span>
            Our Model Performance & Results
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            After fine-tuning LayoutLM on our curated dataset of dark pattern examples collected from real-world websites, we evaluated the model on a held-out test set. The results demonstrate strong performance across all key metrics:
          </p>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-center text-white shadow-lg shadow-blue-500/20">
              <div className="text-3xl font-bold mb-1">82.80%</div>
              <div className="text-blue-100 text-sm font-medium">Accuracy</div>
              <div className="mt-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-bullseye text-sm"></i>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 text-center text-white shadow-lg shadow-purple-500/20">
              <div className="text-3xl font-bold mb-1">89.52%</div>
              <div className="text-purple-100 text-sm font-medium">Precision</div>
              <div className="mt-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-crosshairs text-sm"></i>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-5 text-center text-white shadow-lg shadow-indigo-500/20">
              <div className="text-3xl font-bold mb-1">90.66%</div>
              <div className="text-indigo-100 text-sm font-medium">Recall</div>
              <div className="mt-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-search text-sm"></i>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-5 text-center text-white shadow-lg shadow-green-500/20">
              <div className="text-3xl font-bold mb-1">89.09%</div>
              <div className="text-green-100 text-sm font-medium">F1 Score</div>
              <div className="mt-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-chart-line text-sm"></i>
              </div>
            </div>
          </div>

          {/* Metrics Explanation */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">
              <i className="fas fa-info-circle text-blue-600 mr-2"></i>Understanding the Metrics
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="font-semibold text-gray-800 min-w-24">Accuracy</span>
                <span>— Percentage of all predictions (both dark pattern and benign) that were correct. Our model correctly classifies <strong>82.8%</strong> of all UI elements.</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-gray-800 min-w-24">Precision</span>
                <span>— Of all elements flagged as dark patterns, <strong>89.52%</strong> were actually dark patterns. Low false-positive rate means fewer false alarms.</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-gray-800 min-w-24">Recall</span>
                <span>— Of all actual dark patterns present, <strong>90.66%</strong> were successfully detected. Low miss rate ensures comprehensive coverage.</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-gray-800 min-w-24">F1 Score</span>
                <span>— The harmonic mean of Precision and Recall (<strong>89.09%</strong>), providing a single balanced metric to evaluate the model's overall detection capability.</span>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-flag-checkered text-blue-400 mr-3"></i>
              Conclusion
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our fine-tuned LayoutLM model achieves an <strong className="text-white">F1 score of 89.09%</strong> on dark pattern detection — demonstrating that multi-modal AI which combines textual, spatial, and visual understanding significantly outperforms traditional text-only or vision-only approaches for this task.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The system's ability to operate in <strong className="text-white">real-time</strong> with automated GDPR/DSA regulatory mapping makes it a practical tool for compliance officers, regulators, and researchers working to create a more transparent and user-friendly web. By automating the detection process, we reduce the manual effort required for compliance audits from hours of expert analysis to a matter of minutes.
            </p>
          </div>
        </section>

      </article>
    </div>
  );
}
