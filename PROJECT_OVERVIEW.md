# Urban Design Studio - Interactive 3D Map Editor

## Description
The Urban Design Studio is a powerful web application designed for visualizing and manipulating urban environments in a dynamic 3D space. It provides an intuitive interface for urban planners, architects, and designers to interact with a 3D map, place various objects, and simulate design changes in real-time. This tool aims to streamline the conceptualization and iteration phases of urban development projects.

## Features
*   **Interactive Map Display**: Utilizes MapLibre GL JS to render a high-performance, dynamic 3D map, offering smooth navigation and detailed geographical context.
*   **Object Placement**: Allows users to easily add a variety of 3D objects, such as buildings, trees, street furniture, and custom geometric shapes, directly onto the map.
*   **Object Manipulation**: Provides comprehensive tools to select, delete, rotate, resize, and reposition placed 3D objects, enabling precise control over the urban layout.
*   **Layer Management**: Control visibility and properties of different map layers and custom objects.
*   **Analytics Panel**: View real-time data and metrics related to the urban design.
*   **Import/Export**: Functionality to save and load project designs.

## Technologies Used
*   **Frontend**:
    *   **React**: A declarative, component-based JavaScript library for building user interfaces.
    *   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
    *   **Vite**: A fast build tool that provides an extremely quick development experience for modern web projects.
    *   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
    *   **MapLibre GL JS**: A powerful JavaScript library for rendering interactive, customizable vector tile maps in 3D.
    *   **Zustand**: A small, fast, and scalable bearbones state-management solution.
    *   **Lucide React**: A collection of beautiful, pixel-perfect icons.
*   **Backend/Database (Conceptual)**:
    *   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, instant APIs, and real-time subscriptions. (Note: Connect to Supabase in the chat box before proceeding with database integration.)
*   **Core Web Technologies**: HTML, CSS, JavaScript.

## Usage
Once the application is running, you can interact with it as follows:

1.  **Navigate the Map**: Use your mouse to pan, zoom, and rotate the 3D map.
2.  **Add Objects**: Select an object type from the toolbar (e.g., building, tree) and click on the map to place it.
3.  **Select Objects**: Click on a placed object to select it. Selected objects will typically show bounding boxes or highlight.
4.  **Manipulate Objects**:
    *   **Move**: Drag a selected object to reposition it.
    *   **Rotate**: Use the rotation handles (if available) or specific UI controls to rotate the object.
    *   **Resize**: Use the scaling handles (if available) or specific UI controls to change the object's size.
    *   **Delete**: With an object selected, use the delete button or key to remove it from the map.
5.  **Control Layers**: Use the Layer Control panel to toggle visibility of different map layers and object categories.
6.  **View Analytics**: Open the Analytics Panel to see data related to your design.
7.  **Save/Load Designs**: Use the Import/Export panel to save your current design or load a previously saved one.

Enjoy designing your urban landscapes!
