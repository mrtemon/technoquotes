document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const newQuoteBtn = document.getElementById('newQuote');
    const shareQuoteBtn = document.getElementById('shareQuote');
    const themeToggle = document.getElementById('themeToggle');
    const categoryBtns = document.querySelectorAll('.category-btn');

    let currentCategory = 'all';
    let currentQuote = null;
    let quoteTimer = null;

    // Функция для получения случайной цитаты
    function getRandomQuote() {
        let filteredQuotes = quotes;
        if (currentCategory !== 'all') {
            filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
        }
        return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    }

    // Функция для отображения цитаты
    function displayQuote() {
        if (!currentQuote) {
            currentQuote = getRandomQuote();
        }

        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';

        setTimeout(() => {
            quoteText.textContent = currentQuote.text;
            quoteAuthor.textContent = currentQuote.author;
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 300);
    }

    // Функция для шаринга
    function shareQuote() {
        if (!currentQuote) return;

        const text = `${currentQuote.text} - ${currentQuote.author}`;
        const shareData = {
            title: 'ТехноЦитаты',
            text: text,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .catch(error => console.log('Ошибка при шаринге:', error));
        } else {
            // Fallback для браузеров без поддержки Web Share API
            const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}`;
            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
            
            window.open(vkUrl, '_blank');
            window.open(telegramUrl, '_blank');
        }
    }

    // Функция для переключения темы
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    }

    // Функция для смены категории
    function changeCategory(category) {
        currentCategory = category;
        categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        currentQuote = null;
        displayQuote();
    }

    // Обработчики событий
    const newQuoteCta = document.getElementById('newQuoteCta');
    if (newQuoteCta) {
        newQuoteCta.addEventListener('click', (e) => {
            e.preventDefault();
            currentQuote = null;
            displayQuote();
            resetTimer();
        });
    }

    shareQuoteBtn.addEventListener('click', shareQuote);
    themeToggle.addEventListener('click', toggleTheme);

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeCategory(btn.dataset.category);
        });
    });

    // Функция для сброса таймера
    function resetTimer() {
        if (quoteTimer) {
            clearInterval(quoteTimer);
        }
        quoteTimer = setInterval(displayQuote, 10000);
    }

    // Факт дня
    const factBlock = document.getElementById('factBlock');
    if (factBlock && typeof facts !== 'undefined') {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        factBlock.textContent = randomFact;
    }

    // Копирование цитаты
    const copyQuoteBtn = document.getElementById('copyQuoteBtn');
    if (copyQuoteBtn) {
        copyQuoteBtn.addEventListener('click', () => {
            if (currentQuote) {
                const text = `"${currentQuote.text}" — ${currentQuote.author}`;
                navigator.clipboard.writeText(text).then(() => {
                    copyQuoteBtn.textContent = 'Скопировано!';
                    setTimeout(() => {
                        copyQuoteBtn.textContent = 'Скопировать';
                    }, 1200);
                });
            }
        });
    }

    // Инициализация
    displayQuote();
    resetTimer();
}); 