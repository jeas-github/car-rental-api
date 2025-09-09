# Car Rental Entity Relationship Diagram

erDiagram
    CLIENTS ||--o{ RENTALS : "pode ter muitas"
    CARS ||--o{ RENTALS : "pode ser alugado muitas vezes"
    RENTAL_POINTS }o--|| CARS : "possui muitos"
    RENTAL_POINTS ||--o{ RENTALS : "é ponto de retirada"
    RENTAL_POINTS ||--o{ RENTALS : "é ponto de devolução"

    CLIENTS {
        UUID client_id PK
        VARCHAR(100) name
        VARCHAR(14) cpf
        VARCHAR(100) email
        VARCHAR(20) phone
        DATE birth_date
        ENUM status "active|inactive"
        VARCHAR(255) password
        DATETIME created_at_date
        DATETIME updated_at_date
    }

    RENTAL_POINTS {
        UUID point_id PK
        VARCHAR(100) name
        DATETIME created_at_date
        DATETIME updated_at_date
    }

    CARS {
        UUID car_id PK
        VARCHAR(10) license_plate
        VARCHAR(50) brand
        VARCHAR(50) model
        YEAR year
        ENUM category "economic|sedan|suv|luxury|minivan"
        ENUM status "available|rented|maintenance|deactivated"
        FLOAT daily_rate
        UUID current_point_id FK
        DATETIME created_at_date
        DATETIME updated_at_date
    }

    RENTALS {
        UUID rental_id PK
        UUID client_id FK
        UUID car_id FK
        UUID pickup_point_id FK
        UUID return_point_id FK
        DATETIME pickup_datetime
        DATETIME return_datetime
        FLOAT estimated_value
        FLOAT final_value
        ENUM status "pending|active|completed|cancelled"
        DATETIME created_at_datetime
        DATETIME updated_at_datetime
    }
