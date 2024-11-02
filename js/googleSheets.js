export const fetchMenuItems = async () => {
  const API_KEY = 'AIzaSyDOpeQfD29Fwep_1e7vSMFOXbg33EbYZEQ';
  const SPREADSHEET_ID = '1-wosdrC6RKuShONSMn9n31Ju3OwZb3Wt6A-KugwBBQk';
  const range = 'Sheet1!A2:H227';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      throw new Error('No data found in Google Sheets');
    }

    const menuItems = data.values.map(row => ({
      name: row[0],
      description: row[1],
      category: row[2],
      price: row[3],
      image: row[4],
      rating: row[5],
      votes: row[6],
      menuType: row[7],
    }));

    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const fetchCategoryMessages = async () => {
  const API_KEY = 'AIzaSyDOpeQfD29Fwep_1e7vSMFOXbg33EbYZEQ';
  const SPREADSHEET_ID = '1-wosdrC6RKuShONSMn9n31Ju3OwZb3Wt6A-KugwBBQk';
  const range = 'Sheet2!A2:B20';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      throw new Error('No data found in Google Sheets');
    }

    const categoryMessages = data.values.reduce((acc, row) => {
      acc[row[0]] = row[1];
      return acc;
    }, {});

    return categoryMessages;
  } catch (error) {
    console.error('Error fetching category messages:', error);
    return {};
  }
};
