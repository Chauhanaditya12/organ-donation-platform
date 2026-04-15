// public/script.js
// This script handles the user interaction on the eligibility form.

document.addEventListener('DOMContentLoaded', () => {
    // Function to display a random organ-related fact
    const displayRandomFact = () => {
        const facts = [
            "The human heart beats about 100,000 times a day.",
            "Your liver can regenerate itself from as little as 25% of its original mass.",
            "The cornea is one of the only parts of the body with no blood supply; it gets its oxygen directly from the air.",
            "A single kidney has about one million individual filters.",
            "The small intestine is about 22 feet long.",
            "Your lungs contain over 300 million tiny air sacs called alveoli.",
            "An adult's skin spans 21 square feet, weighs 9 lbs, and contains more than 11 miles of blood vessels.",
            "The pancreas produces insulin, a hormone that regulates blood sugar.",
            "On average, a person can donate one kidney, a lung, or a portion of the liver, pancreas, or intestine.",
            "There are over 100,000 people on the organ transplant waiting list in the United States."
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        document.getElementById('random-fact').textContent = `Did you know? ${randomFact}`;
    };

    // Display a random fact when the page loads
    displayRandomFact();

    // Counter for "One organ donor can save up to 8 lives"
    const counterElement = document.getElementById("livesSavedCounter");
    if (counterElement) {
        let count = 0;
        const targetCount = 8;
        const duration = 1000; // 1 second for the animation
        const intervalTime = duration / targetCount;

        function updateCounter() {
            if (count <= targetCount) {
                counterElement.textContent = count;
                count++;
                setTimeout(updateCounter, intervalTime);
            }
        }

        updateCounter();
    }
});
