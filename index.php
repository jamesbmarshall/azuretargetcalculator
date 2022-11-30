
<?php include 'header.php';?>
<body>
<div id="cover">
    <div class="centered-element">
        <img src="images/spinner.gif">
        <H3>Calculating your plan...</H3>
    </div>
</div>
<div class="header"><h1>Cloud Target Calculator</h1></div>
<?php include 'nav.php';?>
        
        <div class="column">
            <h2>Welcome,</h2>
            <p>This tool will help guide you in understanding the estimated monthly recurring revenue and customer adds growth needed to hit or exceed your plan targets.<br><br>
            Complete the form below and you will be presented with a breakdown by month of everything you need!<br><br></p>

            <span class="form">
            <form action="results.php" method="get" id="inputform" onsubmit="loadingscreen()"> 
            1. For how many months is your plan designed? (e.g., 1 year = 12 months, etc.) <input type="number" id="months" name="months" placeholder="Example: 12" required><br>
            2. What is the minimum average spend per customer you are aiming for in dollars? <input type="number" id="acpc" name="acpc" placeholder="Example: 1500" required><br>
            3. What is the revenue target for the period of your plan? <input type="number" id="revenue" name="revenue" placeholder="Example: 2000000"><br>
            <br>
            Is that target:
            <input type="radio" id="mrr" name="RevenueType" value="mrr" required>
            <label for="mrr">Monthly Recurring Revenue</label>
            <input type="radio" id="total" name="RevenueType" value="total">
            <label for="total">Total Revenue</label><br>
            <br>
            4. What percentage of new ACR do you expect to come from customer adds? <input type="number" step="any" id="newbus" name="newbus" placeholder="Example: 0-100" min="0" max="100" required><br>
            <input type="submit" id="runcalc">
            </form>
            
            </span>
            <br>
            <br>
        </div>
        <script>
            function loadingscreen() {
                $('#cover').fadeIn(100);
            }
        </script>
        <div class="footer">
            <?php include 'footer.php';?>
        </div>
</body>
</html>
