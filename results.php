<?php $pageTitle = "Cloud Target Calculator | Results" ?>
<?php

#Define some variables to represent the different user-specified values
$targetRevenue = $_GET["revenue"];                                  #The revenue target either recurring or total.
$planLength = $_GET["months"];                                      #The number of months to calculate a plan for.
$targetSpend = $_GET["acpc"];                                       #The approximate minimum spend per customer, per month.
$newBusinessShare = $_GET["newbus"] / 100;                          #The percentage of the target achieved through net new business (i.e. customer adds).
$baselineRecurring = $_GET["mrrbaseline"];                          #The monthly recurring revenue baseline from plan month -1.
$typicalMoM = 0;                                #The month-over-month percentage growth in the existing baseline (the organic growth).
$MQLconversion = $_GET["MQLs"];                                     #The number of MQLs per SQL.
$SQLconversion = $_GET["SQLs"];                                     #The number of SQLs per win.
$newBusinessTarget = 0;                                             #The calculated new business target.
$growthBusinessTarget = 0;
$baselineGrowth = 0;                                                #The total of the recurring baseline + the growth in that baseline.
$newBusinessSumOfDigits = 0;                                        #The new business target / the rule of 78s method.
$growthBusinessSumOfDigits = 0;
$planArray = array();                                               #Array to hold all the plan values.

/*MARKETING METRIC CALCS */
$MQLs = 0;
$SQLs = 0;
$Wins = 0;

#Calculate the marketing funnel metrics based on any values supplied on the form.
function calcMarketingMetrics($customers) {
    global $SQLs;
    global $MQLs;
    global $Wins;
    global $MQLconversion;
    global $SQLconversion;

    $Wins = round($customers,0,PHP_ROUND_HALF_UP);
    $SQLs = $Wins * $SQLconversion;
    $MQLs = $SQLs * $MQLconversion;
}

#Calculate the Rule of 78 factor, based on Faulhaber's formula. 
function calcMultiplier($months) {
    $i = ($months ** 2 + $months)/2;
    return $i;
}

$sumOfDigits = calcMultiplier($planLength);                         #The number of divisions according to the Rule of 78s method. 78 for 12 months, 300 for 24, etc.
$newBusinessTarget = ($targetRevenue - ($baselineRecurring * $planLength)) * $newBusinessShare;
$newBusinessSumOfDigits = round($newBusinessTarget / $sumOfDigits,2,PHP_ROUND_HALF_UP);
$newBusGrowthRunning = 0;
$growthBusinessTarget = $targetRevenue - $newBusinessTarget - ($baselineRecurring * $planLength);
$growthBusinessSumOfDigits = $growthBusinessTarget / $sumOfDigits;
$baselineTotal = 0;
$newBusinessTotal = 0;
$proactiveGrowthTotal =0;

#Over the next few lines we're going to populate an array with all the calculated values for the plan.
#Array index 0 = month.
#Array index 1 = baseline recurring revenue.
#Array index 2 = baseline recurring revenue + the growth in that baseline.
#Array index 3 = growth in the baseline.
#Array index 4 = new business target.
#Array index 5 = running total of new business.
#Array index 6 = growth in the new business.
#Array index 7 = growth in the existing base.
#Array index 8 = number of customers required per month.
#Array index 9 = running total of customers.
#Array index 10 = total revenue per month.
#Array index 11 = running total of revenue.


for ($x = 0; $x < $planLength; $x++){
    #Set the baseline for the plan length. This is simply the same amount per month for the number of months given in $planLength.
    $planArray[$x][0][0] = $x + 1;
    $planArray[$x][0][1] = $baselineRecurring;

    #Calculate new business target.
    $planArray[$x][0][4] = ($x + 1) * $newBusinessSumOfDigits;
    
    #Calculate new business running total.
    if ($x == 0) {
        #First month..
        $planArray[$x][0][5] = $planArray[$x][0][4];
    } else {
        #All other months.
        $planArray[$x][0][5] = $planArray[$x][0][4] + $planArray[$x - 1][0][5];
    }

    $planArray[$x][0][7] = round(($x + 1) * $growthBusinessSumOfDigits,2,PHP_ROUND_HALF_UP);

    #Calculate the number of customers required per month
    $planArray[$x][0][8] = round($planArray[$x][0][4] / $targetSpend,2,PHP_ROUND_HALF_UP);

    #Calculate new customers per month total.
    if ($x == 0) {
        #First month..
        $planArray[$x][0][9] = $planArray[$x][0][8];
    } else {
        #All other months.
        $planArray[$x][0][9] = $planArray[$x][0][8] - $planArray[$x - 1][0][8];
    }

    $baselineTotal = $baselineTotal + $planArray[$x][0][1];
    
    $newBusinessTotal = $newBusinessTotal + $planArray[$x][0][4];
    
    $proactiveGrowthTotal = $proactiveGrowthTotal + $planArray[$x][0][7];

    $planArray[$x][0][10] = $planArray[$x][0][1] + $planArray[$x][0][4] + $planArray[$x][0][7];

    #Calculate revenue total.
    if ($x == 0) {
        #First month..
        $planArray[$x][0][11] = $planArray[$x][0][10];
    } else {
        #All other months.
        $planArray[$x][0][11] = $planArray[$x][0][10] + $planArray[$x - 1][0][11];
    }
}

$totalRevenueGenerated = $baselineTotal + $newBusinessTotal + $proactiveGrowthTotal;
$annualisedRevenue = ($planArray[$planLength - 1][0][10] * 12);
?>



<?php include 'header.php';?>

<body>
    <div class="container">
        <div class="row blue"><h1>Cloud Target Calculator</h1></div>
        <?php include 'nav.php';?>
        <div class="row white">
        <h2><span>🥳 </span>Here are the results for your <?php echo $planLength ?> month plan!</h2>
            <h3>Summary</h3>
            <p class="tab"><span>🌱 </span>Total number of new customers required: <span class="keypoint"><?php echo number_format($planArray[$planLength - 1][0][8]) ?></span> consuming approximately <span class="keypoint"><?php echo "$" . number_format($targetSpend) ?></span> per month. $<?php echo number_format($newBusinessTotal) ?> total.</p>
            <p class="tab"><span>📈 </span>Amount of proactively driven growth from existing customers required: <span class="keypoint">$<?php echo number_format($proactiveGrowthTotal) ?></span></p>
            <p class="tab"><span>💵 </span>Total revenue generated: <span class="keypoint">$<?php echo number_format($totalRevenueGenerated) ?></span></p>
            <p class="tab"><span>🔁 </span>Annualised recurring revenue at end of plan: <span class="keypoint">$<?php echo number_format($annualisedRevenue) ?></span> ($<?php echo number_format($planArray[$planLength - 1][0][10]) . " * 12" ?>)</p>
            <h3>Details</h3>
            <p class="tab">During this <?php echo $planLength ?> month period, you must add <span class="keypoint"><?php echo number_format($planArray[$planLength - 1][0][8]) ?> customers</span>,
             consuming approximately <span class="keypoint">$<?php echo number_format($targetSpend) ?> of cloud services per month</span> to achieve the new business 
             contribution of <?php echo $newBusinessShare * 100; ?>% to your incremental growth target (i.e. the amount left after factoring in your baseline recurring revenue).
             You must <span class="keypoint">grow your existing base of customers by a total of $<?php echo number_format($proactiveGrowthTotal + $baselineGrowthTotal + $newBusinessGrowthTotal) ?></span> to cover the remaining <?php echo 100 - ($newBusinessShare * 100); ?>% of your incremental growth target. This includes any organic growth you expect from your customers.
             <br>
             <br>
             Here's a monthly breakdown of customer adds and revenue growth:
            </p>
            <br>
            <div class="tablediv">
            <table>
                <tr>
                    <th>Month</th>
                    <th><div class="tooltip">Baseline<span class="tooltiptext">Baseline recurring revenue (e.g., from previous fiscal year).</span></div></th>
                    
                    <th><div class="tooltip">New Business<span class="tooltiptext">Recurring revenue driven from new customer adds.</span></div></th>
                    
                    <th><div class="tooltip">Proactive Growth<span class="tooltiptext">The above-baseline growth proactively driven by your teams.</span></div></th>
                    <th class="customer"><div class="tooltip">Customer Adds<span class="tooltiptext">The number of new customers you'll need to add in a given month.</span></div></th>
                    <th class="customer"><div class="tooltip">Customers Total<span class="tooltiptext">The running total of customers transacting per month.</span></div></th>
                    <th><div class="tooltip">Monthly Total<span class="tooltiptext">The running total of all constituent revenue per month.</span></div></th>
                    <th><div class="tooltip">Running Total<span class="tooltiptext">The running total of all constituent revenue.</span></div></th>
                </tr>

<?php 

for ($x = 0; $x < $planLength; $x++)
    {
        echo "<tr><td>" . $planArray[$x][0][0] . "</td><td>$" . number_format($planArray[$x][0][1]) . "</td><td>$" . number_format(round($planArray[$x][0][4],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($planArray[$x][0][7],0,PHP_ROUND_HALF_UP)) . "</td><td>" . number_format($planArray[$x][0][9],1) . "</td><td>" . number_format($planArray[$x][0][8],1) . "</td><td>$" . number_format(round($planArray[$x][0][10],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($planArray[$x][0][11],0,PHP_ROUND_HALF_UP)) . "</td></tr>";
    };

?>
                <tr>
                    <td class="total">Total:</td>
                    <td class="total">$<?php echo number_format($baselineTotal) ?></td>
                    
                    <td class="total">$<?php echo number_format($newBusinessTotal) ?></td>
                    
                    <td class="total">$<?php echo number_format($proactiveGrowthTotal) ?></td>
                    <td class="blank"></td>
                    <td class="total"><?php echo number_format($planArray[$planLength - 1][0][8],1) ?></td>
                    <td class="blank"></td>
                    <td class="blank"></td>
                </tr>
            </table>
            </div>

                <div id='myDiv'><!-- Plotly chart will be drawn inside this DIV --></div>

                <script>
                    var data = [
                        {
                            name: "Revenue",
                            type: "waterfall",
                            orientation: "v",
                            measure: [
                                "relative",
                                "relative",
                                "total",
                                "relative",
                                "relative",
                                "relative",
                                "total",
                                "total"
                            ],
                            x: [
        ["Existing", "Acquisition", "Acquisition", "Growth", "Growth", "Target" ],
        ["Baseline", "Adds", "Running Total", "Proactive Growth", "Running Total", "Target" ]
      ],
                            textposition: "outside",
                            text: [
                                "<?php echo number_format($baselineTotal) ?>",
                                "<?php echo number_format($newBusinessTotal) ?>",
                                "<?php echo number_format($newBusinessTotal + $baselineTotal) ?>",
                                "<?php echo number_format($proactiveGrowthTotal) ?>",
                                "<?php echo number_format($proactiveGrowthTotal + $newBusinessTotal + $baselineTotal) ?>",
                                "<?php echo number_format($totalRevenueGenerated) ?>"
                            ],          
                            y: [
                                <?php echo $baselineTotal ?>,
                                <?php echo $newBusinessTotal ?>,
                                <?php echo $newBusinessTotal + $baselineTotal ?>,
                                <?php echo $proactiveGrowthTotal ?>,
                                <?php echo $proactiveGrowthTotal + $newBusinessTotal + $baselineTotal ?>,
                                <?php echo $totalRevenueGenerated ?>
                            ],
                            connector: {
                            line: {
                                color: "rgb(63, 63, 63)"
                            }
                            },
                        }
                    ];
                layout = {
                        title: {
                            text: ""
                        },
                        xaxis: {
      title: "",
      tickfont: {size: 15},
      ticks: "outside"
    },
                        yaxis: {
                            type: "linear"
                        },
                        autosize: true,
                        showlegend: true
                    };
                Plotly.newPlot('myDiv', data, layout);
                </script>

<br>
            <br>
            <h1>Marketing Insights</h1>
            <?php calcMarketingMetrics($planArray[$planLength - 1][0][8]) ?>
            <p>Connecting sales outputs with marketing inputs is critical for a well defined plan. Therefore, based on the need to add <?php echo number_format($Wins); ?> customers, the 
            funnel chart below shows the approximate number of MQLs and SQLs required to support the pipeline estimated for the plan. This is based on 1 win requiring 
            <?php echo number_format($SQLconversion); ?>x sales qualified leads, each in turn requiring <?php echo number_format($MQLconversion); ?>x marketing qualified leads.</p>

            <div id="funnel"></div>

<script>
    const datafunnel = [
        { label: 'MQLs', value: <?=$MQLs?> },
        { label: 'SQLs', value: <?=$SQLs?> },
        { label: 'Wins', value: <?=$Wins?> },
    ];
    const options = {
        block: {
            dynamicHeight: true,
            minHeight: 15,
            fill: {
                type: 'gradient',
            },
        },
        chart: {
            bottomPinch: 1,
            animate: 10,
          curve: {
            enabled: true,
          },  
        },
    };

    const chart = new D3Funnel('#funnel');
    chart.draw(datafunnel, options);
</script>
            <br>
            <br>
            <span style="display: table; margin: 0 auto">
            <table>
                <tr>
                    <th>Stage</th>
                    <th>Number</th>
                </tr>
                <tr>
                    <td>MQLs</td>
                    <td><?php echo number_format($MQLs)?></td>
                </tr>
                <tr>
                    <td>SQLs</td>
                    <td><?php echo number_format($SQLs)?></td>
                </tr>
                <tr>
                    <td>Wins</td>
                    <td><?php echo number_format($Wins)?></td>
                </tr>
            </table>
            </span>
            <br>
        </div>

        <div class="row footer"><?php include 'footer.php';?></div>
    </div>
    <br />
    <br />
</body>
</html>
