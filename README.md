# Website Analyzer

`website-analyzer.js` is a lightweight JavaScript file that evaluates various aspects of your website's performance, accessibility, SEO, memory usage, and errors. It outputs a detailed analysis report in the console and also downloads a JSON file containing the results.

## Features

1. **Performance Analysis**  
   - Measures load time, DOM readiness, first paint, and resource usage.

2. **Accessibility Checks**  
   - Verifies `alt` attributes on images.  
   - Checks heading structure (e.g., skipped levels).  
   - Looks for missing `aria-label` or `aria-labelledby` on elements with `role`.

3. **SEO Analysis**  
   - Gathers meta tag information (title, description, etc.).  
   - Logs headings (H1, H2) and their visibility.  
   - Calculates total, external, broken, and nofollow links.  
   - Counts images with/without `alt` and checks if they are lazy-loaded.  
   - Checks the presence of semantic tags (`main`, `nav`, `footer`, `article`).

4. **Memory Usage**  
   - Compares JavaScript heap size over a short interval (3 seconds).  
   - Displays initial, final, and the difference in MB.

5. **Error Monitoring**  
   - Captures global JavaScript errors and logs them in an array with a timestamp.

6. **Downloadable JSON Report**  
   - Automatically generates and downloads a detailed `.json` report after analysis.

## How to Use

1. **Include the Script**  
   Place `website-analyzer.js` in your project. For example:
   ```html
   <script src="website-analyzer.js"></script>
   ```

2. **Initiate the Analyzer**  
   Create a new instance of the `WebsiteAnalyzer` class and call the `analyzeAll()` method:
   ```html
   <script>
     const analyzer = new WebsiteAnalyzer();
     analyzer.analyzeAll().then(() => {
       console.log('Analysis complete! Check downloads for the report.');
     });
   </script>
   ```

3. **Review the Report**  
   - Open the browser console to view the analysis details.  
   - Look for a downloaded file named `website-analysis-report.json` for in-depth results.

## Requirements

- Modern browser that supports:
  - `window.performance` APIs.
  - `Blob`, `URL.createObjectURL`.
- (Optional) Memory analysis requires the `performance.memory` API, which is currently available in Chromium-based browsers.

## Example Output

1. **Console Output**  
   - **Performance**  
   - **Accessibility Issues**  
   - **SEO Analysis**  
   - **Memory Usage**  
   - **Errors Detected**

2. **JSON Report**  
   ```json
   {
     "performance": {
       "loadTime": 1234,
       "domReady": 1234,
       ...
     },
     "accessibility": {
       "images": [...],
       "headings": [...],
       ...
     },
     "seo": {
       "meta": {
         "title": "...",
         "description": "...",
         ...
       },
       ...
     },
     "memory": {
       "initial": "10 MB",
       "final": "12 MB",
       "difference": "2 MB"
     },
     "errors": [
       {
         "message": "...",
         "location": "...",
         "stack": "...",
         "timestamp": "..."
       }
     ]
   }
   ```

## Contributing

Feel free to submit pull requests or open issues for:
- Additional checks and improvements.
- Compatibility with more browsers or frameworks.

---

**Happy analyzing!**
