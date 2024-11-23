// Optional: Implement fade-in effect on scroll
const features = document.querySelectorAll('.feature');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    features.forEach(feature => {
        const offsetTop = feature.offsetTop;
        if (scrollY > offsetTop - window.innerHeight / 1.3) {
            feature.style.opacity = 1;
            feature.style.transform = 'translateY(0)';
        }
    });
});

// Initial fade-in setup
features.forEach(feature => {
    feature.style.opacity = 0;
    feature.style.transform = 'translateY(50px)';
    feature.style.transition = 'opacity 0.8s, transform 0.8s';
});

document.addEventListener('DOMContentLoaded', () => {
    fetchItems(); // Fetch the first page of items on load
  });
  
  // Fetch and display items
  function fetchItems(page = 1, limit = 10) {
    fetch(`/api/items?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; // Clear existing content
  
        // Display items in the gallery
        data.items.forEach((item, index) => {
          const itemElement = document.createElement('div');
          itemElement.classList.add('item');
  
          // Add video player if the item is a video
          if (!item.isDirectory && /\.(mp4|MP4|webm|ogg|mov)$/.test(item.name)) {
            const videoElement = document.createElement('video');
            videoElement.src = `/uploads/${item.name}`;
            videoElement.controls = true;
            videoElement.width = 300;
            itemElement.appendChild(videoElement);
          }
  
          // Add video details (name, size, creation date)
          const details = document.createElement('div');
          details.innerHTML = `
            <p>Name: ${item.name}</p>
            <p>Size: ${(item.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Created: ${new Date(item.createdAt).toLocaleString()}</p>
          `;
          itemElement.appendChild(details);
  
          // Append the item to the gallery
          gallery.appendChild(itemElement);
  
          // Apply fade-in effect
          setTimeout(() => {
            itemElement.style.opacity = 1;
            itemElement.style.transform = 'translateY(0)';
          }, index * 100); // Stagger animation for each item
        });
  
        // Update pagination info
        const paginationInfo = document.getElementById('pagination-info');
        paginationInfo.textContent = `Page ${data.currentPage} of ${data.totalPages}`;
        paginationInfo.dataset.currentPage = data.currentPage;
      })
      .catch((error) => console.error('Error fetching items:', error));
  }
  
  // Event listener for pagination
  document.getElementById('prev-page').addEventListener('click', () => {
    const currentPage = parseInt(document.getElementById('pagination-info').dataset.currentPage, 10) || 1;
    if (currentPage > 1) fetchItems(currentPage - 1);
  });
  
  document.getElementById('next-page').addEventListener('click', () => {
    const currentPage = parseInt(document.getElementById('pagination-info').dataset.currentPage, 10) || 1;
    fetchItems(currentPage + 1);
  });
  