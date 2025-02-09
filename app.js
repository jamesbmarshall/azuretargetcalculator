    function formatNum(num) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    function formatCurrency(num) {
      if (num < 0) {
        return "($" + formatNum(Math.abs(num)) + ")";
      }
      return "$" + formatNum(num);
    }

    function collapseForm() {
      const calcForm = document.getElementById('calcForm');
      calcForm.classList.remove('expanded');
      calcForm.classList.add('collapsed');
      document.getElementById('formToggleHandle').textContent = "⬇️ Show Form";
    }
    function expandForm() {
      const calcForm = document.getElementById('calcForm');
      calcForm.classList.remove('collapsed');
      calcForm.classList.add('expanded');
      document.getElementById('formToggleHandle').textContent = "⬆️ Hide Form";
    }
    function hideAdvanced() {
      document.getElementById('advancedOptions').style.display = 'none';
      document.getElementById('advancedToggle').textContent = 'Advanced Options';
    }
    function showAdvanced() {
      document.getElementById('advancedOptions').style.display = 'block';
      document.getElementById('advancedToggle').textContent = 'Hide Advanced Options';
    }

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

    function finalizeAndHide() {
      collapseForm();
      hideAdvanced();
    }

    function sharePage() {
      const shareData = {
        title: 'Cloud Target Calculator',
        text: 'Check out these results for your Cloud Target plan!',
        url: window.location.href
      };
    
      if (navigator.share) {
        // Use Web Share API on supported mobile browsers
        navigator.share(shareData).catch(err => {
          console.warn('Share API failed, fallback to copy link', err);
          copyLinkFallback();
        });
      } else {
        // Fallback for desktop or unsupported browsers
        copyLinkFallback();
      }
    }
    
    function copyLinkFallback() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Share link copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy link: ', err);
      });
    }
    
    document.getElementById('shareBtn').addEventListener('click', sharePage);

    document.getElementById('advancedToggle').addEventListener('click', function() {
      const adv = document.getElementById('advancedOptions');
      if (adv.style.display === 'none' || adv.style.display === '') {
        showAdvanced();
      } else {
        hideAdvanced();
      }
    });

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

    document.getElementById('formToggleHandle').addEventListener('click', function() {
      const calcForm = document.getElementById('calcForm');
      if (calcForm.classList.contains('collapsed')) {
        expandForm();
      } else {
        collapseForm();
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      let hasParams = false;
      if (params.toString()) {
        hasParams = true;
        if (params.has('months')) document.getElementById('months').value = params.get('months');
        if (params.has('targetSpend')) document.getElementById('targetSpend').value = params.get('targetSpend');
        if (params.has('ramp')) document.getElementById('ramp').value = params.get('ramp');
        if (params.has('growth')) document.getElementById('growth').value = params.get('growth');
        if (params.has('churn')) document.getElementById('churn').value = params.get('churn');
        if (params.has('targetRevenue')) document.getElementById('targetRevenue').value = params.get('targetRevenue');
        if (params.has('baseline')) document.getElementById('baseline').value = params.get('baseline');
        if (params.has('pctAcq')) document.getElementById('pctAcq').value = params.get('pctAcq');
        if (params.has('startMonth')) document.getElementById('startMonth').value = params.get('startMonth');
        if (params.has('startYear')) document.getElementById('startYear').value = params.get('startYear');
        if (params.has('seasonal')) document.getElementById('seasonalToggle').checked = (params.get('seasonal') === "true");
        if (params.has('mqlPerSql')) document.getElementById('mqlPerSql').value = params.get('mqlPerSql');
        if (params.has('sqlPerWin')) document.getElementById('sqlPerWin').value = params.get('sqlPerWin');

        if (params.has('mqlPerSql') || params.has('sqlPerWin')) {
          showAdvanced();
        }
        // auto-run
        document.getElementById('calcForm').dispatchEvent(new Event('submit'));
      }
      if (hasParams) {
        collapseForm();
      } else {
        expandForm();
      }
    });

    // The main logic
    document.getElementById('calcForm').addEventListener('submit', function(event) {
      event.preventDefault();

      // 1) Grab user inputs
      const n = parseInt(document.getElementById('months').value, 10);
      const s = parseFloat(document.getElementById('targetSpend').value);
      const r = parseInt(document.getElementById('ramp').value, 10);
      const g = parseFloat(document.getElementById('growth').value)/100;
      const c = parseFloat(document.getElementById('churn').value)/100;
      const T = parseFloat(document.getElementById('targetRevenue').value);
      const B = parseFloat(document.getElementById('baseline').value);
      const P = parseFloat(document.getElementById('pctAcq').value)/100;

      const startMonth = parseInt(document.getElementById('startMonth').value, 10);
      const startYear = parseInt(document.getElementById('startYear').value, 10);
      const seasonalEnabled = document.getElementById('seasonalToggle').checked;

      const mqlPerSql = parseFloat(document.getElementById('mqlPerSql').value);
      const sqlPerWin = parseFloat(document.getElementById('sqlPerWin').value);

      // For months
      const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
      // leap check
      if (((startYear % 4)===0 && (startYear%100)!==0)||(startYear%400)===0) {
        daysInMonth[1]=29;
      }
      const baselineDays = 30;
      const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

      // 2) baseline total
      let baselineTotal = 0;
      let monthFactors = [];
      for (let i=0; i<n; i++){
        const idx = (startMonth + i)%12;
        let factor = 1;
        if (seasonalEnabled) {
          factor = daysInMonth[idx]/ baselineDays;
        }
        monthFactors.push(factor);

        const baseRev = B* Math.pow(1+ g, i)* Math.pow(1- c, i)* factor;
        baselineTotal += baseRev;
      }

      // 3) new vs proactive
      const addlTarget = T- baselineTotal;
      let newRevenueTarget = Math.max(0, addlTarget* P);
      let proactiveTarget = Math.max(0, addlTarget*(1-P));

      // effectiveRevenue
      function effectiveRevenue(age) {
        let base = (age<=r)? s*(age/r) : s* Math.pow(1+g, age-r);
        return base* Math.pow(1- c, age-1);
      }

      // total contribution
      let totalContr=0;
      for (let m=0; m<n; m++){
        const factor= monthFactors[m];
        let ages= (n- m);
        for (let age=1; age<= ages; age++){
          totalContr += effectiveRevenue(age)* factor;
        }
      }
      let baseNewCust = 0;
      if (totalContr>0 && newRevenueTarget>0) {
        baseNewCust = newRevenueTarget/ totalContr;
      }
      let monthlyCustomers= new Array(n).fill(0);
      for (let m=0; m<n; m++){
        monthlyCustomers[m]= baseNewCust* monthFactors[m];
      }

      // We'll build table in two passes
      function buildMonthlyTable() {
        let localCumulativeRevenue=0;
        let localTableRows="";
        let cumulativeNewCustRevenue=0;
        let runningTotalCustomers=0;

        // We'll also track the monthly details (growth, churn)
        let cumulativeNewCustNoGrowth=0;
        let cumulativeNewCustIncrementalGrowth=0;
        let cumulativeNewCustChurnImpact=0;

        let cumulativeBaselineIncrementalGrowth=0;
        let cumulativeBaselineChurnImpact=0;

        for (let m=0; m<n; m++){
          const newCustCount= monthlyCustomers[m];
          runningTotalCustomers += newCustCount;

          let newCustMonthRevenue= 0;
          let newCustMonthNoGrowth= 0;
          let newCustMonthIncrementalGrowth= 0;
          let newCustMonthChurnImpact= 0;

          for (let age=1; age<=(m+1); age++){
            const effRev= effectiveRevenue(age);
            // For growth calculations
            const noGrowth= (age<=r)? s*(age/r) : s;
            const effNoGrowth= noGrowth* Math.pow(1- c, age-1);
            const incRev= effRev- effNoGrowth;
            const churnLoss= noGrowth- effRev;

            newCustMonthRevenue += (newCustCount* effRev);
            newCustMonthNoGrowth += (newCustCount* effNoGrowth);
            newCustMonthIncrementalGrowth += (newCustCount* incRev);
            newCustMonthChurnImpact += (newCustCount* churnLoss);
          }
          // multiply by factor
          newCustMonthRevenue *= monthFactors[m];
          newCustMonthNoGrowth *= monthFactors[m];
          newCustMonthIncrementalGrowth *= monthFactors[m];
          newCustMonthChurnImpact *= monthFactors[m];

          cumulativeNewCustRevenue += newCustMonthRevenue;
          cumulativeNewCustNoGrowth += newCustMonthNoGrowth;
          cumulativeNewCustIncrementalGrowth += newCustMonthIncrementalGrowth;
          cumulativeNewCustChurnImpact += newCustMonthChurnImpact;

          // baseline
          const baselineMonthRevenue= B* Math.pow(1+ g, m)* Math.pow(1- c, m)* monthFactors[m];

          const baselineMonthNoGrowth= B* Math.pow(1- c, m)* monthFactors[m];
          const baselineMonthIncrementalGrowth= baselineMonthRevenue- baselineMonthNoGrowth;
          const baselineMonthChurnImpact= (B* Math.pow(1+ g, m)- (B* Math.pow(1+ g, m)* Math.pow(1- c, m)))* monthFactors[m];

          cumulativeBaselineIncrementalGrowth += baselineMonthIncrementalGrowth;
          cumulativeBaselineChurnImpact += baselineMonthChurnImpact;

          const monthlyTotal= newCustMonthRevenue+ baselineMonthRevenue;
          localCumulativeRevenue += monthlyTotal;

          const idx= (startMonth+ m)%12;
          const yOff= Math.floor((startMonth+ m)/12);
          const moName= monthNames[idx]+ " "+ (startYear+ yOff);

          localTableRows += `
            <tr>
              <td style="text-align:left;">${moName}</td>
              <td>${formatNum(newCustCount)}</td>
              <td>${formatNum(runningTotalCustomers)}</td>
              <td class="detailRevenue">${formatCurrency(newCustMonthRevenue)}</td>
              <td class="detailRevenue">${formatCurrency(baselineMonthRevenue)}</td>
              <td>${formatCurrency(monthlyTotal)}</td>

              <!-- Growth columns -->
              <td class="detailGrowth">${formatCurrency(newCustMonthIncrementalGrowth)}</td>
              <td class="detailGrowth">${formatCurrency(baselineMonthIncrementalGrowth)}</td>
              <td>${formatCurrency(newCustMonthIncrementalGrowth+ baselineMonthIncrementalGrowth)}</td>

              <!-- Churn columns -->
              <td class="detailChurn">${formatCurrency(- newCustMonthChurnImpact)}</td>
              <td class="detailChurn">${formatCurrency(- baselineMonthChurnImpact)}</td>
              <td>${formatCurrency(-(newCustMonthChurnImpact+ baselineMonthChurnImpact))}</td>

              <td>${formatCurrency(localCumulativeRevenue)}</td>
            </tr>
          `;
        }

        return {
          tableHTML: localTableRows,
          newCustRev: cumulativeNewCustRevenue,
          totalCustomers: monthlyCustomers.reduce((acc,x)=> acc+ x, 0),
          finalCumulativeRevenue: localCumulativeRevenue
        };
      }

      // pass1
      let pass1= buildMonthlyTable();
      let computedNewCustRev= pass1.newCustRev;

      // rescale if needed
      if (computedNewCustRev>0) {
        let ratio= newRevenueTarget/ computedNewCustRev;
        if (ratio>0 && ratio!==1) {
          for (let i=0; i<n; i++){
            monthlyCustomers[i]*= ratio;
          }
        }
      }

      // pass2 final
      let pass2= buildMonthlyTable();
      let finalNewCustRev= pass2.newCustRev;
      let totalCustomers= pass2.totalCustomers;

      let finalProactiveRev= (T- baselineTotal)- finalNewCustRev;
      if (finalProactiveRev<0) {
        finalProactiveRev=0;
      }

      // Build final summary
      const resultsHTML= `
        <h2 class="text-2xl font-semibold mb-3">Results</h2>
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
        <th>Total Organic Growth</th>

        <th class="detailChurn">New Cust. Churn</th>
        <th class="detailChurn">Baseline Churn</th>
        <th>Total Churn</th>

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

      // Proactive table
      const monthFactorsSum= monthFactors.reduce((acc,f,i)=> acc+ f*(i+1), 0);
      let proactiveRows= "";
      if (finalProactiveRev>0 && monthFactorsSum>0) {
        const base= finalProactiveRev/ monthFactorsSum;
        let cumul=0;
        for (let i=0; i<n; i++){
          const idx= (startMonth+ i)%12;
          const yOff= Math.floor((startMonth+ i)/12);
          const moName= monthNames[idx]+ " "+ (startYear+ yOff);

          const monthly= monthFactors[i]*(i+1)* base;
          cumul+= monthly;
          proactiveRows+= `
            <tr>
              <td style="text-align:left;">${moName}</td>
              <td>${formatCurrency(monthly)}</td>
              <td>${formatCurrency(cumul)}</td>
            </tr>
          `;
        }
      } else {
        // zero
        for (let i=0; i<n; i++){
          const idx= (startMonth+ i)%12;
          const yOff= Math.floor((startMonth+ i)/12);
          const moName= monthNames[idx]+ " "+ (startYear+ yOff);
          proactiveRows+= `
            <tr>
              <td style="text-align:left;">${moName}</td>
              <td>${formatCurrency(0)}</td>
              <td>${formatCurrency(0)}</td>
            </tr>
          `;
        }
      }
      const proactiveHTML= `
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

      // Update URL
      updateUrlParams();

      // Waterfall
      const finalTotal= baselineTotal+ finalNewCustRev+ finalProactiveRev;
      const waterfallData= [{
        type:'waterfall',
        orientation:'v',
        measure:['absolute','relative','relative','total'],
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
          formatCurrency(baselineTotal),
          formatCurrency(finalNewCustRev),
          formatCurrency(finalProactiveRev),
          formatCurrency(finalTotal)
        ],
        textposition:'outside',
        cliponaxis:false,
        connector:{ line:{ color:'rgb(63,63,63)' } }
      }];
      const layout= {
        title:'Revenue Waterfall Chart',
        waterfallgap:0.3,
        yaxis:{ title:'Revenue'},
        autosize:true
      };
      Plotly.newPlot('waterfallChart', waterfallData, layout);

      // Marketing Funnel
      const totalCust= monthlyCustomers.reduce((acc, x)=> acc+ x, 0);
      const wins= formatNum(totalCust);
      const sqls= wins* sqlPerWin;
      const mqls= sqls* mqlPerSql;

      const funnelData= [{
        type:'funnel',
        y:['MQLs','SQLs','Wins'],
        x:[mqls, sqls, wins],
        textinfo:'value+percent initial'
      }];
      const funnelLayout= {
        title:'Marketing Funnel',
        margin:{ l:150 },
        autosize:true
      };
      Plotly.newPlot('funnelChart', funnelData, funnelLayout);

      // finalize
      finalizeAndHide();
    });