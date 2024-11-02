import { fetchMenuItems, fetchCategoryMessages } from './googleSheets.js'; // Import the function to fetch data

document.addEventListener('DOMContentLoaded', async function () {
    // Select DOM elements
    const menuItemsContainer = document.getElementById('menu-items-container');
    const menuCategoryTitle = document.getElementById('menu-category-title'); // Category title element
    const categoryMessage = document.getElementById('category-message'); // Ensure this ID matches the HTML element
    const categoryButtonsWrapper = document.querySelector('.category-buttons-wrapper');
    const categoryButtonsContainer = document.getElementById('category-buttons'); // Container for category buttons

    // Buttons to switch between Food Menu and Drinks Menu
    const foodMenuButton = document.querySelector('.food-button');
    const drinksMenuButton = document.querySelector('.drinks-button');

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');

    // Fetch menu items from Google Sheets
    const menuItems = await fetchMenuItems();
    const categoryMessages = await fetchCategoryMessages();


    // Arrays to store category data for Food Menu and Drinks Menu
    const foodCategories = [
        { id: 'all', dataCategory: 'all', text: 'FULL FOOD MENU' },
        { id: 'starting-lineup', dataCategory: 'starting-lineup', text: 'THE STARTING LINEUP' },
        { id: 'game-day-wings', dataCategory: 'game-day-wings', text: 'GAME DAY WINGS' },
        { id: 'field-of-greens', dataCategory: 'field-of-greens', text: 'FIELD OF GREENS' },
        { id: 'from-the-sea', dataCategory: 'from-the-sea', text: 'FROM THE SEA' },
        { id: 'smash-burgers', dataCategory: 'smash-burgers', text: 'SMASH BURGERS' },
        { id: 'sandwich-all-stars', dataCategory: 'sandwich-all-stars', text: 'SANDWICH ALL-STARS' },
        { id: 'main-events', dataCategory: 'main-events', text: 'THE MAIN EVENTS' },
        { id: 'sides-3', dataCategory: 'sides-3', text: 'SIDES $3' },
        { id: 'premo-sides-5', dataCategory: 'premo-sides-5', text: 'PREMO SIDES $5' },
        { id: 'kids-menu', dataCategory: 'kids-menu', text: 'KIDS MENU' },
        { id: 'dessert', dataCategory: 'dessert', text: 'DESSERT' },
    ];

    const drinksCategories = [
        { id: 'all', dataCategory: 'all', text: 'FULL DRINKS MENU' },
        { id: 'cocktails', dataCategory: 'cocktails', text: 'COCKTAILS' },
        { id: 'draft-beer', dataCategory: 'draft-beer', text: 'DRAFT BEER' },
        { id: 'bottle-can-beer', dataCategory: 'bottle-can-beer', text: 'BOTTLE/CAN BEER' },
    ];

    // Variables to keep track of the current menu type and categories
    let currentCategories = foodCategories; // Default to food categories
    let currentMenu = 'food'; // Keep track of current menu type

    // Function to generate HTML for each menu item
    const generateMenuItemHTML = (item) => {
        return `
            <div class="menu-item" data-category="${item.category}">
                <img src="${item.image}" alt="${item.name}" class="menu-item-image">
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <a href="#" class="view-detail" data-item="${item.name.toLowerCase().replace(/\s/g, '-')}">View Detail</a>
                    <div class="menu-item-footer">
                        <span class="price">$${item.price}</span>
                    </div>
                </div>
            </div>
        `;
    };

    // Function to generate category buttons dynamically
    const generateCategoryButtons = () => {
        categoryButtonsContainer.innerHTML = ''; // Clear existing buttons

        currentCategories.forEach(category => {
            const button = document.createElement('button');
            button.id = category.id;
            button.classList.add('category-button');
            if (category.id === 'all' || category.id === 'all') {
                button.classList.add('active'); // Set default active button
            }
            button.setAttribute('data-category', category.dataCategory);
            button.textContent = category.text;
            categoryButtonsContainer.appendChild(button);
        });

        attachCategoryButtonEvents(); // Attach events to the new buttons
    };

    // Function to populate menu items based on the selected category
    const populateMenuItems = (category = 'all') => {
        // Filter menu items based on current menu type
        const filteredMenuItems = menuItems.filter(item => {
            return item.menuType === currentMenu; // Check if item belongs to current menu
        });

        // Further filter by category
        const itemsToDisplay = filteredMenuItems.filter(item => category === 'all' || item.category === category);

        // Clear existing items
        menuItemsContainer.innerHTML = '';

        // Populate items
        if (itemsToDisplay && itemsToDisplay.length > 0) {
            itemsToDisplay.forEach(item => {
                menuItemsContainer.innerHTML += generateMenuItemHTML(item);
            });
        } else {
            menuItemsContainer.innerHTML = '<p>No menu items available at the moment.</p>';
        }

        // Display category message if available
        const message = categoryMessages[category];
        if (message) {
            categoryMessage.textContent = message;
            categoryMessage.classList.remove('hidden');
        } else {
            categoryMessage.classList.add('hidden');
        }

        attachPopupEvents(); // Reattach popup events for the new items
    };

    // Attach events to category buttons
    const attachCategoryButtonEvents = () => {
        const categoryButtons = document.querySelectorAll('.category-button');

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and add to clicked button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Get the selected category ID
                const category = button.getAttribute('data-category');

                // Update the category title based on the selected category
                menuCategoryTitle.textContent = button.textContent;

                // Populate menu items based on selected category
                populateMenuItems(category);
            });
        });
    };

    // Attach popup events for viewing menu details
    const attachPopupEvents = () => {
        const viewDetailLinks = document.querySelectorAll('.view-detail');

        viewDetailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const itemName = e.target.getAttribute('data-item');
                const itemData = menuItems.find(item => item.name.toLowerCase().replace(/\s/g, '-') === itemName);

                if (itemData) {
                    // Populate popup content with item data
                    popupImage.src = itemData.image;
                    popupTitle.textContent = itemData.name;
                    popupDescription.textContent = itemData.description;

                    popup.classList.remove('hidden');
                }
            });
        });
    };

    // Popup variables
    const popup = document.getElementById('popup');
    const closeButton = document.querySelector('.close-button');
    const popupImage = document.querySelector('.popup-image');
    const popupTitle = document.querySelector('.popup-title');
    const popupDescription = document.querySelector('.popup-description');

    // Close popup when close button is clicked
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        popup.classList.add('hidden');
    });

    // Close popup when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.add('hidden');
        }
    });

    // Make category buttons wrapper fixed after scrolling past it
    if (categoryButtonsWrapper) {
        const offsetTop = categoryButtonsWrapper.offsetTop;

        window.addEventListener('scroll', function () {
            if (window.scrollY > offsetTop) {
                categoryButtonsWrapper.classList.add('fixed');
            } else {
                categoryButtonsWrapper.classList.remove('fixed');
            }
        });
    } else {
        console.error('Category buttons wrapper not found!');
    }

    // Toggle mobile navigation menu
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNav = document.getElementById('mobile-nav');

    console.log('mobileMenu:', mobileMenu);
    console.log('mobileNav:', mobileNav);

    if (mobileMenu && mobileNav) {
        mobileMenu.addEventListener('click', () => {
            console.log('Mobile menu clicked');
            mobileNav.classList.toggle('active');
            console.log('mobileNav classes:', mobileNav.classList);
        });
    } else {
        console.error('Mobile menu or navigation not found');
    }

    // Initialize the menu by generating categories and populating items
    const initializeMenu = () => {
        generateCategoryButtons(); // Generate category buttons based on current menu
        populateMenuItems(); // Populate menu items
    };

    // Event listeners for menu type buttons
    foodMenuButton.addEventListener('click', () => {
        currentMenu = 'food'; // Set current menu to 'food'
        currentCategories = foodCategories; // Update current categories
        menuCategoryTitle.textContent = 'FULL FOOD MENU'; // Reset category title
        initializeMenu(); // Reinitialize the menu
    });

    drinksMenuButton.addEventListener('click', () => {
        currentMenu = 'drinks'; // Set current menu to 'drinks'
        currentCategories = drinksCategories; // Update current categories
        menuCategoryTitle.textContent = 'FULL DRINKS MENU'; // Set default category title for drinks
        initializeMenu(); // Reinitialize the menu
    });

    // Initialize the page with food menu by default
    initializeMenu();

    // Code for making category buttons scrollable (optional)
    const categoryButtons = document.querySelector('.category-buttons');

    let isDown = false;
    let startX;
    let scrollLeft;

    categoryButtons.addEventListener('mousedown', (e) => {
        isDown = true;
        categoryButtons.classList.add('active');
        startX = e.pageX - categoryButtons.offsetLeft;
        scrollLeft = categoryButtons.scrollLeft;
    });

    categoryButtons.addEventListener('mouseleave', () => {
        isDown = false;
        categoryButtons.classList.remove('active');
    });

    categoryButtons.addEventListener('mouseup', () => {
        isDown = false;
        categoryButtons.classList.remove('active');
    });

    categoryButtons.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Stop the function from running if not clicking
        e.preventDefault();
        const x = e.pageX - categoryButtons.offsetLeft;
        const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
        categoryButtons.scrollLeft = scrollLeft - walk;
    });

    // Back to Top Button Functionality

    // Show or hide the button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show after scrolling 300px
            backToTopButton.classList.remove('hidden');
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
            backToTopButton.classList.add('hidden');
        }
    });

    // Smooth scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
