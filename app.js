/********************************************
 * 1. HELPER FUNCTIONS
 *
 * These functions provide utility operations such as
 * formatting numbers and currencies (with and without monospace styling),
 * controlling the collapse/expand state of the main calculation form,
 * and fading elements into view.
 ********************************************/

/**
 * Format a number to include commas and two decimal places.
 * This helper returns the raw formatted string.
 * @param {number} num - The number to format.
 * @returns {string} The formatted number string.
 */
function rawFormatNum(num) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Format a number with monospace styling by wrapping it in a span.
 * This version is used for results tables.
 * @param {number} num - The number to format.
 * @returns {string} The formatted number wrapped in a span with class "number".
 */
function formatNum(num) {
  return '<span class="number" style="font-family: \'Courier New\', Consolas, monospace;">' + rawFormatNum(num) + '</span>';
}

/**
 * Format a number as a currency string with monospace styling.
 * Negative values are wrapped in parentheses.
 * This version is used for results tables.
 * @param {number} num - The number to format as currency.
 * @returns {string} The formatted currency string wrapped in a span with class "number".
 */
function formatCurrency(num) {
  if (num < 0) {
    return '<span class="number" style="font-family: \'Courier New\', Consolas, monospace;">($' + rawFormatNum(Math.abs(num)) + ')</span>';
  }
  return '<span class="number" style="font-family: \'Courier New\', Consolas, monospace;">$' + rawFormatNum(num) + '</span>';
}

/**
 * Format a number as a currency string without any HTML wrapping.
 * This version is used for Plotly chart labels.
 * @param {number} num - The number to format as currency.
 * @returns {string} The formatted currency string.
 */
function rawFormatCurrency(num) {
  if (num < 0) {
    return "($" + rawFormatNum(Math.abs(num)) + ")";
  }
  return "$" + rawFormatNum(num);
}

/**
 * Collapse the calculation form by removing the "expanded" class,
 * adding the "collapsed" class, and updating the toggle handle text.
 */
function collapseForm() {
  const calcForm = document.getElementById('calcForm');
  calcForm.classList.remove('expanded');
  calcForm.classList.add('collapsed');
  document.getElementById('formToggleHandle').textContent = "⬇️ Show Form";
}

/**
 * Expand the calculation form by removing the "collapsed" class,
 * adding the "expanded" class, and updating the toggle handle text.
 */
function expandForm() {
  const calcForm = document.getElementById('calcForm');
  calcForm.classList.remove('collapsed');
  calcForm.classList.add('expanded');
  document.getElementById('formToggleHandle').textContent = "⬆️ Hide Form";
}

/**
 * Fade an element into view by setting its display to block and
 * transitioning its opacity from 0 to 1 over the specified duration.
 * @param {HTMLElement} element - The DOM element to fade in.
 * @param {number} duration - Duration of the fade in milliseconds (default is 1000ms).
 */
function fadeIn(element, duration) {
  duration = duration || 1000;
  element.style.opacity = 0;
  element.style.display = 'block';
  element.style.transition = 'opacity ' + duration + 'ms ease-in-out';
  // Allow a short delay for the browser to apply the initial style.
  setTimeout(() => {
    element.style.opacity = 1;
  }, 50);
}


/********************************************
 * 2. STEP VALIDATION
 ********************************************/

/**
 * Validate all required fields within a specific form step.
 * If an input is invalid, it is highlighted and its built-in
 * validity message is displayed.
 *
 * @param {number} stepIndex - The index of the form step to validate.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validateStep(stepIndex) {
  const currentStepEl = document.querySelector(`.formStep[data-step="${stepIndex}"]`);
  const inputs = currentStepEl.querySelectorAll('input, select');
  
  // Clear any previous error styling from all inputs.
  inputs.forEach(input => input.classList.remove('border-red-500'));

  // Validate each input field; on first failure, mark and report.
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (!input.checkValidity()) {
      input.classList.add('border-red-500');
      input.reportValidity();
      return false; // Stop checking further if one field is invalid.
    }
  }
  return true; // All inputs are valid.
}


/********************************************
 * 3. URL PARAMS MANAGEMENT
 ********************************************/

/**
 * Update the URL query parameters to reflect current form values.
 */
function updateUrlParams() {
  const params = new URLSearchParams();
  params.set('months', document.getElementById('months').value);
  params.set('targetSpend', document.getElementById('targetSpend').value);
  params.set('ramp', document.getElementById('ramp').value);
  params.set('growth', document.getElementById('growth').value);
  params.set('churn', document.getElementById('churn').value);
  params.set('targetRevenue', document.getElementById('targetRevenue').value);
  params.set('baseline', document.getElementById('baseline').value);
  params.set('pctAcq', document.getElementById('pctAcq').value);
  params.set('startMonth', document.getElementById('startMonth').value);
  params.set('startYear', document.getElementById('startYear').value);
  params.set('seasonal', document.getElementById('seasonalToggle').checked ? "true" : "false");
  params.set('mqlPerSql', document.getElementById('mqlPerSql').value);
  params.set('sqlPerWin', document.getElementById('sqlPerWin').value);
  history.pushState(null, '', '?' + params.toString());
}

/**
 * Finalize the form submission process by collapsing the form.
 */
function finalizeAndHide() {
  collapseForm();
}


/********************************************
 * 4. SHARE / TABLE TOGGLE FUNCTIONS & EVENTS
 ********************************************/

/**
 * Attempt to share the current page using the Web Share API.
 * If it fails, fall back to copying the URL to the clipboard.
 */
function sharePage() {
  const shareData = {
    title: 'Cloud Target Calculator',
    text: 'Check out these results for your Cloud Target plan!',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(err => {
      console.warn('Share API failed, fallback to copy link', err);
      copyLinkFallback();
    });
  } else {
    copyLinkFallback();
  }
}

/**
 * Fallback function to copy the current page URL to the clipboard.
 */
function copyLinkFallback() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      alert('Share link copied to clipboard!');
    })
    .catch(err => {
      console.error('Could not copy link: ', err);
    });
}

// Attach event listener for the share button.
document.getElementById('shareBtn').addEventListener('click', sharePage);

// Attach event listener for toggling detailed columns in the results table.
document.getElementById('toggleDetails').addEventListener('click', function() {
  const tableContainer = document.getElementById('resultsTable');
  if (tableContainer.classList.contains('show-details')) {
    tableContainer.classList.remove('show-details');
    this.textContent = 'Show Detailed Columns';
  } else {
    tableContainer.classList.add('show-details');
    this.textContent = 'Hide Detailed Columns';
  }
});


/********************************************
 * 5. FORM TOGGLE HANDLE (SHOW/HIDE)
 ********************************************/
document.getElementById('formToggleHandle').addEventListener('click', function() {
  const calcForm = document.getElementById('calcForm');
  if (calcForm.classList.contains('collapsed')) {
    expandForm();
  } else {
    collapseForm();
  }
});


/********************************************
 * 6. ON PAGE LOAD: LOAD URL QUERY PARAMETERS
 ********************************************/
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  let hasParams = false;

  // Initially hide the results and marketing funnel sections
  document.getElementById('resultsContainer').style.display = 'none';
  document.getElementById('funnelContainer').style.display = 'none';

  if (params.toString()) {
    hasParams = true;
    if (params.has('months'))         document.getElementById('months').value = params.get('months');
    if (params.has('targetSpend'))    document.getElementById('targetSpend').value = params.get('targetSpend');
    if (params.has('ramp'))           document.getElementById('ramp').value = params.get('ramp');
    if (params.has('growth'))         document.getElementById('growth').value = params.get('growth');
    if (params.has('churn'))          document.getElementById('churn').value = params.get('churn');
    if (params.has('targetRevenue'))  document.getElementById('targetRevenue').value = params.get('targetRevenue');
    if (params.has('baseline'))       document.getElementById('baseline').value = params.get('baseline');
    if (params.has('pctAcq'))         document.getElementById('pctAcq').value = params.get('pctAcq');
    if (params.has('startMonth'))     document.getElementById('startMonth').value = params.get('startMonth');
    if (params.has('startYear'))      document.getElementById('startYear').value = params.get('startYear');
    if (params.has('seasonal'))       document.getElementById('seasonalToggle').checked = (params.get('seasonal') === "true");
    if (params.has('mqlPerSql'))      document.getElementById('mqlPerSql').value = params.get('mqlPerSql');
    if (params.has('sqlPerWin'))      document.getElementById('sqlPerWin').value = params.get('sqlPerWin');

    // Auto-run the calculation by submitting the form.
    document.getElementById('calcForm').dispatchEvent(new Event('submit'));
  }

  // If URL parameters are present, collapse the form; otherwise, expand it.
  if (hasParams) {
    collapseForm();
  } else {
    expandForm();
  }
});


/********************************************
 * 7. MAIN CALCULATION + FORM SUBMISSION
 ********************************************/
document.getElementById('calcForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // -----------------------------------------------------
  // 7a. VALIDATE ALL FORM STEPS BEFORE PROCEEDING
  // -----------------------------------------------------
  for (let i = 0; i < steps.length; i++) {
    if (!validateStep(i)) {
      showStep(i);
      return; // Stop processing if any step is invalid.
    }
  }

  // -----------------------------------------------------
  // 7b. INITIALIZE INPUT VALUES AND PARAMETERS
  // -----------------------------------------------------
  const n = parseInt(document.getElementById('months').value, 10);
  const s = parseFloat(document.getElementById('targetSpend').value);
  const r = parseInt(document.getElementById('ramp').value, 10);
  const g = parseFloat(document.getElementById('growth').value) / 100;
  const c = parseFloat(document.getElementById('churn').value) / 100;
  const T = parseFloat(document.getElementById('targetRevenue').value);
  const B = parseFloat(document.getElementById('baseline').value);
  const P = parseFloat(document.getElementById('pctAcq').value) / 100;
  const M = 300;

  const startMonth = parseInt(document.getElementById('startMonth').value, 10);
  const startYear = parseInt(document.getElementById('startYear').value, 10);
  const seasonalEnabled = document.getElementById('seasonalToggle').checked;

  const mqlPerSql = parseFloat(document.getElementById('mqlPerSql').value);
  const sqlPerWin = parseFloat(document.getElementById('sqlPerWin').value);

  // Define days in each month; adjust for leap years.
  const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
  if (((startYear % 4) === 0 && (startYear % 100) !== 0) || (startYear % 400) === 0) {
    daysInMonth[1] = 29;
  }
  const baselineDays = 30;
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // -----------------------------------------------------
  // 7c. CALCULATE BASELINE REVENUE & MONTHLY FACTORS
  // -----------------------------------------------------
  let baselineTotal = 0;
  let monthFactors = [];
  for (let i = 0; i < n; i++) {
    const idx = (startMonth + i) % 12;
    let factor = 1;
    if (seasonalEnabled) {
      factor = daysInMonth[idx] / baselineDays;
    }
    monthFactors.push(factor);

    // Calculate baseline revenue for the month.
    const baseRev = B * Math.pow((1 + g), i) * Math.pow((1 - c), i) * factor;
    baselineTotal += baseRev;
  }

  // -----------------------------------------------------
  // 7d. CALCULATE ADDITIONAL REVENUE TARGETS
  // -----------------------------------------------------
  const addlTarget = T - baselineTotal;
  let newRevenueTarget = Math.max(0, addlTarget * P);
  let proactiveTarget = Math.max(0, addlTarget * (1 - P));

  // -----------------------------------------------------
  // 7e. EFFECTIVE REVENUE FUNCTION FOR NEW CUSTOMERS
  // -----------------------------------------------------
  function effectiveRevenue(age) {
    let base;
    if (age <= r) {
      // Ramp-up period: revenue increases gradually.
      base = s * (age / r);
    } else {
      // Post-ramp: revenue grows organically.
      base = s * Math.pow((1 + g), age - r);
    }
    // Adjust for churn.
    return base * Math.pow((1 - c), age - 1);
  }

  // -----------------------------------------------------
  // 7f. CALCULATE TOTAL CONTRIBUTION PER NEW CUSTOMER
  // -----------------------------------------------------
  let totalContr = 0;
  for (let m = 0; m < n; m++) {
    const factor = monthFactors[m];
    let ages = (n - m);
    for (let age = 1; age <= ages; age++) {
      totalContr += effectiveRevenue(age) * factor;
    }
  }

  // -----------------------------------------------------
  // 7g. DISTRIBUTE NEW CUSTOMERS MONTHLY
  // -----------------------------------------------------
  let baseNewCust = 0;
  if (totalContr > 0 && newRevenueTarget > 0) {
    baseNewCust = newRevenueTarget / totalContr;
  }
  let monthlyCustomers = new Array(n).fill(0);
  for (let m = 0; m < n; m++){
    monthlyCustomers[m] = baseNewCust * monthFactors[m];
  }

  // -----------------------------------------------------
  // 7h. BUILD MONTHLY REVENUE & CUSTOMER TABLE
  // -----------------------------------------------------
  function buildMonthlyTable() {
    let localCumulativeRevenue = 0;
    let localTableRows = "";
    let cumulativeNewCustRevenue = 0;
    let runningTotalCustomers = 0;

    // Loop over each month to calculate and compile detailed metrics.
    for (let m = 0; m < n; m++) {
      const newCustCount = monthlyCustomers[m];
      runningTotalCustomers += newCustCount;

      // NEW CUSTOMER METRICS
      let newCustMonthRevenue = 0;
      let newCustMonthIncrementalGrowth = 0;
      let newCustMonthChurnImpact = 0;

      for (let age = 1; age <= (m + 1); age++) {
        const effRev = effectiveRevenue(age);
        // "No growth" scenario for baseline comparison.
        const noGrowth = (age <= r) ? s * (age / r) : s;
        const effNoGrowth = noGrowth * Math.pow((1 - c), age - 1);
        const incRev = effRev - effNoGrowth;
        const churnLoss = noGrowth - effRev;

        newCustMonthRevenue += (newCustCount * effRev);
        newCustMonthIncrementalGrowth += (newCustCount * incRev);
        newCustMonthChurnImpact += (newCustCount * churnLoss);
      }

      // Adjust calculations based on seasonal factors.
      newCustMonthRevenue *= monthFactors[m];
      newCustMonthIncrementalGrowth *= monthFactors[m];
      newCustMonthChurnImpact *= monthFactors[m];
      cumulativeNewCustRevenue += newCustMonthRevenue;

      // BASELINE METRICS
      const baselineMonthRevenue = B
        * Math.pow((1 + g), m)
        * Math.pow((1 - c), m)
        * monthFactors[m];

      const baselineMonthNoGrowth = B * Math.pow((1 - c), m) * monthFactors[m];
      const baselineMonthIncrementalGrowth = baselineMonthRevenue - baselineMonthNoGrowth;
      const baselineMonthChurnImpact = (
        (B * Math.pow((1 + g), m)) -
        (B * Math.pow((1 + g), m) * Math.pow((1 - c), m))
      ) * monthFactors[m];

      const monthlyTotal = newCustMonthRevenue + baselineMonthRevenue;
      localCumulativeRevenue += monthlyTotal;

      // Construct the HTML row for the current month.
      const idx = (startMonth + m) % 12;
      const yOff = Math.floor((startMonth + m) / 12);
      const moName = monthNames[idx] + " " + (startYear + yOff);

      localTableRows += `
        <tr>
          <td style="text-align:left;">${moName}</td>
          <td>${formatNum(newCustCount)}</td>
          <td>${formatNum(runningTotalCustomers)}</td>

          <!-- Revenue columns -->
          <td class="detailRevenue">${formatCurrency(newCustMonthRevenue)}</td>
          <td class="detailRevenue">${formatCurrency(baselineMonthRevenue)}</td>
          <td>${formatCurrency(monthlyTotal)}</td>

          <!-- Growth columns -->
          <td class="detailGrowth">${formatCurrency(newCustMonthIncrementalGrowth)}</td>
          <td class="detailGrowth">${formatCurrency(baselineMonthIncrementalGrowth)}</td>
          <td class="detailGrowth">${formatCurrency(newCustMonthIncrementalGrowth + baselineMonthIncrementalGrowth)}</td>

          <!-- Churn columns -->
          <td class="detailChurn">${formatCurrency(-newCustMonthChurnImpact)}</td>
          <td class="detailChurn">${formatCurrency(-baselineMonthChurnImpact)}</td>
          <td class="detailChurn">${formatCurrency(-(newCustMonthChurnImpact + baselineMonthChurnImpact))}</td>

          <td>${formatCurrency(localCumulativeRevenue)}</td>
        </tr>
      `;
    }

    return {
      tableHTML: localTableRows,
      newCustRev: cumulativeNewCustRevenue,
      totalCustomers: monthlyCustomers.reduce((acc, x) => acc + x, 0),
      finalCumulativeRevenue: localCumulativeRevenue
    };
  }

  // First calculation pass to build the table.
  let pass1 = buildMonthlyTable();
  let computedNewCustRev = pass1.newCustRev;

  // -----------------------------------------------------
  // 7i. SCALE NEW CUSTOMER NUMBERS IF NEEDED
  // -----------------------------------------------------
  if (computedNewCustRev > 0) {
    let ratio = newRevenueTarget / computedNewCustRev;
    if (ratio > 0 && ratio !== 1) {
      for (let i = 0; i < n; i++) {
        monthlyCustomers[i] *= ratio;
      }
    }
  }

  // Second calculation pass after scaling adjustments.
  let pass2 = buildMonthlyTable();
  let finalNewCustRev = pass2.newCustRev;
  let totalCustomers = pass2.totalCustomers;

  // -----------------------------------------------------
  // 7j. CALCULATE PROACTIVE GROWTH REVENUE
  // -----------------------------------------------------
  let finalProactiveRev = (T - baselineTotal) - finalNewCustRev;
  if (finalProactiveRev < 0) {
    finalProactiveRev = 0;
  }

  // -----------------------------------------------------
  // 7k. BUILD FINAL SUMMARY TABLE AND RESULTS HTML
  // -----------------------------------------------------
  const resultsHTML = `
    <div id="balanceSummary">
      <table class="accounting-table">
        <tr>
          <td>Existing Business Revenue</td>
          <td class="number">${formatCurrency(baselineTotal)}</td>
        </tr>
        <tr>
          <td>New Customer Revenue</td>
          <td class="number">${formatCurrency(finalNewCustRev)}</td>
        </tr>
        <tr>
          <td>Proactive Growth Revenue</td>
          <td class="number">${formatCurrency(finalProactiveRev)}</td>
        </tr>
        <tr class="total-row">
          <td>Total Revenue Target</td>
          <td class="number">${formatCurrency(T)}</td>
        </tr>
      </table>
    </div>
    <p>
      The baseline revenue over the ${n}-month period is ${formatCurrency(baselineTotal)}.
      This plan yields ${formatCurrency(finalNewCustRev)} from
      ${formatNum(totalCustomers)} new customers
      and ${formatCurrency(finalProactiveRev)} from growing existing customers.
    </p>
    <br />
    <h2 class="text-xl font-semibold mb-2">Baseline + Customer Adds Breakdown</h2>
    <div class="table-responsive">
      <table class="table-business w-full">
        <thead>
          <tr>
            <th>Month</th>
            <th>New Cust. Added</th>
            <th>Running Total New Cust.</th>
            <th class="detailRevenue">New Cust. Revenue</th>
            <th class="detailRevenue">Baseline Revenue</th>
            <th>Total Monthly Revenue</th>
            <th class="detailGrowth">New Cust. Organic Growth</th>
            <th class="detailGrowth">Baseline Organic Growth</th>
            <th class="detailGrowth">Total Organic Growth</th>
            <th class="detailChurn">New Cust. Churn</th>
            <th class="detailChurn">Baseline Churn</th>
            <th class="detailChurn">Total Churn</th>
            <th>Cumulative Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${pass2.tableHTML}
        </tbody>
      </table>
      <br />
    </div>
  `;
  document.getElementById('resultsTable').innerHTML = resultsHTML;

  // -----------------------------------------------------
  // 7l. BUILD PROACTIVE GROWTH BREAKDOWN TABLE
  // -----------------------------------------------------
  const monthFactorsSum = monthFactors.reduce((acc, f, i) => acc + f * (i + 1), 0);
  let proactiveRows = "";
  if (finalProactiveRev > 0 && monthFactorsSum > 0) {
    const base = finalProactiveRev / monthFactorsSum;
    let cumul = 0;
    for (let i = 0; i < n; i++){
      const idx = (startMonth + i) % 12;
      const yOff = Math.floor((startMonth + i) / 12);
      const moName = monthNames[idx] + " " + (startYear + yOff);
      const monthly = monthFactors[i] * (i + 1) * base;
      cumul += monthly;
      proactiveRows += `
        <tr>
          <td style="text-align:left;">${moName}</td>
          <td>${formatCurrency(monthly)}</td>
          <td>${formatCurrency(cumul)}</td>
        </tr>
      `;
    }
  } else {
    // If no proactive revenue, show zeros for each month.
    for (let i = 0; i < n; i++){
      const idx = (startMonth + i) % 12;
      const yOff = Math.floor((startMonth + i) / 12);
      const moName = monthNames[idx] + " " + (startYear + yOff);
      proactiveRows += `
        <tr>
          <td style="text-align:left;">${moName}</td>
          <td>${formatCurrency(0)}</td>
          <td>${formatCurrency(0)}</td>
        </tr>
      `;
    }
  }

  const proactiveHTML = `
    <h3 class="text-xl font-semibold mb-2">Proactive Growth Target Breakdown</h3>
    <p>
      This table breaks down the proactive growth target across months.
    </p>
    <div class="table-responsive">
      <table class="table-business">
        <thead>
          <tr>
            <th>Month</th>
            <th>Monthly Proactive Growth Target</th>
            <th>Cumulative Proactive Growth Target</th>
          </tr>
        </thead>
        <tbody>
          ${proactiveRows}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('resultsTable').innerHTML += proactiveHTML;
  const totalCust = monthlyCustomers.reduce((acc, x) => acc + x, 0);
  const wins = totalCust;
  const sqls = wins * sqlPerWin;
  const mqls = sqls * mqlPerSql;
  const marketingHTML = `
<p class="mb-4">
      This is the breakdown of marketing qualified leads, to sales qualified leads, to wins based on a ratio of ${mqlPerSql}:${sqlPerWin}:1. You should
      ensure that you have a sufficient amount of activity planned to fill your funnel with enough leads for your sales team to progress. Based on an 
      average lead acquisition cost of ${formatCurrency(M)}, you should consider allocating at least ${formatCurrency(M * mqls)} to your marketing budget.<br />
      <br />
      💡 <strong>Did you know:</strong> the sales cycle for a cloud opportunity can last anywhere between 3 and 9 months? Plan your activity schedule to take this into account.
    </p>
  `;
  document.getElementById('marketingInsights').innerHTML += marketingHTML;

  // -----------------------------------------------------
  // 7m. UPDATE URL PARAMETERS AFTER CALCULATION
  // -----------------------------------------------------
  updateUrlParams();

  // -----------------------------------------------------
  // 7n. PLOTLY CHARTS: WATERFALL & FUNNEL CHARTS
  // -----------------------------------------------------
  // Revenue Waterfall Chart Setup (using raw formatting functions)
  const finalTotal = baselineTotal + finalNewCustRev + finalProactiveRev;
  const waterfallData = [{
    type: 'waterfall',
    orientation: 'v',
    measure: ['absolute','relative','relative','total'],
    x: [
      ["Baseline","Acquisition","Proactive","Total"], 
      ["Baseline","New Cust.","Growth","Final"]
    ],
    y: [
      baselineTotal,
      finalNewCustRev,
      finalProactiveRev,
      finalTotal
    ],
    text: [
      rawFormatCurrency(baselineTotal),
      rawFormatCurrency(finalNewCustRev),
      rawFormatCurrency(finalProactiveRev),
      rawFormatCurrency(finalTotal)
    ],
    textposition: 'outside',
    cliponaxis: false,
    connector: { line: { color: 'rgb(63,63,63)' } }
  }];
  const layout = {
    title: 'Revenue Waterfall Chart',
    waterfallgap: 0.3,
    yaxis: { title: 'Revenue' },
    autosize: true
  };
  Plotly.newPlot('waterfallChart', waterfallData, layout);

  // Marketing Funnel Chart Setup (using raw numeric values)
  
  const funnelData = [{
    type: 'funnel',
    y: ['MQLs','SQLs','Wins'],
    x: [mqls, sqls, wins],
    textinfo: 'value+percent initial'
  }];
  const funnelLayout = {
    title: 'Marketing Funnel',
    margin: { l: 150 },
    autosize: true
  };
  Plotly.newPlot('funnelChart', funnelData, funnelLayout);

  // -----------------------------------------------------
  // 7o. FINALIZE THE CALCULATION PROCESS
  // -----------------------------------------------------
  finalizeAndHide();

  // Fade in the results and marketing sections now that calculation is complete.
  fadeIn(document.getElementById('resultsContainer'));
  fadeIn(document.getElementById('funnelContainer'));
  
  // Wait a short moment for the fade-in to complete, then force Plotly to recalculate the width.
  setTimeout(() => {
    Plotly.Plots.resize(document.getElementById('waterfallChart'));
    Plotly.Plots.resize(document.getElementById('funnelChart'));
  }, 500); // Adjust delay as needed (500ms is a good starting point)
});


/********************************************
 * 8. MULTI-STEP NAVIGATION
 *
 * This section manages the multi-step form navigation,
 * including functions to show/hide steps, update navigation
 * button styling, and handle previous/next step events.
 ********************************************/

// Retrieve all form steps and initialize the current step index.
const steps = Array.from(document.querySelectorAll('.formStep'));
let currentStep = 0;

/**
 * Hide all form steps by adding a 'hidden' class.
 */
function hideAllSteps() {
  steps.forEach(el => el.classList.add('hidden'));
}

/**
 * Show the form step at the given index.
 * @param {number} index - The index of the step to display.
 */
function showStep(index) {
  if (index < 0) index = 0;
  if (index >= steps.length) index = steps.length - 1;
  hideAllSteps();
  steps[index].classList.remove('hidden');
  currentStep = index;
  updateNavStyling(index);
}

/**
 * Update the styling of navigation buttons to indicate the active step.
 * @param {number} stepIndex - The index of the current active step.
 */
function updateNavStyling(stepIndex) {
  const navButtons = document.querySelectorAll('.stepNavBtn');
  navButtons.forEach(btn => {
    btn.classList.remove('bg-blue-600','text-white');
    btn.classList.add('bg-gray-200','text-gray-700');
  });
  // Highlight the active navigation button.
  const activeBtn = document.querySelector(`.stepNavBtn[data-step="${stepIndex}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-gray-200','text-gray-700');
    activeBtn.classList.add('bg-blue-600','text-white');
  }
}

// Initially show step 0.
showStep(0);

// Event listeners for navigation buttons.
// Direct step navigation.
document.querySelectorAll('.stepNavBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetStep = parseInt(btn.dataset.step, 10);
    if (validateStep(currentStep)) {
      showStep(targetStep);
    }
  });
});

// Next step button.
document.querySelectorAll('.nextStepBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      showStep(currentStep + 1);
    }
  });
});

// Previous step button.
document.querySelectorAll('.prevStepBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    showStep(currentStep - 1);
  });
});