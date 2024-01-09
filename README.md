# DollarHub

DollarHub is a mobile application built using React Native that helps users manage their financial data by allowing them to track their assets, liabilities, fixed expenses, and overall net worth. The app provides a user-friendly interface to input and visualize financial data, offering insights into various financial categories.

## Features

- **Dashboard:** View an overview of your financial status, including total assets, liabilities, fixed expenses, and net worth. The dashboard also displays a greeting based on the time of day.

- **Detailed Views:** Navigate to detailed views for assets, liabilities, fixed expenses, and net worth. Each category provides a breakdown of relevant information.

- **Insert Form:** Add new financial entries with details such as category, description, and amount. Choose from predefined categories or create a custom category.

## Getting Started

To run the DollarHub app locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/DollarHub.git
    cd DollarHub
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

4. Use a mobile emulator or scan the QR code with the Expo Go app to run the app on your mobile device.

## Dependencies

DollarHub relies on the following libraries and tools:

- **React Native:** A JavaScript framework for building mobile applications.

- **AsyncStorage:** A local storage library for persisting user data.

- **Lottie React Native:** An animation library for React Native, used for loading animations.

- **React Navigation:** A navigation library for React Native applications.

- **@react-native-async-storage/async-storage:** An asynchronous storage library for React Native.

- **@expo/vector-icons:** A library providing a set of customizable vector icons.

## Code Structure

The code is organized into several components and screens:

- **Home:** The main dashboard screen displaying an overview of financial data.

- **Details:** Screen for detailed views of financial categories.

- **InsertForm:** Screen for inserting new financial entries.

- **Chart:** Component for rendering charts on the dashboard.

- **DataPicker:** Component for selecting dates.

- **ModalCategory:** Component for selecting or creating categories.

## Contributing

Contributions to DollarHub are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

DollarHub is licensed under the MIT License.
