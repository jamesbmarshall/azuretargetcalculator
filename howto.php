<?php $pageTitle = "Cloud Target Calculator | How To" ?>
<?php include 'header.php';?>
<body>
    <div class="container">
        <div class="row blue"><h1>Cloud Target Calculator</h1></div>
        <?php include 'nav.php';?>
        <div class="row white">
 <p>There are many different approaches to breaking down a target. In the Azure world, monthly recurring revenue is an important measure.
        Each month that you add a customer, or increase your consumption amount, carries forward for each remaining month of your plan period (e.g., a fiscal year).
        That's why, in the monthly recurring revenue world, the first day of the year is the most important. Because any customer you add in that first month 
        you get to bill 12 times, in the second month 11 times, third 10 times, and so on. If you add a customer in the last month of your plan period, you 
        only get one chance to bill them. Another way to look at it is that customers added in the first half of your plan period are worth twice that of 
        those added in the second!
    </p>

    <h3>The Rule of 78s</h3>

    <p>The calculations on this site are done following the 'rule of 78s' or 'sum of digits method'. It's something you may have come across in the finance
        world, where it's been more popularly used historically. Steven Garland at LeadGibbon <a href="https://www.leadgibbon.com/blog/rule-of-78/">wrote a great piece</a> 
        that goes into details if you're interested.</p>

    <p>In short, imagine you have 12 months, and you add one customer per month who buys $10-worth of services from you. You get to bill that customer
        every month they remain your customer. In month 1 you have 1 customer, in month 2 you have 2, and so on until the end of the year when you have
        12 customers. In this example you would also have $780 of services purchased. Assuming you keep all of those customers, in the second year you would
        have $1,440 of recurring revenue as your baseline because you get to bill all 12 customers 12 times.
    </p>
    <p>The calculator on this site assumes no customer loss, and no organic growth just to keep things simple. But hopefully you'll appreciate both the importance
        of regular customer adds, excellent customer retention, and proactively-driven growth from existing customers.</p>

        <br>
            <br>
        </div>

        <div class="row footer"><?php include 'footer.php';?></div>
    </div>
</body>
</html>
