# Fire-Free

This is a mobile application for helping the **firefighters** to rescue the victims on time. It has two parts: hardware and software. The hardware part will be sold by the firefighters to the users and registered the mac address along with user details through this application. So whenever there are gas leakage or set fire in any houses then instantly the notification will come to all the firefighters whoever has this application and then they can take necessary actions, if the incident has been solved by the fire service then they can set the incident as solved.
Its notification has the coordinate of the registered user's house which was instantly sent by the hardware part.
The hardware part has the capability to send coordinates and the **MQ-2** sensor data to the central fire service database. Even it can play alarm locally in the house.

#### Objectives

- Software
  - Has account for every firefighter who has smartphones.
  - Can sell fire-free hardware from the application.
  - Show all the solved and unsolved notifications from the hardware part.
  - Can show the victim's house on **google map** and routes from fire service office to the victim.
  - Can download the user's current hardware data as **.pdf** from the application.
  - Can show the info of the firefighters whoever served customers or sold hardware to the customer.
  - Firefighters can edit their profile.
- Hardware
  - It can send **MQ-2** sensor's data.
  - **GPS** data like **date**, **time**, **latitude**, **longitude**, **altitude**.
  - Can send fire-free hardware's mac-address.
  - It has to be **PCB** compact circuit not exactly like production build but similar.

#### Technical Challenges

- Combine hardware and software(mobile application) with each other and build an **IoT** solution.
- Make an **API** which will be the middleware between hardware, software and database.
- Build a complete library with **C++** for the whole PCB.
- Make all the password related works encrypted.
- Design **NoSQL** schemas for every database for **mongodb** and connect them with mac-address as primary key.

#### Disadvantages

- PCB is **handmade** so it won't be suitable for production purpose.
- Registration and Login page are not that much good.

### Software

#### Installation and Run

- [Frontend](https://github.com/rjarman/House-Rent/tree/master/frontend)

  - To **install** run:

    ```
    npm install
    ```

  - To run on **development** mode _(it will run in http://localhost:4200 by default)_:

    ```
    npm run start
    ```

  - To build on **production** mode _(it will run in http://localhost:4200 by default)_:
    ```
    npm run build
    ```

- [Backend](https://github.com/rjarman/House-Rent/tree/master/backend)

  - To **install** run:

    ```
    npm install
    ```

  - Rename [.env-example](https://github.com/rjarman/House-Rent/blob/master/backend/.env-example) to .env

  - Edit the **DATABASE_URL** and **Database Name**, **collections name** variables of **_.env-example_** as your choices.

  - To run **development server** _(it will run in http://localhost:3000 by default)_:

    ```
    npm run dev:server
    ```

  - To run **server** _(it will run in http://localhost:3000 by default)_:
    ```
    npm run server
    ```
    <u>**N.B. you have to install mongodb and configure mongodb database as mentioned in \***[.env-example](https://github.com/rjarman/House-Rent/blob/master/backend/.env-example)**\* file.**</u>

#### Screenshots

![photo no 1](https://drive.google.com/uc?export=view&id=1pbgIKNgbYVgpsvdFdtn769oEDlNAkZbR)
![photo no 2](https://drive.google.com/uc?export=view&id=162Hspvhq_9EBN3wplO0Z4yF6D__-A02f)
![photo no 3](https://drive.google.com/uc?export=view&id=1OCgfWxh4v_u4pzIZuYh0QbiqNUBt_08_)
![photo no 4](https://drive.google.com/uc?export=view&id=1xeco94Pkt9inH8lqdbjcuHHDTcvrvF8o)
![photo no 5](https://drive.google.com/uc?export=view&id=1rFXNjKR6xHpBe0HFumVVjw8bZ5tguxAu)
![photo no 6](https://drive.google.com/uc?export=view&id=1bQaSdbLeOOp7LFOTDeDomkCS9jdzy_yT)
![photo no 7](https://drive.google.com/uc?export=view&id=1wY-w9IWVeve5Pn8qBDp6Kk3hf0WBMora)

### Hardware

###### PCB schematics and photos will be updated soon...
![photo no 1](https://drive.google.com/uc?export=view&id=1SfzOJhHkS16Ux5Els8MdVIpKw3K90oH7)