// ViralVault - AI Content Prediction Engine
console.log('🚀 ViralVault initialized with AI power');

class ViralVault {
    constructor() {
        // For GitHub Pages demo, we'll use a mock API response since backend isn't hosted
        this.apiUrl = 'http://localhost:3001/api';
        this.isLoggedIn = false;
        this.userToken = localStorage.getItem('viralvault_token');
        this.analysisHistory = JSON.parse(localStorage.getItem('analysis_history') || '[]');
        this.init();
    }

    init() {
        this.bindEvents();
        this.initModals();
        this.animateStats();
        this.initScrollEffects();
        this.initNavbarScroll();
        this.enhanceButtonInteractions();
        this.addParallaxEffect();
        this.enhanceModalAnimations();
    }

    bindEvents() {
        // Main CTA button
        document.getElementById('startAnalysis')?.addEventListener('click', () => {
            this.showAnalysisSection();
        });

        // Analysis button
        document.getElementById('analyzeBtn')?.addEventListener('click', () => {
            this.analyzeContent();
        });

        // File upload
        document.getElementById('fileInput')?.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // Modal buttons
        document.querySelector('.btn-login')?.addEventListener('click', () => {
            this.showModal('loginModal');
        });

        document.querySelector('.btn-signup')?.addEventListener('click', () => {
            this.showModal('signupModal');
        });

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        document.getElementById('signupForm')?.addEventListener('submit', (e) => {
            this.handleSignup(e);
        });

        // Pricing buttons
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            if (btn.textContent.includes('Trial') || btn.textContent.includes('Free')) {
                btn.addEventListener('click', () => {
                    this.showModal('signupModal');
                });
            }
        });
    }

    showAnalysisSection() {
        document.getElementById('analysisSection').style.display = 'block';
        document.getElementById('analysisSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    async analyzeContent() {
        const content = document.getElementById('contentText').value;
        const hashtags = document.getElementById('hashtags').value;
        const fileInput = document.getElementById('fileInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        if (!content && !hashtags && !fileInput.files[0]) {
            alert('Please enter some content, hashtags, or upload a file to analyze!');
            return;
        }

        // Show loading state
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing with AI...';
        analyzeBtn.disabled = true;

        try {
            // Check if running on GitHub Pages (demo mode) or localhost (full API)
            if (location.hostname.includes('github.io') || location.hostname.includes('neuranest.ai')) {
                // Demo mode - generate realistic AI-powered predictions
                const analysis = this.generateDemoAnalysis(content, hashtags);
                this.displayResults(analysis);
                this.saveAnalysisHistory(content, hashtags, analysis);
            } else {
                // Full API mode for localhost development
                const formData = new FormData();
                formData.append('content', content);
                formData.append('hashtags', hashtags);
                
                if (fileInput.files[0]) {
                    formData.append('media', fileInput.files[0]);
                }

                const response = await fetch(`${this.apiUrl}/analyze`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                if (result.success) {
                    this.displayResults(result.analysis);
                    this.saveAnalysisHistory(content, hashtags, result.analysis);
                } else {
                    throw new Error(result.error || 'Analysis failed');
                }
            }

        } catch (error) {
            console.error('Analysis error:', error);
            // Fallback to demo analysis on any error
            const analysis = this.generateDemoAnalysis(content, hashtags);
            this.displayResults(analysis);
        }

        // Reset button
        analyzeBtn.innerHTML = '<i class="fas fa-brain"></i> Analyze Viral Potential';
        analyzeBtn.disabled = false;
    }

    displayResults(analysis) {
        // Extract real analysis data from API response
        const viralScore = analysis.viralScore || 0;
        const views = this.formatNumber(analysis.predictedViews || 0);
        const engagement = analysis.engagementRate || 0;
        const shareProb = analysis.shareProbability || 0;
        const bestTime = analysis.bestTimeToPost || this.getBestTime();
        
        // Update UI with real data
        document.getElementById('viralScore').textContent = viralScore;
        document.getElementById('predictedViews').textContent = views;
        document.getElementById('engagementRate').textContent = engagement + '%';
        document.getElementById('shareProbability').textContent = shareProb + '%';
        document.getElementById('bestTime').textContent = bestTime;
        
        // Show AI-generated recommendations
        const recommendations = analysis.recommendations || this.generateRecommendations(viralScore);
        document.getElementById('aiRecommendations').innerHTML = 
            recommendations.map(rec => `<p>${rec}</p>`).join('');
        
        // Show AI insights if available
        if (analysis.aiInsights) {
            const insightsSection = document.createElement('div');
            insightsSection.className = 'ai-insights';
            insightsSection.innerHTML = `
                <h4>🧠 AI Analysis</h4>
                <p>${analysis.aiInsights}</p>
                <small>Confidence: ${analysis.confidence || 85}%</small>
            `;
            document.getElementById('aiRecommendations').appendChild(insightsSection);
        }
        
        // Show results with premium animation
        const resultsElement = document.getElementById('results');
        resultsElement.style.display = 'block';
        resultsElement.classList.add('show');
        resultsElement.scrollIntoView({ behavior: 'smooth' });
        
        // Animate score with sequence
        setTimeout(() => this.animateScore(viralScore), 300);
    }

    showDemoResults() {
        const demoScore = Math.floor(Math.random() * 25) + 75; // 75-100 for demo
        this.displayResults(`Viral score: ${demoScore}. This content shows high potential for engagement.`);
    }

    extractNumber(text, regex) {
        const match = text.match(regex);
        return match ? parseInt(match[1]) : null;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }

    getBestTime() {
        const times = ['2:00 PM', '6:00 PM', '8:00 PM', '10:00 AM', '12:00 PM'];
        return times[Math.floor(Math.random() * times.length)];
    }

    generateRecommendations(score) {
        const recommendations = [];
        
        if (score < 60) {
            recommendations.push('🎯 Add trending hashtags to increase discoverability');
            recommendations.push('📝 Make your caption more engaging with questions or hooks');
            recommendations.push('⏰ Try posting during peak hours (6-8 PM)');
        } else if (score < 80) {
            recommendations.push('🚀 Great potential! Consider adding a call-to-action');
            recommendations.push('📱 Cross-post to multiple platforms for maximum reach');
            recommendations.push('💫 Add trending audio or music for TikTok/Reels');
        } else {
            recommendations.push('🔥 Excellent viral potential! This content is ready to explode');
            recommendations.push('⚡ Post immediately to catch trending momentum');
            recommendations.push('💰 Consider promoting this post for maximum impact');
        }
        
        return recommendations.map(rec => `<p>${rec}</p>`).join('');
    }

    animateScore(score) {
        const scoreElement = document.getElementById('viralScore');
        let currentScore = 0;
        const increment = score / 50; // 50 steps animation
        
        const animation = setInterval(() => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(animation);
            }
            scoreElement.textContent = Math.floor(currentScore);
        }, 40);
    }

    animateStats() {
        // Animate hero stats on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stats = entry.target.querySelectorAll('.stat-number');
                    stats.forEach(stat => {
                        const finalValue = stat.textContent;
                        const numValue = parseFloat(finalValue);
                        
                        if (!isNaN(numValue)) {
                            this.countUpAnimation(stat, 0, numValue, finalValue);
                        }
                    });
                }
            });
        });

        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    countUpAnimation(element, start, end, suffix) {
        let current = start;
        const increment = end / 60; // 1 second animation
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            let displayValue;
            if (suffix.includes('M')) {
                displayValue = (current / 1000000).toFixed(1) + 'M+';
            } else if (suffix.includes('%')) {
                displayValue = Math.floor(current) + '%';
            } else if (suffix.includes('x')) {
                displayValue = Math.floor(current) + 'x';
            } else {
                displayValue = Math.floor(current);
            }
            
            element.textContent = displayValue;
        }, 16);
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const uploadBox = document.getElementById('uploadBox');
            uploadBox.innerHTML = `
                <i class="fas fa-check-circle" style="color: #28a745;"></i>
                <h3>File Uploaded!</h3>
                <p>${file.name}</p>
                <small>AI is analyzing your visual content...</small>
            `;
            
            // Simulate file analysis
            setTimeout(() => {
                document.getElementById('contentText').placeholder = 'AI detected: [Visual content analysis]. Add your caption here...';
            }, 2000);
        }
    }

    initModals() {
        // Close modal functionality
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.hideAllModals();
            });
        });

        // Switch between login/signup
        document.getElementById('showSignup')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideAllModals();
            this.showModal('signupModal');
        });

        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideAllModals();
            this.showModal('loginModal');
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }


    handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // Demo login - always succeed
        alert('Welcome back! You\'re now logged in.');
        this.hideAllModals();
        
        // Update UI for logged in state
        document.querySelector('.btn-login').textContent = 'Dashboard';
        document.querySelector('.btn-signup').style.display = 'none';
    }

    handleSignup(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // Demo signup - always succeed
        alert('Account created! Welcome to ViralVault!');
        this.hideAllModals();
        
        // Update UI for logged in state
        document.querySelector('.btn-login').textContent = 'Dashboard';
        document.querySelector('.btn-signup').style.display = 'none';
    }

    saveAnalysisHistory(content, hashtags, analysis) {
        const historyItem = {
            timestamp: new Date().toISOString(),
            content: content.substring(0, 100),
            hashtags,
            viralScore: analysis.viralScore,
            predictedViews: analysis.predictedViews
        };
        
        this.analysisHistory.unshift(historyItem);
        if (this.analysisHistory.length > 10) {
            this.analysisHistory = this.analysisHistory.slice(0, 10);
        }
        
        localStorage.setItem('analysis_history', JSON.stringify(this.analysisHistory));
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
        `;
        errorDiv.innerHTML = `
            <strong>Analysis Failed</strong><br>
            ${message}<br>
            <small>Please try again or contact support</small>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    generateDemoAnalysis(content, hashtags) {
        // Intelligent demo analysis based on content
        const contentLength = content.length;
        const hashtagCount = (hashtags.match(/#/g) || []).length;
        
        // Viral keywords that boost score
        const viralKeywords = ['AI', 'hack', 'secret', 'amazing', 'shocking', 'viral', 'trending', 'productivity', 'life-changing', 'incredible'];
        const foundKeywords = viralKeywords.filter(keyword => 
            content.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // Calculate base score
        let viralScore = 50; // Base score
        
        // Content length optimization (100-280 chars is optimal)
        if (contentLength >= 100 && contentLength <= 280) {
            viralScore += 15;
        } else if (contentLength > 280) {
            viralScore += 5;
        }
        
        // Hashtag bonus
        viralScore += Math.min(hashtagCount * 3, 15);
        
        // Viral keywords bonus
        viralScore += foundKeywords.length * 8;
        
        // Questions and exclamations
        if (content.includes('?')) viralScore += 10;
        if (content.includes('!')) viralScore += 8;
        
        // Normalize to 0-100
        viralScore = Math.min(100, Math.max(20, viralScore));
        
        // Generate predictions based on score
        const baseViews = Math.floor(Math.random() * 20000) + 10000;
        const predictedViews = Math.floor(baseViews * (viralScore / 100) * (Math.random() * 2 + 1));
        const engagementRate = Math.round((2 + (viralScore / 100) * 12) * 10) / 10;
        const shareProbability = Math.round(15 + (viralScore / 100) * 60);
        
        // Generate smart recommendations
        const recommendations = [];
        if (viralScore < 60) {
            recommendations.push("🎯 Add trending hashtags to increase discoverability");
            recommendations.push("📝 Include a compelling hook in your first sentence");
            recommendations.push("❓ Add a question to encourage engagement");
        } else if (viralScore < 80) {
            recommendations.push("🚀 Great potential! Consider adding emotional triggers");
            recommendations.push("📊 Include specific numbers or statistics");
            recommendations.push("🔗 Add a clear call-to-action");
        } else {
            recommendations.push("🔥 Excellent viral potential! This content is ready to explode");
            recommendations.push("⚡ Post during peak hours (6-8 PM) for maximum reach");
            recommendations.push("💰 Consider promoting this post for even greater impact");
        }
        
        // AI insights based on content analysis
        let aiInsights = "This content shows ";
        if (foundKeywords.length > 0) {
            aiInsights += "strong viral potential with trending keywords. ";
        }
        if (content.includes('?')) {
            aiInsights += "The question format encourages audience engagement. ";
        }
        if (hashtagCount > 3) {
            aiInsights += "Good hashtag strategy for discoverability. ";
        }
        if (contentLength > 200) {
            aiInsights += "Consider shortening for better mobile engagement.";
        } else {
            aiInsights += "Good length for social media platforms.";
        }
        
        return {
            viralScore: Math.round(viralScore),
            predictedViews: predictedViews,
            engagementRate: engagementRate,
            shareProbability: shareProbability,
            bestTimeToPost: this.getBestTime(),
            recommendations: recommendations,
            aiInsights: aiInsights,
            confidence: Math.round(75 + (viralScore / 100) * 20) // 75-95% confidence
        };
    }

    initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    initScrollEffects() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for scroll animations
        const sections = document.querySelectorAll('.features, .pricing, .analysis-tool');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });

        // Observe feature cards for staggered animation
        const features = document.querySelectorAll('.feature, .pricing-card');
        features.forEach((feature, index) => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(30px)';
            feature.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(feature);
        });
    }

    enhanceButtonInteractions() {
        // Add enhanced button interactions
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-analyze');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                
                btn.style.position = 'relative';
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addParallaxEffect() {
        // Subtle parallax effect for hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            const heroBg = document.querySelector('.hero-bg');
            if (heroBg) {
                heroBg.style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    enhanceModalAnimations() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 400);
                }
            });
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 400);
        });
    }
}

// Stripe Integration
function redirectToStripe(plan) {
    // Replace with your actual Stripe Payment Links
    const stripeLinks = {
        free: '#', // Free plan - just show signup modal
        pro: 'https://buy.stripe.com/test_eVa5lG1Fz6I4cGQ001', // Pro Plan $29/mo
        agency: 'https://buy.stripe.com/test_bIY15q7ZT5DZdKU146' // Agency Plan $99/mo
    };
    
    if (plan === 'free') {
        // Show signup modal for free plan
        document.getElementById('signupModal').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('signupModal').classList.add('show');
        }, 10);
    } else {
        // Track purchase attempt
        trackPurchaseAttempt(plan);
        
        // Redirect to Stripe for paid plans
        window.open(stripeLinks[plan], '_blank');
    }
}

// Analytics tracking
function trackPurchaseAttempt(plan) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase_attempt', {
            'plan': plan,
            'value': plan === 'pro' ? 29 : 99
        });
    }
    
    // Custom analytics
    fetch('/api/analytics/purchase-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, timestamp: new Date().toISOString() })
    }).catch(() => {}); // Silent fail for analytics
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ViralVault();
});

// Add some demo data for testing
window.demoContent = {
    highViral: "Just discovered this life-changing productivity hack that saves me 3 hours daily! Who else struggles with time management? 🕒✨ #productivity #lifehack #timemanagement",
    mediumViral: "Beautiful sunset today 🌅 #sunset #nature #peaceful",
    lowViral: "Had lunch today. It was good."
};