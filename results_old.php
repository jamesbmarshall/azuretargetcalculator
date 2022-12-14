<?php $pageTitle = "Cloud Target Calculator | Results" ?>
<?php
    error_reporting (E_ALL ^ E_NOTICE);
    $numberOfMonths = $_GET["months"];
    $minAzureSpend = $_GET["acpc"];
    $revenueType = $_GET["RevenueType"];

    if ($revenueType == "mrr"){
        $targetMonthlyRevenue = $_GET["revenue"];
        $targetACRTotal = "false";
    } 
    
    if ($revenueType == "total") {
        $targetMonthlyRevenue = "false";
        $targetACRTotal = $_GET["revenue"];
    }

    $newBusinessPercentage = $_GET["newbus"] / 100;

    $ACRMoM = array();
    $ACRTotal = array();
    $ACAMoM = array();
    $ACATotal = array();
    $ACAGross = array();
    $NewBusACR = array();
    $NewBusTotal = array();
    $GrowthACRMoM = array();
    $GrowthACRTotal = array();

    /*MARKETING METRIC CALCS */
    $MQLs = 0;
    $SQLs = 0;
    $Wins = 0;

    function round_up ($value, $precision) { 
        $pow = pow (10, $precision); 
        return (ceil($pow * $value) + ceil($pow * $value - ceil($pow * $value))) / $pow; 
    }

    function calcMultiplier($months) {
        $i = ($months ** 2 + $months)/2;
        return $i;
    }

    function calcMoMACRGrowth($months, $targetMRR) {
        global $ACRMoM;
        $x = 0;
        $multiplier = calcMultiplier($months);
        for ($x = 0; $x < $months; $x++) {$ACRMoM[$x] = round($targetMRR/$multiplier * ($x+1),0,PHP_ROUND_HALF_UP);};        
    }

    function calcACRRunningTotal() {
        global $ACRTotal;
        global $ACRMoM;
        $x = 0;
        $y = count($ACRMoM);

        for ($x = 0; $x <= $y; $x++) {            
            if ($x == 0) {
                $ACRTotal[$x] = $ACRMoM[$x];
            } else {
                $ACRTotal[$x] = $ACRMoM[$x] + $ACRTotal[$x -1];
            }
        }
        
    }

    function calcMoMACAGrowth($newBusTarget, $AvgCPC) {
        global $ACAMoM;
        global $ACRMoM;
        $x = 0;
        $y = count($ACRMoM);

        for ($x = 0; $x <= $y; $x++) {$ACAMoM[$x] = ($ACRMoM[$x]/$AvgCPC) * $newBusTarget;};        
    }

    function calcACARunningTotal() {
        global $ACRTotal;
        global $ACRMoM;
        global $ACAMoM;
        global $ACATotal;

        $x = 0;
        $y = count($ACRMoM);

        for ($x = 0; $x <= $y; $x++) {            
            if ($x == 0) {
                $ACATotal[$x] = $ACAMoM[$x];
            } else {
                $ACATotal[$x] = $ACAMoM[$x] + $ACATotal[$x -1];
            }
        }
        
    }

    function calcACAGrossRunningTotal() {
        global $ACRTotal;
        global $ACRMoM;
        global $ACAMoM;
        global $ACATotal;
        global $ACAGross;

        $x = 0;
        $y = count($ACRMoM);

        for ($x = 0; $x <= $y; $x++) {            
            if ($x == 0) {
                $ACAGross[$x] = $ACATotal[$x];
            } else {
                $ACAGross[$x] = $ACATotal[$x] + $ACAGross[$x -1];
            }
        }
        
    }

    function calcNewBusinessACRMoM($AvgCPC) {
        global $ACAMoM;
        global $NewBusACR;
        global $ACRMoM;

        $x = 0;
        $y = count($ACRMoM);

        for ($x = 0; $x <= $y; $x++) {$NewBusACR[$x] = $ACAMoM[$x] * $AvgCPC;}; 

    }

    function calcNewBusRunningTotal() {
        global $ACRTotal;
        global $ACRMoM;
        global $ACAMoM;
        global $ACATotal;
        global $NewBusACR;
        global $NewBusTotal;

        $x = 0;
        $y = count($ACRMoM);

        for ($x = 0; $x <= $y; $x++) {            
            if ($x == 0) {
                $NewBusTotal[$x] = $NewBusACR[$x];
            } else {
                $NewBusTotal[$x] = $NewBusACR[$x] + $NewBusTotal[$x -1];
            }
        }
        
    }

    function calcGrowthACRMoM() {
        global $ACRTotal;
        global $ACRMoM;
        global $ACAMoM;
        global $ACATotal;
        global $NewBusACR;
        global $NewBusTotal;
        global $GrowthACRMoM;

        $x = 0;
        $y = count($ACRMoM);

        for ($x = 0; $x <= $y; $x++) {$GrowthACRMoM[$x] = $ACRMoM[$x] - $NewBusACR[$x];}
    }

    function calcGrowthACRTotal() {
        global $ACRTotal;
        global $ACRMoM;
        global $ACAMoM;
        global $ACATotal;
        global $NewBusACR;
        global $NewBusTotal;
        global $GrowthACRMoM;
        global $GrowthACRTotal;

        $x = 0;
        $y = count($ACRMoM);

        for ($x = 0; $x <= $y; $x++) {            
            if ($x == 0) {
                $GrowthACRTotal[$x] = $GrowthACRMoM[$x];
            } else {
                $GrowthACRTotal[$x] = $GrowthACRMoM[$x] + $GrowthACRTotal[$x -1];
            }
        }
        
    }

    function calcTotaliser($numbers) {
        global $numberOfMonths;
        $i = 0;

        for ($x = 0; $x <= ($numberOfMonths - 1); $x++){
            $i = $i + $numbers[$x];
            #echo number_format($i) . " ";
        }

        return round($i, 0, PHP_ROUND_HALF_UP);
    }
    
    function calcMarketingMetrics($customers) {
        global $SQLs;
        global $MQLs;
        global $Wins;

        $Wins = $customers;
        $SQLs = $Wins * 3;
        $MQLs = $SQLs * 5;
    }
    
    ?>

<?php include 'header.php';?>


<body>
    
<div class="header"><h1>Cloud Target Calculator</h1></div>
<?php
if ($targetMonthlyRevenue != "false"){
    calcMoMACRGrowth($numberOfMonths, $targetMonthlyRevenue);
    calcACRRunningTotal();
    
} elseif ($targetACRTotal != "false"){
    global $numberOfMonths;
    global $targetMonthlyRevenue;
    global $ACRTotal;
    global $targetACRTotal;
    global $total;

    $targetMonthlyRevenue = 1;
    
    calcMoMACRGrowth($numberOfMonths, $targetMonthlyRevenue);
    calcACRRunningTotal();
    $total = calcTotaliser($ACRTotal);

    # echo "Target Total: " . $targetACRTotal . " ACR Total: " . $total . "<br>";

    while ($total < $targetACRTotal) {
        global $targetMonthlyRevenue;
        global $total;

        calcMoMACRGrowth($numberOfMonths, $targetMonthlyRevenue);
        calcACRRunningTotal();
        $total = calcTotaliser($ACRTotal);

      #  echo $targetMonthlyRevenue . " " . $total . "<br>";
        $targetMonthlyRevenue++;
        
    }        
            
} else {
    echo "ERROR";
}

    calcMoMACAGrowth($newBusinessPercentage, $minAzureSpend);
    calcACARunningTotal();
    calcACAGrossRunningTotal();
    calcNewBusinessACRMoM($minAzureSpend);
    calcNewBusRunningTotal();
    calcGrowthACRMoM();
    calcGrowthACRTotal();
    calcMarketingMetrics(calcTotaliser($ACAMoM));
    $totalCustomers = number_format(round($ACATotal[$key],0,PHP_ROUND_HALF_UP)); 

?>
<script src="scripts/d3-funnel.min.js"></script>
<script src="scripts/d3-funnel.js"></script>  
<?php include 'nav.php';?>

        <div class="column">
            <h2>Here are the results for your <?php echo $numberOfMonths ?> month plan!</h2>
            <h3>Summary</h3>
            <p>Total number of new customers required: <span class="keypoint"><?php echo number_format(calcTotaliser($ACAMoM)) ?></span> consuming approximately <span class="keypoint"><?php echo "$" . number_format($minAzureSpend) ?></span> per month.</p>
            <p>Total revenue generated: <span class="keypoint">$<?php echo number_format(calcTotaliser($ACRTotal)) ?></span></p>
            <p>Annualised recurring revenue at end of period: <span class="keypoint">$<?php echo number_format(round(($ACRTotal[$numberOfMonths - 1] * 12),0,PHP_ROUND_HALF_UP)) ?></span> ($<?php echo number_format(($ACRTotal[$numberOfMonths - 1])) . " * 12" ?>)</p>
            <h3>Details</h3>
            <p>During this <?php echo $numberOfMonths ?> month period, you will need to add approximately <span class="keypoint"><?php echo number_format(calcTotaliser($ACAMoM)) ?> customers</span>,
             consuming <span class="keypoint">$<?php echo number_format(calcTotaliser($NewBusTotal)) ?> of cloud services</span> to achieve the new business 
             contribution of <?php echo $newBusinessPercentage * 100; ?>% to your overall plan target.
             You should also aim to grow your existing base of customers by <span class="keypoint">$<?php echo number_format(calcTotaliser($GrowthACRTotal)) ?></span> 
             to cover the remaining <?php echo 100 - ($newBusinessPercentage * 100); ?>% of your plan target. A monthly breakdown of customer adds and revenue growth is given below.
            </p>
            <br>

            <div class="tablediv">
                <table>
                <tr>
                    <th>Month</th>
                    <th><div class="tooltip">MRR<span class="tooltiptext">Monthly Recurring Revenue</span></div></th>
                    <th><div class="tooltip">MRR MoM$<span class="tooltiptext">MRR month-over-month growth</span></div></th>
                    <th># Customers</th>
                    <th><div class="tooltip">CA MoM<span class="tooltiptext">Customer adds month-over-month</span></div></th>
                    <th>New Business MRR MoM$</th>
                    <th>New Business MRR</th>
                    <th>Growth MRR MoM$</th>
                    <th>Growth MRR</th>

                </tr>
                <?php foreach($ACRMoM as $key => $value) {echo "<tr><td>" . ($key + 1) . "</td><td>$" . number_format(round($ACRTotal[$key],0,PHP_ROUND_HALF_UP)) .  "</td><td>$" . number_format(round($value,0,PHP_ROUND_HALF_UP)) . "</td><td>" . number_format(round($ACATotal[$key],1,PHP_ROUND_HALF_UP), 1, '.', ',') . "</td><td>" . number_format(round($ACAMoM[$key],1,PHP_ROUND_HALF_UP), 1, '.', ',') . "</td><td>$" . number_format(round($NewBusACR[$key],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($NewBusTotal[$key],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($GrowthACRMoM[$key],0,PHP_ROUND_HALF_UP)) . "</td><td>$" . number_format(round($GrowthACRTotal[$key],0,PHP_ROUND_HALF_UP)) . "</td></tr>";}; ?>
                <tr>
                    <td class="total">Total:</td>
                    <td class="total">$<?php echo number_format(calcTotaliser($ACRTotal)) ?></td>
                    <td class="blank"></td>
                    <td class="total"><?php echo number_format(calcTotaliser($ACAMoM)) ?></td>
                    <td class="blank"></td>
                    <td class="blank"></td>
                    <td class="total">$<?php echo number_format(calcTotaliser($NewBusTotal)) ?></td>
                    <td class="blank"></td>
                    <td class="total">$<?php echo number_format(calcTotaliser($GrowthACRTotal)) ?></td>
                </tr>
                </table>
            </div>
            <br>
            <br>
            <h1>Marketing Insights</h1>
            <p>Connecting sales outputs with marketing inputs is critical for a well defined plan. Therefore, based on the need to add <?php echo number_format($Wins); ?> customers, the 
            funnel chart below shows the approximate number of MQLs and SQLs required to support the pipeline estimated for the plan. This is based on 1 win requiring 
            3x sales qualified leads, each in turn requiring 5x marketing qualified leads. These are approximations, and your business will have different conversion
            rates which could be applied.</p>

            <div id="funnel" style="width: 500px; margin: 0 auto; overflow-x: auto;"></div>

<script>
    const data = [
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
    chart.draw(data, options);
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
         
        <div class="footer">
            <?php include 'footer.php';?>
        </div>
    
</body>
</html>
