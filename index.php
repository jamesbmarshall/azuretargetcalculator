<?php $pageTitle = "Cloud Target Calculator" ?>
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
            <p>If you're invovled in a business where recurring revenue is important (such as Microsoft Azure), you might have wondered what the best way to plan monthly growth is. It's 
                a little different to selling more traditional software, placing huge emphasis on compound growth of existing customers as well as continuiung to add new ones. 
                This tool will help guide you in understanding the estimated monthly recurring revenue and customer adds growth needed to achieve the targets you set, or have
                been set by your business.<br><br>
            Complete the form below and you will be presented with a breakdown by month of everything you need!<br><br></p>

            <span class="form">
            <form action="results.php" method="get" id="inputform" onsubmit="loadingscreen()"> 
            1. How long is your <div class="tooltip_light">plan<span class="tooltiptext">Usually 12 months, but can be as little as 1 or as many as you like!</span></div>? (e.g., 12 months, etc.) <input type="number" id="months" name="months" placeholder="Example: 12" required><br>
            2. What is your <div class="tooltip_light">target spend<span class="tooltiptext">This can be made up of many services, and is the amount you're aiming to bill each customer every month. (i.e., recurring revenue!)</span></div> per customer per month, in dollars? <input type="number" id="acpc" name="acpc" placeholder="Example: 1500" required><br>
            3. What is your total <div class="tooltip_light">revenue target<span class="tooltiptext">This should be the total revenue you need to generate during the course of your plan.</span></div> for the duration of your plan? <input type="number" id="revenue" name="revenue" placeholder="Example: 2000000"><br>
            <br>
            4. What percentage of recurring revenue do you expect to come from <div class="tooltip_light">adding new customers<span class="tooltiptext">The remaining percentage will be assumed to come from growing your existing customer base.</span></div>?<br>
            <br>
            <input type="range" min="0" max="100" value="0" id="newbus" name="newbus" oninput="rangeValue.innerText = this.value + '%'"><span id="rangeValue">0%</span><br>
            <br>
            5. What is the <div class="tooltip_light">recurring revenue baseline<span class="tooltiptext">This is the monthly recurring revenue from the month immediately before this plan begins.</span></div> for the duration of your plan?<input type="number" id="mrrbaseline" name="mrrbaseline" placeholder="Example: 50000" required><br>
            6. What is your <div class="tooltip_light">month-over-month growth rate<span class="tooltiptext">This is your estimated organic growth rate in percentage terms.</span></div>?<input type="number" min="0" max="100" id="momrate" name="momrate" placeholder="4" required><br>
            <input type="submit" id="runcalc">
            </form>
            
            </span>
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
