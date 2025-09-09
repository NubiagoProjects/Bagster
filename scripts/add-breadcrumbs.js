const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../app');
const breadcrumbImport = "import Breadcrumb from '@/components/ui/Breadcrumb'";
const breadcrumbComponent = "          <Breadcrumb />";

// Pages that should have breadcrumbs (excluding homepage)
const pageFiles = [
  'careers/page.tsx',
  'faq/page.tsx',
  'privacy/page.tsx',
  'terms/page.tsx',
  'cookies/page.tsx',
  'login/page.tsx',
  'register/page.tsx',
  'forgot-password/page.tsx',
  'dashboard/page.tsx',
  'profile/page.tsx',
  'shipments/page.tsx',
  'tracking/page.tsx',
  'carriers/page.tsx',
  'carrier/dashboard/page.tsx',
  'admin/dashboard/page.tsx',
  'api/page.tsx',
  'feedback/page.tsx',
  'status/page.tsx'
];

function addBreadcrumbToPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has breadcrumb
    if (content.includes("import Breadcrumb from '@/components/ui/Breadcrumb'")) {
      console.log(`Skipping ${filePath} - already has breadcrumb`);
      return;
    }
    
    // Add import
    const headerImportRegex = /import Header from '@\/components\/ui\/Header'/;
    if (headerImportRegex.test(content)) {
      content = content.replace(
        headerImportRegex,
        `import Header from '@/components/ui/Header'\nimport Breadcrumb from '@/components/ui/Breadcrumb'`
      );
    }
    
    // Add breadcrumb component after the first div with max-w-7xl
    const containerRegex = /(<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">)/;
    if (containerRegex.test(content)) {
      content = content.replace(
        containerRegex,
        `$1\n          <Breadcrumb />`
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Added breadcrumb to ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all page files
pageFiles.forEach(pageFile => {
  const fullPath = path.join(pagesDir, pageFile);
  if (fs.existsSync(fullPath)) {
    addBreadcrumbToPage(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('Breadcrumb addition complete!');
