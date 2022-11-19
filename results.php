<html>
    <head>
        <title>Azure Target Calculator</title>
        <link rel="stylesheet" type="text/css" href="style/style.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Rubik">
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
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
        <table>
        <tr>
            <th>Month</th>
            <th>ACR MoM$</th>
            <th>Total ACR</th>
            <th>ACA MoM#</th>
            <th>Total ACA</th>
            <th>New Business ACR MoM$</th>
            <th>New Business ACR Total</th>
            <th>Growth ACR MoM$</th>
            <th>Growth ACR Total</th>

        </tr>
        <?php foreach($ACRMoM as $key => $value) {echo "<tr><td>" . ($key + 1) . "</td><td>$" . number_format(floor($value)) .  "</td><td>$" . number_format(floor($ACRTotal[$key])) . "</td><td>" . number_format(floor($ACAMoM[$key])) . "</td><td>" . number_format(floor($ACATotal[$key])) . "</td><td>$" . number_format(floor($NewBusACR[$key])) . "</td><td>$" . number_format(floor($NewBusTotal[$key])) . "</td><td>$" . number_format(floor($GrowthACRMoM[$key])) . "</td><td>$" . number_format(floor($GrowthACRTotal[$key])) . "</td></tr>";}; ?>
        
        </table>

        </div>

        <div class="footer">
            <?php include 'footer.php';?>
        </div>
    
</body>
</html>
