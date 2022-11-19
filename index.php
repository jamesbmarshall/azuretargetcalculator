<html>
    <head>
        <title>Azure Target Calculator</title>
        <link rel="stylesheet" type="text/css" href="style/style.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Rubik">
        <link rel="icon" type="image/x-icon" href="favicon.ico">
    </head>

    <body>
        <div class="header">
            <?php include 'header.php';?>
        </div>

        <div class="topnav">
            <?php include 'nav.php';?>
        </div>

        <div class="column">
            <h2>Welcome,</h2>
            <p>This tool will help guide you in understanding the estimated Azure Consumed Revenue (ACR) and Azure Customer Adds (ACA) growth needed to hit or exceed your plan targets.<br><br>
            Complete the form below and you will be presented with a breakdown by month of everything you need!<br><br></p>

            <span id="form" style="display: table; width: 40%; margin: 0 auto">
            <form action="results.php" method="get"> 
            For how many months is your plan designed? (e.g., 1 year = 12 months, etc.) <input type="number" id="months" name="months" placeholder="12" required><br>
            What is the minimum average spend per customer you are aiming for in dollars? <input type="number" id="acpc" name="acpc" placeholder="1500" required><br>
            What is the target monthly recurring ACR you're expecting at the end of the plan period in dollars? <input type="number" id="mrrtarget" name="mrrtarget" placeholder="1000000" required><br>
            What percentage of new ACR do you expect to come from customer adds? <input type="number" step="any" id="newbus" name="newbus" placeholder="0-100" required><br>
            <input type="submit">
            </form>
            </span>
        </div>

        <div class="footer">
            <?php include 'footer.php';?>
        </div>
</body>
</html>
