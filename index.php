
<?php include 'header.php';?>

<body>
<div id="cover"></div>
<div class="header"><h1>Azure Target Calculator</h1></div>
<?php include 'nav.php';?>
        
        <div class="column">
            <h2>Welcome,</h2>
            <p>This tool will help guide you in understanding the estimated Azure Consumed Revenue (ACR) and Azure Customer Adds (ACA) growth needed to hit or exceed your plan targets.<br><br>
            Complete the form below and you will be presented with a breakdown by month of everything you need!<br><br></p>

            <span id="form" style="display: table; width: 40%; margin: 0 auto">
            <form action="results.php" method="get" id="inputform"> 
            1. For how many months is your plan designed? (e.g., 1 year = 12 months, etc.) <input type="number" id="months" name="months" placeholder="12" required><br>
            2. What is the minimum average spend per customer you are aiming for in dollars? <input type="number" id="acpc" name="acpc" placeholder="1500" required><br>
            <hr>
            3. What is the total new ACR you need during the period of your plan? (New ACR = Total target ACR - Baseline) <input type="number" id="newacr" name="newacr" placeholder="2000000"><br>
            <h4>OR</h4>
            3. What is the target monthly recurring ACR you're expecting at the end of the plan period in dollars? <input type="number" id="mrrtarget" name="mrrtarget" placeholder="1000000"><br>
            <hr>
            4. What percentage of new ACR do you expect to come from customer adds? <input type="number" step="any" id="newbus" name="newbus" placeholder="0-100" required><br>
            <input type="submit">
            </form>
            </span>
            <br>
            <br>
        </div>
        <script>
        $( "#inputform" ).submit(function( event ) {
            $('#cover').fadeIn(100);
            event.preventDefault();
        });
    </script>
        <div class="footer">
            <?php include 'footer.php';?>
        </div>
</body>
</html>
