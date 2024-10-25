import { fetchMenuItems } from './googleSheets.js'; // Import the function to fetch data

document.addEventListener('DOMContentLoaded', async function () {
    const menuItemsContainer = document.getElementById('menu-items-container');
    const menuCategoryTitle = document.getElementById('menu-category-title'); // Select the category title element

    // Fetch menu items from Google Sheets
    const menuItems = await fetchMenuItems();

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

    // Populate the menu items
    if (menuItems && menuItems.length > 0) {
        menuItems.forEach(item => {
            menuItemsContainer.innerHTML += generateMenuItemHTML(item);
        });
    } else {
        menuItemsContainer.innerHTML = '<p>No menu items available at the moment.</p>';
    }

    // Add additional functionality for filtering and viewing details

    // Filter menu items by category
    const categoryButtons = document.querySelectorAll('.category-button');
    const menuItemsNodeList = document.querySelectorAll('.menu-item');

    // Event listener for category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Get the selected category ID
            const category = button.getAttribute('data-category');

            // Filter menu items
            const filteredItems = menuItems.filter(item => category === 'all' || item.category === category);

            // Clear current menu items and populate filtered items
            menuItemsContainer.innerHTML = '';
            filteredItems.forEach(item => {
                menuItemsContainer.innerHTML += generateMenuItemHTML(item);
            });

            // Update the category title based on the selected category
            menuCategoryTitle.textContent = button.textContent;

            // Reassign event listeners for the new menu items (View Details links)
            attachPopupEvents();
        });
    });

    // Attach popup events for viewing menu details
    const attachPopupEvents = () => {
        const viewDetailLinks = document.querySelectorAll('.view-detail');

        viewDetailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const itemName = e.target.getAttribute('data-item');
                const itemData = menuItems.find(item => item.name.toLowerCase().replace(/\s/g, '-') === itemName);

                if (itemData) {
                    popupImage.src = itemData.image;
                    popupTitle.textContent = itemData.name;
                    popupDescription.textContent = itemData.description;

                    popup.classList.remove('hidden');
                }
            });
        });
    };

    attachPopupEvents(); // Attach popup events initially

    // Popup variables
    const popup = document.getElementById('popup');
    const closeButton = document.querySelector('.close-button');
    const popupImage = document.querySelector('.popup-image');
    const popupTitle = document.querySelector('.popup-title');
    const popupDescription = document.querySelector('.popup-description');

    // Close popup
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Close button clicked'); // Debugging line
        popup.classList.add('hidden');
        console.log('Popup classList:', popup.classList); // Debugging line to check if the class is applied
    });

    // Close popup when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            console.log('Popup background clicked'); // Debugging line
            popup.classList.add('hidden');
        }
    });

    // Make category buttons wrapper fixed after scrolling past it
    const categoryWrapper = document.querySelector('.category-buttons-wrapper');
    if (categoryWrapper) {
        const offsetTop = categoryWrapper.offsetTop;

        window.addEventListener('scroll', function () {
            if (window.scrollY > offsetTop) {
                categoryWrapper.classList.add('fixed');
            } else {
                categoryWrapper.classList.remove('fixed');
            }
        });
    } else {
        console.error('Category buttons wrapper not found!');
    }

    // Toggle mobile navigation menu
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNav = document.getElementById('mobile-nav');

    mobileMenu.addEventListener('click', () => {
        console.log('Burger menu clicked'); // Debugging line
        mobileNav.classList.toggle('hidden');
    });
});
