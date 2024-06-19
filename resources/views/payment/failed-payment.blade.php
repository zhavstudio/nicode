<html>
<style>
    body {
        text-align: center;
        padding: 40px 0;
        background: #EBF0F5;
    }
    h1 {
        color: #dc3545;
        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
        font-weight: 900;
        font-size: 40px;
        margin-bottom: 10px;
    }
    p {
        color: #404F5E;
        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
        font-size:20px;
        margin: 0;
    }
    i {
        color: #dc3545;
        font-size: 100px;
        line-height: 200px;
        margin-left:-15px;
    }
    .card {
        background: white;
        padding: 60px;
        border-radius: 4px;
        box-shadow: 0 2px 3px #C8D0D8;
        display: inline-block;
        margin: 0 auto;
    }
    .button-33 {
        margin-top: 30px;
        background-color: #d95260;
        border-radius: 100px;
        box-shadow: rgb(220, 53, 69) 0 -25px 18px -14px inset, rgb(220, 53, 69) 0 1px 2px, rgb(220, 53, 69) 0 2px 4px, rgb(220, 53, 69) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
        color: #e7e7e7;
        cursor: pointer;
        display: inline-block;
        font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
        padding: 7px 20px;
        text-align: center;
        text-decoration: none;
        transition: all 250ms;
        border: 0;
        font-size: 16px;
        user-select: none;
        -webkit-user-select: none;
            touch-action: manipulation;
    }

    .button-33:hover {
        box-shadow: rgb(220, 53, 69) 0 -25px 18px -14px inset, rgb(220, 53, 69) 0 1px 2px, rgb(220, 53, 69) 0 2px 4px, rgb(220, 53, 69) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
        transform: scale(1.05) rotate(-1deg);
    }
</style>
<body>
<div class="card">
    <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
        <img style="margin-top: 65px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVR4nO3bTU7DMBCG4eyBcyCxQPVFWMU7NnAJlrDkViyAW+EMMuKnqtrUsWe++UI9EruqyfsklMguw9CnT58+lSNhvJOreD44TT52PgeXg6cQn6YQJYX4Lpc3F+jjy/XtWQrx5escNuOzS/z0/YNG2I7/PQcUQtqJRyPsi4chpAPxKIS5eHOEdCTeGqEk3gwhFcZbISyJV0dIC+O1EWri1RBSZbwWQkt8M0JqjG9F0IivRkhK8bUImvGLESTEe80D/51AfC15bM6vya+1OIfc5qI/Fd4Jtsce34rvQnFAoIn3QKCLRyLQxiM+lPL7Wr632lqFGF4l2iu/VgST+LUgmMazI0DiWRGg8WwILvEsCK7x3ggU8V4IVPFoBMp4FAJ1PAbAZxuO7FeAEEHgH4JECOL2Z5AAQdwfhBwRhOZR2AFBSOJdEIQsHoogpPEQBCGPN0WQlcSbIMgpL4sLYNPCcy9ydpA7NnQI4rBdRYMgjnt1FAhy6l+QyCMhPiCvPOJO+NiMj6XHV0WoXcbSRFgcr4XQuoangVAd34qgtYDZgtAcX4ugvXpbg6AWvxTBaul6CYJ6fCmC9bp9CYJZ/DEE1KbFHIJ5/CEE9I7NPgRY/C6C13bVNgI8/mdO+t/m+vTpM/yH+QRRnQ7doEYZOgAAAABJRU5ErkJggg==">
    </div>
    <h1>{{$message}}</h1>

    <a class="button-33" href="{{env('VITE_APP_URL')}}" id="timerButton">انتقال به پنل تا 10 ثانیه</a>
</div>
<script>
    // Get the button element
    const timerButton = document.getElementById('timerButton');

    // Set the redirect URL
    const redirectUrl = '{{env('VITE_APP_URL')}}';

    // Set the countdown duration in seconds
    const countdownDuration = 10;

    // Set a timer variable
    let timer;

    // Function to redirect the user
    function redirect() {
        window.location.href = redirectUrl;
    }

    // Function to update the button text with the countdown
    function updateButtonText() {
        const remainingSeconds = Math.ceil((endTime - new Date().getTime()) / 1000);
        timerButton.textContent = ` انتقال به پنل تا${remainingSeconds}ثانیه`;

        if (remainingSeconds === 0) {
            redirect();
        }
    }

    // Calculate the end time for the countdown
    const endTime = new Date().getTime() + countdownDuration * 1000;

    // Update the button text every second
    timer = setInterval(updateButtonText, 1000);
</script>
</body>
</html>
