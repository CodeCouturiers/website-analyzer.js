class WebsiteAnalyzer {
  constructor() {
    this.results = {
      performance: {},
      accessibility: {},
      seo: {},
      errors: [],
      memory: {}
    };
  }

  async analyzeAll() {
    console.log('Starting full website analysis...');
    
    await this.checkPerformance();
    this.checkAccessibility();
    this.analyzeSEO();
    await this.checkMemory();
    this.setupErrorMonitoring();
    
    this.generateReport();
  }

  async checkPerformance() {
    const timing = window.performance.timing;
    
    this.results.performance = {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 'N/A',
      resources: {
        total: performance.getEntriesByType('resource').length,
        size: performance.getEntriesByType('resource')
          .reduce((total, resource) => total + (resource.transferSize || 0), 0)
      }
    };
  }

  checkAccessibility() {
    this.results.accessibility = {
      images: [],
      headings: [],
      contrast: [],
      aria: []
    };

    // Check images
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt) {
        this.results.accessibility.images.push({
          src: img.src,
          issue: 'Missing alt text'
        });
      }
    });

    // Check headings
    let lastLevel = 0;
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      const level = parseInt(heading.tagName[1]);
      if (level - lastLevel > 1) {
        this.results.accessibility.headings.push({
          text: heading.textContent,
          issue: `Skipped heading level from ${lastLevel} to ${level}`
        });
      }
      lastLevel = level;
    });

    // Check ARIA
    document.querySelectorAll('[role]').forEach(el => {
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        this.results.accessibility.aria.push({
          element: el.tagName,
          role: el.getAttribute('role'),
          issue: 'Missing aria-label or aria-labelledby'
        });
      }
    });
  }

  analyzeSEO() {
    this.results.seo = {
      meta: {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content,
        keywords: document.querySelector('meta[name="keywords"]')?.content,
        viewport: document.querySelector('meta[name="viewport"]')?.content,
        robots: document.querySelector('meta[name="robots"]')?.content
      },
      headings: {
        h1: Array.from(document.querySelectorAll('h1')).map(h => ({
          text: h.textContent,
          visible: this.isElementVisible(h)
        })),
        h2: Array.from(document.querySelectorAll('h2')).map(h => ({
          text: h.textContent,
          visible: this.isElementVisible(h)
        }))
      },
      links: {
        total: document.querySelectorAll('a').length,
        external: Array.from(document.querySelectorAll('a'))
          .filter(a => a.host !== window.location.host).length,
        broken: Array.from(document.querySelectorAll('a'))
          .filter(a => !a.href).length,
        nofollow: document.querySelectorAll('a[rel*="nofollow"]').length
      },
      images: {
        total: document.querySelectorAll('img').length,
        withAlt: document.querySelectorAll('img[alt]').length,
        withoutAlt: document.querySelectorAll('img:not([alt])').length,
        lazyLoaded: document.querySelectorAll('img[loading="lazy"]').length
      },
      structure: {
        hasMainTag: !!document.querySelector('main'),
        hasNavTag: !!document.querySelector('nav'),
        hasFooterTag: !!document.querySelector('footer'),
        hasArticleTags: document.querySelectorAll('article').length
      }
    };
  }

  isElementVisible(el) {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  async checkMemory() {
    if (!performance.memory) {
      this.results.memory = { error: 'Memory API not available' };
      return;
    }

    const initial = performance.memory.usedJSHeapSize;
    await new Promise(resolve => setTimeout(resolve, 3000));
    const final = performance.memory.usedJSHeapSize;

    this.results.memory = {
      initial: `${Math.round(initial / 1024 / 1024)} MB`,
      final: `${Math.round(final / 1024 / 1024)} MB`,
      difference: `${Math.round((final - initial) / 1024 / 1024)} MB`
    };
  }

  setupErrorMonitoring() {
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      this.results.errors.push({
        message: msg,
        location: `${url}:${lineNo}:${columnNo}`,
        stack: error?.stack,
        timestamp: new Date().toISOString()
      });
    };
  }

  generateReport() {
    // Log full results
    console.log('=== Website Analysis Report ===');
    console.group('Performance');
    console.table(this.results.performance);
    console.groupEnd();

    console.group('Accessibility Issues');
    console.table(this.results.accessibility);
    console.groupEnd();

    console.group('SEO Analysis');
    console.table(this.results.seo);
    console.groupEnd();

    console.group('Memory Usage');
    console.table(this.results.memory);
    console.groupEnd();

    console.group('Errors Detected');
    console.table(this.results.errors);
    console.groupEnd();

    // Save JSON report
    const jsonReport = JSON.stringify(this.results, null, 2);
    const blob = new Blob([jsonReport], {type: 'application/json'});
    const reportLink = document.createElement('a');
    reportLink.download = 'website-analysis-report.json';
    reportLink.href = URL.createObjectURL(blob);
    reportLink.click();
  }
}

// Запуск анализа
const analyzer = new WebsiteAnalyzer();
analyzer.analyzeAll().then(() => {
  console.log('Analysis complete! Check downloads for report.');
});
