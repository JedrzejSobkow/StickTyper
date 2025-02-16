# StickTyper

StickTyper is an interactive typing game aimed at improving typing speed and accuracy. The game provides a set of words to type, and the player needs to type them as fast as possible without making mistakes. The game keeps track of typing events, manages word queues, and provides an efficient way to handle game logic.

## Features

- **Typing Challenge**: Words are presented to the player, who must type them as quickly as possible.
- **Word Queue System**: Words are displayed in sequence, and the game dynamically manages the queue to ensure smooth gameplay.
- **Real-time Feedback**: The player receives instant feedback, both visually (hearts) and through text input.
- **Responsive UI**: The interface is responsive and adapts to different screen sizes for mobile and desktop users.
- **Docker Support**: The project can be easily run in a Docker container for consistent setup and deployment.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/StickTyper.git
   cd StickTyper

2. Set up and run docker:

   ```bash
   docker-compose up --build

## File Structure:

StickTyper
├── README.md                                 # Project description and instructions
├── assets                                    # Image and asset files
│   ├── heart_empty.png                       # Heart icon for the empty state
│   └── heart_full.png                        # Heart icon for the full state
├── config                                    # Configuration files for Docker setup
│   └── docker_preparation.txt                # Guide for preparing Docker setup
└── src
    ├── css
    │   └── main.css                          # Styling for the web application
    ├── docker
    │   ├── docker-compose.yml                # Docker Compose configuration file
    │   └── dockerfile                        # Dockerfile for container setup
    ├── html
    │   ├── index.html                        # Main HTML file for the game interface
    │   └── test.html                         # Test HTML file (optional, for testing purposes)
    └── js
        ├── divided_word.js                   # JavaScript handling word division
        ├── life.js                           # JavaScript handling the heart life animation
        ├── main.js                           # Core JavaScript for game logic
        ├── one_direction_fun_collection.js    # Helper functions for managing word sequences
        ├── queue.js                          # JavaScript for managing the word queue
        └── typing.js                         # JavaScript for handling typing events and user input



