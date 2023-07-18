<?php $pageTitle = "Cloud Target Calculator | Results" ?>
<?php

include 'header.php';

#Define some variables to represent the different user-specified values
$targetRevenue = 1440000;                                           #The revenue target either recurring or total.
$planLength = 12;                                                   #The number of months to calculate a plan for.
$targetSpend = 1500;                                                #The approximate minimum spend per customer, per month.
$newBusinessShare = 0.5;                                            #The percentage of the target achieved through net new business (i.e. customer adds).
$baselineRecurring = 0;                                         #The monthly recurring revenue baseline from plan month -1.
$typicalMoM = 0.04;                                                 #The month-over-month percentage growth in the existing baseline (the organic growth).
$newBusinessTarget = 0;                                             #The calculated new business target.
$growthBusinessTarget = 0;
$baselineGrowth = 0;                                                #The total of the recurring baseline + the growth in that baseline.
$newBusinessSumOfDigits = 0;                                        #The new business target / the rule of 78s method.
$growthBusinessSumOfDigits = 0;

/*MARKETING METRIC CALCS */
$MQLs = 0;
$SQLs = 0;
$Wins = 0;


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
    $planArray[$x][0][8] = round($planArray[$x][0][4] / $targetSpend,1,PHP_ROUND_HALF_UP);

    #Calculate new customers running total.
    if ($x == 0) {
        #First month..
        $planArray[$x][0][9] = $planArray[$x][0][8];
    } else {
        #All other months.
        $planArray[$x][0][9] = $planArray[$x][0][8] + $planArray[$x - 1][0][9];
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
}

$totalRevenueGenerated = $baselineTotal + $baselineGrowthTotal + $newBusinessTotal + $newBusinessGrowthTotal + $proactiveGrowthTotal;
$annualisedRevenue = ($planArray[$planLength - 1][0][10] * 12);
?>



<?php include 'header.php';?>
    
<div class="header"><h1>Cloud Target Calculator</h1></div>

<?php include 'nav.php';?>

<div class="column">
        <h2>Here are the results for your <?php echo $planLength ?> month plan!</h2>
            <h3>Summary</h3>
            <p>Total number of new customers required: <span class="keypoint"><?php echo number_format($planArray[$planLength - 1][0][9]) ?></span> consuming approximately <span class="keypoint"><?php echo "$" . number_format($targetSpend) ?></span> per month.</p>
            <p>Total revenue generated: <span class="keypoint">$<?php echo number_format($totalRevenueGenerated) ?></span></p>
            <p>Annualised recurring revenue at end of period: <span class="keypoint">$<?php echo number_format($annualisedRevenue) ?></span> ($<?php echo number_format($planArray[$planLength - 1][0][10]) . " * 12" ?>)</p>
            
<?php
#Write it all out in a table.
echo "<table><tr><th>Month</th><th>Baseline</th><th>Baseline Growth</th><th>New Business</th><th>New Business Growth</th><th>Proactive Growth</th><th>TPIDs MoM</th><th>TPIDs Total</th></tr>";
for ($x = 0; $x < $planLength; $x++){
      
    echo "<tr><td>" . $planArray[$x][0][0] . "</td><td>" . $planArray[$x][0][1] . "</td><td>" . $planArray[$x][0][3] . "</td><td>" . $planArray[$x][0][4] . "</td><td>" . $planArray[$x][0][6] . "</td><td>" . $planArray[$x][0][7] . "</td><td>" . $planArray[$x][0][8] . "</td><td>" . $planArray[$x][0][9] . "</td></tr>";
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
                    <td class="blank"></td>
                </tr>
                </table>
</div>
<div class="footer">
            <?php include 'footer.php';?>
        </div>
    
</body>
</html>
