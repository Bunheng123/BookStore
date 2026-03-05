<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'app/Config/DatabaseConnection.php';

// Get books from database
$db = new \App\Config\DatabaseConnection();
$conn = $db->connect();

try {
    $query = "SELECT id, title, author, price, cover_image FROM books LIMIT 12";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $books = [];
    $error = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Carousel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #1a1209 0%, #2d2416 100%);
            font-family: 'Georgia', serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container {
            max-width: 90%;
            width: 100%;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            color: #f5f0e8;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            color: #d4af5f;
        }

        .header p {
            font-size: 1rem;
            color: #c8b99a;
            font-style: italic;
        }

        .carousel-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .carousel-container {
            flex: 1;
            overflow: hidden;
            border-radius: 8px;
        }

        .carousel {
            display: flex;
            gap: 20px;
            overflow-x: auto;
            scroll-behavior: smooth;
            padding: 20px 0;
            scrollbar-width: none;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .carousel::-webkit-scrollbar {
            display: none;
        }

        .book-item {
            flex-shrink: 0;
            width: 160px;
            background: #f5f0e8;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .book-item:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 20px rgba(212, 175, 95, 0.4);
        }

        .book-cover {
            width: 100%;
            height: 220px;
            background: linear-gradient(135deg, #c8b99a, #8a7560);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: #f5f0e8;
            overflow: hidden;
        }

        .book-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .book-info {
            padding: 12px;
            background: #f5f0e8;
        }

        .book-title {
            font-size: 0.85rem;
            font-weight: bold;
            color: #1a1209;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .book-author {
            font-size: 0.75rem;
            color: #8a7560;
            margin-bottom: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .book-price {
            font-size: 0.9rem;
            font-weight: bold;
            color: #d4af5f;
        }

        .arrow {
            background: #d4af5f;
            color: #1a1209;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        .arrow:hover {
            background: #c9a34a;
            transform: scale(1.1);
        }

        .arrow:active {
            transform: scale(0.95);
        }

        .arrow.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .scroll-indicator {
            text-align: center;
            margin-top: 20px;
            color: #c8b99a;
            font-size: 0.9rem;
        }

        .error {
            color: #d4675e;
            background: rgba(212, 103, 94, 0.1);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }

        .empty {
            text-align: center;
            color: #c8b99a;
            padding: 40px;
            font-style: italic;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>📚 Book Carousel</h1>
        <p>Scroll through our collection</p>
    </div>

    <?php if (isset($error)): ?>
        <div class="error">
            ❌ Error loading books: <?php echo htmlspecialchars($error); ?>
        </div>
    <?php elseif (empty($books)): ?>
        <div class="empty">
            No books available at the moment.
        </div>
    <?php else: ?>
        <div class="carousel-wrapper">
            <button class="arrow" id="scrollLeft" onclick="scrollCarousel('left')">❮</button>

            <div class="carousel-container">
                <div class="carousel" id="carousel">
                    <?php foreach ($books as $book): ?>
                        <div class="book-item">
                            <div class="book-cover">
                                <?php if ($book['cover_image']): ?>
                                    <img src="<?php echo htmlspecialchars($book['cover_image']); ?>" alt="<?php echo htmlspecialchars($book['title']); ?>">
                                <?php else: ?>
                                    📖
                                <?php endif; ?>
                            </div>
                            <div class="book-info">
                                <div class="book-title"><?php echo htmlspecialchars($book['title']); ?></div>
                                <div class="book-author"><?php echo htmlspecialchars($book['author']); ?></div>
                                <div class="book-price">$<?php echo number_format($book['price'], 2); ?></div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <button class="arrow" id="scrollRight" onclick="scrollCarousel('right')">❯</button>
        </div>

        <div class="scroll-indicator">
            💡 Use arrow buttons or scroll with your mouse to browse books
        </div>
    <?php endif; ?>
</div>

<script>
    const carousel = document.getElementById('carousel');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    function scrollCarousel(direction) {
        const scrollAmount = 340; // Book width + gap

        if (direction === 'left') {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else if (direction === 'right') {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    // Update button states
    function updateButtonStates() {
        if (carousel) {
            const isAtStart = carousel.scrollLeft <= 0;
            const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;

            if (scrollLeftBtn) {
                scrollLeftBtn.classList.toggle('disabled', isAtStart);
            }
            if (scrollRightBtn) {
                scrollRightBtn.classList.toggle('disabled', isAtEnd);
            }
        }
    }

    // Listen for scroll events
    if (carousel) {
        carousel.addEventListener('scroll', updateButtonStates);
        updateButtonStates();
    }

    // Allow keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') scrollCarousel('left');
        if (e.key === 'ArrowRight') scrollCarousel('right');
    });
</script>

</body>
</html>
