<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="manifest" href="{{ asset('public/manifest.json') }}">
    {{--        <link href="{{ asset('scss.scss') }}" rel="stylesheet">--}}
    <title>کارگزار من</title>
    @laravelPWA
</head>
<body>
@csrf
<div id="app" ></div>

@viteReactRefresh
@vite(['resources/js/main.jsx'])

</body>
</html>
