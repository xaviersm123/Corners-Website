export const fetchMenuItems = async () => {
  const API_KEY = 'AIzaSyDOpeQfD29Fwep_1e7vSMFOXbg33EbYZEQ'; // Replace with your Google Sheets API key
  const SPREADSHEET_ID = '1-wosdrC6RKuShONSMn9n31Ju3OwZb3Wt6A-KugwBBQk'; // Replace with your Google Sheets spreadsheet ID
  const range = 'Sheet1!A2:G227'; // The range you want to fetch (adjust if needed)

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      throw new Error('No data found in Google Sheets');
    }

    // Mapping the rows to the menu structure
    const menuItems = data.values.map(row => ({
      name: row[0], // The first column is the name
      description: row[1], // The second column is the description
      category: row[2], // The third column is the category
      price: row[3], // The fourth column is the price
      image: row[4], // The fifth column is the image URL
      rating: row[5], // The sixth column is the rating
      votes: row[6], // The seventh column is the number of votes
    }));

    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};
