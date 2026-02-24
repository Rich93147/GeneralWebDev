/*IC12 - COSC 2328 - Professor McCurry */
/* Implemented by: Richard Walker */

// element selection by ID
const statusBox = document.getElementById('status-box');
statusBox.textContent = 'Dom is ready! Elements successfully selected.';
console.log('Status Box:', statusBox);

//querySelector Selection
const firstCard = document.querySelector('.card');
firstCard.querySelector('p').textContent = "This card was selected using querySelector!";
console.log('First Card:', firstCard);

// Class Manipulation
firstCard.classList.add('highlight');
statusBox.classList.add('active');
console.log('First Card Classes:', firstCard.classList);
console.log('Status Box Classes:', statusBox.classList);

// Selecting Multiple Elements
const listItems = document.querySelectorAll('.list-item');
console.log('Number of list items:', listItems.length);

listItems.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, item.textContent);
});

const secondCard = document.querySelector('#card-2');
secondCard.querySelector('p').textContent = 'Use textContent to prevent XSS vulnerabilities!';

const thirdCard = document.querySelector('#card-3');
thirdCard.classList.toggle('hidden');
console.log('Third card hidden?', thirdCard.classList.contains('hidden'));

// Removing Classes
secondCard.classList.remove('card');
console.log('Second card classes after removal:', secondCard.classList);