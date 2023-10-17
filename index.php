<?php $pageTitle = "Cloud Target Calculator" ?>
<?php include 'header.php';?>
<body>
<div id="cover">
    <div class="centered-element">
        <img src="images/spinner.gif">
        <H3>Calculating your plan...</H3>
    </div>
</div>
<body>
    <div class="container">
        <div class="row blue"><h1>Cloud Target Calculator</h1></div>
        <?php include 'nav.php';?>
        <div class="row white">
        <h2>Welcome,</h2>
            <p>If you're involved in a business where recurring revenue is important (such as Microsoft Azure), you might have wondered what the best way to plan monthly growth is. It's 
                a little different to selling more traditional software, placing huge emphasis on compound growth of existing customers as well as continuing to add new ones. 
                This tool will help guide you in understanding the estimated monthly recurring revenue and customer adds growth needed to achieve the targets you set, or have
                been set by your business.<br><br>
            Complete the form below and you will be presented with a breakdown by month of everything you need!<br><br></p>

            <span class="form">
            <form action="results.php" method="get" id="inputform" onsubmit="loadingscreen()"> 
            1. How long is your <div class="tooltip_light">plan<span class="tooltiptext">Usually 12 months, but can be as little as 1 or as many as you like!</span></div>? (e.g., 12 months, etc.) <input type="number" id="months" name="months" placeholder="Example: 12" required><br>
            2. What is your <div class="tooltip_light">target spend<span class="tooltiptext">This can be made up of many services, and is the amount you're aiming to bill each customer every month. (i.e., recurring revenue!)</span></div> per customer per month, in dollars? <input type="number" id="acpc" name="acpc" placeholder="Example: 1500" required><br>
            3. What is the total <div class="tooltip_light">revenue target<span class="tooltiptext">This should be the total revenue you need to generate over the duration of your plan.</span></div> for the duration of your plan? <input type="number" id="revenue" name="revenue" placeholder="Example: 2000000"><br>
            <br>
            4. What percentage of recurring revenue do you expect to come from <div class="tooltip_light">adding new customers<span class="tooltiptext">The remaining percentage will be assumed to come from growing your existing customer base.</span></div>?<br>
            <br>
            <span id="rangeValue">0%</span> <input type="range" min="0" max="100" value="0" id="newbus" name="newbus" oninput="rangeValue.innerText = this.value + '%'"><br>
            <br>
            5. What is your <div class="tooltip_light">monthly recurring revenue baseline<span class="tooltiptext">This is the monthly recurring revenue from the month immediately before this plan begins. If you are unsure, set to 0.</span></div>?<input type="number" id="mrrbaseline" name="mrrbaseline" placeholder="Example: 50000" required><br>
            6. What is your organic <div class="tooltip_light">month-over-month growth rate<span class="tooltiptext">This is your estimated organic growth rate in percentage terms. If you are unsure, set to 0.</span></div>?<input type="number" min="0" max="100" id="momrate" name="momrate" placeholder="Example: 1" required><br>
            
            <!-- Advanced Options Toggle -->
            <button type="button" id="advancedOptionsToggle">Advanced Options</button>
            
            <!-- Optional Questions: Initially hidden -->
            <div id="advancedOptions" style="max-height: 0px">
            <p><i>These questions are optional. If you have numbers for your business, you can adjust the defaults to more closely match your own conversion rates and get a more accurate funnel recommendation.</i></p>

                <label for="MQLs">7. Approximately how many Marketing Qualified Leads (MQLs) do you process per Sales Qualified Lead (SQL)?</label>
                <input type="number" id="MQLs" name="MQLs" value="5">
                
                <label for="SQLs">8. Approximately how many SQLs do you process per won opportunity?</label>
                <input type="number" id="SQLs" name="SQLs" value="3">
            </div>
            
            <input type="submit" id="runcalc">
            </form>
            <p id="error-message" style="color: red;"></p>
            </span>
            <br>
        </div>

        <script>
            document.getElementById("inputform").addEventListener("submit", function(event){
            // Prevent the form from submitting
            event.preventDefault();

            // Clear any previous error messages
            document.getElementById("error-message").innerHTML = "";

            // Get the input values
            var firstNumber = document.getElementById("revenue").value;
            var secondNumber = document.getElementById("mrrbaseline").value;

            // Check that the inputs are not empty
            if (!firstNumber || !secondNumber) {
                document.getElementById("error-message").innerHTML = "Both numbers are required.";
                return;
            }

            // Check that the first number, divided by 12, is not less than the second number
            if ((firstNumber / 12) < secondNumber) {
                document.getElementById("error-message").innerHTML = "ERROR: Your monthly recurring basline is higher than your plan revenue target!";
                return;
            }

            // If validation passed, submit the form
            function loadingscreen() {
                $('#cover').fadeIn(100);
            }
            this.submit();
            
            });
        </script>
        <!-- Advanced Options Toggle Script -->
        <script>
            $(document).ready(function() {
                $('#advancedOptionsToggle').click(function() {
                    var options = $('#advancedOptions');
                    
                    if (options.css('max-height') === '0px') {
                        options.css('max-height', '500px');
                    } else {
                        options.css('max-height', '0px');
                    }
                });
            });
        </script>
        <div class="row footer"><?php include 'footer.php';?></div>
    </div>
</body>
</html>
