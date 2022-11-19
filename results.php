<html>
    <head>
        <title>Azure Target Calculator</title>
        <link rel="stylesheet" type="text/css" href="style/style.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Rubik">
        <link rel="icon" type="image/x-icon" href="favicon.ico">
    </head>

    <body>
   
    <?php
    error_reporting (E_ALL ^ E_NOTICE);
    $numberOfMonths = $_GET["months"];
    $minAzureSpend = $_GET["acpc"];
    $targetMonthlyRevenue = $_GET["mrrtarget"];
    $newBusinessPercentage = $_GET["newbus"] / 100;

    $ACRMoM = array();
    $ACRTotal = array();
    $ACAMoM = array();
    $ACATotal = array();
    $NewBusACR = array();
    $NewBusTotal = array();
    $GrowthACRMoM = array();
    $GrowthACRTotal = array();

    function calcMultiplier($months) {
        $i = ($months ** 2 + $months)/2;
        return $i;
    }

    function calcMoMACRGrowth($months, $targetMRR) {
        global $ACRMoM;
        $x = 0;
        $multiplier = calcMultiplier($months);
        for ($x = 0; $x < $months; $x++) {$ACRMoM[$x] = $targetMRR/$multiplier * ($x+1);};        
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

        return $i;
    }
    
    
    calcMoMACRGrowth($numberOfMonths, $targetMonthlyRevenue);
    calcACRRunningTotal();
    calcMoMACAGrowth($newBusinessPercentage, $minAzureSpend);
    calcACARunningTotal();
    calcNewBusinessACRMoM($minAzureSpend);
    calcNewBusRunningTotal();
    calcGrowthACRMoM();
    calcGrowthACRTotal();


    ?>
        <div class="header">
            <?php include 'header.php';?>
        </div>

        <div class="topnav">
            <?php include 'nav.php';?>
        </div>

        <div class="column">
            <h2>Here are the results for your <?php echo $numberOfMonths ?> month plan!</h2>
            <h3>Total number of new customers required: <?php echo number_format(ceil(calcTotaliser($ACATotal))) ?>.</h3>
            <h3>Total amount of ACR required: $<?php echo number_format(ceil(calcTotaliser($ACRTotal))) ?>.</h3>
            <p>During this period, you will need to add approximately <span class="keypoint"><?php echo number_format(ceil(calcTotaliser($ACATotal))) ?> customers</span>,
             contributing <span class="keypoint">$<?php echo number_format(ceil(calcTotaliser($NewBusTotal))) ?> of ACR</span> to achieve your new business 
             contribution of <?php echo $newBusinessPercentage * 100; ?>% to your overall plan target.
             You should also aim to grow your existing base of customers by <span class="keypoint">$<?php echo number_format(ceil(calcTotaliser($GrowthACRTotal))) ?></span> 
             to cover the remaining <?php echo 100 - ($newBusinessPercentage * 100); ?>% of your plan target. A monthly breakdown of customer adds and revenue growth is given below.
            </p>
            <br>

            <span style="display: table; margin: 0 auto">
                <table>
                <tr>
                    <th>Month</th>
                    <th>ACR MoM$</th>
                    <th>ACR</th>
                    <th>ACA MoM#</th>
                    <th># Customers</th>
                    <th>New Business ACR MoM$</th>
                    <th>New Business ACR</th>
                    <th>Growth ACR MoM$</th>
                    <th>Growth ACR</th>

                </tr>
                <?php foreach($ACRMoM as $key => $value) {echo "<tr><td>" . ($key + 1) . "</td><td>$" . number_format(ceil($value)) .  "</td><td>$" . number_format(ceil($ACRTotal[$key])) . "</td><td>" . number_format(ceil($ACAMoM[$key])) . "</td><td>" . number_format(ceil($ACATotal[$key])) . "</td><td>$" . number_format(ceil($NewBusACR[$key])) . "</td><td>$" . number_format(floor($NewBusTotal[$key])) . "</td><td>$" . number_format(ceil($GrowthACRMoM[$key])) . "</td><td>$" . number_format(ceil($GrowthACRTotal[$key])) . "</td></tr>";}; ?>
                
                </table>
            </span>
            <br>
            <br>
        </div>

        <div class="footer">
            <?php include 'footer.php';?>
        </div>
    
</body>
</html>
