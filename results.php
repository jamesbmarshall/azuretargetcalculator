<?php $pageTitle = "Cloud Target Calculator | Results" ?>
<?php

#Define some variables to represent the different user-specified values
$targetRevenue = $_GET["revenue"];                                  #The revenue target either recurring or total.
$planLength = $_GET["months"];                                      #The number of months to calculate a plan for.
$targetSpend = $_GET["acpc"];                                       #The approximate minimum spend per customer, per month.
$newBusinessShare = $_GET["newbus"] / 100;                          #The percentage of the target achieved through net new business (i.e. customer adds).
$baselineRecurring = $_GET["mrrbaseline"];                          #The monthly recurring revenue baseline from plan month -1.
$typicalMoM = $_GET["momrate"] /100;                                #The month-over-month percentage growth in the existing baseline (the organic growth).
$MQLconversion = $_GET["MQLs"];                                     #The number of MQLs per SQL.
$SQLconversion = $_GET["SQLs"];                                     #The number of SQLs per win.
$newBusinessTarget = 0;                                             #The calculated new business target.
$growthBusinessTarget = 0;
$baselineGrowth = 0;                                                #The total of the recurring baseline + the growth in that baseline.
$newBusinessSumOfDigits = 0;                                        #The new business target / the rule of 78s method.
$growthBusinessSumOfDigits = 0;

/*MARKETING METRIC CALCS */
$MQLs = 0;
$SQLs = 0;
$Wins = 0;

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

$planArray = array();                                               #Array to hold all the plan values.


for ($x = 0; $x < $planLength; $x++){
    #Set the baseline for the plan length. This is simply the same amount per month for the number of months given in $planLength.
    $planArray[$x][0][0] = $x + 1;
    $planArray[$x][0][1] = $baselineRecurring;

    #Calculate the gross MoM growth on the baseline and add it to the array.
    
    if ($x == 0) {
        #First month is baseline (baseline * MoM) + baseline.
        $planArray[$x][0][2] = ($baselineRecurring * $typicalMoM) + $baselineRecurring;
    } else {
        #All other months are (previous month * MoM) + previous month.
        $planArray[$x][0][2] = round(($planArray[$x-1][0][2] * $typicalMoM) + $planArray[$x-1][0][2],2,PHP_ROUND_HALF_UP);    
    }
    
    #Calculate the net MoM growth on the baseline and add it to the array.
    $planArray[$x][0][3] = $planArray[$x][0][2] - $planArray[$x][0][1];

    #Calculate the new business target
    $baselineGrowth = $baselineGrowth + $planArray[$x][0][2];
};


$newBusinessTarget = ($targetRevenue - $baselineGrowth) * $newBusinessShare;
$newBusinessSumOfDigits = round($newBusinessTarget / $sumOfDigits,2,PHP_ROUND_HALF_UP);


for ($x = 0; $x < $planLength; $x++){
    #Calculate new business growth.
    $planArray[$x][0][4] = ($x + 1) * $newBusinessSumOfDigits;
    
    #Calculate new business running total.
    if ($x == 0) {
        #First month..
        $planArray[$x][0][5] = $planArray[$x][0][4];
    } else {
        #All other months.
        $planArray[$x][0][5] = $planArray[$x][0][4] + $planArray[$x - 1][0][5];
    }

    #Calculate new business growth.
    if ($x == 0) {
        #First month..
        $planArray[$x][0][6] = 0;
    } else {
        #All other months.
        $planArray[$x][0][6] = round(($planArray[$x][0][5] - $planArray[$x][0][4]) * $typicalMoM,2,PHP_ROUND_HALF_UP);
    }
};
$newBusGrowthRunning = 0;

for($x = 0;$x < $planLength; $x++){
    $newBusGrowthRunning = $newBusGrowthRunning + $planArray[$x][0][6];
}

#Calculate remaining proactive growth target.
$growthBusinessTarget = $targetRevenue - $baselineGrowth - $newBusinessTarget - $newBusGrowthRunning;
$growthBusinessSumOfDigits = $growthBusinessTarget / $sumOfDigits;

for($x = 0;$x < $planLength; $x++){

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

}

$baselineTotal = 0;
$baselineGrowthTotal = 0;
$newBusinessTotal = 0;
$newBusinessGrowthTotal = 0;
$proactiveGrowthTotal =0;

#Calculate all the relevant totals.
for($x = 0;$x < $planLength; $x++){
    $baselineTotal = $baselineTotal + $planArray[$x][0][1];
    $baselineGrowthTotal = $baselineGrowthTotal + $planArray[$x][0][3];
    $newBusinessTotal = $newBusinessTotal + $planArray[$x][0][4];
    $newBusinessGrowthTotal = $newBusinessGrowthTotal + $planArray[$x][0][6];
    $proactiveGrowthTotal = $proactiveGrowthTotal + $planArray[$x][0][7];

    $planArray[$x][0][10] = $planArray[$x][0][1] + $planArray[$x][0][3] + $planArray[$x][0][4] + $planArray[$x][0][6] + $planArray[$x][0][7];

    #Calculate revenue total.
    if ($x == 0) {
        #First month..
        $planArray[$x][0][11] = $planArray[$x][0][10];
    } else {
        #All other months.
        $planArray[$x][0][11] = $planArray[$x][0][10] + $planArray[$x - 1][0][11];
    }
}

$totalRevenueGenerated = $baselineTotal + $baselineGrowthTotal + $newBusinessTotal + $newBusinessGrowthTotal + $proactiveGrowthTotal;
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
            <p class="tab"><span>🌱 </span>Total number of new customers required: <span class="keypoint"><?php echo number_format($planArray[$planLength - 1][0][8]) ?></span> consuming approximately <span class="keypoint"><?php echo "$" . number_format($targetSpend) ?></span> per month.</p>
            <p class="tab"><span>💵 </span>Total revenue generated: <span class="keypoint">$<?php echo number_format($totalRevenueGenerated) ?></span></p>
            <p class="tab"><span>🔁 </span>Annualised recurring revenue at end of plan: <span class="keypoint">$<?php echo number_format($annualisedRevenue) ?></span> ($<?php echo number_format($planArray[$planLength - 1][0][10]) . " * 12" ?>)</p>
            <h3>Details</h3>
            <p class="tab">During this <?php echo $planLength ?> month period, you will need to add <span class="keypoint"><?php echo number_format($planArray[$planLength - 1][0][8]) ?> customers</span>,
             consuming approximately <span class="keypoint">$<?php echo number_format($targetSpend) ?> of cloud services per month</span> to achieve the new business 
             contribution of <?php echo $newBusinessShare * 100; ?>% to your overall plan target.
             You should also aim to grow your existing base of customers by <span class="keypoint">$<?php echo number_format($proactiveGrowthTotal + $baselineGrowthTotal + $newBusinessGrowthTotal) ?></span> 
             to cover the remaining <?php echo 100 - ($newBusinessShare * 100); ?>% of your plan target. Some of this growth will be 'organic'. In other words, your customers will naturally consume a little more over time all by themselves (that's the baseline growth column). However, you'll need to
             put specific focus on creating new opportunity within your existing customers to really achieve the growth you'll need. This might be by selling additional services, modernising existing ones, or by consolidating existing services hosted elsewhere onto one platform.
             <br>
             <br>
             A monthly breakdown of customer adds and revenue growth is given below.
            </p>
            <br>
            <div class="tablediv">
            <table>
                <tr>
                    <th>Month</th>
                    <th><div class="tooltip">Baseline<span class="tooltiptext">Baseline recurring revenue (e.g., from previous fiscal year).</span></div></th>
                    <th><div class="tooltip">Baseline Growth<span class="tooltiptext">The month-over-month 'organic' growth applied to the baseline.</span></div></th>
                    <th><div class="tooltip">New Business<span class="tooltiptext">Recurring revenue driven from new customer adds.</span></div></th>
                    <th><div class="tooltip">New Business Growth<span class="tooltiptext">The month-over-month growth of the new business. New customers grow, too!</span></div></th>
                    <th><div class="tooltip">Proactive Growth<span class="tooltiptext">The above-baseline growth proactively driven by your teams.</span></div></th>
                    <th><div class="tooltip">Customer Adds<span class="tooltiptext">The number of new customers you'll need to add in a given month.</span></div></th>
                    <th><div class="tooltip">Customers Total<span class="tooltiptext">The running total of customers transacting per month.</span></div></th>
                    <th><div class="tooltip">Monthly Total<span class="tooltiptext">The running total of all constituent revenue per month.</span></div></th>
                    <th><div class="tooltip">Running Total<span class="tooltiptext">The running total of all constituent revenue.</span></div></th>
                </tr>

<?php 

for ($x = 0; $x < $planLength; $x++)
    {
        echo "<tr><td>" . $planArray[$x][0][0] . "</td><td>$" . number_format($planArray[$x][0][1]) . "</td><td>$" . number_format(round($planArray[$x][0][3],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($planArray[$x][0][4],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($planArray[$x][0][6],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($planArray[$x][0][7],0,PHP_ROUND_HALF_UP)) . "</td><td>" . number_format($planArray[$x][0][9],1) . "</td><td>" . number_format($planArray[$x][0][8],1) . "</td><td>$" . number_format(round($planArray[$x][0][10],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($planArray[$x][0][11],0,PHP_ROUND_HALF_UP)) . "</td></tr>";
    };

?>
                <tr>
                    <td class="total">Total:</td>
                    <td class="total">$<?php echo number_format($baselineTotal) ?></td>
                    <td class="total">$<?php echo number_format($baselineGrowthTotal) ?></td>
                    <td class="total">$<?php echo number_format($newBusinessTotal) ?></td>
                    <td class="total">$<?php echo number_format($newBusinessGrowthTotal) ?></td>
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
        ["Existing", "Acquisition", "Acquisition", "Growth", "Growth", "Growth", "Growth", "Target" ],
        ["Baseline", "Adds", "Total", "1. Adds", "2. Organic", "3. Proactive", "4. Total", "Target" ]
      ],
                            textposition: "outside",
                            text: [
                                "<?php echo number_format($baselineTotal) ?>",
                                "<?php echo number_format($newBusinessTotal) ?>",
                                "<?php echo number_format($newBusinessTotal + $baselineTotal) ?>",
                                "<?php echo number_format($newBusinessGrowthTotal) ?>",
                                "<?php echo number_format($baselineGrowthTotal) ?>",
                                "<?php echo number_format($proactiveGrowthTotal) ?>",
                                "<?php echo number_format($proactiveGrowthTotal + $baselineGrowthTotal + $newBusinessGrowthTotal) ?>",
                                "<?php echo number_format($totalRevenueGenerated) ?>"
                            ],          
                            y: [
                                <?php echo $baselineTotal ?>,
                                <?php echo $newBusinessTotal ?>,
                                <?php echo $newBusinessTotal + $baselineTotal ?>,
                                <?php echo $newBusinessGrowthTotal ?>,
                                <?php echo $baselineGrowthTotal ?>,
                                <?php echo $proactiveGrowthTotal ?>,
                                <?php echo $proactiveGrowthTotal + $baselineGrowthTotal + $newBusinessGrowthTotal ?>,
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
            <?php echo number_format($SQLconversion); ?>x sales qualified leads, each in turn requiring <?php echo number_format($MQLconversion); ?>x marketing qualified leads. These are approximations, and your business will have different conversion
            rates which could be applied.</p>

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
