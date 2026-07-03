const pptxgen = require('pptxgenjs');

let pptx = new pptxgen();

// Theme and defaults
pptx.layout = 'LAYOUT_16x9';
pptx.defineSlideMaster({
  title: 'MASTER_SLIDE',
  background: { color: 'FFFFFF' },
  objects: [
    { rect: { x: 0, y: 0, w: '100%', h: 0.8, fill: { color: '003366' } } },
    { text: { text: 'Rift Valley Fever Vaccine Management System', options: { x: 0.5, y: 0.2, w: '90%', h: 0.4, color: 'FFFFFF', fontSize: 18, bold: true } } }
  ]
});

// Helper function to create standard slides
function addStandardSlide(title, bullets) {
  let slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide.addText(title, { x: 0.5, y: 1.0, w: '90%', h: 0.6, fontSize: 32, bold: true, color: '003366' });
  
  let bulletConfig = bullets.map(b => ({ text: b, options: { bullet: true, fontSize: 20, color: '333333', breakLine: true } }));
  slide.addText(bulletConfig, { x: 0.5, y: 1.8, w: '90%', h: 4.5, valign: 'top' });
}

// Slide 1: Title Slide
let slide1 = pptx.addSlide();
slide1.background = { color: '003366' };
slide1.addText('Rift Valley Fever Vaccine Management System', { x: 1, y: 2, w: '80%', h: 1.5, fontSize: 44, bold: true, color: 'FFFFFF', align: 'center' });
slide1.addText('Comprehensive Inventory & Distribution Management', { x: 1, y: 3.5, w: '80%', h: 1, fontSize: 24, color: 'E0E0E0', align: 'center' });

// Slide 2: Core System Overview
addStandardSlide('Core System Overview', [
  'End-to-end tracking from supplier to final distribution.',
  'Multi-tier stock hierarchy (Central Stock -> Hubs -> Local Stocks).',
  'Secure, transparent, and auditable operations.'
]);

// Slide 3: System Data Flow & Distribution Workflow (Flowchart)
let flowSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
flowSlide.addText('System Data Flow & Distribution Workflow', { x: 0.5, y: 1.0, w: '90%', h: 0.6, fontSize: 32, bold: true, color: '003366' });

const boxOpts = { color: 'FFFFFF', fontSize: 14, bold: true, align: 'center', valign: 'middle' };

// Physical Distribution Flow
flowSlide.addText('Physical Vaccine Distribution Flow (Top-Down):', { x: 0.5, y: 1.8, w: '90%', h: 0.5, fontSize: 20, bold: true, color: '333333' });

flowSlide.addText('1. Central Stock\n(Receives from Supplier)', { shape: pptx.ShapeType.rect, x: 0.5, y: 2.4, w: 2.2, h: 1, fill: { color: '4472C4' }, line: { color: '2F528F' }, ...boxOpts });
flowSlide.addShape(pptx.ShapeType.rightArrow, { x: 2.8, y: 2.7, w: 0.6, h: 0.4, fill: { color: 'A5A5A5' } });

flowSlide.addText('2. Zipline\n(Main Hub)', { shape: pptx.ShapeType.rect, x: 3.5, y: 2.4, w: 2.2, h: 1, fill: { color: 'ED7D31' }, line: { color: 'C00000' }, ...boxOpts });
flowSlide.addShape(pptx.ShapeType.rightArrow, { x: 5.8, y: 2.7, w: 0.6, h: 0.4, fill: { color: 'A5A5A5' } });

flowSlide.addText('3. Sector\n(Intermediate Hub)', { shape: pptx.ShapeType.rect, x: 6.5, y: 2.4, w: 2.2, h: 1, fill: { color: '70AD47' }, line: { color: '548235' }, ...boxOpts });
flowSlide.addShape(pptx.ShapeType.rightArrow, { x: 8.8, y: 2.7, w: 0.6, h: 0.4, fill: { color: 'A5A5A5' } });

flowSlide.addText('4. Veterinary\n(End User)', { shape: pptx.ShapeType.rect, x: 9.5, y: 2.4, w: 2.2, h: 1, fill: { color: 'FFC000' }, line: { color: 'C09000' }, ...boxOpts });


// Request Workflow
flowSlide.addText('Request & Approval Workflow (Bottom-Up):', { x: 0.5, y: 3.8, w: '90%', h: 0.5, fontSize: 20, bold: true, color: '333333' });

flowSlide.addText('4. Central Stock\n(Approves & Distributes)', { shape: pptx.ShapeType.rect, x: 0.5, y: 4.4, w: 2.2, h: 1, fill: { color: '5B9BD5' }, ...boxOpts });
flowSlide.addShape(pptx.ShapeType.leftArrow, { x: 2.8, y: 4.7, w: 0.6, h: 0.4, fill: { color: 'A5A5A5' } });

flowSlide.addText('3. Zipline\n(Requests from Central)', { shape: pptx.ShapeType.rect, x: 3.5, y: 4.4, w: 2.2, h: 1, fill: { color: '5B9BD5' }, ...boxOpts });
flowSlide.addShape(pptx.ShapeType.leftArrow, { x: 5.8, y: 4.7, w: 0.6, h: 0.4, fill: { color: 'A5A5A5' } });

flowSlide.addText('2. Sector\n(Requests from Zipline)', { shape: pptx.ShapeType.rect, x: 6.5, y: 4.4, w: 2.2, h: 1, fill: { color: '5B9BD5' }, ...boxOpts });
flowSlide.addShape(pptx.ShapeType.leftArrow, { x: 8.8, y: 4.7, w: 0.6, h: 0.4, fill: { color: 'A5A5A5' } });

flowSlide.addText('1. Veterinary\n(Requests from Sector)', { shape: pptx.ShapeType.rect, x: 9.5, y: 4.4, w: 2.2, h: 1, fill: { color: '5B9BD5' }, ...boxOpts });

// Slide 3: Robust Security & Access Control
addStandardSlide('Robust Security & Access Control', [
  'Admin-Controlled Access: Centralized login with zero self-registration to ensure network security.',
  'Role-Based Permissions: Tailored access for Stock Receivers, Distributors, Viewers, and Admins.',
  'Secure Recovery: Password resets strictly require Admin review and approval.'
]);

// Slide 4: Smart Inventory & Batch Tracking
addStandardSlide('Detailed Batch & Inventory Management', [
  'Comprehensive Tracking: Logs batch numbers, expiry dates, carton structures, and exact doses.',
  'Supplier Records: Maintains a secure database of supplier information (visible only to Central Stock).',
  'Multi-Currency Support: Automatically converts supplier prices from USD/EUR to RWF using dynamically managed exchange rates.'
]);

// Slide 5: Customizable Distribution Hierarchy
addStandardSlide('Customizable Distribution Hierarchy', [
  'Dynamic Routing: Admin defines parent-child relationships (who requests from whom).',
  'Multi-Role Stocks: A stock point can act as an intermediate hub (receiving and distributing) or an end-user stock.',
  'Restricted Visibility: Subordinate stocks only see their designated parent\'s inventory.'
]);

// Slide 6: Data Visibility & Privacy
addStandardSlide('Data Visibility & Privacy', [
  'Central Hub Access: Full visibility into prices, total financial values, and supplier identities.',
  'Subordinate Hub Access: Completely restricted from financial data and supplier names.',
  'Inventory Access: Subordinate hubs only see Vaccine Name, Batch Number, and Available Quantity from their parent stock.'
]);

// Slide 7: Streamlined Stock Requests
addStandardSlide('Streamlined Stock Requests', [
  'Simple Requests: Subordinate stocks submit requests based on visible parent inventory.',
  'Managerial Oversight: Parent stock managers review, approve, or reject requests.',
  'In-Transit Tracking: Approved requests are processed and shipped, updating status to "In Transit" in real-time.'
]);

// Slide 8: Secure Delivery Confirmation
addStandardSlide('Secure Delivery Confirmation', [
  'Physical Verification: Receiving stock checks physical delivery against system records.',
  'Approve or Reject: Receivers can approve the delivery (finalizing the transfer) or reject it with a recorded reason.',
  'Automated Balancing: System automatically deducts from the parent and adds to the child inventory only upon final approval.'
]);

// Slide 9: Comprehensive Financial Oversight
addStandardSlide('Comprehensive Financial Oversight', [
  'Money In & Out: Tracks total investment in received stock and total value distributed.',
  'Real-Time Valuation: Calculates the current total value of all remaining vaccines in RWF.',
  'Audit Trails: Accurately monitors stock variance to ensure complete financial accountability across the network.'
]);

// Generate
pptx.writeFile({ fileName: 'RVF_VMS_Presentation_v2.pptx' })
  .then(fileName => {
    console.log('Successfully created presentation: ' + fileName);
  })
  .catch(err => {
    console.error('Error generating presentation: ' + err);
  });
