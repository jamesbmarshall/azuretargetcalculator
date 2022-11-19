<html>
    <head>
        <title>Azure Target Calculator</title>
    </head>

    <body>
    <form action="results.php" method="get"> 
    For how many months is your plan designed? <input type="number" id="months" name="months"><br>
    What is the minimum average spend per customer you are aiming for? <input type="number" id="acpc" name="acpc"><br>
    What is the target monthly run-rate ACR you're expecting at the end of the plan period? <input type="number" id="mrrtarget" name="mrrtarget"><br>
    What percentage of new ACR do you expect to come from customer adds? (Decimal) <input type="number" step="any" id="newbus" name="newbus"><br>
    <input type="submit">
</form>
    
</body>
</html>
