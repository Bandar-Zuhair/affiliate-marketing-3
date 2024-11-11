// Replace with your Google Apps Script Web App URL 
let webAppURL = 'https://script.google.com/macros/s/AKfycbyUj6TO0iYSLypeRreYv0u2_aJx_LgSMu4THbNGR5GaBm9z3cGdJCulBangGzb3kxVi/exec';

// Fetch data from Google Sheets Web App
async function fetchAndDisplayProducts() {
  try {
    // Fetch the data from the Web App
    let response = await fetch(webAppURL);
    let data = await response.json();

    // Get the div where the product showcases will be appended
    let productsDiv = document.getElementById('all_affiliate_links_products_div_id');

    // Group rows by the first column (Product Section Type Name)
    let groupedData = {};
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip headers
      let row = data[i];
      let productSectionType = row[0];

      // Initialize array for this product section if it doesn't exist
      if (!groupedData[productSectionType]) {
        groupedData[productSectionType] = [];
      }

      // Add row to the appropriate section group
      groupedData[productSectionType].push(row);
    }

    // Filter out empty values from uniqueProductSectionTypes
    let uniqueProductSectionTypes = Object.keys(groupedData).filter(value => value.trim() !== "");

    // Clear the content of productsDiv at the beginning to avoid duplication
    productsDiv.innerHTML = "";

    // Loop through each unique product section type and generate the HTML
    uniqueProductSectionTypes.forEach(productSectionType => {
      // Start a new HTML string for this product section
      let sectionHtml = `
        <div class="product-showcase">
          <h2 class="title">${productSectionType}</h2>
        <div class="showcase-wrapper has-scrollbar">
      `;

      // Get the rows for this product section
      let rows = groupedData[productSectionType];
      let containerHtml = ''; // To store showcase-container blocks
      let productCount = 0;    // Counter to limit 4 products per container
      let containerNumber = 1; // Counter for numbering showcase-containers
      let containerCount = Math.ceil(rows.length / 4); // Number of containers needed

      // Inside your existing forEach loop for rows
      rows.forEach((row, index) => {
        let productName = row[1];
        let productTypeName = row[2];
        let productOldCost = row[3];
        let productCurrentCost = row[4];
        let productImage = row[6];
        let productAffiliateLink = row[7];

        // Add a new showcase product HTML
        let productHtml = `
          <div class="showcase">
            <a href="${productAffiliateLink}" class="showcase-img-box">
              <img src="${productImage}" width="70" class="showcase-img">
            </a>
            <div class="showcase-content">
              <a href="${productAffiliateLink}">
                <h4 class="showcase-title">${productName}</h4>
              </a>
              <a href="${productAffiliateLink}" class="showcase-category">${productTypeName}</a>
              <div class="price-box">
                <p class="price">${productCurrentCost}</p>
                <del class="old-price">${productOldCost}</del>
              </div>
            </div>
          </div>
        `;

        // Add the product to the current container
        containerHtml += productHtml;
        productCount++;

        // If the product count reaches 4 or it's the last product, wrap the showcase-container
        if (productCount === 4 || index === rows.length - 1) {
          // Add the showcase-container with points instead of container numbers
          sectionHtml += `
            <div class="showcase-container">
              <div class="points-wrapper">
                ${Array.from({ length: containerCount }).map((_, i) => `
                  <span class="point ${i === containerNumber - 1 ? 'active' : ''}" data-index="${i}"></span>
                `).join('')}
              </div>
              ${containerHtml}
            </div>
          `;

          containerHtml = ''; // Reset for the next set of products
          productCount = 0;   // Reset product counter
          containerNumber++;  // Increment the container number
        }
      });

      // Close the showcase-wrapper and add it to productsDiv once
      sectionHtml += `
        </div> <!-- End showcase-wrapper -->
        </div> <!-- End product-showcase -->
      `;

      // Append this completed section to productsDiv
      productsDiv.innerHTML += sectionHtml;
    });

    // Apply scroll animations to dynamically created elements
    applyScrollAnimations();

    // Update social media links
    let tiktokLink = data[1][9]; // Column 10 (index 9), Row 2 (index 1)
    let youtubeLink = data[1][10]; // Column 11 (index 10), Row 2 (index 1)
    let instagramLink = data[1][11]; // Column 12 (index 11), Row 2 (index 1)

    // Update the href attributes of the social media links
    document.querySelector('a.social-link[href="#"] ion-icon[name="logo-tiktok"]').parentElement.href = tiktokLink;
    document.querySelector('a.social-link[href="#"] ion-icon[name="logo-youtube"]').parentElement.href = youtubeLink;
    document.querySelector('a.social-link[href="#"] ion-icon[name="logo-instagram"]').parentElement.href = instagramLink;

    let websiteName = data[1][13]; // Column 14 (index 13), Row 2 (index 1)
    let websiteTitle = data[1][14]; // Column 15 (index 14), Row 2 (index 1)
    let websiteImage_1 = data[1][15]; // Column 16 (index 15), Row 2 (index 1)
    let websiteImage_2 = data[1][16]; // Column 17 (index 16), Row 2 (index 1)
    let websiteImage_3 = data[1][17]; // Column 18 (index 17), Row 2 (index 1)

    // Select all elements with the class name "website_name_class"
    let websiteNameElements = document.getElementsByClassName('website_name_class');

    // Loop through each element and set its innerText to websiteName
    for (let i = 0; i < websiteNameElements.length; i++) {
      websiteNameElements[i].innerText = websiteName;
    }

    // Select all elements with the class name "website_title_class"
    let websiteTitleElements = document.getElementsByClassName('website_title_class');

    // Loop through each element and set its innerText to websiteTitle
    for (let i = 0; i < websiteTitleElements.length; i++) {
      websiteTitleElements[i].innerText = websiteTitle;
    }

    // Select all elements with the class name "banner-img"
    let images = document.getElementsByClassName('banner-img');

    // Create an array with the new image sources
    let imgSources = [websiteImage_1, websiteImage_2, websiteImage_3];

    // Loop through each image element up to the length of imgSources
    for (let i = 0; i < imgSources.length; i++) {
      if (images[i]) { // Check if the element exists to avoid errors
        images[i].src = imgSources[i]; // Set the src attribute to the corresponding image source
      }
    }

    /* Set the website tap title name as the website name */
    document.getElementById('website_tap_title_name_id').href = websiteName;

    checkWebsiteTimeout();

    // Make the body visible after loading content
    document.body.style.opacity = '1';

  } catch (error) {
    window.location.reload();
  }
}

// Function to apply scroll animations to dynamically created elements
function applyScrollAnimations() {
  // Select header, footer, .banner, and .product-showcase elements
  const animatedElements = document.querySelectorAll("header, .banner, .banner-img, .banner-subtitle, .banner-title, .banner-text, .banner-btn, .product-showcase, .title, .showcase-title, .showcase-img-box, .showcase-category, .price, .old-price");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Apply animation style
        entry.target.style.transition = "all 0.5s ease";
        entry.target.style.transform = "translateY(0)";

        // Stop observing the element after the animation plays once
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Apply initial transform to elements and observe them
  animatedElements.forEach(element => {
    element.style.transform = "translateY(100px)";
    observer.observe(element);
  });
}


// JavaScript for Scroll Animations
document.addEventListener("DOMContentLoaded", fetchAndDisplayProducts);






/* Function to dynamiclly change the points when swiping the "showcase-container" */
const showcaseContainers = document.querySelectorAll('.showcase-container');
const points = document.querySelectorAll('.point');

showcaseContainers.forEach((container, index) => {
  // You would add your swipe detection logic here
  container.addEventListener('scroll', () => {
    // Determine which container is currently in view
    points.forEach((point, pointIndex) => {
      point.classList.toggle('active', pointIndex === index);
    });
  });
});





function checkWebsiteTimeout() {
  // Get the date string from the element with id "website_time_out_date_a_id"
  let timeoutDateStr = document.getElementById('website_time_out_date_a_id').innerText;

  // Parse the date string into a usable format
  let [year, month, day] = timeoutDateStr.split('-').map(Number);
  let timeoutDate = new Date(2000 + year, month - 1, day); // Adjust for 2-digit year assumption

  // Get the current date without time
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Compare the current date with the timeout date
  if (currentDate > timeoutDate) {
    // Set body display to ''
    document.body.innerHTML = '';

    // Create an h1 element and style it
    let message = document.createElement('h1');
    message.innerText = `The Website Needs To Be Renewal\n${timeoutDateStr}`;
    message.style.width = '100%';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.textAlign = 'center';
    message.style.fontSize = '2vmax';
    message.style.color = 'red';
    message.style.backgroundColor = 'white';
    message.style.padding = '20px';
    message.style.border = '2px solid red';

    // Append the message to the body
    document.body.appendChild(message);
    document.body.style.display = ''; // Make the message visible
  }
}
