<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Kaiju Studios Production Portal</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #050505;
            color: #f3f4f6;
            font-family: 'Inter', system-ui, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 24px;
        }
        .container {
            max-width: 600px;
            text-align: center;
            border: 1px solid #262626;
            padding: 40px;
            border-radius: 8px;
            background: rgba(18, 18, 18, 0.6);
            backdrop-filter: blur(12px);
        }
        h1 {
            font-size: 2rem;
            letter-spacing: -0.05em;
            margin: 0 0 16px 0;
            text-transform: uppercase;
            background: linear-gradient(135deg, #ffffff 30%, #a3a3a3 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            color: #a3a3a3;
            line-height: 1.6;
            font-size: 0.95rem;
            margin: 0 0 24px 0;
        }
        .badge {
            display: inline-block;
            font-family: monospace;
            font-size: 0.75rem;
            border: 1px solid #404040;
            padding: 4px 8px;
            border-radius: 4px;
            color: #d4d4d4;
            margin-bottom: 24px;
        }
        .btn {
            display: inline-block;
            background-color: #ffffff;
            color: #000000;
            text-decoration: none;
            padding: 12px 24px;
            font-weight: 500;
            font-size: 0.9rem;
            border-radius: 4px;
            transition: opacity 0.2s ease;
        }
        .btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="badge">LARAVEL 12 PRODUCTION ACTIVE</div>
        <h1>Kaiju Studios</h1>
        <p>The backend application core has been successfully configured. Rest APIs, database controllers, migrations, and media uploads are ready to serve the React application.</p>
        <a href="/goat02" class="btn">Access CMS Admin Gate</a>
    </div>
</body>
</html>
